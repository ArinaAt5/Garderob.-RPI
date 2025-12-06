import { createElement } from "../render.js";

export class AbstractComponent {
  #element = null;
  
  constructor() {
    if (new.target === AbstractComponent) {
      throw new Error("Can't instantiate abstract class");
    }
  }
  
  getElement() {
    if (!this.#element) {
      this.#element = createElement(this.getTemplate());
    }
    return this.#element;
  }
  
  getTemplate() {
    throw new Error("No template defined");
  }
  
  removeElement() {
    this.#element = null;
  }
}