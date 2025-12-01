import HeaderComponent from '../view/header-component.js';
import CatalogComponent from '../view/catalog-component.js';
import ClothingFormComponent from '../view/clothing-form-component.js';
import OutfitsComponent from '../view/outfits-component.js';
import GalleryComponent from '../view/gallery-component.js';
import ShoppingListComponent from '../view/shopping-list-component.js';
import FooterComponent from '../view/footer-component.js';
import { render } from '../framework/render.js';

export default class WardrobePresenter {
  constructor(model) {
    this.model = model;
    this.headerComponent = new HeaderComponent();
    this.clothingFormComponent = null;
    this.catalogComponent = null;
    this.outfitsComponent = null;
    this.galleryComponent = null;
    this.shoppingListComponent = null;
    this.footerComponent = null;
    
    this.model.addObserver(this.handleModelChange.bind(this));
  }

  init(container) {
    this.container = container;
    this.renderComponents();
  }

  renderComponents() {
    // Очищаем контейнер
    this.container.innerHTML = '';
    
    // Рендерим компоненты
    render(this.headerComponent, this.container);
    
    this.catalogComponent = new CatalogComponent(
      this.model.categories,
      this.model.clothingItems,
      () => this.openAddClothingForm()
    );
    render(this.catalogComponent, this.container);
    
    this.clothingFormComponent = new ClothingFormComponent(
      this.handleFormSubmit.bind(this),
      () => this.closeAddClothingForm()
    );
    render(this.clothingFormComponent, this.container);
    
    this.outfitsComponent = new OutfitsComponent(this.model.outfits);
    render(this.outfitsComponent, this.container);
    
    this.galleryComponent = new GalleryComponent(this.model.galleryImages);
    render(this.galleryComponent, this.container);
    
    this.shoppingListComponent = new ShoppingListComponent(this.model.shoppingList);
    render(this.shoppingListComponent, this.container);
    
    this.footerComponent = new FooterComponent();
    render(this.footerComponent, this.container);
  }

  openAddClothingForm() {
    if (this.clothingFormComponent) {
      this.clothingFormComponent.openModal();
    }
  }

  closeAddClothingForm() {
    if (this.clothingFormComponent) {
      this.clothingFormComponent.closeModal();
    }
  }

  handleFormSubmit(formData) {
    const newItem = {
      name: formData.clothingName,
      category: formData.clothingCategory,
      color: formData.clothingColor,
      season: formData.clothingSeason,
      image: formData.clothingImage
    };
    this.model.addClothingItem(newItem);
  }

  handleModelChange(event, payload) {
    switch (event) {
      case 'clothing-item-added':
        this.updateCatalog();
        break;
      case 'clothing-items-updated':
        this.updateCatalog();
        break;
    }
  }

  updateCatalog() {
    // Удаляем старый каталог
    const catalogElement = this.catalogComponent.getElement();
    catalogElement.remove();
    this.catalogComponent.removeElement();
    
    // Создаем новый каталог
    this.catalogComponent = new CatalogComponent(
      this.model.categories,
      this.model.clothingItems,
      () => this.openAddClothingForm()
    );
    
    // Вставляем после заголовка
    const headerElement = this.headerComponent.getElement();
    headerElement.after(this.catalogComponent.getElement());
  }
}