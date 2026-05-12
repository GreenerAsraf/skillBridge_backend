"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const zod_1 = require("zod");
const createUserValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ message: 'Name is required' }),
        email: zod_1.z.string({ message: 'Email is required' }).email('Invalid email address'),
        password: zod_1.z.string({ message: 'Password is required' }).min(6, 'Password must be at least 6 characters'),
        role: zod_1.z.enum(['STUDENT', 'TUTOR', 'ADMIN', 'USER']).optional(),
    })
});
const loginUserValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ message: 'Email is required' }).email('Invalid email address'),
        password: zod_1.z.string({ message: 'Password is required' })
    })
});
exports.AuthValidation = {
    createUserValidationSchema,
    loginUserValidationSchema
};
