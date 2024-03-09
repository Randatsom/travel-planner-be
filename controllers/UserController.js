const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const UserSchema = require('../models/User');
const jwt = require('jsonwebtoken');

const UserController = {
  register: async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const password = req.body.password;
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const doc = new UserSchema({
        email: req.body.email,
        username: req.body.username,
        passwordHash: hash,
      });

      const user = await doc.save();

      const token = jwt.sign(
          {
            _id: user._id,
          },
          "secret123",
          {
            expiresIn: "30d",
          },
      );

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, ...userData } = user._doc;

      res.json({
        ...userData,
        token,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Не удалось зарегестрироваться",
      });
    }
  },

  login: async (req, res) => {
    try {
      const user = await UserSchema.findOne({ email: req.body.email });

      if (!user) {
        return res.status(404).json({
          message: "Неверный логин или пароль",
        });
      }

      const isValidPassword = bcrypt.compare(
          req.body.password,
          user._doc.passwordHash,
      );

      if (!isValidPassword) {
        return res.status(500).json({
          message: "Неверный логин или пароль",
        });
      }

      const token = jwt.sign(
          {
            _id: user._id,
          },
          "secret123",
          {
            expiresIn: "30d",
          },
      );

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, ...userData } = user._doc;

      res.json({
        ...userData,
        token,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Не удалось авторизоваться",
      });
    }
  },

  checkAuth: async (req, res) => {
    try {
      const user = await UserSchema.findById(req.userId);

      if (!user) {
        return res.status(404).json({
          message: "Пользователь не найден",
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, ...userData } = user._doc;

      res.json({
        ...userData,
      });
    } catch (e) {
      res.status(403).json({
        message: "Нет доступа",
      });
    }
  },
};

module.exports = UserController;
