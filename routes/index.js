const express = require("express");
const app = express.Router();
const homeController = require("./../controllers/homeController");
const vacantesController = require("./../controllers/vacantesController");
const usuariosController = require("./../controllers/usuariosController");
const authController = require("./../controllers/authController");

//HOME
app.get("/", homeController.mostrarTrabajos);

//VACANTES
app.get(
  "/vacantes/nueva",
  authController.usuarioAutenticado,
  vacantesController.formNuevaVacante
);
app.post(
  "/vacantes/nueva",
  [authController.usuarioAutenticado, vacantesController.validarVacante],
  vacantesController.agregarVacante
);

//MOSTRAR VACANTE
app.get("/vacantes/:url", vacantesController.mostrarVacante);

//EDITAR VACANTE
app.get(
  "/vacantes/editar/:url",
  authController.usuarioAutenticado,
  vacantesController.editarVacanteForm
);
app.post(
  "/vacantes/editar/:url",
  authController.usuarioAutenticado,
  vacantesController.editarVacante
);

//USUARIOS
app.get("/crear-cuenta", usuariosController.formCrearCuenta);
app.post(
  "/crear-cuenta",
  usuariosController.validarRegistro,
  usuariosController.crearCuenta
);

//AUTENTICAR USUARIOS
app.get("/iniciar-sesion", usuariosController.formIniciarSesion);
app.post("/iniciar-sesion", authController.autenticarUsuario);
app.get(
  "/cerrar-sesion",
  authController.usuarioAutenticado,
  authController.cerrarSesion
);

//PANEL DE ADMINISTRACION
app.get(
  "/administracion",
  authController.usuarioAutenticado,
  authController.mostrarPanel
);

//EDITAR PERFIL
app.get("/editar-perfil", usuariosController.formEditarPerfil);
app.post(
  "/editar-perfil",
  usuariosController.validarPerfil,
  usuariosController.editarPerfil
);

//ELIMINAR VACANTE
app.delete("/vacantes/eliminar/:id", vacantesController.eliminarVacante);

module.exports = app;
