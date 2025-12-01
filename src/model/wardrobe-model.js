import Observable from '../framework/observable.js';


export default class WardrobeModel extends Observable {
  constructor() {
    super();
    this._categories = [];
    this._clothingItems = [];
    this._filteredClothingItems = [];
    this._outfits = [];
    this._galleryImages = [];
    this._shoppingList = [];
    this._seasons = []; 
    this._shoppingList = [];
    this._currentFilter = {
      category: 'all',
      season: 'all',
      searchQuery: ''
    };
  }

  get categories() {
    return this._categories;
  }

  get clothingItems() {
    return this._clothingItems;
  }

  get filteredClothingItems() {
    return this._filteredClothingItems;
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

  get seasons() {
    return this._seasons;
  }

  get currentFilter() {
    return this._currentFilter;
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
    this._filteredClothingItems = items;
    this._notify('clothing-items-updated', items);
  }

  setShoppingList(items) {
    this._shoppingList = items;
    this._notify('shopping-list-updated', items);
  }


  addClothingItem(item) {
    const newItem = {
      ...item,
      id: Date.now()
    };
    this._clothingItems = [...this._clothingItems, newItem];
    this.applyFilters();
    this._notify('clothing-item-added', newItem);
  }

    addShoppingItem(item) {
    const newItem = {
      ...item,
      id: Date.now(),
      addedAt: new Date().toISOString()
    };
    this._shoppingList = [...this._shoppingList, newItem];
    this._notify('shopping-item-added', newItem);
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

   removeShoppingItem(itemId) {
    this._shoppingList = this._shoppingList.filter(item => item.id !== itemId);
    this._notify('shopping-item-removed', itemId);
  }


  setSeasons(seasons) {
    this._seasons = seasons;
    this._notify('seasons-updated', seasons);
  }

  setFilter(category = 'all', season = 'all', searchQuery = '') {
    this._currentFilter = { category, season, searchQuery };
    this.applyFilters();
    this._notify('filter-changed', this._currentFilter);
  }
  

  applyFilters() {
    let filtered = [...this._clothingItems];

    // Фильтрация по категории
    if (this._currentFilter.category !== 'all') {
      filtered = filtered.filter(item => 
        item.category === this._currentFilter.category
      );
    }

    // Фильтрация по сезону
    if (this._currentFilter.season !== 'all') {
      filtered = filtered.filter(item => {
        if (!item.season) return false;
        return item.season.toLowerCase().includes(this._currentFilter.season);
      });
    }

    // Поиск по названию и цвету
    if (this._currentFilter.searchQuery.trim() !== '') {
      const query = this._currentFilter.searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(query) ||
        (item.color && item.color.toLowerCase().includes(query))
      );
    }

    this._filteredClothingItems = filtered;
    this._notify('filtered-items-updated', filtered);
  }
}