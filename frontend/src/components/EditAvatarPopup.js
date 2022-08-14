import React from "react";
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup(props) {
  const editAvatarRef = React.useRef();

  function handleSubmit(e) {
    e.preventDefault();
    props.onUpdateAvatar({
      avatar: editAvatarRef.current.value,
    });
  }

  React.useEffect(() => {
    editAvatarRef.current.value = "";
  }, [props.isOpen]);
  
  return (
    <PopupWithForm
      name={"avatar-block"}
      title={"Обновить аватар"}
      buttonName={"Сохранить"}
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
    >
      <input
        ref={editAvatarRef}
        id="avatar"
        className="popup__input"
        name="name"
        placeholder="Введите ссылку"
        type="url"
        minLength="2"
        maxLength="400"
        required
      />
      <span className="popup__error" id="avatar-error"></span>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;
