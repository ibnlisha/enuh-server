import { Router } from "express";
import handler from '../handlers/generalHandler.js'
const {getAll, getOne, updateOne, deleteOne, 
    createOne} = handler('blog')
const router = Router()

//get all blogs
router.get('/', getAll)

//get blog given an id
router.get('/:id',  getOne)

//create new blog
router.post('/new', createOne)
//edit blog with given id
router.put('/:id/edit',  updateOne)
//delete blog with said id
router.delete('/:id/delete',  deleteOne)


export default router;