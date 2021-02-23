const Vacante = require('./../models/Vacantes')
const {body, validationResult} = require('express-validator');
const { validate } = require('./../models/Vacantes');

exports.formNuevaVacante = (req,res) => {
    res.render('nuevaVacante',{
        nombrePagina: 'Nueva Vacante',
        tagline: 'Llena el formulario y publica tu vacante',
        cerrarSesion: true,
        nombre: req.user.nombre
    })
}

exports.agregarVacante = async (req, res) =>{
    const vacante = new Vacante(req.body)
    vacante.autor = req.user._id;

    vacante.skills = req.body.skills.split(',');

    const nuevaVacante = await vacante.save();

    res.redirect(`/vacantes/${nuevaVacante.url}`)
}

exports.mostrarVacante = async (req,res,next) => {
    const url = req.params.url;
    const vacante = await Vacante.findOne({url})

    if(!vacante) return next();

    res.render('vacante',{
        vacante,
        nombrePagina: vacante.titulo,
        barra: true
    })
}

exports.editarVacanteForm = async (req,res,next) => {
    const url = req.params.url
    const vacante = await Vacante.findOne({url})

    if(!vacante) return next();

    res.render('editarVacante',{
        nombrePagina: `Editar - ${vacante.titulo}`,
        vacante,
        cerrarSesion: true,
        nombre: req.user.nombre
    })
}

exports.editarVacante = async (req,res) => {
    const url = req.params.url
    const vacanteActualizada = req.body;
    vacanteActualizada.skills = req.body.skills.split(',')
    const vacante = await Vacante.findOneAndUpdate({url}, vacanteActualizada, {new: true, runValidators: true})

    res.redirect(`/vacantes/${vacante.url}`)
}

exports.validarVacante = async (req,res, next) => {
    const rules = [
        body('titulo').escape().notEmpty().withMessage('Agrega un titulo a la vacante'),
        body('empresa').escape().notEmpty().withMessage('Agrega una empresa'),
        body('ubicacion').escape().notEmpty().withMessage('Agrega una ubicacion'),
        body('salario').escape(),
        body('contrato').escape().notEmpty().withMessage('Selecciona el tipo de contrato'),
        body('skills').escape().notEmpty().withMessage('Agrega al menos una habilidad')
    ]
    await Promise.all(rules.map(validation => validation.run(req)));
    const errores = validationResult(req)

    if(!errores.isEmpty()){
        req.flash('error', errores.array().map(error => error.msg))
        res.render('nuevaVacante',{
            nombrePagina: 'Nueva Vacante',
            tagline: 'Llena el formulario y publica tu vacante',
            cerrarSesion: true,
            nombre: req.user.nombre,
            mensajes: req.flash()
        })
    }
    next()
}

exports.eliminarVacante = async (req,res) => {
    const {id} = req.params
    const vacante = await Vacante.findById(id)

    const verificarAutor = (vacante= {}, usuario = {}) => {
        if(!vacante.autor.equals(usuario._id)){
            return false
        }
        return true
    }
    
    if(verificarAutor(vacante, req.user)){
        vacante.remove()
        res.status(200).send('ok')
    } else{
        res.status(403).send('error')
    }
    
}