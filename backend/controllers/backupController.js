import fs from 'fs';
import path from 'path';
import { execFile } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createBackup = async (req, res) => {
    try {
        const backupDir = path.join(__dirname, '../backup');
        const uploadsDir = path.join(__dirname, '../uploads');

        // Create backup directory if it doesn't exist
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const dbBackupFile = path.join(backupDir, `db_backup_${timestamp}.sql`);
        const mediaBackupDir = path.join(backupDir, `media_backup_${timestamp}`);

        // Database Configuration
        const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

        // 1. Backup Database
        const mysqldumpCommand = `mysqldump -h ${DB_HOST} -u ${DB_USER} -p${DB_PASSWORD} ${DB_NAME} > "${dbBackupFile}"`;

        const backupDatabase = () => {
            return new Promise((resolve, reject) => {
                execFile('bash', ['-lc', mysqldumpCommand], (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Error executing mysqldump: ${error}`);
                        reject(error);
                    } else {
                        resolve(dbBackupFile);
                    }
                });
            });
        };

        // 2. Backup Media (Copy folder)
        const backupMedia = async () => {
            try {
                if (fs.existsSync(uploadsDir)) {
                    // Node.js 16.7+ supports recursive copy
                    await fs.promises.cp(uploadsDir, mediaBackupDir, { recursive: true });
                    return mediaBackupDir;
                } else {
                    console.warn('Uploads directory not found, skipping media backup.');
                    return null;
                }
            } catch (error) {
                console.error('Error copying media files:', error);
                throw error;
            }
        };

        // Execute backups
        await backupDatabase();
        await backupMedia();

        res.json({
            success: true,
            message: 'Backup created successfully',
            data: {
                database: `db_backup_${timestamp}.sql`,
                media: `media_backup_${timestamp}`
            }
        });

    } catch (error) {
        console.error('Backup failed:', error);
        res.status(500).json({
            success: false,
            message: 'Backup failed',
            error: error.message
        });
    }
};

export const syncUploads = async (req, res) => {
    try {
        const syncScript = process.env.UPLOAD_SYNC_SCRIPT || '/opt/compro-next-pinet/scripts/sync-uploads.sh';

        if (!fs.existsSync(syncScript)) {
            console.error('Sync script not found:', syncScript);
            return res.status(500).json({
                success: false,
                message: 'Upload sync script not found on server'
            });
        }

        await new Promise((resolve, reject) => {
            execFile(syncScript, { env: process.env }, (error, stdout, stderr) => {
                if (error) {
                    console.error('Upload sync failed:', stderr || error.message);
                    return reject(error);
                }
                console.log('Upload sync output:', stdout);
                resolve(stdout);
            });
        });

        res.json({
            success: true,
            message: 'Upload sync completed successfully'
        });
    } catch (error) {
        console.error('Upload sync failed:', error);
        res.status(500).json({
            success: false,
            message: 'Upload sync failed',
            error: error.message
        });
    }
};
