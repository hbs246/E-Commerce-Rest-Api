import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

class JwtServices {

    static sign(payload, secret = JWT_SECRET, expiry = '60s') {

        return jwt.sign(payload, secret, { expiresIn: expiry })
    }

    static verify(token,secret = JWT_SECRET){
        return jwt.verify(token,secret);
    }
}

export default JwtServices;