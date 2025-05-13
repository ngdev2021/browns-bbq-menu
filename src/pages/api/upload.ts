import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

// Disable the default body parser to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public/uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Parse the incoming form data
    const form = formidable({
      uploadDir: uploadsDir,
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB limit
    });

    return await new Promise((resolve, reject) => {
      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error('Error parsing form:', err);
          res.status(500).json({ error: 'Error uploading file: ' + err.message });
          return resolve(true);
        }

        // Check if files object exists and has the image property
        if (!files || !Object.keys(files).length) {
          res.status(400).json({ error: 'No files were uploaded' });
          return resolve(true);
        }

        // Handle file upload - formidable v4 returns an array for each field
        const fileArray = files.image;
        const file = Array.isArray(fileArray) ? fileArray[0] : fileArray;
        
        if (!file) {
          res.status(400).json({ error: 'No image file found in the request' });
          return resolve(true);
        }

        try {
          // Generate a unique filename
          const timestamp = Date.now();
          const originalFilename = file.originalFilename || 'unknown';
          const fileExtension = path.extname(originalFilename);
          const newFilename = `${timestamp}${fileExtension}`;
          
          // Move the file to the uploads directory with the new name
          const oldPath = file.filepath;
          const newPath = path.join(uploadsDir, newFilename);
          
          // Use fs.promises for better async handling
          await fs.promises.rename(oldPath, newPath);

          // Return the URL to the uploaded file
          const fileUrl = `/uploads/${newFilename}`;
          res.status(200).json({ url: fileUrl, success: true });
          return resolve(true);
        } catch (fileError) {
          console.error('Error processing file:', fileError);
          res.status(500).json({ error: 'Error processing file: ' + (fileError as Error).message });
          return resolve(true);
        }
      });
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Error uploading file: ' + (error as Error).message });
  }
}
