import { createElement } from '../framework/render.js';

const createOutfitTemplate = (outfit) => `
  <div class="outfit-card">
    <div class="outfit-image">
      ${outfit.description}
    </div>
    <h3 class="outfit-title">${outfit.title}</h3>
    ${outfit.status ? `<p class="outfit-status">${outfit.status}</p>` : ''}
    ${outfit.season ? `<p class="outfit-season">Сезон: ${outfit.season}</p>` : ''}
    ${outfit.type ? `<p class="outfit-type">Тип: ${outfit.type}</p>` : ''}
    <button class="btn ${outfit.status ? 'btn-primary' : 'btn-secondary'}">
      ${outfit.status ? 'Посмотреть детали' : 'Редактировать'}
    </button>
  </div>
`;

const createOutfitsTemplate = (outfits) => `
  <section id="outfits" class="section outfits-section">
    <h2 class="section-title">
      Идеи Комбинаций
    </h2>
    <p class="section-description">
      Рекомендации по созданию стильных образов на основе вашего гардероба.
    </p>

    <div class="outfits-grid">
      ${outfits.map(createOutfitTemplate).join('')}
    </div>
  </section>
`;

export default class OutfitsComponent {
  constructor(outfits) {
    this.outfits = outfits;
  }

  getTemplate() {
    return createOutfitsTemplate(this.outfits);
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