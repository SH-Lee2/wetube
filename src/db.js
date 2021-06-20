import  mongoose from "mongoose"

// wetube 는 db이름
mongoose.connect(process.env.DB_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify : false
}) 

const db = mongoose.connection

const handleOpen = () => console.log("✅ Connected to DB")
const handleError = (error) => console.log("❌ DB Error", error)

db.on("error" , handleError) // 계속 
db.once("open", handleOpen)  // 실행될때 한번만