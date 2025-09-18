const express = require("express");
const router = express.Router();
const Supplier = require("../models/Supplier");

// ==================== DANH SÁCH NHÀ CUNG CẤP ====================
router.get("/", async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.render("suppliers/index", { suppliers });
  } catch(err) {
    console.error(err);
    res.send("Đã có lỗi xảy ra");
  }
});

// ==================== THÊM MỚI NHÀ CUNG CẤP ====================
router.get("/new", (req, res) => {
  res.render("suppliers/form", { type: "supplier", item: {}, action: "/suppliers/new" });
});

router.post("/new", async (req, res) => {
  await Supplier.create(req.body);
  res.redirect("/suppliers");
});

// ==================== SỬA NHÀ CUNG CẤP ====================
router.get("/:id/edit", async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);
  res.render("suppliers/form", { type: "supplier", item: supplier, action: `/suppliers/${supplier._id}/edit` });
});

router.post("/:id/edit", async (req, res) => {
  await Supplier.findByIdAndUpdate(req.params.id, req.body);
  res.redirect("/suppliers");
});

// ==================== XÓA NHÀ CUNG CẤP ====================
router.post("/:id/delete", async (req, res) => {
  await Supplier.findByIdAndDelete(req.params.id);
  res.redirect("/suppliers");
});

module.exports = router;
