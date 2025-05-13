import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

type ResponseData = {
  success: boolean;
  data?: any;
  message?: string;
};

// Path to the plate options JSON file
const plateOptionsPath = path.join(process.cwd(), 'data', 'plate-options.json');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle GET request to retrieve plate options
  if (req.method === 'GET') {
    try {
      // Check if the file exists
      if (!fs.existsSync(plateOptionsPath)) {
        // If file doesn't exist, return default plate options
        const defaultPlateOptions = [
          {
            id: 'plate-1',
            name: '1-Meat Plate',
            description: 'Your choice of 1 meat served with two sides.',
            price: 14.99,
            category: 'plates',
            image_url: '/images/menu-items/brisket-plate.jpg',
            tags: ['bbq', 'meat', 'plate'],
            stock: 100,
            featured: false
          },
          {
            id: 'plate-2',
            name: '2-Meat Plate',
            description: 'Your choice of 2 meats served with two sides.',
            price: 18.99,
            category: 'plates',
            image_url: '/images/menu-items/ribs-plate.jpg',
            tags: ['bbq', 'meat', 'plate'],
            stock: 100,
            featured: true
          },
          {
            id: 'plate-3',
            name: '3-Meat Plate',
            description: 'Your choice of 3 meats served with two sides.',
            price: 22.99,
            category: 'plates',
            image_url: '/images/menu-items/combo-plate.jpg',
            tags: ['bbq', 'meat', 'plate'],
            stock: 100,
            featured: false
          },
          {
            id: 'plate-4',
            name: '4-Meat Plate',
            description: 'Your choice of 4 meats served with two sides.',
            price: 26.99,
            category: 'plates',
            image_url: '/images/menu-items/combo-plate.jpg',
            tags: ['bbq', 'meat', 'plate'],
            stock: 100,
            featured: false
          },
          {
            id: 'plate-5',
            name: '5-Meat Plate',
            description: 'Your choice of 5 meats served with two sides. The ultimate BBQ experience!',
            price: 29.99,
            category: 'plates',
            image_url: '/images/menu-items/combo-plate.jpg',
            tags: ['bbq', 'meat', 'plate'],
            stock: 100,
            featured: false
          }
        ];
        
        return res.status(200).json({ success: true, data: defaultPlateOptions });
      }
      
      // Read the file
      const fileData = fs.readFileSync(plateOptionsPath, 'utf-8');
      const data = JSON.parse(fileData);
      
      return res.status(200).json({ success: true, data });
    } catch (error) {
      console.error('Error reading plate options file:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to read plate options file' 
      });
    }
  }
  
  // Handle unsupported methods
  return res.status(405).json({ 
    success: false, 
    message: 'Method not allowed' 
  });
}
