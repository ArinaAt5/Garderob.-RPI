import { createElement } from '../framework/render.js';

const createClothingFormTemplate = (categories = [], seasons = []) => `
  <div class="modal-overlay clothing-form-modal" id="addClothingModal" style="display: none;">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Добавить новую одежду</h3>
        <button class="modal-close" id="closeModal" type="button">&times;</button>
      </div>
      <form class="add-clothing-form" id="addClothingForm">
        <div class="form-group">
          <label for="clothingName">Название вещи *</label>
          <input type="text" id="clothingName" required placeholder="Например: Кофта">
        </div>
        
        <div class="form-group">
          <label for="clothingCategory">Категория *</label>
          <select id="clothingCategory" required>
            <option value="">Выберите категорию</option>
            ${categories.map(category => `
              <option value="${category.id}">${category.name}</option>
            `).join('')}
          </select>
        </div>
        
        <div class="form-group">
          <label for="clothingColor">Цвет</label>
          <input type="text" id="clothingColor" placeholder="Например: синий, черный, бежевый">
        </div>
        
        <div class="form-group">
          <label for="clothingSeason">Сезон</label>
          <select id="clothingSeason">
            <option value="">Любой сезон</option>
            ${seasons.map(season => `
              <option value="${season.id}">${season.name}</option>
            `).join('')}
          </select>
        </div>
        
        <div class="form-group">
          <label for="clothingImage">Ссылка на изображение </label>
          <input type="url" id="clothingImage" placeholder="https://example.com/image.jpg">
        </div>
        
        <div class="form-actions">
          <button type="button" class="btn btn-secondary" id="cancelAdd">Отмена</button>
          <button type="submit" class="btn btn-primary">Добавить в гардероб</button>
        </div>
      </form>
    </div>
  </div>
`;

export default class ClothingFormComponent {
  constructor(categories = [], seasons = [], onFormSubmit, onClose) {
    this.categories = categories;
    this.seasons = seasons;
    this.onFormSubmit = onFormSubmit;
    this.onClose = onClose;
    this.element = null;
  }

  getTemplate() {
    return createClothingFormTemplate(this.categories, this.seasons);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
      this.setListeners();
    }
    return this.element;
  }

  setListeners() {
    const form = this.element.querySelector('#addClothingForm');
    const closeBtn = this.element.querySelector('#closeModal');
    const cancelBtn = this.element.querySelector('#cancelAdd');
    const modal = this.element;

    if (form) {
      form.addEventListener('submit', (evt) => {
        evt.preventDefault();
        this.handleSubmit();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeModal());
    }

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => this.closeModal());
    }

    if (modal) {
      modal.addEventListener('click', (evt) => {
        if (evt.target === modal) {
          this.closeModal();
        }
      });
    }
  }

  handleSubmit() {
    const form = this.element.querySelector('#addClothingForm');
    if (!form) return;

    const formData = {
      clothingName: form.querySelector('#clothingName')?.value || '',
      clothingCategory: form.querySelector('#clothingCategory')?.value || '',
      clothingColor: form.querySelector('#clothingColor')?.value || '',
      clothingSeason: form.querySelector('#clothingSeason')?.value || '',
      clothingImage: form.querySelector('#clothingImage')?.value || ''
    };

    // Валидация
    if (!formData.clothingName.trim() || !formData.clothingCategory) {
      alert('Пожалуйста, заполните обязательные поля (Название и Категория)');
      return;
    }

    if (this.onFormSubmit) {
      this.onFormSubmit(formData);
      this.closeModal();
    }
  }

  openModal() {
    if (this.element) {
      this.element.style.display = 'block';
      setTimeout(() => {
        this.element.classList.add('active');
      }, 10);
      
      // Фокус на первое поле
      const nameInput = this.element.querySelector('#clothingName');
      if (nameInput) {
        nameInput.focus();
      }
    }
  }

  closeModal() {
    if (this.element) {
      this.element.classList.remove('active');
      setTimeout(() => {
        this.element.style.display = 'none';
      }, 300);
      
      const form = this.element.querySelector('#addClothingForm');
      if (form) {
        form.reset();
      }
      
      // if (this.onClose) {
      //   this.onClose();
      // }
    }
  }

  removeElement() {
    this.element = null;
  }
}