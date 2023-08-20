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
exports.logout = exports.refreshToken = exports.login = exports.register = void 0;
const uuid_1 = require("uuid");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const jwt_1 = require("../../utils/jwt");
const users_services_1 = require("../users/users.services");
const auth_services_1 = require("./auth.services");
const http_error_1 = __importDefault(require("../../utils/http-error"));
const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, displayName } = req.body;
        if (!email || !password || !displayName) {
            throw new http_error_1.default("Missing required fields", 400);
        }
        if (!emailRegex.test(email)) {
            throw new http_error_1.default("Invalid email address", 400);
        }
        const user = yield (0, users_services_1.getUserByEmail)(email);
        if (user) {
            throw new http_error_1.default("Email already registered", 400);
        }
        const { newUser, newProfile } = yield (0, users_services_1.createUser)(email, password, displayName);
        const jti = (0, uuid_1.v4)();
        const { token, refreshToken } = (0, jwt_1.generateTokens)(newUser, jti);
        yield (0, auth_services_1.addRefreshTokenToWhitelist)(jti, refreshToken, newUser.id);
        res.status(201).json({
            user: {
                id: newUser.id,
                email: newUser.email,
                displayName: newUser.displayName,
                profile: {
                    id: newProfile.id,
                },
            },
            token,
            refreshToken,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.register = register;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new http_error_1.default("Missing required fields", 400);
        }
        const user = yield (0, users_services_1.getUserByEmail)(email);
        if (!user) {
            throw new http_error_1.default("Invalid credentials", 401);
        }
        const isPasswordValid = yield (0, bcrypt_1.compare)(password, user.password);
        if (!isPasswordValid) {
            throw new http_error_1.default("Invalid credentials", 401);
        }
        const jti = (0, uuid_1.v4)();
        const { token, refreshToken } = (0, jwt_1.generateTokens)(user, jti);
        yield (0, auth_services_1.addRefreshTokenToWhitelist)(jti, refreshToken, user.id);
        res.status(200).json({ token, refreshToken });
    }
    catch (error) {
        next(error);
    }
});
exports.login = login;
const refreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            throw new http_error_1.default("Missing required fields", 400);
        }
        const payload = (0, jsonwebtoken_1.verify)(refreshToken, process.env.JWT_REFRESH_SECRET);
        if (typeof payload !== "object" || !payload.jti || !payload.id) {
            throw new http_error_1.default("Unauthorized", 401);
        }
        const savedRefreshToken = yield (0, auth_services_1.findRefreshTokenById)(payload.jti);
        if (!savedRefreshToken || savedRefreshToken.revoked) {
            throw new http_error_1.default("Unauthorized", 401);
        }
        const user = yield (0, users_services_1.getUserById)(payload.id);
        if (!user) {
            throw new http_error_1.default("Unauthorized", 401);
        }
        yield (0, auth_services_1.revokeRefreshToken)(savedRefreshToken.id);
        const newJti = (0, uuid_1.v4)();
        const { token, refreshToken: newRefreshToken } = (0, jwt_1.generateTokens)(user, newJti);
        yield (0, auth_services_1.addRefreshTokenToWhitelist)(newJti, newRefreshToken, user.id || "");
        res.status(200).json({ token, refreshToken: newRefreshToken });
    }
    catch (error) {
        next(error);
    }
});
exports.refreshToken = refreshToken;
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            throw new http_error_1.default("Missing required fields", 400);
        }
        const payload = (0, jsonwebtoken_1.verify)(refreshToken, process.env.JWT_REFRESH_SECRET);
        if (typeof payload !== "object" || !payload.jti) {
            throw new http_error_1.default("Unauthorized", 401);
        }
        const savedRefreshToken = yield (0, auth_services_1.findRefreshTokenById)(payload.jti);
        if (!savedRefreshToken || savedRefreshToken.revoked) {
            throw new http_error_1.default("Unauthorized", 401);
        }
        yield (0, auth_services_1.revokeRefreshTokensByUserId)(savedRefreshToken.userId);
        res.status(200).json({ message: "Logged out" });
    }
    catch (error) {
        next(error);
    }
});
exports.logout = logout;
