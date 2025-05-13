import React from 'react';
import { useRouter } from 'next/router';
import { getMenuItemImagePath, getCacheBustedImageUrl } from '../lib/imageUtils';

interface PlateOption {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  tags: string[];
  stock: number;
  featured: boolean;
}

interface PlateOptionsProps {
  plateOptions: PlateOption[];
}

const PlateOptions: React.FC<PlateOptionsProps> = ({ plateOptions }) => {
  const router = useRouter();

  const handlePlateSelect = (plateSize: number) => {
    router.push(`/build-plate/${plateSize}`);
  };

  // Extract plate size from id (e.g., "plate-3" => 3)
  const getPlateSize = (plateId: string): number => {
    const match = plateId.match(/plate-(\d+)/);
    return match ? parseInt(match[1], 10) : 1;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plateOptions.map((plate) => (
        <div
          key={plate.id}
          className="bg-charcoal-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <div className="relative h-48">
            <img
              src={getCacheBustedImageUrl(getMenuItemImagePath(plate.image_url))}
              alt={plate.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/placeholder-food.jpg';
              }}
            />
            {plate.featured && (
              <div className="absolute top-0 right-0 bg-amber-600 text-white px-3 py-1 rounded-bl-lg font-medium text-sm">
                Popular
              </div>
            )}
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-white">{plate.name}</h3>
              <span className="text-amber-500 font-bold">${plate.price.toFixed(2)}</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">{plate.description}</p>
            <button
              onClick={() => handlePlateSelect(getPlateSize(plate.id))}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
            >
              Customize Plate
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlateOptions;
