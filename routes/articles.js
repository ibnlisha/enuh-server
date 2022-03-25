import { Router } from "express";
import handler from '../handlers/generalHandler.js'
const {getAll, getOne, updateOne, deleteOne, 
    createOne} = handler('article')
const router = Router()

//get all articles
router.get('/', getAll)

//get article given an id
router.get('/:id',  getOne)

//create new article
router.post('/new', createOne)
//edit article with given id
router.put('/:id/edit',  updateOne)
//delete article with said id
router.delete('/:id/delete',  deleteOne)


export default router;