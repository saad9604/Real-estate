const express = require('express');
const prismaController = require('../controllers/prisma-controller');

const router = express.Router();

// Admin routes
router.post('/api/signup', prismaController.signupAdmin);
router.post('/api/login', prismaController.loginAdmin);

// Property routes
router.post('/api/properties', prismaController.createProperty);
router.get('/api/properties', prismaController.getAllProperties);
router.get('/api/properties/:id', prismaController.getPropertyById);
router.put('/api/properties/:id', prismaController.updateProperty);
router.delete('/api/properties/:id', prismaController.deleteProperty);

// Enquiry routes
router.post('/api/enquiries', prismaController.createEnquiry);
router.get('/api/enquiries', prismaController.getAllEnquiries);

module.exports = router;