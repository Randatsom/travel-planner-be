import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import UserSchema from "../models/User.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
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
};

export const login = async (req, res) => {
  try {
    const user = await UserSchema.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        message: "Неверный логин или пароль",
      });
    }

    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.passwordHash,
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
};

export const checkAuth = async (req, res) => {
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
};
