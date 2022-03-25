import pkg from 'pg'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const {Pool} = pkg
// import '../utils/connect.js'
//handles user signup
export const signup = async (req, res, next) => {
    try {
        const user = req.body
        //generate salt for password hashing
        const salt = bcrypt.genSaltSync(10);
        user.user_password = await bcrypt.hash(user.user_password, salt)
        const queryvalues = Object.values(user)
        const valTags = queryvalues.map((val, idx) => `$${idx+1}`)
        const quertext = `INSERT INTO users(${Object.keys(user)}) VALUES(${valTags})`
        const pool = new Pool()
        await pool.query(quertext, queryvalues);
        pool.end();
        //create a bearer token for authorization
        res.status(201).json({
            created: true
        })
    } catch (error) {
        if(error.code === '23505') return next({
            status: 400,
            message: "Username already exists"
        })
        // console.log(error.code)
        next(error)
    }
}

//handles signin authentication
export const signin = async (req, res, next) => {
    try {
        const pool = new Pool()
        const {username, user_password} = req.body
        const text = "SELECT * FROM users WHERE username = $1"
        const user = await pool.query(text, [username]);
        if(user.rowCount === 0) throw {
            status: 400,
            message: "No user with this username was found"
        }
        pool.end()
        const isMatched = bcrypt.compareSync(user_password, user.rows[0].user_password)
        if(isMatched){
            const {id, first_name, last_name, username, email, avatar} = user.rows[0]
            const token = jwt.sign({
                username,
                email,
                avatar
            }, process.env.SECRET_KEY);
            return res.status(200).json({
                id,
                first_name,
                last_name,
                username,
                email,
                avatar,
                token,
            })
        }else{
            throw {
                status: 400,
                message: "Incorrect password"
            }
        }
    } catch (error) {
        next(error)
    }
}

