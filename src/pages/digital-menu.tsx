import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import DigitalMenuBoard from '../components/DigitalMenuBoard';
import { useRouter } from 'next/router';

const DigitalMenuPage: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentView, setCurrentView] = useState('menu'); // menu, specials, combos
  const router = useRouter();

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Press 'F' to toggle fullscreen
      if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
      // Press 'Escape' to exit fullscreen
      if (e.key === 'Escape' && isFullscreen) {
        document.exitFullscreen().catch(err => console.error(err));
      }
      // Press 'H' to toggle controls visibility
      if (e.key === 'h' || e.key === 'H') {
        setShowControls(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Handle view changes
  const changeView = (view: string) => {
    setCurrentView(view);
  };

  return (
    <>
      <Head>
        <title>Brown's Bar-B-Cue Digital Menu</title>
        <meta name="description" content="Digital menu board for Brown's Bar-B-Cue" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div 
        className={`min-h-screen bg-gray-900 flex items-center justify-center ${isFullscreen ? 'p-0' : 'p-4'}`}
        style={{
          backgroundImage: 'url("/images/menu-items/brisket.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
          backgroundColor: 'rgba(0,0,0,0.85)'
        }}
      >
        {/* Digital Menu Display */}
        <div className={`${isFullscreen ? 'w-full h-full' : 'w-full max-w-6xl'}`}>
          <DigitalMenuBoard view={currentView as 'menu' | 'specials' | 'combos'} />
          
          {/* Staff Controls - Hidden in fullscreen mode unless toggled */}
          {showControls && (
            <div className={`${isFullscreen ? 'absolute bottom-4 right-4 opacity-80 hover:opacity-100 transition-opacity' : 'mt-8'} p-4 bg-gray-800 rounded-lg text-white`}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400">Staff Controls</p>
                <div className="flex space-x-2">
                  <div className="px-2 py-1 bg-gray-700 rounded text-xs">Press F: Fullscreen</div>
                  <div className="px-2 py-1 bg-gray-700 rounded text-xs">Press H: Hide Controls</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm mb-2 text-left font-bold">Display Controls</p>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={toggleFullscreen} 
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded flex items-center"
                    >
                      <span className="mr-1">{isFullscreen ? '🔽' : '🔼'}</span>
                      {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Mode'}
                    </button>
                    <button 
                      onClick={() => router.push('/')} 
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded flex items-center"
                    >
                      <span className="mr-1">🚪</span>
                      Exit Menu Mode
                    </button>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm mb-2 text-left font-bold">Content Controls</p>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => changeView('menu')} 
                      className={`px-4 py-2 ${currentView === 'menu' ? 'bg-green-600' : 'bg-gray-600'} hover:bg-green-700 rounded`}
                    >
                      Full Menu
                    </button>
                    <button 
                      onClick={() => changeView('specials')} 
                      className={`px-4 py-2 ${currentView === 'specials' ? 'bg-green-600' : 'bg-gray-600'} hover:bg-green-700 rounded`}
                    >
                      Today's Specials
                    </button>
                    <button 
                      onClick={() => changeView('combos')} 
                      className={`px-4 py-2 ${currentView === 'combos' ? 'bg-green-600' : 'bg-gray-600'} hover:bg-green-700 rounded`}
                    >
                      Combo Deals
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DigitalMenuPage;
