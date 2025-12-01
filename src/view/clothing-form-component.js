import { createElement } from '../framework/render.js';

const createClothingFormTemplate = () => `
  <div class="modal-overlay" id="addClothingModal">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Добавить новую одежду</h3>
        <button class="modal-close" id="closeModal">&times;</button>
      </div>
      <form class="add-clothing-form" id="addClothingForm">
        <div class="form-group">
          <label for="clothingName">Название вещи *</label>
          <input type="text" id="clothingName" required placeholder="Например: Синий джинсовый жакет">
        </div>
        
        <div class="form-group">
          <label for="clothingCategory">Категория *</label>
          <select id="clothingCategory" required>
            <option value="">Выберите категорию</option>
            <option value="outerwear">Верхняя одежда</option>
            <option value="sweaters">Свитеры</option>
            <option value="tshirts">Футболки</option>
            <option value="jeans">Джинсы / Брюки</option>
            <option value="shoes">Обувь</option>
            <option value="accessories">Аксессуары и Сумки</option>
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
            <option value="winter">Зима</option>
            <option value="spring">Весна</option>
            <option value="summer">Лето</option>
            <option value="autumn">Осень</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="clothingImage">Ссылка на изображение (опционально)</label>
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
  constructor(onFormSubmit, onClose) {
    this.onFormSubmit = onFormSubmit;
    this.onClose = onClose;
    this.element = null;
  }

  getTemplate() {
    return createClothingFormTemplate();
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

    form.addEventListener('submit', (evt) => {
      evt.preventDefault();
      const formData = {
        clothingName: form.querySelector('#clothingName').value,
        clothingCategory: form.querySelector('#clothingCategory').value,
        clothingColor: form.querySelector('#clothingColor').value,
        clothingSeason: form.querySelector('#clothingSeason').value,
        clothingImage: form.querySelector('#clothingImage').value
      };
      this.onFormSubmit(formData);
    });

    closeBtn.addEventListener('click', () => this.closeModal());
    cancelBtn.addEventListener('click', () => this.closeModal());

    modal.addEventListener('click', (evt) => {
      if (evt.target === modal) {
        this.closeModal();
      }
    });
  }

  openModal() {
    this.element.classList.add('active');
  }

  closeModal() {
    this.element.classList.remove('active');
    this.element.querySelector('#addClothingForm').reset();
    if (this.onClose) {
      this.onClose();
    }
  }

  removeElement() {
    this.element = null;
  }
}