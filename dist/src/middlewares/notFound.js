"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notFound = (req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'API Not Found! in this url. try again',
        error: '',
    });
};
exports.default = notFound;
