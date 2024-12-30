import server from "./server";

const port = process.env.PORT || 4000
server.listen(port, ()=>{
    console.log('Servidor en el puerto:', port)
})