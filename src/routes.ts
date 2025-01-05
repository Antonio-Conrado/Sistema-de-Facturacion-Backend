import { Express } from "express"
import auth from './routes/auth'
import user from './routes/user'
import category from './routes/category'
import supplier from './routes/supplier'
import businessData from './routes/businessData'

const routes = (app: Express) =>{
    app.use('/api/v1/auth', auth)
    app.use('/api/v1/user', user )
    app.use('/api/v1/categories', category)
    app.use('/api/v1/suppliers', supplier)
    app.use('/api/v1/businessData', businessData)
}
export default routes