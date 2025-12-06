import WardrobeModel from './model/wardrobe-model.js';
import WardrobePresenter from './presenter/wardrobe-presenter.js';
import {
  categories,
  initialClothingItems,
  outfits,
  galleryImages,
  shoppingList,
  seasons,
} from './mock/wardrobe-data.js';

const model = new WardrobeModel();

// Инициализация данных
model.setCategories(categories);
model.setClothingItems(initialClothingItems);
model.setOutfits(outfits);
model.setGalleryImages(galleryImages);
model.setShoppingList(shoppingList);
model.setSeasons(seasons); 

const presenter = new WardrobePresenter(model);
const appContainer = document.querySelector('#app');

if (appContainer) {
  presenter.init(appContainer);
} else {
  console.error('Контейнер #app не найден в DOM');
}