export default class LoadingViewComponent {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return `
      <div class="loading-view">
        <div class="loading-view__container">
          <div class="loading-view__spinner">
            <div class="loading-view__spinner-circle"></div>
          </div>
          <p class="loading-view__text">Загрузка гардероба...</p>
        </div>
      </div>
    `;
  }

  getElement() {
    if (!this._element) {
      const template = this.getTemplate();
      const element = document.createElement('div');
      element.innerHTML = template.trim();
      this._element = element.firstChild;
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}