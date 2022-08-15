class ApiAuthorize {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  _checkRes(res) {
    return res.ok
      ? res.json()
      : res.json().then((data) => {
          throw new Error(data.message);
        });
  }

  login(password, email) {
    return fetch(`${this._baseUrl}/signin`, {
      method: "POST",
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify({
        password: password,
        email: email,
      }),
    }).then((res) => this._checkRes(res));
  }

  registration(password, email) {
    return fetch(`${this._baseUrl}/signup`, {
      method: "POST",
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify({
        password: password,
        email: email,
      }),
    }).then((res) => this._checkRes(res));
  }

  getUserData(jwt) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    }).then((res) => this._checkRes(res));
  }
}

export const apiAuthorize = new ApiAuthorize({
  baseUrl: `${window.location.protocol}${process.env.REACT_APP_API_URL || '//localhost:4000'}`,

  headers: {
    "Content-Type": "application/json",
    'Access-Control-Request-Headers': 'http://localhost:3000',
    'Access-Control-Request-Headers': 'https://domainname.lemon.nomoredomains.sbs',
  },
});
