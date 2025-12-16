import { createElement } from '../framework/render.js';

const createShoppingItemTemplate = (item) => `
  <div class="shopping-card" data-id="${item.id}" data-status="${item.status || 'active'}" data-priority="${item.priority}">
    ${item.status === 'bought' ? '<div class="bought-overlay">Куплено ✓</div>' : ''}
    <div class="shopping-item">
      <div class="shopping-image">
        ${item.image ? `<img src="${item.image}" alt="${item.name}">` : 'Фото'}
      </div>
      <div class="shopping-details">
        <p class="shopping-name ${item.status === 'bought' ? 'bought-text' : ''}">${item.name}</p>
        <p class="shopping-store">Магазин: ${item.store}</p>
        <p class="shopping-category">Категория: ${item.category}</p>
        ${item.priority ? `<span class="priority-badge priority-${item.priority}">${getPriorityText(item.priority)}</span>` : ''}
        ${item.price ? `<p class="shopping-price">Цена: ${item.price} руб.</p>` : ''}
        ${item.notes ? `<p class="shopping-notes">${item.notes}</p>` : ''}
        ${item.addedAt ? `<p class="shopping-date">Добавлено: ${new Date(item.addedAt).toLocaleDateString()}</p>` : ''}
        ${item.boughtAt ? `<p class="shopping-date-bought">Куплено: ${new Date(item.boughtAt).toLocaleDateString()}</p>` : ''}
      </div>
      <button class="delete-button" data-id="${item.id}">
        <svg class="delete-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
        </svg>
      </button>
    </div>
    <div class="shopping-actions">
      ${item.status !== 'bought' 
        ? `<button class="btn btn-success btn-small" data-action="bought">Куплено</button>`
        : `<button class="btn btn-secondary btn-small" data-action="restore">Вернуть в список</button>`
      }
      <button class="btn btn-warning btn-small" data-action="${item.status === 'postponed' ? 'restore' : 'postpone'}">
        ${item.status === 'postponed' ? 'Вернуть' : 'Отложить'}
      </button>
      <button class="btn btn-info btn-small" data-action="edit">Редактировать</button>
    </div>
  </div>
`;

const getPriorityText = (priority) => {
  switch(priority) {
    case 'high': return 'Высокий';
    case 'medium': return 'Средний';
    case 'low': return 'Низкий';
    default: return priority;
  }
};

const createShoppingListTemplate = (items, currentFilter = 'all') => {
  // Фильтрация элементов на основе текущего фильтра
  const filteredItems = items.filter(item => {
    switch(currentFilter) {
      case 'active': return !item.status || item.status === 'active';
      case 'bought': return item.status === 'bought';
      case 'postponed': return item.status === 'postponed';
      case 'high': return item.priority === 'high';
      default: return true; 
    }
  });

  // Статистика
  const totalItems = items.length;
  const highPriorityItems = items.filter(i => i.priority === 'high').length;
  const boughtItems = items.filter(i => i.status === 'bought').length;
  const postponedItems = items.filter(i => i.status === 'postponed').length;
  const activeItems = items.filter(i => !i.status || i.status === 'active').length;

  return `
    <section id="shopping" class="section shopping-section">
      <div class="section-header">
        <div>
          <h2 class="section-title">
            Шопинг-лист
          </h2>
          <p class="section-description">
            Список вещей, которые нужно купить, чтобы дополнить гардероб.
          </p>
        </div>
      </div>

      <div class="add-item-button-container">
        <button class="btn btn-brown btn-large" id="showAddForm">
          <svg class="plus-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Добавить вещь
        </button>
      </div>

      <div class="shopping-stats">
        <div class="stat-item ${currentFilter === 'all' ? 'active' : ''}" data-filter="all">
          <span class="stat-count">${totalItems}</span>
          <span class="stat-label">Всего вещей</span>
        </div>
        <div class="stat-item ${currentFilter === 'active' ? 'active' : ''}" data-filter="active">
          <span class="stat-count">${activeItems}</span>
          <span class="stat-label">Активные</span>
        </div>
        <div class="stat-item ${currentFilter === 'high' ? 'active' : ''}" data-filter="high">
          <span class="stat-count">${highPriorityItems}</span>
          <span class="stat-label">Высокий приоритет</span>
        </div>
        <div class="stat-item ${currentFilter === 'bought' ? 'active' : ''}" data-filter="bought">
          <span class="stat-count">${boughtItems}</span>
          <span class="stat-label">Куплено</span>
        </div>
        <div class="stat-item ${currentFilter === 'postponed' ? 'active' : ''}" data-filter="postponed">
          <span class="stat-count">${postponedItems}</span>
          <span class="stat-label">Отложено</span>
        </div>
      </div>

      <div class="shopping-filters">
        <button class="filter-btn ${currentFilter === 'all' ? 'active' : ''}" data-filter="all">Все</button>
        <button class="filter-btn ${currentFilter === 'active' ? 'active' : ''}" data-filter="active">Активные</button>
        <button class="filter-btn ${currentFilter === 'high' ? 'active' : ''}" data-filter="high">Высокий приоритет</button>
        <button class="filter-btn ${currentFilter === 'postponed' ? 'active' : ''}" data-filter="postponed">Отложенные</button>
        <button class="filter-btn ${currentFilter === 'bought' ? 'active' : ''}" data-filter="bought">Купленные</button>
      </div>

      <div class="shopping-input hidden" id="addItemForm">
        <h3 class="input-title">Добавить новую вещь</h3>
        <div class="input-group">
          <input type="text" placeholder="Название вещи..." class="shopping-input-field" id="shoppingName" required>
          <input type="text" placeholder="Магазин или ссылка..." class="shopping-input-field store-input" id="shoppingStore" required>
        </div>
        <div class="input-group">
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
            <option value="medium">Средний приоритет</option>
            <option value="high">Высокий приоритет</option>
            <option value="low">Низкий приоритет</option>
          </select>
          <input type="number" placeholder="Примерная цена..." class="shopping-input-field" id="shoppingPrice" min="0" step="0.01">
        </div>
        <div class="input-group">
          <input type="text" placeholder="Заметки (необязательно)..." class="shopping-input-field notes-input" id="shoppingNotes">
          <input type="url" placeholder="Ссылка на фото..." class="shopping-input-field" id="shoppingImage">
        </div>
        <div class="input-actions">
          <button class="btn btn-secondary" id="cancelAdd">Отмена</button>
          <button class="btn btn-brown" id="addShoppingItem">
            Добавить в список
          </button>
        </div>
      </div>

      <div class="shopping-grid" id="shoppingItemsGrid">
        ${filteredItems.length > 0 
          ? filteredItems.map(item => createShoppingItemTemplate(item)).join('')
          : `
            <div class="empty-shopping-list">
              <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              <h3>${currentFilter === 'bought' ? 'Нет купленных вещей' : 
                    currentFilter === 'postponed' ? 'Нет отложенных вещей' :
                    currentFilter === 'high' ? 'Нет вещей с высоким приоритетом' :
                    currentFilter === 'active' ? 'Нет активных вещей' :
                    'Шопинг-лист пуст'}</h3>
              <p>${currentFilter === 'bought' 
                ? 'Здесь будут отображаться купленные вами вещи' 
                : currentFilter === 'postponed' ? 'Здесь будут отложенные вещи'
                : currentFilter === 'high' ? 'Здесь будут вещи с высоким приоритетом'
                : currentFilter === 'active' ? 'Здесь будут активные вещи для покупки'
                : 'Добавьте вещи, которые хотите купить'
              }</p>
              ${currentFilter !== 'all' 
                ? `<button class="btn btn-outline show-all-btn" data-filter="all">Показать все вещи</button>`
                : ''
              }
            </div>
          `
        }
      </div>
    </section>
  `;
};

export default class ShoppingListComponent {
  constructor(shoppingList, onUpdateItem, onRemoveItem) {
    this.shoppingList = shoppingList || [];
    this.onUpdateItem = onUpdateItem;
    this.onRemoveItem = onRemoveItem;
    this.currentFilter = 'all';
    this.element = null;
    this.isEditing = false;
    this.editingItemId = null;
  }

  getTemplate() {
    return createShoppingListTemplate(this.shoppingList, this.currentFilter);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
      this.setListeners();
    }
    return this.element;
  }

  setListeners() {
    // Кнопка показать/скрыть форму добавления
    const showAddFormBtn = this.element.querySelector('#showAddForm');
    const addItemForm = this.element.querySelector('#addItemForm');
    const cancelAddBtn = this.element.querySelector('#cancelAdd');
    
    showAddFormBtn?.addEventListener('click', () => {
      this.clearForm();
      addItemForm.classList.toggle('hidden');
    });
    
    cancelAddBtn?.addEventListener('click', () => {
      addItemForm.classList.add('hidden');
      this.clearForm();
    });

    // Кнопка добавления/сохранения
    const addButton = this.element.querySelector('#addShoppingItem');
    addButton?.addEventListener('click', () => this.handleSaveItem());

    // Добавление по Enter в поле названия
    const nameInput = this.element.querySelector('#shoppingName');
    nameInput?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.handleSaveItem();
      }
    });

    // Фильтры в статистике
    const statItems = this.element.querySelectorAll('.stat-item');
    statItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const filter = e.currentTarget.dataset.filter;
        if (filter) {
          this.setFilter(filter);
        }
      });
    });

    // Фильтры в панели кнопок
    const filterButtons = this.element.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const filter = e.currentTarget.dataset.filter;
        if (filter) {
          this.setFilter(filter);
        }
      });
    });

    // Кнопка "показать все" в пустом списке
    const showAllBtn = this.element.querySelector('.show-all-btn');
    showAllBtn?.addEventListener('click', () => {
      this.setFilter('all');
    });

    // Удаление элементов (делегирование событий)
    this.element.addEventListener('click', (e) => {
      if (e.target.closest('.delete-button')) {
        const deleteButton = e.target.closest('.delete-button');
        const itemId = parseInt(deleteButton.dataset.id);
        if (this.onRemoveItem) {
          if (confirm('Удалить эту вещь из списка?')) {
            this.onRemoveItem(itemId);
          }
        }
      }
      
      // Обработка действий с элементами
      if (e.target.closest('[data-action]')) {
        const actionButton = e.target.closest('[data-action]');
        const action = actionButton.dataset.action;
        const itemCard = actionButton.closest('.shopping-card');
        const itemId = parseInt(itemCard.dataset.id);
        this.handleItemAction(itemId, action);
      }
    });
  }

  setFilter(filter) {
    this.currentFilter = filter;
    this.rerender();
  }

  handleSaveItem() {
    const nameInput = this.element.querySelector('#shoppingName');
    const storeInput = this.element.querySelector('#shoppingStore');
    const categoryInput = this.element.querySelector('#shoppingCategory');
    const priorityInput = this.element.querySelector('#shoppingPriority');
    const notesInput = this.element.querySelector('#shoppingNotes');
    const imageInput = this.element.querySelector('#shoppingImage');
    const priceInput = this.element.querySelector('#shoppingPrice');
    const addButton = this.element.querySelector('#addShoppingItem');
    const form = this.element.querySelector('#addItemForm');

    const name = nameInput.value.trim();
    const store = storeInput.value.trim();
    const category = categoryInput.value || 'Другое';
    const priority = priorityInput.value || 'medium';
    const notes = notesInput.value.trim();
    const image = imageInput.value.trim();
    const price = priceInput.value ? parseFloat(priceInput.value) : null;

    if (!name) {
      this.showError(nameInput, 'Введите название вещи');
      return;
    }

    if (!store) {
      this.showError(storeInput, 'Укажите магазин или ссылку');
      return;
    }

    if (this.isEditing && this.editingItemId) {
      // Редактирование существующего элемента
      const existingItem = this.shoppingList.find(item => item.id === this.editingItemId);
      if (existingItem) {
        const updatedItem = {
          ...existingItem,
          name,
          store,
          category,
          priority,
          notes,
          image,
          price
        };

        if (this.onUpdateItem) {
          this.onUpdateItem(updatedItem);
        }
      }
    } else {
      // Добавление нового элемента
      const newItem = {
        id: Date.now(), // Временный ID
        name,
        store,
        category,
        priority,
        notes,
        image,
        price,
        status: 'active',
        addedAt: new Date().toISOString()
      };

      if (this.onUpdateItem) {
        this.onUpdateItem(newItem);
      }
    }

    // Скрываем форму и очищаем
    form.classList.add('hidden');
    this.clearForm();
  }

  handleItemAction(itemId, action) {
    const item = this.shoppingList.find(i => i.id === itemId);
    if (!item) return;

    let updatedItem = { ...item };

    switch(action) {
      case 'bought':
        updatedItem.status = 'bought';
        updatedItem.boughtAt = new Date().toISOString();
        break;
      case 'postpone':
        updatedItem.status = 'postponed';
        break;
      case 'restore':
        updatedItem.status = 'active';
        delete updatedItem.boughtAt;
        break;
      case 'edit':
        this.openEditForm(item);
        return;
    }

    if (this.onUpdateItem) {
      this.onUpdateItem(updatedItem);
    }
  }

  openEditForm(item) {
    const form = this.element.querySelector('#addItemForm');
    const title = this.element.querySelector('.input-title');
    const nameInput = this.element.querySelector('#shoppingName');
    const storeInput = this.element.querySelector('#shoppingStore');
    const categoryInput = this.element.querySelector('#shoppingCategory');
    const priorityInput = this.element.querySelector('#shoppingPriority');
    const notesInput = this.element.querySelector('#shoppingNotes');
    const imageInput = this.element.querySelector('#shoppingImage');
    const priceInput = this.element.querySelector('#shoppingPrice');
    const addButton = this.element.querySelector('#addShoppingItem');

    // Устанавливаем флаги редактирования
    this.isEditing = true;
    this.editingItemId = item.id;

    // Заполняем форму данными
    title.textContent = 'Редактировать вещь';
    nameInput.value = item.name;
    storeInput.value = item.store;
    categoryInput.value = item.category || '';
    priorityInput.value = item.priority || 'medium';
    notesInput.value = item.notes || '';
    imageInput.value = item.image || '';
    priceInput.value = item.price || '';
    
    // Меняем кнопку
    addButton.textContent = 'Сохранить изменения';
    
    // Показываем форму
    form.classList.remove('hidden');
    
    // Фокус на первое поле
    nameInput.focus();
  }

  clearForm() {
    const form = this.element.querySelector('#addItemForm');
    if (!form) return;

    const inputs = form.querySelectorAll('input, select');
    const addButton = this.element.querySelector('#addShoppingItem');
    const title = this.element.querySelector('.input-title');
    
    inputs.forEach(input => {
      if (input.type !== 'button' && input.type !== 'submit') {
        input.value = '';
      }
    });
    
    if (addButton) {
      addButton.textContent = 'Добавить в список';
    }
    
    if (title) {
      title.textContent = 'Добавить новую вещь';
    }
    
    // Сбрасываем флаги редактирования
    this.isEditing = false;
    this.editingItemId = null;
  }

  showError(input, message) {
    alert(message);
    input.focus();
    input.classList.add('error');
    setTimeout(() => input.classList.remove('error'), 2000);
  }

  rerender() {
    if (!this.element) return;
    
    const newElement = createElement(this.getTemplate());
    const oldElement = this.element;
    
    // Сохраняем родительский элемент
    const parent = oldElement.parentElement;
    
    // Заменяем элемент
    if (parent) {
      parent.replaceChild(newElement, oldElement);
    }
    
    // Обновляем ссылку и слушатели
    this.element = newElement;
    this.setListeners();
  }

  update(shoppingList) {
    this.shoppingList = shoppingList || [];
    this.rerender();
  }

  removeElement() {
    this.element = null;
  }
}