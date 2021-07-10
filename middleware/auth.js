import { JWT_SECRET } from "../config";
import CustomErrorHandler from "../services/CustomErrorHandler";
import JwtServices from "../services/JwtServices";
import { REFRESH_SECRET } from "../config";
const auth = async(req , res , next)=>{

    const authHeader = req.headers.authorization;
    if(!authHeader){
        return next(CustomErrorHandler.unAuthorize());
    }

    const token = authHeader.split(' ')[1];
    
    try {
        
        const { _id , role } = await JwtServices.verify(token);
        const user = {
            _id,
            role
        }
        req.user = user;
        next();
    } catch (error) {
        return next(CustomErrorHandler.unAuthorize());    
    }
}
export default auth ;