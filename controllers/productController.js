
import productSchema from '../validator/productValidator';
import fs  from 'fs';
import multer from 'multer';
import path from 'path';
import { Product } from '../models';
import CustomErrorHandler from '../services/CustomErrorHandler';

const storage = multer.diskStorage({

    destination: (req, file, cd) => cd(null, 'uploads/'),
    filename: (req, file, cd) => {

        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`
        cd(null, uniqueName)
    }
});

const handleMultipartData = multer({
    storage,
    limits: { filesize: 1000000 * 5 }  // 5 mb
}).single('image');

const productController = {


    async store(req, res, next) {


        // Multipart Form 

        handleMultipartData(req, res, async (err) => {

            if (err) {
                return next(new CustomErrorHandler.serverError(err.message));
            }

            let filePath;
            try {
                filePath = req.file.path;    
            } catch (error) {
                return next(new Error('Please Select Your File'));
            }
            

            // Validation Request

            const { error } = productSchema.validate(req.body);

            if (error) {
                // Delete the uploaded file
                fs.unlink(`${appRoot}/${filePath}`, (err) => {

                    if(err){

                        return next(CustomErrorHandler.serverError(err.message));
                    }
                });
                return next(error);
            }

            const { name , price , size } = req.body;
            let document;
            try {
                document = await Product.create({
                    name,
                    price,
                    size,
                    image:filePath
                });
            } catch (error) {
                return next(error);
            }       
            return res.status(201).json({document});
        });
    },
    async updateProduct(req , res , next){

        handleMultipartData(req, res, async (err) => {

            if (err) {
                return next(new CustomErrorHandler.serverError(err.message));
            }

            let filePath;

            if(req.file){

                try {
                    filePath = req.file.path;    
                } catch (error) {
                    return next(new Error('Please Select Your File'));
                }
                
            }

            // Validation Request

            const { error } = productSchema.validate(req.body);

            if (error) {
                // Delete the uploaded file
                if(req.file){
                    fs.unlink(`${appRoot}/${filePath}`, (err) => {
    
                        if(err){
    
                            return next(CustomErrorHandler.serverError(err.message));
                        }
                    });
                }
                return next(error);
            }

            const { name , price , size } = req.body;
            let result;
            try {
                result = await Product.findOneAndUpdate({_id : req.params._id},{
                    name,
                    price,
                    size,
                    ...(req.file && {image:filePath})
                },{new : true});
            } catch (error) {
                return next(error);
            }       
            return res.status(201).json({result});
        });

    },
    async getAllProducts(req,res,next){

        let products;
        try {
            products = await Product.find().select('-updatedAt -__v').sort({_id:-1});
        } catch (error) {
            return next(CustomErrorHandler.serverError());
        }
        return res.status(200).json({products});
    },
    async getSingleProduct(req,res,next){
        const { _id } = req.params;

        let products;
        try {
            products = await Product.findOne({_id : _id});
        } catch (error) {
            return next(CustomErrorHandler.serverError());
        }
        return res.status(200).json({product});
    },
    async deleteProduct(req ,res , next){
     
        const { _id } = req.params;

        try {
            const document = await Product.findOneAndDelete({_id});
            if(!document){
                return next(new Error('Nothing  to Delete'));
            }

            // Image Delete
            const imagePath = document._doc.image;
            fs.unlink(`${appRoot}/${imagePath}`,(err)=>{
                if(err){
                    return next(CustomErrorHandler.serverError());
                }
                return res.status(200).json({document});
            });

           
        } catch (error) {
            return next(CustomErrorHandler.serverError());
        }
    }
}

export default productController;