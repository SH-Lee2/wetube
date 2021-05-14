import express from "express"
import morgan from "morgan"
const app = express()
const logger = morgan('dev')
const PORT = 4000

const home = (req,res)=>{
    return res.send("hello")
}

const handleListenging=()=>{
    console.log(`Server listening on port http://localhost:${PORT}🚀`)
}
app.use(logger)
app.get('/',home)
app.listen(PORT,handleListenging)