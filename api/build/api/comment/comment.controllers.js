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
exports.GetComment = exports.DeleteComment = exports.UpdateComment = exports.CreateComment = void 0;
const comment_services_1 = require("./comment.services");
const http_error_1 = __importDefault(require("../../utils/http-error"));
const CreateComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { content, postId } = req.body;
        const userId = ((_a = req.payload) === null || _a === void 0 ? void 0 : _a.id) || "";
        if (!userId) {
            throw new http_error_1.default("Unauthorized", 401);
        }
        if (!content || !postId) {
            throw new http_error_1.default("Missing required fields", 400);
        }
        const newComment = yield (0, comment_services_1.createComment)(content, postId, userId);
        res.status(201).json({
            newComment,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.CreateComment = CreateComment;
const GetComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const comment = yield (0, comment_services_1.getComment)(id);
        if (!comment) {
            throw new http_error_1.default(`Comment with id = ${id} does not exist`, 404);
        }
        res.status(200).json({
            comment,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.GetComment = GetComment;
const UpdateComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { id } = req.params;
        const { content } = req.body;
        const userId = ((_b = req.payload) === null || _b === void 0 ? void 0 : _b.id) || "";
        if (!content) {
            throw new http_error_1.default("Missing required fields", 400);
        }
        const comment = yield (0, comment_services_1.getComment)(id);
        if (!comment) {
            throw new http_error_1.default(`Comment with id = ${id} does not exist`, 404);
        }
        if (comment.authorId !== userId) {
            throw new http_error_1.default("Unauthorized", 401);
        }
        const updatedComment = yield (0, comment_services_1.updateComment)(id, content);
        res.status(200).json({
            updatedComment,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.UpdateComment = UpdateComment;
const DeleteComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const { id } = req.params;
        const userId = ((_c = req.payload) === null || _c === void 0 ? void 0 : _c.id) || "";
        const comment = yield (0, comment_services_1.getComment)(id);
        if (!comment) {
            throw new http_error_1.default(`Comment with id = ${id} does not exist`, 404);
        }
        if (comment.authorId !== userId) {
            throw new http_error_1.default("Unauthorized", 401);
        }
        yield (0, comment_services_1.deleteComment)(id);
        res.status(200).json({
            message: "Comment deleted",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.DeleteComment = DeleteComment;
