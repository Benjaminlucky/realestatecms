"use strict";

const router = require("express").Router();
const ctrl   = require("../controllers/landsController");
const { requireAuth } = require("../middleware/auth");

// Public
router.get("/",          ctrl.getAll);
router.get("/featured",  ctrl.getFeatured);

// Admin
router.get("/admin/lands",      requireAuth, ctrl.adminGetAll);
router.get("/admin/lands/:id",  requireAuth, ctrl.adminGetById);
router.post("/admin/lands",     requireAuth, ctrl.create);
router.put("/admin/lands/:id",  requireAuth, ctrl.update);
router.delete("/admin/lands/:id", requireAuth, ctrl.remove);

// Public slug — MUST be last
router.get("/:slug", ctrl.getBySlug);

module.exports = router;
