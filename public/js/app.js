import axios from "axios";
import Swal from "sweetalert2";

document.addEventListener("DOMContentLoaded", () => {
  const skills = document.querySelector(".lista-conocimientos");

  //LIMPIAR ALERTAS
  let alertas = document.querySelector(".alertas");

  if (alertas) {
    limpiarAlertas();
  }

  if (skills) {
    skills.addEventListener("click", agregarSkills);

    skillsSeleccionados();
  }

  const vacantesListado = document.querySelector(".panel-administracion");
  if (vacantesListado) {
    vacantesListado.addEventListener("click", accionesListado);
  }
});

const SKILLS = new Set();
const agregarSkills = (e) => {
  if (e.target.tagName === "LI") {
    if (e.target.classList.contains("activo")) {
      SKILLS.delete(e.target.textContent);
      e.target.classList.remove("activo");
    } else {
      SKILLS.add(e.target.textContent);
      e.target.classList.add("activo");
    }
  }
  const skillsArray = [...SKILLS];
  document.querySelector("#skills").value = skillsArray;
};

const skillsSeleccionados = () => {
  const seleccionadas = Array.from(
    document.querySelectorAll(".lista-conocimientos .activo")
  );

  seleccionadas.forEach((seleccionada) => {
    SKILLS.add(seleccionada.textContent);
  });

  const skillsArray = [...SKILLS];
  document.querySelector("#skills").value = skillsArray;
};

const limpiarAlertas = () => {
  let alertas = document.querySelector(".alertas");

  const interval = setInterval(() => {
    if (alertas.children.length > 0) {
      alertas.removeChild(alertas.children[0]);
    } else if (alertas.children.length === 0) {
      alertas.parentElement.removeChild(alertas);
      clearInterval(interval);
    }
  }, 3000);
};

//ELIMINAT VACANTES
const accionesListado = (e) => {
  e.preventDefault();

  if (e.target.dataset.eliminar) {
    Swal.fire({
      title: "¿Confirmar eliminacion?",
      text: "Una vez eliminada no se puede recuperar",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "No, cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const url = `${location.origin}/vacantes/eliminar/${e.target.dataset.eliminar}`;
        axios.delete(url, { params: { url } }).then(function (respuesta) {
          if (respuesta.status === 200) {
            Swal.fire("Eliminado!", "Vacante Eliminada", "success");
            e.target.parentElement.parentElement.parentElement.removeChild(
              e.target.parentElement.parentElement
            );
          }
        });
      }
    }).catch(() => {
        Swal.fire({
            type: 'error',
            title: 'Hubo un error',
            text: 'No se pudo eliminar'
        })
    })
  } else if(e.target.tagName === 'A'){
    window.location.href = e.target.href;
  }
};
