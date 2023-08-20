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
exports.DeletePost = exports.UpdatePost = exports.GetPosts = exports.GetPost = exports.CreatePost = void 0;
const post_services_1 = require("./post.services");
const http_error_1 = __importDefault(require("../../utils/http-error"));
const CreatePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { title, rating, content, postPhotos } = req.body;
        const userId = ((_a = req.payload) === null || _a === void 0 ? void 0 : _a.id) || "";
        if (!userId) {
            throw new http_error_1.default("Unauthorized", 401);
        }
        if (!title || !content) {
            throw new http_error_1.default("Missing required fields", 400);
        }
        const newPost = yield (0, post_services_1.createPost)(userId, parseInt(rating) || 3, title, content, postPhotos);
        res.status(201).json({
            newPost,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.CreatePost = CreatePost;
const GetPosts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield (0, post_services_1.getAllPosts)();
        res.status(200).json({
            posts,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.GetPosts = GetPosts;
const GetPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const post = yield (0, post_services_1.getPost)(id);
        if (!post) {
            throw new http_error_1.default(`Post with id = ${id} does not exist`, 404);
        }
        res.status(200).json({
            post,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.GetPost = GetPost;
const UpdatePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { id } = req.params;
        const userId = ((_b = req.payload) === null || _b === void 0 ? void 0 : _b.id) || "";
        const { title, content, postPhotos, rating, deletePhotos } = req.body;
        if (!title || !content) {
            throw new http_error_1.default("Missing required fields", 400);
        }
        const post = yield (0, post_services_1.getPost)(id);
        if (!post) {
            throw new http_error_1.default(`Post with id = ${id} does not exist`, 404);
        }
        if (post.authorId !== userId) {
            throw new http_error_1.default("Unauthorized", 401);
        }
        if (postPhotos.includes(null)) {
            throw new http_error_1.default("Empty image URL input", 400);
        }
        const upPost = yield (0, post_services_1.updatePost)(id, title, parseInt(rating) || 3, content, postPhotos, deletePhotos);
        res.status(200).json({
            upPost,
        });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.UpdatePost = UpdatePost;
const DeletePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const { id } = req.params;
        const userId = ((_c = req.payload) === null || _c === void 0 ? void 0 : _c.id) || "";
        const post = yield (0, post_services_1.getPost)(id);
        if (!post) {
            throw new http_error_1.default(`Post with id = ${id} does not exist`, 404);
        }
        if (post.authorId !== userId) {
            throw new http_error_1.default("Unauthorized", 401);
        }
        yield (0, post_services_1.deletePost)(id);
        res.status(200).json({
            message: "Post deleted",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.DeletePost = DeletePost;
