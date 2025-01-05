import { Express } from "express"
import auth from './routes/auth'

const routes = (app: Express) =>{
    app.use('/api/v1/auth', auth)
}
export default routes