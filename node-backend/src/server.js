const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route files
const auth = require('./routes/authRoutes');
const packages = require('./routes/packageRoutes');
const transactions = require('./routes/transactionRoutes');
const contact = require('./routes/contactRoutes');
const admin = require('./routes/adminRoutes');

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/auth', auth);
app.use('/api/packages', packages);
app.use('/api/transactions', transactions);
app.use('/api/contact', contact);
app.use('/api/admin', admin);

app.get('/', (req, res) => {
  res.send('Agriculture Backend API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
