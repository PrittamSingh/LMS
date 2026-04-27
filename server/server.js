import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebHooks } from './controllers/webhooks.js'

// Initialize Express 
const app = express()

// Connect to database
await connectDB()

// Middleware
app.use(cors())

// Routes
app.get('/', (req,res) => res.send("API is working"))
app.post('/clerk', express.json(), clerkWebHooks)

// Port
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`)
})