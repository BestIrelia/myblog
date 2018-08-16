module.exports = {
    port: 80,
    session: {
        secret: 'myblog',
        key: 'myblog',
        maxAge: 2592000000
    },
    mongodb: 'mongodb://172.17.0.3:27017/myblog'
}