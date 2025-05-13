import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import PlateBuilder from '../../components/PlateBuilder';
import { useCart } from '../../contexts/CartContext';

const BuildPlatePage: React.FC = () => {
  const router = useRouter();
  const { size } = router.query;
  const cart = useCart();
  const [plateSize, setPlateSize] = useState<number>(1);
  
  useEffect(() => {
    if (size) {
      const parsedSize = parseInt(size as string, 10);
      if (!isNaN(parsedSize) && parsedSize >= 1 && parsedSize <= 5) {
        setPlateSize(parsedSize);
      } else {
        // Redirect to 1-meat plate if size is invalid
        router.replace('/build-plate/1');
      }
    }
  }, [size, router]);
  
  const handleAddToCart = (plate: any) => {
    cart.addPlate(plate);
    router.push('/');
  };
  
  const handleClose = () => {
    router.push('/');
  };
  
  return (
    <>
      <Head>
        <title>Build Your {plateSize}-Meat Plate | Brown's BBQ</title>
        <meta name="description" content={`Create your custom ${plateSize}-meat BBQ plate with two sides`} />
      </Head>
      
      <main className="container mx-auto px-4 py-8">
        {/* This page is mainly a container for the PlateBuilder modal */}
        {plateSize > 0 && (
          <PlateBuilder
            plateSize={plateSize}
            onClose={handleClose}
            onAddToCart={handleAddToCart}
          />
        )}
      </main>
    </>
  );
};

export default BuildPlatePage;
