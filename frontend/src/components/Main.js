import React from "react";
import userEditButton from "../images/profile/profile-edit.svg";
import addCardButton from "../images/profile/profile-plus.svg";
import Card from "./Card";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Main({
  onEditProfile,
  onAddPlace,
  onEditAvatar,
  onCardClick,
  cards,
  onCardDelete,
  onCardLike,
}) {
  const currentUser = React.useContext(CurrentUserContext);
  
  return (
    <main className="content">
      <section className="profile">
        <div className="profile__date">
          <button
            type="button"
            name="avatar"
            className="profile__avatar"
            onClick={onEditAvatar}
          ></button>
          <img
            className="profile__photo"
            src={currentUser.avatar}
            alt="Фото автора"
          />
          <div className="profile__information">
            <div className="profile__text">
              <h1 className="profile__name">{currentUser.name}</h1>
              <p className="profile__profession">{currentUser.about}</p>
            </div>
            <button
              className="button profile__edit-button"
              type="button"
              onClick={onEditProfile}
            >
              <img
                className="profile__edit"
                src={userEditButton}
                alt="Кнопка редактировать"
              />
            </button>
          </div>
        </div>
        <button
          className="button profile__button-add"
          type="button"
          onClick={onAddPlace}
        >
          <img
            className="profile__button-plus"
            src={addCardButton}
            alt="Кнопка добавить"
          />
        </button>
      </section>
      <section className="elements">
        {cards.map((card) => (
          <Card
            card={card}
            key={card._id}
            onCardClick={onCardClick}
            onCardDelete={onCardDelete}
            onCardLike={onCardLike}
          />
        ))}
      </section>
    </main>
  );
}

export default Main;
