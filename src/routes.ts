import { Express } from "express"
import auth from './routes/auth'
import user from './routes/user'

const routes = (app: Express) =>{
    app.use('/api/v1/auth', auth)
    app.use('/api/v1/user', user )
}
export default routes