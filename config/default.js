module.exports = {
    port: 3000,
    session: {
        secret: 'myblog',
        key: 'myblog',
        maxAge: 2592000000
    },
    mongodb: process.env.NODE_ENV==='production' ? 'mongodb://172.17.0.3:27017/myblog' : 'mongodb://localhost:27017/myblog'
}