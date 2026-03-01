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

// Jobs CRUD endpoints
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

// Get single job by ID
app.get('/api/jobs/:id', async (req, res) => {
    try {
        const jobsCollection = database.collection('jobs');
        const jobId = req.params.id;

        // Convert string ID to ObjectId if it's a valid ObjectId format
        const ObjectId = require('mongodb').ObjectId;
        let query;

        try {
            query = { _id: new ObjectId(jobId) };
        } catch (error) {
            // If not a valid ObjectId, search by string ID
            query = { _id: jobId };
        }

        const job = await jobsCollection.findOne(query);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        res.json({
            success: true,
            data: job
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching job',
            error: error.message
        });
    }
});

// Create a new job (Admin)
app.post('/api/jobs', async (req, res) => {
    try {
        const jobsCollection = database.collection('jobs');

        // Validate required fields
        const requiredFields = ['title', 'company', 'location', 'salary', 'type'];
        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
                missingFields
            });
        }

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

// Delete a job (Admin)
app.delete('/api/jobs/:id', async (req, res) => {
    try {
        const jobsCollection = database.collection('jobs');
        const jobId = req.params.id;

        // Convert string ID to ObjectId
        const ObjectId = require('mongodb').ObjectId;
        let query;

        try {
            query = { _id: new ObjectId(jobId) };
        } catch (error) {
            query = { _id: jobId };
        }

        const result = await jobsCollection.deleteOne(query);

        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        res.json({
            success: true,
            message: 'Job deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting job',
            error: error.message
        });
    }
});

// Applications endpoints
app.get('/api/applications', async (req, res) => {
    try {
        const applicationsCollection = database.collection('applications');
        const applications = await applicationsCollection.find({}).toArray();
        res.json({
            success: true,
            data: applications,
            count: applications.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching applications',
            error: error.message
        });
    }
});

app.post('/api/applications', async (req, res) => {
    try {
        const applicationsCollection = database.collection('applications');

        // Validate required fields
        const requiredFields = ['jobId', 'applicantName', 'email', 'resume'];
        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields for application',
                missingFields
            });
        }

        const applicationData = {
            ...req.body,
            appliedAt: new Date(),
            status: 'pending'
        };

        const result = await applicationsCollection.insertOne(applicationData);
        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            data: { id: result.insertedId, ...applicationData }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error submitting application',
            error: error.message
        });
    }
});

// Delete an application (Admin)
app.delete('/api/applications/:id', async (req, res) => {
    try {
        const applicationsCollection = database.collection('applications');
        const applicationId = req.params.id;

        // Convert string ID to ObjectId
        const ObjectId = require('mongodb').ObjectId;
        let query;

        try {
            query = { _id: new ObjectId(applicationId) };
        } catch (error) {
            query = { _id: applicationId };
        }

        const result = await applicationsCollection.deleteOne(query);

        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        res.json({
            success: true,
            message: 'Application deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting application',
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