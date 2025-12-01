import { createElement } from '../framework/render.js';

const createFooterTemplate = () => `
  <footer class="footer">
    <p class="footer-text">&copy; 2025 Гардероб Планировщик. Все права защищены.</p>
  </footer>
`;

export default class FooterComponent {
  getTemplate() {
    return createFooterTemplate();
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