import React from "react";
import closeZoomPopup from '../images/popup/popup-close.svg';

function ImagePopup(props) {
  return (
    <div className={`popup popup_zoom ${props.isOpen && 'zoom_opened'}`}>
      <div className="zoom__card">
        <button className="button popup__close-button zoom__close-button" type="button" onClick={props.onClose}>
          <img className="popup__close zoom__close" src={closeZoomPopup} alt="Закрыть окно"/>
        </button>
        <img className="zoom__image" src={props.card.link} alt={`${props.card.name}`}/>
        <h3 className="zoom__image-description">{props.card.name}</h3>
      </div> 
  </div>
  );
}

export default ImagePopup;
