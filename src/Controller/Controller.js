import axios from "axios";

const userString = localStorage.getItem('usuario');
const usuario = JSON.parse(userString);

const headersFormData = {
  'Access-Control-Allow-Origin':'*',
  'Content-Type': 'multipart/form-data',
  'Access-Control-Allow-Headers':'Origin, Content-Type, X-Auth-Token',
}

const headers = {
  'Access-Control-Allow-Origin':'*',
  'Content-Type':'application/json; charset=utf-8',
  'Access-Control-Allow-Headers':'Origin, Content-Type, X-Auth-Token',
}

const headersQr = {
  'Content-Type':'application/json; charset=utf-8',
  'Authorization': 'Bearer e2a32db0-89ba-11ec-b5b6-fb668b2a8609',
}

const getDatosBarra = () => {
  const userLocal = localStorage.getItem('usuario');
  const usuarioDatos = JSON.parse(userLocal);
  return usuarioDatos
}

const getUserId = () => {
  const userLocal = localStorage.getItem('usuario');
  const usuarioDatos = JSON.parse(userLocal);
  return usuarioDatos?.userId
}

const myUrl = "https://4sales.com.co/SISTEMA/api/";

// ************************************************************************
// ************************   Controller Usuario   ************************  
// ************************************************************************
const getUser = async () => {
  return (
  fetch( myUrl + 'users/'+ usuario?.userId, {
    method: 'GET',
    headers: headers,
    })
    .then(data => data.json())
  )
}

const getUserById = async (usuarioid) => {
  return (
  fetch( myUrl + 'users/'+ usuarioid, {
    method: 'GET',
    headers: headers,
    })
    .then(data => data.json())
  )
}

const getAllUser = async () => {
  return (
  fetch( myUrl + 'users', {
    method: 'GET',
    headers: headers,
    })
    .then(data => data.json())
  )
}

const getControlUser = async () => {
  return (
  fetch( myUrl + 'users/ControlUsuarios', {
    method: 'GET',
    headers: headers,
    })
    .then(data => data.json())
  )
}

const postUser = async (datosUser) => {
  return (
    axios.post( myUrl + 'users', 
      datosUser, {
        headers : headersFormData
      }
    ).then(response => {
      if(response.status == 201){
        return "OK"
      } 
    })
    .catch(error => { 
      if (error.response.status == 400) {
        console.log(error)
        return error.response.data.message
      }
      console.log(error)
      return "ERROR"
    })
  )
}

const updateUser = async (datosUser, idUserRecibido) => {
  return (
    axios.put( myUrl + 'users/'+ idUserRecibido , 
      datosUser, {
        headers : headersFormData
      }
      ).then(res => { 
        return "OK"  
      })
      .catch(error => { 
        if (error.response.status == 400) {
          return error.response.data.message
        }
        return "ERROR"
      })
  )
}
const updateDatosPersonalesUsuario = async (datosUser, idUserRecibido) => {
  return (
    axios.put( myUrl + 'users/EditarDatosPersonales/'+ idUserRecibido , 
      datosUser, {
        headers : headersFormData
      }
      ).then(response => {
        return {"status":response.status, "data":response.data}
      }).catch(error => { 
        if (error.response.status == 400) {
          return {"status":400, "data":error.response.data.message}
        }
        return "ERROR"
      })
  )
}

const updateCambioContraseñaPropioUsuario = async (datosUser, idUserRecibido) => {
  return (
    axios.put( myUrl + 'users/CambiarContraseña/'+ idUserRecibido , 
      datosUser, {
        headers : headersFormData
      }
      ).then(response => {
        return {"status":response.status, "data":response.data}
      }).catch(error => { 
        if (error.response.status == 400) {
          return {"status":400, "data":error.response.data.message}
        }
        return "ERROR"
      })
  )
}

const deleteUser = async (id) => {
  return (
    axios.delete( myUrl + 'users/'+ id, {
        headers : headersFormData
      }
    ).then(res => {
        alert("Usuario Eliminado")
        return res.data
    })
    .catch(error => { 
      if (error.response.status == 400) {
        alert(error.response.data.message)
        console.log(error)
        return error.response.data.message
      }
      alert("ERROR")
      console.log(error)
      return "ERROR"
    })
  )
}

const bloquearUsuario = async (datosUser, id, activo) => {
  return (
    axios.put( myUrl + 'users/BloquearUsuario/'+ id, 
      datosUser, {
        headers : headersFormData
      }
    ).then(res => {
      if(activo){
        alert("Usuario Activado")
      }else{
        alert("Usuario Bloqueado")
      }
        return res.data
    })
    .catch(error => error)
  )
}

// ************************************************************************
// ************************   Administrador    ****************************
// ************************************************************************

const getUsuariosActivos = async () => {
  return (
    axios.get( myUrl + 'administrator/ObtenerUsuariosActivos', {
      headers : headersFormData
    }
    ).then(response => {
      return {"status":response.status, "data":response.data}
    }).catch(error => { 
      return {"status":error.response.status, "data":error.response.data.message}
    })
  )
}

const getTareasAsignadasUsuarios = async (UsuarioCreadorId) => {
  return (
    axios.get( myUrl + 'administrator/ObtenerTareasAsignadas/'+UsuarioCreadorId, {
      headers : headersFormData
    }
    ).then(response => {
      return {"status":response.status, "data":response.data}
    }).catch(error => { 
      return {"status":error.response.status, "data":error.response.data.message}
    })
  )
}

const getTareasPersonalesUsuarios = async (UsuarioId) => {
  return (
    axios.get( myUrl + 'administrator/ObtenerTareasDeUsuarios/'+UsuarioId, {
      headers : headersFormData
    }
    ).then(response => {
      return {"status":response.status, "data":response.data}
    }).catch(error => { 
      return {"status":error.response.status, "data":error.response.data.message}
    })
  )
}

const getTareasColaborativasUsuarios = async (UsuarioId) => {
  return (
    axios.get( myUrl + 'administrator/ObtenerTareasCompartidas/'+UsuarioId, {
      headers : headersFormData
    }
    ).then(response => {
      return {"status":response.status, "data":response.data}
    }).catch(error => { 
      return {"status":error.response.status, "data":error.response.data.message}
    })
  )
}

const getGraficosUsuarios = async () => {
  return (
  fetch( myUrl + 'administrator/GraficosUsuarios', {
    method: 'GET',
    headers: headers,
    })
    .then(data => data.json())
  )
}

const getGraficosEmpresa = async () => {
  return (
  fetch( myUrl + 'administrator/GraficosEmpresa', {
    method: 'GET',
    headers: headers,
    })
    .then(data => data.json())
  )
}

const getGraficosContactoByUser = async () => {
  return (
  fetch( myUrl + 'administrator/GraficosContactos', {
    method: 'GET',
    headers: headers,
    })
    .then(data => data.json())
  )
}

const getAsesoresActivos = async () => {
  return (
  fetch( myUrl + 'administrator/AsesoresTotales', {
    method: 'GET',
    headers: headers,
    })
    .then(data => data.json())
    .catch((error) => {
      alert(error)
    })
  )
}

const getDatosAsesoresComercialesActivos = async () => {
  return (
    axios.get( myUrl + 'administrator/AsesoresComercialesActivos', {
      headers : headersFormData
    }
    ).then(response => {
      return {"status":response.status, "data":response.data}
    }).catch(error => { 
      return {"status":error.response.status, "data":error.response.data.message}
    })
  )
}

const postAsignarNuevasCompaniasAsesor = async (datosCompanias) => {
  return (
    axios.post( myUrl + 'administrator/AsignarNuevaCompaniaAsesor', 
      datosCompanias, {
        headers : headers
      }
    ).then(response => {
      return {"status":response.status, "data":response.data}
    }).catch(error => { 
      return {"status":error.response.status, "data":error.response.data.message}
    })
  )
}

// ************************************************************************
// ************************   Usuarios Externos    ************************
// ************************************************************************

const getAllUserCardMaker = async () => {
  return (
  fetch( myUrl + 'usuariosExternos/CardMaker', {
    method: 'GET',
    headers: headers,
    })
    .then(data => data.json())
    .catch((error) => {
      alert(error)
    })
  )
}

const getUserExternosCardMakerById = async (usuarioid) => {
  return (
  fetch( myUrl + 'usuariosExternos/CardMaker/'+ usuarioid, { 
    method: 'GET',
    headers: headers,
    })
    .then(data => data.json())
  )
}

const postUserExternoCardMaker = async (datosUser) => {
  return (
    axios.post( myUrl + 'usuariosExternos/CardMaker', 
      datosUser, {
        headers : headersFormData
      }
    ).then(response => {
      if(response.status == 201){
        return "OK"
      } 
    })
    .catch(error => { 
      if (error.response.status == 400) {
        return error.response.data.message
      }
      return "ERROR"
    })
  )
}

const updateUserExternoCardMaker = async (datosUser, idUserRecibido) => {
  return (
    axios.put( myUrl + 'usuariosExternos/CardMaker/'+ idUserRecibido , 
      datosUser, {
        headers : headersFormData
      }
      ).then(res => { 
        return "OK"   
      })
      .catch(error => { 
        if (error.response.status == 400) {
          return error.response.data.message
        }
        return "ERROR"
      })
  )
}

const deleteUserExternoCardMaker = async (id) => {
  return (
    axios.delete( myUrl + 'usuariosExternos/CardMaker/'+ id, {
        headers : headersFormData
      }
    ).then(res => {
        alert("Usuario Eliminado")
        return res.data
    })
    .catch(error => error)
  )
}

// ***********                    FixYouWeb         **********************
const getAllUserFixYouWeb = async () => {
  return (
  fetch( myUrl + 'usuariosExternos/FixYouWeb', {
    method: 'GET',
    headers: headers,
    })
    .then(data => data.json())
  )
}

const getUserExternosFixYouWebById = async (usuarioid) => {
  return (
  fetch( myUrl + 'usuariosExternos/FixYouWeb/'+ usuarioid, { 
    method: 'GET',
    headers: headers,
    })
    .then(data => data.json())
  )
}

const postUserExternoFixYouWeb = async (datosUser) => {
  return (
    axios.post( myUrl + 'usuariosExternos/FixYouWeb', 
      datosUser, {
        headers : headersFormData
      }
    ).then(response => {
      if(response.status == 201){
        return "OK"
      } 
    })
    .catch(error => { 
      if (error.response.status == 400) {
        return error.response.data.message
      }
      return "ERROR"
    })
  )
}

const updateUserExternoFixYouWeb = async (datosUser, idUserRecibido) => {
  return (
    axios.put( myUrl + 'usuariosExternos/FixYouWeb/'+ idUserRecibido , 
      datosUser, {
        headers : headersFormData
      }
      ).then(res => { 
        return "OK"   
      })
      .catch(error => { 
        if (error.response.status == 400) {
          return error.response.data.message
        }
        return "ERROR"
      })
  )
}

const deleteUserExternoFixYouWeb = async (id) => {
  return (
    axios.delete( myUrl + 'usuariosExternos/FixYouWeb/'+ id, {
        headers : headersFormData
      }
    ).then(res => {
        alert("Usuario Eliminado")
        return res.data
    })
    .catch(error => error)
  )
}


// ************************************************************************
// ************************   Control de sesion    ************************
// ************************************************************************

const controlSesion = () => {
  const fechas = localStorage.getItem('fechas');
  const fecha = JSON.parse(fechas);
  let fecha2 = new Date(fecha?.fechaexpira)
  let fechaa = new Date();
  if( fecha2 < fechaa || fecha2 == fechaa){
    alert("sesion expirada")
    localStorage.clear();
    window.location.reload(false)
  }
}

// ************************************************************************
// **************   Controller Login Recuperar Contraseña    **************
// ************************************************************************

const validarCorreoUsuarioRecuperar = async (datosUser) => {
  return (
    axios.post( myUrl + 'login/ValidarCorreo' , 
      datosUser, {
        headers : headersFormData
      }
      ).then(response => {
        return {"status":response.status, "data":response.data} 
      }).catch(error => { 
        if (error.response.status == 404) {
          return {"status":404, "data":error.response.data.message}
        }
        return {"status":error.response.status, "data": "Ocurrio un error"}
      })
  )
}

const validarCodigoRecuperarContraseña = async (datosUser) => {
  return (
    axios.post( myUrl + 'login/ValidarCodigo' , 
      datosUser, {
        headers : headersFormData
      }
      ).then(response => {
        return {"status":response.status, "data":response.data}
      }).catch(error => { 
        if (error.response.status == 404) {
          return {"status":404, "data":error.response.data.message}
        }
        return {"status":error.response.status, "data": "Ocurrio un error"}
      })
  )
}

const cambioContraseñaCodigoValidado = async (datosUser) => {
  return (
    axios.post( myUrl + 'login/CambioContrasena' , 
      datosUser, {
        headers : headersFormData
      }
      ).then(response => {
        return {"status":response.status, "data":response.data}
      }).catch(error => { 
        if (error.response.status == 404) {
          return {"status":404, "data":error.response.data.message}
        }
        return {"status":error.response.status, "data": "Ocurrio un error"}
      })
  )
}

const enviarCodigoRecuperarCorreoUsuario = async (datosUser) => {
  return (
    axios.post( myUrl + 'login/RecuperarContrasena' , 
      datosUser, {
        headers : headersFormData
      }
      ).then(response => {
        return {"status":response.status, "data":response.data}
      }).catch(error => { 
        if (error.response.status == 404) {
          return {"status":404, "data":error.response.data.message}
        }
        return {"status":error.response.status, "data": "Ocurrio un error"}
      })
  )
}


// ************************************************************************
// ************************   Controller Company   ************************
// ************************************************************************
const getCompanybyID = async (id) => {
  return (
    axios.get( myUrl + 'company/' + id, {
    headers : headersFormData
    }
    ).then(res => res.data)
    .catch(error => error)
  )
}

const getAllCompanies = async () => {
  return (
    axios.get( myUrl + 'company', {
    headers : headersFormData
    }
    ).then(res => res.data)
    .catch(error => error)
  )
}

const getAllMyCompanies = async (id) => {
  return (
    axios.get( myUrl + 'company/MyCompanies/'+id, {
    headers : headersFormData
    }
    ).then(res => res.data)
    .catch(error => error)
  )
}

const getCompaniasSinSeguimiento = async () => {
  return (
    axios.get( myUrl + 'company/CompaniasSinSeguimiento', {
    headers : headersFormData
    }
    ).then(response => {
      return {"status":response.status, "data":response.data}
    }).catch(error => { 
      return {"status":error.response.status, "data":error.response.data.message}
    })
  )
}


// const postSearchCompany = async (CadenaBusqueda) => {
//   return (
//     axios.post( myUrl + 'company/searchCompany', 
//       CadenaBusqueda, {
//         headers : headersFormData
//       }
//     ).then(res => res.data)
//     .catch(error => { 
//       alert("Error")
//     })
//   )
// }

const postCompany = async (datosCompany) => {
  return (
    axios.post( myUrl + 'company', 
      datosCompany, {
        headers : headersFormData
      }
    ).then(response => {
      return {"status":response.status, "data":response.data}
    }).catch(error => { 
      if (error.response.status == 400) {
        return {"status":400, "data":error.response.data.message}
      }
      return "ERROR"
    })
  )
}

const postValidateCompany = async (dataCompany) => {
  return (
    axios.post( myUrl + 'company/ValidarCompany', 
      dataCompany, {
        headers : headersFormData
      }
    ).then(res => res.data)
    .catch(error => { 
      alert("Error")
    })
  )
}

const updateCompany = async (datosCompany, idEmpresaRecibido) => {
  return (
    axios.put( myUrl + 'company/'+ idEmpresaRecibido, 
      datosCompany, {
        headers : headersFormData
      }
    ).then(res => { 
      return "OK"  
    })
    .catch(error => { 
      if (error.response.status == 400) {
        return {"status":400, "data":error.response.data.message}
      }
      return "ERROR"
    })
  )
}

const deleteCompany = async (id) => {
  return (
    axios.delete( myUrl + 'company/' + id, {
        headers : headersFormData
      }
    ).then(res => { alert('Empresa Eliminada')})
    .catch(error => error)
  )
}

// ************************************************************************
// ***********************  Controller Department  ************************
// ************************************************************************

const getAllDepartement = async () => {
  return (
    axios.get( myUrl + 'department', {
    headers : headersFormData
    }
    ).then(res => res.data)
    .catch(error => error)
  )
}

// ************************************************************************
// ***********************  Controller Sucursales  ************************
// ************************************************************************

const getAllMySucursales = async (id) => {
  return (
    axios.get( myUrl + 'sucursal/MySucursal/'+id, {
    headers : headersFormData
    }
    ).then(res => res.data)
    .catch(error => error)
  )
}

const getAllSucursales = async () => {
  return (
    axios.get( myUrl + 'sucursal', {
    headers : headersFormData
    }
    ).then(res => res.data)
    .catch(error => error)
  )
}

const getSucursalbyID = async (id) => {
  return (
    axios.get( myUrl + 'sucursal/' + id, {
    headers : headersFormData
    }
    ).then(res => res.data)
    .catch(error => error)
  )
}

const getSucursalbyCompany = async (id) => {
  return (
    axios.get( myUrl + 'sucursal/GetCompany/' + id, {
    headers : headersFormData
    }
    ).then(res => res.data)
    .catch(error => error)
  )
}


const postSucursales = async (datosSucursal) => {
  return (
    axios.post( myUrl + 'sucursal', 
      datosSucursal, {
        headers : headersFormData
      }
    ).then(response => {
      if(response.status == 201){
        return "OK"
      } 
    })
    .catch(error => {
      alert("Error")
      if (error.response.status == 400) {
        return error.response.data.message
      }
      return "ERROR"
    })
  )
}

// const postSearchContact = async (datosSucursal) => {
//   return (
//     axios.post( myUrl + 'sucursal/searchContacts', 
//       datosSucursal, {
//         headers : headersFormData
//       }
//     ).then(response => response.data)
//     .catch(error => {
//       alert("Error")
//     })
//   )
// }

const getFilterContactbyCompany = async (id, userIdFilter) => {
  return (
    axios.get( myUrl + 'sucursal/FilterContactByCompany/' + id + "/"+ userIdFilter, {
    headers : headersFormData
    }
    ).then(res => res.data)
    .catch(error => error)
  )
}

const deleteSucursal = async (id) => {
  return (
    axios.delete( myUrl + 'sucursal/' + id, {
        headers : headersFormData
      }
    ).then(res => { alert('Contacto Eliminado')})
    .catch(error => error)
  )
}

const updateSucursales = async (datosSucursal, idSucuralEdicion) => {
  return (
    axios.put( myUrl + 'sucursal/'+idSucuralEdicion, 
      datosSucursal, {
        headers : headersFormData
      }
    ).then(response => {
      if(response.status == 201){
        return "OK"
      } 
    })
    .catch(error => {
      // alert("Error")
      if (error.response.status == 400) {
        return error.response.data.message
      }
      return "ERROR"
    })
  )
}

// ************************************************************************
// ************************   Controller Carpetas  ************************
// ************************************************************************

const getMyCarpetas = async (idcarpeta) => {
  return (
    axios.get( myUrl + 'carpetas/myCarpetas/' + usuario?.userId + '/'+ idcarpeta, {
    headers : headersFormData
    }
    ).then(res => res.data)
    .catch(error => error)
  )
}

const postCarpetas = async (datosCarpeta) => {
  return (
    axios.post( myUrl + 'carpetas', 
      datosCarpeta, {
        headers : headersFormData
      }
    ).then(response => {
      alert("Creado")
      return response.data
    })
    .catch(error => error)
  )
}

const getCarpetasByUser = async (idcarpeta, usuar) => {
  return (
    axios.get( myUrl + 'carpetas/myCarpetas/' + usuar + '/'+ idcarpeta, {
    headers : headersFormData
    }
    ).then(res => res.data)
    .catch(error => error)
  )
}

const getCarpetasAdmin = async (id) => {
  return (
    axios.get( myUrl + 'carpetas/CarpetasAdmin/' + id, {
    headers : headersFormData
    }
    ).then(res => res.data)
    .catch(error => error)
  )
}

const updateCarpeta = async (carpetaIdUpdate,datosCarpetaUpdate) => {
  return (
    axios.put( myUrl + 'carpetas/'+ carpetaIdUpdate, 
      datosCarpetaUpdate, {
        headers : headersFormData
      }
    ).then(response => {
      return response.status
    })
    .catch(error => {return error.response.status})
  )
}

const deleteCarpeta = async (carpetaIdDelete) => {
  return (
    axios.delete( myUrl + 'carpetas/'+ carpetaIdDelete, 
      {
        headers : headersFormData
      }
    ).then(response => {
      return response.status
    })
    .catch(error => {return error.response.status})
  )
}


// ************************************************************************
// ***********************  Controller Documentos  ************************
// ************************************************************************

const getMyDocumentos = async (idcarpeta) => {
  return (
    axios.get( myUrl + 'documentos/myDocs/' + usuario?.userId +'/'+ idcarpeta, {
      headers : headersFormData
    }
    ).then(res => res.data)
    .catch(error => error)
  )
}

const getDocument = async (idcarpeta) => {
  return (
    axios.get( myUrl + 'documentos/ObtenerDocumento/' + idcarpeta, {
      headers : headersFormData
    }
    ).then(res => res.data)
    .catch(error => error)
  )
}

const postDocumentos = async (datosDocument) => {
  return (
    axios.post( myUrl + 'documentos', 
      datosDocument, {
        headers : headersFormData
      }
    ).then(response => {
      return "OK"
    })
    .catch(error => error)
  )
}

const uploadDocumentos = async (datosDocument) => {
  return (
    axios.post( myUrl + 'documentos/CargarDocumento', 
      datosDocument, {
        headers : headersFormData
      }
      ).then(res => {
        return "OK"  
      })
      .catch(error => { 
        if (error.response.status == 400) {
          return error.response.data.message
        }
        return "ERROR"
      })
  )
}

const reloadDocumentos = async (idDocumentoReload, datosDocument) => {
  return (
    axios.post( myUrl + 'documentos/VolverCargarDocumento/'+ idDocumentoReload, 
      datosDocument, {
        headers : headersFormData
      }
      ).then(res => {
        return "OK"  
      })
      .catch(error => { 
        if (error.response.status == 400) {
          return error.response.data.message
        }
        return "ERROR"
      })
  )
}


const deleteDocumentos = async (idDocumento, IdDocumentoDrive) => {
  return (
    axios.delete( myUrl + 'documentos/'+idDocumento+'/'+IdDocumentoDrive , 
      {
        headers : headersFormData
      }
    ).then(response => {
      return "OK"
    })
    .catch(error => error)
  )
}

const updateDocumentos = async (idDocumento, datosUpdate) => {
  return (
    axios.put( myUrl + 'documentos/'+idDocumento, 
      datosUpdate,{
        headers : headers
      }
      ).then(res => { 
        return "OK"  
      })
      .catch(error => { 
        if (error.response.status == 400) {
          return error.response.data.message
        }
        return "ERROR"
      })
  )
}

const getDocumentosByUser = async (idcarpeta, usua) => {
  return (
    axios.get( myUrl + 'documentos/myDocs/' + usua +'/'+ idcarpeta, {
      headers : headersFormData
    }
    ).then(res => res.data)
    .catch(error => error)
  )
}

const sharedDocument = async (DataShared) => {
  return (
    axios.post( myUrl + 'documentos/shared', DataShared, {
      headers : headersFormData
    }
    ).then(res => res.status)
    .catch(error => error)
  )
}

const getDocumentosToDownload = async (idDocumentoDownload) => {
  return (
    axios.get( myUrl + 'documentos/download/' + idDocumentoDownload, {
      headers : headersFormData
    }
    ).then(res => res.data)
    .catch(error => error)
  )
}

// ************************************************************************
// ********************* Controller Carta Presentacion ********************
// ************************************************************************

const getUserTargetPresentation = async (id) => {
  return (
  fetch( myUrl + 'users/'+ id, {
    method: 'GET',
    headers: headers,
    })
    .then(data => data.json())
  )
}

const getUserTargetPresentationViewers = async (id) => {
  return (
  fetch( myUrl + 'tarjetaPresentacion/'+ id, {
    method: 'GET',
    headers: headers,
    })
    .then(data => data.json())
  )
}

const getUserRedesSociales = async (id) => {
  return (
  fetch( myUrl + 'redesSociales/'+ id, {
    method: 'GET',
    headers: headers,
    })
    .then(data => data.json())
  )
}

// ************************************************************************
// ************************  Controller Codigo QR  ************************
// ************************************************************************

const createCodeQR = async (bodycodigoQR) => {

  return (
    axios.post( "https://qrtiger.com/api/qr/static",bodycodigoQR, {headers: headersQr}
    ).then(response => {
      return response.data
    })
    .catch(error => alert("Ocurrio un problema con la Api QR"))
  )
}

const saveCodeQR = async (bodyQR) => {
  return (
    axios.post( myUrl+ "codigoQR" , bodyQR, {headers: headersFormData}
    ).then(response => {
      alert("CODIGO QR DEL USUARIO GENERADO")
      return response.data
    })
    .catch(error => error)
  )
}

const getCodeQR = async (id) => {
  return (
    axios.get( myUrl+ "codigoQR/MyCodigo/"+id, {headers: headersFormData}
    ).then(response => {
      return response.data
    })
    .catch(error => error)
  )
}

const getCodeQRViewers = async (id) => {
  return (
    axios.get( myUrl+ "tarjetaPresentacion/MyCodigo/"+id, {headers: headersFormData}
    ).then(response => {
      return response.data
    })
    .catch(error => error)
  )
}

// ************************************************************************
// *********************** Controller Bitacora ****************************
// ************************************************************************

const getBitacoraByCompany = async (idCompany) => {
  return (
    axios.get( myUrl+ "bitacora/BySucursal/"+idCompany, {headers: headersFormData}
    ).then(response => {
      return response.data
    })
    .catch(error => error)
  )
}

const getCountDocumentBitacora = async (idBitacora) => {
  return (
    axios.get( myUrl+ "bitacora/getCountDocument/"+idBitacora, {headers: headersFormData}
    ).then(response => {
      return response.data
    })
    .catch(error => error)
  )
}

const postBitacora = async (datosBitacora) => {
  return (
    axios.post( myUrl + 'bitacora', 
      datosBitacora, {
        headers : headersFormData
      }
    ).then(response => {
      return {"status":response.status, "data":response.data}
    })
    .catch(error => {return error.response.status})
  )
}

const updateBitacora = async (bitacoraIdUpdate,datosBitacora) => {
  return (
    axios.put( myUrl + 'bitacora/'+ bitacoraIdUpdate, 
      datosBitacora, {
        headers : headersFormData
      }
    ).then(response => {
      return response.status
    })
    .catch(error => {return error.response.status})
  )
}

const deleteBitacora = async (bitacoraIdDelete) => {
  return (
    axios.delete( myUrl + 'bitacora/'+ bitacoraIdDelete, 
      {
        headers : headersFormData
      }
    ).then(response => {
      return response.status
    })
    .catch(error => {return error.response.status})
  )
}

// ************************************************************************
// ******************** Controller Tipos Bitacora *************************
// ************************************************************************

const getTiposBitacora = async () => {
  return (
    axios.get( myUrl + 'tiposBitacora', {
      headers : headersFormData
    }
    ).then(res => res.data)
    .catch(error => error)
  )
}

// ************************************************************************
// ****************** Controller Documentos Bitacora **********************
// ************************************************************************

const getMyDocumentosBitacora = async (idbitacora) => {
  return (
    axios.get( myUrl + 'documentosBitacora/myDocs/'+ idbitacora, {
      headers : headersFormData
    }
    ).then(res => res.data)
    .catch(error => error)
  )
}

const postDocumentosBitacora = async (datosDocument) => {
  return (
    axios.post( myUrl + 'documentosBitacora', 
      datosDocument, {
        headers : headersFormData
      }
    ).then(response => {
      return "OK"
    })
    .catch(error => error)
  )
}

const updateDocumentosBitacora = async ( datosUpdate) => {
  return (
    axios.put( myUrl + 'documentosBitacora', 
      datosUpdate,{
        headers : headers
      }
      ).then(res => { 
        return "OK"  
      })
      .catch(error => { 
        if (error.response.status == 400) {
          return error.response.data.message
        }
        return "ERROR"
      })
  )
}

const deleteDocumentosBitacora = async (idDocumento) => {
  return (
    axios.delete( myUrl + 'documentosBitacora/'+idDocumento, 
      {
        headers : headersFormData
      }
    ).then(response => {
      return "OK"
    })
    .catch(error => error)
  )
}

const getDocumentosBitacoraToDownload = async (idDocumentoDownload) => {
  return (
    axios.get( myUrl + 'documentosBitacora/download/' + idDocumentoDownload, {
      headers : headersFormData
    }
    ).then(res => res.data)
    .catch(error => error)
  )
}

const reloadDocumentosBitacora = async (datosDocument) => {
  return (
    axios.post( myUrl + 'documentosBitacora/VolverCargarDocumento', 
      datosDocument, {
        headers : headersFormData
      }
      ).then(res => {
        return "OK"  
      })
      .catch(error => { 
        if (error.response.status == 400) {
          return error.response.data.message
        }
        return "ERROR"
      })
  )
}

// ************************************************************************
// ********************* Controller Servicios ITBF ************************
// ************************************************************************

const getServiciosItbf = async () => {
  return (
    axios.get( myUrl+ "serviciosItbf", {headers: headersFormData}
    ).then(response => {
      return response.data
    })
    .catch(error => error)
  )
}

// ************************************************************************
// **********************  Controller Gestion Casos  **********************
// ************************************************************************

const getCasoByID = async (id) => {
  return (
    axios.get( myUrl + 'gestionCasos/' + id, {
    headers : headersFormData
    }
    ).then(res => res.data)
    .catch(error => error)
  )
}

const getCasosByCompany = async (id) => {
  return (
    axios.get( myUrl + 'gestionCasos/ByCompany/' + id, {
    headers : headersFormData
    }
    ).then(res => res.data)
    .catch(error => error)
  )
}


const postGestionCaso = async (datosGestion) => {
  return (
    axios.post( myUrl + 'gestionCasos', 
      datosGestion, {
        headers : headersFormData
      }
    ).then(response => {
      if(response.status == 201){
        return "OK"
      } 
    })
    .catch(error => {
      alert("Error")
      if (error.response.status == 400) {
        return error.response.data.message
      }
      return "ERROR"
    })
  )
}

const deleteGestionCaso = async (id) => {
  return (
    axios.delete( myUrl + 'gestionCasos/' + id, {
        headers : headersFormData
      }
    ).then(res => { alert('Contacto Eliminado')})
    .catch(error => error)
  )
}

const updateGestionCaso = async (datosCaso, idGestionCaso) => {
  return (
    axios.put( myUrl + 'gestionCasos/'+idGestionCaso, 
      datosCaso, {
        headers : headersFormData
      }
    ).then(response => {
      if(response.status == 201){
        return "OK"
      } 
    })
    .catch(error => {
      // alert("Error")
      if (error.response.status == 400) {
        return error.response.data.message
      }
      return "ERROR"
    })
  )
}

const cambiarEstadoGestionCaso = async (datosCaso, idGestionCaso) => {
  return (
    axios.put( myUrl + 'gestionCasos/CambiarEstado/'+idGestionCaso, 
      datosCaso, {
        headers : headersFormData
      }
    ).then(response => {
      return {"status":response.status, "data":response.data}
    })
    .catch(error => {
      // alert("Error")
      if (error.response.status == 400) {
        return error.response.data.message
      }
      return "ERROR"
    })
  )
}

// ************************************************************************
// ************** Controller Observaciones Gestion Caso *******************
// ************************************************************************

const getObservacionsByGestion = async (idGestion, estadoEvolucion) => {
  return (
    axios.get( myUrl+ "observacionesGestionCaso/ByGestionEstado/"+idGestion+"/"+estadoEvolucion, {headers: headersFormData}
    ).then(response => {
      return response.data
    })
    .catch(error => error)
  )
}

const getTodasObservacionsPorGestion = async (idGestion) => {
  return (
    axios.get( myUrl+ "observacionesGestionCaso/ObservacionesPorGestionCaso/"+idGestion, {headers: headersFormData}
    ).then(response => {
      return response.data
    })
    .catch(error => error)
  )
}

const getCountDocumentObservaciones = async (idObservacion) => {
  return (
    axios.get( myUrl+ "observacionesGestionCaso/getCountDocument/"+idObservacion, {headers: headersFormData}
    ).then(response => {
      return response.data
    })
    .catch(error => error)
  )
}

const postObservacionGestion = async (datosObservacionGestion) => {
  return (
    axios.post( myUrl + 'observacionesGestionCaso', 
      datosObservacionGestion, {
        headers : headersFormData
      }
    ).then(response => {
      return {"status":response.status, "data":response.data}
    })
    .catch(error => {return error.response.status})
  )
}

const updateObservacionGestion= async (ObservacionIdUpdate,datosObservacionGestion) => {
  return (
    axios.put( myUrl + 'observacionesGestionCaso/'+ ObservacionIdUpdate, 
      datosObservacionGestion, {
        headers : headersFormData
      }
    ).then(response => {
      return response.status
    })
    .catch(error => {return error.response.status})
  )
}

const deleteObservacionGestion= async (observacionIdDelete) => {
  return (
    axios.delete( myUrl + 'observacionesGestionCaso/'+ observacionIdDelete, 
      {
        headers : headersFormData
      }
    ).then(response => {
      return response.status
    })
    .catch(error => {return error.response.status})
  )
}

// ************************************************************************
// **************** Controller Documentos Gestion Caso ********************
// ************************************************************************

const getDocumentosObservacionesGestion = async (idObservacion) => {
  return (
    axios.get( myUrl + 'documentosGestionCaso/documentosObservacion/'+ idObservacion, {
      headers : headersFormData
    }
    ).then(res => res.data)
    .catch(error => error)
  )
}

const postDocumentosObservacionesGestion = async (datosDocument) => {
  return (
    axios.post( myUrl + 'documentosGestionCaso', 
      datosDocument, {
        headers : headersFormData
      }
    ).then(response => {
      return "OK"
    })
    .catch(error => error)
  )
}

const updateDocumentosObservacionesGestion = async (IddocumentoObservacionUpdate, datosUpdate) => {
  return (
    axios.put( myUrl + 'documentosGestionCaso/'+IddocumentoObservacionUpdate, 
      datosUpdate,{
        headers : headersFormData
      }
      ).then(res => { 
        return "OK"  
      })
      .catch(error => { 
        if (error.response.status == 400) {
          return error.response.data.message
        }
        return "ERROR"
      })
  )
}

const deleteDocumentosObservacionesGestion = async (idDocumento) => {
  return (
    axios.delete( myUrl + 'documentosGestionCaso/'+idDocumento, 
      {
        headers : headersFormData
      }
    ).then(response => {
      return "OK"
    })
    .catch(error => error)
  )
}

const getDocumentosObservacionToDownload = async (idDocumentoDownload) => {
  return (
    axios.get( myUrl + 'documentosGestionCaso/download/' + idDocumentoDownload, {
      headers : headersFormData
    }
    ).then(res => res.data)
    .catch(error => error)
  )
}

const reloadDocumentosObservacionesGestion = async (datosDocument) => {
  return (
    axios.post( myUrl + 'documentosGestionCaso/VolverCargarDocumento', 
      datosDocument, {
        headers : headersFormData
      }
      ).then(res => {
        return "OK"  
      })
      .catch(error => { 
        if (error.response.status == 400) {
          return error.response.data.message
        }
        return "ERROR"
      })
  )
}

// ************************************************************************
// *************** Controller Gestion De Oportunidades ********************
// ************************************************************************

const getMisCompaniasGestionOportunidades = async () => {
  return (
    axios.get( myUrl + 'gestionDeOportunidades/MisCompañias/'+ usuario?.userId, {
      headers : headersFormData
    }
    ).then(res => res.data)
    .catch(error => error)
  )
}

const getMisOportunidadesGestion = async () => {
  return (
    axios.get( myUrl + 'gestionDeOportunidades/MisOportunidades/'+ usuario?.userId, {
      headers : headersFormData
    }
    ).then(res => res.data)
    .catch(error => error)
  )
}

const getDetallesOportunidadById = async (oportunidadId) => {
  return (
    axios.get( myUrl + 'gestionDeOportunidades/'+ oportunidadId, {
      headers : headersFormData
    }
    ).then(res => res.data)
    .catch(error => error)
  )
}

const postNuevaOportunidad = async (datosNuevaOportunidad) => {
  return (
    axios.post( myUrl + 'gestionDeOportunidades', 
      datosNuevaOportunidad, {
        headers : headersFormData
      }
    ).then(response => {
      return {"status":response.status, "data":response.data}
    }).catch(error => { 
      if (error.response.status == 400) {
        return {"status":400, "data":error.response.data.message}
      }
      return "ERROR"
    })
  )
}

const updateOportunidadCambioCompania = async (oportunidadId, datosUpdate) => {
  return (
    axios.put( myUrl + 'gestionDeOportunidades/CambiarCompania/'+oportunidadId, 
      datosUpdate,{
        headers : headersFormData
      }
      ).then(response => {
        return {"status":response.status, "data":response.data}  
      })
      .catch(error => { 
        if (error.response.status == 400) {
          return error.response.data.message
        }
        return "ERROR"
      })
  )
}

const updateDetallesOportunidad = async (oportunidadId, datosUpdate) => {
  return (
    axios.put( myUrl + 'gestionDeOportunidades/'+oportunidadId, 
      datosUpdate,{
        headers : headersFormData
      }
      ).then(response => {
        return {"status":response.status, "data":response.data}  
      })
      .catch(error => { 
        if (error.response.status == 400) {
          return error.response.data.message
        }
        return "ERROR"
      })
  )
}

const updateOportunidadCambioEstado = async (oportunidadId, datosUpdate) => {
  return (
    axios.put( myUrl + 'gestionDeOportunidades/CambiarEtapaOportunidad/'+oportunidadId, 
      datosUpdate,{
        headers : headersFormData
      }
      ).then(response => {
        return {"status":response.status, "data":response.data}  
      })
      .catch(error => { 
        if (error.response.status == 400) {
          return error.response.data.message
        }
        return "ERROR"
      })
  )
}
const deleteMiOportunidad = async (oportunidadId) => {
  return (
    axios.delete( myUrl + 'gestionDeOportunidades/'+oportunidadId, 
      {
        headers : headersFormData
      }
    ).then(response => {
      return {"status":response.status, "data":response.data}  
    })
    .catch(error => error)
  )
}


// ************************************************************************
// ***************** Controller Bitacora Oportunidad **********************
// ************************************************************************

const getNotasCompletasOportunidad = async (idOportunidad) => {
  return (
    axios.get( myUrl + 'bitacorasOportunidad/NotasCompletasOportunidad/'+ idOportunidad , {
      headers : headersFormData
    }
    ).then(res => res.data)
    .catch(error => error)
  )
}


const getBitacorasByOportunidad = async (idOportunidad, etapaOportunidad) => {
  return (
    axios.get( myUrl + 'bitacorasOportunidad/BitacorasByOportunidad/'+ idOportunidad + '/'+ etapaOportunidad, {
      headers : headersFormData
    }
    ).then(res => res.data)
    .catch(error => error)
  )
}

const postNuevaBitacoraOportunidad = async (datosNuevaOportunidad) => {
  return (
    axios.post( myUrl + 'bitacorasOportunidad', 
      datosNuevaOportunidad, {
        headers : headersFormData
      }
    ).then(response => {
      return {"status":response.status, "data":response.data}
    }).catch(error => { 
      if (error.response.status == 400) {
        return {"status":400, "data":error.response.data.message}
      }
      return "ERROR"
    })
  )
}

const updateDatosBitacoraOportunidad = async (idBitacoraOportunidad, datosUpdate) => {
  return (
    axios.put( myUrl + 'bitacorasOportunidad/'+idBitacoraOportunidad, 
      datosUpdate,{
        headers : headersFormData
      }
      ).then(response => {
        return {"status":response.status, "data":response.data}  
      })
      .catch(error => { 
        if (error.response.status == 400) {
          return error.response.data.message
        }
        return "ERROR"
      })
  )
}

const deleteBitacoraOportunidad = async (idBitacoraOportunidad) => {
  return (
    axios.delete( myUrl + 'bitacorasOportunidad/'+idBitacoraOportunidad, 
      {
        headers : headersFormData
      }
    ).then(response => {
      return {"status":response.status, "data":response.data}  
    })
    .catch(error => error)
  )
}



// ************************************************************************
// ******************** Controller Meta Comercial *************************
// ************************************************************************

const getMisMetasComerciales = async (usuarioid) => {
  return (
    axios.get( myUrl + 'metaComercial/MisMetasComerciales/'+ usuarioid , {
      headers : headersFormData
    }
    ).then(res => res.data)
    .catch(error => error)
  )
}


const getMetasComerciales = async () => {
  return (
    axios.get( myUrl + 'metaComercial/MetasComerciales', {
      headers : headersFormData
    }
    ).then(res => res.data)
    .catch(error => error)
  )
}

const postMetaComercial = async (datosMetaComercial) => {
  return (
    axios.post( myUrl + 'metaComercial', 
      datosMetaComercial, {
        headers : headersFormData
      }
    ).then(response => {
      return {"status":response.status, "data":response.data}
    }).catch(error => { 
      if (error.response.status == 400) {
        return {"status":400, "data":error.response.data.message}
      }
      return "ERROR"
    })
  )
}

const updateMetaComercial = async (idMetaComercial, datosUpdate) => {
  return (
    axios.put( myUrl + 'metaComercial/'+idMetaComercial, 
      datosUpdate,{
        headers : headersFormData
      }
      ).then(response => {
        return {"status":response.status, "data":response.data}  
      })
      .catch(error => { 
        if (error.response.status == 400) {
          return error.response.data.message
        }
        return "ERROR"
      })
  )
}

const deleteMetaComercial = async (idMetaComercial) => {
  return (
    axios.delete( myUrl + 'metaComercial/'+idMetaComercial, 
      {
        headers : headersFormData
      }
    ).then(response => {
      return {"status":response.status, "data":response.data}  
    })
    .catch(error => error)
  )
}


// ************************************************************************
// *********************** Controller Graficos ****************************
// ************************************************************************

const getGraficoOportunidadEtapa = async () => {
  return (
    axios.get( myUrl + 'graficos/GraficoOportunidadesEtapa/' , {
      headers : headersFormData
    }
    ).then(res => res.data)
    .catch(error => error)
  )
}





// ************************************************************************
// ****************** Controller Eventos Calendario ***********************
// ************************************************************************

const getMisEventosCalendarioPorMes = async (usuarioid, mes) => {
  return (
    axios.get( myUrl + 'eventosCalendario/MisEventos/'+ usuarioid+'/'+mes , {
      headers : headersFormData
    }
    ).then(res => res.data)
    .catch(error => error)
  )
}

const getUsuariosInvitarEvento = async () => {
  return (
    axios.get( myUrl + 'eventosCalendario/UsuariosParaInvitar' , {
      headers : headersFormData
    }
    ).then(res => res.data)
    .catch(error => error)
  )
}

const getDetallesEventoCalendario = async (eventoIdRecibido, usuarioIdRecibido) => {
  return (
    axios.get( myUrl + 'eventosCalendario/DetallesEvento/'+eventoIdRecibido+'/'+usuarioIdRecibido, {
      headers : headersFormData
    }
    ).then(res => res.data)
    .catch(error => error)
  )
}

const postNuevoEventoCalendario = async (datosEventoCalendario) => {
  return (
    axios.post( myUrl + 'eventosCalendario', 
    JSON.stringify(datosEventoCalendario), {
        headers : headers
      }
    ).then(response => {
        // console.log(response)
        return {"status":response.status, "data":response.data}
    }).catch(error => { 
      if (error.response.status == 400) {
        console.log(error)
        return {"status":400, "data":error.response.data.message}
      }
        console.log(error)
        return "ERROR"
    })
  )
}

const postInvitarUsuariosEventoCalendario = async (datosEventoCalendario) => {
  return (
    axios.post( myUrl + 'eventosCalendario/InvitarUsuariosNuevoEvento', 
    JSON.stringify(datosEventoCalendario), {
        headers : headers
      }
    ).then(response => {
        return {"status":response.status, "data":response.data}
    }).catch(error => { 
      if (error.response.status == 400) {
        console.log(error)
        return {"status":400, "data":error.response.data.message}
      }
        console.log(error)
        return "ERROR"
    })
  )
}

const updateAceptarEvento = async (invitacionId, datosRespuestaEvento) => {
  return (
    axios.put( myUrl + 'eventosCalendario/AceptarEvento/'+invitacionId, 
      datosRespuestaEvento,{
        headers : headersFormData
      }
      ).then(response => {
        return {"status":response.status, "data":response.data}  
      })
      .catch(error => { 
        if (error.response.status == 400) {
          return error.response.data.message
        }
        return "ERROR"
      })
  )
}

const updateDenegarEvento = async (invitacionId, datosRespuestaEvento) => {
  return (
    axios.put( myUrl + 'eventosCalendario/DenegarEvento/'+invitacionId, 
      datosRespuestaEvento,{
        headers : headersFormData
      }
      ).then(response => {
        return {"status":response.status, "data":response.data}  
      })
      .catch(error => { 
        if (error.response.status == 400) {
          return error.response.data.message
        }
        return "ERROR"
      })
  )
}

const updateEventoCalendario = async (idEventoCalendario, datosEventoCalendario) => {
  return (
    axios.put( myUrl + 'eventosCalendario/'+idEventoCalendario, 
      JSON.stringify(datosEventoCalendario),{
        headers : headers
      }
      ).then(response => {
        return {"status":response.status, "data":response.data}  
      })
      .catch(error => { 
        if (error.response.status == 400) {
          return error.response.data.message
        }
        return "ERROR"
      })
  )
}

const deleteEventoCalendario = async (idEventoCalendario) => {
  return (
    axios.delete( myUrl + 'eventosCalendario/'+idEventoCalendario, 
      {
        headers : headersFormData
      }
    ).then(response => {
      return {"status":response.status, "data":response.data}  
    })
    .catch(error => error)
  )
}


// ************************************************************************
// ******************** Controller Tareas Usuario *************************
// ************************************************************************


const getMisTareasPersonales = async (IdUsuarioTareas) => {
  return (
    axios.get( myUrl + 'tareas/MisTareas/'+IdUsuarioTareas, {
      headers : headersFormData
    }
    ).then(response => {
      return {"status":response.status, "data":response.data}
    }).catch(error => { 
      return {"status":error.response.status, "data":error.response.data.message}
    })
  )
}

const getDescripcionTarea = async (IdTarea) => {
  return (
    axios.get( myUrl + 'tareas/'+IdTarea, {
      headers : headersFormData
    }
    ).then(response => {
      return {"status":response.status, "data":response.data}
    }).catch(error => { 
      return {"status":error.response.status, "data":error.response.data.message}
    })
  )
}


const postCrearNuevaTareaUsuario = async (datosNuevaTarea) => {
  return (
    axios.post( myUrl + 'tareas', datosNuevaTarea,{
      headers : headers
    }
    ).then(response => {
      return {"status":response.status, "data":response.data}
    }).catch(error => { 
      return {"status":error.response.status, "data":error.response.data.message}
    })
  )
}

const PutActualizarDatosTarea = async (idTarea, datosCambiarTarea) => {
  return (
    axios.put( myUrl + 'tareas/'+idTarea, datosCambiarTarea,{
      headers : headersFormData
    }
    ).then(response => {
      return {"status":response.status, "data":response.data}
    }).catch(error => { 
      return {"status":error.response.status, "data":error.response.data.message}
    })
  )
}

const PutCambiarEstadoTarea = async (idTarea, datosCambiarTarea) => {
  return (
    axios.put( myUrl + 'tareas/CambiarEstado/'+idTarea, datosCambiarTarea,{
      headers : headersFormData
    }
    ).then(response => {
      return {"status":response.status, "data":response.data}
    }).catch(error => { 
      return {"status":error.response.status, "data":error.response.data.message}
    })
  )
}

const PutCambiarPrioridadTarea = async (idTarea, datosCambiarTarea) => {
  return (
    axios.put( myUrl + 'tareas/CambiarPrioridad/'+idTarea, datosCambiarTarea,{
      headers : headersFormData
    }
    ).then(response => {
      return {"status":response.status, "data":response.data}
    }).catch(error => { 
      return {"status":error.response.status, "data":error.response.data.message}
    })
  )
}

const DeleteTareaActiva = async (IdTareaAtiva) => {
  return (
    axios.delete( myUrl + 'tareas/'+IdTareaAtiva, 
      {
        headers : headersFormData
      }
      ).then(response => {
        return {"status":response.status, "data":response.data}
      }).catch(error => { 
        return {"status":error.response.status, "data":error.response.data.message}
      })
  )
}

// ************************************************************************
// *************** Controller Desarrollo Tarea Usuario ********************
// ************************************************************************

const getMisComentariosTarea = async (IdTarea) => {
  return (
    axios.get( myUrl + 'desarrolloTarea/'+IdTarea, {
      headers : headersFormData
    }
    ).then(response => {
      return {"status":response.status, "data":response.data}
    }).catch(error => { 
      return {"status":error.response.status, "data":error.response.data.message}
    })
  )
}

const PostCrearNuevoComentarioTarea = async (datosNuevoComentario) => {
  return (
    axios.post( myUrl + 'desarrolloTarea', datosNuevoComentario,{
      headers : headersFormData
    }
    ).then(response => {
      return {"status":response.status, "data":response.data}
    }).catch(error => { 
      return {"status":error.response.status, "data":error.response.data.message}
    })
  )
}

const PutActualizarComentarioTarea = async (comentarioId, datosCambiarComentario) => {
  return (
    axios.put( myUrl + 'desarrolloTarea/'+comentarioId, datosCambiarComentario,{
      headers : headersFormData
    }
    ).then(response => {
      return {"status":response.status, "data":response.data}
    }).catch(error => { 
      return {"status":error.response.status, "data":error.response.data.message}
    })
  )
}

// ************************************************************************
// **************** Controller Notificaciones Usuario *********************
// ************************************************************************

const PutCambiarNotificacionLeida = async (notificacionId, datosCambiarNotificacion) => {
  return (
    axios.put( myUrl + 'notificaciones/CambiarNotificacionLeida/'+notificacionId, datosCambiarNotificacion,{
      headers : headersFormData
    }
    ).then(response => {
      return {"status":response.status, "data":response.data}
    }).catch(error => { 
      return {"status":error.response.status, "data":error.response.data.message}
    })
  )
}

const PutCambiarNotificacionMostrada = async (notificacionId, datosCambiarNotificacion) => {
  return (
    axios.put( myUrl + 'notificaciones/CambiarNotificacionMostrada/'+notificacionId, datosCambiarNotificacion,{
      headers : headersFormData
    }
    ).then(response => {
      return {"status":response.status, "data":response.data}
    }).catch(error => { 
      return {"status":error.response.status, "data":error.response.data.message}
    })
  )
}



export {
  getDatosBarra,
  getUserId,
  // USer
  getUser,
  getAllUser,
  postUser,
  updateUser,
  updateDatosPersonalesUsuario,
  updateCambioContraseñaPropioUsuario,
  deleteUser,
  getControlUser,
  getUserById,
  bloquearUsuario,
  // Usuarios Externos CardMaker
  getAllUserCardMaker,
  getUserExternosCardMakerById,
  postUserExternoCardMaker,
  updateUserExternoCardMaker,
  deleteUserExternoCardMaker,
  // Usuarios Externos FixuServices
  getAllUserFixYouWeb,
  getUserExternosFixYouWebById,
  postUserExternoFixYouWeb,
  updateUserExternoFixYouWeb,
  deleteUserExternoFixYouWeb,
  // Admin
  getUsuariosActivos,
  getTareasAsignadasUsuarios,
  getTareasPersonalesUsuarios,
  getTareasColaborativasUsuarios,
  getGraficosUsuarios,
  getGraficosEmpresa,
  getGraficosContactoByUser,
  getAsesoresActivos,
  getDatosAsesoresComercialesActivos,
  postAsignarNuevasCompaniasAsesor,
  // Sesion
  controlSesion,
  // Login ecuperar password
  validarCodigoRecuperarContraseña,
  validarCorreoUsuarioRecuperar,
  enviarCodigoRecuperarCorreoUsuario,
  cambioContraseñaCodigoValidado,
  // Company
  getAllMyCompanies,
  postCompany,
  postValidateCompany,
  getCompanybyID,
  getAllCompanies,
  getCompaniasSinSeguimiento,
  // postSearchCompany,
  deleteCompany,
  updateCompany,
  // Department
  getAllDepartement,
  // Sucursales
  getAllSucursales,
  getAllMySucursales,
  getSucursalbyID,
  getSucursalbyCompany,
  postSucursales,
  // postSearchContact,
  getFilterContactbyCompany,
  updateSucursales,
  deleteSucursal,
  // Carpetas
  getMyCarpetas,
  postCarpetas,
  updateCarpeta,
  deleteCarpeta,
  getCarpetasAdmin,
  getCarpetasByUser,
  // Documentos
  getMyDocumentos,
  getDocument,
  postDocumentos,
  uploadDocumentos,
  reloadDocumentos,
  deleteDocumentos,
  getDocumentosByUser,
  sharedDocument,
  updateDocumentos,
  getDocumentosToDownload,
  // RedesSociales
  getUserTargetPresentationViewers,
  getUserTargetPresentation,
  getUserRedesSociales,
  // GenerarCodigoQR,
  createCodeQR,
  saveCodeQR,
  getCodeQR,
  getCodeQRViewers,
  // Bitacora,
  getBitacoraByCompany,
  getCountDocumentBitacora,
  postBitacora,
  updateBitacora,
  deleteBitacora,
  //Tipos Bitacora,
  getTiposBitacora,
  //Documentos Bitacora,
  getMyDocumentosBitacora,
  postDocumentosBitacora,
  updateDocumentosBitacora,
  getDocumentosBitacoraToDownload, 
  deleteDocumentosBitacora,
  reloadDocumentosBitacora,
  //Servicios ITBF,
  getServiciosItbf,
  //Gestion Casos,
  getCasoByID,
  getCasosByCompany,
  postGestionCaso,
  deleteGestionCaso,
  updateGestionCaso,
  cambiarEstadoGestionCaso,
  //Observaciones Gestion Caso,
  getObservacionsByGestion,
  getTodasObservacionsPorGestion,
  getCountDocumentObservaciones,
  postObservacionGestion,
  updateObservacionGestion,
  deleteObservacionGestion,
  //Documento Gestion Caso,
  getDocumentosObservacionesGestion,
  postDocumentosObservacionesGestion,
  updateDocumentosObservacionesGestion,
  deleteDocumentosObservacionesGestion,
  getDocumentosObservacionToDownload,
  reloadDocumentosObservacionesGestion,
  // Gestion de Oportunidades
  getMisCompaniasGestionOportunidades,
  getMisOportunidadesGestion,
  getDetallesOportunidadById,
  postNuevaOportunidad,
  updateOportunidadCambioCompania,
  updateDetallesOportunidad,
  updateOportunidadCambioEstado,
  deleteMiOportunidad,
  // Bitacoras Oportunidad
  getNotasCompletasOportunidad,
  getBitacorasByOportunidad,
  postNuevaBitacoraOportunidad,
  updateDatosBitacoraOportunidad,
  deleteBitacoraOportunidad,
  // Meta Comercial
  getMisMetasComerciales,
  getMetasComerciales,
  postMetaComercial,
  updateMetaComercial,
  deleteMetaComercial,
  // Graficos
  getGraficoOportunidadEtapa,
  // Eventos Calendario
  getMisEventosCalendarioPorMes,
  getUsuariosInvitarEvento,
  getDetallesEventoCalendario,
  postNuevoEventoCalendario,
  postInvitarUsuariosEventoCalendario,
  updateEventoCalendario,
  updateAceptarEvento,
  updateDenegarEvento,
  deleteEventoCalendario,
  // Tareas Usuario
  getMisTareasPersonales,
  getDescripcionTarea,
  postCrearNuevaTareaUsuario,
  PutActualizarDatosTarea,
  PutCambiarEstadoTarea,
  PutCambiarPrioridadTarea,
  DeleteTareaActiva,
  // Desarrollo Tareas
  PostCrearNuevoComentarioTarea,
  getMisComentariosTarea,
  PutActualizarComentarioTarea,
  // Notificaciones
  PutCambiarNotificacionLeida,
  PutCambiarNotificacionMostrada,
};