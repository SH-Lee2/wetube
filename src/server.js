import express from "express";
import morgan from "morgan";
import session from "express-session"  // session = history??
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { localsMiddleware } from "./middlewares";
import MongoStore from "connect-mongo" //mongodb에 session 저장
const app = express();
const logger = morgan("dev");
const PORT = 4000;

app.set("views", process.cwd() + "/src/views");
app.set("view engine", "pug");


app.use(logger);
app.use(express.urlencoded({ extended: true })); // 자바스크립트의 형식으로 바꿔주고 form의 value를 읽을수있게해준다
// body-parser 와 같은 느낌

app.use(session({ //router 위에 무조건 위치
    secret : process.env.COOKIE_SECRET, // 길게 ! , 무작위로 작성되어야함 , 이 String를 가지고 쿠키를 sign하고 우리가 만든 것임을 증명할수있기때문
    //resave,saveUninitialized 를 false 주면 로그인시에만 쿠기를 저장함
    resave : false,  
    saveUninitialized : false,
    store : MongoStore.create({mongoUrl : process.env.DB_URL}) //mongodb에 session을 저장하여 서버가 재시작되도 세션을 가질수있음

}))
app.use(localsMiddleware)
app.use("/", rootRouter);
app.use("/user", userRouter);
app.use("/videos", videoRouter);

export default app