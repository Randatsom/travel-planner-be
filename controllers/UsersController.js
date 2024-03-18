import UserSchema from "../models/User.js";

export const getAll = async (req, res) => {
  try {
    const users = await UserSchema.find().select("-passwordHash");
    res.json(users);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Не удалось получить всех пользователей",
    });
  }
};
