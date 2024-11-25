const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Initialize Express app
const app = express();
const port = 5000;  // Use port 5000 or any other you prefer

// Middleware to handle CORS and JSON requests
app.use(cors());
app.use(bodyParser.json());

// MongoDB Atlas connection string
const dbURI = 'mongodb+srv://pandeyharsh190902:Satwikpandey%4003@cluster0.vmrwa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB
mongoose.connect(dbURI)
    .then(() => console.log('Successfully connected to MongoDB'))
    .catch((err) => {
        console.log('Error connecting to MongoDB:', err);
        process.exit(1);  // Exit the process if MongoDB connection fails
    });

// Define the Student Schema
const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    age: { type: Number, required: true },
    course: { type: String, required: true },
    regNumber: { type: String, required: true }
});

// Create the Student Model
const Student = mongoose.model('Student', studentSchema);

// Serve the registration form (index.html) when accessing the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle form submission (POST request)
app.post('/register', (req, res) => {
    console.log('Form data received:', req.body);  // Debugging step
    const { name, email, age, course, regNumber } = req.body;

    // Validate the fields
    if (!name || !email || !age || !course || !regNumber) {
        console.log('Missing required fields');
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    if (isNaN(age) || age <= 0) {
        console.log('Invalid age:', age);
        return res.status(400).json({ success: false, message: 'Age must be a positive number.' });
    }

    // Create a new student record
    const newStudent = new Student({
        name,
        email,
        age,
        course,
        regNumber
    });

    // Save the student to MongoDB
    newStudent.save()
        .then(() => {
            console.log('Student registered successfully');
            res.json({ success: true, message: 'Registration successful!' });
        })
        .catch((error) => {
            console.error('Error saving student data:', error);
            res.status(500).json({ success: false, message: 'Error saving data' });
        });
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
