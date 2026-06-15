import express from 'express'
import cors from 'cors'
import fileUpload from 'express-fileupload'
import { connectDB } from './config/db.js'
import foodRouter from './routes/foodRoute.js'
import userRouter from './routes/userRoute.js';
import 'dotenv/config';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';

//app config
const app = express()
const port = process.env.PORT;

// middleware
app.use(express.json())
const corsOptions = {
  origin: 'https://nammacart-admin.vercel.app/' 
};

// Apply to all routes
app.use(cors(corsOptions));
app.use(fileUpload({ createParentPath: true, parseNested: true }))

// normalize duplicate slashes in request URLs
app.use((req, res, next) => {
    req.url = req.url.replace(/\/\/+/, '/');
    next();
});

//db connection
connectDB();

// api endpoints
app.use("/api/food", foodRouter)
app.use("/images", express.static('uploads'))
app.use('/api/user', userRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)

app.get("/", (req, res) => {
    res.send("API working")
})

const server = app.listen(port, () => {
    console.log(`Server started on ${port}`)
})

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use. Please stop the running server or set a different PORT.`)
        process.exit(1)
    }
    console.error('Server error:', err)
    process.exit(1)
})

