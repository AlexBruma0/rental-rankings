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
Object.defineProperty(exports, "__esModule", { value: true });
exports.revokeRefreshTokensByUserId = exports.revokeRefreshToken = exports.findRefreshTokenById = exports.addRefreshTokenToWhitelist = void 0;
const hashToken_1 = require("../../utils/hashToken");
const db_1 = require("../../utils/db");
function addRefreshTokenToWhitelist(jti, refreshToken, userId) {
    return db_1.prismaClient.refreshToken.create({
        data: {
            id: jti,
            hashedToken: (0, hashToken_1.hashToken)(refreshToken),
            userId,
        },
    });
}
exports.addRefreshTokenToWhitelist = addRefreshTokenToWhitelist;
const findRefreshTokenById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.prismaClient.refreshToken.findUnique({
        where: {
            id,
        },
    });
    return result;
});
exports.findRefreshTokenById = findRefreshTokenById;
const revokeRefreshToken = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.prismaClient.refreshToken.update({
        where: {
            id,
        },
        data: {
            revoked: true,
        },
    });
    return result;
});
exports.revokeRefreshToken = revokeRefreshToken;
const revokeRefreshTokensByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.prismaClient.refreshToken.updateMany({
        where: {
            userId,
        },
        data: {
            revoked: true,
        },
    });
    return result;
});
exports.revokeRefreshTokensByUserId = revokeRefreshTokensByUserId;
