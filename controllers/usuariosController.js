const Usuarios = require("./../models/Usuarios");
const { body, validationResult } = require("express-validator");
const multer = require("multer");
const shortid = require('shortid')

exports.formCrearCuenta = (req, res) => {
  res.render("crearCuenta", {
    nombrePagina: "Crea tu cuenta en DevJobs",
    tagline:
      "Comienza a crear tus vacantes gratis, solo debes de crear una cuenta",
  });
};

exports.validarRegistro = async (req, res, next) => {
  const rules = [
    body("nombre")
      .not()
      .notEmpty()
      .withMessage("El nombre es obligatorio")
      .escape(),
    body("email")
      .isEmail()
      .withMessage("El email es obligatorio")
      .normalizeEmail(),
    body("password")
      .not()
      .isEmpty()
      .withMessage("El password es obligatorio")
      .escape(),
    body("confirmar")
      .not()
      .isEmpty()
      .withMessage("Confirmar password es obligatorio")
      .escape(),
    body("confirmar")
      .equals(req.body.password)
      .withMessage("Los passwords no son iguales"),
  ];
  await Promise.all(rules.map((validation) => validation.run(req)));
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    req.flash(
      "error",
      errores.array().map((error) => error.msg)
    );
    res.render("crearCuenta", {
      nombrePagina: "Crea una cuenta en Devjobs",
      tagline:
        "Comienza a publicar tus vacantes gratis, solo debes crear una cuenta",
      mensajes: req.flash(),
    });
    return;
  }

  //si toda la validacion es correcta
  next();
};

exports.crearCuenta = async (req, res, next) => {
  const usuario = new Usuarios(req.body);

  try {
    await usuario.save();
    res.redirect("/iniciar-sesion");
  } catch (error) {
    req.flash("error", error);
    res.redirect("/crear-cuenta");
  }
};

//------- Formumario para inicar sesion ------
exports.formIniciarSesion = (req, res) => {
  res.render("iniciar-sesion", {
    nombrePagina: "Iniciar Sesion devJobs",
  });
};

exports.formEditarPerfil = (req, res) => {
  res.render("editar-perfil", {
    nombrePagina: "Edita tu perfil en devJobs",
    usuario: req.user,
    cerrarSesion: true,
    nombre: req.user.nombre,
  });
};

exports.editarPerfil = async (req, res) => {
  const usuario = await Usuarios.findById(req.user._id);
  usuario.nombre = req.body.nombre;
  usuario.email = req.body.email;

  //SUBIDA DE ARCHIVOS
  if (req.files) {
    let archivo = req.files.imagen;
    const extension = archivo.mimetype.split('/')[1];
    let name = `${shortid.generate()}.${extension}`;
    if(archivo.mimetype === 'image/jpeg' || archivo.mimetype === 'image/png' ){
    archivo.mv(`${__dirname}/../public/uploads/perfiles/${name}`,function(err){
      if(err){
        //MENSAJE DE ERROR
      }
    });
    
    usuario.imagen = name;
    }
  }
  
  if (req.body.password) {
    usuario.password = req.body.password;
  }

  await usuario.save();
  req.flash("correcto", "Cambios Guardados Correctamente");
  res.redirect("/administracion");
};

exports.validarPerfil = async (req, res, next) => {
  const rules = [
    body("nombre")
      .escape()
      .notEmpty()
      .withMessage("El nombre no puede ir vacio"),
    body("email")
      .escape()
      .notEmpty()
      .withMessage("El correo no puede ir vacio"),
  ];

  await Promise.all(rules.map((validation) => validation.run(req)));
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    req.flash(
      "error",
      errores.array().map((error) => error.msg)
    );
    res.render("editar-perfil", {
      nombrePagina: "Edita tu perfil en devJobs",
      usuario: req.user,
      cerrarSesion: true,
      nombre: req.user.nombre,
      mensajes: req.flash(),
    });
  }
  next();
};

