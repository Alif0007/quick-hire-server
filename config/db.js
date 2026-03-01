const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

class Database {
    constructor() {
        this.client = null;
        this.db = null;
        this.isConnected = false;
    }

    async connect() {
        try {
            // Get MongoDB URI from environment variables
            const uri = process.env.MONGODB_URI;

            if (!uri) {
                throw new Error('MongoDB URI not found in environment variables');
            }

            // Create MongoDB client
            this.client = new MongoClient(uri);

            // Connect to MongoDB
            await this.client.connect();

            // Select database (will create if it doesn't exist)
            this.db = this.client.db('quickhire');

            this.isConnected = true;

            console.log('✅ Successfully connected to MongoDB Atlas');

            // Test the connection
            await this.testConnection();

            return this.db;
        } catch (error) {
            console.error('❌ MongoDB connection error:', error);
            this.isConnected = false;
            throw error;
        }
    }

    async testConnection() {
        try {
            // Test by listing collections
            const collections = await this.db.listCollections().toArray();
            console.log('📋 Available collections:', collections.map(c => c.name));

            // Test by creating a simple document
            const testCollection = this.db.collection('connection_test');
            const testDoc = {
                test: 'connection',
                timestamp: new Date(),
                status: 'success'
            };

            const result = await testCollection.insertOne(testDoc);
            console.log('📝 Test document inserted with ID:', result.insertedId);

            // Clean up test document
            await testCollection.deleteOne({ _id: result.insertedId });
            console.log('🧹 Test document cleaned up');

        } catch (error) {
            console.error('❌ Connection test failed:', error);
            throw error;
        }
    }

    getDB() {
        if (!this.isConnected || !this.db) {
            throw new Error('Database not connected. Call connect() first.');
        }
        return this.db;
    }

    getClient() {
        if (!this.isConnected || !this.client) {
            throw new Error('Database not connected. Call connect() first.');
        }
        return this.client;
    }

    async disconnect() {
        try {
            if (this.client) {
                await this.client.close();
                this.isConnected = false;
                console.log('🔌 Disconnected from MongoDB');
            }
        } catch (error) {
            console.error('❌ Error disconnecting from MongoDB:', error);
        }
    }

    // Helper method to get a collection
    collection(collectionName) {
        return this.getDB().collection(collectionName);
    }
}

// Create singleton instance
const database = new Database();

module.exports = database;