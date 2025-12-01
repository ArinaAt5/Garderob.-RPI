import { createElement } from '../framework/render.js';

const createGalleryImageTemplate = (image, index) => `
  <div class="gallery-image gallery-komb${index + 1}"></div>
`;

const createGalleryTemplate = (images) => `
  <section id="gallery" class="section gallery-section">
    <h2 class="section-title">
      Фотогалерея Образов
    </h2>
    <p class="section-description">
      Здесь сохраняются любимые и удачные комбинации.
    </p>

    <div class="gallery-grid">
      ${images.map((image, index) => createGalleryImageTemplate(image, index)).join('')}
    </div>
  </section>
`;

export default class GalleryComponent {
  constructor(images) {
    this.images = images;
  }

  getTemplate() {
    return createGalleryTemplate(this.images);
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