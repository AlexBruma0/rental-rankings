"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokens = exports.generateRefreshToken = exports.generateToken = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const generateToken = (user) => {
    return jwt.sign({
        id: user.id,
        email: user.email,
        displayName: user.displayName,
    }, process.env.JWT_ACCESS_SECRET, {
        // expiresIn: "15m",
        expiresIn: "2d", // temporary fix
    });
};
exports.generateToken = generateToken;
const generateRefreshToken = (user, jti) => {
    return jwt.sign({
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        jti,
    }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "7d",
    });
};
exports.generateRefreshToken = generateRefreshToken;
const generateTokens = (user, jti) => {
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user, jti);
    return { token, refreshToken };
};
exports.generateTokens = generateTokens;
