import * as jwt from 'jsonwebtoken'

interface ResponseError extends Error {
    statusCode?: number;
}

function authJwt (req, res, next) {
    const authHeader = req.get('Authorization')

    try {
        if (!authHeader) {
            throw new Error()
        }
    
        const token = authHeader.split(' ')[1]
        if (!token) {
            throw new Error()
        }
    
        let decodedToken
        try {
            decodedToken = jwt.verify(token, process.env.SECRET_KEY)
        } catch (error) {
            throw new Error()
        }
    
        if (!decodedToken) {
            throw new Error()
        }
    
        req.user = decodedToken
        next()

    } catch(err) {
        res.status(401).send({
            status: false,
            message: 'User not authenticated'
        })
    }
}

export {authJwt}