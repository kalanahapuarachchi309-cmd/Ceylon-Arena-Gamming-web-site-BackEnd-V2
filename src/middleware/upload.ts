import multer from "multer"

const storage = multer.memoryStorage()

export const upload = multer({
  storage: storage,
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image files are allowed"));
    } else {
      cb(null, true);
    }
  }
});