import pgk from 'pg'
const {Pool} = pgk
import multer from 'multer'
import cd from '../cloudinary/index.js'
import sgMail from '@sendgrid/mail'
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const {storage, cloudinary } = cd
const upload = multer({storage}).single('image_file')
const generalHandler = (database) => ({
    //get all scientific drawings 
    getAll: async (req, res, next) => {
        try {
            const pool = new Pool()
             let queryText = database === 'blog'? `SELECT blog.*, users.first_name, users.last_name FROM ${database} JOIN users ON blog.author = author`: 
             `SELECT * FROM ${database}`
            const results =  await pool.query(queryText)
            pool.end()
            res.status(200).json(results.rows);
        } catch (error) {
            next(error)
        }
    },
    //get drawing given an id

    getOne: async (req, res, next) => {
        try {
            const pool = new Pool()
            const text = `SELECT * FROM ${database} WHERE id = $1`
            const results =  await pool.query(text, [req.params.id]) //SORT BY DATE
            pool.end()
            res.status(200).json(results.rows[0]);
        } catch (error) {
            if(error.code === '22P02') return next({
                message: 'No item with this id was found'
            })
            next(error)
        }
    },

    //create new drawing
    createOne: async  (req, res, next) => {
        upload(req,res, async error => {
            if (error instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                console.log(error)
                throw error
              } else if (error) {
                // An unknown error occurred when uploading.
                console.log('something went wrong ', error)
                throw error
              }
            try {
                const data = req.body
                if(data.authors) data.authors = data.authors.split(',')
                const file =  req.file
                data.file_path = file.path
                const pool = new Pool()
                const queryvalues = Object.values(data)
                const valTags = queryvalues.map((val, idx) => `$${idx+1}`)
                const quertext = `INSERT INTO ${database}(${Object.keys(data)}) VALUES(${valTags}) RETURNING *`
                const results =  await pool.query(quertext,queryvalues)
                const notification = results.rows[0]
                //check if we are creating a blogs
                if(database === 'blog'){//send email to the subscribers
                    const subs = await pool.query('SELECT * FROM subscriber')
                    const emails = subs.rows.map(({email})=>email)
                    //create a notification message
                    const notifn = {
                        to: emails,
                        from: 'kinamc12@gmail.com',
                        subject: notification.blog_title,
                        text: `${notification.teaser}...`,
                        html: `<div style = "
                        width: 80%;
                        margin: 10px auto;
                        ">
                        <img src = ${notification.file_path} 
                        style = "width: 80%;"/>
                        <p>${notification.teaser}</p>
                        <a href = 'http://localhost:3000/blogs/${notification.id}'>Read more</a>
                        <footer style ="background-color: lightgrey; padding: 12px">
                        <p>This message was sent to you as a subscriber to our blog</p>
                        <p>If you do not wish to receive further notification, feel free to 
                        <a href='http://localhost:3000/unsuscribe'> unsubscribe here</a>
                        </p>
                        </footer>
                        </div>
                        `
                    }
                    await sgMail.sendMultiple(notifn)
                }
                pool.end()
                res.status(200).json(notification);
            } catch (error) {
                if(error.code === '23505') return next({
                    status: 400,
                    message: "Item already exists"
                })
                next(error)
            }
        })
        
        // console.log('body =', req.body)
    },
    //edit drawing with given id
    uploads: async (req, res, next) => {
        upload(req,res, async error => {
            if (error instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                console.log(error)
                throw error
              } else if (error) {
                // An unknown error occurred when uploading.
                console.log('something went wrong ', error)
                throw error
              }
            try {
                const file =  req.file
                const data = {
                    file_name: file.filename,
                    file_path: file.path
                }
                // console.log(file)
                const pool = new Pool()
                const queryvalues = Object.values(data)
                const valTags = queryvalues.map((val, idx) => `$${idx+1}`)
                const quertext = `INSERT INTO ${database}(${Object.keys(data)}) VALUES(${valTags}) RETURNING *`
                const results =  await pool.query(quertext,queryvalues)
                pool.end()
                res.status(200).json(results.rows[0]);
            }catch(error){
                next(error)
            }
        })
    },
    updateOne: async (req, res, next) => {
        upload(req,res, async error => {
            if (error instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                console.log(error)
                throw error
              } else if (error) {
                // An unknown error occurred when uploading.
                console.log('something went wrong ', error)
                throw error
              }
        try {
            const pool = new Pool()
            //get new data 
            const data = req.body
            if(data.authors) data.authors = data.authors.split(',')
            const file =  req.file
            //check if the image file was updated and delete old one from cloudinary
            if(file){
                const resp = await pool.query(`SELECT file_path FROM 
                ${database} WHERE id = $1`, [req.params.id])
                const filename = resp.rows[0].file_path.split('/').pop()
                await cloudinary.uploader.destroy(filename)
                data.file_path = file.path
            }
            
            let queryvalues = Object.values(data)
            const valTags = Object.keys(data).map((val, idx) => `${val} = $${idx+1}`)
            const last_index = queryvalues.length +1;
            queryvalues.push(req.params.id)
            const text = `UPDATE ${database} SET ${valTags} WHERE id = $${last_index}`
            const results =  await pool.query(text, queryvalues)
            pool.end()
            res.status(200).json(results.rows);
        } catch (error) {
            if(error.code === '22P02') return next({
                message: 'No item with this id was found'
            })
            next(error)
        }           
        })
    },
    //delete drawing with said id
    deleteOne: async (req, res, next) => {
        try {
            const pool = new Pool()
            const file = await pool.query(`SELECT file_path FROM ${database} WHERE id = $1`, [req.params.id])
            const results =  await pool.query(`DELETE FROM ${database} WHERE id = $1`, [req.params.id])
            pool.end()
            const filename = file.rows[0].file_path.split('/').pop()
            const filenameOnly = filename.split('.')[0]
            const result = await cloudinary.uploader.destroy(filenameOnly)
            res.status(200).json(result);
        } catch (error) {
            if(error.code === '22P02') return next({
                message: 'No item with this id was found'
            })
            next(error)
        }
    }

})

export default generalHandler;