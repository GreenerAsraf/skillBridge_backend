"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TutorManagementRoutes = exports.PublicTutorRoutes = void 0;
const express_1 = __importDefault(require("express"));
const tutor_controller_1 = require("./tutor.controller");
const auth_1 = require("../../middlewares/auth");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const tutor_validation_1 = require("./tutor.validation");
// Public routes (mount on /api/tutors)
const publicRouter = express_1.default.Router();
publicRouter.get('/', tutor_controller_1.TutorController.getAllTutors);
publicRouter.get('/:id', tutor_controller_1.TutorController.getTutorById);
exports.PublicTutorRoutes = publicRouter;
// Private management routes (mount on /api/tutor)
const managementRouter = express_1.default.Router();
managementRouter.put('/profile', (0, auth_1.authMiddleware)('TUTOR'), (0, validateRequest_1.default)(tutor_validation_1.TutorValidation.updateProfileValidationSchema), tutor_controller_1.TutorController.updateProfile);
managementRouter.put('/availability', (0, auth_1.authMiddleware)('TUTOR'), (0, validateRequest_1.default)(tutor_validation_1.TutorValidation.updateAvailabilityValidationSchema), tutor_controller_1.TutorController.updateAvailability);
exports.TutorManagementRoutes = managementRouter;
