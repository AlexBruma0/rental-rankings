"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_error_1 = __importDefault(require("../utils/http-error"));
const errorHandler = (error, req, res, _) => {
    console.log(error);
    if (error instanceof http_error_1.default) {
        return res.status(error.statusCode).json({ message: error.message });
    }
    if (error instanceof SyntaxError) {
        return res.status(400).json({ message: "Invalid JSON" });
    }
    return res.status(500).json({ message: "Internal server error" });
};
exports.default = errorHandler;
