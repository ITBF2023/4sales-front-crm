import React, { Fragment, forwardRef, useLayoutEffect, useState } from "react";
import moment from "moment";

import { Button, Container, CustomInput, Form, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';

import Header from "../../../components/Headers/Header";

import { useParams } from "react-router-dom";

import '../../../assets/css/ViewStyles/GestionDeCaso.css'

import { getCasoByID, updateGestionCaso, cambiarEstadoGestionCaso ,getUserId, postObservacionGestion,} from '../../../Controller/Controller';
import { Menu} from "@mui/material";

import ObservacionesGestionComponent from "./ObservacionesGestionComponent/ObservacionesGestionComponent";

import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Paper from '@mui/material/Paper';

import StartIcon from '@mui/icons-material/Start';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import GradingIcon from '@mui/icons-material/Grading';
import ReactTooltip from "react-tooltip";
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const GestionDeCasoComponent = () => {

  let path = useParams()

  const [estiloContenedorDetallesCaso, setEstilosContenedorDetallesCaso] = useState({});
  const [imagenPrioridadCaso, setImagenPrioridadCaso] = useState("");
  const [prioridad, setPrioridad] = useState("");
  const [datosGestion, setDatosGestion] = useState({});
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [usuarioActivo, setUsuarioActivo] = useState(false);
  const [descripcionCaso, setDescripcionCaso] = useState("");
  const [imagenUsuario, setUsuarioImagen] = useState("");
  const [usuarioCorreo, setUsuarioEmail] = useState("");
  const [usuarioAreaTrabajo, setUsuarioAreaTrabajo] = useState("");
  const [nombreCliente, setNombreCliente] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [estadoActual, setEstadoActual] = useState("");

  const getDatosGestion = async () => {
    const dato = await getCasoByID(path.id);
    if (!dato.casoId) {
      setDatosGestion({});
    } else {
      setDatosGestion(dato);
      setNombreUsuario(dato.datosEncargadoCaso.userName + ' ' + dato.datosEncargadoCaso?.userLastname)
      setUsuarioActivo(dato.datosEncargadoCaso.userActive)
      setDescripcionCaso(dato.descripcionCaso)
      setUsuarioImagen(dato.datosEncargadoCaso.userImage)
      setNombreCliente(dato.nombreCliente)
      setUsuarioAreaTrabajo(dato.datosEncargadoCaso.userWorkstation)
      setUsuarioEmail(dato.datosEncargadoCaso.userMail)
      setFechaInicio(dato.fechaInicioCaso.substring(0, 19))
      setFechaFin(dato.fechaCierreCaso.substring(0, 19))
      setEstadoActual(dato.estado)
      setPrioridad(dato.prioridad)
      switch(dato.prioridad){
        case "ALTA":
          setEstilosContenedorDetallesCaso({border: '3px solid red', borderRadius:'15px'});
          setImagenPrioridadCaso('Images/GestionCaso/High_priority_icon.png')
          break;
        case "MEDIA":
          setEstilosContenedorDetallesCaso({border: '3px solid rgb(255, 230, 0)', borderRadius:'15px'});
          setImagenPrioridadCaso('Images/GestionCaso/Medium_priority_icon.png')
          break;
        default:
          setEstilosContenedorDetallesCaso({border: '3px solid rgb(62, 210, 221)', borderRadius:'15px'});
          setImagenPrioridadCaso('Images/GestionCaso/Low_priority_icon.png')
          break;
      }
    }
  }
  

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClose = () => {
    setAnchorEl(null);
  };

  const convert = fecha => {
    return ((moment(Date.parse(fecha)).format("DD MMMM YYYY")).toString())
  }

  const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#ffffff',
      color: 'rgba(0, 0, 0, 0.87)',
      // maxWidth: 220,
      fontSize: theme.typography.pxToRem(15),
      border: '1px solid #dadde9',
      minWidth: '300px'
    },
  }));

  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const modalStyles={
    top: '10%',
  }

  // Funciones Modal Editar Gestion Caso *****************************************************************
  const [crearCasoDisabled, setCrearCasoDisabled] = useState(false);
  const [modalCasos, setModalCasos] = useState(false);

  const abrirModalCasos = () => {
    setModalCasos(!modalCasos)
    setCrearCasoDisabled(false)
  }

  const CrearCaso = async() => {
    setCrearCasoDisabled(true)
    const form = new FormData();
    form.append('NombreCliente',nombreCliente);
    form.append('DescripcionCaso',descripcionCaso);
    form.append('Prioridad',prioridad);

    const caso = await updateGestionCaso(form, path.id)
    if(caso === "OK"){
      setCrearCasoDisabled(false)
      abrirModalCasos()
      getDatosGestion()
      setmensajeNotificacionMostrar("Datos Actualizados Correctamente!")
      setMostrarNotificacion(true)
    }

  }

  // ************************************************************************************************
  // Funciones dee Notificacion

  const [mostrarNotificacion, setMostrarNotificacion] = useState(false)
  const [mensajeNotificacionMostrar, setmensajeNotificacionMostrar] = useState("")
  
  const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const cerrarNotificacion = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setMostrarNotificacion(false);
  };

  // ************************************************************************************************

  // ************************************************************************************************
  // Funciones de Cambio de Estado

  const steps = [
    {
      label: 'Caso Recibido',
      description: `Este caso fue creado el ` + convert(fechaInicio) +`, todo caso
                al ser creado empieza con el estado RECIBIDO, puede dejar observaciones
                para detallar mas el caso o pasar al siguiente estado indicando que el caso
                se encuentra en gestión.`,
    },
    {
      label: 'Caso En Proceso',
      description:
        `El caso se encuentra siendo gestionado, puede dejar las observaciones que sean necesarias
        para sustentar todos los procesos que fueron realizados durante el proceso asi como adjuntar documentos.
        Si el caso quedo gestionado puede avanzar de Estado`,
    },
    {
      label: 'Caso Resuelto',
      description: `Luego de toda la gestion y el caso este resuelto como ultimo paso dele en cerrar caso,
                    De igual manera en este ultimo estado puede dejar observaciones si asi se requiere.
                    Para registrar la fecha de cierre de clic sobre el boton *Cerrar Caso*`,
    },
  ];

  const [activeStep, setActiveStep] = useState(0);
  const [modalCambioEstado, setModalCambioEstado] = useState(false);

  const abrirModalCambioEstado = async() => {
    setModalCambioEstado(!modalCambioEstado)
    const dato = await getCasoByID(path.id);
    if (!dato.casoId) {
    } else {
      switch(dato.estado){
        case "RECIBIDO":
        setActiveStep(0)
        break;
      case "EN PROCESO":
        setActiveStep(1)
        break;
      case "RESUELTO":
        setActiveStep(2)
        if(dato.fechaInicioCaso != dato.fechaCierreCaso){
          setActiveStep(3)
        }
        break;
      }
    }
  }

  const handleNext = async() => {
    let formData = new FormData();
    switch (estadoActual){
      case "RECIBIDO":
        formData.append('Estado',"EN PROCESO")
        var estadorespuesta = await cambiarEstadoGestionCaso(formData, datosGestion.casoId)
        if(estadorespuesta.status == 201){
          setMostrarNotificacion(true)
          setmensajeNotificacionMostrar("Estado cambiado correctamente a 'EN PROCESO' ")
          getDatosGestion()
          setValue('2')
          CreacionDeObservacion("El caso cambio de estado a 'EN PROCESO' ")
        }
        break;
      case "EN PROCESO":
        formData.append('Estado',"RESUELTO")
        var estadorespuesta = await cambiarEstadoGestionCaso(formData, datosGestion.casoId)
        if(estadorespuesta.status == 201){
          setMostrarNotificacion(true)
          setmensajeNotificacionMostrar("Estado cambiado correctamente a 'Resuelto' ")
          getDatosGestion();
          setValue('3')
          CreacionDeObservacion("El caso cambio de estado a 'RESUELTO' ")
        }
        break;
      case "RESUELTO":
        formData.append('Estado',"RESUELTO")
        var estadorespuesta = await cambiarEstadoGestionCaso(formData, datosGestion.casoId)
        if(estadorespuesta.status == 201){
          setMostrarNotificacion(true)
          setmensajeNotificacionMostrar("La fecha de cierre se registro correctamente")
          getDatosGestion()
          CreacionDeObservacion("Se registro la fecha de cierre del caso")
        }
        break;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = async() => {
    let formData = new FormData();
    switch (estadoActual){
      case "EN PROCESO":
        formData.append('Estado',"RECIBIDO")
        var estadorespuesta = await cambiarEstadoGestionCaso(formData, datosGestion.casoId)
        if(estadorespuesta.status == 201){
          setMostrarNotificacion(true)
          setmensajeNotificacionMostrar("Estado cambiado correctamente a 'RECIBIDO' ")
          getDatosGestion();
          setValue('1')
          CreacionDeObservacion("El caso cambio de estado a 'RECIBIDO' ")
        }
        break;
      case "RESUELTO":
        formData.append('Estado',"EN PROCESO")
        var estadorespuesta = await cambiarEstadoGestionCaso(formData, datosGestion.casoId)
        if(estadorespuesta.status == 201){
          setMostrarNotificacion(true)
          setmensajeNotificacionMostrar("Estado cambiado correctamente a 'EN PROCESO' ")
          getDatosGestion()
          setValue('2')
          CreacionDeObservacion("El caso cambio de estado a 'EN PROCESO' ")
        }
        break;
    }
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = async() => {
    let formData = new FormData();
    formData.append('Estado',"RECIBIDO")
    var estadorespuesta = await cambiarEstadoGestionCaso(formData, datosGestion.casoId)
    if(estadorespuesta.status == 201){
      CreacionDeObservacion("El caso se reabrio nuevamente")
      setMostrarNotificacion(true)
      setmensajeNotificacionMostrar("El caso se paso al estado 'RECIBIDO' nuevamente")
      getDatosGestion()
    }
    setActiveStep(0);
    setValue('4')
  };
  // ************************************************************************************************

  // ************************************************************************************************
  // Creacion de Comentarios
  const CreacionDeObservacion = async (descripcionObservacion) => {
    const form = new FormData();
    form.append('observacionDescripcion', descripcionObservacion);
    form.append('estadoEvolucion', estadoActual);
    form.append('usuarioId', getUserId());
    form.append('gestionCasoId', path.id);
    form.append('observacionConDocumento', false);

    form.append('documentoNombre', "");
    form.append('documentoMymeType', "");
    form.append('documentoFile', null);

    const observ = await postObservacionGestion(form)
    if (observ.status !== 201) {
      alert("Problema")
    }
  }

  // ************************************************************************************************


  useLayoutEffect(() => {
    getDatosGestion();
  }, []);


  return (
    <>
      <Header></Header>
      <Container className="mt-5" fluid>

        <div className="container-fluid page-body-wrapper">
          <div className="main-panel">
            <div className="content-wrapper">
              <div className="page-header">
                {/* <h3 className="page-title"> {company.compañia?.companyRazonSocial} </h3> */}
              </div>
              <div className="row">
                <div className="col-12 grid-margin container-card-gestion-caso">
                  <div className="card">
                    <div className="card-body" style={estiloContenedorDetallesCaso} >
                      <Row>
                        <div className="col-right col-sm-3 container-img-sucursal-choose ">
                          <img src={'Images/GestionCaso/gestion-de-casos.jpg'} className="card__image col-right" alt="brown couch" />
                        </div>
                        <div className="col-right col-sm-3 container-img-sucursal-choose">
                          <h3 className="card__date">Prioridad:  </h3>
                          <p className="card__title">{prioridad}</p>
                          <h3 className="card__date">Descripcion Caso:</h3>
                          <HtmlTooltip
                            title={
                              <Fragment>
                                <Typography color="inherit" style={{fontWeight:'700'}} >Descripcion Completa Caso</Typography>
                                {/* <em>{"And here's"}</em> <b>{'some'}</b> <u>{'amazing content'}</u>.{' '}
                                {"It's very engaging. Right?"} */}
                                {descripcionCaso}
                              </Fragment>
                            }
                          >
                            <p className="card__title">{descripcionCaso.substring(0, 20)}...</p>
                          </HtmlTooltip>
                          <h3 className="card__date">Nombre del cliente:</h3>
                          <p className="card__title">{nombreCliente}</p>
                          <h3 className="card__date">Estado: {estadoActual}</h3>
                        </div>
                        <div className="col-right col-sm-3 container-img-sucursal-choose">
                          <h3 className="card__date">Fecha creación: </h3>
                          <p className="card__title">{convert(fechaInicio)}</p>
                          <h3 className="card__date">Encargado Caso:</h3>
                          <p className="card__title"><span onMouseOver={handleClick}>{nombreUsuario}</span></p>
                          <Menu
                            anchorEl={anchorEl}
                            id="account-menu"
                            onClose={handleClose}
                            onClick={handleClose}
                            open={open}
                            PaperProps={{
                              elevation: 0,
                              sx: {
                                overflow: 'visible',
                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                mt: 1.5,
                                '& .MuiAvatar-root': {width: 32, height: 32, ml: -0.5, mr: 1,},
                                '&:before': { content: '""', display: 'block', position: 'absolute', top: 0, width: 10,
                                  height: 10, left:50 , bgcolor: 'background.paper', transform: 'translateY(-50%) rotate(45deg)', zIndex: 0,},
                              },
                            }}
                            transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                          >
                            <div className="gc_contenedor_imagen_encargado">
                              <div className="gc_contenedor_flex">
                                <div className="gc_contenedor_block">
                                  <img src={"Images/Users/"+imagenUsuario} className="Imagen_usuario_encargado_caso" />
                                  {usuarioActivo ?
                                    <div className="Estado_usuario_encargado_caso">
                                      <Tooltip title="Estado: Activo" arrow><img src="Images/GestionCaso/Check_icon.png" width={'100%'}/></Tooltip>
                                    </div>:
                                    <div className="Estado_usuario_encargado_caso">
                                      <Tooltip title="Estado: Bloqueado" arrow><img src="Images/GestionCaso/Error_icon.png" width={'100%'}/></Tooltip>
                                    </div>
                                  }
                                </div>
                                <div className="gc_contenedor_datos_encargado">
                                  <div>{nombreUsuario}</div>
                                  <div>{"AT-"+usuarioAreaTrabajo}</div>
                                  <div className="gc_contenedor_flex">
                                    <div className="gc_contenedor_centrado_top_bottom">
                                      <a href={"mailto:"+usuarioCorreo} target={"_blank"} style={{marginRight:'8px'}} >{usuarioCorreo}</a>
                                    </div>
                                    <Tooltip title="Copiar" arrow>
                                      <button className="gc_botones_sin_fondo_para_iconos" onClick={() => {navigator.clipboard.writeText(usuarioCorreo)}}>
                                        <ContentCopyIcon sx={{ fontSize: 18 }}/>
                                      </button>
                                    </Tooltip>
                                  </div>
                                  
                                </div>
                              </div>
                              
                            </div>
                          </Menu>
                          <h3 className="card__date">Fecha de cierre:</h3>
                          <p className="card__title">{fechaInicio != fechaFin ? convert(fechaFin) : 'caso en gestion'}</p>
                          <div>
                            <Button color="info" size="sm" data-tip data-for="tool-tip-preview-documento" onClick={abrirModalCasos} ><i className="mdi mdi-note-edit-outline estilo_botones_gestion_caso"></i></Button>
                            <ReactTooltip id="tool-tip-preview-documento" place="top" type="dark" effect="float">Editar Datos Caso</ReactTooltip>
                            <Button color="info" size="sm" data-tip data-for="tooltip-Actualizar-Documento" onClick={abrirModalCambioEstado} ><i className="mdi mdi-comment-arrow-right-outline estilo_botones_gestion_caso"></i></Button>
                            <ReactTooltip id="tooltip-Actualizar-Documento" place="top" type="dark" effect="float">Cambiar Estado Evolucion</ReactTooltip>
                          </div>
                        </div>
                        <div className="col-right col-sm-3 container-img-sucursal-choose ">
                          <img src={imagenPrioridadCaso} className="card__image col-right" alt="brown couch" />
                        </div>
                      </Row>
                    </div>

                  </div>
                </div>
              </div>
              <br></br>
              <div className="row">
                <div className="col-12 grid-margin">
                  <div className="card">
                    <div className="card-body">
                      <h3 className="page-title">Observaciones</h3>
                        <TabContext value={value}>
                          <Box display="flex" justifyContent="center" width="100%">
                            <TabList variant="scrollable" scrollButtons onChange={handleChange} aria-label="TabListGestionCaso" centered>
                              <Tab label="Observaciones" value="4" icon={<FormatListNumberedIcon />} iconPosition="end"/>
                              <Tab label="Recibido" value="1" icon={<StartIcon />} iconPosition="end" />
                              <Tab label="En proceso" value="2" icon={<GradingIcon />} iconPosition="end"/>
                              <Tab label="Resuelto" value="3" icon={<CheckCircleOutlineIcon />} iconPosition="end"/>
                            </TabList>
                          </Box>
                          <TabPanel value="1" >
                            <ObservacionesGestionComponent estadoCaso={"RECIBIDO"} estadoActualCasoGestion={estadoActual}></ObservacionesGestionComponent>
                          </TabPanel>
                          <TabPanel value="2">
                            <ObservacionesGestionComponent  estadoCaso={"EN PROCESO"} estadoActualCasoGestion={estadoActual}></ObservacionesGestionComponent>
                          </TabPanel>
                          <TabPanel value="3">
                            <ObservacionesGestionComponent  estadoCaso={"RESUELTO"} estadoActualCasoGestion={estadoActual}></ObservacionesGestionComponent>
                          </TabPanel>
                          <TabPanel value="4" >
                            <ObservacionesGestionComponent estadoCaso={"TODOS"} estadoActualCasoGestion={estadoActual}></ObservacionesGestionComponent>
                          </TabPanel>
                        </TabContext>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Modal isOpen={modalCasos} style={modalStyles}>
          <ModalHeader>
            Modificar Datos Del Caso
          </ModalHeader>
          <ModalBody>
            <Form>
              <Label for="nombreClienteCaso">Nombre del cliente</Label>
              <Input type="text" id="nombreClienteCaso" value={nombreCliente} onChange={e => setNombreCliente(e.target.value)}/>
              <Label for="descripcionCaso">Descripcion</Label>
              <Input type="textarea" id="descripcionCaso" value={descripcionCaso} rows={7} onChange={e => setDescripcionCaso(e.target.value)}/>
              <Label for="prioridadCaso">Prioridad</Label>
              <CustomInput type="select" id="prioridadCaso" value={prioridad} name="prioridadCaso" onChange={e => setPrioridad(e.target.value)}>
                <option value="">Selecciona una prioridad</option>
                <option value={"BAJA"}>BAJA</option>
                <option value={"MEDIA"}>MEDIA</option>
                <option value={"ALTA"}>ALTA</option>
              </CustomInput>
            </Form>
          </ModalBody>
          <ModalFooter>
              <Button disabled={crearCasoDisabled} color="primary" onClick={() => CrearCaso()}>Actualizar</Button>
              <Button color="secondary" onClick={abrirModalCasos}>Cerrar</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={modalCambioEstado} style={modalStyles}>
          <ModalHeader>
            Cambiar de estado de evolución
          </ModalHeader>
          <ModalBody>
            <Box sx={{ maxWidth: 400 }}>
              <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) => (
                  <Step key={step.label}>
                    <StepLabel
                      optional={
                        index === 2 ? (
                          <Typography variant="caption">Ultimo estado</Typography>
                        ) : null
                      }
                    >
                      {step.label}
                    </StepLabel>
                    <StepContent>
                      <Typography>{step.description}</Typography>
                      <Box sx={{ mb: 2 }}>
                        <div>
                          <Button
                            variant="contained"
                            onClick={handleNext}
                            sx={{ mt: 1, mr: 1 }}
                          >
                            {index === steps.length - 1 ? 'Cerrar Caso' : 'Avanzar Estado'}
                          </Button>
                          { index === 0 ? <></> : <Button
                            onClick={handleBack}
                            sx={{ mt: 1, mr: 1 }}
                          >
                            Regresar
                          </Button>}
                        </div>
                      </Box>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
              {activeStep === steps.length && (
                <Paper square elevation={0} sx={{ p: 3 }}>
                  <Typography>Caso resuelto - fecha de cierre registrada</Typography>
                  <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                    Reabrir Caso
                  </Button>
                </Paper>
              )}
            </Box>
          </ModalBody>
          <ModalFooter>
              <Button color="secondary" onClick={abrirModalCambioEstado}>Cerrar</Button>
          </ModalFooter>
        </Modal>

        <Snackbar open={mostrarNotificacion} autoHideDuration={6000} onClose={cerrarNotificacion} anchorOrigin={{vertical: 'top', horizontal:'center' }}>
          <Alert onClose={cerrarNotificacion} severity="success" sx={{ width: '100%' }}>
            {mensajeNotificacionMostrar}
          </Alert>
        </Snackbar>
      </Container>
    </>
    
  );
}

export default GestionDeCasoComponent;