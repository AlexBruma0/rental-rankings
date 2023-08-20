"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const auth_routes_1 = __importDefault(require("./auth/auth.routes"));
const post_routes_1 = __importDefault(require("./post/post.routes"));
const comment_routes_1 = __importDefault(require("./comment/comment.routes"));
const users_routes_1 = __importDefault(require("./users/users.routes"));
const router = express_1.default.Router();
router.use("/auth", auth_routes_1.default);
router.use("/postings", post_routes_1.default);
router.use("/comments", comment_routes_1.default);
router.use("/users", users_routes_1.default);
router.get("/test-protected", auth_1.isAuthenticated, (req, res) => {
    var _a;
    res.json({ message: `Hello ${(_a = req.payload) === null || _a === void 0 ? void 0 : _a.displayName}` });
});
exports.default = router;
