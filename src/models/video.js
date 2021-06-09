import mongoose, { mongo } from "mongoose"
// 모델 생성 전에 모델의 형태를 정의 해줘야함 ( 스키마 )
// 스키마를 구체적으로 정의 하는게 정말 중요하다!! => 우리가 편함
const videoSchema = new mongoose.Schema({
    title : {type : String , required : true, trim : true , maxLength : 80},
    description : {type : String , required : true, trim : true , minLength : 20},
    // default : Date.now() 하면 바로실행되서 이 파일을 저장한 시점이 저장된다 
    // 그래서 Date.now 로 하면 파일 업로드 시점으로 저장됨
    createdAt : {type :Date, required :true , default : Date.now}, 
    hashtags : [{type : String , trim : true}],
    meta : {
        views : {type :Number, required :true , default : 0},
        rating : {type :Number, required :true , default : 0}
    }
})

//static
//model.find 처럼 우리가 직접 만들어서 사용하는것! 
//static 이름 , 인자
videoSchema.static('formatHashTag',(hashTag)=>{
    return hashTag
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`)) // word앞에 #이면 그냥 word 아니면 #word  ::: startsWith() 앞에 확인 
})

// 모델 생성
const video = mongoose.model('video',videoSchema) // 모델 이름 , 스키마 이름
export default video