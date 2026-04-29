"use strict";

const router = require("express").Router();
const ctrl   = require("../controllers/housesController");
const { requireAuth } = require("../middleware/auth");

router.get("/",         ctrl.getAll);
router.get("/featured", ctrl.getFeatured);

router.get("/admin/houses",       requireAuth, ctrl.adminGetAll);
router.get("/admin/houses/:id",   requireAuth, ctrl.adminGetById);
router.post("/admin/houses",      requireAuth, ctrl.create);
router.put("/admin/houses/:id",   requireAuth, ctrl.update);
router.delete("/admin/houses/:id",requireAuth, ctrl.remove);

router.get("/:slug", ctrl.getBySlug);

module.exports = router;
