"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TutorValidation = void 0;
const zod_1 = require("zod");
const updateProfileValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        bio: zod_1.z.string().optional(),
        subject: zod_1.z.array(zod_1.z.string()).optional(),
        hourlyPrice: zod_1.z.number().min(0, 'Price must be a positive number').optional(),
        categoryId: zod_1.z.string().optional(),
    })
});
const updateAvailabilityValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        availabilities: zod_1.z.array(zod_1.z.object({
            day: zod_1.z.enum(['SAT', 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI']),
            startTime: zod_1.z.string().datetime(),
            endTime: zod_1.z.string().datetime()
        })).optional()
    })
});
exports.TutorValidation = {
    updateProfileValidationSchema,
    updateAvailabilityValidationSchema
};
