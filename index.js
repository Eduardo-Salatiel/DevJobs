const mongoose = require("mongoose");
require("./config/db");
const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const bodyParser = require("body-parser");
const flash = require('connect-flash')
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const handlebars = require("handlebars");
const passport = require('./config/passport')
require("dotenv").config({ path: "variables.env" });
const fileUpload = require('express-fileupload')

const app = express();
//HABILITA BODY-PARSER
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//SUBIDA DE ARCHIVOS
app.use(fileUpload())

//TEMPLATE ENGINE
app.engine(
  "handlebars",
  exphbs({
    handlebars: allowInsecurePrototypeAccess(handlebars),
    defaultLayout: "layout",
    helpers: require("./helpers/handlebars"),
  })
);
app.set("view engine", "handlebars");

//CARPETA PUBLICA
app.use(express.static(path.join(__dirname, "public")));

//SESIONES
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SECRET,
    saveUninitialized: false,
    resave: false,
    key: process.env.KEY,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

app.use(passport.initialize())
app.use(passport.session())

//MENSAJES DE ALERTA
app.use(flash())

app.use((req, res, next) => {
  res.locals.mensajes = req.flash()

  next()
})

//SE HACE USO DE LAS RUTAS
app.use("/", require("./routes/index"));

//PUERTO
app.listen(process.env.PUERTO, () => {
  console.log("Escuchando puerto 3000");
});
