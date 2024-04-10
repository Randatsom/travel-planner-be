import express from "express";
import checkAuth from "../utils/checkAuth.js";
import * as EventsController from "../controllers/EventsController.js";
import { removeList } from "../controllers/EventsController.js";

const router = express.Router();

router.post("/create", checkAuth, EventsController.create);
router.get("/getAll", checkAuth, EventsController.getAll);
router.get(
  "/getParticipationEvents",
  checkAuth,
  EventsController.getParticipationEvents,
);
router.get("/:id", checkAuth, EventsController.getOne);
router.patch("/:id", checkAuth, EventsController.update);
router.delete("/:id", checkAuth, EventsController.remove);

router.get("/:eventId/lists/:listId", checkAuth, EventsController.getListById);
router.patch("/:eventId/lists/:listId", EventsController.updateList);
router.delete("/:eventId/lists/:listId", EventsController.removeList);

export default router;
