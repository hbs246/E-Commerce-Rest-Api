
import {DEBUG_MODE} from '../config'
import { ValidationError  } from 'joi';
import CustomErrorHandler from '../services/CustomErrorHandler';
const errorHandler = (err , req , res , next)=>{

    let status_code = 500;
    let data = {
        message:'Internal Server Error',
        ...(DEBUG_MODE === 'true' && {originalError : err.message})
    }

    if(err instanceof ValidationError){
        status_code = 422;
        data = {
            message : err.message
        }
    }
    if(err instanceof CustomErrorHandler){
        status_code = err.status ;
        data = {
            message : err.message
        }
    }
    return res.status(status_code).json(data)
}

export default errorHandler;