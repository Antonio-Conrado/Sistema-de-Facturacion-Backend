import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import routes from './routes'
import testConnectionDB from './config/db'
import { corsConfig } from './config/cors'

const app = express()
dotenv.config()
app.use(morgan('dev'))
app.use(cors(corsConfig))

testConnectionDB();

app.use(express.json())

//routes of endpoints
routes(app)

export default app