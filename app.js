require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const path = require('path');

const sessionConfig = require('./config/session');
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const supplierRoutes = require('./routes/suppliers');
const productRoutes = require('./routes/products');

const app = express();

// Middleware parse body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Method override (cho form PUT, DELETE)
app.use(methodOverride('_method'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
//lautiful layout for EJS
const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);
app.set('layout', 'partials/layout'); // chỉ định layout mặc định

// Session setup (tách riêng trong config/session.js)
sessionConfig(app);

// Đưa session vào res.locals để view (EJS) dùng được
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// MongoDB connect
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sectionAuth', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/suppliers', supplierRoutes);
app.use('/products', productRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
