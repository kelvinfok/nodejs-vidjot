if(process.env.NODE_ENV === 'production') {
    module.exports = {mongoURI: process.env.DB_HOST}
} else {
    module.exports = {mongoURI: process.env.DB_LOCAL_HOST}
}