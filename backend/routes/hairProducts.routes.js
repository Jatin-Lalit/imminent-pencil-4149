const express = require("express");
const { HairProductModel } = require("../models/hairProducts.model");
const { uuidv4 } = require("../configs/uuidGenerator")

const productsRouter = express.Router();


//get route 
productsRouter.get("/get", async (req, res) => {
  try {
    const products = await HairProductModel.find();
    res.status(200).send(products);
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Internal server error" });
  }
});
// Add a new booking
productsRouter.post("/add", async (req, res) => {
  try {
    const productData = req.body;
    req.body.uniqueHairProductId = uuidv4();

    const product = new HairProductModel(productData);
    await product.save();
    res.status(200).send({ msg: "New product added" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: "Cannot add new product" });
  }
});

// Update a booking by ID
productsRouter.patch("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await HairProductModel.findByIdAndUpdate(id, req.body);

    if (!product) {
      return res.status(404).send({ msg: "product not found" });
    }

    res.status(200).send({ msg: "product details updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Internal server error" });
  }
});

// Delete a booking by ID
productsRouter.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await HairProductModel.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).send({ msg: "product not found" });
    }

    res.status(200).send({ msg: "product deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Internal server error" });
  }
});

// get route 


module.exports = {
  productsRouter
};
