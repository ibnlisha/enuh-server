import {Router} from 'express'
import { getAll, subscribe, unsubscribe } from '../handlers/subscription.js'
const router = Router()

router.post('/new', subscribe)

router.delete('/unsubscribe', unsubscribe)

router.get('/', getAll)

export default router