const express = require('express');
const prismaController = require('../controllers/prisma-controller');
const { verifyToken } = require('../middleware/auth');
// Uncomment the line below to use JWT authentication middleware
// const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Admin routes
router.post('/api/signup', prismaController.signupAdmin);
router.post('/api/login', prismaController.loginAdmin);

// Property routes
// To protect a route, add 'verifyToken' middleware before the controller:
// Example: router.post('/api/properties', verifyToken, prismaController.createProperty);
router.post('/api/properties', verifyToken, prismaController.createProperty); // Consider protecting: only admins should create
router.get('/api/properties', verifyToken, prismaController.getAllProperties); // Public: anyone can view
router.get('/api/properties/:id', verifyToken, prismaController.getPropertyById); // Public: anyone can view
router.put('/api/properties/:id', verifyToken, prismaController.updateProperty); // Consider protecting: only admins should update
router.delete('/api/properties/:id', verifyToken, prismaController.deleteProperty); // Consider protecting: only admins should delete

// Enquiry routes
router.post('/api/enquiries', prismaController.createEnquiry); // Public: anyone can submit enquiry
router.get('/api/enquiries', verifyToken, prismaController.getAllEnquiries); // Consider protecting: only admins should view all enquiries

module.exports = router;