import { createElement } from '../framework/render.js';

const createCategoryTemplate = (category) => `
  <div class="category-card">
    <div class="category-image category-${category.id}">
      <span class="category-label">${category.name}</span>
    </div>
  </div>
`;

const createClothingItemTemplate = (item) => `
  <div class="clothing-item-card">
    <div class="clothing-item-image" style="background-image: url('${item.image || ''}')">
      ${!item.image ? '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: var(--gray-500);">Изображение</div>' : ''}
    </div>
    <div class="clothing-item-info">
      <div class="clothing-item-name">${item.name}</div>
      <div class="clothing-item-details">
        ${item.color ? `Цвет: ${item.color}<br>` : ''}
        ${item.season ? `Сезон: ${item.season}` : ''}
      </div>
      <span class="clothing-item-category">${item.category}</span>
    </div>
  </div>
`;

const createCatalogTemplate = (categories, clothingItems) => `
  <section id="catalog" class="section catalog-section">
    <h2 class="section-title">
      Каталог Гардероба
    </h2>
    <p class="section-description">
      Выберите категорию, чтобы увидеть все вещи и добавить новые.
    </p>

    <div class="add-clothing-header">
      <button class="btn btn-primary add-clothing-btn" id="addClothingBtn">
        + Добавить новую одежду
      </button>
    </div>

    <div class="clothing-items-grid" id="clothingItemsGrid">
      ${clothingItems.map(createClothingItemTemplate).join('')}
    </div>

    <div class="categories-grid">
      ${categories.map(createCategoryTemplate).join('')}
    </div>
  </section>
`;

export default class CatalogComponent {
  constructor(categories, clothingItems, onAddClick) {
    this.categories = categories;
    this.clothingItems = clothingItems;
    this.onAddClick = onAddClick;
    this.element = null;
  }

  getTemplate() {
    return createCatalogTemplate(this.categories, this.clothingItems);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
      this.setListeners();
    }
    return this.element;
  }

  setListeners() {
    const addButton = this.element.querySelector('#addClothingBtn');
    if (addButton && this.onAddClick) {
      addButton.addEventListener('click', this.onAddClick);
    }
  }

  removeElement() {
    this.element = null;
  }
}