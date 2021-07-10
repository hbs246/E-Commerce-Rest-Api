import Joi from "joi";
import { RefreshToken } from "../../models";

const logOutController = {

    async logOut( req , res , next ){


        // Validation
        const refreshSchema = Joi.object({
            refresh_token : Joi.string().required()
        });

        const { error } = refreshSchema.validate(req.body);

        if(error){
            return next(error);
        }

        try {
            const result = await RefreshToken.deleteOne({token:req.body.refresh_token});
            return res.json({result});
        } catch (error) {
            return next(new Error('Something went wrong in the database'));
        }

    }
}

export default logOutController;