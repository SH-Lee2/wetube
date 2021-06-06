import "./db"  // db file자체를 임포트  : 자동 실행
import "./models/video"  // db가 video model을 인지함
import app from "./server"
const PORT = 4000;

const handleListenging = () => {
    console.log(`Server listening on port http://localhost:${PORT}🚀`);
  };

  app.listen(PORT, handleListenging);