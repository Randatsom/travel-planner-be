import EventSchema from "../models/Event.js";

export const create = async (req, res) => {
  try {
    const doc = new EventSchema({
      title: req.body.title,
      description: req.body.description,
      attendees: req.body.attendees,
      user: req.userId,
    });

    const event = await doc.save();

    res.json(event);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось создать пост",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const events = await EventSchema.find({ user: req.userId }).select(
      "_id title description",
    );

    res.json(events);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Не удалось получить события",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const event = await EventSchema.findOne({ _id: req.params.id })
      .populate({ path: "user", select: "-passwordHash" })
      .exec();

    res.json(event);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Не удалось получить событие",
    });
  }
};

export const update = async (req, res) => {
  try {
    await EventSchema.updateOne(
      { _id: req.params.id },
      {
        title: req.body.title,
        description: req.body.description,
        attendees: req.body.attendees,
        user: req.userId,
      },
    );

    res.json({
      success: true,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Не удалось обновить событие",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const event = await EventSchema.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Событие не найдено",
      });
    }

    res.json({
      success: true,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Не удалось удалить событие",
    });
  }
};
