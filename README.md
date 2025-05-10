# Brown's Bar-B-Cue Food Truck Menu

A modern, responsive menu application for Brown's Bar-B-Cue food truck, built with Next.js, TypeScript, and Tailwind CSS. This application provides a beautiful user interface for browsing authentic BBQ menu items, filtering by categories, and placing orders.

## Features

- **Authentic BBQ Menu**: Showcases Brown's Bar-B-Cue authentic BBQ items including brisket, ribs, chicken, and traditional sides.
- **Digital Menu Board**: Includes a dedicated digital menu board for in-store displays with rotating specials.
- **Multiple Portion Sizes for Sides**: Displays different portion options (5 oz., Pint, Quart, Gallon) with corresponding prices.
- **Beautiful UI with Time-of-Day Theming**: The application adapts its color scheme based on the time of day (morning, day, evening).
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop devices.
- **Offline Support**: Uses IndexedDB and Service Workers to function even without an internet connection.
- **Interactive Animations**: Smooth animations and transitions for an engaging user experience.
- **Advanced Filtering**: Filter menu items by category (BBQ Plates, Sandwiches, Sides, Combos).
- **Cart Management**: Add items to cart with animated feedback, adjust quantities, and view order total.
- **Accessibility**: Built with accessibility in mind, including proper ARIA attributes and keyboard navigation.

## BBQ Menu Highlights

- **BBQ Plates**: Brisket, Ribs, Chicken, Turkey Leg, Pork Chops, and Links
- **BBQ Sandwiches**: Brisket, Ribs, and Chicken
- **Combo Specials**: 2, 3, or 4 meats with sides
- **Sides**: Beans, Potato Salad, and Dirty Rice (available in multiple portion sizes)

### Side Portion Sizes

- 5 oz.: $4.25
- Pint: $9.00
- Quart: $17.00
- Gallon: $45.00

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_KEY=your-supabase-anon-key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Digital Menu Board

The application includes a dedicated digital menu board designed for in-store displays. This feature is perfect for food trucks and quick-service restaurants.

### Digital Menu Features

- **Fullscreen Mode**: Toggle fullscreen display for monitors (press 'F' key)
- **Rotating Specials**: Automatically cycles through daily specials
- **Staff Controls**: Hidden controls for staff to manage the display
- **Day-of-Week Specials**: Automatically updates based on current day
- **Real-time Clock**: Shows current time to customers
- **Multiple Views**: Switch between full menu, specials, and combo deals

Access the digital menu board at: `/digital-menu`

## Tech Stack

- **Next.js**: React framework for server-rendered applications
- **TypeScript**: For type safety and better developer experience
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **IndexedDB**: For offline data storage
- **Service Workers**: For offline functionality and caching

## Project Structure

- `/src/components`: React components
- `/src/hooks`: Custom React hooks
- `/src/lib`: Utility functions and services
- `/src/pages`: Next.js pages
- `/src/styles`: Global styles
- `/public`: Static assets

## Cultural Vocabulary Support

This application has been enhanced with cultural vocabulary support to improve recognition of diverse speech patterns and dialectal variations:

- Support for AAVE (African American Vernacular English)
- Southern Slang recognition
- Latino/Spanglish terminology
- Caribbean/Creole expressions

These enhancements make the menu more inclusive and effective for diverse users by improving recognition accuracy across different cultural contexts and speaking styles.

## Deployment

This application can be easily deployed to Vercel:

```bash
npm run build
npm run start
```

Or deploy directly to Vercel:

```bash
npx vercel
```

## License

MIT
