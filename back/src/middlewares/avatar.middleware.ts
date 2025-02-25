/* eslint-disable prettier/prettier */
import { Request } from "express";
import { join } from "path";
import multer from "multer";

const MIME_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

const storage = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    const uploadPath = join(__dirname, "..", "..", "public", "avatar");
    cb(null, uploadPath);
  },

  filename: (req: Request, file, cb) => {
    const name = file.originalname.split(" ").join("_").split(".").shift();
    const extension = file.originalname.split(".").pop();
    cb(null, `${name}_${Date.now()}.${extension}`);
  },
});

const fileFilter = (req: Request, file, cb) => {
  if (MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Seuls les fichiers images (JPEG, PNG, GIF, WebP) sont autorisés"), false);
  }
};

const uploadAvatar = multer({ storage, fileFilter }).single("avatar");

export default uploadAvatar;
