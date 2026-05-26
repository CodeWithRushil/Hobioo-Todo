require('dotenv').config();

const express = require('express');
const http = require('http');
const https = require('https');
const mongoose = require('mongoose');
const todoModel = require('./models/todo');

const app = express();
const port = process.env.PORT || 3000;
const keepAliveIntervalMs = Number(process.env.KEEP_ALIVE_INTERVAL_MS) || 14 * 60 * 1000;
const keepAliveTarget = process.env.KEEP_ALIVE_URL || process.env.RENDER_EXTERNAL_URL || process.env.HEALTH_URL;

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

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
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

function pingKeepAliveTarget(targetUrl) {
    if (!targetUrl) {
        return;
    }

    const normalizedUrl = targetUrl.endsWith('/health') ? targetUrl : `${targetUrl.replace(/\/$/, '')}/health`;
    const parsedUrl = new URL(normalizedUrl);
    const client = parsedUrl.protocol === 'https:' ? https : http;

    const request = client.get(parsedUrl, (response) => {
        response.resume();
        if (response.statusCode >= 400) {
            console.warn(`Keep-alive ping returned ${response.statusCode} for ${parsedUrl.toString()}`);
        } else {
            console.log(`Keep-alive ping sent to ${parsedUrl.toString()}`);
        }
    });

    request.on('error', (error) => {
        console.warn(`Keep-alive ping failed for ${parsedUrl.toString()}:`, error.message);
    });
}

function startKeepAlive() {
    if (!keepAliveTarget) {
        console.log('Keep-alive disabled: no KEEP_ALIVE_URL, RENDER_EXTERNAL_URL, or HEALTH_URL configured');
        return;
    }

    pingKeepAliveTarget(keepAliveTarget);
    setInterval(() => pingKeepAliveTarget(keepAliveTarget), keepAliveIntervalMs);
    console.log(`Keep-alive enabled for ${keepAliveTarget} every ${keepAliveIntervalMs}ms`);
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    startKeepAlive();
});
