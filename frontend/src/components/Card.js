import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Card(props) {
  const currentUser = React.useContext(CurrentUserContext);

  // Определяем пользователя и опред.должна ли появляться кнопка удаления карточки
  const isOwn = props.card.owner._id === currentUser._id;
  const cardDeleteButtonClassName = ` ${
    isOwn ? "element__delete" : "element__delete_disabled"
  }`;

  // Определяем, есть ли у карточки лайк, поставленный текущим пользователем
  const isLiked = props.card.likes.some((i) => i._id === currentUser._id);
  // Создаём переменную, которую после зададим в `className` для кнопки лайка
  const cardLikeButtonClassName = `element__like ${
    isLiked ? "element__like_active" : "element__like"
  }`;

  function handleClick() {
    props.onCardClick(props.card);
  }

  function handleDeleteClick() {
    props.onCardDelete(props.card);
  }

  function handleLikeClick() {
    props.onCardLike(props.card);
  }

  return (
    <div className="element" key={props.card.id}>
      <img
        className="element__image"
        onClick={handleClick}
        src={props.card.link}
        alt={`${props.card.name}`}
      />
      <button
        className={cardDeleteButtonClassName}
        onClick={handleDeleteClick}
      ></button>
      <div className="element__about">
        <h2 className="element__name">{props.card.name}</h2>
        <div className="element__like-block">
          <button
            className={cardLikeButtonClassName}
            onClick={handleLikeClick}
            type="submit"
          ></button>
          <span className="element__like-count">{props.card.likes.length}</span>
        </div>
      </div>
    </div>
  );
}

export default Card;
