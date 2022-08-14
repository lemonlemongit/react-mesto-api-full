import React from "react";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { api } from "../utils/Api";
import { useState } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./Login";
import Register from "./Register";
import { apiAuthorize } from "../utils/ApiAuthorize";
import InfoTooltip from "./InfoTooltip";

function App() {
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({});
  const [userEmail, setUserEmail] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState({ successful: false, message: "" });
  const history = useHistory();
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleCardClick(card) {
    setIsImagePopupOpen(true);
    setSelectedCard(card);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsImagePopupOpen(false);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api
      .changeLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((res) => console.log(res));
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then((res) => {
        setCards((state) => state.filter((c) => c._id !== card._id));
        closeAllPopups();
      })
      .catch((res) => console.log(res));
  }

  function handleUpdateUser(info) {
    api
      .editProfile(info)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((res) => console.log(res));
  }

  function handleUpdateAvatar(url) {
    api
      .setAvatar(url)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((res) => console.log(res));
  }

  function handleAddPlaceSubmit(data) {
    api
      .addCard(data.name, data.link)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((res) => console.log(res));
  }

  React.useEffect(() => {
    if (loggedIn) {
      api
        .getProfile()
        .then((res) => {
          setCurrentUser(res);
        })
        .catch((res) => console.log(res));

      api
        .getInitialCards()
        .then((res) => {
          setCards(res);
        })
        .catch((res) => console.log(res));
    }
    handleTokenCheck();
  }, [loggedIn]);

  function handleTokenCheck() {
    if (localStorage.getItem("jwt")) {
      const jwt = localStorage.getItem("jwt");
      if (jwt) {
        apiAuthorize
          .getUserData(jwt)
          .then((data) => {
            if (data) {
              setLoggedIn(true);
              history.push("/");
              setUserEmail(data.data.email);
            }
          })
          .catch((res) => console.log(res));
      }
    }
  }

  function handleLogin() {
    setLoggedIn(true);
    handleTokenCheck();
  }

  function handleSignIn(password, email) {
    apiAuthorize
      .login(password, email)
      .then((res) => {
        if (res.token) {
          localStorage.setItem("jwt", res.token);
          handleLogin();
          history.push("/");
        }
      })
      .catch((res) => {
        setIsInfoTooltipOpen(true);
        setMessage({
          successful: false,
          message: "Что-то пошло не так! Попробуйте ещё раз.",
        });
      });
  }

  function handleRegistration(password, email) {
    apiAuthorize
      .registration(password, email)
      .then((res) => {
        if (res) {
          setIsInfoTooltipOpen(true);
          setMessage({
            successful: true,
            message: "Вы успешно зарегистрировались!",
          });
        }
      })
      .catch((res) => {
        setIsInfoTooltipOpen(true);
        setMessage({
          successful: false,
          message: "Что-то пошло не так! Попробуйте ещё раз.",
        });
      });
  }

  function redirectUserAfterRegistration() {
    if (message.successful) {
      redirectToLogin();
    }
  }

  function redirectToRegistration() {
    history.push("/signup");
  }

  function signOut() {
    localStorage.removeItem("jwt");
    history.push("/signin");
  }

  function redirectToLogin() {
    history.push("/signin");
  }

  function closeInfoTooltip() {
    setIsInfoTooltipOpen(false);
    redirectUserAfterRegistration();
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Switch>
          <Route path="/signin">
            <Header
              buttonName={"Зарегистрироваться"}
              handleClick={redirectToRegistration}
            />
            <Login onSignIn={handleSignIn} />
          </Route>

          <Route path="/signup">
            <Header buttonName={"Войти"} handleClick={redirectToLogin} />
            <Register onSignup={handleRegistration} />
          </Route>

          <ProtectedRoute exact path="/" loggedIn={loggedIn}>
            <Header
              buttonName={"Выйти"}
              handleClick={signOut}
              userEmail={userEmail}
            />

            <Main
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              onCardClick={handleCardClick}
              cards={cards}
              onCardDelete={handleCardDelete}
              onCardLike={handleCardLike}
            />
          </ProtectedRoute>
        </Switch>

        <Footer />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />

        <ImagePopup
          card={selectedCard}
          isOpen={isImagePopupOpen}
          onClose={closeAllPopups}
        />
      </div>

      <InfoTooltip
        isOpen={isInfoTooltipOpen}
        onClose={closeInfoTooltip}
        successful={message.successful}
        message={message.message}
      />
    </CurrentUserContext.Provider>
  );
}

export default App;
