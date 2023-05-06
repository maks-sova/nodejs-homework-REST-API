const {
  getAllContacts,
  getContactById,
  addContact,
  deleteContact,
  putContact,
  patchContactFavorite,
} = require("./contacts");

const {
  userRegister,
  userLogin,
  userCurrent,
  userVerifyEmail,
  userVerifyEmailRepetedly,
  userLogout,
  userUpdateAvatar,
  userUpdateSubscription,
} = require("./users");

module.exports = {
  getAllContacts,
  getContactById,
  addContact,
  deleteContact,
  userVerifyEmail,
  userVerifyEmailRepetedly,
  putContact,
  patchContactFavorite,
  userRegister,
  userLogin,
  userCurrent,
  userLogout,
  userUpdateAvatar,
  userUpdateSubscription,
};