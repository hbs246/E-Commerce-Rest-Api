import express from 'express';
const router = new express.Router();
import {registerController,loginController,userController,refreshTokenController, logOutController, productController} from '../controllers'
import auth from '../middleware/auth';
import admin from '../middleware/admin';
import product from '../models/product';

// Register routes
router.post('/register',registerController.register);

// Login Routes
router.post('/login',loginController.login);

// Find User Routes
router.get('/me',auth,userController.me);

// Refresh Token Routes
router.post('/refresh-token', auth ,refreshTokenController.refreshToken);

// Log Out Routes
router.post('/logout', auth ,logOutController.logOut);

// Create Products Routes
router.post('/product', productController.store);

// Update Products Routes
router.put('/product/:_id',[auth , admin ],productController.updateProduct);

// Get All Products
router.get('/product',productController.getAllProducts);

// Get Single Product
router.get('/product/:_id',[auth , admin ],productController.getSingleProduct);

// Delete Product
router.delete('/product/:_id',[auth , admin ],productController.deleteProduct);

export default router;