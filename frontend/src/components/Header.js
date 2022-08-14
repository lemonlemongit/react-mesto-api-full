import React from "react";
import logo from "../images/header/header-logo.svg";

function Header(props) {
  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="Логотип сайта" />
      <div className="header__container">
        <p className="header__user-email">{props.userEmail}</p>
        <button
          className="button header__button"
          type="button"
          onClick={props.handleClick}
        >
          {props.buttonName}
        </button>
      </div>
    </header>
  );
}

export default Header;
