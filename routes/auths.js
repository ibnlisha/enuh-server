import { Router } from "express";
import { signin, signup } from "../handlers/auths.js";
const router = Router();

//route to signup
router.post('/signup', signup)

//routes to singin
router.post('/signin', signin)

export default router;