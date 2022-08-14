import React from "react";
import closeButton from '../images/popup/popup-close.svg';

function PopupWithForm(props) {
  return (
    <div className={`popup popup_${props.name} ${props.isOpen ? "popup_opened" : ''}`}>
      <div className="popup__container">
        <button className="button popup__close-button" type="button" onClick={props.onClose}>
          <img className="popup__close" src={closeButton} alt="Закрыть окно"/>
        </button>
        <h2 className="popup__title">{props.title}</h2>
        <form name={props.name} onSubmit={props.onSubmit} className={`popup__form popup__form_${props.name}`} noValidate>
          {props.children}
          <button className="button popup__confirm-button" type="submit">{props.buttonName}</button>
        </form>
      </div>
    </div>
  );
}

export default PopupWithForm;
