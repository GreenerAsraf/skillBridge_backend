"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const user_controller_1 = require("../User/user.controller");
const auth_1 = require("../../middlewares/auth");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_validation_1 = require("./auth.validation");
const router = express_1.default.Router();
router.post('/register', (0, validateRequest_1.default)(auth_validation_1.AuthValidation.createUserValidationSchema), auth_controller_1.AuthController.createUser);
router.post('/login', (0, validateRequest_1.default)(auth_validation_1.AuthValidation.loginUserValidationSchema), auth_controller_1.AuthController.loginUser);
router.get('/me', (0, auth_1.authMiddleware)('STUDENT', 'TUTOR', 'ADMIN'), user_controller_1.UserController.getMe);
exports.AuthRoutes = router;
