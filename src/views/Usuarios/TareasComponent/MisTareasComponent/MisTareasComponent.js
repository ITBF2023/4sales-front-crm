import React, { useLayoutEffect } from "react";
import { Row, CardBody, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Col} from "reactstrap";
import { Button, Chip, Divider, Tooltip } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DataTable,  { defaultThemes }from 'react-data-table-component';
import ReportIcon from '@mui/icons-material/Report';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { Link } from "react-router-dom/cjs/react-router-dom";
import { useState } from "react";
import moment from "moment";
import { getMisTareasPersonales, getUserId, postCrearNuevaTareaUsuario } from "../../../../Controller/Controller";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const MisTareasComponent = () => {

    const [fechaActual, setFechaActual] = useState(moment(new Date(Date.now())).format("YYYY-MM-DD"))
    const [modalCrearTarea, setModalCrearTarea] = useState(false);
    const [tituloTarea, setTituloTarea] = useState("")
    const [descripcionTarea, setDescripcionTarea] = useState("")
    const [prioridadTarea, setPrioridadTarea] = useState("null")
    const [fechaInicioTarea, setFechaInicioTarea] = useState(fechaActual)
    const [fechaFinTarea, setFechaFinTarea] = useState(fechaActual)
  
    const AbrilModalCrearTarea = () => {
      setModalCrearTarea(!modalCrearTarea);
      setTituloTarea("")
      setDescripcionTarea("")
      setPrioridadTarea("null")
      setFechaInicioTarea(fechaActual)
      setFechaFinTarea(fechaActual)
    }
  
    const CrearNuevaTarea = async() =>{
      var nuevaTarea = new FormData();
      nuevaTarea.append("Titulo",tituloTarea)
      nuevaTarea.append("Descripcion",descripcionTarea)
      nuevaTarea.append("Prioridad",prioridadTarea)
      nuevaTarea.append("Estado","No Iniciado")
      nuevaTarea.append("UsuarioEncargadoId", getUserId())
      nuevaTarea.append("UsuarioCreadorId", getUserId())
      nuevaTarea.append("FechaInicio", fechaInicioTarea)
      nuevaTarea.append("FechaFin", fechaFinTarea)
      var tarea = await postCrearNuevaTareaUsuario(nuevaTarea)
      if(tarea.status === 201){
        alert(`Proceso Exitoso: ${tarea.data.message}`)
        AbrilModalCrearTarea()
        obtenerMisTareas()
      }else{
        alert(`Error, ${tarea.status} \n Ocurrio un Problema: ${tarea.data}`)
      }
    }
  
    const [data, setData] = useState([])
    const [respaldoTareas, setRespaldoTareas] = useState([]);
  
    const obtenerMisTareas = async() =>{
      var misTareas = await getMisTareasPersonales(getUserId())
      if(misTareas.status === 200){
        setData(misTareas.data)
        setRespaldoTareas(misTareas.data)
      }else{
        alert(`Error, ${misTareas.status} \n Ocurrio un Problema: ${misTareas.data}`)
        setData([])
        setRespaldoTareas([])
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
          // '&:first-of-type': {
          //   borderLeftStyle: 'solid',
          //   borderLeftWidth: '1px',
          //   borderLeftColor: defaultThemes.default.divider.default,
          // },
          // borderRightStyle: 'solid',
          // borderRightWidth: '1px',
          // borderRightColor: defaultThemes.default.divider.default,
        },
      },
      cells: {
        style: {
          '&:not(:last-of-type)': {
            borderRightStyle: 'solid',
            borderRightWidth: '1px',
            borderRightColor: defaultThemes.default.divider.default,
          },
          // '&:first-of-type': {
          //   borderLeftStyle: 'solid',
          //   borderLeftWidth: '1px',
          //   borderLeftColor: defaultThemes.default.divider.default,
          // },
          // borderRightStyle: 'solid',
          // borderRightWidth: '1px',
          // borderRightColor: defaultThemes.default.divider.default,
        },
      },
    };
  
    const columns = [
      {
        name: 'Titulo',
        selector: row => row.titulo,
        sortable: true,
        cell: row => <div className="prueba-tareas">{row.titulo}</div>
      },
      {
        name: 'Descripcion',
        selector: row => row.descripcion,
        sortable: true,
        wrap: true,
        // grow: 1.5,
            sortable: true,
            format: row => <div className="prueba-tareas descripcion-tarea">{row.descripcion}</div>,
      },
      {
        name: 'Estado',
        selector: row => row.estado,
        center: true,
        // grow: 0.8,
        sortable: true,
        cell: row => <div className={"prueba-tareas descripcion-tarea estado-tarea estado-"+row.estado}>{row.estado}</div>
      },
      {
        name: 'Prioridad',
        selector: row => row.prioridad,
        sortable: true,
        center: true,
        grow: 0.9,
        cell: row => <div className={"prueba-tareas estado-tarea prioridad-"+row.prioridad}> 
          <div>{row.prioridad}</div>
          <div>{row.prioridad == "Critica" ? <ReportIcon sx={{fontSize:'20px', marginLeft:'5px'}}/>:(row.prioridad=="Alta"?<WarningAmberIcon sx={{fontSize:'20px', marginLeft:'5px'}}/>:<></>)}</div>
        </div>
      },
      {
        name: 'Encargado',
        selector: row => row.usuarioEncargado,
        sortable: true,
        grow: 1.2,
        center: true,
        cell: row => <UsuarioEncargadoModulo row={row}></UsuarioEncargadoModulo>
      },
      {
        name: 'Tiempo Asignado',
        selector: row => row.tiempoAsignado,
        sortable: true,
        center: true,
        cell: row => <div className="prueba-tareas tiempo-asignado-tarea">{row.tiempoAsignado}</div>
      },
      {
        name: 'Acciones',
        selector: row => row.tiempoAsignado,
        sortable: true,
        center: true,
        grow: 0,
        cell: row => 
          <Tooltip title="Gestionar la tarea" followCursor>
            <Button sx={{borderRadius:'12px 5px 12px 5px', textTransform:'capitalize', minWidth:'30px', padding:'5px'}} variant="outlined">
              <Link to={"tarea-desarrollo/"+row.tareaId}>
                <RateReviewIcon/>
              </Link>
            </Button>
          </Tooltip>
      },
    ];
  
    const paginationComponentOptions = {
      rowsPerPageText: 'Filas por página',
      rangeSeparatorText: 'de',
      selectAllRowsItem: true,
      selectAllRowsItemText: 'Todos',
    };
  
    const UsuarioEncargadoModulo = ({ row }) => (
      <div className="prueba-tareas usuario-encargado-tarea">
        <div>
          <img src={"Images/Users/"+row.usuarioEncargadoImagen}></img>
        </div>
        <div>
          <div className="prueba-tareas">
            {row.usuarioEncargadoNombre}
          </div>
        </div>
      </div>
    );
  
    useLayoutEffect(()=>{
      obtenerMisTareas()
    },[])
  
    const listaEstados=[
      {descripcion: "No Iniciado"},
      {descripcion: "En curso"},
      {descripcion: "Culminado"},
      {descripcion: "Detenido"}
    ]
  
    const listaPrioridad=[
      {descripcion: "Baja"},
      {descripcion: "Media"},
      {descripcion: "Alta"},
      {descripcion: "Critica"}
    ]
  
    const [filtroPorEstado, setFiltroPorEstado] = useState(null)
    const [filtroPorPrioridad, setFiltroPorPrioridad] = useState(null)
  
    const CargarTareasPorFiltroEstado = (estadoCargado) => {
      const nuevaListaTareas = [...respaldoTareas]
      if(estadoCargado === null || !estadoCargado){
      setData(nuevaListaTareas)
      }else{
        const result = nuevaListaTareas.filter(tarea => tarea.estado?.toLowerCase().includes(estadoCargado.descripcion.toLowerCase()))
        setData(result)
      }
    }
  
    const CargarTareasPorFiltroPrioridad = (prioridadCargada) => {
      const nuevaListaTareas = [...respaldoTareas]
      if(prioridadCargada === null || !prioridadCargada){
      setData(nuevaListaTareas)
      }else{
        const result = nuevaListaTareas.filter(tarea => tarea.prioridad?.toLowerCase().includes(prioridadCargada.descripcion.toLowerCase()))
        setData(result)
      }
    }
  
    const CabeceraTablaTareas = () =>{
      return(
        <>
        <div>
          <Row style={{alignContent:'center', alignItems:'center'}}>
            <Col xl={3} lg={6}>
              <div>Tareas</div>
            </Col>
            <Col xl={3} lg={6}>
              <FormGroup>
              </FormGroup>
            </Col>
            <Col xl={3} lg={6}>
              <FormGroup>
                <Autocomplete
                  options={listaEstados}
                  getOptionLabel={(option) => option.descripcion}
                  id="controlled-demo"
                  value={filtroPorEstado}
                  onChange={(event, newValue) => {
                    setFiltroPorEstado(newValue);
                    CargarTareasPorFiltroEstado(newValue)
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Filtrar por estado" variant="standard"/>
                  )}
                />
              </FormGroup>
            </Col>
            <Col xl={3} lg={6}>  
              <FormGroup>
                <Autocomplete
                  options={listaPrioridad}
                  getOptionLabel={(option) => option.descripcion}
                  id="controlled-demo"
                  value={filtroPorPrioridad}
                  onChange={(event, newValue) => {
                    setFiltroPorPrioridad(newValue);
                    CargarTareasPorFiltroPrioridad(newValue)
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Filtrar por prioridad" variant="standard"/>
                  )}
                />
              </FormGroup>
            </Col>
          </Row>
        </div>
        </>
      )
    }

    return(
      <>
      <Row style={{margin:'0'}}> 
        <Button variant="outlined" sx={{borderRadius:'20px', marginBottom:'15px'}} endIcon={<AddCircleIcon />} onClick={AbrilModalCrearTarea}>Agregar nueva tarea</Button>
      </Row>
      <Divider component="li" sx={{listStyle:'none'}}/>
        <div className="contenedor-tabla-tareas container-scroll-tabla-tareas">
          <DataTable className="tabla-modulo-tareas container-scroll-tabla-tareas" 
            title={<CabeceraTablaTareas></CabeceraTablaTareas>}
            columns={columns}
            data={data}
            // dense
            // selectableRows
            pagination 
            paginationComponentOptions={paginationComponentOptions}
            customStyles={customStyles}
            // fixedHeader
            // fixedHeaderScrollHeight="600px"
          />
        </div>
      <Modal isOpen={modalCrearTarea} className="modal-crear-tareas">
        <ModalHeader style={{textAlign:'center'}}>
          Crear una nueva tarea
        </ModalHeader>
        <ModalBody style={{paddingBottom:'0'}}>
          <Form>
            <FormGroup row>
              <Label sm={3}>Titulo</Label>
              <Col sm={9}>
                <Input type="text" placeholder="Ingrese el titulo de la tarea" value={tituloTarea} onChange={(e) => setTituloTarea(e.target.value)}></Input>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label sm={3}>Descripcion</Label>
              <Col sm={9}>
                <Input type="textarea" placeholder="Ingrese la descripcio de la tarea" value={descripcionTarea} onChange={(e) => setDescripcionTarea(e.target.value)}></Input>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label sm={3}>Prioridad</Label>
              <Col sm={9}>
                <Input type="select" defaultValue={prioridadTarea} onChange={(e) => setPrioridadTarea(e.target.value)}>
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
              </Col>
            </FormGroup>
            <Divider > <Chip label="Intervalo de tiempo" /> </Divider>
            <br></br>
            <FormGroup row>
              <Col sm={6}>
                <Label>Fecha Inicio</Label>
                <Input type="date" value={fechaInicioTarea} onChange={(e) => {setFechaInicioTarea(e.target.value); setFechaFinTarea(e.target.value)}}></Input>
              </Col>
              <Col sm={6}>
                <Label>Fecha Vencimiento</Label>
                <Input type="date" min={fechaInicioTarea} value={fechaFinTarea} onChange={(e) => setFechaFinTarea(e.target.value)}></Input>
              </Col>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter style={{paddingTop:'5px'}}>
          <Button className="modal-acciones" variant="contained" onClick={() => CrearNuevaTarea()}>Crear</Button>
          <Button className="modal-acciones" variant="outlined" onClick={AbrilModalCrearTarea}>Cancelar</Button>
        </ModalFooter>
      </Modal>
      </>
    )
}

export default MisTareasComponent;