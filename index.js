import 'dotenv/config'
import express from 'express'
import ErrorHandler from 'handlers/errorHandler.js';
import router from 'routes/auths.js'
import scRouter from 'routes/scientific_drawing.js'
import articleRoutes from 'routes/articles.js'
import blogRoutes from 'routes/blogs.js'
import drawingRoutes from 'routes/arts.js'
import uploads from 'routes/uploads.js'
import cors from 'cors'
import authorizeUser from 'middlewares/auth.js'
import subcribeRouter from 'routes/subscription.js'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
const PORT = process.env.PORT || 3001;

// app.post('/', (req, res)=>{
//     console.log(req.body);
//     res.send('Success')
// })
app.use('/api/authentication', router);
app.use('/api/scientific-drawings', authorizeUser, scRouter) //will add authorization middleware
app.use('/api/articles', authorizeUser, articleRoutes) //will add authorization middleware
app.use('/api/blogs', authorizeUser, blogRoutes) //will add authorization middleware
app.use('/api/pencil-arts', authorizeUser, drawingRoutes) //will add authorization middleware
//handle picture uploads
app.use('/api/uploads', authorizeUser, uploads)
app.use('/api/subscription', subcribeRouter)
app.use((req, res, next) => {
    const error = {
        status: 404,
        message: 'Page not found'
    }
    return next(error)
});

// //Generic error handler
app.use(ErrorHandler);
app.listen(PORT, ()=> console.log('Listening on port ', PORT));
