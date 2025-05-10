# Food Truck Menu Application

A modern, responsive food truck menu application built with Next.js, TypeScript, Tailwind CSS, and Framer Motion. This application provides a beautiful user interface for browsing menu items, filtering by categories, and placing orders.

## Features

- **Beautiful UI with Time-of-Day Theming**: The application adapts its color scheme based on the time of day (morning, day, evening).
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop devices.
- **Offline Support**: Uses IndexedDB and Service Workers to function even without an internet connection.
- **Real-time Updates**: Connects to Supabase for real-time menu updates.
- **Interactive Animations**: Smooth animations and transitions using Framer Motion.
- **Advanced Filtering**: Filter menu items by category, search query, and dietary preferences.
- **Cart Management**: Add items to cart with animated feedback, adjust quantities, and view order total.
- **Accessibility**: Built with accessibility in mind, including proper ARIA attributes and keyboard navigation.

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

## Tech Stack

- **Next.js**: React framework for server-rendered applications
- **TypeScript**: For type safety and better developer experience
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Framer Motion**: Animation library for React
- **Supabase**: Backend as a service for real-time database
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
