const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema;

const UsuarioSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    nombre:{
        type: String,
        required: 'Agrega tu nombre'
    },
    password:{
        type: String,
        required: 'Agrega tu password',
        trim: true
    },
    token: String,
    expira: Date,
    imagen: String
})

UsuarioSchema.pre('save', async function(next) {
    const hash = await bcrypt.hashSync(this.password, 10)

    this.password = hash; 
    next();
})
UsuarioSchema.post('save', function(error, doc, next){
    if(error.name === 'MongoError' && error.code === 11000){
        next('Ese correo ya esta registrado')
    }else{
        next(error)
    }
})

UsuarioSchema.methods = {
    compararPassword: function(password){
        return bcrypt.compareSync(password, this.password)
    }
}

module.exports = mongoose.model('usuarios', UsuarioSchema)