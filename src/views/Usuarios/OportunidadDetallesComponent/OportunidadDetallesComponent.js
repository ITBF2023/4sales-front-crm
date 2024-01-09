import React, { Fragment, forwardRef, useLayoutEffect, useState } from "react";
import moment from "moment";

import { Button, Card, CardBody, Col, Container, FormGroup, Form, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row,
	InputGroup, InputGroupText, CustomInput} from 'reactstrap';

import Header from "../../../components/Headers/Header";

import { useParams } from "react-router-dom";

import { getUserId, getMisCompaniasGestionOportunidades, getDetallesOportunidadById, updateOportunidadCambioCompania, updateDetallesOportunidad, 
  updateOportunidadCambioEstado, postNuevaBitacoraOportunidad} from '../../../Controller/Controller';
import { Menu} from "@mui/material";

import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { tabsClasses } from '@mui/material/Tabs'

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Paper from '@mui/material/Paper';

import StartIcon from '@mui/icons-material/Start';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import GradingIcon from '@mui/icons-material/Grading';
import ReactTooltip from "react-tooltip";

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import NoteAddIcon from '@mui/icons-material/NoteAdd';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import ListItemButton from '@mui/material/ListItemButton';

import BusinessIcon from '@mui/icons-material/Business';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';

import CircularProgress from '@mui/material/CircularProgress';

import './OportunidadDetalles.css'
import OportunidadNotasComponent from "./NotasOportunidadComponent/OportunidadNotasComponent";

const OportunidadDetallesComponent = () => {

  let path = useParams()

  const [nombreOportunidad, setNombreOportunidad] = useState("");
  const [nombreEmpresa, setNombreEmpresa] = useState("");
  const [descripcionOportunidad, setDescripcionOportunidad] = useState("");
  const [precioOportunidad, setPrecioOportunida] = useState("");
  const [fechaCreacion, setFechaCreacion] = useState("");
  const [etapaOportunidad, setEtapaOportunidad] = useState("");
  const [descripcionServicioEmpresa, setDescripcionServicioEmpresa] = useState("");
  const [imagenEmpresa, setImagenEmpresa] = useState("");

	const [nombreOportunidadEdicion, setNombreOportunidadEdicion] = useState("");
	const [descripcionOportunidadEdicion, setDescripcionOportunidadEdicion] = useState("");
  const [precioOportunidadParaEditar, setPrecioOportunidaParaEditar] = useState(0);
	const [etapaOportunidadEdicion, setEtapaOportunidadEdicion] = useState("");

  const [estadoFinalVenta, setEstadoFinalVenta] = useState("");
	
	const ObtenerDetallesOportunidad = async () => {
    const dato = await getDetallesOportunidadById(path.id);
			// console.log(dato)
		if (!dato.nombreEmpresa) {	
    } else {
			// console.log(dato)
      setNombreEmpresa(dato.nombreEmpresa);
      setNombreOportunidad(dato.nombreOportunidad)
      setDescripcionOportunidad(dato.descripcionRequerimiento)
      setPrecioOportunida(dato.precio.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'))
      setFechaCreacion(dato.fechaCreacion)
      setEtapaOportunidad(dato.etapa)
      setDescripcionServicioEmpresa(dato.servicioDescripcion)
      setImagenEmpresa(dato.companyImage)

      setPrecioOportunidaParaEditar(dato.precio)
      setNombreOportunidadEdicion(dato.nombreOportunidad)
      setDescripcionOportunidadEdicion(dato.descripcionRequerimiento)
      setEtapaOportunidadEdicion(dato.etapa)
    }
  }

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

  // **********************************************************************************************************
  // Funciones Crear Notas ************************************************************************************
  const [descripcionNota, setDescripcionNota] = useState("")

  const CrearNuevaNota = async (descripcionNotaCrear, etapaOportunidadCrear) => {
    const form = new FormData();
    form.append('Descripcion', descripcionNotaCrear);
    form.append('EtapaOportunidad', etapaOportunidadCrear);
    form.append('UsuarioId', getUserId());
    form.append('OportunidadId', path.id);

    const observ = await postNuevaBitacoraOportunidad(form)
    if (observ.status === 201) {
      setMostrarNotificacion(true)
			setmensajeNotificacionMostrar("Nota Añadida Correctamente")
			setValue('4');
    }
  }
  // **********************************************************************************************************

  // **********************************************************************************************************
  // Funciones Modal Editar Datos Oportunidad *****************************************************************
  const [modalCasos, setModalCasos] = useState(false);
	const [botonActualizarDatos, setBotonActualizarDatos] = useState(false);
	

  const abrirModalCasos = () => {
    setModalCasos(!modalCasos)
  }

  const ActualizarDatosOportunidad = async() => {
    const formDatos = new FormData();
    formDatos.append('NombreOportunidad',nombreOportunidadEdicion);
    formDatos.append('DescripcionRequerimiento',descripcionOportunidadEdicion);
    formDatos.append('Precio',precioOportunidadParaEditar);

		setBotonActualizarDatos(true)
    const datos = await updateDetallesOportunidad(path.id, formDatos)
    if(datos?.status == 201){
      ObtenerDetallesOportunidad()
      setmensajeNotificacionMostrar("Datos Actualizados Correctamente!")
      setMostrarNotificacion(true)
    }else{
			alert("Ocurrio un problema")
		}
		setBotonActualizarDatos(false)
		abrirModalCasos()

  }

  // ************************************************************************************************
	// Funciones Modal Cambiar Compañia*****************************************************************
  
	const [modalEditarCompañia, setModalEditarCompañia] = useState(false);

  const abrirModalEditarCompañia = () => {
    setModalEditarCompañia(!modalEditarCompañia)
  }

  const [compañias, setCompañias] = useState([])
  const [compañiasRespaldo, setCompañiasRespaldo] = useState([])
  const [cambiandoCompañia, setCambiandoCompania] = useState(false)
  

  const ObtenerMisCompañias = async() => {
    const misComp = await getMisCompaniasGestionOportunidades();
    // console.log(misComp)
    setCompañias(misComp[0].compañiaServiciosId ? misComp : [])
    setCompañiasRespaldo(misComp[0].compañiaServiciosId ? misComp : [])
  }

  const FiltrarCompañias = (razonSocial) =>{
    const compañiasBusqued = [...compañiasRespaldo]

    if(razonSocial.trim()=== "" || razonSocial.trim().length === 0){
      setCompañias(compañiasRespaldo)
    }else{
      const result = compañiasBusqued.filter(compa => compa.companyRazonSocial.toLowerCase().includes(razonSocial.toLowerCase()))

      setCompañias(result)
    }
  }

  const SeleccionarEmpresa = async(CompaniaSeleccionada) => {

		var formOportunidad = new FormData();
		formOportunidad.append('OportunidadId',path.id)
		formOportunidad.append('NombreEmpresa',CompaniaSeleccionada.companyRazonSocial)
		formOportunidad.append('CompañiaServicioId',CompaniaSeleccionada.compañiaServiciosId)
		
		setCambiandoCompania(true)
		const cambioCompany = await updateOportunidadCambioCompania(path.id, formOportunidad);
		if(cambioCompany?.status === 201){
			setMostrarNotificacion(true)
			setmensajeNotificacionMostrar("Se actualizo correctamente la compañia")
			ObtenerDetallesOportunidad();
		}else{
			alert("Ocurrio un problema")
		}
		setCambiandoCompania(false)
		setModalEditarCompañia(!modalEditarCompañia)
  }

  // ************************************************************************************************

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
  // Funciones de Cambio de Etapa

  const [modalCambioEstado, setModalCambioEstado] = useState(false);
	const [botonCambioEtapa, setBotonCambioEtapa] = useState(false);

  const abrirModalCambioEstado = async() => {
    setModalCambioEstado(!modalCambioEstado)
  }

  const actualizarEtapaOportunidad = async() => {
    let formData = new FormData();
    formData.append('EtapaOportunidad',etapaOportunidadEdicion)
    formData.append('EstadoFinalVenta', estadoFinalVenta.length == 0 ? "NO DEFINIDO" : estadoFinalVenta)
		setBotonCambioEtapa(true)
    var estadorespuesta = await updateOportunidadCambioEstado(path.id, formData)
    if(estadorespuesta?.status == 201){
      await CrearNuevaNota("Se realizo el cambio de Etapa: "+etapaOportunidad+" a la Etapa: "+etapaOportunidadEdicion, etapaOportunidad)
      setMostrarNotificacion(true)
      setmensajeNotificacionMostrar("Se actualizo la etapa correctamente!")
      ObtenerDetallesOportunidad()
      if(descripcionNota.trim().length !== 0){
        await CrearNuevaNota(descripcionNota, etapaOportunidadEdicion)
      }
    }else{
			alert("Ocurrio un problema")
		}
		setBotonCambioEtapa(false)
		abrirModalCambioEstado()
    // switch(etapaOportunidadEdicion){
    //   case "REQUERIMIENTO":
    //     setValue('1')
    //     break;
    //   case "COTIZANDO":
    //     setValue('2')
    //     break;
    //   case "VENTA CERRADA":
    //     setValue('3');
    //     break;

    // }
  };
  // ************************************************************************************************


  useLayoutEffect(() => {
		ObtenerDetallesOportunidad();
		ObtenerMisCompañias();
  }, []);


  return (
    <>
      <Header></Header>
      <Container className="mt-5" fluid>
				<Row>
					<Col xl={12} className="grid-margin container-card-gestion-caso">
						<Card>
							<CardBody>
								<Row>
									<Col xl={4} className="container-img-sucursal-choose ">
										<img src={'Images/Companies/'+ imagenEmpresa} className="imagen-Empresa-Oportunidad" alt="brown couch" />
									</Col>
									<Col xl={4} className="container-img-sucursal-choose">
										<h3 className="card__date">Etapa:  </h3>
										<p className="card__title">{etapaOportunidad}</p>
										<h3 className="card__date">Descripcion Caso:</h3>
										<HtmlTooltip
											title={
												<Fragment>
													<Typography color="inherit" style={{fontWeight:'700'}} >Descripcion Completa de la Oportunidad</Typography>
													{/* <em>{"And here's"}</em> <b>{'some'}</b> <u>{'amazing content'}</u>.{' '}
													{"It's very engaging. Right?"} */}
													{descripcionOportunidad}
												</Fragment>
											}
										>
											<p className="card__title">{descripcionOportunidad.substring(0, 20)}...</p>
										</HtmlTooltip>
										<h3 className="card__date">Empresa:</h3>
										<p className="card__title">{nombreEmpresa}</p>
										<h3 className="card__date">Servicio: {descripcionServicioEmpresa}</h3>
									</Col>
									<Col xl={4} className="container-img-sucursal-choose">
										<h3 className="card__date">Fecha creación: </h3>
										<p className="card__title">{convert(fechaCreacion)}</p>
										<h3 className="card__date">Precio:</h3>
										<p className="card__title"><span> COL$ {precioOportunidad}</span></p>
										<h3 className="card__date">Acciones:</h3>
										<div>
											<Button color="info" size="sm" data-tip data-for="tool-tip-editar-compañia" onClick={abrirModalEditarCompañia} ><i className="mdi mdi-store-edit estilo_botones_gestion_caso"></i></Button>
											<ReactTooltip id="tool-tip-editar-compañia" place="top" type="dark" effect="float">Editar Compañia Oportunidad</ReactTooltip>
											<Button color="info" size="sm" data-tip data-for="tool-tip-editar-datos-oportunidad" onClick={abrirModalCasos} ><i className="mdi mdi-file-edit-outline estilo_botones_gestion_caso"></i></Button>
											<ReactTooltip id="tool-tip-editar-datos-oportunidad" place="top" type="dark" effect="float">Editar Datos Oportunidad</ReactTooltip>
											<Button color="info" size="sm" data-tip data-for="tooltip-Actualizar-Documento" onClick={abrirModalCambioEstado} ><i className="mdi mdi-comment-arrow-right-outline estilo_botones_gestion_caso"></i></Button>
											<ReactTooltip id="tooltip-Actualizar-Documento" place="top" type="dark" effect="float">Cambiar Etapa Oportunidad</ReactTooltip>
										</div>
									</Col>
								</Row>
							</CardBody>
						</Card>
					</Col>
				</Row>
				<br></br>
				<Row>
					<Col xl={12} className="grid-margin">
						<Card>
							<CardBody>
								<Chip icon={<NoteAddIcon fontSize="small" />} label="Puedes dejar notas en esta sección" variant="outlined" />
									<TabContext value={value} >
										<Box sx={{ borderBottom: 1, borderColor: 'divider', maxWidth: { xs: 400, sm: 1000 },}} style={{margin:'0 auto 0 auto'}}>
											<TabList variant="scrollable"
        											scrollButtons onChange={handleChange}
															aria-label="visible arrows">
												<Tab label="TODAS LAS NOTAS" value="1" icon={<FormatListNumberedIcon />} iconPosition="end"/>
												<Tab label="Requerimiento" value="2" icon={<StartIcon />} iconPosition="end" />
												<Tab label="Cotizacion / Negociacion" value="3" icon={<GradingIcon />} iconPosition="end"/>
												<Tab label="Venta Cerrada" value="4" icon={<CheckCircleOutlineIcon />} iconPosition="end"/>
											</TabList>
										</Box>
										<TabPanel value="2" >
											<OportunidadNotasComponent estadoCaso={"REQUERIMIENTO"}></OportunidadNotasComponent>
										</TabPanel>
										<TabPanel value="3">
                      <OportunidadNotasComponent estadoCaso={"COTIZANDO"}></OportunidadNotasComponent>
										</TabPanel>
										<TabPanel value="4">
                      <OportunidadNotasComponent estadoCaso={"VENTA CERRADA"}></OportunidadNotasComponent>
										</TabPanel>
                    <TabPanel value="1">
                      <OportunidadNotasComponent estadoCaso={"TODOS"} final={etapaOportunidad}></OportunidadNotasComponent>
										</TabPanel>
									</TabContext>
							</CardBody>
						</Card>
					</Col>
				</Row>
        
				<Modal isOpen={modalEditarCompañia} style={modalStyles}>
				<ModalHeader>Listado de Compañias
					<Chip icon={<BusinessIcon fontSize="small" />} label="Selecciona la empresa para realizar el cambio" variant="outlined" />
				</ModalHeader>
          {cambiandoCompañia ? 
						<div>
							<CircularProgress color="inherit" style={{display:'block', margin:'0 auto 0 auto'}}/>
						</div> : <ModalBody>
            <FormGroup>
              <InputGroup>
                <Input type="text" onChange={(e)=> FiltrarCompañias(e.target.value)}></Input>
                <InputGroupText>
                  <SearchIcon fontSize="small"></SearchIcon>
                </InputGroupText>
              </InputGroup>
            </FormGroup>
            <List  dense sx={{ width: '100%', bgcolor: 'background.paper' }} style={{maxHeight:'300px', overflow:"scroll", overflowX:"hidden"}}>
              {compañias.map((compania, index)=>
                <Box key={index} >
                  <ListItemButton onClick={() => SeleccionarEmpresa(compania)}>
                    <ListItem alignItems="flex-start" disablePadding>
                      <ListItemAvatar>
                        <Avatar alt="Remy Sharp" src={"Images/Companies/"+compania.companyImage} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={compania.companyRazonSocial}
                        secondary={
                          <React.Fragment>
                            <Typography
                              sx={{ display: 'inline' }}
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {compania.companyNIT}
                            </Typography>
                            {" — " + compania.servicioDescripcion}
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                  </ListItemButton>
                  <Divider variant="inset" component="li" />
                </Box>
                )}
            </List>
          </ModalBody>}
          <ModalFooter>
            <Button onClick={abrirModalEditarCompañia} disabled={cambiandoCompañia} >Cerrar</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={modalCasos} style={modalStyles}>
          <ModalHeader>
            Modificar Datos Del Caso
          </ModalHeader>
          <ModalBody>
            <Form>
              <Label for="nombreClienteCaso">Nombre de la Oportunidad</Label>
              <Input type="text" id="nombreClienteCaso" value={nombreOportunidadEdicion} onChange={e => setNombreOportunidadEdicion(e.target.value)}/>
              <Label for="descripcionCaso">Descripcion</Label>
              <Input type="textarea" id="descripcionCaso" value={descripcionOportunidadEdicion} rows={7} onChange={e => setDescripcionOportunidadEdicion(e.target.value)}/>
              <FormGroup>
								<Label>Precio:</Label>
								<InputGroup>
									<InputGroupText >
										$
									</InputGroupText>
									<Input type="number" step="0.01" value={precioOportunidadParaEditar} onChange={e => setPrecioOportunidaParaEditar(e.target.value)}></Input>
								</InputGroup>
							</FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
              <Button color="primary" disabled={botonActualizarDatos} onClick={() => ActualizarDatosOportunidad()}>
								Actualizar {botonActualizarDatos? <CircularProgress size={14} color="inherit"/>: <></>}
								</Button>
              <Button color="secondary" onClick={abrirModalCasos}>Cerrar</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={modalCambioEstado} style={modalStyles}>
          <ModalHeader>
            Cambiar de etapa de la oportunidad
          </ModalHeader>
          <ModalBody>
            <Form>
              <Label for="nombreClienteCaso">Etapa Actual</Label>
              <Input type="text" id="nombreClienteCaso" value={etapaOportunidad} disabled />
              <Label for="descripcionCaso">Cambia de Etapa</Label>
              <CustomInput type="select" id="prioridadCaso" value={etapaOportunidadEdicion} name="prioridadCaso" onChange={e => setEtapaOportunidadEdicion(e.target.value)}>
                <option value="">Selecciona una etapa</option>
                <option value={"REQUERIMIENTO"}>REQUERIMIENTO</option>
                <option value={"COTIZANDO"}>COTIZACION / NEGOCIACION</option>
                <option value={"VENTA CERRADA"}>VENTA CERRADA</option>
              </CustomInput>
              { etapaOportunidadEdicion == "VENTA CERRADA" ? 
                <div>
                  <Label for="descripcionCaso">Estado de VENTA</Label>
                  <CustomInput type="select" id="prioridadCaso" value={estadoFinalVenta} name="prioridadCaso" onChange={e => setEstadoFinalVenta(e.target.value)}>
                    <option value="">Selecciona un estado</option>
                    <option value={"GANADA"}>GANADA</option>
                    <option value={"APLAZADA"}>APLAZADA</option>
                    <option value={"PERDIDA"}>PERDIDA</option>
                  </CustomInput>
                </div> : <></>
              }

              <Label for="nombreClienteCaso">Nota</Label>
              <Input type="textarea" rows="3" id="nombreClienteCaso" value={descripcionNota} placeholder="Debes dejar una nota al realizar el cambio de Etapa" onChange={(e) => setDescripcionNota(e.target.value)}/>
            </Form>
          </ModalBody>
          <ModalFooter>
              <Button color="primary" onClick={actualizarEtapaOportunidad} disabled={botonCambioEtapa}>
								Actualizar {botonCambioEtapa? <CircularProgress size={14} color="inherit"/>: <></>}
							</Button>
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

export default OportunidadDetallesComponent;