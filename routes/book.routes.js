const router = require("express").Router();
const Book = require("../models/Book.model");
const isAuthenticated = require("../middlewares/isAuthenticated");
const uploader = require("../config/cloudinary.config");


router.post("/book", isAuthenticated, async (req, res) => {
    try {

      const { title, author } = req.body;
  
      // Cria o novo livro
      const result = await Book.create({ ...req.body });
  
      return res.status(201).json(result);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: "Internal" });
    }
  });

  router.get("/book", async (req, res) => {
    try {
      const result = await Book.find();
  
      return res.status(200).json(result);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: "Internal server error." });
    }
  });

  router.get("/book:_id", async (req, res) => {
    try {
        const { _id } = req.params;
    
        const result = await Book.findOne({ _id })
          .populate("books") // carregar todos os objetos de livros no lugar de somente os ids
          .populate({
            path: "livros",
            populate: { path: "title", model: "Book" },
          })
    
        return res.status(200).json(result);
      } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Internal server error." });
      }
  });

  router.patch("/book/:_id", isAuthenticated, async (req, res) => {
    try {
      const { _id } = req.params;
  
      const result = await Book.findOneAndUpdate(
        { _id, ownerId: req.user._id },
        { $set: req.body },
        { new: true, runValidators: true }
      );
  
      return res.status(200).json(result);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: "Internal server error." });
    }
  });

  router.delete("/book/:_id", isAuthenticated, async (req, res) => {
    try {
      const { _id } = req.params;

      const result = await Book.findOneAndDelete(
        { _id, ownerId: req.user._id },
        { new: true }
      );
      return res.status(200).json({});
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: "Internal server error." });
    }
  });

//rota upload imagem do livro
router.post("/upload", uploader.single("coverImage"), (req, res) => {
    if (!req.file) {
      return res
        .status(500)
        .json({ msgUpload: "It was not possible to upload this file" });
    }
  
    return res.status(201).json({ fileUrl: req.file.path });
  });


  module.exports = router;