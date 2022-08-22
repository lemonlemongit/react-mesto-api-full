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
      credentials: 'include',
    }).then((res) => this._checkRes(res));
  }
}

export const apiAuthorize = new ApiAuthorize({
  baseUrl: "https://api.domainname.lemon.nomoredomains.sbs",
  headers: {
    "Content-Type": "application/json",
    'Accept': 'application/json',
    "Access-Control-Allow-Methods":"GET,HEAD,PUT,POST,PATCH,DELETE",
    "Access-Control-Allow-Credentials" : true,
    "Access-Control-Allow-Headers" : "Origin, X-Requested-With, Content-Type, Accept",
  },
  credentials: 'include',
});
 