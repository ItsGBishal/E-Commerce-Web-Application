const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

dotenv.config();

const BASE_IMAGE_URL = 'http://localhost:5000/images/products';

const products = [
  {
    name: 'Black and Gray Athletic Cotton Socks - 6 Pairs',
    description: 'Comfortable athletic cotton socks perfect for sports and everyday wear. Pack of 6 pairs.',
    price: 10.90,
    category: 'Clothing',
    stock: 80,
    imageUrl: `${BASE_IMAGE_URL}/athletic-cotton-socks-6-pairs.jpg`
  },
  {
    name: 'Intermediate Size Basketball',
    description: 'High-quality composite basketball suitable for intermediate players, ideal for indoor and outdoor courts.',
    price: 20.95,
    category: 'Sports',
    stock: 35,
    imageUrl: `${BASE_IMAGE_URL}/intermediate-composite-basketball.jpg`
  },
  {
    name: 'Adults Plain Cotton T-Shirt - 2 Pack',
    description: 'Soft and breathable plain cotton t-shirts in a relaxed fit. Comes in a 2-pack, teal color.',
    price: 7.99,
    category: 'Clothing',
    stock: 60,
    imageUrl: `${BASE_IMAGE_URL}/adults-plain-cotton-tshirt-2-pack-teal.jpg`
  },
  {
    name: '2 Slot Toaster - White',
    description: 'Compact and efficient 2-slot toaster with multiple browning settings. Sleek white finish.',
    price: 18.99,
    category: 'Appliances',
    stock: 45,
    imageUrl: `${BASE_IMAGE_URL}/2-slot-toaster-white.jpg`
  },
  {
    name: '2 Piece White Dinner Plate Set',
    description: 'Elegant ceramic dinner plates, microwave and dishwasher safe. Pack of 2.',
    price: 20.67,
    category: 'Kitchen',
    stock: 40,
    imageUrl: `${BASE_IMAGE_URL}/elegant-white-dinner-plate-set.jpg`
  },
  {
    name: '3 Piece Non-Stick, Black Cooking Pot Set',
    description: 'Durable non-stick cooking pot set in classic black. Includes 3 pots with lids for versatile cooking.',
    price: 34.99,
    category: 'Kitchen',
    stock: 30,
    imageUrl: `${BASE_IMAGE_URL}/3-piece-cooking-set.jpg`
  },
  {
    name: 'Cotton Oversized Sweater - Gray',
    description: 'Cozy and stylish oversized cotton sweater in a neutral gray tone, perfect for casual wear.',
    price: 24.00,
    category: 'Clothing',
    stock: 55,
    imageUrl: `${BASE_IMAGE_URL}/women-plain-cotton-oversized-sweater-gray.jpg`
  },
  {
    name: '2 Piece Luxury Towel Set - White',
    description: 'Ultra-soft premium bath towels with high absorbency. Elegant white finish, pack of 2.',
    price: 35.99,
    category: 'Home',
    stock: 50,
    imageUrl: `${BASE_IMAGE_URL}/luxury-towel-set.jpg`
  },
  {
    name: 'Ultra Soft Tissue 2-Ply - 8 Boxes',
    description: 'Gentle and soft 2-ply facial tissue, hypoallergenic. Bulk pack of 8 boxes.',
    price: 23.74,
    category: 'Home',
    stock: 100,
    imageUrl: `${BASE_IMAGE_URL}/facial-tissue-2-ply-8-boxes.jpg`
  },
  {
    name: "Women's Striped Beach Dress",
    description: 'Light and breezy beach cover-up dress with vibrant stripes. Perfect for summer outings.',
    price: 29.70,
    category: 'Clothing',
    stock: 40,
    imageUrl: `${BASE_IMAGE_URL}/women-striped-beach-dress.jpg`
  },
  {
    name: "Women's Sandal Heels - Pink",
    description: 'Elegant pink sandal heels with cushioned insole and adjustable strap, great for any occasion.',
    price: 53.00,
    category: 'Footwear',
    stock: 30,
    imageUrl: `${BASE_IMAGE_URL}/women-sandal-heels-white-pink.jpg`
  },
  {
    name: 'Round Sunglasses',
    description: 'Trendy round gold-framed sunglasses with UV400 protection lenses.',
    price: 35.60,
    category: 'Accessories',
    stock: 25,
    imageUrl: `${BASE_IMAGE_URL}/round-sunglasses-gold.jpg`
  },
  {
    name: 'Blackout Curtains Set - Beige',
    description: 'Room-darkening blackout curtains in a neutral beige tone. Sold as a set of 2 panels.',
    price: 45.99,
    category: 'Home',
    stock: 35,
    imageUrl: `${BASE_IMAGE_URL}/blackout-curtain-set-beige.jpg`
  },
  {
    name: "Women's Summer Jean Shorts",
    description: 'Classic denim jean shorts with a relaxed fit, perfect for warm weather and casual outings.',
    price: 16.99,
    category: 'Clothing',
    stock: 50,
    imageUrl: `${BASE_IMAGE_URL}/women-summer-jean-shorts.jpg`
  },
  {
    name: 'Electric Hot Water Kettle - White',
    description: 'Fast-boiling stainless steel electric kettle with auto shut-off and 1.7L capacity. White finish.',
    price: 50.74,
    category: 'Appliances',
    stock: 40,
    imageUrl: `${BASE_IMAGE_URL}/electric-steel-hot-water-kettle-white.jpg`
  },
  {
    name: 'Waterproof Knit Athletic Sneakers - Gray',
    description: 'Lightweight waterproof knit sneakers with cushioned soles, ideal for running and everyday wear.',
    price: 53.90,
    category: 'Footwear',
    stock: 45,
    imageUrl: `${BASE_IMAGE_URL}/knit-athletic-sneakers-gray.jpg`
  },
  {
    name: 'Straw Wide Brim Sun Hat',
    description: 'Classic woven straw hat with a wide brim for sun protection. Perfect for beach days.',
    price: 22.00,
    category: 'Accessories',
    stock: 60,
    imageUrl: `${BASE_IMAGE_URL}/straw-sunhat.jpg`
  },
  {
    name: "Men's Athletic Sneaker - White",
    description: 'Clean and modern white athletic sneakers with breathable mesh upper and cushioned insole.',
    price: 45.90,
    category: 'Footwear',
    stock: 55,
    imageUrl: `${BASE_IMAGE_URL}/men-athletic-shoes-white.jpg`
  },
  {
    name: "Men's Wool Sweater - Black",
    description: 'Premium stretch wool sweater in classic black. Slim fit, perfect for layering.',
    price: 33.74,
    category: 'Clothing',
    stock: 40,
    imageUrl: `${BASE_IMAGE_URL}/men-stretch-wool-sweater-black.jpg`
  },
  {
    name: 'Bathroom Bath Mat 16 x 32 Inch - Grey',
    description: 'Soft and absorbent grey bath mat with non-slip backing. Machine washable.',
    price: 18.50,
    category: 'Home',
    stock: 70,
    imageUrl: `${BASE_IMAGE_URL}/bathroom-mat.jpg`
  },
  {
    name: "Women's Ballet Flat - White",
    description: 'Classic knit ballet flats in white with cushioned insole and flexible outsole.',
    price: 26.40,
    category: 'Footwear',
    stock: 45,
    imageUrl: `${BASE_IMAGE_URL}/women-knit-ballet-flat-white.jpg`
  },
  {
    name: "Men's Golf Polo Shirt - Gray",
    description: 'Moisture-wicking polo shirt in gray, ideal for golf and casual wear. Slim fit.',
    price: 15.99,
    category: 'Clothing',
    stock: 60,
    imageUrl: `${BASE_IMAGE_URL}/men-golf-polo-t-shirt-gray.jpg`
  },
  {
    name: 'Laundry Detergent Tabs, 50 Loads',
    description: 'Pre-measured laundry detergent tabs with powerful stain-fighting formula. 50 loads per pack.',
    price: 28.99,
    category: 'Home',
    stock: 90,
    imageUrl: `${BASE_IMAGE_URL}/laundry-detergent-tabs.jpg`
  },
  {
    name: 'Sterling Silver Leaf Branch Earrings',
    description: 'Delicate leaf branch stud earrings crafted from sterling silver. Elegant everyday accessory.',
    price: 67.99,
    category: 'Accessories',
    stock: 25,
    imageUrl: `${BASE_IMAGE_URL}/sky-leaf-branch-earrings.jpg`
  },
  {
    name: 'Duvet Cover Set, Diamond Pattern',
    description: 'Soft microfiber queen duvet cover set with diamond jacquard pattern. Includes 2 pillowcases.',
    price: 43.99,
    category: 'Home',
    stock: 30,
    imageUrl: `${BASE_IMAGE_URL}/duvet-cover-set-gray-queen.jpg`
  },
  {
    name: "Women's Knit Winter Beanie - Blue",
    description: 'Warm and stretchy knit beanie with pom-pom in a vibrant blue. One size fits most.',
    price: 19.50,
    category: 'Accessories',
    stock: 65,
    imageUrl: `${BASE_IMAGE_URL}/women-knit-beanie-pom-pom-blue.jpg`
  },
  {
    name: "Men's Chino Pants - Beige",
    description: 'Classic slim-fit chino pants in beige with stretch fabric for all-day comfort.',
    price: 22.90,
    category: 'Clothing',
    stock: 55,
    imageUrl: `${BASE_IMAGE_URL}/men-chino-pants-beige.jpg`
  },
  {
    name: "Men's Navigator Sunglasses",
    description: 'Classic navigator-style sunglasses with black frame and UV-protective lenses.',
    price: 36.90,
    category: 'Accessories',
    stock: 30,
    imageUrl: `${BASE_IMAGE_URL}/men-navigator-sunglasses-black.jpg`
  },
  {
    name: "Men's Brown Flat Sneakers",
    description: 'Stylish low-top brown flat sneakers with leather-look upper and rubber sole.',
    price: 24.99,
    category: 'Footwear',
    stock: 40,
    imageUrl: `${BASE_IMAGE_URL}/men-brown-flat-sneakers.jpg`
  },
  {
    name: 'Non-Stick Cook Set With Lids - 4 Pieces',
    description: 'Complete non-stick cookware set with 4 pots and matching lids. Even heat distribution.',
    price: 67.97,
    category: 'Kitchen',
    stock: 20,
    imageUrl: `${BASE_IMAGE_URL}/non-stick-cooking-set-4-pieces.jpg`
  },
  {
    name: 'Vanity Mirror with LED Lights - Pink',
    description: 'Illuminated vanity mirror with adjustable LED lighting, perfect for makeup application.',
    price: 25.49,
    category: 'Home',
    stock: 35,
    imageUrl: `${BASE_IMAGE_URL}/vanity-mirror-pink.jpg`
  },
  {
    name: "Women's Relaxed Lounge Pants - Pink",
    description: 'Ultra-comfortable relaxed-fit lounge pants in soft pink, ideal for lounging at home.',
    price: 34.00,
    category: 'Clothing',
    stock: 50,
    imageUrl: `${BASE_IMAGE_URL}/women-relaxed-lounge-pants-pink.jpg`
  },
  {
    name: 'Crystal Zirconia Stud Earrings - Pink',
    description: 'Sparkling crystal zirconia stud earrings in a rose-pink hue. Hypoallergenic posts.',
    price: 34.67,
    category: 'Accessories',
    stock: 40,
    imageUrl: `${BASE_IMAGE_URL}/crystal-zirconia-stud-earrings-pink.jpg`
  },
  {
    name: 'Glass Screw Lid Containers - 3 Pieces',
    description: 'Airtight borosilicate glass food storage containers with screw-on lids. Set of 3.',
    price: 28.99,
    category: 'Kitchen',
    stock: 45,
    imageUrl: `${BASE_IMAGE_URL}/glass-screw-lid-food-containers.jpg`
  },
  {
    name: 'Black and Silver Espresso Maker',
    description: 'Compact espresso machine with 15-bar pressure pump and steam wand for lattes and cappuccinos.',
    price: 82.50,
    category: 'Appliances',
    stock: 20,
    imageUrl: `${BASE_IMAGE_URL}/black-and-silver-espresso-maker.jpg`
  },
  {
    name: 'Blackout Curtains Set 42 x 84-Inch - Teal',
    description: 'Energy-saving blackout curtains in a rich teal color. Blocks 99% of light. Set of 2.',
    price: 30.99,
    category: 'Home',
    stock: 35,
    imageUrl: `${BASE_IMAGE_URL}/blackout-curtains-set-teal.jpg`
  },
  {
    name: 'Bath Towels 2 Pack - Gray, Rosewood',
    description: 'Premium cotton bath towels in gray and rosewood. Highly absorbent and quick-drying.',
    price: 29.90,
    category: 'Home',
    stock: 50,
    imageUrl: `${BASE_IMAGE_URL}/bath-towel-set-gray-rosewood.jpg`
  },
  {
    name: 'Athletic Skateboard Shoes - Gray',
    description: 'Durable low-top skateboard shoes with reinforced toe cap and padded collar.',
    price: 33.90,
    category: 'Footwear',
    stock: 40,
    imageUrl: `${BASE_IMAGE_URL}/athletic-skateboard-shoes-gray.jpg`
  },
  {
    name: 'Countertop Push Blender - Black',
    description: 'High-powered push-button blender for smoothies, soups, and shakes. 1000W motor.',
    price: 107.47,
    category: 'Appliances',
    stock: 15,
    imageUrl: `${BASE_IMAGE_URL}/countertop-push-blender-black.jpg`
  },
  {
    name: "Men's Fleece Hoodie - Light Teal",
    description: 'Cozy midweight fleece hoodie in light teal with kangaroo pocket and drawstring hood.',
    price: 38.00,
    category: 'Clothing',
    stock: 60,
    imageUrl: `${BASE_IMAGE_URL}/men-cozy-fleece-hoodie-light-teal.jpg`
  },
  {
    name: 'Artistic Bowl and Plate Set - 6 Pieces',
    description: 'Hand-painted ceramic bowl and plate set with artistic design. Microwave and dishwasher safe.',
    price: 38.99,
    category: 'Kitchen',
    stock: 25,
    imageUrl: `${BASE_IMAGE_URL}/artistic-bowl-set-6-piece.jpg`
  },
  {
    name: '2-Ply Kitchen Paper Towels - 8 Pack',
    description: 'Strong and absorbent 2-ply kitchen paper towels. Bulk pack of 8 rolls.',
    price: 18.99,
    category: 'Home',
    stock: 120,
    imageUrl: `${BASE_IMAGE_URL}/kitchen-paper-towels-8-pack.jpg`
  },
  {
    name: 'Logitech Wireless Mouse',
    description: 'Ergonomic wireless mouse with long battery life and smooth tracking.',
    price: 15.00,
    category: 'Electronics',
    stock: 50,
    imageUrl: `${BASE_IMAGE_URL}/logitech-wireless-mouse.jpg`
  },
  {
    name: 'Sony Noise Cancelling Headphones',
    description: 'Premium over-ear headphones with industry-leading noise cancellation.',
    price: 312.50,
    category: 'Electronics',
    stock: 20,
    imageUrl: `${BASE_IMAGE_URL}/sony-noise-cancelling-headphones.jpg`
  },
  {
    name: 'Samsung 25W Fast Charger',
    description: 'Compact and powerful fast charger for all your USB-C devices.',
    price: 18.75,
    category: 'Electronics',
    stock: 100,
    imageUrl: `${BASE_IMAGE_URL}/samsung-25w-fast-charger.jpg`
  },
  {
    name: 'Atomic Habits by James Clear',
    description: 'An easy and proven way to build good habits and break bad ones.',
    price: 5.60,
    category: 'Books',
    stock: 75,
    imageUrl: `${BASE_IMAGE_URL}/atomic-habits-book.jpg`
  },
  {
    name: 'The Alchemist by Paulo Coelho',
    description: 'A global phenomenon, The Alchemist is the magical story of Santiago.',
    price: 3.75,
    category: 'Books',
    stock: 60,
    imageUrl: `${BASE_IMAGE_URL}/the-alchemist-book.jpg`
  },
  {
    name: 'Clean Code by Robert C. Martin',
    description: 'A handbook of agile software craftsmanship.',
    price: 22.50,
    category: 'Books',
    stock: 30,
    imageUrl: `${BASE_IMAGE_URL}/clean-code-book.jpg`
  }
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce');
    await Promise.all([User.deleteMany({}), Product.deleteMany({}), Order.deleteMany({})]);

    const [adminPassword, userPassword] = await Promise.all([
      bcrypt.hash('admin123', 10),
      bcrypt.hash('user123', 10)
    ]);

    await User.create([
      { name: 'Store Admin', email: 'admin@store.com', password: adminPassword, role: 'admin' },
      { name: 'Demo User', email: 'user@store.com', password: userPassword, role: 'user' }
    ]);

    await Product.insertMany(products.map(p => ({ ...p, price: Math.round(p.price * 80) })));
    console.log(`Seed complete: admin, user, and ${products.length} products created.`);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seed();
