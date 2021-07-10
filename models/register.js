import mongoose from 'mongoose';

const {Schema} = mongoose;

const userRegisterSchema = new Schema({

    name:{type:String,required:true},
    email:{type:String,lowercase:true,unique:true,required:true},
    password:{type:String,required:true},
    // repeat_password:{type:String,required:true},
    role :{type : String , default:'customer'}

},{timestamps:true});

export default mongoose.model('User',userRegisterSchema,'users');