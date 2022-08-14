import React from "react";
import closeButton from "../images/popup/popup-close.svg";

function InfoTooltip(props) {
  return (
    <div className={`popup  ${props.isOpen ? "popup_opened" : ""}`}>
      <div className="popup__container">
        <div
          className={`${
            props.successful ? "popup__image-success" : "popup__image-error"
          }`}
        ></div>
        <p className="popup__message-text">{props.message}</p>
        <button
          className="button popup__close-button"
          onClick={props.onClose}
          type="button"
        >
          <img className="popup__close" src={closeButton} alt="Закрыть" />
        </button>
      </div>
    </div>
  );
}

export default InfoTooltip;
