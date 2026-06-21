"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("./user.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const mapUserStatus = (user) => {
    if (!user)
        return user;
    return {
        ...user,
        status: user.status === 'BLOCKED' ? 'BANNED' : user.status,
    };
};
const getMe = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user.id;
    const result = await user_service_1.UserService.getMe(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'User profile retrieved successfully',
        data: mapUserStatus(result),
    });
});
const getAllUsers = (0, catchAsync_1.default)(async (req, res) => {
    const result = await user_service_1.UserService.getAllUsers();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Users retrieved successfully',
        data: result ? result.map(mapUserStatus) : [],
    });
});
const updateUserStatus = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const status = req.body.status === 'BANNED' ? 'BLOCKED' : req.body.status;
    const result = await user_service_1.UserService.updateUserStatus(id, status);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'User status updated successfully',
        data: mapUserStatus(result),
    });
});
exports.UserController = {
    getMe,
    getAllUsers,
    updateUserStatus
};
