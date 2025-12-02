const { adminService } = require('./services/prismaService');

async function createInitialAdmin() {
    try {
        console.log('Creating initial admin user...');
        
        const admin = await adminService.createAdmin('admin', 'admin123');
        
        console.log('✅ Admin created successfully:', {
            admin_id: admin.admin_id,
            admin_username: admin.admin_username
        });
        
    } catch (error) {
        console.error('❌ Error creating admin:', error);
    } finally {
        process.exit(0);
    }
}

createInitialAdmin(); 