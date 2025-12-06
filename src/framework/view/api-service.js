export default class ApiService {
  constructor(baseURL = 'https://6931cf4611a8738467d0a56b.mockapi.io') {
    this._baseURL = baseURL;
  }

  async _fetch(path, options = {}) {
    const response = await fetch(`${this._baseURL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  get(path) {
    return this._fetch(path);
  }

  post(path, data) {
    return this._fetch(path, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put(path, data) {
    return this._fetch(path, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  delete(path) {
    return this._fetch(path, {
      method: 'DELETE',
    });
  }
}