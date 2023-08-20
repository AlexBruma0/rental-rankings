"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../middlewares/auth");
const post_controllers_1 = require("./post.controllers");
const router = express_1.default.Router();
router.post("/", auth_1.isAuthenticated, post_controllers_1.CreatePost);
router.get("/", post_controllers_1.GetPosts);
router.get("/:id", post_controllers_1.GetPost);
router.put("/:id", auth_1.isAuthenticated, post_controllers_1.UpdatePost);
router.delete("/:id", auth_1.isAuthenticated, post_controllers_1.DeletePost);
exports.default = router;
