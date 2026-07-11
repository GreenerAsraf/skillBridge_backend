import express from 'express';
import { BlogController } from './blog.controller';

const router = express.Router();

router.get('/', BlogController.getAllPosts);

export const BlogRoutes = router;
