import Joi from 'joi';
import { User } from '../../models';
import CustomErrorHandler from '../../services/CustomErrorHandler';
import JwtServices from '../../services/JwtServices';
import bcrypt from 'bcrypt';
import { REFRESH_SECRET } from '../../config';
import { RefreshToken } from '../../models';
const loginController = {
    async login(req,res,next){


        // Validation 
        const loginSchema = Joi.object({
            email:Joi.string().email().required(),
            password:Joi.string().pattern(new RegExp('^[0-9a-zA-Z]{3,30}$')).required()
        });

        const {error} = loginSchema.validate(req.body);
        if(error){
            return next(error);
        }

        // Check if user is registered or not
 
        const {email , password} = req.body;
        try {
            
            const user = await User.findOne({email:email});
            if(!user){
                return next(CustomErrorHandler.wrongCredentials());
            }
            // Compare the password
            const isMatch = await bcrypt.compare(password,user.password);
            if(!isMatch){
                return next(CustomErrorHandler.wrongCredentials());
            }

            // Generate Token and send to client.
            const access_token = await JwtServices.sign({_id:user._id,role:user.role});
            const refresh_token = await JwtServices.sign({_id: user._id , role: user.role},REFRESH_SECRET,'1y');

            // Database whitlist creator
            await RefreshToken.create({token:refresh_token});
            return res.json({access_token,refresh_token});
        } catch (error) {
            return next(error);
        }

    }
}

export default loginController;