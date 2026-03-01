# QuickHire Backend

QuickHire is a comprehensive job board application that connects job seekers with employers. The backend is built with Node.js and Express and provides a robust API for managing jobs and applications.

## Features

- **RESTful API**: Well-structured API endpoints for all application features
- **MongoDB Integration**: Robust database storage for jobs and applications
- **CRUD Operations**: Full Create, Read, Update, Delete operations for jobs and applications
- **Admin Functions**: Dedicated endpoints for administrative tasks
- **Error Handling**: Comprehensive error handling and validation
- **CORS Support**: Configured for cross-origin resource sharing

## Tech Stack

- Node.js
- Express.js
- MongoDB (with native driver)
- CORS
- Dotenv (environment configuration)

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (either local installation or MongoDB Atlas account)

## Installation & Setup

1. **Clone the repository** (if applicable) or navigate to the project directory:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   Create a `.env` file in the backend root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/quickhire
   ```
   
   Or if using MongoDB Atlas:
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/quickhire?retryWrites=true&w=majority
   ```
   
   Note: Adjust the MongoDB URI to match your setup.

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   
   Or for production:
   ```bash
   npm start
   ```

5. The server will start on the port specified in your `.env` file (default: `http://localhost:5000`)

## API Endpoints

### Jobs
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get a specific job
- `POST /api/jobs` - Create a new job (admin only)
- `DELETE /api/jobs/:id` - Delete a job (admin only)

### Applications
- `GET /api/applications` - Get all applications (admin only)
- `POST /api/applications` - Submit a new application
- `DELETE /api/applications/:id` - Delete an application (admin only)

### Health Checks
- `GET /api/health` - Health check endpoint
- `GET /api/test-connection` - Database connection test

## Project Structure

```
backend/
├── config/
│   └── db.js           # Database configuration
├── server.js           # Main server file
├── package.json
└── .env                # Environment variables (not committed)
```

## Database Schema

### Jobs Collection
```javascript
{
  _id: ObjectId,
  title: String,
  company: String,
  location: String,
  salary: String,
  type: String,
  description: String,
  requirements: [String],
  benefits: [String],
  category: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Applications Collection
```javascript
{
  _id: ObjectId,
  jobId: String,
  applicantName: String,
  email: String,
  resume: String,
  coverLetter: String,
  status: String, // pending, approved, rejected
  appliedAt: Date
}
```

## Running Tests

Currently, the application doesn't include automated tests. You can manually test the API endpoints using tools like Postman or curl.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## Environment Variables

- `PORT`: Port number for the server (default: 5000)
- `MONGODB_URI`: Connection string for MongoDB database

## License

This project is licensed under the MIT License.