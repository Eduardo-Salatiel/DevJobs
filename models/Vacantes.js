const mongoose = require("mongoose");
const slug = require("slug");
const shortId = require("shortid");

const Schema = mongoose.Schema;

const VacantesSchema = new Schema({
  titulo: {
    type: String,
    required: "El nombre de la vacante es obligatorio",
    trim: true,
  },
  empresa: {
    type: String,
    trim: true,
  },
  ubicacion: {
    type: String,
    required: "La ubicacion es requerida",
    trim: true,
  },
  salario: {
    type: String,
    default: 0,
    trim: true,
  },
  contrato: {
    type: String,
    trim: true,
  },
  descripcion: {
    type: String,
    trim: true,
  },
  url: {
    type: String,
    lowercase: true,
  },
  skills: [String],
  candidatos: [
    {
      nombre: String,
      email: String,
      cv: String,
    },
  ],
  autor:{
    type: Schema.ObjectId,
    ref: 'Usuarios',
    required: 'El autor es obligatorio'
  }
});

VacantesSchema.pre("save", function (next) {
  const url = slug(this.titulo);
  this.url = `${url}-${shortId.generate()}`;

  next();
});

module.exports = mongoose.model("Vacantes", VacantesSchema);
