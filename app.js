// src/app.js
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./config/database');
const authMiddleware = require('./middleware/auth');

// Middleware
app.use(cors());
app.use(express.json());
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
const propertyRoutes = require('./routes/propertyRoutes');
app.use('/api', propertyRoutes);
app.use('/api', require('./routes/searchRoutes'));
const inquiryRoutes = require('./routes/inquiryRoutes');
app.use('/api', inquiryRoutes);
const favoriteRoutes=require('./routes/favoriteRoutes');
app.use('/api',favoriteRoutes);
const projectRoutes =require('./routes/projectRoutes');
app.use('/api',projectRoutes);
const priceController=require('./routes/PriceRoutes');
app.use('/api',priceController);
const brokerRoutes=require('./routes/BrokerRoutes');
app.use('/api',brokerRoutes);
const reviewRoutes=require('./routes/reviewRoutes');
app.use('/api',reviewRoutes);
const alertRoutes = require('./routes/alertRoutes');
app.use('/api', alertRoutes);
const adminRoutes = require('./routes/adminRoutes');
app.use('/api', adminRoutes);
const sellerRoutes=require("./routes/sellerRoutes");
app.use('/api/seller',sellerRoutes);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});
app.get("/",(req,res)=>{
  res.send("running sucesffuly")
})

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
