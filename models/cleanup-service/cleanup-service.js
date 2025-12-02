const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
require('dotenv').config();

const VIDEOS_DIRECTORY_PATH = process.env.VIDEOS_DIRECTORY_PATH;

function deleteFileWithCmd(filePath) {
    return new Promise((resolve, reject) => {
        exec(`del /f "${filePath}"`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                reject(error);
            }
            if (stderr) {
                console.error(`Stderr: ${stderr}`);
                reject(new Error(stderr));
            }
            console.log(`File deleted: ${filePath}`);
            resolve(stdout);
        });
    });
}

async function cleanupFiles() {
    try {
        const files = await fs.readdir(VIDEOS_DIRECTORY_PATH);
        for (const file of files) {
            if (file.endsWith('.to_delete')) {
                const filePath = path.join(VIDEOS_DIRECTORY_PATH, file);
                try {
                    await deleteFileWithCmd(filePath);
                } catch (error) {
                    console.error(`Failed to delete ${filePath}:`, error);
                    // If CMD fails, try Node's fs as a fallback
                    try {
                        await fs.unlink(filePath);
                        console.log(`Deleted with fs: ${filePath}`);
                    } catch (fsError) {
                        console.error(`Failed to delete with fs ${filePath}:`, fsError);
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error reading directory:', error);
    }
}

// Run cleanup every 5 seconds
setInterval(cleanupFiles, 5000);

console.log('Cleanup service is running...');
cleanupFiles(); // Run once at startup
