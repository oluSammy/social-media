import {
  sendChatMessage,
  getChatMessages,
} from "../controllers/messageController";
import express from "express";

const router = express.Router();

router.route("/:id").post(sendChatMessage);
router.route("/chat-messages/:receiverId").get(getChatMessages);

export default router;
