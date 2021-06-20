import express from "express"
import {logout,see,startGithubLogin,finishGithubLogin ,getEdit,
    postEdit,
    getChangePassword,
    postChangePassword} from "../controllers/userController"
import { publicOnlyMiddleware ,protectorMiddleware,uploadFiles} from "../middlewares"

const userRouter = express.Router()

userRouter.get('/logout',protectorMiddleware,logout)
userRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(uploadFiles.single("avatar"),postEdit); // 한개만 업로드 하겠다 => req.file 하면 업로드 내용을 확인가능 
userRouter.get("/github/start",publicOnlyMiddleware,startGithubLogin)
userRouter.get("/github/finish",publicOnlyMiddleware,finishGithubLogin)
userRouter.route("/change-password").all(protectorMiddleware).get(getChangePassword).post(postChangePassword)


userRouter.get('/:id(\\d+)',see)

export default userRouter