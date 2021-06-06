import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
const app = express();
const logger = morgan("dev");
const PORT = 4000;

app.set("views", process.cwd() + "/src/views");
app.set("view engine", "pug");


app.use(logger);
app.use(express.urlencoded({ extended: true })); // 자바스크립트의 형식으로 바꿔주고 form의 value를 읽을수있게해준다
// body-parser 와 같은 느낌
app.use("/", globalRouter);
app.use("/user", userRouter);
app.use("/videos", videoRouter);

export default app