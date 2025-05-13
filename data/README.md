# Brown's Bar-B-Cue Menu Data Storage

This directory contains the persistent data files for the Brown's Bar-B-Cue menu application. These files are managed by the server-side API and should not be edited manually.

## Files

- `menu-items.json`: Contains all menu items including their descriptions, prices, ingredients, and other metadata.
- `business-settings.json`: Contains business information such as contact details and operational settings.
- `digital-menu-settings.json`: Contains settings for the digital menu board display.

## How It Works

The CMS saves data to these files through API endpoints located in `/src/pages/api/menu.ts`. The data is stored in JSON format and is loaded when the application starts.

### Data Flow

1. When changes are made in the admin dashboard, they are first saved to local storage as a backup.
2. The changes are then sent to the server via API calls to be saved in these JSON files.
3. When the application loads, it first tries to load data from the server, then falls back to local storage if the server is unavailable.

### Backup and Recovery

If you need to back up your menu data, you can:

1. Copy these JSON files to a secure location.
2. Use the "Export Data" feature in the admin dashboard.

To restore from a backup:

1. Replace these files with your backup files.
2. Use the "Import Data" feature in the admin dashboard.

## Security Note

These files contain your business data. Ensure that proper file permissions are set to prevent unauthorized access.
