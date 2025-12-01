import { createElement } from '../framework/render.js';

const createCategoryTemplate = (category, isActive) => `
  <div class="category-card ${isActive ? 'active' : ''}" data-category="${category.id}">
    <div class="category-image category-${category.id}">
      <span class="category-label">${category.name}</span>
    </div>
  </div>
`;

const createClothingItemTemplate = (item) => `
  <div class="clothing-item-card" data-id="${item.id}" data-category="${item.category}" data-season="${item.season}">
    <div class="clothing-item-image" style="background-image: url('${item.image || ''}')">
      ${!item.image ? '<div class="no-image">Изображение</div>' : ''}
      <div class="clothing-item-overlay">
        <span class="clothing-item-name">${item.name}</span>
        ${item.color ? `<span class="clothing-item-color">${item.color}</span>` : ''}
      </div>
    </div>
    <div class="clothing-item-badge">
      <span class="clothing-item-category">${getCategoryName(item.category)}</span>
      ${item.season ? `<span class="clothing-item-season">${item.season}</span>` : ''}
    </div>
  </div>
`;

const createFilterControlsTemplate = (categories, seasons, currentFilter, itemsCount) => `
  <div class="catalog-filters">
    <div class="filter-header">
      <h3 class="filter-title">Фильтрация одежды</h3>
      <div class="filter-stats">
        <span class="stats-count">Найдено: ${itemsCount} вещей</span>
      </div>
    </div>
    
    <div class="filter-controls">
      <!-- Поиск -->
      <div class="filter-group">
        <input 
          type="text" 
          class="search-input" 
          placeholder="Поиск по названию или цвету..."
          value="${currentFilter.searchQuery || ''}"
        />
        <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
      
      <!-- Фильтр по категориям -->
      <div class="filter-group">
        <select class="filter-select" id="categoryFilter">
          <option value="all" ${currentFilter.category === 'all' ? 'selected' : ''}>Все категории</option>
          ${categories.map(category => `
            <option value="${category.id}" ${currentFilter.category === category.id ? 'selected' : ''}>
              ${category.name}
            </option>
          `).join('')}
        </select>
      </div>
      
      <!-- Фильтр по сезонам -->
      <div class="filter-group">
        <select class="filter-select" id="seasonFilter">
          <option value="all" ${currentFilter.season === 'all' ? 'selected' : ''}>Все сезоны</option>
          ${seasons.map(season => `
            <option value="${season.id}" ${currentFilter.season === season.id ? 'selected' : ''}>
              ${season.name}
            </option>
          `).join('')}
        </select>
      </div>
      
      <!-- Кнопка сброса -->
      <button class="btn btn-secondary reset-filters" id="resetFilters">
        Сбросить фильтры
      </button>
    </div>
    
    <!-- Активные фильтры -->
    <div class="active-filters">
      ${currentFilter.category !== 'all' ? `
        <span class="active-filter-tag">
          Категория: ${getCategoryName(currentFilter.category)}
          <button class="remove-filter" data-filter="category">&times;</button>
        </span>
      ` : ''}
      
      ${currentFilter.season !== 'all' ? `
        <span class="active-filter-tag">
          Сезон: ${getSeasonName(currentFilter.season)}
          <button class="remove-filter" data-filter="season">&times;</button>
        </span>
      ` : ''}
      
      ${currentFilter.searchQuery ? `
        <span class="active-filter-tag">
          Поиск: "${currentFilter.searchQuery}"
          <button class="remove-filter" data-filter="search">&times;</button>
        </span>
      ` : ''}
    </div>
  </div>
`;

const getCategoryName = (categoryId) => {
  const categories = {
    'outerwear': 'Верхняя одежда',
    'sweaters': 'Свитеры',
    'tshirts': 'Футболки',
    'jeans': 'Джинсы / Брюки',
    'shoes': 'Обувь',
    'accessories': 'Аксессуары'
  };
  return categories[categoryId] || categoryId;
};

const getSeasonName = (seasonId) => {
  const seasons = {
    'all': 'Все сезоны',
    'summer': 'Лето',
    'winter': 'Зима',
    'spring-autumn': 'Весна-Осень',
    'all-season': 'Всесезонные'
  };
  return seasons[seasonId] || seasonId;
};

const createCatalogTemplate = (categories, clothingItems, seasons, currentFilter) => `
  <section id="catalog" class="section catalog-section">
    <h2 class="section-title">
      Каталог Гардероба
    </h2>
    <p class="section-description">
      Выберите категорию, чтобы увидеть все вещи и добавить новые.
    </p>

    <!-- Кнопка добавления -->
    <div class="add-clothing-header">
      <button class="btn btn-primary add-clothing-btn" id="addClothingBtn">
        + Добавить новую одежду
      </button>
    </div>

    <!-- Категории одежды -->
    <div class="categories-grid">
      ${categories.map(category => 
        createCategoryTemplate(category, currentFilter.category === category.id)
      ).join('')}
    </div>

    <!-- Фильтры ПОД КАТЕГОРИЯМИ -->
    ${createFilterControlsTemplate(categories, seasons, currentFilter, clothingItems.length)}

    <!-- Сетка с одеждой -->
    <div class="clothing-items-container">
      <div class="clothing-items-grid" id="clothingItemsGrid">
        ${clothingItems.length > 0 
          ? clothingItems.map(createClothingItemTemplate).join('')
          : `
            <div class="no-items-message">
              <svg class="no-items-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h3>Нет вещей по выбранным фильтрам</h3>
              <p>Попробуйте изменить параметры поиска или добавьте новую одежду</p>
              <button class="btn btn-primary" id="addFromEmpty">Добавить одежду</button>
            </div>
          `
        }
      </div>
    </div>
  </section>
`;

export default class CatalogComponent {
  constructor(categories, clothingItems, seasons, currentFilter, onAddClick, onFilterChange) {
    this.categories = categories;
    this.clothingItems = clothingItems;
    this.seasons = seasons;
    this.currentFilter = currentFilter;
    this.onAddClick = onAddClick;
    this.onFilterChange = onFilterChange;
    this.element = null;
  }

  getTemplate() {
    return createCatalogTemplate(
      this.categories, 
      this.clothingItems, 
      this.seasons, 
      this.currentFilter
    );
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
    const addButton = this.element.querySelector('#addClothingBtn');
    if (addButton && this.onAddClick) {
      addButton.addEventListener('click', this.onAddClick);
    }

    // Кнопка добавления из пустого состояния
    const addFromEmpty = this.element.querySelector('#addFromEmpty');
    if (addFromEmpty && this.onAddClick) {
      addFromEmpty.addEventListener('click', this.onAddClick);
    }

    // Клики по категориям
    const categoryCards = this.element.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
      card.addEventListener('click', () => {
        if (this.onFilterChange) {
          this.onFilterChange({ category: card.dataset.category });
        }
      });
    });

    // Поиск с дебаунсом
    const searchInput = this.element.querySelector('.search-input');
    let searchTimeout;
    searchInput.addEventListener('input', (evt) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        if (this.onFilterChange) {
          this.onFilterChange({ searchQuery: evt.target.value });
        }
      }, 300);
    });

    // Фильтр по категориям
    const categoryFilter = this.element.querySelector('#categoryFilter');
    categoryFilter.addEventListener('change', (evt) => {
      if (this.onFilterChange) {
        this.onFilterChange({ category: evt.target.value });
      }
    });

    // Фильтр по сезонам
    const seasonFilter = this.element.querySelector('#seasonFilter');
    seasonFilter.addEventListener('change', (evt) => {
      if (this.onFilterChange) {
        this.onFilterChange({ season: evt.target.value });
      }
    });

    // Сброс фильтров
    const resetButton = this.element.querySelector('#resetFilters');
    resetButton.addEventListener('click', () => {
      if (this.onFilterChange) {
        this.onFilterChange({ 
          category: 'all', 
          season: 'all', 
          searchQuery: '' 
        });
        searchInput.value = '';
        categoryFilter.value = 'all';
        seasonFilter.value = 'all';
      }
    });

    // Удаление активных фильтров
    const removeButtons = this.element.querySelectorAll('.remove-filter');
    removeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const filterType = btn.dataset.filter;
        if (this.onFilterChange) {
          const updates = {};
          if (filterType === 'category') updates.category = 'all';
          if (filterType === 'season') updates.season = 'all';
          if (filterType === 'search') {
            updates.searchQuery = '';
            searchInput.value = '';
          }
          this.onFilterChange(updates);
        }
      });
    });
  }

  removeElement() {
    this.element = null;
  }
}
