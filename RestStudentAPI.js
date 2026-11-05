
const express = require('express');
const fs = require('fs');
const path = require('path');

// Create an Express application
const app = express();
const port = 3000;

// Built-in middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const filePath = path.join(__dirname, 'Students.json');

// Get all students
app.get('/GetStudents', (req, res) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({
                status: false,
                statusCode: 500,
                message: 'Error reading Students.json'
            });
        }

        res.status(200).json({
            status: true,
            statusCode: 200,
            requestedAt: new Date().toISOString(),
            requestUrl: req.originalUrl,
            requestMethod: req.method,
            studentData: JSON.parse(data)
        });
    });
});

// Get one student by ID
app.get('/GetStudent/:id', (req, res) => {
    console.log('GetStudent called');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({
                status: false,
                statusCode: 500,
                message: 'Error reading Students.json'
            });
        }

        const students = JSON.parse(data);
        const student = students['Student' + req.params.id];

        if (student) {
            res.status(200).json(student);
        } else {
            res.status(404).json({
                status: false,
                statusCode: 404,
                message: 'Student Not Found',
                requestedAt: new Date().toISOString(),
                requestUrl: req.originalUrl,
                requestMethod: req.method
            });
        }
    });
});

// Add a new student
app.post('/AddStudent/:id/:name/:Age/:Qual/:Email', (req, res) => {
    console.log('Post called');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Error reading Students.json'
            });
        }

        const students = JSON.parse(data);

        const studentId = 'Student' + req.params.id;

        // Check if student already exists
        if (students[studentId]) {
            return res.status(409).json({
                status: false,
                message: 'Student already exists'
            });
        }

        const newStudent = {
            name: req.params.name,
            Age: req.params.Age,
            Qualification: req.params.Qual,
            Email: req.params.Email,
            id: req.params.id
        };

        students[studentId] = newStudent;

        // Save updated data
        fs.writeFile(filePath, JSON.stringify(students, null, 2), (err) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    message: 'Error saving student'
                });
            }

            res.status(201).json({
                status: true,
                message: 'Student added successfully',
                studentData: newStudent
            });
        });
    });
});

// Delete a student by ID
app.delete('/delete/:id', (req, res) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Error reading Students.json'
            });
        }

        const students = JSON.parse(data);
        const studentId = 'Student' + req.params.id;

        if (!students[studentId]) {
            return res.status(404).json({
                status: false,
                message: 'Student Not Found'
            });
        }

        delete students[studentId];

        // Save updated data
        fs.writeFile(filePath, JSON.stringify(students, null, 2), (err) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    message: 'Error deleting student'
                });
            }

            res.status(200).json({
                status: true,
                statusCode: 200,
                message: 'Student deleted successfully',
                requestedAt: new Date().toISOString(),
                requestUrl: req.originalUrl,
                requestMethod: req.method
            });
        });
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

