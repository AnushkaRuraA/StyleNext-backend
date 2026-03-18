const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.get('/', (req, res) => {
  res.send('StyleNext Backend is running');
});

// Port configuration
const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.log('MONGO_URI not found in .env, starting server without DB');
            app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
            return;
        }
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

connectDB();
