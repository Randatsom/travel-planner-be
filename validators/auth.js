const { body } = require("express-validator");

const registerValidation = [
  body("email", "Неверный формат почты").isEmail(),
  body("password", "Пароль должен содержать не менее 5 символов").isLength({
    min: 5,
  }),
  body("username", "Полное имя должно содержать более 3 символов").isLength({
    min: 3,
  }),
  body("avatarUrl").optional().isURL(),
];

module.exports = registerValidation
