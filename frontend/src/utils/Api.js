class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }
  _headersJwt() {
    return {authorization: `Bearer ${localStorage.getItem('jwt')}`, ...this.headers}
  }
  // получаем профиль
  getProfile() {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: this._headersJwt(),
    }).then((res) => this._checkRes(res));
  }

  /// получаем карточки
  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem('jwt')}`
      },
    }).then((res) => this._checkRes(res));
  }

  // редактирование формы профиля
  editProfile(info) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem('jwt')}`
      },
      body: JSON.stringify({
        name: info.name,
        about: info.about,
      }),
    }).then((res) => this._checkRes(res));
  }

  //// добавление карточки
  addCard(data) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem('jwt')}`
      },
      body: JSON.stringify({
        name: data.name,
        link: data.link,
      }),
    }).then((res) => this._checkRes(res));
  }

  ////удаление своей карточки
  deleteCard(id) {
    return fetch(`${this._baseUrl}/cards/${id}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem('jwt')}`
      },
    }).then((res) => this._checkRes(res));
  }

  ////удаление лайка(снятие своего лайка)
  deleteLike(id) {
    return fetch(`${this._baseUrl}/cards/${id}/likes`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem('jwt')}`
      },
    }).then((res) => this._checkRes(res));
  }

  ////Установка лайка(ставим свой лайк = +1 к другим)
  addLike(id) {
    return fetch(`${this._baseUrl}/cards/${id}/likes`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem('jwt')}`
      },
    }).then((res) => this._checkRes(res));
  }

  ////Установка лайка(ставим свой лайк = +1 к другим)
  setAvatar(url) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem('jwt')}`
      },
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
 baseUrl: "https://api.domainname.lemon.nomoredomains.sbs",
  headers: {
    "Content-Type": "application/json",
    'Accept': 'application/json',
    // "Access-Control-Allow-Methods":"GET,HEAD,PUT,POST,PATCH,DELETE",
   //  "Access-Control-Allow-Credentials" : true,
  },
 // credentials: 'include',
});
