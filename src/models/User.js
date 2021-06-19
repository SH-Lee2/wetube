import mongoose from "mongoose"
import bcrypt from "bcrypt"  // 패스워드 암호화 해쉬로 (rainbow table 이슈를 해결 )
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    location: String,
})

//미들웨어 
//미들웨어는 항상 모델 이전에 선언 해줘야함 
// 입력된 패스워드가 db에 저장되기전에 bcrypt를 이용해 암호화 한다
userSchema.pre("save", async function(){
    this.password = await bcrypt.hash(this.password,5)
})

const User = mongoose.model("User",userSchema)
export default User