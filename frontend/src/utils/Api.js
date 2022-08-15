class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  // получаем профиль
  getProfile() {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: this._headers,
    }).then((res) => this._checkRes(res));
  }

  /// получаем карточки
  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._headers,
    }).then((res) => this._checkRes(res));
  }

  // редактирование формы профиля
  editProfile(info) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        name: info.name,
        about: info.about,
      }),
    }).then((res) => this._checkRes(res));
  }

  //// добавление карточки
  addCard(name, link) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        name,
        link,
      }),
    }).then((res) => this._checkRes(res));
  }

  ////удаление своей карточки
  deleteCard(id) {
    return fetch(`${this._baseUrl}/cards/${id}`, {
      method: "DELETE",
      headers: this._headers,
    }).then((res) => this._checkRes(res));
  }

  ////удаление лайка(снятие своего лайка)
  deleteLike(id) {
    return fetch(`${this._baseUrl}/cards/${id}/likes`, {
      method: "DELETE",
      headers: this._headers,
    }).then((res) => this._checkRes(res));
  }

  ////Установка лайка(ставим свой лайк = +1 к другим)
  addLike(id) {
    return fetch(`${this._baseUrl}/cards/${id}/likes`, {
      method: "PUT",
      headers: this._headers,
    }).then((res) => this._checkRes(res));
  }

  ////Установка лайка(ставим свой лайк = +1 к другим)
  setAvatar(url) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        avatar: url.avatar,
      }),
    }).then((res) => this._checkRes(res));
  }

  //определяем поставить или снять лайк
  changeLikeCardStatus(id, isLiked) {
    if (!isLiked) {
      return this.addLike(id);
    } else {
      return this.deleteLike(id);
    }
  }

  //если сервер вернет ошибку
  _checkRes(res) {
    return res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);
  }
}

export const api = new Api({
  baseUrl: `${window.location.protocol}${process.env.REACT_APP_API_URL || '//localhost:4000'}`,
  // "https://mesto.nomoreparties.co/v1/cohort-40",
  headers: {
    // authorization: "84100497-63df-4058-816a-2b7aa5f5e9d4",
    "Content-Type": "application/json",
    'Accept': 'application/json',
    'Access-Control-Request-Headers': 'http://localhost:3000',
    'Access-Control-Request-Headers': 'https://api.domainname.lemon.nomoredomains.sbs',
  },
  credentials: 'include',
});
