"use strict";

const router = require("express").Router();
const ctrl = require("../controllers/blogController");
const { requireAuth } = require("../middleware/auth");

router.get("/", ctrl.getAll);
router.get("/categories", ctrl.getCategories);
router.get("/recent", ctrl.getRecent);

router.get("/admin/blog", requireAuth, ctrl.adminGetAll);
router.post("/admin/blog/categories", requireAuth, ctrl.createCategory);
router.delete("/admin/blog/categories/:id", requireAuth, ctrl.deleteCategory);
router.get("/admin/blog/:id", requireAuth, ctrl.adminGetById);
router.post("/admin/blog", requireAuth, ctrl.create);
router.put("/admin/blog/:id", requireAuth, ctrl.update);
router.delete("/admin/blog/:id", requireAuth, ctrl.remove);
router.put("/admin/blog/categories/:id", requireAuth, ctrl.updateCategory);

router.get("/:slug", ctrl.getBySlug);

module.exports = router;
