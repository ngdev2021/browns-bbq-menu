import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { MenuItem, BusinessSettings, DigitalMenuSettings } from '../../lib/menuService';

// Define the data directory path
const dataDir = path.join(process.cwd(), 'data');
const menuFilePath = path.join(dataDir, 'menu-items.json');
const businessSettingsPath = path.join(dataDir, 'business-settings.json');
const digitalMenuSettingsPath = path.join(dataDir, 'digital-menu-settings.json');

// Ensure the data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

type ResponseData = {
  success: boolean;
  message?: string;
  data?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle GET request to retrieve menu items
  if (req.method === 'GET') {
    try {
      const { type } = req.query;
      
      let filePath = menuFilePath;
      if (type === 'business') {
        filePath = businessSettingsPath;
      } else if (type === 'digital') {
        filePath = digitalMenuSettingsPath;
      }
      
      // Check if the file exists
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ 
          success: false, 
          message: 'Data file not found. No data has been saved yet.' 
        });
      }
      
      // Read the file
      const fileData = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(fileData);
      
      return res.status(200).json({ success: true, data });
    } catch (error) {
      console.error('Error reading data file:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to read data file' 
      });
    }
  }
  
  // Handle POST request to save menu items
  if (req.method === 'POST') {
    try {
      const { type, data } = req.body;
      
      if (!data) {
        return res.status(400).json({ 
          success: false, 
          message: 'No data provided' 
        });
      }
      
      let filePath = menuFilePath;
      if (type === 'business') {
        filePath = businessSettingsPath;
      } else if (type === 'digital') {
        filePath = digitalMenuSettingsPath;
      }
      
      // Write the data to the file
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      
      return res.status(200).json({ 
        success: true, 
        message: 'Data saved successfully' 
      });
    } catch (error) {
      console.error('Error saving data:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to save data' 
      });
    }
  }
  
  // Handle unsupported methods
  return res.status(405).json({ 
    success: false, 
    message: 'Method not allowed' 
  });
}
