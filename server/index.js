require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const todoModel = require('./models/todo');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    });

app.get('/todos', async (req, res) => {
    try {
        const todos = await todoModel.find({}).sort({ time: -1 });
        res.status(200).json(todos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/todos', async (req, res) => {
    try {
        const title = req.body.title ?? req.body.text;
        if (!title?.trim()) {
            return res.status(400).json({ message: 'Title is required' });
        }
        const savedTodo = await todoModel.create({ title: title.trim() });
        res.status(201).json(savedTodo);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.patch('/todos/:id', async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (updateData.text !== undefined) {
            updateData.title = updateData.text;
            delete updateData.text;
        }
        const updatedTodo = await todoModel.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );
        if (!updatedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.status(200).json(updatedTodo);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.delete('/todos/completed', async (req, res) => {
    try {
        await todoModel.deleteMany({ completed: true });
        const todos = await todoModel.find({}).sort({ time: -1 });
        res.status(200).json(todos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.delete('/todos/:id', async (req, res) => {
    try {
        const deleted = await todoModel.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
