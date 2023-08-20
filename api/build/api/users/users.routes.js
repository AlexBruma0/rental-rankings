"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_controllers_1 = require("./users.controllers");
const auth_1 = require("../../middlewares/auth");
const router = express_1.default.Router();
// regex for UUID
const idRegex = "[0-9a-fA-F]{8}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{12}";
const emailRegex = "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}";
router.get(`/:id(${idRegex})`, users_controllers_1.GetUserById);
router.put(`/:id(${idRegex})`, auth_1.isAuthenticated, users_controllers_1.UpdateUser);
router.get(`/:email(${emailRegex})`, users_controllers_1.GetUserByEmail);
exports.default = router;
