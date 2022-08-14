import React from "react";
import { useState } from "react";

function Login({ onSignIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSignIn(password, email);
  }

  return (
    <div className="popup__container popup__container_type_auth">
      <h2 className="popup__title popup__title_type_auth">Вход</h2>
      <form className="popup__form" onSubmit={handleSubmit}>
        <input
          value={email}
          onChange={handleEmailChange}
          className="popup__input popup__input_type_auth"
          type="email"
          minLength="2"
          maxLength="40"
          placeholder="Email"
          required
        />
        <input
          value={password}
          onChange={handlePasswordChange}
          className="popup__input popup__input_type_auth"
          type="password"
          minLength="2"
          maxLength="40"
          placeholder="Пароль"
          required
        />
        <button
          className="button popup__confirm-button popup__confirm-button_type_auth"
          type="submit"
        >
          Войти
        </button>
      </form>
    </div>
  );
}

export default Login;
