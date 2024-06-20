var g_id_resultado = "";

//Mostrar alertas
function mostrarCorrecto(){
  document.getElementById('correcto').style.display = 'block';
};

function mostrarError(){
  document.getElementById('error').style.display = 'block';
};

function mostrarSinvalor(){
  document.getElementById('sinValor').style.display = 'block';
};

function ocultarError(){
  document.getElementById('error').style.display = 'none';
};

function ocultarSinvalor(){
  document.getElementById('sinValor').style.display = 'none';
};
//Función para agregar resultado
function agregarResultado(){

// Obtenemos el tipo de gestion que ingresa el usuario
var nombre_resultado = document.getElementById("txt_nombre").value;

if (!nombre_resultado.trim()) {
  ocultarError();
  mostrarSinvalor();
  return; 
}
//Encabezado de la solicitud
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var fechaHoraActual = obtenerFechaHora();

//carga util de datos
const raw = JSON.stringify({
  "nombre_resultado": nombre_resultado,
  "fecha_registro": fechaHoraActual
});

//Opciones de solicitud
const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

//Ejecutamos solicitud
fetch("http://144.126.210.74:8080/api/resultado", requestOptions)
  .then((response) => {
    if (response.status == 200){
      mostrarCorrecto()
      ocultarError()
      ocultarSinvalor()
      setTimeout(() => location.href ="listar.html", 2000);
    }
    if(response.status == 400){
      mostrarError()
      ocultarSinvalor()
    }
  })
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
}

//Listar tipo gestion------------------------------------------------------------------------
function listarResultado(){
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/resultado?_size=200", requestOptions)
    .then((response) => response.json())
    .then((json) => {
      json.forEach(completarFila);
      $('#tbl_resultado').DataTable();
    })
    //Aqui carga los datos de la tabla.
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

function actualizarResultado(){

  // Obtenemos el tipo de gestion que ingresa el usuario
  var nombre_resultado = document.getElementById("txt_nombre").value;
  
  if (!nombre_resultado.trim()) {
    ocultarError();
    mostrarSinvalor();
    return; 
  }

  //Encabezado de la solicitud
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  
  //carga util de datos
  const raw = JSON.stringify({
    "nombre_resultado": nombre_resultado,
  });
  
  //Opciones de solicitud
  const requestOptions = {
    method: "PATCH",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };
  
  //Ejecutamos solicitud
  fetch("http://144.126.210.74:8080/api/resultado/"+g_id_resultado, requestOptions)
    .then((response) => {
      if (response.status == 200){
        mostrarCorrecto()
        ocultarError()
        ocultarSinvalor()
        setTimeout(() => location.href ="listar.html", 2000);
      }
      if(response.status == 400){
        mostrarError()
        ocultarSinvalor()
      }
    })
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
  }
    

//Obtener Id Actualizar --------------------------------------------------------------------------------

function obtenerIdActualizar(){
  //Obtener datos de la solicitud
  const queryString = window.location.search; //Una const (Constante)
  //Obtener todos los parametros
  const parametros = new URLSearchParams(queryString);
  //Nos posicionamos sobre un parametro y obtenemos su valor actual
  const p_id_resultado = parametros.get('id');
  g_id_resultado = p_id_resultado;
  obtenerDatosActualizar(p_id_resultado);
}


//Obtener datos actualizar-----------------------------------------------------------------------------

function obtenerDatosActualizar(p_id_resultado) {
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/resultado/"+p_id_resultado, requestOptions)
    .then((response) => response.json())
    .then((json) => json.forEach(completarFormulario))
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

function completarFila(element, index, arr){

  var fechaHoraForm = formatearFechaHora(element.fecha_registro);

  arr[index] = document.querySelector("#tbl_resultado tbody").innerHTML +=
  `<tr>
  <td>${element.id_resultado}</td>
  <td>${element.nombre_resultado}</td>
  <td>${fechaHoraForm}</td>

  <td> <a href='Actualizar.html?id=${element.id_resultado}' class='btn btn-warning'>Actualizar</a>
  <a href='Eliminar.html?id=${element.id_resultado}' class='btn btn-danger'>Eliminar</a> </td>
  </tr>` //element.id_tipo_gestion en el ennlace
}

//Eliminar
function obtenerIdEliminar(){
  //Obtener datos de la solicitud
  const queryString = window.location.search; //Una const (Constante)
  //Obtener todos los parametros
  const parametros = new URLSearchParams(queryString);
  //Nos posicionamos sobre un parametro y obtenemos su valor actual
  const p_id_resultado = parametros.get('id');
  g_id_resultado = p_id_resultado;
  obtenerDatosEliminar(p_id_resultado);
}

function obtenerDatosEliminar(p_id_resultado) {
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/resultado/"+p_id_resultado, requestOptions)
    .then((response) => response.json())
    .then((json) => json.forEach(completarEtiqueta))
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

function EliminarResultado(){
  //Encabezado de la solicitud
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  
  //Opciones de solicitud
  const requestOptions = {
    method: "DELETE",
    headers: myHeaders,
    redirect: "follow"
  };
  
  //Ejecutamos solicitud
  fetch("http://144.126.210.74:8080/api/resultado/"+g_id_resultado, requestOptions)
    .then((response) => {
      if (response.status == 200){
        mostrarCorrecto()
        ocultarError()
        setTimeout(() => location.href ="listar.html", 2000);
      }
      if(response.status == 400){
        mostrarError()
      }
    })
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
  }

//Completar formulario ------------------------------------------------------------------------------------

function completarFormulario(element,index,arr){
  var nombreResultado = element.nombre_resultado;
  document.getElementById("txt_nombre").value = nombreResultado;

}

function completarEtiqueta(element,index,arr){
  var nombreResultado = element.nombre_resultado;
  document.getElementById("lbl_eliminar").innerHTML = "¿Estas seguro de que deseas eliminar este Resultado? <b>"+nombreResultado+"</b>";

}

//Muestra la fecha actual que esta en el sistema
function obtenerFechaHora(){
  var fechaHoraActual = new Date(); //new date esta obteniendo la fecha y hora actual de el sistema
  var fechaHoraFormateada = fechaHoraActual.toLocaleString('es-ES', {
    hour12: false,
    year :'numeric',
    month :'2-digit',
    day :'2-digit',
    hour :'2-digit',
    minute :'2-digit',
    second :'2-digit'
  }).replace(/(\d+)\/(\d+)\/(\d+)\,\s*(\d+):(\d+):(\d+)/,'$3-$2-$1 $4:$5:$6');
  return fechaHoraFormateada;
}

//Combierte fechas registradas en una fecha legible
function formatearFechaHora(fecha_registro){
  var fechaHoraActual = new Date(fecha_registro);//Pero si le damos una variable no te genera la fecha y hora actual de el sistema sino que le da un formato a la de la variable
  var fechaHoraFormateada = fechaHoraActual.toLocaleString('es-ES', {
    hour12 :false,
    year :'numeric',
    month :'2-digit',
    day :'2-digit',
    hour :'2-digit',
    minute :'2-digit',
    second :'2-digit',
    timeZone:'UTC'
  }).replace(/(\d+)\/(\d+)\/(\d+)\,\s*(\d+):(\d+):(\d+)/,'$3-$2-$1 $4:$5:$6');
  return fechaHoraFormateada;
}