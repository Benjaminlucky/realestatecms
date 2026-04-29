"use strict";

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX = parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024;
const VALID_FOLDERS = ["lands", "houses", "blog", "general"];
const FOLDER_PREFIX = process.env.CLOUDINARY_FOLDER_PREFIX || "naijarealty";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const raw = req.body?.folder || req.query?.folder || "general";
    const folder = VALID_FOLDERS.includes(raw) ? raw : "general";
    req.uploadFolder = folder;
    return {
      folder: `${FOLDER_PREFIX}/${folder}`,
      allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
      transformation: [{ quality: "auto", fetch_format: "auto" }],
    };
  },
});

function fileFilter(req, file, cb) {
  ALLOWED.has(file.mimetype)
    ? cb(null, true)
    : cb(new Error("Only JPEG, PNG, WebP, and GIF images are allowed"));
}

const upload = multer({ storage, fileFilter, limits: { fileSize: MAX } });
module.exports = { upload };
