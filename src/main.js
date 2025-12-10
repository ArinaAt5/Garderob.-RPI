import WardrobeApiService from './wardrobe-api-service.js';
import WardrobeModel from './model/wardrobe-model.js';
import WardrobePresenter from './presenter/wardrobe-presenter.js';
import LoadingViewComponent from './view/loading-view-component.js';
import {
  categories,
  outfits,
  galleryImages,
  shoppingList,
  seasons,
} from './mock/wardrobe-data.js';

// Конфигурация API
const END_POINT = 'https://6931cf4611a8738467d0a56b.mockapi.io';
const wardrobeApiService = new WardrobeApiService(END_POINT);

// Создаем модель с API-сервисом
const model = new WardrobeModel({ wardrobeApiService });

// Устанавливаем статические данные (из моков, так как они не хранятся на сервере)
model.setCategories(categories);
model.setOutfits(outfits);
model.setGalleryImages(galleryImages);
model.setShoppingList(shoppingList);
model.setSeasons(seasons);

// Создаем презентер
const presenter = new WardrobePresenter(model);
const appContainer = document.querySelector('#app');

/**
 * Основная функция инициализации приложения
 */
async function initializeApp() {
  if (!appContainer) {
    console.error('Контейнер #app не найден в DOM');
    return;
  }

  // Показываем индикатор загрузки
  const loadingComponent = new LoadingViewComponent();
  appContainer.appendChild(loadingComponent.getElement());

  try {
    // Загружаем данные одежды с сервера
    await model.init();
    
    // Удаляем индикатор загрузки
    loadingComponent.getElement().remove();
    loadingComponent.removeElement();
    
    // Инициализируем презентер
    presenter.init(appContainer);
    
    console.log('Приложение успешно инициализировано');
    
  } catch (error) {
    console.error('Ошибка при инициализации приложения:', error);
    
    // Удаляем индикатор загрузки
    loadingComponent.getElement().remove();
    loadingComponent.removeElement();
    
    // Показываем сообщение об ошибке
    showErrorMessage(appContainer, error);
  }
}

/**
 * Показывает сообщение об ошибке
 */
function showErrorMessage(container, error) {
  container.innerHTML = `
    <div class="error-message">
      <div class="error-icon">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <h2>Не удалось загрузить гардероб</h2>
      <p>Возможные причины:</p>
      <ul class="error-list">
        <li>Проверьте подключение к интернету</li>
        <li>Сервер может быть временно недоступен</li>
        <li>Данные могут быть повреждены</li>
      </ul>
      <div class="error-details">
        <details>
          <summary>Техническая информация</summary>
          <pre>${error.message || 'Неизвестная ошибка'}</pre>
        </details>
      </div>
      <div class="error-actions">
        <button class="btn btn-primary" onclick="location.reload()">
          Обновить страницу
        </button>
        <button class="btn btn-secondary" onclick="useLocalData()">
          Использовать локальные данные
        </button>
      </div>
    </div>
  `;
}

/**
 * Функция для использования локальных данных при ошибке
 */
function useLocalData() {
  const appContainer = document.querySelector('#app');
  if (appContainer) {
    appContainer.innerHTML = '';
    
    // Показываем уведомление
    appContainer.innerHTML = '<div class="loading">Загрузка локальных данных...</div>';
    
    // Инициализируем с локальными данными
    import('./mock/wardrobe-data.js').then(({ initialClothingItems }) => {
      model.setClothingItems(initialClothingItems);
      presenter.init(appContainer);
    });
  }
}

// Запускаем приложение после загрузки DOM
document.addEventListener('DOMContentLoaded', initializeApp);

// Экспортируем для отладки (необязательно)
if (window) {
  window.wardrobeApp = {
    model,
    presenter,
    apiService: wardrobeApiService,
    reload: initializeApp
  };
}