const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const blogController = require('../controllers/blogController');


// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/uploads/blogImages'));
    },
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        const newFileName = `${Date.now()}${extension}`;
        cb(null, newFileName);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Invalid file type'), false);
        }
        cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Middleware for file upload
const uploadSingle = upload.single('image');

// Route to handle new blog submission with image upload
router.post('/submit-blog', uploadSingle, blogController.submitBlog);

// Route to display a specific blog by ID
router.get('/blog/:id', blogController.showBlog);

// Route to update a specific blog by ID with optional image
router.patch('/update-blog/:id', uploadSingle, blogController.updateBlog);

// Route to delete a specific blog by ID
router.delete('/delete-blog/:id', blogController.deleteBlog);

// Route to display all blogs with optional pagination
router.get('/getAllBlogs', blogController.getBlogs);

// Test route
router.get('/test', (req, res) => {
    res.send('Test route is working!');
});

module.exports = router;
