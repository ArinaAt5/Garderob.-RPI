import { createElement } from '../framework/render.js';

const createHeaderTemplate = () => `
  <header class="header">
    <div class="header-container">
      <h1 class="header-title">
        Планировщик гардероба
      </h1>
      <nav class="header-nav">
        <a href="#catalog" class="nav-link">Каталог</a>
        <a href="#outfits" class="nav-link">Комбинации</a>
        <a href="#gallery" class="nav-link">Галерея</a>
        <a href="#shopping" class="nav-link">Шопинг-лист</a>
      </nav>
      <button class="mobile-menu-button">
        <svg class="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
        </svg>
      </button>
    </div>
  </header>
`;

export default class HeaderComponent {
  constructor() {
    this.element = null;
  }

  getTemplate() {
    return createHeaderTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}