import express from "express"
import {deleteVideo,  getEdit, getUpload, postEdit, postUpload, watch} from "../controllers/videoController"
import { protectorMiddleware } from "../middlewares"
const videoRouter = express.Router()
// mongo 의 id 는 24자리 0-9, a-f로 이루어 져있음
videoRouter.get('/:id([0-9a-f]{24})',watch)
videoRouter.route('/:id([0-9a-f]{24})/edit').all(protectorMiddleware).get(getEdit).post(postEdit)
videoRouter.get('/:id([0-9a-f]{24})/delete',protectorMiddleware,deleteVideo)
videoRouter.route('/upload').all(protectorMiddleware).get(getUpload).post(postUpload)


export default videoRouter
