// controllers/supplierController.js
const Supplier = require('../models/Supplier');

exports.index = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ name: 1 });
    res.render('suppliers/index', { suppliers, userId: req.session.userId || null });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.showForm = (req, res) => {
  res.render('suppliers/form', { supplier: null, userId: req.session.userId || null, errors: [] });
};

exports.create = async (req, res) => {
  try {
    const { name, address, phone } = req.body;
    await Supplier.create({ name, address, phone });
    res.redirect('/suppliers');
  } catch (err) {
    console.error(err);
    res.status(500).render('suppliers/form', { supplier: req.body, errors: [err.message] });
  }
};

exports.editForm = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.redirect('/suppliers');
    res.render('suppliers/form', { supplier, userId: req.session.userId || null, errors: [] });
  } catch (err) {
    console.error(err);
    res.redirect('/suppliers');
  }
};

exports.update = async (req, res) => {
  try {
    const { name, address, phone } = req.body;
    await Supplier.findByIdAndUpdate(req.params.id, { name, address, phone }, { runValidators: true });
    res.redirect('/suppliers');
  } catch (err) {
    console.error(err);
    res.status(500).render('suppliers/form', { supplier: { _id: req.params.id, ...req.body }, errors: [err.message] });
  }
};

exports.delete = async (req, res) => {
  try {
    await Supplier.findByIdAndDelete(req.params.id);
    res.redirect('/suppliers');
  } catch (err) {
    console.error(err);
    res.redirect('/suppliers');
  }
};
