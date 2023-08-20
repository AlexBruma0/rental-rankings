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
exports.deletePost = exports.updatePost = exports.getAllPosts = exports.createPostPhoto = exports.getPost = exports.createPost = void 0;
const db_1 = require("../../utils/db");
const google_map_1 = require("../../utils/google-map");
const createPost = (authorId, rating, title, content, postPhotos = []) => __awaiter(void 0, void 0, void 0, function* () {
    const newPost = yield db_1.prismaClient.post.create({
        data: {
            title,
            content,
            rating,
            authorId,
            postPhotos: {
                create: postPhotos.map((photo) => ({
                    url: photo.url,
                })),
            },
        },
        include: {
            author: {
                select: {
                    displayName: true,
                },
            },
            postPhotos: true,
        },
    });
    (0, google_map_1.getCoordinates)(newPost.title).then((coordinates) => {
        if (coordinates) {
            db_1.prismaClient.post
                .update({
                where: {
                    id: newPost.id,
                },
                data: {
                    latitude: parseFloat(coordinates.lat),
                    longitude: parseFloat(coordinates.lng),
                },
            })
                .then();
        }
    });
    return Object.assign(Object.assign({}, newPost), { comments: [] });
});
exports.createPost = createPost;
const updatePost = (postId, title, rating, content, postPhotos, deletePhotos) => __awaiter(void 0, void 0, void 0, function* () {
    if (deletePhotos[0]) {
        deletePhotos.forEach((photo) => __awaiter(void 0, void 0, void 0, function* () {
            if (photo.id) {
                yield deletePostPhoto(photo.id);
            }
        }));
    }
    postPhotos.forEach((photo) => {
        if (photo.id) {
            updatePostPhoto(photo.url, photo.id);
        }
        else {
            createPostPhoto(photo.url, postId);
        }
    });
    const post = yield db_1.prismaClient.post.update({
        where: {
            id: postId,
        },
        data: {
            title: title,
            content: content,
            rating: rating,
        },
        include: {
            author: {
                select: {
                    displayName: true,
                },
            },
            postPhotos: true,
            comments: {
                include: {
                    author: {
                        select: {
                            displayName: true,
                        },
                    },
                },
            },
        },
    });
    (0, google_map_1.getCoordinates)(post.title).then((coordinates) => {
        if (coordinates) {
            db_1.prismaClient.post
                .update({
                where: {
                    id: post.id,
                },
                data: {
                    latitude: parseFloat(coordinates.lat),
                    longitude: parseFloat(coordinates.lng),
                },
            })
                .then();
        }
    });
    return post;
});
exports.updatePost = updatePost;
const deletePost = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    const del = yield db_1.prismaClient.post.update({
        where: {
            id: postId,
        },
        data: {
            published: false,
        },
    });
    return del;
});
exports.deletePost = deletePost;
const getPost = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield db_1.prismaClient.post.findUnique({
        where: {
            id: postId,
        },
        include: {
            author: {
                select: {
                    displayName: true,
                },
            },
            postPhotos: true,
            comments: {
                include: {
                    author: {
                        select: {
                            displayName: true,
                        },
                    },
                },
            },
        },
    });
    if (post && !post.published)
        return null;
    return post;
});
exports.getPost = getPost;
const getAllPosts = () => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield db_1.prismaClient.post.findMany({
        where: {
            published: true,
        },
        include: {
            author: {
                select: {
                    displayName: true,
                },
            },
            postPhotos: true,
            comments: {
                include: {
                    author: {
                        select: {
                            displayName: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return posts;
    //return []
});
exports.getAllPosts = getAllPosts;
const createPostPhoto = (url, postId) => __awaiter(void 0, void 0, void 0, function* () {
    const newPostPhoto = yield db_1.prismaClient.postPhoto.create({
        data: {
            url,
            postId,
        },
    });
    return newPostPhoto;
});
exports.createPostPhoto = createPostPhoto;
const deletePostPhoto = (photoId) => __awaiter(void 0, void 0, void 0, function* () {
    const deletePostPhoto = yield db_1.prismaClient.postPhoto.delete({
        where: {
            id: photoId,
        },
    });
    return deletePostPhoto;
});
const updatePostPhoto = (url, photoId) => __awaiter(void 0, void 0, void 0, function* () {
    const updatePostPhoto = yield db_1.prismaClient.postPhoto.update({
        where: {
            id: photoId,
        },
        data: {
            url: url,
        },
    });
    return updatePostPhoto;
});
