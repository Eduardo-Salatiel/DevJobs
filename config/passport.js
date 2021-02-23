const passport = require("passport");
const local = require("passport-local").Strategy;
const Usuarios = require("./../models/Usuarios");

passport.use(
  new local(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      const usuario = await Usuarios.findOne({ email });
      if (!usuario) {
        return done(null, false, { message: "Usuario no Existente" });
      }

      if (!usuario.compararPassword(password)) {
        return done(null, false, { message: "Contraseña Incorrecta" });
      }
      return done(null, usuario);
    }
  )
);

passport.serializeUser((usuario, done) => {
  return done(null,usuario._id)
})
passport.deserializeUser(async(id, done) => {
    const usuario = await Usuarios.findById(id)
    return done(null, usuario)
})

module.exports = passport;
