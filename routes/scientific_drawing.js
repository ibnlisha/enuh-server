import { Router } from "express";
import handler from '../handlers/generalHandler.js'
const {getAll, getOne, updateOne, deleteOne, 
    createOne} = handler('scientific_drawing')
const router = Router()
//get all scientific drawings
router.get('/', getAll)

//get scientific drawing given an id
router.get('/:id',  getOne)

//create new scientific drawing
router.post('/new', createOne)
//edit scientific drawing with given id
router.put('/:id/edit',  updateOne)
//delete scientific drawing with said id
router.delete('/:id/delete',  deleteOne)


export default router;
