const { propertyService, enquiryService, adminService } = require('../services/prismaService');
const bcrypt = require('bcrypt');

// Property-related controllers
exports.createProperty = async (req, res) => {
    try {
        const propertyData = req.body;
        const newProperty = await propertyService.createProperty(propertyData);
        res.status(201).json({
            message: 'Property created successfully',
            property: newProperty
        });
    } catch (error) {
        console.error('Error creating property:', error);
        res.status(500).json({ error: 'Failed to create property' });
    }
};

exports.getAllProperties = async (req, res) => {
    try {
        const properties = await propertyService.getAllProperties();
        res.json(properties);
    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).json({ error: 'Failed to fetch properties' });
    }
};

exports.getPropertyById = async (req, res) => {
    try {
        const { id } = req.params;
        const property = await propertyService.getPropertyById(id);

        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        res.json(property);
    } catch (error) {
        console.error('Error fetching property:', error);
        res.status(500).json({ error: 'Failed to fetch property' });
    }
};

exports.updateProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const propertyData = req.body;
        const updatedProperty = await propertyService.updateProperty(id, propertyData);
        res.json({
            message: 'Property updated successfully',
            property: updatedProperty
        });
    } catch (error) {
        console.error('Error updating property:', error);
        res.status(500).json({ error: 'Failed to update property' });
    }
};

exports.deleteProperty = async (req, res) => {
    try {
        const { id } = req.params;
        await propertyService.deleteProperty(id);
        res.json({ message: 'Property deleted successfully' });
    } catch (error) {
        console.error('Error deleting property:', error);
        res.status(500).json({ error: 'Failed to delete property' });
    }
};

// Enquiry-related controllers
exports.createEnquiry = async (req, res) => {
    try {
        const enquiryData = req.body;
        const newEnquiry = await enquiryService.createEnquiry(enquiryData);
        res.status(201).json({
            message: 'Enquiry submitted successfully',
            enquiry: newEnquiry
        });
    } catch (error) {
        console.error('Error creating enquiry:', error);
        res.status(500).json({ error: 'Failed to submit enquiry' });
    }
};

exports.getAllEnquiries = async (req, res) => {
    try {
        const enquiries = await enquiryService.getAllEnquiries();
        res.json(enquiries);
    } catch (error) {
        console.error('Error fetching enquiries:', error);
        res.status(500).json({ error: 'Failed to fetch enquiries' });
    }
};

// Admin-related controllers
exports.signupAdmin = async (req, res) => {
    try {
        const { name, email, phoneNumber, password } = req.body;

        // Validate required fields
        if (!name || !email || !phoneNumber || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const newAdmin = await adminService.createAdmin(name, email, phoneNumber, password);

        // Remove password from response
        const { password: _, ...adminWithoutPassword } = newAdmin;

        res.status(201).json({
            message: 'Admin registered successfully',
            admin: adminWithoutPassword
        });
    } catch (error) {
        console.error('Error signing up admin:', error);

        // Handle unique constraint violation (duplicate email)
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Email already exists' });
        }

        res.status(500).json({ error: 'Failed to register admin' });
    }
};

exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const admins = await adminService.loginAdmin(email);

        if (admins.length > 0) {
            let isMatchFound = false;
            let loggedInAdmin = null;

            for (const admin of admins) {
                try {
                    const isMatch = await bcrypt.compare(password, admin.password);
                    if (isMatch) {
                        isMatchFound = true;
                        loggedInAdmin = admin;
                        break;
                    }
                } catch (err) {
                    return res.status(500).json({
                        message: 'Error logging in!',
                        loginSuccessful: false
                    });
                }
            }

            if (isMatchFound) {
                // Remove password from response
                const { password: _, ...adminWithoutPassword } = loggedInAdmin;

                res.json({
                    message: 'Login successful',
                    admin: adminWithoutPassword,
                    loginSuccessful: true
                });
            } else {
                res.status(401).json({
                    message: 'Login failed, password does not match!',
                    loginSuccessful: false
                });
            }
        } else {
            res.status(401).json({
                message: 'Login failed, email not found!',
                loginSuccessful: false
            });
        }
    } catch (error) {
        console.error('Error logging in admin:', error);
        res.status(500).json({ error: 'Failed to login admin' });
    }
};