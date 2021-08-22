import {
  sendChatMessage,
  getChatMessages,
  updateChatMessageStatus,
} from "../controllers/chatController";
import express from "express";

const router = express.Router();

router.route("/:id").post(sendChatMessage).put(updateChatMessageStatus);
router.route("/chat-messages/:receiverId").get(getChatMessages);

export default router;
