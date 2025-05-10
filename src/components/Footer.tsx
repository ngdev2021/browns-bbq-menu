import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h3 className="text-2xl font-bold text-amber-500 mb-2">Brown's Bar-B-Cue</h3>
            <p className="text-gray-300">Authentic BBQ Since 1985</p>
          </div>
          
          <div className="mb-6 md:mb-0">
            <h4 className="text-lg font-semibold text-amber-400 mb-3">Contact Us</h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="mr-2">📱</span>
                <a href="https://brownsbarbcue.com" className="hover:text-amber-300 transition-colors">
                  brownsbarbcue.com
                </a>
              </li>
              <li className="flex items-center">
                <span className="mr-2">☎️</span>
                <a href="tel:+16823528545" className="hover:text-amber-300 transition-colors">
                  (682) 352-8545
                </a>
              </li>
              <li className="flex items-center">
                <span className="mr-2">💳</span>
                <span>CashApp: $brownroscoe</span>
              </li>
              <li className="flex items-center mt-4 pt-2 border-t border-gray-700">
                <span className="mr-2">📺</span>
                <a href="/digital-menu" className="hover:text-amber-300 transition-colors">
                  Digital Menu Board
                </a>
              </li>
              <li className="flex items-center mt-2">
                <span className="mr-2">⚙️</span>
                <a href="/admin" className="hover:text-amber-300 transition-colors">
                  Staff Portal
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-amber-400 mb-3">Hours</h4>
            <ul className="space-y-1">
              <li>Monday - Thursday: 11AM - 8PM</li>
              <li>Friday - Saturday: 11AM - 9PM</li>
              <li>Sunday: 12PM - 6PM</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Brown's Bar-B-Cue. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
