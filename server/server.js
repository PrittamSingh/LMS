import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebHooks, stripeWebHooks } from './controllers/webhooks.js'
import educatorRouter from './routes/educatorRoutes.js'
import { clerkMiddleware } from '@clerk/express'
import connectCloudinary from './configs/cloudinary.js'
import courseRouter from './routes/courseRoutes.js'
import userRouter from './routes/userRoutes.js'

// Initialize Express 
const app = express()

// Connect to database
await connectDB()
await connectCloudinary();

// Middleware
app.use(cors())
app.use(clerkMiddleware())

// Routes
app.get('/', (req,res) => res.send("API is working"))
app.post('/clerk', express.json(), clerkWebHooks)
app.use('/api/educator', express.json(), educatorRouter)
app.use('/api/course',  express.json(),  courseRouter)
app.use('/api/user', express.json(), userRouter)
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebHooks)


// Port
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`)
})