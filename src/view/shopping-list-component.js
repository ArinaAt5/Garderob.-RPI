import { createElement } from '../framework/render.js';

const createShoppingItemTemplate = (item) => `
  <div class="shopping-card">
    <div class="shopping-item">
      <div class="shopping-image">
        Фото
      </div>
      <div class="shopping-details">
        <p class="shopping-name">${item.name}</p>
        <p class="shopping-store">Магазин: ${item.store}</p>
        <p class="shopping-category">Категория: ${item.category}</p>
      </div>
      <button class="delete-button">
        <svg class="delete-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
        </svg>
      </button>
    </div>
  </div>
`;

const createShoppingListTemplate = (items) => `
  <section id="shopping" class="section shopping-section">
    <h2 class="section-title">
      Шопинг-лист
    </h2>
    <p class="section-description">
      Список вещей, которые нужно купить, чтобы дополнить гардероб.
    </p>

    <div class="shopping-grid">
      ${items.map(createShoppingItemTemplate).join('')}
    </div>

    <div class="shopping-input">
      <input type="text" placeholder="Название вещи..." class="shopping-input-field">
      <input type="text" placeholder="Магазин или ссылка..." class="shopping-input-field store-input">
      <button class="btn btn-primary shopping-add-button">
        Добавить в список
      </button>
    </div>
  </section>
`;

export default class ShoppingListComponent {
  constructor(items) {
    this.items = items;
  }

  getTemplate() {
    return createShoppingListTemplate(this.items);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}