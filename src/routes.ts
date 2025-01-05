import { Express } from "express"
import auth from './routes/auth'
import user from './routes/user'
import category from './routes/category'

const routes = (app: Express) =>{
    app.use('/api/v1/auth', auth)
    app.use('/api/v1/user', user )
    app.use('/api/v1/categories', category)
}
export default routes