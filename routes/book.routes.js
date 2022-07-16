const router = require("express").Router();
const Book = require("../models/Book.model");
const isAuthenticated = require("../middlewares/isAuthenticated");
const uploader = require("../config/cloudinary.config");
const attachCurrentUser = require("../middlewares/attachCurrentUser");


router.post("/book", isAuthenticated, attachCurrentUser, async (req, res) => {
    try {

      const criateBook = await Book.create({
        ...req.body,
      });

      res.status(201).json(criateBook);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
);

router.get("/book", async (req,res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);

    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
);

router.get('/book/:id', async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id })
  
      if (!book) {
        return res.status(404).json({msg:'Book not found'})
      }
  
      res.status(200).json(book)
  
    } catch (err) {
      console.log(err)
      req.status(500).json(err);
    }
  }
);

router.patch("/book/:id", isAuthenticated,  async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id });
      if (!book) {
        return res.status(404).json({ msg:"Book not found." });
      }
  
    const BookUpdate = await Book.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
      );
  
        res.status(200).json(BookUpdate);
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
  }
);

router.delete("/book/:id", isAuthenticated, async (req, res) => {
  try {
    const result = await Book.deleteOne({_id: req.params.id})
    
      if(result.deletedCount < 1) {
        return res.status(400),json({msg:"Book not found"})
      }
        res.status(200).json({});
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  }
);

router.post("/upload", isAuthenticated, uploader.single("picture"), (req, res) => {
  if (!req.file) {
    return res
      .status(500)
      .json({ msgUpload: "It was not possible to upload this file" });
    }
  
    return res.status(201).json({  url: req.file.path  });
  }
);

  module.exports = router;