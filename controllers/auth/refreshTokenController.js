
import joi from 'joi';
import { REFRESH_SECRET } from '../../config';
import { User , RefreshToken } from '../../models'
import CustomErrorHandler from '../../services/CustomErrorHandler';
import JwtServices from '../../services/JwtServices';
const refreshTokenController = {

    async refreshToken(req, res, next) {


        const refreshTokenSchema = joi.object({

            refresh_token: joi.string().required()
        });

        const { error } = refreshTokenSchema.validate(req.body)

        if (error) {
            return next(error);
        }
        let refreshtoken;
        try {

            // database 

            refreshtoken = await RefreshToken.findOne({ token: req.body.refresh_token });
            if (!refreshtoken) {
                return next(CustomErrorHandler.unAuthorize('Invalid Refresh Token'));
            }

            // Verify Refresh Token
            let userId;
            try {

                const { _id , role } = await JwtServices.verify(refreshtoken.token, REFRESH_SECRET);
                userId = _id;
            } catch (error) {
                return next(CustomErrorHandler.unAuthorize('Invalid Refresh Token'));
            }
            const user = await User.findOne({ _id: userId });
            if (!user) {
                return next(CustomErrorHandler.unAuthorize('No User Found...!'));
            }

            const access_token = await JwtServices.sign({ _id: user._id, role: user.role });
            const refresh_token = await JwtServices.sign({_id: user._id , role: user.role},REFRESH_SECRET,'1y');

            // Database whitlist creator
            await RefreshToken.create({token:refresh_token});

            return res.json({access_token,refresh_token});
        } catch (error) {
            return next(error);
        }

    }
}

export default refreshTokenController;