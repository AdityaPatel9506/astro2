const path = require('path');
const fs = require('fs').promises;
const Blog = require('../models/blogModel');
const { body, validationResult } = require('express-validator');

// Function to handle file upload
const handleFileUpload = async (file) => {
    if (!file) return null;

    const { path: tempPath, originalname } = file;
    const extension = path.extname(originalname);
    const newFileName = `${Date.now()}${extension}`;
    const targetPath = path.join(__dirname, '../uploads/blogImages', newFileName);

    try {
        await fs.rename(tempPath, targetPath); // Move the file to the target directory
        return newFileName; // Return the filename to store in the database
    } catch (err) {
        throw new Error('Error handling file upload: ' + err.message);
    }
};

// Handle new blog submission with file upload
exports.submitBlog = [
    // Validation rules
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
    body('author_id').isInt().withMessage('Author ID must be an integer'),

    async (req, res) => {
        console.log('Request Body:', req.body); // Check if form data is received
        console.log('Uploaded File:', req.file); // Check if file is received

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, content, author_id } = req.body;
        const imageFilename = await handleFileUpload(req.file); // Use await to handle file upload

        try {
            const result = await Blog.createBlog(title, content, author_id, imageFilename);
            res.status(201).json({
                message: 'Blog created successfully',
                id: result.id
            });
        } catch (err) {
            res.status(400).send('Error saving blog: ' + err.message);
        }
    }
];

// Fetch all blogs
exports.getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.getAllBlogs();

        if (blogs.length > 0) {
            res.status(200).json({ blogs });
        } else {
            res.status(404).send('No blogs found');
        }
    } catch (error) {
        res.status(400).send('Error fetching blogs: ' + error.message);
    }
};

// Display a specific blog by ID
exports.showBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const blog = await Blog.findById(blogId);

        if (blog) {
            res.status(200).json({ blog });
        } else {
            res.status(404).send('Blog not found');
        }
    } catch (error) {
        res.status(400).send('Error fetching blog: ' + error.message);
    }
};

// Update a blog's title and content
exports.updateBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const { title, content } = req.body;
        const imageFilename = req.file ? await handleFileUpload(req.file) : null;

        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }

        const result = await Blog.updateBlog(blogId, title, content, imageFilename);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        res.status(200).json({
            message: 'Blog updated successfully',
            updatedBlog: {
                id: blogId,
                title,
                content,
                featured_image: imageFilename
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating blog: ' + error.message });
    }
};

// Delete a blog by ID
exports.deleteBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        // First, fetch the blog to get the filename of the associated image
        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Delete the blog entry from the database
        const result = await Blog.deleteBlogById(blogId);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // If there's an image file associated with the blog, delete it
        if (blog.featured_image) {
            const filePath = path.join(__dirname, '../public/uploads/blogImages', blog.featured_image);
            try {
                await fs.unlink(filePath); // Delete the file
            } catch (err) {
                console.error('Error deleting file:', err.message);
            }
        }

        res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting blog: ' + error.message });
    }
};
