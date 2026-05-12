"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const auth_1 = require("../../middlewares/auth");
const router = express_1.default.Router();
router.get('/users', user_controller_1.UserController.getAllUsers);
// router.get('/users', authMiddleware('ADMIN'), UserController.getAllUsers);
router.patch('/users/:id', (0, auth_1.authMiddleware)('ADMIN'), user_controller_1.UserController.updateUserStatus);
exports.AdminRoutes = router;
