import { server, connectDB } from './app.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Port configuration
const PORT = process.env.PORT || 5000;

// Connect to Database and start Server
const startServer = async () => {
    try {
        await connectDB();
        server.listen(PORT, () => {
          console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error(`Error starting server: ${error.message}`);
        process.exit(1);
    }
};

startServer();
