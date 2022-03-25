import jwt from 'jsonwebtoken'

const authenticate = (req, res, next)=> {
    if(req.method == 'GET') return next()
    else if(Object.keys(req.body).length === 1 
    && Object.keys(req.body)[0] === 'reads') return next()
    try {
        const bearerToken = req.headers.authorization.split(' ')[1]
        //verify bearer token
        jwt.verify(bearerToken, process.env.SECRET_KEY, 
            (err, decoded)=>{
                if(decoded) return next()
                else return next({
                    status: 401,
                    message: 'Please login as the admin'
                })
            })
    } catch (error) {
        return next({
            status: 401,
            message: 'Please login as the admin'
        })
    }
}

export default authenticate