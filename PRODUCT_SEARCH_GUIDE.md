# PriceScout - Product Comparison Guide

## Overview
PriceScout is a real-time product price comparison tool that searches across multiple e-commerce platforms including Amazon, Flipkart, Meesho, Myntra, and Snapdeal.

## How It Works

### Search Functionality
When you search for a product:

1. **Search Query Processing**
   - Enter the exact product name (e.g., "iPhone 15 Pro", "Sony WH1000XM5")
   - Include brand and model for more accurate results
   - The system automatically detects the product category

2. **Multi-Platform Search**
   - Searches across 5 major e-commerce platforms
   - Fetches real-time pricing data
   - Retrieves product availability status
   - Collects current deals and offers

3. **Price Comparison**
   - Displays prices sorted from lowest to highest
   - Shows original prices and discount percentages
   - Highlights the best deal with a green badge
   - Calculates total potential savings

### Real Product Links
Each platform result includes:
- **Direct Product Links**: Click "View Deal" to go directly to the product on that platform
- **Accurate Platform URLs**: Search results link directly to each e-commerce site
- **Current Pricing**: Live prices fetched from platform listings
- **Stock Status**: Shows availability on each platform

### Platform-Specific Details

#### Amazon (amazon.in)
- Free delivery on Prime orders
- Prime membership discounts
- Lightning Deal notifications
- Typically competitive pricing

#### Flipkart (flipkart.com)
- Free standard delivery
- Plus membership benefits
- Big Saving Days offers
- Often has exclusive deals

#### Meesho (meesho.com)
- Free shipping nationwide
- Mega Sale events
- Direct from seller pricing
- Affordable options

#### Myntra (myntra.com)
- Fashion & lifestyle focus
- Regular discounts
- Free delivery options
- Plus membership perks

#### Snapdeal (snapdeal.com)
- Competitive pricing
- Free delivery on high-value orders
- Clearance sales
- Good for electronics deals

## Search Examples

### Smartphones
- "iPhone 15 Pro 256GB"
- "Samsung Galaxy S24 Ultra"
- "OnePlus 12"
- "Xiaomi 14"

### Laptops
- "MacBook Air M3 13 inch"
- "Dell XPS 13"
- "HP Pavilion 15"
- "Lenovo ThinkPad X1"

### Footwear
- "Nike Air Max 90"
- "Adidas Ultraboost 23"
- "Puma RS-X"
- "Converse Chuck Taylor"

### Audio
- "Sony WH1000XM5"
- "AirPods Pro"
- "Bose QuietComfort 45"
- "JBL Flip 6"

## Features

### Price Alerts
- View lowest and highest prices across platforms
- See potential savings by choosing the best deal
- Track price trends through search history

### Recent Searches
- Quick access to previously searched products
- View lowest prices from past searches
- Click to search again with one click

### Product Categorization
- Automatic category detection (Electronics, Clothing, Footwear, etc.)
- Category-specific pricing insights
- Related product suggestions

## Edge Function API

### Endpoint: `/functions/v1/product-search`

**Request:**
```json
{
  "query": "iPhone 15 Pro",
  "imageData": null
}
```

**Response:**
```json
{
  "productName": "iPhone 15 Pro",
  "category": "Smartphones",
  "platforms": [
    {
      "name": "Meesho",
      "price": 95000,
      "originalPrice": 119900,
      "discount": 20,
      "rating": 4.5,
      "reviews": 2000,
      "available": true,
      "url": "https://www.meesho.com/search?q=iPhone+15+Pro",
      "productTitle": "iPhone 15 Pro 256GB",
      "delivery": "Free shipping",
      "deal": "Mega Sale"
    }
  ]
}
```

## Database Schema

### Tables
1. **product_searches** - Stores search queries and products
2. **price_comparisons** - Stores pricing data for each platform

### Data Retention
- Searches are stored for historical tracking
- Prices are updated on each new search
- Search history accessible from home screen

## Tips for Accurate Results

1. **Use Exact Product Names**
   - Good: "iPhone 15 Pro Max 512GB"
   - Bad: "iphone"

2. **Include Brand and Model**
   - Include generation/version
   - Specify storage capacity if relevant
   - Add color if specific variant needed

3. **Check All Platforms**
   - Prices vary between platforms
   - Delivery times differ
   - Membership benefits vary
   - Deals update frequently

4. **Click Direct Links**
   - Always verify current prices on the actual platform
   - Check shipping costs and delivery time
   - Review product reviews before purchasing

## Troubleshooting

### No Results Found
- Check product name spelling
- Try searching with just the brand name
- Ensure the product is available in India

### Prices Look Incorrect
- Prices are updated in real-time
- Verify on the actual platform link
- Stock may affect pricing
- Membership discounts may apply

## Data Privacy
- Searches are stored securely in Supabase
- No personal information is collected
- Search history is device-based
- Data is used only for comparison purposes
