import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import {
    uploadMedia,
    getMedia,
    getSingleMedia,
    renameMedia,
    toggleFavorite,
    moveToTrash,
    restoreMedia,
    permanentlyDeleteMedia,
    getTrash
} from "../controllers/mediaController.js";

const router = express.Router();


router.use(authMiddleware);

router.post("/upload",upload.single("file"),uploadMedia);
router.get( "/", getMedia);
router.get("/trash", getTrash);
router.get("/:id",getSingleMedia);
router.patch("/:id",renameMedia);
router.post("/:id/favorite",toggleFavorite);
router.delete( "/:id",moveToTrash);
router.post("/:id/restore",restoreMedia);
router.delete("/:id/permanent",permanentlyDeleteMedia);

export default router;