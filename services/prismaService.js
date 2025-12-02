const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

// Property-related operations
const propertyService = {
  // Create a new property
  async createProperty(propertyData) {
    try {
      return await prisma.property.create({
        data: {
          title: propertyData.title,
          description: propertyData.description,
          propertyDescription: propertyData.propertyDescription,
          address: propertyData.address,
          city: propertyData.city,
          state: propertyData.state,
          country: propertyData.country,
          zipCode: propertyData.zipCode,
          price: propertyData.price,
          size: parseInt(propertyData.size),
          bedrooms: parseInt(propertyData.bedrooms),
          bathrooms: parseInt(propertyData.bathrooms),
          kitchens: parseInt(propertyData.kitchens),
          garages: parseInt(propertyData.garages),
          garageSize: propertyData.garageSize ? parseInt(propertyData.garageSize) : null,
          floorsNo: parseInt(propertyData.floorsNo),
          yearBuilt: propertyData.yearBuilt ? parseInt(propertyData.yearBuilt) : null,
          category: propertyData.category,
          listedIn: propertyData.listedIn,
          amenities: propertyData.amenities || [],
          images: propertyData.images || [],
          mapLocation: propertyData.mapLocation
        }
      });
    } catch (error) {
      console.error('Error creating property:', error);
      throw error;
    }
  },

  // Get all properties
  async getAllProperties() {
    try {
      return await prisma.property.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  },

  // Get property by ID
  async getPropertyById(id) {
    try {
      return await prisma.property.findUnique({
        where: { id: parseInt(id) }
      });
    } catch (error) {
      console.error('Error fetching property by ID:', error);
      throw error;
    }
  },

  // Update property
  async updateProperty(id, propertyData) {
    try {
      const updateData = {};

      // Only include fields that are provided
      if (propertyData.title !== undefined) updateData.title = propertyData.title;
      if (propertyData.description !== undefined) updateData.description = propertyData.description;
      if (propertyData.propertyDescription !== undefined) updateData.propertyDescription = propertyData.propertyDescription;
      if (propertyData.address !== undefined) updateData.address = propertyData.address;
      if (propertyData.city !== undefined) updateData.city = propertyData.city;
      if (propertyData.state !== undefined) updateData.state = propertyData.state;
      if (propertyData.country !== undefined) updateData.country = propertyData.country;
      if (propertyData.zipCode !== undefined) updateData.zipCode = propertyData.zipCode;
      if (propertyData.price !== undefined) updateData.price = propertyData.price;
      if (propertyData.size !== undefined) updateData.size = parseInt(propertyData.size);
      if (propertyData.bedrooms !== undefined) updateData.bedrooms = parseInt(propertyData.bedrooms);
      if (propertyData.bathrooms !== undefined) updateData.bathrooms = parseInt(propertyData.bathrooms);
      if (propertyData.kitchens !== undefined) updateData.kitchens = parseInt(propertyData.kitchens);
      if (propertyData.garages !== undefined) updateData.garages = parseInt(propertyData.garages);
      if (propertyData.garageSize !== undefined) updateData.garageSize = propertyData.garageSize ? parseInt(propertyData.garageSize) : null;
      if (propertyData.floorsNo !== undefined) updateData.floorsNo = parseInt(propertyData.floorsNo);
      if (propertyData.yearBuilt !== undefined) updateData.yearBuilt = propertyData.yearBuilt ? parseInt(propertyData.yearBuilt) : null;
      if (propertyData.category !== undefined) updateData.category = propertyData.category;
      if (propertyData.listedIn !== undefined) updateData.listedIn = propertyData.listedIn;
      if (propertyData.amenities !== undefined) updateData.amenities = propertyData.amenities;
      if (propertyData.images !== undefined) updateData.images = propertyData.images;
      if (propertyData.mapLocation !== undefined) updateData.mapLocation = propertyData.mapLocation;

      return await prisma.property.update({
        where: { id: parseInt(id) },
        data: updateData
      });
    } catch (error) {
      console.error('Error updating property:', error);
      throw error;
    }
  },

  // Delete property
  async deleteProperty(id) {
    try {
      return await prisma.property.delete({
        where: { id: parseInt(id) }
      });
    } catch (error) {
      console.error('Error deleting property:', error);
      throw error;
    }
  }
};

// Enquiry-related operations
const enquiryService = {
  // Create a new enquiry
  async createEnquiry(enquiryData) {
    try {
      return await prisma.enquiry.create({
        data: {
          name: enquiryData.name,
          email: enquiryData.email,
          phoneNumber: enquiryData.phoneNumber,
          message: enquiryData.message,
          propertyId: enquiryData.propertyId ? parseInt(enquiryData.propertyId) : null
        }
      });
    } catch (error) {
      console.error('Error creating enquiry:', error);
      throw error;
    }
  },

  // Get all enquiries
  async getAllEnquiries() {
    try {
      return await prisma.enquiry.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
      console.error('Error fetching enquiries:', error);
      throw error;
    }
  },

  // Get enquiry by ID
  async getEnquiryById(id) {
    try {
      return await prisma.enquiry.findUnique({
        where: { id: parseInt(id) }
      });
    } catch (error) {
      console.error('Error fetching enquiry by ID:', error);
      throw error;
    }
  }
};

// Admin-related operations
const adminService = {
  // Create admin (signup)
  async createAdmin(name, email, phoneNumber, password) {
    try {
      // Hash the password using bcrypt
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      return await prisma.user.create({
        data: {
          name: name,
          email: email,
          phoneNumber: phoneNumber,
          password: hashedPassword
        }
      });
    } catch (error) {
      console.error('Error creating admin:', error);
      throw error;
    }
  },

  // Login admin
  async loginAdmin(email) {
    try {
      return await prisma.user.findMany({
        where: { email: email }
      });
    } catch (error) {
      console.error('Error logging in admin:', error);
      throw error;
    }
  }
};

module.exports = {
  prisma,
  propertyService,
  enquiryService,
  adminService
};