// controllers/productController.js
const Product = require('../models/Product');
const Supplier = require('../models/Supplier');

exports.index = async (req, res) => {
  try {
    const { supplierId, q } = req.query; // supplierId filter, q search by name
    const suppliers = await Supplier.find().sort({ name: 1 });

    const filter = {};
    if (q) filter.name = new RegExp(q, 'i');
    if (supplierId) filter.supplier = supplierId;

    const products = await Product.find(filter).populate('supplier').sort({ name: 1 });

    res.render('products/index', {
      products,
      suppliers,
      selectedSupplier: supplierId || '',
      q: q || '',
      userId: req.session.userId || null
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.showForm = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ name: 1 });
    res.render('products/form', { product: null, suppliers, userId: req.session.userId || null, errors: [] });
  } catch (err) {
    console.error(err);
    res.redirect('/products');
  }
};

exports.create = async (req, res) => {
  try {
    const { name, price, quantity, supplier } = req.body;
    await Product.create({ name, price: Number(price), quantity: Number(quantity), supplier });
    res.redirect('/products');
  } catch (err) {
    console.error(err);
    const suppliers = await Supplier.find().sort({ name: 1 });
    res.status(500).render('products/form', { product: req.body, suppliers, errors: [err.message] });
  }
};

exports.editForm = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.redirect('/products');
    const suppliers = await Supplier.find().sort({ name: 1 });
    res.render('products/form', { product, suppliers, userId: req.session.userId || null, errors: [] });
  } catch (err) {
    console.error(err);
    res.redirect('/products');
  }
};

exports.update = async (req, res) => {
  try {
    const { name, price, quantity, supplier } = req.body;
    await Product.findByIdAndUpdate(req.params.id, {
      name,
      price: Number(price),
      quantity: Number(quantity),
      supplier
    }, { runValidators: true });
    res.redirect('/products');
  } catch (err) {
    console.error(err);
    const suppliers = await Supplier.find().sort({ name: 1 });
    res.status(500).render('products/form', { product: { _id: req.params.id, ...req.body }, suppliers, errors: [err.message] });
  }
};

exports.delete = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/products');
  } catch (err) {
    console.error(err);
    res.redirect('/products');
  }
};
