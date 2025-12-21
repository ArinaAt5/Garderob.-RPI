import HeaderComponent from '../view/header-component.js';
import CatalogComponent from '../view/catalog-component.js';
import ClothingFormComponent from '../view/clothing-form-component.js';
import OutfitsComponent from '../view/outfits-component.js';
import GalleryComponent from '../view/gallery-component.js';
import ShoppingListComponent from '../view/shopping-list-component.js';
import FooterComponent from '../view/footer-component.js';
import { render } from '../framework/render.js';
import { UserAction, UpdateType } from '../const.js';

export default class WardrobePresenter {
  constructor(model) {
    this.model = model;
    this.headerComponent = null;
    this.clothingFormComponent = null;
    this.catalogComponent = null;
    this.outfitsComponent = null;
    this.galleryComponent = null;
    this.shoppingListComponent = null;
    this.footerComponent = null;
    this.container = null;
    
    this.model.addObserver(this.handleModelChange.bind(this));
  }

  async init(container) {
    this.container = container;
    
    // Сначала рендерим только хедер
    this.headerComponent = new HeaderComponent();
    render(this.headerComponent, this.container);
    
    // Ждем загрузки данных
    await this.model.init();
  }

  renderComponents() {
    // Проверяем, что контейнер существует
    if (!this.container) {
      console.error('Контейнер не определен в презентере');
      return;
    }
    
    // Очищаем контейнер (кроме хедера)
    const headerElement = this.headerComponent.getElement();
    const elementsToRemove = Array.from(this.container.children)
      .filter(child => child !== headerElement);
    
    elementsToRemove.forEach(element => element.remove());
    
    // Каталог с фильтрами
    this.catalogComponent = new CatalogComponent(
      this.model.categories,
      this.model.filteredClothingItems,
      this.model.seasons,
      this.model.currentFilter,
      () => this.openAddClothingForm(),
      this.handleFilterChange.bind(this),
      this.handleDeleteClothingItem.bind(this)
    );
    render(this.catalogComponent, this.container);
    
    // Форма добавления одежды
    this.clothingFormComponent = new ClothingFormComponent(
      this.model.categories,
      this.model.seasons,
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

  async handleClothingFormSubmit(formData) {
    try {
      const newItem = {
        name: formData.clothingName,
        category: formData.clothingCategory,
        color: formData.clothingColor,
        season: formData.clothingSeason,
        image: formData.clothingImage
      };
      
      await this.model.addClothingItem(newItem);
      this.showNotification('Одежда успешно добавлена в гардероб!');
      
    } catch (error) {
      console.error('Ошибка при добавлении одежды:', error);
      this.showNotification('Ошибка при добавлении одежды. Попробуйте снова.', true);
    }
  }

  async handleDeleteClothingItem(itemId) {
    try {
      if (confirm('Вы уверены, что хотите удалить эту вещь из гардероба?')) {
        await this.model.deleteClothingItem(itemId);
        this.showNotification('Вещь удалена из гардероба');
      }
    } catch (error) {
      console.error('Ошибка при удалении одежды:', error);
      this.showNotification('Ошибка при удалении одежды. Попробуйте снова.', true);
    }
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

  handleAddShoppingItem(itemData) {
    this.model.addShoppingItem(itemData);
    this.showNotification('Вещь добавлена в шопинг-лист!');
  }

  handleRemoveShoppingItem(itemId) {
    this.model.removeShoppingItem(itemId);
    this.showNotification('Вещь удалена из шопинг-листа');
  }

  handleModelChange(event, payload) {
    if (!this.container && event !== UpdateType.INIT) {
      console.warn(`Игнорируем событие ${event}, так как контейнер не установлен`);
      return;
    }
    
    switch (event) {
      // Инициализация приложения
      case UpdateType.INIT:
        if (this.container) {
          this.renderComponents();
        } else {
          console.warn('Получено событие INIT, но контейнер еще не установлен');
        }
        break;
        
      // Обработка событий от API
      case UserAction.ADD_CLOTHING:
      case UserAction.UPDATE_CLOTHING:
      case UserAction.DELETE_CLOTHING:
        if (this.container) {
          this.updateCatalog();
        }
        break;
        
      // Обработка фильтрации - ИСПРАВЛЕНО: теперь обновляет отфильтрованные данные
      case 'filtered-items-updated':
        if (this.container && this.catalogComponent) {
          this.catalogComponent.updateClothingItems(payload);
        }
        break;
        
      case 'filter-changed':
        // Обновляем только фильтры, одежда обновится через filtered-items-updated
        if (this.container && this.catalogComponent) {
          this.catalogComponent.updateFilters(
            this.model.categories,
            this.model.seasons,
            this.model.currentFilter
          );
        }
        break;

      case 'clothing-item-added':
        if (this.container) {
          this.updateCatalog();
        }
        break;
        
      case 'shopping-item-added':
      case 'shopping-item-removed':
      case 'shopping-list-updated':
        if (this.container) {
          this.updateShoppingList();
        }
        break;
        
      // Обработка изменений категорий, сезонов и т.д.
      case 'categories-updated':
      case 'seasons-updated':
        if (this.container && this.catalogComponent) {
          this.catalogComponent.updateFilters(
            this.model.categories,
            this.model.seasons,
            this.model.currentFilter
          );
        }
        break;
        
      case 'outfits-updated':
        if (this.container) {
          this.updateOutfits();
        }
        break;
        
      case 'gallery-updated':
        if (this.container) {
          this.updateGallery();
        }
        break;

      default:
        console.log(`Необработанное событие: ${event}`, payload);
    }
  }

  updateCatalog() {
    if (!this.catalogComponent || !this.container) return;
    
    const catalogElement = this.catalogComponent.getElement();
    if (!catalogElement) return;
    
    catalogElement.remove();
    this.catalogComponent.removeElement();
    
    this.catalogComponent = new CatalogComponent(
      this.model.categories,
      this.model.filteredClothingItems,
      this.model.seasons,
      this.model.currentFilter,
      () => this.openAddClothingForm(),
      this.handleFilterChange.bind(this),
      this.handleDeleteClothingItem.bind(this)
    );
    
    const headerElement = this.headerComponent.getElement();
    if (headerElement) {
      headerElement.after(this.catalogComponent.getElement());
    } else {
      render(this.catalogComponent, this.container);
    }
  }

  updateShoppingList() {
    if (!this.shoppingListComponent || !this.container) return;
    
    const shoppingListElement = this.shoppingListComponent.getElement();
    if (!shoppingListElement) return;
    
    shoppingListElement.remove();
    this.shoppingListComponent.removeElement();
    
    this.shoppingListComponent = new ShoppingListComponent(
      this.model.shoppingList,
      this.handleAddShoppingItem.bind(this),
      this.handleRemoveShoppingItem.bind(this)
    );

    const footerElement = this.footerComponent?.getElement();
    if (footerElement) {
      footerElement.before(this.shoppingListComponent.getElement());
    } else {
      render(this.shoppingListComponent, this.container);
    }
  }

  updateOutfits() {
    if (!this.outfitsComponent || !this.container) return;
    
    const outfitsElement = this.outfitsComponent.getElement();
    if (!outfitsElement) return;
    
    outfitsElement.remove();
    this.outfitsComponent.removeElement();
    
    this.outfitsComponent = new OutfitsComponent(this.model.outfits);
    
    const catalogElement = this.catalogComponent?.getElement();
    if (catalogElement) {
      catalogElement.after(this.outfitsComponent.getElement());
    } else {
      render(this.outfitsComponent, this.container);
    }
  }

  updateGallery() {
    if (!this.galleryComponent || !this.container) return;
    
    const galleryElement = this.galleryComponent.getElement();
    if (!galleryElement) return;
    
    galleryElement.remove();
    this.galleryComponent.removeElement();
    
    this.galleryComponent = new GalleryComponent(this.model.galleryImages);
    
    const outfitsElement = this.outfitsComponent?.getElement();
    if (outfitsElement) {
      outfitsElement.after(this.galleryComponent.getElement());
    } else {
      render(this.galleryComponent, this.container);
    }
  }

  showNotification(message, isError = false) {
    if (!document.body) return;
    
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${isError ? '#dc2626' : 'var(--primary-brown)'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      z-index: 1001;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      font-weight: 500;
      min-width: 250px;
      max-width: 300px;
      word-break: break-word;
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
    if (!this.container) return;
    
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