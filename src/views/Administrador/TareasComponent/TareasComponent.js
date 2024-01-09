import React, { useLayoutEffect } from "react";
import Header from "../../../components/Headers/Header";
import { Container, Card, Row, CardBody, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Col, InputGroup, InputGroupText} from "reactstrap";
import { Button, Chip, CircularProgress, Divider, List} from "@mui/material";
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import './TareasComponent.css'
import { useState } from "react";
import moment from "moment";
import { getUserId, getUsuariosActivos, postCrearNuevaTareaUsuario, getTareasAsignadasUsuarios, getTareasPersonalesUsuarios, getTareasColaborativasUsuarios } from "../../../Controller/Controller";

import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import DataTableTareasComponent from "./Components/DataTableTareasComponent";
import { defaultThemes }from 'react-data-table-component';
import ReportIcon from '@mui/icons-material/Report';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Link } from "react-router-dom/cjs/react-router-dom";
import RateReviewIcon from '@mui/icons-material/RateReview';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

const TareasComponent = () =>{

  const [fechaActual, setFechaActual] = useState(moment(new Date(Date.now())).format("YYYY-MM-DD"))
  const [modalCrearTarea, setModalCrearTarea] = useState(false);
  const [tituloTarea, setTituloTarea] = useState("")
  const [descripcionTarea, setDescripcionTarea] = useState("")
  const [prioridadTarea, setPrioridadTarea] = useState("null")
  const [fechaInicioTarea, setFechaInicioTarea] = useState(fechaActual)
  const [fechaFinTarea, setFechaFinTarea] = useState(fechaActual)
  const [esTareaCompartida, setEsTareaCompartida] = useState(false)

  const AbrilModalCrearTarea = () => {
    setModalCrearTarea(!modalCrearTarea);
    setTituloTarea("")
    setCambioTituloValido(false)
    setDescripcionTarea("")
    setCambioDescripcionValido(false)
    setPrioridadTarea("null")
    setCambioPrioridadValido(false)
    setFechaInicioTarea(fechaActual)
    setFechaFinTarea(fechaActual)
    setBotonCrearTareaValido(false)
    setValue(null)
    setCambioUsuarioSeleccionarValido(false)
    setCambioUsuariosCompartir(false)
    setEsTareaCompartida(false)
  }

  const CrearNuevaTareaValido = async() =>{
    if(cambioTituloValido && cambioDescripcionValido && cambioPrioridadValido && cambioUsuarioSeleccionarValido){
      setBotonCrearTareaValido(true)
      var nuevaTarea = {
      "Titulo":tituloTarea,
      "Descripcion":descripcionTarea,
      "Prioridad":prioridadTarea,
      "Estado":"No Iniciado",
      "UsuarioEncargadoId": value.id,
      "UsuarioCreadorId": getUserId(),
      "FechaInicio": fechaInicioTarea,
      "FechaFin": fechaFinTarea,
      "DatosCreadorTarea": usuario?.userName+" "+usuario?.userLastname,
      "TareaCompartida": esTareaCompartida,
      }
      if(esTareaCompartida){
        nuevaTarea = {...nuevaTarea, "UsuariosCompartir":listaUsuariosCompartir}
        if(!cambioUsuariosCompartir){
          setBotonCrearTareaValido(false)
          return false;
        }
      }
      var tarea = await postCrearNuevaTareaUsuario(nuevaTarea)
      if(tarea.status === 201){
        alert(`Proceso Exitoso: ${tarea.data.message}`)
        AbrilModalCrearTarea()
        // ObtenerTareasAsignadas()
      }else{
        alert(`Error, ${tarea.status} \n Ocurrio un Problema: ${tarea.data}`)
      }
      setBotonCrearTareaValido(false)
    }
  }

  const [usuarioActivos, setUsuariosActivos] = useState([])
  const ObtenerUsuariosParaAsignar = async() => {
    const usuariosObtenidos = await getUsuariosActivos()
    if(usuariosObtenidos.status === 200){
      setUsuariosActivos(usuariosObtenidos.data)
      // console.log(usuariosObtenidos.data)
    }else{
      setUsuariosActivos([])
      alert(`Error, ${usuariosObtenidos.status} \n Ocurrio un Problema: ${usuariosObtenidos.data}`)
    }
  }

  const [cambioPrioridadValido, setCambioPrioridadValido] = useState(false)
  const [cambioTituloValido, setCambioTituloValido] = useState(false)
  const [cambioDescripcionValido, setCambioDescripcionValido] = useState(false)
  const [botonCrearTareaValido, setBotonCrearTareaValido] = useState(false)
  const [cambioUsuarioSeleccionarValido, setCambioUsuarioSeleccionarValido] = useState(false)
  const [cambioUsuariosCompartir, setCambioUsuariosCompartir] = useState(false)
  const ValidarSeleccionarPrioridadTarea = (prioridadRecibida) =>{
    setPrioridadTarea(prioridadRecibida)
    if(prioridadRecibida === "null"){
      setCambioPrioridadValido(false)
    }else{
      setCambioPrioridadValido(true)
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

  const [listaUsuariosCompartir, setListaUsuariosCompartir] = useState(null)
  const [value, setValue] = useState(null);
  const getuser = localStorage.getItem("usuario")
  const usuario = JSON.parse(getuser)

  const [tabSeleccionado, setTabSeleccionado] = useState('1');

  const handleChange = (event, newValue) => {
    setTabSeleccionado(newValue);
    setData(respaldoTareas)
    setTareasPersonales(respaldoTareasPersonales)
  };
  const defaultProps = {
    options: usuarioActivos,
    getOptionLabel: (option) => option.nombreUsuario+"-"+option.id,
  };

  // Modulo Tablas Tareas
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
        selector: row => row.usuarioEncargadoNombre,
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
    const columnasCompartido = [
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
        format: row => <Tooltip title={row.descripcion} arrow><div className="prueba-tareas descripcion-tarea">{row.descripcion}</div></Tooltip>,
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
        // grow: 0.9,
        cell: row => <div className={"prueba-tareas estado-tarea prioridad-"+row.prioridad}> 
          <div>{row.prioridad}</div>
          <div>{row.prioridad == "Critica" ? <ReportIcon sx={{fontSize:'20px', marginLeft:'5px'}}/>:(row.prioridad=="Alta"?<WarningAmberIcon sx={{fontSize:'20px', marginLeft:'5px'}}/>:<></>)}</div>
        </div>
      },
      {
        name: 'Encargado',
        selector: row => row.usuarioEncargadoNombre,
        sortable: true,
        // grow: 1.2,
        center: true,
        cell: row => <UsuarioEncargadoModulo row={row}></UsuarioEncargadoModulo>
      },
      {
        name: 'Equipo',
        selector: row => row.usuarioEncargadoNombre,
        // grow: 1.2,
        center: true,
        cell: row => <div>
          <HtmlTooltip
            title={
                <Box>
                  <List>
                    {row.tareasCompartidas.map((option, index) =>
                    <div key={index}>
                      <ListItem className="list-item-usuario-compartido-detalle"> 
                        <ListItemAvatar>
                          <Avatar alt={option.nombreUsuario} src={"Images/Users/"+option.imagenUsuario} sx={{ width: 35, height: 35 }} />
                        </ListItemAvatar>
                        <ListItemText primary={option.nombreUsuario}/>
                      </ListItem>
                      <Divider variant="middle"></Divider>
                    </div>
                    )}
                  </List>
                </Box>
            }
          >
            <AvatarGroup max={4} sx={{"& .css-sxh3gq-MuiAvatar-root-MuiAvatarGroup-avatar":{width:'30px !important', height:'30px', fontSize:'0.7rem', marginLeft:'-7px', color:'black'}}}>
              {row.tareasCompartidas.map((usuario, index) =>
                <Avatar key={index} sx={{ width: 30, height: 30,}} alt={usuario.nombreUsuario} src={"Images/Users/"+usuario.imagenUsuario} />
              )}
            </AvatarGroup>
          </HtmlTooltip>
        </div>
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
        width:'4rem',
        cell: row => 
          <Tooltip title="Gestionar la tarea" followCursor>
            <Button sx={{borderRadius:'50%', textTransform:'capitalize', minWidth:'30px', padding:'5px', border:'none'}} variant="outlined">
              <Link to={"tarea-desarrollo/"+row.tareaId}>
                <RateReviewIcon/>
              </Link>
            </Button>
          </Tooltip>
      },
    ];

    const [data, setData] = useState([]);
    const [respaldoTareas, setRespaldoTareas] = useState([]);
    const ObtenerTareasAsignadas = async() =>{
      var tareasObtenidas = await getTareasAsignadasUsuarios(getUserId())
      if(tareasObtenidas.status === 200){
        setData(tareasObtenidas.data)
        setRespaldoTareas(tareasObtenidas.data)
      }else{
        alert(`Error, ${tareasObtenidas.status} \n Ocurrio un Problema: ${tareasObtenidas.data}`)
        setData([])
        setRespaldoTareas([])
      }
    }

    const [tareasPersonales, setTareasPersonales] = useState([]);
    const [respaldoTareasPersonales, setRespaldoTareasPersonales] = useState([]);
    const ObtenerTareasPropiasUsuario = async() =>{
      var tareasObtenidas = await getTareasPersonalesUsuarios(getUserId())
      if(tareasObtenidas.status === 200){
        setTareasPersonales(tareasObtenidas.data)
        setRespaldoTareasPersonales(tareasObtenidas.data)
      }else{
        alert(`Error, ${tareasObtenidas.status} \n Ocurrio un Problema: ${tareasObtenidas.data}`)
        setTareasPersonales([])
        setRespaldoTareasPersonales([])
      }
    }

    const [tareasCompartidas, setTareasCompartidas] = useState([]);
    const [respaldoTareasCompartidas, setRespaldoTareasCompartidas] = useState([]);
    const ObtenerTareasColaborativasUsuario = async() =>{
      var tareasObtenidas = await getTareasColaborativasUsuarios(getUserId())
      if(tareasObtenidas.status === 200){
        setTareasCompartidas(tareasObtenidas.data)
        setRespaldoTareasCompartidas(tareasObtenidas.data)
      }else{
        alert(`Error, ${tareasObtenidas.status} \n Ocurrio un Problema: ${tareasObtenidas.data}`)
        setTareasCompartidas([])
        setRespaldoTareasCompartidas([])
      }
    }

    const HtmlTooltip = styled(({ className, ...props }) => (
      <Tooltip {...props} classes={{ popper: className }} arrow />
    ))(({ theme }) => ({
      [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#ffff',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 260,
        maxHeight: 200,
        overflow:'scroll',
        overflowX:'hidden',
        overflowY:'auto',
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
      },
    }));

  useLayoutEffect(()=>{
    ObtenerUsuariosParaAsignar()
    ObtenerTareasAsignadas()
    ObtenerTareasPropiasUsuario()
    ObtenerTareasColaborativasUsuario()
  },[])

  return(
    <>
    <Header></Header>
    <Container className="mt-3" fluid >
      <Card style={{margin:'0'}} >
        <Row style={{margin:'15px 20px'}}> 
          <Button variant="outlined" sx={{borderRadius:'20px'}} endIcon={<AddCircleIcon />} onClick={AbrilModalCrearTarea}>Agregar nueva tarea</Button>
        </Row>
        <Divider variant="middle" component="li" sx={{listStyle:'none'}}/>
        <CardBody>
          <TabContext value={tabSeleccionado}>
            <Box display="flex" justifyContent="center" width="100%">
              <TabList variant="scrollable" scrollButtons onChange={handleChange} aria-label="TabListGestionCaso" allowScrollButtonsMobile>
                <Tab label="Tareas Asignadas" value="1" />
                <Tab label="Tareas Compartidas" value="2" />
                <Tab label="Tareas Personales Usuarios" value="3" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <DataTableTareasComponent 
                usuarioActivos={usuarioActivos} columns={columns} paginationOptions={paginationComponentOptions} customStyles={customStyles}
                data={data} setData={setData} respaldoTareas={respaldoTareas}></DataTableTareasComponent>
            </TabPanel>
            <TabPanel value="2">
            <DataTableTareasComponent 
                usuarioActivos={usuarioActivos} columns={columnasCompartido} paginationOptions={paginationComponentOptions} customStyles={customStyles}
                data={tareasCompartidas} setData={setTareasCompartidas} respaldoTareas={respaldoTareasCompartidas}></DataTableTareasComponent>
            </TabPanel>
            <TabPanel value="3">
              <DataTableTareasComponent 
                usuarioActivos={usuarioActivos} columns={columns} paginationOptions={paginationComponentOptions} customStyles={customStyles}
                data={tareasPersonales} setData={setTareasPersonales} respaldoTareas={respaldoTareasPersonales}></DataTableTareasComponent>
            </TabPanel>
          </TabContext>
        </CardBody>
      </Card>
    </Container>
    <Modal isOpen={modalCrearTarea} className="modal-crear-tareas">
      <ModalHeader className="modal-header">
        Crear una nueva tarea
      </ModalHeader>
      <ModalBody style={{paddingBottom:'0'}}>
        <Form>
          <FormGroup row className="form-row-contenedor-input" >
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
          <FormGroup row className="form-row-contenedor-input">
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
          <FormGroup row className="form-row-contenedor-input">
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
          <FormGroup row className="form-row-contenedor-input">
            <Label sm={3}>Usuario</Label>
            <Col sm={9}>
              <Autocomplete
                {...defaultProps}
                id="controlled-demo"
                value={value}
                onChange={(event, newValue) => {
                  setValue(newValue);
                  newValue ? setCambioUsuarioSeleccionarValido(true) : setCambioUsuarioSeleccionarValido(false)
                }}
                renderOption={(props, option) => (
                  <ListItem {...props} alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar alt={option.nombreUsuario} src={"Images/Users/"+option.imagenUsuario} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={option.nombreUsuario}
                      secondary={
                        <React.Fragment>
                          <Typography
                              sx={{ display: 'inline' }}
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {option.correoUsuario}
                            </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                )}
                renderInput={(params) => (
                  <div style={{display:'flex'}}>
                    <TextField {...params} label="Busca el usuario" sx={{"& .css-1d3z3hw-MuiOutlinedInput-notchedOutline": {borderColor: (cambioUsuarioSeleccionarValido ? "#2dce89":"#fb6340"), borderRadius: "0.375rem 0 0 0.375rem", borderRight:'none'}}}  />
                    <div style={{display:'flex'}}>
                      <InputGroupText className={"input-icon input-cambio-"+(cambioUsuarioSeleccionarValido ? "valido" : "invalido")}>
                        {cambioUsuarioSeleccionarValido ? <CheckCircleOutlineIcon sx={{ fontSize: 23 }}/> : <HighlightOffIcon sx={{ fontSize: 23 }}/>}
                      </InputGroupText>
                    </div>
                  </div>
                )}
              />
              <Label className={"label-cambio-"+(cambioUsuarioSeleccionarValido ? "valido" : "invalido")}>Debes seleccionar un usuario</Label>
            </Col>
          </FormGroup>
          <Divider sx={{marginBottom:'5px'}}> <Chip label="Intervalo de tiempo" /> </Divider>
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
          <FormGroup row className="form-row-contenedor-input">
            <FormControlLabel
              value="start"
              control={<Checkbox value={esTareaCompartida} onChange={(e) => setEsTareaCompartida(e.target.checked)}/>}
              label="¿Tarea compartida?"
              labelPlacement="start"
            />
          </FormGroup>
          {esTareaCompartida ? <FormGroup row className="form-row-contenedor-input">
            <Label sm={3}>Compartir</Label>
            <Col sm={9}>
              <Autocomplete
                multiple
                id="tags-outlined"
                options={usuarioActivos}
                getOptionLabel={(option) => option.nombreUsuario+"-"+option.id}
                // value={listaUsuariosCompartir}
                onChange={(event, newValue) => {
                  setListaUsuariosCompartir(newValue);
                  newValue.length > 0 ? setCambioUsuariosCompartir(true) : setCambioUsuariosCompartir(false)
                }}
                filterSelectedOptions
                renderOption={(props, option) => (
                  <ListItem {...props} alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar alt={option.nombreUsuario} src={"Images/Users/"+option.imagenUsuario} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={option.nombreUsuario}
                      secondary={
                        <React.Fragment>
                          <Typography
                              sx={{ display: 'inline' }}
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {option.correoUsuario}
                            </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                )}
                renderInput={(params) => (
                  <div style={{display:'flex'}}>
                  <TextField {...params} label="Selecciona los usuarios" sx={{"& .css-1d3z3hw-MuiOutlinedInput-notchedOutline": {borderColor: (cambioUsuariosCompartir ? "#2dce89":"#fb6340"), borderRadius: "0.375rem 0 0 0.375rem", borderRight:'none'}}}  />
                  <div style={{display:'flex'}}>
                    <InputGroupText className={"input-icon input-cambio-"+(cambioUsuariosCompartir ? "valido" : "invalido")}>
                      {cambioUsuariosCompartir ? <CheckCircleOutlineIcon sx={{ fontSize: 23 }}/> : <HighlightOffIcon sx={{ fontSize: 23 }}/>}
                    </InputGroupText>
                  </div>
                </div>
                )}
              />
              <Label className={"label-cambio-"+(cambioUsuariosCompartir ? "valido" : "invalido")}>Debes escoger minimó un usuario</Label>
            </Col>
          </FormGroup> : <></>}
        </Form>
      </ModalBody>
      <ModalFooter className="modal-footer">
      <Button variant="contained" className="button-acciones-footer" disabled={botonCrearTareaValido} 
        onClick={() => CrearNuevaTareaValido()}>
          <div>Crear</div>
          {botonCrearTareaValido ? <CircularProgress sx={{marginLeft:'8px'}} size={20} color="inherit"></CircularProgress> : <></>}
        </Button>
        <Button className="button-acciones-footer" variant="outlined" onClick={AbrilModalCrearTarea}>Cancelar</Button>
      </ModalFooter>
    </Modal>
    </> 
  )
}


const UsuarioEncargadoModulo = ({ row }) => (
  <div className="prueba-tareas usuario-encargado-tarea">
    <div>
      <img src={"Images/Users/"+row.usuarioEncargadoImagen}></img>
    </div>
    <div className="contenedor-nombre-encargado">
      <div className="encargado-nombre">
        {row.usuarioEncargadoNombre}
      </div>
    </div>
  </div>
);

export default TareasComponent;