import Joi from 'joi';
import CustomErrorHandler from '../../services/CustomErrorHandler';
import { User } from '../../models';
import bcrypt from 'bcrypt';
import JwtServices from '../../services/JwtServices';
import { REFRESH_SECRET } from '../../config';
import { RefreshToken}  from '../../models';
const registerController = {

    async register(req, res, next) {

        /*
            1] Validate the request
            2] Authorize the request
            3] Check if user is in the database allready
            4] Prepare Models
            5] Store in Database
            6] Generate JWT tokens
            7] Send Response
        */

        // Validate the Request
        const registerSchema = Joi.object({
            name: Joi.string().min(3).max(20).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            repeat_password: Joi.ref('password')
        });

        const { error } = registerSchema.validate(req.body);
        if (error) {
            return next(error);
        }

       
        const { name, email, password} = req.body;
        // check if user is in all ready in database
        try {
            const exists = await User.exists({ email: email });
            if (exists) {
                return next(CustomErrorHandler.allReadyExists('This email is all ready taken...!'));
            }

        } catch (error) {
            return next(error);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        let access_token;
        let refresh_token;
        try {
            
            const user = new User({
                name,
                email,
                password: hashedPassword
            });
            const result = await user.save();
            access_token = await JwtServices.sign({ _id: result._id, role: result.role });
            refresh_token = await JwtServices.sign({_id: result._id , role: result.role},REFRESH_SECRET,'1y');

            // Database whitlist creator
            await RefreshToken.create({token:refresh_token});

            return res.json({access_token,refresh_token});
        } catch (error) {
            return next(error);
        }
       
    }
}
export default registerController;