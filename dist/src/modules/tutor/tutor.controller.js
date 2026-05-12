"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TutorController = void 0;
const tutor_service_1 = require("./tutor.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const updateProfile = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user.id;
    const result = await tutor_service_1.TutorService.updateTutorProfile(userId, req.body);
    (0, sendResponse_1.default)(res, { statusCode: 200, success: true, message: 'Profile updated successfully', data: result });
});
const updateAvailability = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user.id;
    const availabilities = req.body.availabilities || req.body;
    const result = await tutor_service_1.TutorService.updateAvailability(userId, availabilities);
    (0, sendResponse_1.default)(res, { statusCode: 200, success: true, message: 'Availability updated successfully', data: result });
});
const getAllTutors = (0, catchAsync_1.default)(async (req, res) => {
    const result = await tutor_service_1.TutorService.getAllTutors(req.query);
    (0, sendResponse_1.default)(res, { statusCode: 200, success: true, message: 'Tutors retrieved successfully', data: result });
});
const getTutorById = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await tutor_service_1.TutorService.getTutorById(id);
    if (!result)
        throw new AppError_1.default(404, 'Tutor not found');
    (0, sendResponse_1.default)(res, { statusCode: 200, success: true, message: 'Tutor retrieved successfully', data: result });
});
exports.TutorController = {
    updateProfile,
    updateAvailability,
    getAllTutors,
    getTutorById
};
