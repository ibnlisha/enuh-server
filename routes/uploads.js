import { Router } from "express";
import handler from '../handlers/generalHandler.js'
const {uploads} = handler('upload')
const router = Router()

router.post('/new', uploads)

export default router