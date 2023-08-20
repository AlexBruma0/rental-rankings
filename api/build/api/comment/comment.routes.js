"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../middlewares/auth");
const comment_controllers_1 = require("./comment.controllers");
const router = express_1.default.Router();
router.post("/", auth_1.isAuthenticated, comment_controllers_1.CreateComment);
router.get("/:id", comment_controllers_1.GetComment);
router.put("/:id", auth_1.isAuthenticated, comment_controllers_1.UpdateComment);
router.delete("/:id", auth_1.isAuthenticated, comment_controllers_1.DeleteComment);
exports.default = router;
