import { createElement } from '../framework/render.js';

// Базовые изображения персонажа (можно заменить на свои)
const CHARACTER_BASE = {
  male: 'images/character/male-base.png',
  female: 'images/character/female-base.png'
};

// Слои одежды для персонажа
const CLOTHING_LAYERS = {
  tops: {
    zIndex: 20,
    position: { x: 0, y: 0 },
    size: { width: 200, height: 300 }
  },
  bottoms: {
    zIndex: 15,
    position: { x: 0, y: 150 },
    size: { width: 200, height: 200 }
  },
  shoes: {
    zIndex: 10,
    position: { x: 0, y: 280 },
    size: { width: 200, height: 100 }
  },
  outerwear: {
    zIndex: 25,
    position: { x: 0, y: 0 },
    size: { width: 200, height: 300 }
  },
  accessories: {
    zIndex: 30,
    position: { x: 0, y: 50 },
    size: { width: 200, height: 100 }
  }
};

const createCharacterOutfitsTemplate = (outfits, wardrobeItems, characterData) => `
  <section id="character-outfits" class="section character-outfits-section">
    <div class="section-header">
      <div>
        <h2 class="section-title">
          Виртуальная Примерочная
        </h2>
        <p class="section-description">
          Примеряйте одежду на персонажа и создавайте стильные образы из вашего гардероба.
        </p>
      </div>
      <div class="character-controls">
        <button class="btn btn-outline" id="changeGender">
          <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Сменить пол
        </button>
        <button class="btn btn-brown" id="saveCharacterOutfit">
          <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
          </svg>
          Сохранить образ
        </button>
      </div>
    </div>

    <div class="character-workspace">
      <div class="character-container">
        <div class="character-viewport">
          <div class="character" id="characterModel">
            <!-- Базовое изображение персонажа -->
            <div class="character-base" 
                 style="background-image: url('${characterData.gender === 'female' ? CHARACTER_BASE.female : CHARACTER_BASE.male}')">
            </div>
            
            <!-- Слои одежды (динамически добавляются) -->
            <div class="clothing-layer" id="layerTop"></div>
            <div class="clothing-layer" id="layerBottom"></div>
            <div class="clothing-layer" id="layerShoes"></div>
            <div class="clothing-layer" id="layerOuterwear"></div>
            <div class="clothing-layer" id="layerAccessory"></div>
            
            <!-- Индикатор перетаскивания -->
            <div class="drop-zone-indicator hidden" id="dropZone">
              <svg class="drop-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              <p>Перетащите одежду сюда</p>
            </div>
          </div>
          
          <div class="character-controls-panel">
            <div class="zoom-controls">
              <button class="zoom-btn" id="zoomOut" title="Уменьшить">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                </svg>
              </button>
              <span class="zoom-level" id="zoomLevel">100%</span>
              <button class="zoom-btn" id="zoomIn" title="Увеличить">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </button>
            </div>
            
            <div class="pose-controls">
              <button class="pose-btn" data-pose="front" title="Анфас">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"></path>
                </svg>
              </button>
              <button class="pose-btn active" data-pose="side" title="Профиль">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
              </button>
              <button class="pose-btn" data-pose="back" title="Спина">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
              </button>
            </div>
            
            <button class="btn btn-outline btn-small" id="resetCharacter">
              <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Сбросить
            </button>
          </div>
        </div>
        
        <div class="current-outfit-info">
          <h3 class="outfit-name" id="currentOutfitName">Новый образ</h3>
          <div class="outfit-stats">
            <div class="stat">
              <span class="stat-label">Стиль:</span>
              <span class="stat-value" id="outfitStyle">Не определен</span>
            </div>
            <div class="stat">
              <span class="stat-label">Сезон:</span>
              <span class="stat-value" id="outfitSeason">Всесезонный</span>
            </div>
            <div class="stat">
              <span class="stat-label">Рейтинг:</span>
              <div class="rating-display" id="outfitRating">
                <div class="stars">☆☆☆☆☆</div>
                <span class="rating-text">0.0</span>
              </div>
            </div>
            <div class="stat">
              <span class="stat-label">Стоимость:</span>
              <span class="stat-value" id="outfitPrice">0 руб</span>
            </div>
          </div>
          
          <div class="outfit-items-list" id="currentOutfitItems">
            <p class="items-title">Предметы в образе:</p>
            <div class="items-container">
              <!-- Динамически заполняется -->
            </div>
          </div>
        </div>
      </div>

      <div class="wardrobe-panel">
        <div class="wardrobe-header">
          <h3>Ваш гардероб</h3>
          <div class="search-box">
            <input type="text" placeholder="Поиск одежды..." id="wardrobeSearch">
            <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
        
        <div class="wardrobe-tabs">
          <button class="wardrobe-tab active" data-category="all">
            <svg class="tab-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
            </svg>
            Все
          </button>
          <button class="wardrobe-tab" data-category="tops">
            <svg class="tab-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            Верх
          </button>
          <button class="wardrobe-tab" data-category="bottoms">
            <svg class="tab-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Низ
          </button>
          <button class="wardrobe-tab" data-category="shoes">
            <svg class="tab-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path>
            </svg>
            Обувь
          </button>
          <button class="wardrobe-tab" data-category="outerwear">
            <svg class="tab-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
            Верхняя одежда
          </button>
          <button class="wardrobe-tab" data-category="accessories">
            <svg class="tab-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
            Аксессуары
          </button>
        </div>
        
        <div class="wardrobe-items-container">
          <div class="wardrobe-items-grid" id="wardrobeItemsGrid">
            ${wardrobeItems.map(item => `
              <div class="wardrobe-item" 
                   draggable="true" 
                   data-id="${item.id}"
                   data-category="${item.category}"
                   data-name="${item.name}"
                   data-price="${item.price || 0}"
                   data-color="${item.color || '#E5E7EB'}"
                   data-image="${item.image || ''}">
                <div class="item-preview" style="background-color: ${item.color || '#E5E7EB'}">
                  ${item.image ? `<img src="${item.image}" alt="${item.name}">` : `
                    <div class="item-placeholder">${item.name.charAt(0)}</div>
                  `}
                  <div class="item-price">${item.price || 0} руб</div>
                </div>
                <div class="item-info">
                  <h4 class="item-name">${item.name}</h4>
                  <span class="item-category">${item.category}</span>
                  ${item.size ? `<span class="item-size">${item.size}</span>` : ''}
                </div>
              </div>
            `).join('')}
            
            ${wardrobeItems.length === 0 ? `
              <div class="empty-wardrobe">
                <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
                <p>Гардероб пуст</p>
                <p class="empty-subtext">Добавьте одежду, чтобы начать создавать образы</p>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    </div>

    <div class="saved-outfits-panel">
      <div class="panel-header">
        <h3>
          <svg class="panel-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
          </svg>
          Сохраненные образы
        </h3>
        <button class="btn btn-outline btn-small" id="clearSaved">
          Очистить все
        </button>
      </div>
      
      <div class="saved-outfits-grid" id="savedOutfitsGrid">
        <!-- Динамически заполняется из localStorage -->
      </div>
    </div>
  </section>
`;

export default class CharacterOutfitsComponent {
  constructor(outfits = [], wardrobeItems = [], initialCharacter = { gender: 'male' }) {
    this.outfits = outfits;
    this.wardrobeItems = wardrobeItems;
    this.character = {
      gender: initialCharacter.gender || 'male',
      pose: 'side',
      scale: 1,
      currentOutfit: {
        top: null,
        bottom: null,
        shoes: null,
        outerwear: null,
        accessory: null
      }
    };
    this.savedOutfits = JSON.parse(localStorage.getItem('savedCharacterOutfits') || '[]');
    this.filteredWardrobe = [...wardrobeItems];
    this.currentCategory = 'all';
    this.element = null;
  }

  getTemplate() {
    return createCharacterOutfitsTemplate(
      this.outfits,
      this.filteredWardrobe,
      this.character
    );
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
      this.initCharacter();
    }
    return this.element;
  }

  initCharacter() {
    // Инициализация перетаскивания
    this.initDragAndDrop();
    
    // Инициализация управления персонажем
    this.initCharacterControls();
    
    // Инициализация гардероба
    this.initWardrobe();
    
    // Инициализация сохраненных образов
    this.initSavedOutfits();
    
    // Обновление информации об образе
    this.updateOutfitInfo();
  }

  initDragAndDrop() {
    const character = this.element.querySelector('#characterModel');
    const wardrobeItems = this.element.querySelectorAll('.wardrobe-item');
    const dropZone = this.element.querySelector('#dropZone');
    
    // Делаем элементы гардероба перетаскиваемыми
    wardrobeItems.forEach(item => {
      item.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('application/json', JSON.stringify({
          id: item.dataset.id,
          category: item.dataset.category,
          name: item.dataset.name,
          color: item.dataset.color,
          image: item.dataset.image,
          price: item.dataset.price
        }));
        item.classList.add('dragging');
      });
      
      item.addEventListener('dragend', () => {
        item.classList.remove('dragging');
      });
    });
    
    // Обработка перетаскивания на персонажа
    character.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.remove('hidden');
      character.classList.add('drag-over');
    });
    
    character.addEventListener('dragleave', () => {
      dropZone.classList.add('hidden');
      character.classList.remove('drag-over');
    });
    
    character.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.add('hidden');
      character.classList.remove('drag-over');
      
      try {
        const data = JSON.parse(e.dataTransfer.getData('application/json'));
        this.dressCharacter(data);
      } catch (error) {
        console.error('Ошибка при перетаскивании одежды:', error);
      }
    });
    
    // Клик по предмету гардероба (альтернатива перетаскиванию)
    wardrobeItems.forEach(item => {
      item.addEventListener('click', () => {
        this.dressCharacter({
          id: item.dataset.id,
          category: item.dataset.category,
          name: item.dataset.name,
          color: item.dataset.color,
          image: item.dataset.image,
          price: item.dataset.price
        });
      });
    });
  }

  dressCharacter(itemData) {
    // Определяем тип слоя по категории
    const layerType = this.getLayerType(itemData.category);
    if (!layerType) return;
    
    // Находим предмет в гардеробе
    const item = this.wardrobeItems.find(i => i.id == itemData.id);
    if (!item) return;
    
    // Обновляем текущий образ
    this.character.currentOutfit[layerType] = item;
    
    // Обновляем слой на персонаже
    this.updateCharacterLayer(layerType, item);
    
    // Обновляем информацию об образе
    this.updateOutfitInfo();
  }

  getLayerType(category) {
    const categoryMap = {
      'tops': 'top',
      'bottoms': 'bottom',
      'shoes': 'shoes',
      'outerwear': 'outerwear',
      'accessories': 'accessory'
    };
    
    // Ищем точное совпадение
    if (categoryMap[category.toLowerCase()]) {
      return categoryMap[category.toLowerCase()];
    }
    
    // Ищем частичное совпадение
    for (const [key, value] of Object.entries(categoryMap)) {
      if (category.toLowerCase().includes(key)) {
        return value;
      }
    }
    
    return null;
  }

  updateCharacterLayer(layerType, item) {
    const layer = this.element.querySelector(`#layer${this.capitalizeFirst(layerType)}`);
    if (!layer) return;
    
    // Очищаем слой
    layer.style.backgroundImage = '';
    layer.style.backgroundColor = '';
    layer.style.display = 'none';
    
    if (item) {
      if (item.image) {
        // Если есть изображение, используем его
        layer.style.backgroundImage = `url('${item.image}')`;
        layer.style.backgroundSize = 'contain';
        layer.style.backgroundRepeat = 'no-repeat';
        layer.style.backgroundPosition = 'center';
      } else {
        // Иначе используем цвет
        layer.style.backgroundColor = item.color || '#E5E7EB';
      }
      
      layer.style.display = 'block';
      
      // Добавляем класс с типом одежды
      layer.className = `clothing-layer ${layerType}-layer`;
    }
  }

  capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  updateOutfitInfo() {
    const outfitName = this.element.querySelector('#currentOutfitName');
    const style = this.element.querySelector('#outfitStyle');
    const season = this.element.querySelector('#outfitSeason');
    const rating = this.element.querySelector('#outfitRating');
    const price = this.element.querySelector('#outfitPrice');
    const itemsContainer = this.element.querySelector('.items-container');
    
    // Собираем текущие предметы
    const currentItems = Object.values(this.character.currentOutfit).filter(Boolean);
    
    // Генерируем название
    const topName = this.character.currentOutfit.top?.name || '';
    const bottomName = this.character.currentOutfit.bottom?.name || '';
    const outfitNameText = topName && bottomName ? `${topName} + ${bottomName}` : 'Новый образ';
    outfitName.textContent = outfitNameText;
    
    // Определяем стиль
    const outfitStyle = this.determineOutfitStyle(currentItems);
    style.textContent = outfitStyle;
    
    // Определяем сезон
    const outfitSeason = this.determineOutfitSeason(currentItems);
    season.textContent = outfitSeason;
    
    // Рассчитываем рейтинг
    const outfitRating = this.calculateOutfitRating(currentItems);
    rating.querySelector('.stars').innerHTML = 
      '★'.repeat(Math.floor(outfitRating)) + '☆'.repeat(5 - Math.floor(outfitRating));
    rating.querySelector('.rating-text').textContent = outfitRating.toFixed(1);
    
    // Рассчитываем стоимость
    const totalPrice = currentItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
    price.textContent = `${totalPrice} руб`;
    
    // Обновляем список предметов
    if (itemsContainer) {
      itemsContainer.innerHTML = currentItems.map(item => `
        <div class="outfit-item" data-id="${item.id}">
          <div class="item-color" style="background-color: ${item.color || '#E5E7EB'}"></div>
          <span class="item-name">${item.name}</span>
          <button class="remove-item" data-layer="${this.getLayerType(item.category)}">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      `).join('');
      
      // Добавляем обработчики для кнопок удаления
      itemsContainer.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const layer = e.target.closest('.remove-item').dataset.layer;
          this.removeItemFromOutfit(layer);
        });
      });
    }
  }

  determineOutfitStyle(items) {
    if (items.some(item => item.category.toLowerCase().includes('sport'))) {
      return 'Спортивный';
    }
    if (items.some(item => item.category === 'outerwear' && item.name.toLowerCase().includes('пиджак'))) {
      return 'Деловой';
    }
    if (items.some(item => item.category === 'shoes' && item.name.toLowerCase().includes('туфли'))) {
      return 'Официальный';
    }
    return 'Повседневный';
  }

  determineOutfitSeason(items) {
    const hasOuterwear = items.some(item => item.category === 'outerwear');
    const hasWarmTop = items.some(item => 
      item.category === 'tops' && 
      (item.name.toLowerCase().includes('свитер') || item.name.toLowerCase().includes('толстовка'))
    );
    
    if (hasWarmTop && hasOuterwear) return 'Зима';
    if (hasOuterwear) return 'Осень/Весна';
    return 'Лето';
  }

  calculateOutfitRating(items) {
    let rating = 3.0;
    
    // Бонус за сочетание цветов
    const colors = items.map(item => item.color).filter(Boolean);
    const uniqueColors = new Set(colors);
    
    if (uniqueColors.size >= 2 && uniqueColors.size <= 3) {
      rating += 0.5;
    }
    
    // Бонус за полный образ
    const categories = new Set(items.map(item => item.category));
    if (categories.size >= 3) {
      rating += 0.3;
    }
    
    // Бонус за аксессуары
    if (items.some(item => item.category === 'accessories')) {
      rating += 0.2;
    }
    
    // Бонус за сочетание верх-низ
    const hasTop = items.some(item => this.getLayerType(item.category) === 'top');
    const hasBottom = items.some(item => this.getLayerType(item.category) === 'bottom');
    if (hasTop && hasBottom) {
      rating += 0.3;
    }
    
    return Math.min(rating, 5.0);
  }

  removeItemFromOutfit(layerType) {
    if (this.character.currentOutfit[layerType]) {
      this.character.currentOutfit[layerType] = null;
      this.updateCharacterLayer(layerType, null);
      this.updateOutfitInfo();
    }
  }

  initCharacterControls() {
    // Смена пола
    const changeGenderBtn = this.element.querySelector('#changeGender');
    changeGenderBtn?.addEventListener('click', () => {
      this.character.gender = this.character.gender === 'male' ? 'female' : 'male';
      this.updateCharacterBase();
    });
    
    // Сохранение образа
    const saveOutfitBtn = this.element.querySelector('#saveCharacterOutfit');
    saveOutfitBtn?.addEventListener('click', () => this.saveCurrentOutfit());
    
    // Зум
    const zoomInBtn = this.element.querySelector('#zoomIn');
    const zoomOutBtn = this.element.querySelector('#zoomOut');
    const zoomLevel = this.element.querySelector('#zoomLevel');
    
    zoomInBtn?.addEventListener('click', () => {
      this.character.scale = Math.min(this.character.scale + 0.1, 2.0);
      this.updateCharacterScale();
      zoomLevel.textContent = `${Math.round(this.character.scale * 100)}%`;
    });
    
    zoomOutBtn?.addEventListener('click', () => {
      this.character.scale = Math.max(this.character.scale - 0.1, 0.5);
      this.updateCharacterScale();
      zoomLevel.textContent = `${Math.round(this.character.scale * 100)}%`;
    });
    
    // Позы
    const poseBtns = this.element.querySelectorAll('.pose-btn');
    poseBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        poseBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.character.pose = btn.dataset.pose;
        this.updateCharacterPose();
      });
    });
    
    // Сброс
    const resetBtn = this.element.querySelector('#resetCharacter');
    resetBtn?.addEventListener('click', () => this.resetCharacter());
  }

  updateCharacterBase() {
    const characterBase = this.element.querySelector('.character-base');
    if (characterBase) {
      characterBase.style.backgroundImage = `url('${this.character.gender === 'female' ? CHARACTER_BASE.female : CHARACTER_BASE.male}')`;
    }
    
    // Сбрасываем одежду при смене пола (опционально)
    this.resetCharacter();
  }

  updateCharacterScale() {
    const character = this.element.querySelector('#characterModel');
    if (character) {
      character.style.transform = `scale(${this.character.scale})`;
    }
  }

  updateCharacterPose() {
    // Здесь можно добавить изменение изображения персонажа в зависимости от позы
    console.log('Поза изменена на:', this.character.pose);
  }

  resetCharacter() {
    // Сбрасываем одежду
    Object.keys(this.character.currentOutfit).forEach(key => {
      this.character.currentOutfit[key] = null;
      this.updateCharacterLayer(key, null);
    });
    
    // Сбрасываем зум
    this.character.scale = 1;
    this.updateCharacterScale();
    this.element.querySelector('#zoomLevel').textContent = '100%';
    
    // Обновляем информацию
    this.updateOutfitInfo();
  }

  initWardrobe() {
    // Поиск
    const searchInput = this.element.querySelector('#wardrobeSearch');
    searchInput?.addEventListener('input', (e) => {
      this.filterWardrobe(e.target.value);
    });
    
    // Вкладки
    const tabs = this.element.querySelectorAll('.wardrobe-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.currentCategory = tab.dataset.category;
        this.filterWardrobe(searchInput?.value || '');
      });
    });
  }

  filterWardrobe(searchTerm = '') {
    this.filteredWardrobe = this.wardrobeItems.filter(item => {
      // Фильтр по категории
      if (this.currentCategory !== 'all') {
        const itemCategory = item.category.toLowerCase();
        const targetCategory = this.currentCategory.toLowerCase();
        
        if (!itemCategory.includes(targetCategory)) {
          return false;
        }
      }
      
      // Фильтр по поиску
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        return item.name.toLowerCase().includes(term) || 
               item.category.toLowerCase().includes(term);
      }
      
      return true;
    });
    
    this.rerenderWardrobe();
  }

  rerenderWardrobe() {
    const wardrobeGrid = this.element.querySelector('#wardrobeItemsGrid');
    if (!wardrobeGrid) return;
    
    wardrobeGrid.innerHTML = this.filteredWardrobe.map(item => `
      <div class="wardrobe-item" 
           draggable="true" 
           data-id="${item.id}"
           data-category="${item.category}"
           data-name="${item.name}"
           data-price="${item.price || 0}"
           data-color="${item.color || '#E5E7EB'}"
           data-image="${item.image || ''}">
        <div class="item-preview" style="background-color: ${item.color || '#E5E7EB'}">
          ${item.image ? `<img src="${item.image}" alt="${item.name}">` : `
            <div class="item-placeholder">${item.name.charAt(0)}</div>
          `}
          <div class="item-price">${item.price || 0} руб</div>
        </div>
        <div class="item-info">
          <h4 class="item-name">${item.name}</h4>
          <span class="item-category">${item.category}</span>
          ${item.size ? `<span class="item-size">${item.size}</span>` : ''}
        </div>
      </div>
    `).join('');
    
    // Повторная инициализация перетаскивания
    this.initDragAndDrop();
  }

  initSavedOutfits() {
    this.updateSavedOutfitsDisplay();
    
    // Очистка сохраненных образов
    const clearBtn = this.element.querySelector('#clearSaved');
    clearBtn?.addEventListener('click', () => {
      if (confirm('Удалить все сохраненные образы?')) {
        localStorage.removeItem('savedCharacterOutfits');
        this.savedOutfits = [];
        this.updateSavedOutfitsDisplay();
      }
    });
  }

  saveCurrentOutfit() {
    const currentItems = Object.values(this.character.currentOutfit).filter(Boolean);
    
    if (currentItems.length === 0) {
      alert('Добавьте хотя бы один предмет одежды!');
      return;
    }
    
    const outfitName = prompt('Введите название для образа:', `Образ ${this.savedOutfits.length + 1}`);
    if (!outfitName) return;
    
    const newOutfit = {
      id: Date.now(),
      name: outfitName,
      items: currentItems.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        color: item.color,
        image: item.image,
        price: item.price
      })),
      character: {
        gender: this.character.gender,
        pose: this.character.pose
      },
      style: this.determineOutfitStyle(currentItems),
      season: this.determineOutfitSeason(currentItems),
      rating: this.calculateOutfitRating(currentItems),
      price: currentItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0),
      createdAt: new Date().toISOString()
    };
    
    this.savedOutfits.push(newOutfit);
    localStorage.setItem('savedCharacterOutfits', JSON.stringify(this.savedOutfits));
    this.updateSavedOutfitsDisplay();
    
    alert(`Образ "${outfitName}" сохранен!`);
  }

  updateSavedOutfitsDisplay() {
    const savedGrid = this.element.querySelector('#savedOutfitsGrid');
    if (!savedGrid) return;
    
    if (this.savedOutfits.length === 0) {
      savedGrid.innerHTML = `
        <div class="empty-saved">
          <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
          </svg>
          <p>Нет сохраненных образов</p>
          <p class="empty-subtext">Сохраняйте созданные образы, чтобы вернуться к ним позже</p>
        </div>
      `;
      return;
    }
    
    savedGrid.innerHTML = this.savedOutfits.map(outfit => `
      <div class="saved-outfit-card" data-outfit-id="${outfit.id}">
        <div class="saved-outfit-preview">
          <div class="outfit-items-mini">
            ${outfit.items.slice(0, 4).map(item => `
              <div class="mini-item" style="background-color: ${item.color || '#E5E7EB'}">
                ${item.image ? `<img src="${item.image}" alt="${item.name}">` : item.name.charAt(0)}
              </div>
            `).join('')}
            ${outfit.items.length > 4 ? `<div class="mini-more">+${outfit.items.length - 4}</div>` : ''}
          </div>
          <div class="outfit-rating-mini">
            ${'★'.repeat(Math.floor(outfit.rating))}${'☆'.repeat(5 - Math.floor(outfit.rating))}
          </div>
        </div>
        <div class="saved-outfit-info">
          <h4>${outfit.name}</h4>
          <div class="saved-outfit-details">
            <span>${outfit.style}</span>
            <span>•</span>
            <span>${outfit.season}</span>
            <span>•</span>
            <span>${outfit.price} руб</span>
          </div>
          <div class="saved-outfit-actions">
            <button class="btn btn-small load-outfit" data-outfit-id="${outfit.id}">Загрузить</button>
            <button class="btn btn-small btn-outline delete-outfit" data-outfit-id="${outfit.id}">Удалить</button>
          </div>
        </div>
      </div>
    `).join('');
    
    // Обработчики для загрузки образов
    savedGrid.querySelectorAll('.load-outfit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const outfitId = parseInt(e.target.dataset.outfitId);
        this.loadSavedOutfit(outfitId);
      });
    });
    
    // Обработчики для удаления образов
    savedGrid.querySelectorAll('.delete-outfit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const outfitId = parseInt(e.target.dataset.outfitId);
        if (confirm('Удалить этот образ?')) {
          this.savedOutfits = this.savedOutfits.filter(o => o.id !== outfitId);
          localStorage.setItem('savedCharacterOutfits', JSON.stringify(this.savedOutfits));
          this.updateSavedOutfitsDisplay();
        }
      });
    });
  }

  loadSavedOutfit(outfitId) {
    const outfit = this.savedOutfits.find(o => o.id === outfitId);
    if (!outfit) return;
    
    // Сбрасываем текущий образ
    this.resetCharacter();
    
    // Загружаем предметы
    outfit.items.forEach(itemData => {
      const item = this.wardrobeItems.find(i => i.id == itemData.id);
      if (item) {
        const layerType = this.getLayerType(item.category);
        if (layerType) {
          this.character.currentOutfit[layerType] = item;
          this.updateCharacterLayer(layerType, item);
        }
      }
    });
    
    // Обновляем информацию
    this.updateOutfitInfo();
    
    // Устанавливаем пол персонажа
    if (outfit.character.gender !== this.character.gender) {
      this.character.gender = outfit.character.gender;
      this.updateCharacterBase();
    }
  }

  updateWardrobeItems(newItems) {
    this.wardrobeItems = newItems;
    this.filteredWardrobe = [...newItems];
    this.rerenderWardrobe();
  }

  rerender() {
    if (!this.element) return;
    
    const newElement = createElement(this.getTemplate());
    const oldElement = this.element;
    
    if (oldElement.parentElement) {
      oldElement.parentElement.replaceChild(newElement, oldElement);
    }
    
    this.element = newElement;
    this.initCharacter();
  }

  removeElement() {
    this.element = null;
  }
}