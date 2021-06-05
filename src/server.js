import express from "express";
import morgan from "morgan";
import globalRouter from "../routers/globalRouter";
import userRouter from "../routers/userRouter";
import videoRouter from "../routers/videoRouter";
const app = express();
const logger = morgan("dev");
const PORT = 4000;

app.set("views", process.cwd() + "/src/views");
app.set("view engine", "pug");

const handleListenging = () => {
  console.log(`Server listening on port http://localhost:${PORT}🚀`);
};
app.use(logger);

app.use("/", globalRouter);
app.use("/user", userRouter);
app.use("/videos", videoRouter);
app.listen(PORT, handleListenging);
