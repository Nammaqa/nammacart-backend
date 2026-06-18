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
const allowedOrigins = [
  'https://nammacart-admin.vercel.app', 
  'http://localhost:3000', // Keep this if you test locally
  'https://nammacart.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// CRITICAL: Explicitly handle preflight OPTIONS requests for Vercel Serverless
app.options('*', cors()); 
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

