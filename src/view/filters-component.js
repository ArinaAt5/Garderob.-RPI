import { createElement } from '../framework/render.js';

const createFiltersTemplate = (categories, seasons, currentFilter) => `
  <div class="filters-container">
    <div class="filter-section">
      <h3 class="filter-title">Фильтры</h3>
      
      <!-- Поиск -->
      <div class="filter-group">
        <label for="searchInput" class="filter-label">Поиск по гардеробу</label>
        <input 
          type="text" 
          id="searchInput" 
          class="search-input" 
          placeholder="Введите название или цвет..."
          value="${currentFilter.searchQuery || ''}"
        />
      </div>
      
      <!-- Фильтр по категориям -->
      <div class="filter-group">
        <label class="filter-label">Категория</label>
        <div class="category-filters">
          <button 
            class="filter-btn ${currentFilter.category === 'all' ? 'active' : ''}" 
            data-category="all"
          >
            Все
          </button>
          ${categories.map(category => `
            <button 
              class="filter-btn ${currentFilter.category === category.id ? 'active' : ''}" 
              data-category="${category.id}"
            >
              ${category.name}
            </button>
          `).join('')}
        </div>
      </div>
      
      <!-- Фильтр по сезонам -->
      <div class="filter-group">
        <label class="filter-label">Сезон</label>
        <div class="season-filters">
          <button 
            class="filter-btn ${currentFilter.season === 'all' ? 'active' : ''}" 
            data-season="all"
          >
            Все сезоны
          </button>
          ${seasons.map(season => `
            <button 
              class="filter-btn ${currentFilter.season === season.id ? 'active' : ''}" 
              data-season="${season.id}"
            >
              ${season.name}
            </button>
          `).join('')}
        </div>
      </div>
      
      <!-- Статистика -->
      <div class="filter-stats">
        <p>Найдено: <span id="itemsCount">0</span> вещей</p>
      </div>
    </div>
  </div>
`;

export default class FiltersComponent {
  constructor(categories, seasons, currentFilter, onFilterChange) {
    this.categories = categories;
    this.seasons = seasons;
    this.currentFilter = currentFilter;
    this.onFilterChange = onFilterChange;
    this.element = null;
  }

  getTemplate() {
    return createFiltersTemplate(this.categories, this.seasons, this.currentFilter);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
      this.setListeners();
    }
    return this.element;
  }

  setListeners() {
  // Сохраняем текущие значения фильтров
  let currentCategory = this.currentFilter.category;
  let currentSeason = this.currentFilter.season;
  let currentSearchQuery = this.currentFilter.searchQuery;

  // Поиск с дебаунсом
  const searchInput = this.element.querySelector('#searchInput');
  let searchTimeout;
  
  searchInput.addEventListener('input', (evt) => {
    clearTimeout(searchTimeout);
    currentSearchQuery = evt.target.value;
    searchTimeout = setTimeout(() => {
      // Передаем ВСЕ параметры
      this.onFilterChange(currentCategory, currentSeason, currentSearchQuery);
    }, 300);
  });

  // Фильтры по категориям
  const categoryButtons = this.element.querySelectorAll('[data-category]');
  categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      currentCategory = btn.dataset.category;
      // Передаем ВСЕ параметры
      this.onFilterChange(currentCategory, currentSeason, currentSearchQuery);
    });
  });

  // Фильтры по сезонам
  const seasonButtons = this.element.querySelectorAll('[data-season]');
  seasonButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      currentSeason = btn.dataset.season;
      // Передаем ВСЕ параметры
      this.onFilterChange(currentCategory, currentSeason, currentSearchQuery);
    });
  });
}
}