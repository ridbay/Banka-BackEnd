const Image = require("../models/image.model");

exports.create = async (req, res) => {
    try {
      const newImage = new Image({
        imageUrl: req.body.imageUrl
      });
      await newImage.save();
      res.json(newImage.imageUrl);
    } catch (err) {
      console.error('Something went wrong', err);
    }
  };
  ​
  exports.findOne = async (req, res) => {
    const getImage = await Image.findOne().sort({ id: -1 });
    res.json(getImage.imageUrl);
  };