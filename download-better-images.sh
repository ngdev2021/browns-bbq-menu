#!/bin/bash

# Create directory for menu item images if it doesn't exist
mkdir -p public/images/menu-items

# Download authentic BBQ images
# Brisket plate - Authentic smoked brisket
curl -o "public/images/menu-items/brisket-plate.jpg" "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80"

# Brisket sandwich - Authentic BBQ sandwich
curl -o "public/images/menu-items/brisket-sandwich.jpg" "https://images.unsplash.com/photo-1639024471283-03518883512d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80"

# Ribs plate - Authentic BBQ ribs
curl -o "public/images/menu-items/ribs-plate.jpg" "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80"

# Ribs sandwich - BBQ rib sandwich
curl -o "public/images/menu-items/ribs-sandwich.jpg" "https://images.unsplash.com/photo-1593030103066-0093718efeb9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80"

# Chicken plate - BBQ chicken
curl -o "public/images/menu-items/chicken-plate.jpg" "https://images.unsplash.com/photo-1527477396000-e27163b481c2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80"

# Chicken sandwich - BBQ chicken sandwich
curl -o "public/images/menu-items/chicken-sandwich.jpg" "https://images.unsplash.com/photo-1606755962773-d324e0a13086?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80"

# Turkey leg - Smoked turkey leg
curl -o "public/images/menu-items/turkey-leg.jpg" "https://images.unsplash.com/photo-1606502973842-f64bc2785fe5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80"

# Baked potato - Loaded baked potato
curl -o "public/images/menu-items/baked-potato.jpg" "https://images.unsplash.com/photo-1633436375153-d7045cb93e38?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80"

# Pork chops - BBQ pork chops
curl -o "public/images/menu-items/pork-chops.jpg" "https://images.unsplash.com/photo-1432139555190-58524dae6a55?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80"

# Links plate - Smoked sausage links
curl -o "public/images/menu-items/links-plate.jpg" "https://images.unsplash.com/photo-1597712682290-caf95352520b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80"

# Combo plate - BBQ combo plate
curl -o "public/images/menu-items/combo-plate.jpg" "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80"

# Beans - BBQ beans
curl -o "public/images/menu-items/beans.jpg" "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80"

# Potato salad - BBQ potato salad
curl -o "public/images/menu-items/potato-salad.jpg" "https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80"

# Dirty rice - BBQ dirty rice
curl -o "public/images/menu-items/dirty-rice.jpg" "https://images.unsplash.com/photo-1596560548464-f010549b84d7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80"

echo "All authentic BBQ menu item images have been downloaded!"
