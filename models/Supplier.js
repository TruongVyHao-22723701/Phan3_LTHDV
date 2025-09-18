// models/Supplier.js
const mongoose = require('mongoose');

const SupplierSchema = new mongoose.Schema({
  name:    { type: String, required: true, trim: true },
  address: { type: String, trim: true },
  phone:   { type: String, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('Supplier', SupplierSchema);
