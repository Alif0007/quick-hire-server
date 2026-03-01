# QuickHire Backend API

This is the backend API for the QuickHire application, built with Node.js, Express, and MongoDB (using the native MongoDB driver without Mongoose).

## Features

-✅ MongoDB Atlas connection (native driver)
- ✅ RESTful API endpoints
- ✅ CRUD operations for jobs
- ✅ Health check endpoints
- ✅ Database connection testing
- ✅ Environment configuration
- ✅ CORS support
- ✅ Error handling

## Prerequisites

- Node.js v14 or higher
- MongoDB Atlas account (connection string provided)
- npm or yarn

## Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Environment variables are already configured in `.env`:
```env
MONGODB_URI=mongodb+srv://alaminalif373:zXQTrtLWYIJ0j485@book-shelf.ixjlonr.mongodb.net/?appName=Book-Shelf
PORT=5000
NODE_ENV=development
APP_NAME=QuickHire
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## API Endpoints

### Base URL
```
http://localhost:5000
```

### Health & Connection Endpoints

- `GET /` - API root endpoint
- `GET /api/health` - Health check
- `GET /api/test-connection` - Test MongoDB connection

### Jobs Endpoints

- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create a new job

## Database Structure

The application uses MongoDB with the following collections:

### Jobs Collection
```javascript
{
  title: String,
  company: String,
  location: String,
  salary: String,
  type: String,
  description: String,
  requirements: Array,
  postedDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Testing

Run the database test script to verify all operations:
```bash
node test-db.js
```

This will test:
- Database connection
- Insert operations
- Find operations
- Update operations
- Delete operations

## Project Structure

```
backend/
├── config/
│   └── db.js          # MongoDB connection logic
├── .env               # Environment variables
├── package.json       # Dependencies and scripts
├── server.js          # Main server file
├── test-db.js         # Database test script
└── README.md          # This file
```

## MongoDB Connection

The backend connects to MongoDB Atlas using the native MongoDB driver. Key features:

-✅ Automatic connection management
- ✅ Connection testing on startup
- ✅ Graceful shutdown handling
- ✅ Error handling and logging
- ✅ Collection helper methods

## Development Notes

- The server runs on port 5000 by default
- MongoDB database name: `quickhire`
- All timestamps are stored in ISO format
- CORS is enabled for frontend integration
- Environment-based configuration

## Troubleshooting

### Common Issues

1. **Connection Failed**: Verify MongoDB URI and network connectivity
2. **Port Already in Use**: Change PORT in `.env` file
3. **Missing Dependencies**: Run `npm install` again

### Logs

The application provides detailed logging:
- Connection status
- Database operations
- API requests
- Error messages

## Next Steps

- Add authentication middleware
- Implement user management
- Add more CRUD operations
- Implement data validation
- Add pagination for large datasets
- Add search and filtering capabilities