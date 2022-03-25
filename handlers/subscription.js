import pgk from 'pg'
const {Pool} = pgk
export const subscribe = async (req, res, next)=>{
    try {
        const {name_of_subscriber, email} = req.body
        const pool = new Pool()
        await pool.query('INSERT INTO subscriber(name_of_subcriber, email) VALUES($1, $2)',
        [name_of_subscriber, email])
        pool.end()
        res.status(201).json({success: true})
    } catch (error) {
        next(error)
    }
}

export const unsubscribe = async (req, res, next) => {
    try {
        const pool = new Pool()
        await pool.query('DELETE * FROM subscriber WHERE email = $1)',
        [req.body.email])
        pool.end()
        res.status(201).json({success: true})
    } catch (error) {
        next(error)
    }
}

export const getAll = async (req, res, next) =>{
    try {
        const pool = new Pool()
        const results = await pool.query("SELECT * FROM subscriber")
        pool.end()
        res.status(201).json(results.rows)
    } catch (error) {
        next(error)
    }
}