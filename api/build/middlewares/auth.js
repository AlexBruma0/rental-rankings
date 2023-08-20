"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const http_error_1 = __importDefault(require("../utils/http-error"));
const isAuthenticated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
    if (!token) {
        return next(new http_error_1.default("Missing token", 400));
    }
    try {
        const decoded = (0, jsonwebtoken_1.verify)(token, process.env.JWT_ACCESS_SECRET);
        if (typeof decoded !== "object") {
            throw new http_error_1.default("Invalid token", 401);
        }
        req.payload = decoded;
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
            return next(new http_error_1.default("Unauthorized", 401));
        }
        return next(error);
    }
    return next();
});
exports.isAuthenticated = isAuthenticated;
