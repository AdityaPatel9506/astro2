const path = require('path');
const fs = require('fs');
const db = require('../config/db');

// Directory where images will be stored
const uploadDir = path.join(__dirname, '../public/uploads/blogImages');

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Function to insert a new blog post with an image
const createBlog = async (title, content, author, imageFilename) => {
    const query = 'INSERT INTO blogs (title, content, author_id, featured_image) VALUES (?, ?, ?, ?)';

    try {
        const [result] = await db.query(query, [title, content, author, imageFilename]);
        return { id: result.insertId };
    } catch (error) {
        throw error;
    }
};

// Function to get a blog post by ID
const findById = async (id) => {
    const query = 'SELECT * FROM blogs WHERE id = ?';

    try {
        const [results] = await db.query(query, [id]);

        if (results.length > 0) {
            return results[0];
        } else {
            throw new Error('Blog not found');
        }
    } catch (error) {
        throw error;
    }
};

// Function to get all blog posts
const getAllBlogs = async () => {
    try {
        const query = 'SELECT * FROM blogs';
        const [rows] = await db.execute(query);
        return rows;
    } catch (error) {
        throw new Error('Error fetching blogs: ' + error.message);
    }
};

// Function to update a blog post
const updateBlog = async (id, title, content, imageFilename) => {
    try {
        const query = 'UPDATE blogs SET title = ?, content = ?, featured_image = ? WHERE id = ?';
        const [result] = await db.execute(query, [title, content, imageFilename, id]);
        return result;
    } catch (error) {
        throw new Error('Error updating blog: ' + error.message);
    }
};

// Function to delete a blog post by ID
const deleteBlogById = async (id) => {
    try {
        const query = 'DELETE FROM blogs WHERE id = ?';
        const [result] = await db.execute(query, [id]);
        return result;
    } catch (error) {
        throw new Error('Error deleting blog: ' + error.message);
    }
};

module.exports = {
    createBlog,
    findById,
    getAllBlogs,
    updateBlog,
    deleteBlogById
};
