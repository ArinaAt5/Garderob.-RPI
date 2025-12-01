import Observable from '../framework/observable.js';

export default class WardrobeModel extends Observable {
  constructor() {
    super();
    this._categories = [];
    this._clothingItems = [];
    this._outfits = [];
    this._galleryImages = [];
    this._shoppingList = [];
  }

  get categories() {
    return this._categories;
  }

  get clothingItems() {
    return this._clothingItems;
  }

  get outfits() {
    return this._outfits;
  }

  get galleryImages() {
    return this._galleryImages;
  }

  get shoppingList() {
    return this._shoppingList;
  }

  setCategories(categories) {
    this._categories = categories;
    this._notify('categories-updated', categories);
  }

  setClothingItems(items) {
    this._clothingItems = items;
    this._notify('clothing-items-updated', items);
  }

  addClothingItem(item) {
    this._clothingItems = [...this._clothingItems, item];
    this._notify('clothing-item-added', item);
  }

  setOutfits(outfits) {
    this._outfits = outfits;
    this._notify('outfits-updated', outfits);
  }

  setGalleryImages(images) {
    this._galleryImages = images;
    this._notify('gallery-updated', images);
  }

  setShoppingList(items) {
    this._shoppingList = items;
    this._notify('shopping-list-updated', items);
  }
}