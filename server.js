import express from 'express';
import mongoose from 'mongoose';
const app = express();
import {APP_PORT,DB_CONNECION} from './config';
import errorHandler from './middleware/errorHandler';
import api_routes from './routes';
import path from 'path';

// Database Connection

mongoose.connect(DB_CONNECION,{
    useCreateIndex:true,
    useFindAndModify:false,
    useNewUrlParser:true,
    useUnifiedTopology:true
})
const db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error'));
db.once('open',()=> console.log('Database Connected Successfully'))

// Set Global Variable name as appRoot
global.appRoot = path.resolve(__dirname);
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use('/api',api_routes);

// Serve Static Folder when coming up to request as uploads

app.use('/uploads',express.static('uploads'));

// Error Middleware
app.use(errorHandler);
app.listen(APP_PORT,() => console.log(`Server Listening on port number ${APP_PORT}`))