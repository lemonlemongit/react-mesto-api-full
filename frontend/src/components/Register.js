import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

function Register({ onSignup }) {
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
    onSignup(password, email);
  }

  return (
    <div className="popup__container popup__container_type_auth">
      <h2 className="popup__title popup__title_type_auth">Регистрация</h2>
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
          Зарегистрироваться
        </button>
        <Link
          to="/signin"
          className="button popup__confirm-button popup__redirect"
        >
          Уже зарегистрированы? Войти
        </Link>
      </form>
    </div>
  );
}

export default Register;
