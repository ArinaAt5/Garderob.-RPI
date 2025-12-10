import ApiService from '../src/framework/view/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class WardrobeApiService extends ApiService {
  get clothings() {
    return this._load({ url: 'clothing' })
      .then(ApiService.parseResponse);
  }

  addClothing(clothing) {
    return this._load({
      url: 'clothing',
      method: Method.POST,
      body: JSON.stringify(clothing),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    })
      .then(ApiService.parseResponse);
  }

  updateClothing(clothing) {
    return this._load({
      url: `clothing/${clothing.id}`,
      method: Method.PUT,
      body: JSON.stringify(clothing),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    })
      .then(ApiService.parseResponse);
  }

  deleteClothing(id) {
    return this._load({
      url: `clothing/${id}`,
      method: Method.DELETE,
    });
  }
}