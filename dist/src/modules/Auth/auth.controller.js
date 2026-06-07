"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
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
const createUser = (0, catchAsync_1.default)(async (req, res) => {
    const result = await auth_service_1.AuthService.createUserIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: 'User registered successfully',
        data: mapUserStatus(result),
    });
});
const loginUser = (0, catchAsync_1.default)(async (req, res) => {
    const result = await auth_service_1.AuthService.loginUserIntoDB(req.body);
    if (result && result.user) {
        result.user = mapUserStatus(result.user);
    }
    res.cookie('token', result.token, {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'User logged in successfully',
        data: result,
    });
});
exports.AuthController = {
    createUser,
    loginUser,
};
