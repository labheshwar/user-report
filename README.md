# User Management System

A web application built with Node.js, Express, React, and MySQL for managing user records. It provides functionality to display user data in a table, visualize the number of users per country in a pie chart, export user data to Excel, and generate PDF files with user details.

## Features

- Fetch user records from the database and display them in a table
- Generate a pie chart to visualize the number of users per country
- Export user records to an Excel file for download
- Generate PDF files with detailed information for individual users

## Installation

1. Clone the repository:

2. Navigate to the project directory:

3. Install the dependencies:

4. Set up the database:

- Create a MySQL database.
- Update the database configuration in the `.env` file.

5. Start the server:

6. Start the React development server:

    ```cd client && npm start```

7. Open the web application in your browser:

## Configuration

- Update the MySQL database configuration in the `.env` file.

## Dependencies

- Backend:
- Express.js: Fast, unopinionated, minimalist web framework for Node.js
- Sequelize: Promise-based ORM for Node.js
- Exceljs: Library for generating Excel files
- pdfkit: PDF generation library

- Frontend:
- React: JavaScript library for building user interfaces
- axios: Promise-based HTTP client for the browser and Node.js
- react-router-dom: Routing library for React
- react-chartjs-2: React wrapper for Chart.js
- react-icons: Icon library for React

## Thanks
