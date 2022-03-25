import { Router } from "express";
import handler from '../handlers/generalHandler.js'
const {getAll, getOne, updateOne, deleteOne, 
    createOne} = handler('art_piece')
const router = Router()

//get all art items
router.get('/', getAll)

//get art item given an id
router.get('/:id',  getOne)

//create new art item
router.post('/new', createOne)
//edit art item with given id
router.put('/:id/edit',  updateOne)
//delete art item with said id
router.delete('/:id/delete',  deleteOne)


export default router;