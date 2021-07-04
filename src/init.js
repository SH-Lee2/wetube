// dotenv 는 파일 시작부분 맨위에 선언해줘야함 즉 package.json 의 scrtipt 에 있는 파일 
// dotenv .env 파일을 읽고 process.env 에 추가함 
import "dotenv/config" 
import "./db"  // db file자체를 임포트  : 자동 실행
import "./models/Video"  // db가 video model을 인지함
import "./models/User"
import "./models/Comment"
import app from "./server"
const PORT = 4000;

const handleListenging = () => {
    console.log(`Server listening on port http://localhost:${PORT}🚀`);
  };

  app.listen(PORT, handleListenging);