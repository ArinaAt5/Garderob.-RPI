import { createElement } from '../framework/render.js';

const createShoppingItemTemplate = (item, onRemove) => `
  <div class="shopping-card" data-id="${item.id}">
    <div class="shopping-item">
      <div class="shopping-image">
        ${item.image ? `<img src="${item.image}" alt="${item.name}">` : 'Фото'}
      </div>
      <div class="shopping-details">
        <p class="shopping-name">${item.name}</p>
        <p class="shopping-store">Магазин: ${item.store}</p>
        <p class="shopping-category">Категория: ${item.category}</p>
        ${item.priority ? `<p class="shopping-priority">Приоритет: ${item.priority}</p>` : ''}
        ${item.notes ? `<p class="shopping-notes">${item.notes}</p>` : ''}
        ${item.addedAt ? `<p class="shopping-date">Добавлено: ${new Date(item.addedAt).toLocaleDateString()}</p>` : ''}
      </div>
      <button class="delete-button" data-id="${item.id}">
        <svg class="delete-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
        </svg>
      </button>
    </div>
    <div class="shopping-actions">
      <button class="btn btn-secondary btn-small" data-action="bought">Куплено</button>
      <button class="btn btn-secondary btn-small" data-action="postpone">Отложить</button>
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

    <div class="shopping-stats">
      <div class="stat-item">
        <span class="stat-count">${items.length}</span>
        <span class="stat-label">Всего вещей</span>
      </div>
      <div class="stat-item">
        <span class="stat-count">${items.filter(i => i.priority === 'high').length}</span>
        <span class="stat-label">Высокий приоритет</span>
      </div>
      <div class="stat-item">
        <span class="stat-count">${items.filter(i => i.status === 'bought').length}</span>
        <span class="stat-label">Куплено</span>
      </div>
    </div>

    <div class="shopping-grid" id="shoppingItemsGrid">
      ${items.length > 0 
        ? items.map(item => createShoppingItemTemplate(item)).join('')
        : `
          <div class="empty-shopping-list">
            <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
            <h3>Шопинг-лист пуст</h3>
            <p>Добавьте вещи, которые хотите купить</p>
          </div>
        `
      }
    </div>

    <div class="shopping-input">
      <div class="input-group">
        <input type="text" placeholder="Название вещи..." class="shopping-input-field" id="shoppingName">
        <input type="text" placeholder="Магазин или ссылка..." class="shopping-input-field store-input" id="shoppingStore">
        <select class="shopping-input-field" id="shoppingCategory">
          <option value="">Категория</option>
          <option value="Верх">Верх</option>
          <option value="Низ">Низ</option>
          <option value="Обувь">Обувь</option>
          <option value="Аксессуары">Аксессуары</option>
          <option value="Верхняя одежда">Верхняя одежда</option>
          <option value="Другое">Другое</option>
        </select>
        <select class="shopping-input-field" id="shoppingPriority">
          <option value="">Приоритет</option>
          <option value="low">Низкий</option>
          <option value="medium">Средний</option>
          <option value="high">Высокий</option>
        </select>
      </div>
      <div class="input-group">
        <input type="text" placeholder="Заметки (необязательно)..." class="shopping-input-field notes-input" id="shoppingNotes">
        <input type="url" placeholder="Ссылка на фото..." class="shopping-input-field" id="shoppingImage">
      </div>
      <button class="btn btn-primary shopping-add-button" id="addShoppingItem">
        Добавить в список
      </button>
    </div>
  </section>
`;

export default class ShoppingListComponent {
  constructor(shoppingList, onAddItem, onRemoveItem) {
    this.shoppingList = shoppingList;
    this.onAddItem = onAddItem;
    this.onRemoveItem = onRemoveItem;
    this.element = null;
  }

  getTemplate() {
    return createShoppingListTemplate(this.shoppingList);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
      this.setListeners();
    }
    return this.element;
  }

  setListeners() {
    // Кнопка добавления
    const addButton = this.element.querySelector('#addShoppingItem');
    addButton.addEventListener('click', () => this.handleAddItem());

    // Поле ввода названия - добавление по Enter
    const nameInput = this.element.querySelector('#shoppingName');
    nameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.handleAddItem();
      }
    });

    // Удаление элементов
    const deleteButtons = this.element.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const itemId = parseInt(e.currentTarget.dataset.id);
        if (this.onRemoveItem) {
          this.onRemoveItem(itemId);
        }
      });
    });

    // Действия с элементами
    const actionButtons = this.element.querySelectorAll('[data-action]');
    actionButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const action = e.currentTarget.dataset.action;
        const itemId = parseInt(e.currentTarget.closest('.shopping-card').dataset.id);
        this.handleItemAction(itemId, action);
      });
    });
  }

  handleAddItem() {
    const nameInput = this.element.querySelector('#shoppingName');
    const storeInput = this.element.querySelector('#shoppingStore');
    const categoryInput = this.element.querySelector('#shoppingCategory');
    const priorityInput = this.element.querySelector('#shoppingPriority');
    const notesInput = this.element.querySelector('#shoppingNotes');
    const imageInput = this.element.querySelector('#shoppingImage');

    const name = nameInput.value.trim();
    const store = storeInput.value.trim();
    const category = categoryInput.value;
    const priority = priorityInput.value;

    if (!name) {
      alert('Пожалуйста, введите название вещи');
      nameInput.focus();
      return;
    }

    if (!store) {
      alert('Пожалуйста, укажите магазин или ссылку');
      storeInput.focus();
      return;
    }

    const newItem = {
      name,
      store,
      category: category || 'Другое',
      priority: priority || 'medium',
      notes: notesInput.value.trim(),
      image: imageInput.value.trim()
    };

    if (this.onAddItem) {
      this.onAddItem(newItem);
      
      // Очистка полей
      nameInput.value = '';
      storeInput.value = '';
      categoryInput.value = '';
      priorityInput.value = '';
      notesInput.value = '';
      imageInput.value = '';
      
      // Фокус на первое поле
      nameInput.focus();
    }
  }

  handleItemAction(itemId, action) {
    // Здесь можно добавить логику для действий "куплено", "отложить" и т.д.
    console.log(`Action ${action} on item ${itemId}`);
    
    if (action === 'bought') {
      if (this.onRemoveItem) {
        if (confirm('Пометить как купленное?')) {
          this.onRemoveItem(itemId);
        }
      }
    }
  }

  removeElement() {
    this.element = null;
  }
}