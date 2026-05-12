"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewValidation = void 0;
const zod_1 = require("zod");
const createReviewValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        bookingId: zod_1.z.string({ message: 'Booking ID is required' }),
        rating: zod_1.z.number({ message: 'Rating is required' }).min(1).max(5),
        comment: zod_1.z.string({ message: 'Comment is required' })
    })
});
exports.ReviewValidation = {
    createReviewValidationSchema
};
