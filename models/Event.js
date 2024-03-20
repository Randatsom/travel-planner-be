import mongoose from "mongoose";

const ListItemSchema = new mongoose.Schema({
  id: String,
  title: String,
  iconName: String,
  items: Array,
  completed: Number,
});

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      default: "",
    },
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    lists: {
      type: [ListItemSchema],
    },
  },
  { timestamps: true },
);

export default mongoose.model("Event", EventSchema);
