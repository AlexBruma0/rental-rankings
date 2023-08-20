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
exports.UpdateUser = exports.GetUserById = exports.GetUserByEmail = void 0;
const users_services_1 = require("./users.services");
const http_error_1 = __importDefault(require("../../utils/http-error"));
const GetUserByEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.params;
        const user = yield (0, users_services_1.getUserByEmail)(email);
        if (!user) {
            throw new http_error_1.default(`User with email = ${email} does not exist`, 404);
        }
        res.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                displayName: user.displayName,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.GetUserByEmail = GetUserByEmail;
const GetUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paramId = req.params.id;
        const user = yield (0, users_services_1.getUserById)(paramId);
        if (!user) {
            throw new http_error_1.default(`User with id = ${paramId} does not exist`, 404);
        }
        res.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                displayName: user.displayName,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                avatarUrl: user.avatarUrl,
                bio: user.bio,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.GetUserById = GetUserById;
const UpdateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const payloadId = ((_a = req.payload) === null || _a === void 0 ? void 0 : _a.id) || "";
        const paramId = req.params.id;
        if (paramId !== payloadId)
            throw new http_error_1.default("user not authenticated", 401);
        const { avatarUrl, bio, email, displayName } = req.body;
        if (!displayName || !email) {
            throw new http_error_1.default("Missing required display name, email cannot update", 400);
        }
        const updatedProfile = yield (0, users_services_1.updateProfile)(payloadId, avatarUrl, bio, email, displayName);
        res.status(200).json({
            updatedProfile,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.UpdateUser = UpdateUser;
