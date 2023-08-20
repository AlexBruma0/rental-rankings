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
exports.updateProfile = exports.getUserById = exports.getUserByEmail = exports.createUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("../../utils/db");
const SALT_ROUNDS = 12;
const createUser = (email, password, displayName) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = bcrypt_1.default.hashSync(password, SALT_ROUNDS);
    const newUser = yield db_1.prismaClient.user.create({
        data: {
            email,
            password: hashedPassword,
            displayName,
        },
    });
    const newProfile = yield db_1.prismaClient.profile.create({
        data: {
            userId: newUser.id,
        },
    });
    return { newUser, newProfile };
});
exports.createUser = createUser;
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.prismaClient.user.findUnique({
        where: {
            email,
        },
    });
    return result;
});
exports.getUserByEmail = getUserByEmail;
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.prismaClient.user.findUnique({
        where: {
            id,
        },
    });
    const profile = yield db_1.prismaClient.profile.findUnique({
        where: {
            userId: id,
        },
    });
    return Object.assign(Object.assign({}, user), profile);
});
exports.getUserById = getUserById;
const updateProfile = (userId, avatarUrl, bio, email, displayName) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.prismaClient.profile.update({
        where: {
            userId: userId,
        },
        data: {
            avatarUrl: avatarUrl,
            bio: bio,
        },
    });
    const result2 = yield db_1.prismaClient.user.update({
        where: {
            id: userId,
        },
        data: {
            email: email,
            displayName: displayName,
        },
    });
    const finalResult = Object.assign(Object.assign({}, result), result2);
    return finalResult;
});
exports.updateProfile = updateProfile;
