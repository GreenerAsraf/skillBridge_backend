"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminReviewRoutes = exports.ReviewRoutes = void 0;
const express_1 = __importDefault(require("express"));
const review_controller_1 = require("./review.controller");
const auth_1 = require("../../middlewares/auth");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const review_validation_1 = require("./review.validation");
const router = express_1.default.Router();
router.post('/', (0, auth_1.authMiddleware)('STUDENT'), (0, validateRequest_1.default)(review_validation_1.ReviewValidation.createReviewValidationSchema), review_controller_1.ReviewController.createReview);
exports.ReviewRoutes = router;
const adminRouter = express_1.default.Router();
adminRouter.get('/', (0, auth_1.authMiddleware)('ADMIN'), review_controller_1.ReviewController.getAllReviewsForAdmin);
exports.AdminReviewRoutes = adminRouter;
