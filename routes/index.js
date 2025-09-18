const express = require("express");
const router = express.Router(); // <<< đây là dòng bạn cần thêm
const Product = require("../models/Product");
const Supplier = require("../models/Supplier");

// Trang chủ
router.get("/", async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    const q = req.query.q || "";
    const supplier = req.query.supplier || "";

    const query = {};
    if (q) query.name = new RegExp(q, "i");
    if (supplier) query.supplier = supplier;

    const products = await Product.find(query).populate("supplier");

    res.render("index", { products, suppliers, q });
  } catch (err) {
    console.error(err);
    res.send("Đã có lỗi xảy ra");
  }
});

module.exports = router;
