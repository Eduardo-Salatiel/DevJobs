const passport = require('passport')
const Usuarios = require('../models/Usuarios')
const Vacantes = require('../models/Vacantes')

exports.autenticarUsuario = passport.authenticate('local',{
    successRedirect: '/administracion',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
})

exports.mostrarPanel = async (req,res) => {
    const vacantes = await Vacantes.find({autor: req.user._id})
    res.render('administracion',{
        nombrePagina: 'Panel de Administracion',
        tagline: 'Crea y Administra tus vacantes desde aqui',
        vacantes,
        cerrarSesion: true,
        nombre: req.user.nombre
    })
}

exports.usuarioAutenticado = (req,res,next) => {
    if(req.isAuthenticated()){
       return next()
    }

    res.redirect('/iniciar-sesion')
}

exports.cerrarSesion = (req,res) => {
    req.logout()

    return res.redirect('/iniciar-sesion')
}