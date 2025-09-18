const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Supplier = require("../models/Supplier");
const { ensureAuth } = require("../middleware/auth");

// ==================== DANH SÁCH SẢN PHẨM ====================
router.get("/", async (req, res) => {
  try {
    const query = {};
    if(req.query.q) query.name = new RegExp(req.query.q, "i");
    if(req.query.supplier) query.supplier = req.query.supplier;

    const products = await Product.find(query).populate("supplier");
    const suppliers = await Supplier.find();

    // Render đúng view sản phẩm
    res.render("products/index", { products, suppliers, q: req.query.q || '' });
  } catch(err) {
    console.error(err);
    res.send("Đã có lỗi xảy ra");
  }
});

// ==================== THÊM MỚI SẢN PHẨM ====================
router.get("/new", ensureAuth, async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.render("products/form", { type: "product", item: {}, suppliers, action: "/products/new" });
  } catch (err) {
    console.error(err);
    res.send("Đã có lỗi xảy ra");
  }
});

router.post("/new", ensureAuth, async (req, res) => {
  try {
    await Product.create(req.body);
    res.redirect("/products");
  } catch (err) {
    console.error(err);
    res.send("Đã có lỗi xảy ra khi thêm sản phẩm");
  }
});

// ==================== SỬA SẢN PHẨM ====================
router.get("/:id/edit", ensureAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const suppliers = await Supplier.find();
    res.render("products/form", { type: "product", item: product, suppliers, action: `/products/${product._id}/edit` });
  } catch (err) {
    console.error(err);
    res.send("Đã có lỗi xảy ra khi lấy sản phẩm");
  }
});

router.post("/:id/edit", ensureAuth, async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/products");
  } catch (err) {
    console.error(err);
    res.send("Đã có lỗi xảy ra khi cập nhật sản phẩm");
  }
});

// ==================== XÓA SẢN PHẨM ====================
router.post("/:id/delete", ensureAuth, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect("/products");
  } catch (err) {
    console.error(err);
    res.send("Đã có lỗi xảy ra khi xóa sản phẩm");
  }
});

module.exports = router;
