const jwt = require('jsonwebtoken')

function getToken(headers) {
    const authHeaders = headers['authorization']
    if (!authHeaders) return null;
    const parts = authHeaders.split(" ")
    const [type, token] = parts;
    return type.toLowerCase() === 'bearer' ? token : null;
}

async function isAuth(req, res, next) {
    const token = getToken(req.headers)
    if(!token) return res.status(401).json({ message: 'permission denied'})

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = payload.userId;
        next()
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token', data: null });
    }
}

module.exports = isAuth