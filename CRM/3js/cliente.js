var g_id_cliente = "";

//Mostar alertas----------------------------------------------------
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

//Función para agregar tipo de gestión
function agregarCliente(){

// Obtenemos el tipo de gestion que ingresa el usuario

var rutCliente = document.getElementById("txt_Rut").value;
var clienteDV = document.getElementById("txt_dv").value;
var clienteNom = document.getElementById("txt_nombre").value;
var clienteApe = document.getElementById("txt_apellido").value;
var clienteEmail = document.getElementById("txt_email").value;
var clienteCel = document.getElementById("txt_celular").value;

if (!rutCliente.trim() || !clienteDV.trim() || !clienteNom.trim() || !clienteApe.trim() || !clienteEmail.trim() || !clienteCel.trim()) {
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
  "id_cliente": rutCliente,
  "dv": clienteDV,
  "nombres": clienteNom,
  "apellidos": clienteApe, 
  "email": clienteEmail,
  "celular": parseInt(clienteCel),
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
fetch("http://144.126.210.74:8080/api/cliente", requestOptions)
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



function listarCliente(){
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/cliente?_size=200", requestOptions)
    .then((response) => response.json())
    .then((json) => {
      json.forEach(completarFila);
      $('#tbl_cliente').DataTable();
    } )//Aqui carga los datos de la tabla.
    .then((result) => console.log(result))
    .catch((error) => console.error(error))
}

function actualizarCliente(){

  // Obtenemos el cliente que ingresa el usuario
  var clienteDV = document.getElementById("txt_dv").value;
  var clienteNom = document.getElementById("txt_nombre").value;
  var clienteApe = document.getElementById("txt_apellido").value;
  var clienteEmail = document.getElementById("txt_email").value;
  var clienteCel = document.getElementById("txt_celular").value;
  
  if (!clienteDV.trim() || !clienteNom.trim() || !clienteApe.trim() || !clienteEmail.trim() || !clienteCel.trim()) {
    ocultarError();
    mostrarSinvalor();
    return;
  }

  //Encabezado de la solicitud
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  
  //carga util de datos
  const raw = JSON.stringify({
      "dv": clienteDV,
    "nombres": clienteNom,
    "apellidos": clienteApe, 
    "email": clienteEmail,
    "celular": clienteCel
  });
  
  //Opciones de solicitud
  const requestOptions = {
    method: "PATCH",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };
  
  //Ejecutamos solicitud
  fetch("http://144.126.210.74:8080/api/cliente/"+g_id_cliente, requestOptions)
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
  const p_id_cliente = parametros.get('id');
  g_id_cliente = p_id_cliente;
  obtenerDatosActualizar(p_id_cliente);
}


//Obtener datos actualizar-----------------------------------------------------------------------------

function obtenerDatosActualizar(p_id_cliente) {
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/cliente/"+p_id_cliente, requestOptions)
    .then((response) => response.json())
    .then((json) => json.forEach(completarFormulario))
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

function completarFila(element, index, arr){

  var fechaHoraForm = formatearFechaHora(element.fecha_registro);

  arr[index] = document.querySelector("#tbl_cliente tbody").innerHTML +=
  `<tr>
  <td>${element.id_cliente}</td>
  <td>${element.dv}</td>
  <td>${element.nombres}</td>
  <td>${element.apellidos}</td>
  <td>${element.email}</td>
  <td>${element.celular}</td>
  <td>${fechaHoraForm}</td>
  <td> <a href='Actualizar.html?id=${element.id_cliente}' class='btn btn-warning'>Actualizar</a>
  <a href='Eliminar.html?id=${element.id_cliente}' class='btn btn-danger'>Eliminar</a> </td>
  </tr>` //element.id_tipo_gestion en el ennlace
}

//Eliminar
function obtenerIdEliminar(){
  //Obtener datos de la solicitud
  const queryString = window.location.search; //Una const (Constante)
  //Obtener todos los parametros
  const parametros = new URLSearchParams(queryString);
  //Nos posicionamos sobre un parametro y obtenemos su valor actual
  const p_id_cliente = parametros.get('id');
  g_id_cliente = p_id_cliente;
  obtenerDatosEliminar(p_id_cliente);
}

function obtenerDatosEliminar(p_id_cliente) {
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/cliente/"+p_id_cliente, requestOptions)
    .then((response) => response.json())
    .then((json) => json.forEach(completarEtiqueta))
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

function EliminarCliente(){
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
  fetch("http://144.126.210.74:8080/api/cliente/"+g_id_cliente, requestOptions)
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
  var clienteDV = element.dv;
  var clienteNom = element.nombres;
  var clienteApe = element.apellidos;
  var clienteEmail = element.email;
  var clienteCel = element.celular;

  document.getElementById("txt_dv").value = clienteDV;
  document.getElementById("txt_nombre").value = clienteNom;
  document.getElementById("txt_apellido").value = clienteApe;
  document.getElementById("txt_email").value = clienteEmail;
  document.getElementById("txt_celular").value = clienteCel;

}

function completarEtiqueta(element,index,arr){
  var clienteNom = element.nombres;
  var clienteApe = element.apellidos;
  document.getElementById("lbl_eliminar").innerHTML = "¿Estas seguro de que deseas eliminar este tipo de gestion? <b>"+clienteNom+" "+clienteApe+"</b>";

}

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