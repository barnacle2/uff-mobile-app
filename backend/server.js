require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const jwt = require('jsonwebtoken');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// User Model
const UserSchema = new mongoose.Schema({
  email: String,
  name: String,
  picture: String,
  provider: String,
  providerId: String
});

const User = mongoose.model('User', UserSchema);

// Merchant Model
const MerchantSchema = new mongoose.Schema({
  email: String,
  name: String,
  businessName: String,
  businessType: String,
  address: String,
  phone: String,
  logo: String,
  isVerified: { type: Boolean, default: false },
  provider: String,
  providerId: String,
  role: { type: String, default: 'merchant' }
});

const Merchant = mongoose.model('Merchant', MerchantSchema);

// Product Model
const ProductSchema = new mongoose.Schema({
  merchantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Merchant' },
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  isAvailable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', ProductSchema);

// Order Model
const OrderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  merchantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Merchant' },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
    price: Number
  }],
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'preparing', 'ready', 'delivered', 'cancelled'],
    default: 'pending'
  },
  totalAmount: Number,
  deliveryAddress: String,
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', OrderSchema);

// Passport Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ providerId: profile.id, provider: 'google' });
      
      if (!user) {
        user = await User.create({
          email: profile.emails[0].value,
          name: profile.displayName,
          picture: profile.photos[0].value,
          provider: 'google',
          providerId: profile.id
        });
      }
      
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

// Passport Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ providerId: profile.id, provider: 'facebook' });
      
      if (!user) {
        user = await User.create({
          email: profile.emails[0].value,
          name: profile.displayName,
          picture: profile.photos[0].value,
          provider: 'facebook',
          providerId: profile.id
        });
      }
      
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

// Auth Routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET);
    res.redirect(`exp://your-expo-app/auth?token=${token}`);
  }
);

app.get('/auth/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { session: false }),
  (req, res) => {
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET);
    res.redirect(`exp://your-expo-app/auth?token=${token}`);
  }
);

// Token endpoint for mobile app
app.post('/auth/google/token',
  async (req, res) => {
    try {
      const { access_token } = req.body;
      
      // Verify the token with Google
      const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
      const profile = await response.json();
      
      if (!profile.sub) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      // Find or create user
      let user = await User.findOne({ providerId: profile.sub, provider: 'google' });
      
      if (!user) {
        user = await User.create({
          email: profile.email,
          name: profile.name,
          picture: profile.picture,
          provider: 'google',
          providerId: profile.sub
        });
      }

      // Generate JWT
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
      
      res.json({ token, user });
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(500).json({ message: 'Authentication failed' });
    }
  }
);

// Protected Route Example
app.get('/api/user', 
  async (req, res) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) return res.status(401).json({ message: 'No token provided' });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      
      if (!user) return res.status(404).json({ message: 'User not found' });
      
      res.json(user);
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
    }
  }
);

// Merchant Registration
app.post('/api/merchant/register', async (req, res) => {
  try {
    const { email, name, businessName, businessType, address, phone } = req.body;
    
    // Check if merchant already exists
    const existingMerchant = await Merchant.findOne({ email });
    if (existingMerchant) {
      return res.status(400).json({ message: 'Merchant already exists' });
    }

    const merchant = await Merchant.create({
      email,
      name,
      businessName,
      businessType,
      address,
      phone,
      role: 'merchant'
    });

    res.status(201).json(merchant);
  } catch (error) {
    console.error('Merchant registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Product Management
app.post('/api/merchant/products', async (req, res) => {
  try {
    const { merchantId, name, description, price, category, image } = req.body;
    
    const product = await Product.create({
      merchantId,
      name,
      description,
      price,
      category,
      image
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Product creation error:', error);
    res.status(500).json({ message: 'Failed to create product' });
  }
});

// Get Merchant Products
app.get('/api/merchant/:merchantId/products', async (req, res) => {
  try {
    const products = await Product.find({ merchantId: req.params.merchantId });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// Get Merchant Orders
app.get('/api/merchant/:merchantId/orders', async (req, res) => {
  try {
    const orders = await Order.find({ merchantId: req.params.merchantId })
      .populate('customerId', 'name email')
      .populate('items.productId', 'name price');
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// Update Order Status
app.put('/api/merchant/orders/:orderId', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status },
      { new: true }
    );
    res.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Failed to update order' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 