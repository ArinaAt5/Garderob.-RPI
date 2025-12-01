export const categories = [
  { id: 'outerwear', name: 'Верхняя одежда' },
  { id: 'sweaters', name: 'Свитеры' },
  { id: 'tshirts', name: 'Футболки' },
  { id: 'jeans', name: 'Джинсы / Брюки' },
  { id: 'shoes', name: 'Обувь' },
  { id: 'accessories', name: 'Аксессуары и Сумки' }
];

export const initialClothingItems = [
  {
    id: 1,
    name: 'Куртка',
    category: 'outerwear',
    color: 'коричневый',
    season: 'весна-осень',
    image: 'https://i.pinimg.com/1200x/00/52/1f/00521f9fd5f8378e85650f09af720521.jpg'
  },
  {
    id: 2,
    name: 'Шерстяной свитер',
    category: 'sweaters',
    color: 'серый',
    season: 'зима',
    image: 'https://i.pinimg.com/736x/7f/d1/04/7fd104dc8a6618952ec3255c8cdec0b5.jpg'
  },
  {
    id: 3,
    name: 'Хлопковая футболка',
    category: 'tshirts',
    color: 'белый',
    season: 'лето',
    image: 'https://i.pinimg.com/736x/01/e8/66/01e866d6642ac8a8aea5db72855533e5.jpg'
  },
  {
    id: 4,
    name: 'Джинсы',
    category: 'jeans',
    color: 'синий',
    season: 'всесезонные',
    image: 'https://i.pinimg.com/736x/ee/f9/7b/eef97b5bd25cef37b46befa254262c24.jpg'
  },
  {
    id: 5,
    name: 'Кроссовки',
    category: 'shoes',
    color: 'белый',
    season: 'всесезонные',
    image: 'https://i.pinimg.com/1200x/44/42/6c/44426c6ee68c5a8c9c14fdf5b469a061.jpg'
  },
  {
    id: 6,
    name: 'Шерстяная шапка',
    category: 'accessories',
    color: 'бежевый',
    season: 'зима',
    image: 'https://i.pinimg.com/1200x/30/ee/2d/30ee2d54469b652d9b6e82b5c64f3b1f.jpg'
  },
  {
    id: 7,
    name: 'Пальто',
    category: 'outerwear',
    color: 'бежевый',
    season: 'зима',
    image: 'https://i.pinimg.com/1200x/49/12/bb/4912bb1645ea03a22757c26d6487660a.jpg'
  },

];

export const outfits = [
  {
    description: 'Образ: Джинсы + Рубашка',
    title: 'Повседневный Стиль',
    status: 'Готов к носке'
  },
  {
    description: 'Образ: Платье + Пальто',
    title: 'Вечерний Выход',
    season: 'Осень'
  },
  {
    description: 'Образ: Спортивный Костюм',
    title: 'Для Тренировок',
    type: 'Спорт'
  }
];

export const galleryImages = Array(6).fill({});


export const seasons = [
  { id: 'all', name: 'Все сезоны' },
  { id: 'summer', name: 'Лето' },
  { id: 'winter', name: 'Зима' },
  { id: 'spring-autumn', name: 'Весна-Осень' },
  { id: 'all-season', name: 'Всесезонные' }
];
export const shoppingList = [
  {
    id: 1,
    name: 'Белая рубашка (классика)',
    store: 'Zara / Massimo Dutti',
    category: 'Верх',
    priority: 'high',
    notes: 'Искать классический крой',
    addedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    name: 'Теплый шарф (бежевый)',
    store: 'H&M / 12 Storeez',
    category: 'Аксессуары',
    priority: 'medium',
    addedAt: '2024-01-10T14:20:00Z'
  },
  {
    id: 3,
    name: 'Кожаные туфли',
    store: 'Massimo Dutti',
    category: 'Обувь',
    priority: 'high',
    notes: 'Черные, размер 42',
    addedAt: '2024-01-05T11:15:00Z'
  }
];