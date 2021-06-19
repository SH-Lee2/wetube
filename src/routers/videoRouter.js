import express from "express"
import {deleteVideo,  getEdit, getUpload, postEdit, postUpload, watch} from "../controllers/videoController"
const videoRouter = express.Router()
// mongo 의 id 는 24자리 0-9, a-f로 이루어 져있음
videoRouter.get('/:id([0-9a-f]{24})',watch)
videoRouter.route('/:id([0-9a-f]{24})/edit').get(getEdit).post(postEdit)
videoRouter.get('/:id([0-9a-f]{24})/delete',deleteVideo)
videoRouter.route('/upload').get(getUpload).post(postUpload)


export default videoRouter
