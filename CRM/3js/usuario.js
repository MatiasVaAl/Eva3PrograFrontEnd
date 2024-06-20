var g_id_usuario = "";

//Mostar alertas----------------------------------------------------
function mostrarCorrecto(){
  document.getElementById('correcto').style.display = 'block';
};

function mostrarError(){
  document.getElementById('error').style.display = 'block';
};

function mostrarSinvalor(){
  document.getElementById('sinValor').style.display = 'block';
}

function ocultarError(){
  document.getElementById('error').style.display = 'none';
}

function ocultarSinvalor(){
  document.getElementById('sinValor').style.display = 'none';
}

//Función para agregar tipo de gestión
function agregarUsuario(){

// Obtenemos el usuario que ingresan

var rutUser = document.getElementById("txt_Rut").value;
var dvUser = document.getElementById("txt_Dv").value;
var userNom = document.getElementById("txt_nombres").value;
var userApe = document.getElementById("txt_apellidos").value;
var userEmail = document.getElementById("txt_email").value;
var userCel = document.getElementById("txt_celu").value;
var user = document.getElementById("txt_user").value;
var password = document.getElementById("txt_password").value;

//Validador de que no sean nulos los datos ( este simbolo || funciona como un operador or )
if (!rutUser.trim() || !dvUser.trim() || !userNom.trim() || !userApe.trim() || !userEmail.trim() || !userCel.trim()|| !user.trim() || !password.trim()) {
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
  "id_usuario": rutUser,
  "dv": dvUser,
  "nombres": userNom,
  "apellidos": userApe, 
  "email": userEmail,
  "celular": parseInt(userCel),
  "username": user,
  "password": password,
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
fetch("http://144.126.210.74:8080/api/usuario", requestOptions)
  .then((response) => {
    if (response.status == 200){
      ocultarSinvalor()
      ocultarError()
      mostrarCorrecto()
      setTimeout(() => location.href ="listar.html", 2000);
    }
    if(response.status == 400){
      ocultarSinvalor()
      mostrarError()
    }
  })
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
}

function listarUsuarios(){
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/usuario?_size=200", requestOptions)
    .then((response) => response.json())
    .then((json) => {
      json.forEach(completarFila);
      $('#tbl_usuario').DataTable();

    } )//Aqui carga los datos de la tabla.
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

function actualizarUsuario(){

var dvUser = document.getElementById("txt_Dv").value;
var userNom = document.getElementById("txt_nombres").value;
var userApe = document.getElementById("txt_apellidos").value;
var userEmail = document.getElementById("txt_email").value;
var userCel = document.getElementById("txt_celu").value;
var user = document.getElementById("txt_user").value;
var password = document.getElementById("txt_password").value;

if (!dvUser.trim() || !userNom.trim() || !userApe.trim() || !userEmail.trim() || !userCel.trim()|| !user.trim() || !password.trim()) {
  ocultarError();
  mostrarSinvalor(); 
  return;
}
  
  //Encabezado de la solicitud
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  
  //carga util de datos
  const raw = JSON.stringify({

    "dv": dvUser,
    "nombres": userNom,
    "apellidos": userApe, 
    "email": userEmail,
    "celular": parseInt(userCel),
    "username": user,
    "password": password
  });
  
  //Opciones de solicitud
  const requestOptions = {
    method: "PATCH",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };
  
  //Ejecutamos solicitud
  fetch("http://144.126.210.74:8080/api/usuario/"+g_id_usuario, requestOptions)
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
  const p_id_usuario = parametros.get('id');
  g_id_usuario = p_id_usuario;
  obtenerDatosActualizar(p_id_usuario);
}


//Obtener datos actualizar-----------------------------------------------------------------------------

function obtenerDatosActualizar(p_id_usuario) {
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/usuario/"+p_id_usuario, requestOptions)
    .then((response) => response.json())
    .then((json) => json.forEach(completarFormulario))
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

function completarFila(element, index, arr){

  var fechaHoraForm = formatearFechaHora(element.fecha_registro);

  arr[index] = document.querySelector("#tbl_usuario tbody").innerHTML +=
  `<tr>
  <td>${element.id_usuario}</td>
  <td>${element.dv}</td>
  <td>${element.nombres}</td>
  <td>${element.apellidos}</td>
  <td>${element.email}</td>
  <td>${element.celular}</td>
  <td>${element.username}</td>
  <td>${fechaHoraForm}</td>
  <td> <a href='Actualizar.html?id=${element.id_usuario}' class='btn btn-warning'>Actualizar</a> 
  <a href='Eliminar.html?id=${element.id_usuario}' class='btn btn-danger'>Eliminar</a> </td>
  </tr>`
}

//Eliminar
function obtenerIdEliminar(){
  //Obtener datos de la solicitud
  const queryString = window.location.search; //Una const (Constante)
  //Obtener todos los parametros
  const parametros = new URLSearchParams(queryString);
  //Nos posicionamos sobre un parametro y obtenemos su valor actual
  const p_id_usuario = parametros.get('id');
  g_id_usuario = p_id_usuario;
  obtenerDatosEliminar(p_id_usuario);
}

function obtenerDatosEliminar(p_id_usuario) {
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/usuario/"+p_id_usuario, requestOptions)
    .then((response) => response.json())
    .then((json) => json.forEach(completarEtiqueta))
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

function EliminarUsuario(){
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
  fetch("http://144.126.210.74:8080/api/usuario/"+g_id_usuario, requestOptions)
    .then((response) => {
      if (response.status == 200){
        ocultarError()
        mostrarCorrecto()
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

  var dvUser = element.dv;
  var userNom = element.nombres;
  var userApe = element.apellidos;
  var userEmail = element.email;
  var userCel = element.celular;
  var user = element.username;
  var password = element.password;
  
  document.getElementById("txt_Dv").value = dvUser;
  document.getElementById("txt_nombres").value = userNom;
  document.getElementById("txt_apellidos").value = userApe;
  document.getElementById("txt_email").value = userEmail;
  document.getElementById("txt_celu").value = userCel;
  document.getElementById("txt_user").value = user;
  document.getElementById("txt_password").value = password;
}

function completarEtiqueta(element,index,arr){

  var user = element.username;
  document.getElementById("lbl_eliminar").innerHTML = "Estas seguro de que deseas eliminar este usuario? <b>"+user+"</b>";

}
//-----------------------------------------------------------------------------------------------------------------------
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