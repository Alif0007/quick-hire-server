const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const database = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'QuickHire API is running!',
        status: 'success',
        timestamp: new Date().toISOString()
    });
});

// Test database connection endpoint
app.get('/api/test-connection', async (req, res) => {
    try {
        if (!database.isConnected) {
            await database.connect();
        }

        // Get database info
        const db = database.getDB();
        const collections = await db.listCollections().toArray();

        res.json({
            success: true,
            message: 'Database connection is working!',
            database: 'quickhire',
            collections: collections.map(c => c.name),
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Database connection failed',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'QuickHire API',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Sample CRUD endpoints for jobs
app.get('/api/jobs', async (req, res) => {
    try {
        const jobsCollection = database.collection('jobs');
        const jobs = await jobsCollection.find({}).toArray();
        res.json({
            success: true,
            data: jobs,
            count: jobs.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching jobs',
            error: error.message
        });
    }
});

app.post('/api/jobs', async (req, res) => {
    try {
        const jobsCollection = database.collection('jobs');
        const jobData = {
            ...req.body,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await jobsCollection.insertOne(jobData);
        res.status(201).json({
            success: true,
            message: 'Job created successfully',
            data: { id: result.insertedId, ...jobData }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating job',
            error: error.message
        });
    }
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
});

// Start server and connect to database
const startServer = async () => {
    try {
        console.log('🚀 Starting QuickHire API server...');

        // Connect to database
        await database.connect();

        // Start Express server
        app.listen(PORT, () => {
            console.log(`✅ Server is running on port ${PORT}`);
            console.log(`📡 API URL: http://localhost:${PORT}`);
            console.log(`📊 Test connection: http://localhost:${PORT}/api/test-connection`);
            console.log(`❤️  Health check: http://localhost:${PORT}/api/health`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down server...');
    await database.disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Server terminated...');
    await database.disconnect();
    process.exit(0);
});

// Start the server
startServer();

module.exports = app;