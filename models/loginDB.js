const {Schema, model} = require('mongoose')

const loginSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
})

module.exports = model('loginSchema', loginSchema , 'todos')



// const collection = new mongoose.model('login', loginSchema)