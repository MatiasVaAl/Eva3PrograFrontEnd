var g_id_gestion = "";

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

function agregarGestion(){

// Obtenemos el tipo de gestion que ingresa el usuario
var id_usuario = document.getElementById("sel_id_usuario").value;
var id_cliente = document.getElementById("sel_id_cliente").value;
var id_tipo_gestion = document.getElementById("sel_id_tipo_gestion").value;
var id_resultado = document.getElementById("sel_id_resultado").value;
var comentarios = document.getElementById("txt_comentarios").value;

if (!comentarios.trim()) {
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
  "id_usuario": id_usuario,
  "id_cliente": id_cliente,
  "id_tipo_gestion": id_tipo_gestion,
  "id_resultado": id_resultado,
  "comentarios": comentarios,
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
fetch("http://144.126.210.74:8080/api/gestion", requestOptions)
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

function listarGestion(){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
    "query": "select ges.id_gestion as id_gestion,cli.id_cliente, ges.comentarios as comentarios,CONCAT(cli.nombres, ' ',cli.apellidos) as nombre_cliente,CONCAT(usu.nombres,' ' ,usu.apellidos) as nombre_usuario,tge.nombre_tipo_gestion as nombre_tipo_gestion,res.nombre_resultado as nombre_resultado,ges.fecha_registro as fecha_registro from gestion ges,usuario usu,cliente cli,tipo_gestion tge,resultado res where ges.id_usuario = usu.id_usuario and ges.id_cliente = cli.id_cliente and ges.id_tipo_gestion = tge.id_tipo_gestion and ges.id_resultado = res.id_resultado "});
    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };
    fetch("http://144.126.210.74:8080/dynamic", requestOptions)
    .then(response => response.json())
    .then((json) => {
        json.forEach(completarFila);
        $('#tbl_gestion').DataTable();
    })
    .then(result => console.log(result))
    .catch(error => console.log('error', error));    
}

function actualizarGestion(){

  // Obtenemos el tipo de gestion que ingresa el usuario
  var id_usuario = document.getElementById("sel_id_usuario").value;
  var id_cliente = document.getElementById("sel_id_cliente").value;
  var id_tipo_gestion = document.getElementById("sel_id_tipo_gestion").value;
  var id_resultado = document.getElementById("sel_id_resultado").value;
  var comentarios = document.getElementById("txt_comentarios").value;

if (!comentarios.trim()) {
  ocultarError();
  mostrarSinvalor();
  return; 
}

  //Encabezado de la solicitud
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  
  //carga util de datos
  const raw = JSON.stringify({
    "id_usuario": id_usuario,
    "id_cliente": id_cliente,
    "id_tipo_gestion": id_tipo_gestion,
    "id_resultado": id_resultado,
    "comentarios": comentarios,
    "fecha_registro": fechaHoraActual
  });
  
  //Opciones de solicitud
  const requestOptions = {
    method: "PATCH",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };
  
  //Ejecutamos solicitud
  fetch("http://144.126.210.74:8080/api/gestion/"+g_id_gestion, requestOptions)
    .then((response) => {
      if (response.status == 200){
        ocultarError()
        ocultarSinvalor()
        mostrarCorrecto()
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
  const p_id_gestion = parametros.get('id');
  g_id_gestion = p_id_gestion;
  obtenerDatosActualizar(p_id_gestion);
}


//Obtener datos actualizar-----------------------------------------------------------------------------

function obtenerDatosActualizar(p_id_gestion) {
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/gestion/"+p_id_gestion, requestOptions)
    .then((response) => response.json())
    .then((json) => json.forEach(cargarListasDesplegables()))
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

function completarFila(element,index,arr){
  arr[index] = document.querySelector("#tbl_gestion tbody").innerHTML +=
  `<tr>
  <td>${element.id_gestion}</td>
  <td>${element.nombre_usuario}</td>
  <td>${element.nombre_cliente}</td>
  <td>${element.nombre_tipo_gestion}</td>
  <td>${element.nombre_resultado}</td>
  <td>${element.comentarios}</td>
  <td>${element.fecha_registro}</td>

  <td> <a href='Actualizar.html?id=${element.id_gestion}' class='btn btn-warning'>Actualizar</a>
  <a href='Eliminar.html?id=${element.id_gestion}' class='btn btn-danger'>Eliminar</a> </td>
  </tr>` //element.id_tipo_gestion en el ennlace
}

//Eliminar
function obtenerIdEliminar(){
  //Obtener datos de la solicitud
  const queryString = window.location.search; //Una const (Constante)
  //Obtener todos los parametros
  const parametros = new URLSearchParams(queryString);
  //Nos posicionamos sobre un parametro y obtenemos su valor actual
  const p_id_gestion = parametros.get('id');
  g_id_gestion = p_id_gestion;
  obtenerDatosEliminar(p_id_gestion);
}

function obtenerDatosEliminar(p_id_gestion) {
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/gestion/"+p_id_gestion, requestOptions)
    .then((response) => response.json())
    .then((json) => json.forEach(completarEtiqueta))
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

function EliminarGestion(){
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
  fetch("http://144.126.210.74:8080/api/gestion/"+g_id_gestion, requestOptions)
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
  var nombre_tipo_gestion = element.nombre_tipo_gestion;
  document.getElementById("txt_nombre").value = nombre_tipo_gestion;

}

function completarEtiqueta(element,index,arr){
  var idgestion = element.id_gestion;

  document.getElementById("lbl_eliminar").innerHTML = "¿Estas seguro de que deseas eliminar esta gestion? <b>"+"ID:"+idgestion+"</b>";
}

//Seleccionar Resultado--------------------------------------------------------------------------------
function cargarSelecResultado(){
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/resultado?_size=200", requestOptions)
    .then((response) => response.json())
    .then((json) => {
      json.forEach(completarOptionResultado);

    } )//Aqui carga los datos de la tabla.
    .then((result) => console.log(result))
    .catch((error) => console.error(error))
}

function completarOptionResultado(element, index, arr){
  //la linea de abajo inyecta resultados a la id= sel_id_resultado.
  arr[index] = document.querySelector("#sel_id_resultado").innerHTML +=
`<Option value='${element.id_resultado}'> ${element.nombre_resultado} </option>`
}

//Select Clientes opcion select--------------------------------------------------------------------------------
function cargarSelecCliente(){
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/cliente?_size=200", requestOptions)
    .then((response) => response.json())
    .then((json) => {
      json.forEach(completarOptionCliente);

    })//Aqui carga los datos de la tabla.
    .then((result) => console.log(result))
    .catch((error) => console.error(error))
}

function completarOptionCliente(element, index, arr){
  //la linea de abajo inyecta resultados a la id= sel_id_resultado.
  arr[index] = document.querySelector("#sel_id_cliente").innerHTML +=
`<Option value='${element.id_cliente}'> ${element.nombres} ${element.apellidos} </option>`
}

//Select Usuario-----------------------------------------------------------------------------------------------
function cargarSelecUsuario(){
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/usuario?_size=200", requestOptions)
    .then((response) => response.json())
    .then((json) => {
      json.forEach(completarOptionUsuario);

    })//Aqui carga los datos de la tabla.
    .then((result) => console.log(result))
    .catch((error) => console.error(error))
}

function completarOptionUsuario(element, index, arr){
  //la linea de abajo inyecta resultados a la id= sel_id_resultado.
  arr[index] = document.querySelector("#sel_id_usuario").innerHTML +=
`<Option value='${element.id_usuario}'> ${element.nombres} ${element.apellidos} </option>`
}

//SelecTipoGestion------------------------------------------------------------------------------------------
function cargarSelecTipoGestion(){
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/tipo_gestion?_size=200", requestOptions)
    .then((response) => response.json())
    .then((json) => {
      json.forEach(completarOptionTipo_gestion);

    })//Aqui carga los datos de la tabla.
    .then((result) => console.log(result))
    .catch((error) => console.error(error))
}

function completarOptionTipo_gestion(element, index, arr){
  //la linea de abajo inyecta resultados a la id= sel_id_resultado.

  arr[index] = document.querySelector("#sel_id_tipo_gestion").innerHTML +=
`<Option value='${element.id_tipo_gestion}'> ${element.nombre_tipo_gestion} </option>`
}


//----------------------------------------------------------------------------------------------------
function cargarListasDesplegables(){
  cargarSelecResultado();
  cargarSelecCliente();
  cargarSelecUsuario();
  cargarSelecTipoGestion();
}