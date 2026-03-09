# Database Seeding Scripts

This directory contains scripts to populate your MongoDB database with realistic data for the Air Control Industries e-commerce application.

## Setup

1. First, install the dependencies:

```bash
cd scripts
npm install
```

2. Make sure your `.env` file in the root directory contains the correct `MONGODB_URI`.

## Available Scripts

### Main Scripts

- `npm run seed` - Seed all data (categories, products, users, orders, coupons, reviews)
- `npm run clear` - Clear all data from the database

### Individual Scripts

- `npm run seed:categories` - Seed only product categories
- `npm run seed:products` - Seed products and variants
- `npm run seed:users` - Seed users (admin and regular users)
- `npm run seed:orders` - Seed orders with realistic data

## Usage Examples

### Seed all data

```bash
npm run seed
```

### Clear all data

```bash
npm run clear
```

### Seed specific data types

```bash
npm run seed:categories
npm run seed:products
npm run seed:users
npm run seed:orders
```

## Generated Data

### Categories

The script creates 12 Air Control Industries specific categories:

- Air Compressors
- Air Dryers
- Air Filters
- Air Receivers
- Pneumatic Tools
- Control Valves
- Pressure Regulators
- Lubricators
- Fittings & Couplings
- Hoses & Tubing
- Sealing Solutions
- Instrumentation

### Products

- 5-15 products per category
- Each product has 2-5 media images
- 1-4 variants per product with different colors and sizes
- Realistic pricing and specifications
- Detailed HTML descriptions with features and specs

### Users

- 3 admin users
- 50 regular users
- All users have default passwords:
  - Admin: `admin123`
  - User: `user123`

### Orders

- 100 orders with random products
- Mix of guest and registered user orders
- Different order statuses
- Realistic Indian addresses

### Coupons

- 20 coupons with random discounts
- Mix of percentage and fixed amount discounts
- Usage limits and expiration dates

### Reviews

- 200 reviews for products
- Random ratings (1-5 stars)
- Realistic review comments

## Login Credentials

After seeding, you can use these credentials to login:

### Admin Accounts

- Email: `admin1@aircontrol.com` / Password: `admin123`
- Email: `admin2@aircontrol.com` / Password: `admin123`
- Email: `admin3@aircontrol.com` / Password: `admin123`

### User Accounts

- Any generated user email / Password: `user123`
- Or create a new account during testing

## Notes

- The scripts use ES modules (type: "module" in package.json)
- All data is generated using Faker.js for realistic test data
- Product images use placeholder URLs from Cloudinary demo
- The scripts automatically disconnect from MongoDB when finished
- Data is cleared before seeding to avoid duplicates

## Customization

You can modify the data generation by editing the respective script files:

- `seed-data.js` - Main seeding script with all data generation logic
- `seed-categories.js` - Categories specific to Air Control Industries
- Individual scripts for specific data types

Adjust the numbers and arrays in these files to generate more or less data, or change the types of data being generated.
