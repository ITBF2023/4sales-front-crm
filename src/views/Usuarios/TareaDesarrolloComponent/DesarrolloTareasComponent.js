import React, { useLayoutEffect, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import Header from "../../../components/Headers/Header";
import { Card, CardBody, Col, Container, Modal, ModalBody, ModalFooter, ModalHeader, Row, Form, FormGroup, Label, Input, InputGroup, InputGroupText, FormFeedback } from "reactstrap";
import './DesarrolloTareasComponent.css'
import iconToDo from '../../../assets/images/desarrolloTareasComponent/To-do-list-icon.jpg'
import { Box, Button, Tooltip, Chip, Divider, CircularProgress} from "@mui/material";
import DataTable,  { defaultThemes }from 'react-data-table-component';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { PostCrearNuevoComentarioTarea, PutActualizarComentarioTarea, PutActualizarDatosTarea, PutCambiarEstadoTarea, PutCambiarPrioridadTarea, getDescripcionTarea, getMisComentariosTarea, getUserId } from "../../../Controller/Controller";
import ReportIcon from '@mui/icons-material/Report';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
// import moment from "moment";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import moment from "moment";

const DesarrolloTareasComponent = () =>{
  
  const tareaIdParametro = useParams()
  const [datosTarea, setDatosTarea] = useState({})
  
  // const [fechaActual] = useState(moment(new Date(Date.now())).format("YYYY-MM-DD"))
  const [tituloTarea, setTituloTarea] = useState("") 
  const [descripcionTarea, setDescripcionTarea] = useState("")
  const [prioridadTarea, setPrioridadTarea] = useState("null")
  const [estadoTarea, setEstadoTarea] = useState("null")
  // const [fechaInicioTarea, setFechaInicioTarea] = useState(fechaActual)
  // const [fechaFinTarea, setFechaFinTarea] = useState(fechaActual)

  const [modalEditarTarea, setModalEditarTarea] = useState(false)
  const [modalCambiarPrioridad, setModalCambiarPrioridad] = useState(false)
  const [modalCambiarEstado, setModalCambiarEstado] = useState(false)
  const [modalCrearComentario, setModalCrearComentario] = useState(false)
  const [modalEditarComentario, setModalEditarComentario] = useState(false)
  
  const [data, setData] = useState([])

  const [comentarioTarea, setComentarioTarea] = useState("")

  const ObtenerDatosDescripcionTarea = async() =>{
    var datosObtenidos = await getDescripcionTarea(tareaIdParametro.id)
    if(datosObtenidos.status === 200){
      setDatosTarea(datosObtenidos.data)
      setTituloTarea(datosObtenidos.data.titulo)
      setDescripcionTarea(datosObtenidos.data.descripcion)
      // setEstadoTarea(datosObtenidos.data.estado)
      // setPrioridadTarea(datosObtenidos.data.prioridad)
      // setFechaInicioTarea(datosObtenidos.data.fechaInicio)
      // setFechaFinTarea(datosObtenidos.data.fechaFin)
    }else{
      alert(` Error, ${datosObtenidos.status} \n Ocurrio un Problema: ${datosObtenidos.data}`)
      setDatosTarea({})
    }
  }

  const ObtenerComentariosMiTarea = async() =>{
    const misComentarios = await getMisComentariosTarea(tareaIdParametro.id)
    if(misComentarios.status === 200){
      console.log(misComentarios)
      setData(misComentarios.data)
    }else{
      alert(` Error, ${misComentarios.status} \n Ocurrio un Problema: ${misComentarios.data}`)
    }
  }

  const CambiarPrioridadTarea = async() =>{
    var datosEnviar = new FormData();
    datosEnviar.append("PrioridadTarea", prioridadTarea)
    datosEnviar.append("Comentario", comentarioTarea)
    datosEnviar.append("UsuarioId", getUserId())

    const cambiar = await PutCambiarPrioridadTarea(tareaIdParametro.id, datosEnviar)
    if(cambiar.status === 201){
      alert(`Realizado: ${cambiar.data.message}`)
      AbrilModalCambiarPrioridadTarea()
      ObtenerDatosDescripcionTarea()
      ObtenerComentariosMiTarea()
    }else{
      alert(` Error, ${cambiar.status} \n Ocurrio un Problema: ${cambiar.data}`)
    }
    setBotonCambioPrioridad(false)
  }

  const CambiarEstadoTarea = async() =>{
    var datosEnviar = new FormData();
    datosEnviar.append("EstadoTarea", estadoTarea)
    datosEnviar.append("Comentario", comentarioTarea)
    datosEnviar.append("UsuarioId", getUserId())

    const cambiar = await PutCambiarEstadoTarea(tareaIdParametro.id, datosEnviar)
    if(cambiar.status === 201){
      alert(`Realizado: ${cambiar.data.message}`)
      AbrilModalCambiarEstadoTarea()
      ObtenerDatosDescripcionTarea()
      ObtenerComentariosMiTarea()
    }else{
      alert(` Error, ${cambiar.status} \n Ocurrio un Problema: ${cambiar.data}`)
    }
    setBotonCambioEstado(false)
  }

  const CrearNuevoComentarioTarea = async() =>{
    var ComentarioNuevo = new FormData();
    ComentarioNuevo.append("Comentario",comentarioTarea)
    ComentarioNuevo.append("Estado",datosTarea.estado)
    ComentarioNuevo.append("UsuarioId", getUserId())
    ComentarioNuevo.append("TareaId",tareaIdParametro.id)

    const crearComentario = await PostCrearNuevoComentarioTarea(ComentarioNuevo)
    if(crearComentario.status === 201){
      alert(`Realizado: ${crearComentario.data.message}`)
      AbrirModalCrearComentario()
      ObtenerComentariosMiTarea()
    }else{
      alert(` Error, ${crearComentario.status} \n Ocurrio un Problema: ${crearComentario.data}`)
    }
    setBotonCrearComentario(false)
  }

  const [cambioEstadoValido, setCambioEstadoValido] = useState(false)
  const [botonCambioEstado, setBotonCambioEstado] = useState(false)

  const [cambioPrioridadValido, setCambioPrioridadValido] = useState(false)
  const [botonCambioPrioridad, setBotonCambioPrioridad] = useState(false)

  const [comentarioTareaValido, setComentarioValido] = useState(false)
  const [botonCrearComentario, setBotonCrearComentario] = useState(false)

  const [editarComentarioValido, setEditarComentarioValido] = useState(false)
  const [botonEditarComentario, setBotonEditarComentario] = useState(false)
  const [comentarioEditarId, setComentarioEditarId] = useState("")

  const [cambioTituloValido, setCambioTituloValido] = useState(false)
  const [cambioDescripcionValido, setCambioDescripcionValido] = useState(false)
  const [botonCambiarDetallesTarea, setBotonCambiarDetallesTarea] = useState(false)

  const ValidarCambioEstadoTarea = () => {
    if(cambioEstadoValido && comentarioTareaValido){
      setBotonCambioEstado(true)
      CambiarEstadoTarea()
    }
  }

  const ValidarSeleccionarEstadoTarea = (estadoRecibido) =>{
    setEstadoTarea(estadoRecibido)
    if(estadoRecibido === "null"){
      setCambioEstadoValido(false)
    }else{
      setCambioEstadoValido(true)
    }
  }

  const ValidarCambioPrioridadTarea = () => {
    if(cambioPrioridadValido && comentarioTareaValido){
      setBotonCambioPrioridad(true)
      CambiarPrioridadTarea()
    }
  }

  const ValidarSeleccionarPrioridadTarea = (prioridadRecibida) =>{
    setPrioridadTarea(prioridadRecibida)
    if(prioridadRecibida === "null"){
      setCambioPrioridadValido(false)
    }else{
      setCambioPrioridadValido(true)
    }
  }

  const ValidarCrearNuevoComentario = () =>{
    if(comentarioTareaValido){
      setBotonCrearComentario(true)
      CrearNuevoComentarioTarea()
    }
  }

  const ValidarComentarioTarea = (comentarioRecibido) =>{
    setComentarioTarea(comentarioRecibido)
    if(comentarioRecibido.trim().length === 0){
      setComentarioValido(false)
    }else{
      setComentarioValido(true)
    }
  }

  const ValidarCambioComentario = (comentarioEditadoRecibido) => {
    setComentarioTarea(comentarioEditadoRecibido)
    if(comentarioEditadoRecibido.trim().length === 0){
      setEditarComentarioValido(false)
    }else{
      setEditarComentarioValido(true)
    }
  }

  const GuardarComentarioEditadoValido = async() => {
    if(editarComentarioValido){
      setBotonEditarComentario(true)
      var datosEditado = new FormData();
      datosEditado.append("Descripcion",comentarioTarea)

      const editarComenta = await PutActualizarComentarioTarea(comentarioEditarId, datosEditado)
      if(editarComenta.status === 201){
        alert(`Realizado: ${editarComenta.data.message}`)
        CerrarModalEditarComentario()
        ObtenerComentariosMiTarea()
      }else{
        alert(` Error, ${editarComenta.status} \n Ocurrio un Problema: ${editarComenta.data}`)
      }
      setBotonEditarComentario(false)
    }
  }

  const ValidarTituloTarea = (tituloRecibido) =>{
    setTituloTarea(tituloRecibido)
    if(tituloRecibido.trim().length === 0){
      setCambioTituloValido(false)
    }else{
      setCambioTituloValido(true)
    }
  }

  const ValidarDescripcionTarea = (descripcionRecibida) =>{
    setDescripcionTarea(descripcionRecibida)
    if(descripcionRecibida.trim().length === 0){
      setCambioDescripcionValido(false)
    }else{
      setCambioDescripcionValido(true)
    }
  }

  const GuardarCambiosTituloDescripcionValidos = async() =>{
    if(cambioDescripcionValido && cambioTituloValido){
      setBotonCambiarDetallesTarea(true)
      var cambiosDetalles = new FormData();
      cambiosDetalles.append("Titulo", tituloTarea)
      cambiosDetalles.append("Descripcion", descripcionTarea)

      const guardarCambio = await PutActualizarDatosTarea(tareaIdParametro.id, cambiosDetalles)
      if(guardarCambio.status === 201){
        alert(`Realizado: ${guardarCambio.data.message}`)
        AbrilModalEditarDetallesTarea()
        ObtenerDatosDescripcionTarea()
      }else{
        alert(` Error, ${guardarCambio.status} \n Ocurrio un Problema: ${guardarCambio.data}`)
      }
      setBotonCambiarDetallesTarea(false)
    }
  }

  const customStyles = {
    header: {
      style: {
        minHeight: '56px',
      },
    },
    headRow: {
      style: {
        borderTopStyle: 'solid',
        borderTopWidth: '1px',
        borderTopColor: defaultThemes.default.divider.default,
      },
    },
    headCells: {
      style: {
        '&:not(:last-of-type)': {
          borderRightStyle: 'solid',
          borderRightWidth: '1px',
          borderRightColor: defaultThemes.default.divider.default,
        },
      },
    },
    cells: {
      style: {
        '&:not(:last-of-type)': {
          borderRightStyle: 'solid',
          borderRightWidth: '1px',
          borderRightColor: defaultThemes.default.divider.default,
        },
      },
    },
  };

  const columns = [
    {
      name: 'Secuencia',
      selector: row => row.secuencia,
      grow: 0,
      sortable: true,
      center: true,
      cell: row => <div className="observaciones-tabla">{row.secuencia}</div>
    },
    {
      name: 'Descripcion',
      selector: row => row.descripcion,
      wrap: true,
      grow: 2,
      cell: row => <Tooltip title={row.descripcion} arrow followCursor><div className="observaciones-tabla descripcion-observacion">{row.descripcion}</div></Tooltip>
    },
    {
      name: 'Estado',
      selector: row => row.estado,
      sortable: true,
      center: true,
      cell: row => <div className="observaciones-tabla">{row.estado}</div>
    },
    {
      name: 'Fecha Creación',
      selector: row => row.fechaCreacion,
      center: true,
      // grow: 0.8,
      sortable: true,
      cell: row => <div className="observaciones-tabla fecha-creacion-observacion" >{moment(row.fechaCreacion).format("DD MMM YYYY")}</div>
    },
    {
      name: 'Creador',
      selector: row => row.usuarioCreadorNombre,
      sortable: true,
      grow: 1,
      center: true,
      cell: row => <div className="observaciones-tabla">{row.usuarioCreadorNombre}</div>
    },
    {
      name: 'Acciones',
      selector: row => row.estado,
      sortable: true,
      grow: 0.5,
      center: true,
      cell: row => <div className="observaciones-tabla">
        <Tooltip title={"Editar Nota"} arrow followCursor>
          <Button variant="outlined" sx={{minWidth:"10px", padding:'2px'}}
            onClick={() => AbrirModalEditarComentario(row.descripcion, row.desarrolloId)}>
            <EditNoteIcon></EditNoteIcon>
          </Button>
        </Tooltip>
      </div>
    },
  ];

  const paginationComponentOptions = {
    rowsPerPageText: 'Filas por página',
    rangeSeparatorText: 'de',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Todos',
  };

  // const data = [
  //   {
  //     id: 1,
  //     titulo: 'Beetlejuice',
  //     descripcion: 'Esta tarea se creo en 1981, Esta tarea se creo en 1981 Esta tarea se creo en 1981 Esta tarea se creo en 1981 Esta tarea se creo en 1981',
  //     prioridad: 'Alta',
  //     estado: 'Listo',
  //     usuarioEncargado: 'Jilmer Mayta',
  //     fechaInicio: '27 oct. 2023',
  //     fechaActualizacion: '27 oct. 2023',
  //   },
  //   {
  //     id: 2,
  //     titulo: 'Beetlejuice',
  //     descripcion: 'Esta tarea se creo en 1981, Esta tarea se creo en 1981, ',
  //     prioridad: 'Baja',
  //     estado: 'En curso',
  //     usuarioEncargado: 'Jilmer Mayta',
  //     fechaInicio: '27 oct. 2023',
  //     fechaActualizacion: '27 oct. 2023',
  //   },
  //   {
  //     id: 3,
  //     titulo: 'Beetlejuice',
  //     descripcion: 'Esta tarea se creo en 1981, Esta tarea se creo en 1981, ',
  //     prioridad: 'Critica',
  //     estado: 'No iniciado',
  //     usuarioEncargado: 'Jilmer Mayta',
  //     fechaInicio: '27 oct. 2023',
  //     fechaActualizacion: '27 oct. 2023',
  //   },
  //   {
  //     id: 4,
  //     titulo: 'Beetlejuice',
  //     descripcion: 'Esta tarea se creo en 1981, Esta tarea se creo en 1981, ',
  //     prioridad: 'Media',
  //     estado: 'Detenido',
  //     usuarioEncargado: 'Jilmer Mayta',
  //     fechaInicio: '27 oct. 2023',
  //     fechaActualizacion: '27 oct. 2023',
  //   },
  //   {
  //     id: 5,
  //     titulo: 'Beetlejuice',
  //     descripcion: 'Esta tarea se creo en 1981, Esta tarea se creo en 1981, ',
  //     prioridad: 'Alta',
  //     estado: 'En curso',
  //     usuarioEncargado: 'Jilmer Mayta',
  //     fechaInicio: '27 oct. 2023',
  //     fechaActualizacion: '27 oct. 2023',
  //   },
  //   {
  //     id: 6,
  //     titulo: 'Beetlejuice',
  //     descripcion: 'Esta tarea se creo en 1981, Esta tarea se creo en 1981, ',
  //     prioridad: 'Alta',
  //     estado: 'No iniciado',
  //     usuarioEncargado: 'Jilmer Mayta',
  //     fechaInicio: '27 oct. 2023',
  //     fechaActualizacion: '27 oct. 2023',
  //   },
  //   {
  //     id: 7,
  //     titulo: 'Beetlejuice',
  //     descripcion: 'Esta tarea se creo en 1981, Esta tarea se creo en 1981, ',
  //     prioridad: 'Media',
  //     estado: 'Listo',
  //     usuarioEncargado: 'Jilmer Mayta',
  //     fechaInicio: '27 oct. 2023',
  //     fechaActualizacion: '27 oct. 2023',
  //   },
  //   {
  //     id: 8,
  //     titulo: 'Beetlejuice',
  //     descripcion: 'Esta tarea se creo en 1981, Esta tarea se creo en 1981, ',
  //     prioridad: 'Critica',
  //     estado: 'No iniciado',
  //     usuarioEncargado: 'Jilmer Mayta',
  //     fechaInicio: '27 oct. 2023',
  //     fechaActualizacion: '27 oct. 2023',
  //   },
  //   {
  //     id: 9,
  //     titulo: 'Beetlejuice',
  //     descripcion: 'Esta tarea se creo en 1981, Esta tarea se creo en 1981 Esta tarea se creo en 1981 Esta tarea se creo en 1981 Esta tarea se creo en 1981',
  //     prioridad: 'Alta',
  //     estado: 'Listo',
  //     usuarioEncargado: 'Jilmer Mayta',
  //     fechaInicio: '27 oct. 2023',
  //     fechaActualizacion: '27 oct. 2023',
  //   },
  //   {
  //     id: 10,
  //     titulo: 'Beetlejuice',
  //     descripcion: 'Esta tarea se creo en 1981, Esta tarea se creo en 1981, ',
  //     prioridad: 'Baja',
  //     estado: 'En curso',
  //     usuarioEncargado: 'Jilmer Mayta',
  //     fechaInicio: '27 oct. 2023',
  //     fechaActualizacion: '27 oct. 2023',
  //   },
  //   {
  //     id: 11,
  //     titulo: 'Beetlejuice',
  //     descripcion: 'Esta tarea se creo en 1981, Esta tarea se creo en 1981, ',
  //     prioridad: 'Critica',
  //     estado: 'No iniciado',
  //     usuarioEncargado: 'Jilmer Mayta',
  //     fechaInicio: '27 oct. 2023',
  //     fechaActualizacion: '27 oct. 2023',
  //   },
  //   {
  //     id: 12,
  //     titulo: 'Beetlejuice',
  //     descripcion: 'Esta tarea se creo en 1981, Esta tarea se creo en 1981, ',
  //     prioridad: 'Media',
  //     estado: 'Detenido',
  //     usuarioEncargado: 'Jilmer Mayta',
  //     fechaInicio: '27 oct. 2023',
  //     fechaActualizacion: '27 oct. 2023',
  //   },
  //   {
  //     id: 13,
  //     titulo: 'Beetlejuice',
  //     descripcion: 'Esta tarea se creo en 1981, Esta tarea se creo en 1981, ',
  //     prioridad: 'Alta',
  //     estado: 'En curso',
  //     usuarioEncargado: 'Jilmer Mayta',
  //     fechaInicio: '27 oct. 2023',
  //     fechaActualizacion: '27 oct. 2023',
  //   },
  //   {
  //     id: 14,
  //     titulo: 'Beetlejuice',
  //     descripcion: 'Esta tarea se creo en 1981, Esta tarea se creo en 1981, ',
  //     prioridad: 'Alta',
  //     estado: 'No iniciado',
  //     usuarioEncargado: 'Jilmer Mayta',
  //     fechaInicio: '27 oct. 2023',
  //     fechaActualizacion: '27 oct. 2023',
  //   },
  //   {
  //     id: 15,
  //     titulo: 'Beetlejuice',
  //     descripcion: 'Esta tarea se creo en 1981, Esta tarea se creo en 1981, ',
  //     prioridad: 'Media',
  //     estado: 'Listo',
  //     usuarioEncargado: 'Jilmer Mayta',
  //     fechaInicio: '27 oct. 2023',
  //     fechaActualizacion: '27 oct. 2023',
  //   },
  //   {
  //     id: 16,
  //     titulo: 'Beetlejuice',
  //     descripcion: 'Esta tarea se creo en 1981, Esta tarea se creo en 1981, ',
  //     prioridad: 'Critica',
  //     estado: 'No iniciado',
  //     usuarioEncargado: 'Jilmer Mayta',
  //     fechaInicio: '27 oct. 2023',
  //     fechaActualizacion: '27 oct. 2023',
  //   },
  // ]

  useLayoutEffect(() =>{
    ObtenerDatosDescripcionTarea()
    ObtenerComentariosMiTarea()
  },[])

  const ContenedorTitulo = () =>{
    return(
      <Row className="row-cabecera-tabla">
        <Col sm={6}>
        <div className="tabla-titulo">Observaciones</div>
        </Col>
        <Col sm={6}>
        <Button onClick={AbrirModalCrearComentario} className="button-add-comentario" variant="outlined" startIcon={<AddCircleOutlineIcon/>}> Agregar comentario</Button>
        </Col>
      </Row>
    )
  }

  const AbrilModalEditarDetallesTarea = () =>{
    setModalEditarTarea(!modalEditarTarea)
    setCambioTituloValido(true)
    setCambioDescripcionValido(true)
    setBotonCambiarDetallesTarea(false)
  }

  const AbrilModalCambiarPrioridadTarea = () =>{
    setModalCambiarPrioridad(!modalCambiarPrioridad)
    setComentarioTarea("")
    setComentarioValido(false)
    setPrioridadTarea("null")
    setCambioPrioridadValido(false)
    setBotonCambioPrioridad(false)
  }

  const AbrilModalCambiarEstadoTarea = () =>{
    setModalCambiarEstado(!modalCambiarEstado)
    setComentarioTarea("")
    setEstadoTarea("null")
    setCambioEstadoValido(false)
    setComentarioValido(false)
    setBotonCambioEstado(false)
  }

  const AbrirModalCrearComentario = () => {
    setModalCrearComentario(!modalCrearComentario)
    setComentarioTarea("")
    setComentarioValido(false)
  }

  const AbrirModalEditarComentario = (comentarioRecibido, comentarioId) =>{
    setComentarioTarea(comentarioRecibido)
    setEditarComentarioValido(true)
    setBotonEditarComentario(false)
    setComentarioEditarId(comentarioId)
    setModalEditarComentario(true)
  }
  const CerrarModalEditarComentario = () =>{
    setComentarioTarea("")
    setComentarioEditarId("")
    setModalEditarComentario(false)
    setEditarComentarioValido(false)
    setBotonEditarComentario(true)
  }

  return(
    <>
    <Header></Header>
    <Container className="mt-3" fluid>
      <Row>
        <Col xl={4}>
          <Card className="card-detalles-tarea"> 
            <CardBody>
              <Row>
                <Col xl={12} lg="2"className="">
                  <div className="contenedor-imagen-icon-todo">
                    <Tooltip title="Editar detalles tarea" arrow followCursor>
                      <img src={iconToDo} alt="to-do-list-icon" className="imagen-to-do-list" onClick={AbrilModalEditarDetallesTarea}></img>
                    </Tooltip>
                  </div>
                </Col>
                <Col xl={12} lg={4} md={4} sm={4}>
                  <h2>Titulo</h2>
                  <p className="titulo-tarea">{datosTarea.titulo ?? ""}</p>
                  <h2>Descripcion</h2>
                  {/* <p>Titulo de mi primera tarea</p> */}
                  <Tooltip title={datosTarea.descripcion} arrow followCursor>
                    <div className="contenedor-descripcion-tarea">
                      <p>{datosTarea.descripcion ?? ""}</p>
                    </div>
                  </Tooltip>
                </Col>
                <Col xl={12} lg="3" md={4} sm={4}>
                  <h2>Estado Actual</h2>
                  <Box className={"tiempo-desarrollo-tarea"}>
                    <div className="contenedor-estado-actual-tarea">
                      <div className="estado-actual-tarea">
                        <div>{datosTarea.estado ?? ""}</div>
                      </div>
                      <Tooltip title="Cambiar estado actual" arrow>
                        <Button onClick={AbrilModalCambiarEstadoTarea} className="button-cambiar-estado-tarea mostrar-cambiar-estado"><EditNoteIcon></EditNoteIcon></Button>
                      </Tooltip>
                    </div>
                  </Box>
                  <h2>Encargado</h2>
                  <Box className={"tiempo-desarrollo-tarea"}>
                    <div className="encargado-tarea">
                      <div>
                        <img src={"Images/Users/"+ datosTarea.usuarioEncargadoImagen}></img>
                      </div>
                      <div>
                        <div className="prueba-tareas">
                          {datosTarea.usuarioEncargadoNombre}
                        </div>
                      </div>
                    </div>
                  </Box>
                  
                </Col>
                <Col xl={12} lg={3} md={4} sm={4}>
                  <h2>Prioridad</h2>
                  <Box className={"prioridad-tarea"}>
                    <div className="contenedor-prioridad-actual-tarea">
                      <div className={"descripcion-prioridad-tarea prioridad-"+datosTarea.prioridad}>
                        <div>{datosTarea.prioridad}</div>
                        <div>{datosTarea.prioridad == "Critica" ? <ReportIcon sx={{fontSize:'20px', marginLeft:'5px'}}/>:(datosTarea.prioridad=="Alta"?<WarningAmberIcon sx={{fontSize:'20px', marginLeft:'5px'}}/>:<></>)}</div>
                      </div>
                      <Tooltip title="Cambiar prioridad actual" arrow>
                        <Button onClick={AbrilModalCambiarPrioridadTarea} className="button-cambiar-estado-tarea mostrar-cambiar-prioridad"><EditNoteIcon></EditNoteIcon></Button>
                      </Tooltip>
                    </div>
                  </Box>
                  
                  <h2>Tiempo Asignado</h2>
                  <Box className={"tiempo-desarrollo-tarea"}>
                    <div className="estimado-desarrollo-tarea">
                      <div>{datosTarea.tiempoAsignado}</div>
                    </div>
                  </Box>
                  {/* <span>{"Descripcion Tarea"}</span> */}
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
        <Col xl={8}>
          <Card className="card-detalles-tarea">
            <CardBody>
              <DataTable className="tabla-observaciones-tarea" 
                title={<ContenedorTitulo/>}
                columns={columns}
                data={data}
                pagination 
                paginationComponentOptions={paginationComponentOptions}
                customStyles={customStyles}
                // fixedHeader
                // fixedHeaderScrollHeight="550px"
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
    <Modal isOpen={modalEditarTarea} className="modal-editar-detalles-tarea">
      <ModalHeader className="modal-header"> Modifica los detalles de la tarea </ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup row>
            <Label sm={3}>Titulo</Label>
            <Col sm={9}>
              <InputGroup>
                <Input valid={cambioTituloValido} invalid={!cambioTituloValido} type="text" 
                  placeholder="Ingrese el titulo de la tarea" value={tituloTarea} onChange={(e) => ValidarTituloTarea(e.target.value)}></Input>
                <InputGroupText className={"input-icon input-cambio-"+(cambioTituloValido ? "valido" : "invalido")}>
                  {cambioTituloValido ? <CheckCircleOutlineIcon sx={{ fontSize: 23 }}/> : <HighlightOffIcon sx={{ fontSize: 23 }}/>}
                </InputGroupText>
              </InputGroup>
              <Label className={"label-cambio-"+(cambioTituloValido ? "valido" : "invalido")}>El titulo no puede estar vacio</Label>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label sm={3}>Descripcion</Label>
            <Col sm={9}>
              <InputGroup>
                <Input valid={cambioDescripcionValido} invalid={!cambioDescripcionValido} type="textarea"
                  placeholder="Ingrese la descripcion de la tarea" value={descripcionTarea} onChange={(e) => ValidarDescripcionTarea(e.target.value)}></Input>
                <InputGroupText className={"input-icon input-cambio-"+(cambioDescripcionValido ? "valido" : "invalido")}>
                  {cambioDescripcionValido ? <CheckCircleOutlineIcon sx={{ fontSize: 23 }}/> : <HighlightOffIcon sx={{ fontSize: 23 }}/>}
                </InputGroupText>
              </InputGroup>
              <Label className={"label-cambio-"+(cambioDescripcionValido ? "valido" : "invalido")}>La descricion no puede estar vacia</Label>
            </Col>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter className="modal-footer">
        <Button variant="contained" className="button-acciones-footer" disabled={botonCambiarDetallesTarea} 
        onClick={() => GuardarCambiosTituloDescripcionValidos()}>
          <div>Guardar</div>
          {botonCambiarDetallesTarea ? <CircularProgress sx={{marginLeft:'8px'}} size={20} color="inherit"></CircularProgress> : <></>}
        </Button>
        <Button variant="outlined" className="button-acciones-footer" onClick={AbrilModalEditarDetallesTarea}>Cancelar</Button>
      </ModalFooter>
    </Modal>

    <Modal isOpen={modalCambiarEstado} className="modal-editar-detalles-tarea">
      <ModalHeader className="modal-header"> Cambiar el estado de la tarea </ModalHeader>
      <ModalBody className="modal-body">
        <Form>
          <FormGroup row >
            <Label sm={3}>Estado:</Label>
            <Col sm={9} className="local-bootstrap">
              <InputGroup>
                <Input valid={cambioEstadoValido} invalid={!cambioEstadoValido} type="select"
                 defaultValue={estadoTarea} onChange={(e) => ValidarSeleccionarEstadoTarea(e.target.value)}>
                  <option value={"null"}>
                    Seleccionada un estado
                  </option>
                  <option value={"En curso"}>
                    En curso
                  </option>
                  <option value={"Culminado"}>
                    Culminado
                  </option>
                  <option value={"Detenido"}>
                    Detenido
                  </option>
                </Input>
                <InputGroupText className={"input-icon input-cambio-"+(cambioEstadoValido ? "valido" : "invalido")}>
                  {cambioEstadoValido ? <CheckCircleOutlineIcon sx={{ fontSize: 23 }}/> : <HighlightOffIcon sx={{ fontSize: 23 }}/>}
                </InputGroupText>
              </InputGroup>
              <Label className={"label-cambio-"+(cambioEstadoValido ? "valido" : "invalido")}>Debes seleccionar un estado</Label>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label sm={3}>Comentario:</Label>
            <Col sm={9}>
              <InputGroup className="input-group-comentario">
                <Input className="input-comentario-textarea" valid={comentarioTareaValido} invalid={!comentarioTareaValido} type="textarea" 
                placeholder="Debes ingresar un comentario para realizar el cambio de estado" value={comentarioTarea} 
                onChange={(e) => ValidarComentarioTarea(e.target.value)}></Input>
                <InputGroupText className={"input-icon input-cambio-"+(comentarioTareaValido ? "valido" : "invalido")}>
                  {comentarioTareaValido ? <CheckCircleOutlineIcon sx={{ fontSize: 23 }}/> : <HighlightOffIcon sx={{ fontSize: 23 }}/>}
                </InputGroupText>
              </InputGroup>
              {/* <FormFeedback tooltip>Oh no!</FormFeedback> */}
              <Label className={"label-cambio-"+(comentarioTareaValido ? "valido" : "invalido")}>Debes ingresar un comentario</Label>
            </Col>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter className="modal-footer">
        <Button variant="contained" className="button-acciones-footer" disabled={botonCambioEstado} 
        onClick={() => ValidarCambioEstadoTarea()}>
          <div>Guardar</div>
          {botonCambioEstado ? <CircularProgress sx={{marginLeft:'8px'}} size={20} color="inherit"></CircularProgress> : <></>}
        </Button>
        <Button variant="outlined" className="button-acciones-footer" onClick={AbrilModalCambiarEstadoTarea}>Cancelar</Button>
      </ModalFooter>
    </Modal>

    <Modal isOpen={modalCambiarPrioridad} className="modal-editar-detalles-tarea">
      <ModalHeader className="modal-header">Cambiar prioridad de la tarea </ModalHeader>
      <ModalBody className="modal-body">
        <Form>
          <FormGroup row>
            <Label sm={3}>Prioridad</Label>
            <Col sm={9}>
              <InputGroup className="input-group-comentario">
                <Input valid={cambioPrioridadValido} invalid={!cambioPrioridadValido} type="select" 
                 defaultValue={prioridadTarea} onChange={(e) => ValidarSeleccionarPrioridadTarea(e.target.value)}>
                  <option value={"null"}>
                    Seleccionada una prioridad
                  </option>
                  <option value={"Baja"}>
                    Baja
                  </option>
                  <option value={"Media"}>
                    Media
                  </option>
                  <option value={"Alta"}>
                    Alta
                  </option>
                  <option value={"Critica"}>
                    Critica
                  </option>
                </Input>
                <InputGroupText className={"input-icon input-cambio-"+(cambioPrioridadValido ? "valido" : "invalido")}>
                  {cambioPrioridadValido ? <CheckCircleOutlineIcon sx={{ fontSize: 23 }}/> : <HighlightOffIcon sx={{ fontSize: 23 }}/>}
                </InputGroupText>
              </InputGroup>
              <Label className={"label-cambio-"+(cambioPrioridadValido ? "valido" : "invalido")}>Debes seleccionar una prioridad</Label>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label sm={3}>Comentario:</Label>
            <Col sm={9}>
              <InputGroup className="input-group-comentario">
                <Input className="input-comentario-textarea" valid={comentarioTareaValido} invalid={!comentarioTareaValido} type="textarea" 
                placeholder="Debes ingresar un comentario para realizar el cambio de estado" value={comentarioTarea} 
                onChange={(e) => ValidarComentarioTarea(e.target.value)}></Input>
                <InputGroupText className={"input-icon input-cambio-"+(comentarioTareaValido ? "valido" : "invalido")}>
                  {comentarioTareaValido ? <CheckCircleOutlineIcon sx={{ fontSize: 23 }}/> : <HighlightOffIcon sx={{ fontSize: 23 }}/>}
                </InputGroupText>
              </InputGroup>
              {/* <FormFeedback tooltip>Oh no!</FormFeedback> */}
              <Label className={"label-cambio-"+(comentarioTareaValido ? "valido" : "invalido")}>Debes ingresar un comentario</Label>
            </Col>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter className="modal-footer">
        <Button variant="contained" className="button-acciones-footer"
        onClick={() => ValidarCambioPrioridadTarea()} disabled={botonCambioPrioridad}>
          <div>Guardar</div>
          {botonCambioPrioridad ? <CircularProgress sx={{marginLeft:'8px'}} size={20} color="inherit"></CircularProgress> : <></>}
        </Button>
        <Button variant="outlined" className="button-acciones-footer" onClick={AbrilModalCambiarPrioridadTarea}>Cancelar</Button>
      </ModalFooter>
    </Modal>
    <Modal isOpen={modalCrearComentario} className="modal-editar-detalles-tarea">
      <ModalHeader className="modal-header"> Agregar nuevo comentario </ModalHeader>
      <ModalBody className="modal-body">
        <Form>
        <FormGroup row>
            <Label sm={3}>Comentario:</Label>
            <Col sm={9}>
              <InputGroup className="input-group-comentario">
                <Input className="input-comentario-textarea" valid={comentarioTareaValido} invalid={!comentarioTareaValido} type="textarea" 
                placeholder="Debes ingresar un comentario para realizar el cambio de estado" value={comentarioTarea} 
                onChange={(e) => ValidarComentarioTarea(e.target.value)}></Input>
                <InputGroupText className={"input-icon input-cambio-"+(comentarioTareaValido ? "valido" : "invalido")}>
                  {comentarioTareaValido ? <CheckCircleOutlineIcon sx={{ fontSize: 23 }}/> : <HighlightOffIcon sx={{ fontSize: 23 }}/>}
                </InputGroupText>
              </InputGroup>
              {/* <FormFeedback tooltip>Oh no!</FormFeedback> */}
              <Label className={"label-cambio-"+(comentarioTareaValido ? "valido" : "invalido")}>Debes ingresar un comentario</Label>
            </Col>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter className="modal-footer">
        <Button variant="contained" className="button-acciones-footer"
        onClick={() => ValidarCrearNuevoComentario()} disabled={botonCrearComentario}>
          <div>Agregar</div>
          {botonCrearComentario ? <CircularProgress sx={{marginLeft:'8px'}} size={20} color="inherit"></CircularProgress> : <></>}
        </Button>
        <Button variant="outlined" className="button-acciones-footer" onClick={AbrirModalCrearComentario}>Cancelar</Button>
      </ModalFooter>
    </Modal>
    <Modal isOpen={modalEditarComentario} className="modal-editar-detalles-tarea">
      <ModalHeader className="modal-header"> Editar comentario </ModalHeader>
      <ModalBody className="modal-body">
        <Form>
        <FormGroup row>
            <Label sm={3}>Comentario:</Label>
            <Col sm={9}>
              <InputGroup className="input-group-comentario">
                <Input className="input-comentario-textarea" valid={editarComentarioValido} invalid={!editarComentarioValido} type="textarea" 
                placeholder="Debes ingresar un comentario para realizar el cambio de estado" value={comentarioTarea} 
                onChange={(e) => ValidarCambioComentario(e.target.value)}></Input>
                <InputGroupText className={"input-icon input-cambio-"+(editarComentarioValido ? "valido" : "invalido")}>
                  {editarComentarioValido ? <CheckCircleOutlineIcon sx={{ fontSize: 23 }}/> : <HighlightOffIcon sx={{ fontSize: 23 }}/>}
                </InputGroupText>
              </InputGroup>
              {/* <FormFeedback tooltip>Oh no!</FormFeedback> */}
              <Label className={"label-cambio-"+(editarComentarioValido ? "valido" : "invalido")}>Debes ingresar un comentario</Label>
            </Col>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter className="modal-footer">
        <Button variant="contained" className="button-acciones-footer"
        onClick={() => GuardarComentarioEditadoValido()} disabled={botonEditarComentario}>
          <div>Guardar</div>
          {botonEditarComentario ? <CircularProgress sx={{marginLeft:'8px'}} size={20} color="inherit"></CircularProgress> : <></>}
        </Button>
        <Button variant="outlined" className="button-acciones-footer" onClick={CerrarModalEditarComentario}>Cancelar</Button>
      </ModalFooter>
    </Modal>

    </>
  )
}

export default DesarrolloTareasComponent;