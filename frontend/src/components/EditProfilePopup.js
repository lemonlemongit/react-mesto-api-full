import React from "react";
import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function EditProfilePopup(props) {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");

  const currentUser = React.useContext(CurrentUserContext);

  function handleChangeName(e) {
    setName(e.target.value);
  }

  function handleChangeDescription(e) {
    setDescription(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    props.onUpdateUser({
      name,
      about: description,
    });
  }

  React.useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, props.isOpen]);

  return (
    <PopupWithForm
      name={"edit-block"}
      title={"Редактировать профиль"}
      buttonName={"Сохранить"}
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
    >
      <input
        value={name || ''}
        onChange={handleChangeName}
        id="name"
        className="popup__input_type_name popup__input"
        type="text"
        name="name"
        placeholder="Введите имя автора"
        minLength="2"
        maxLength="40"
        required
      />
      <span className="popup__error" id="name-error"></span>
      <input
        value={description || ''}
        onChange={handleChangeDescription}
        id="profession"
        className="popup__input_type_profession popup__input"
        type="text"
        name="description"
        placeholder="Введите профессию"
        minLength="2"
        maxLength="200"
        required
      />
      <span className="popup__error" id="profession-error"></span>
    </PopupWithForm>
  );
}

export default EditProfilePopup;
