import Observable from '../framework/observable.js';

export default class WardrobeModel extends Observable {
  constructor() {
    super();
    this.categories = [];
    this.clothingItems = [];
    this.outfits = [];
    this.galleryImages = [];
    this.shoppingList = [];
  }

  setCategories(categories) {
    this.categories = categories;
    this._notify('categories-updated', categories);
  }

  setClothingItems(items) {
    this.clothingItems = items;
    this._notify('clothing-items-updated', items);
  }

  addClothingItem(item) {
    this.clothingItems.push(item);
    this._notify('clothing-item-added', item);
  }

  setOutfits(outfits) {
    this.outfits = outfits;
    this._notify('outfits-updated', outfits);
  }

  setGalleryImages(images) {
    this.galleryImages = images;
    this._notify('gallery-updated', images);
  }

  setShoppingList(items) {
    this.shoppingList = items;
    this._notify('shopping-list-updated', items);
  }
}