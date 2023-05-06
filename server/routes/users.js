const express = require('express');
const router = express.Router();
const db = require('../config/dbConfig.js');
const excel = require('exceljs');
const pdf = require('pdfkit');

// For fetching all users

router.get('/', (req, res) => {
  db.models.User.findAll()
    .then((users) => {
      res.json(users);
    })
    .catch((error) => {
      console.error('Error fetching user data:', error);
      res
        .status(500)
        .json({ error: 'An error occurred while fetching user data' });
    });
});

// For creating a new user

router.post('/', (req, res) => {
  const { name, country, phone, email, address } = req.body;

  db.models.User.create({ name, country, phone, email, address })
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((error) => {
      console.error('Error creating user:', error);
      res
        .status(500)
        .json({ error: 'An error occurred while creating the user' });
    });
});

// For downloading Excel file for all users

router.get('/export/excel', (req, res) => {
  db.models.User.findAll()
    .then((users) => {
      // Generate Excel file and send as a response
      const workbook = new excel.Workbook();
      const worksheet = workbook.addWorksheet('Users');

      // Add headers
      worksheet.addRow([
        'ID',
        'Name',
        'Country',
        'Phone',
        'Email',
        'Address',
        'Created At',
        'Updated At',
      ]);

      // Add data rows
      users.forEach((user) => {
        worksheet.addRow([
          user.id,
          user.name,
          user.country,
          user.phone,
          user.email,
          user.address,
          user.createdAt,
          user.updatedAt,
        ]);
      });

      // Set response headers for Excel download
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader('Content-Disposition', 'attachment; filename="users.xlsx"');

      // Send the Excel file
      workbook.xlsx
        .write(res)
        .then(() => {
          res.end();
        })
        .catch((error) => {
          console.error('Error generating Excel file:', error);
          res.status(500).json({
            error: 'An error occurred while generating the Excel file',
          });
        });
    })
    .catch((error) => {
      console.error('Error fetching user data:', error);
      res
        .status(500)
        .json({ error: 'An error occurred while fetching user data' });
    });
});

// For downloading PDF file for a single user

router.get('/export/pdf/:id', (req, res) => {
  const userId = req.params.id;

  db.models.User.findByPk(userId)
    .then((user) => {
      if (!user) {
        res.status(404).json({ error: 'User not found' });
      } else {
        // Create a new PDF document
        const doc = new pdf();

        // Set response headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
          'Content-Disposition',
          `attachment; filename="${user.name}.pdf"`
        );

        // Pipe the PDF document to the response
        doc.pipe(res);

        // Set up some styles for the PDF document
        doc.font('Times-Bold');
        doc.fontSize(20);
        doc.fillColor('#336699');

        // Add user details to the PDF document
        doc.text('User Details', { underline: true, align: 'center' });
        doc.moveDown();

        doc.font('Times-Roman');
        doc.fontSize(14);
        doc.fillColor('#444444');

        doc.text(`Name: ${user.name}`);
        doc.text(`Country: ${user.country}`);
        doc.text(`Phone: ${user.phone}`);
        doc.text(`Email: ${user.email}`);
        doc.text(`Address: ${user.address}`);

        // Move down to add a new section
        doc.moveDown();

        doc.fontSize(12);
        doc.fillColor('#666666');

        doc.text(`Created At: ${user.createdAt}`);
        doc.text(`Updated At: ${user.updatedAt}`);

        // Finalize the PDF document
        doc.end();
      }
    })
    .catch((error) => {
      console.error('Error fetching user data:', error);
      res
        .status(500)
        .json({ error: 'An error occurred while fetching user data' });
    });
});

module.exports = router;
