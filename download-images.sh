#!/bin/bash

# Create directory for menu item images if it doesn't exist
mkdir -p public/images/menu-items

# Download images for BBQ menu items
curl -o "public/images/menu-items/brisket-plate.jpg" "https://images.pexels.com/photos/410648/pexels-photo-410648.jpeg?auto=compress&cs=tinysrgb&w=600"
curl -o "public/images/menu-items/brisket-sandwich.jpg" "https://images.pexels.com/photos/3926133/pexels-photo-3926133.jpeg?auto=compress&cs=tinysrgb&w=600"
curl -o "public/images/menu-items/ribs-plate.jpg" "https://images.pexels.com/photos/533325/pexels-photo-533325.jpeg?auto=compress&cs=tinysrgb&w=600"
curl -o "public/images/menu-items/ribs-sandwich.jpg" "https://images.pexels.com/photos/2233729/pexels-photo-2233729.jpeg?auto=compress&cs=tinysrgb&w=600"
curl -o "public/images/menu-items/chicken-plate.jpg" "https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=600"
curl -o "public/images/menu-items/chicken-sandwich.jpg" "https://images.pexels.com/photos/1352270/pexels-photo-1352270.jpeg?auto=compress&cs=tinysrgb&w=600"
curl -o "public/images/menu-items/turkey-leg.jpg" "https://images.pexels.com/photos/8472100/pexels-photo-8472100.jpeg?auto=compress&cs=tinysrgb&w=600"
curl -o "public/images/menu-items/baked-potato.jpg" "https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=600"
curl -o "public/images/menu-items/pork-chops.jpg" "https://images.pexels.com/photos/3535383/pexels-photo-3535383.jpeg?auto=compress&cs=tinysrgb&w=600"
curl -o "public/images/menu-items/links-plate.jpg" "https://images.pexels.com/photos/929137/pexels-photo-929137.jpeg?auto=compress&cs=tinysrgb&w=600"
curl -o "public/images/menu-items/combo-plate.jpg" "https://images.pexels.com/photos/323682/pexels-photo-323682.jpeg?auto=compress&cs=tinysrgb&w=600"
curl -o "public/images/menu-items/beans.jpg" "https://images.pexels.com/photos/5848496/pexels-photo-5848496.jpeg?auto=compress&cs=tinysrgb&w=600"
curl -o "public/images/menu-items/potato-salad.jpg" "https://images.pexels.com/photos/6607314/pexels-photo-6607314.jpeg?auto=compress&cs=tinysrgb&w=600"
curl -o "public/images/menu-items/dirty-rice.jpg" "https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg?auto=compress&cs=tinysrgb&w=600"

echo "All BBQ menu item images have been downloaded!"
