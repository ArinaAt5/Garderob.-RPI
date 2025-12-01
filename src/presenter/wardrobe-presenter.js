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
    this.container.innerHTML = '';
    
    // Хедер
    render(this.headerComponent, this.container);
    
    // Каталог с фильтрами
    this.catalogComponent = new CatalogComponent(
      this.model.categories,
      this.model.filteredClothingItems,
      this.model.seasons,
      this.model.currentFilter,
      () => this.openAddClothingForm(),
      this.handleFilterChange.bind(this)
    );
    render(this.catalogComponent, this.container);
    
    // Форма добавления одежды
    this.clothingFormComponent = new ClothingFormComponent(
      this.handleClothingFormSubmit.bind(this),
      () => this.closeAddClothingForm()
    );
    render(this.clothingFormComponent, this.container);
    
    // Комбинации
    this.outfitsComponent = new OutfitsComponent(this.model.outfits);
    render(this.outfitsComponent, this.container);
    
    // Галерея
    this.galleryComponent = new GalleryComponent(this.model.galleryImages);
    render(this.galleryComponent, this.container);
    
    // Шопинг-лист
    this.shoppingListComponent = new ShoppingListComponent(
      this.model.shoppingList,
      this.handleAddShoppingItem.bind(this),
      this.handleRemoveShoppingItem.bind(this)
    );
    render(this.shoppingListComponent, this.container);
    
    // Футер
    this.footerComponent = new FooterComponent();
    render(this.footerComponent, this.container);
  }

  handleFilterChange(filterChanges) {
    const newFilter = {
      ...this.model.currentFilter,
      ...filterChanges
    };
    this.model.setFilter(
      newFilter.category,
      newFilter.season,
      newFilter.searchQuery
    );
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

  handleClothingFormSubmit(formData) {
    const newItem = {
      name: formData.clothingName,
      category: formData.clothingCategory,
      color: formData.clothingColor,
      season: formData.clothingSeason,
      image: formData.clothingImage
    };
    this.model.addClothingItem(newItem);
    
    // Показываем уведомление (опционально)
    this.showNotification('Одежда успешно добавлена в гардероб!');
  }

  handleAddShoppingItem(itemData) {
    this.model.addShoppingItem(itemData);
    
    // Показываем уведомление (опционально)
    this.showNotification('Вещь добавлена в шопинг-лист!');
  }

  handleRemoveShoppingItem(itemId) {
    this.model.removeShoppingItem(itemId);
    
    // Показываем уведомление (опционально)
    this.showNotification('Вещь удалена из шопинг-листа');
  }

  handleModelChange(event, payload) {
    switch (event) {
      // Обработка изменений в каталоге
      case 'clothing-item-added':
      case 'filtered-items-updated':
        this.updateCatalog();
        break;
        
      case 'filter-changed':
        this.updateCatalog();
        break;

      case 'shopping-item-added':
      case 'shopping-item-removed':
      case 'shopping-list-updated':
        this.updateShoppingList();
        break;

      default:
        console.log(`Необработанное событие: ${event}`, payload);
    }
  }

  updateCatalog() {
    if (!this.catalogComponent) return;
    
    const catalogElement = this.catalogComponent.getElement();
    catalogElement.remove();
    this.catalogComponent.removeElement();
    
    this.catalogComponent = new CatalogComponent(
      this.model.categories,
      this.model.filteredClothingItems,
      this.model.seasons,
      this.model.currentFilter,
      () => this.openAddClothingForm(),
      this.handleFilterChange.bind(this)
    );
    
    const headerElement = this.headerComponent.getElement();
    headerElement.after(this.catalogComponent.getElement());
  }

  updateShoppingList() {
    if (!this.shoppingListComponent) return;
    
    const shoppingListElement = this.shoppingListComponent.getElement();
    shoppingListElement.remove();
    this.shoppingListComponent.removeElement();
    
    this.shoppingListComponent = new ShoppingListComponent(
      this.model.shoppingList,
      this.handleAddShoppingItem.bind(this),
      this.handleRemoveShoppingItem.bind(this)
    );

    const footerElement = this.footerComponent.getElement();
    footerElement.before(this.shoppingListComponent.getElement());
  }

  showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--primary-brown);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      z-index: 1001;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      font-weight: 500;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);

    setTimeout(() => notification.style.transform = 'translateX(0)', 100);

    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

 
  refreshAllComponents() {
    const catalogElement = this.catalogComponent?.getElement();
    const shoppingElement = this.shoppingListComponent?.getElement();
    const outfitsElement = this.outfitsComponent?.getElement();
    const galleryElement = this.galleryComponent?.getElement();
    
    if (catalogElement) catalogElement.remove();
    if (shoppingElement) shoppingElement.remove();
    if (outfitsElement) outfitsElement.remove();
    if (galleryElement) galleryElement.remove();
    
    this.catalogComponent?.removeElement();
    this.shoppingListComponent?.removeElement();
    this.outfitsComponent?.removeElement();
    this.galleryComponent?.removeElement();
    this.clothingFormComponent?.removeElement();
    
    this.renderComponents();
  }
}