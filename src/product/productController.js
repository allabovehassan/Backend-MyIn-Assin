const { Product } = require("./productModel.js");
const messages = require("../../utils/messages.js");
const { default: mongoose } = require("mongoose");
const {
  validateProduct,
  validateUpdateProduct
} = require("./productValidation.js");

async function createProduct(req, res) {
  try {
    const { value, error } = validateProduct(req.body);
    if (error) {
      return res.status(400).send({
        success: false,
        message: messages.VALIDATION_ERROR,
        data: error
      });
    }
    const {
      name,
      description,
      price,
      category,
      stock
    } = value;
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      stock
    });
    if (newProduct && newProduct.name) {
      await newProduct.save();
      return res.status(201).send({
        success: true,
        message: messages.PRODUCT_CREATED_SUCESSFULLY,
        data: {
          product: newProduct
        }
      });
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: messages.SERVER_ERROR,
      data: error.message
    });
  }
}

async function getProducts(req, res) {
  try {
    const products = await Product.find();
    if (products.length > 0) {
      return res.status(200).send({
        success: true,
        message: messages.RECORDS_FETCHED_SUCCESS,
        count: products.length,
        data: products
      });
    }

    return res.status(404).send({
      success: false,
      message: messages.NO_RECORDS_FOUND,
      data: null
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: messages.SERVER_ERROR,
      data: error.message
    });
  }
}

// Get a single product by ID
async function getSingleProduct(req, res) {
  try {
    const product = await Product.findById(
      req.params.id
    );
    if (!product) {
      return res.status(404).send({
        success: false,
        message: messages.PRODUCT_NOT_FOUND,
        data: null
      });
    }
    return res.status(200).send({
      success: true,
      message: messages.RECORD_FETCHED_SUCCESS,
      data: product
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: messages.SERVER_ERROR,
      data: error.message
    });
  }
}

// Update a product (admin route)
async function updateProduct(req, res) {
  try {
    const { value, error } = validateUpdateProduct(
      req.body
    );

    if (error) {
      return res.status(400).send({
        success: false,
        message: messages.VALIDATION_ERROR,
        data: error
      });
    }

    const {
      name,
      description,
      price,
      category,
      stock
    } = value;
    const updatedProduct =
      await Product.findByIdAndUpdate(
        req.params.id,
        { name, description, price, category, stock },
        { new: true }
      );

    if (!updatedProduct) {
      return res.status(404).send({
        success: false,
        message: messages.PRODUCT_NOT_FOUND,
        data: null
      });
    }

    return res.status(200).send({
      success: true,
      message: messages.RECORD_UPDATED_SUCCESS,
      data: updatedProduct
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: messages.SERVER_ERROR,
      data: error.message
    });
  }
}

// Delete a product (admin route)
async function deleteProduct(req, res) {
  try {
    const deletedProduct =
      await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
        data: null
      });
    }

    return res.status(200).send({
      success: true,
      message: "Product deleted successfully",
      data: deletedProduct
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: messages.SERVER_ERROR,
      data: error.message
    });
  }
}


module.exports = {
  createProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct
};
