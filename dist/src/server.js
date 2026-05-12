"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const prisma_1 = require("./lib/prisma");
async function main() {
    console.log('Server is running...');
    // You can add more server logic here
    try {
        await prisma_1.prisma.$connect();
        console.log('Connected to the database successfully.');
        app_1.default.listen(process.env.PORT || 5000, () => {
            console.log(`Server is listening on port ${process.env.PORT || 5000}`);
        });
    }
    catch (error) {
        console.error('Error running server:', error);
        await prisma_1.prisma.$disconnect();
        process.exit(1);
    }
}
main();
