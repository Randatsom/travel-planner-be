import EventSchema from "../models/Event.js";
import User from "../models/User.js";

export const create = async (req, res) => {
  try {
    const attendeesModels = await Promise.all(
      req.body.attendees.map((userId) => User.findById(userId)),
    );

    const doc = new EventSchema({
      title: req.body.title,
      description: req.body.description,
      attendees: attendeesModels,
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
    const events = await EventSchema.find()
      .populate("attendees", "-passwordHash")
      .populate({ path: "user", select: "-passwordHash" })
      .select("_id title description completed attendees")
      .sort({ createdAt: -1 });

    res.json(events);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Не удалось получить события",
    });
  }
};

export const getParticipationEvents = async (req, res) => {
  try {
    const events = await EventSchema.find({
      attendees: req.userId,
    })
      .populate("attendees", "-passwordHash")
      .populate({ path: "user", select: "-passwordHash" })
      .select("_id title description completed attendees user")
      .sort({ createdAt: -1 });

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
        completed: req.body.completed,
        lists: req.body.lists,
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

export const getListById = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const listId = req.params.listId;

    const event = await EventSchema.findOne({ _id: eventId });

    if (!event) {
      return res.status(404).json({
        message: "Событие не найдено",
      });
    }

    const list = event.lists.find((list) => list._id.toString() === listId);

    if (!list) {
      return res.status(404).json({
        message: "Список не найден",
      });
    }

    res.json(list);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Не удалось получить список",
    });
  }
};

export const updateList = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const listId = req.params.listId;
    const listData = req.body;

    const event = await EventSchema.findOne({ _id: eventId });

    if (!event) {
      return res.status(404).json({
        message: "Событие не найдено",
      });
    }

    const listIndex = event.lists.findIndex(
      (list) => list._id.toString() === listId,
    );

    if (listIndex === -1) {
      return res.status(404).json({
        message: "Список не найден",
      });
    }

    event.lists[listIndex] = { ...event.lists[listIndex], ...listData };

    await event.save();

    res.json(event.lists[listIndex]);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Не удалось обновить список",
    });
  }
};

export const removeList = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const listId = req.params.listId;

    const event = await EventSchema.findOne({ _id: eventId });

    if (!event) {
      return res.status(404).json({
        message: "Событие не найдено",
      });
    }

    event.lists = event.lists.filter((list) => list._id.toString() !== listId);

    await event.save();

    res.json({ success: true });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Не удалось удалить список",
    });
  }
};
