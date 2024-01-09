import React, { Fragment, forwardRef, useLayoutEffect, useState } from "react";
import moment from "moment";

import { Button, Col, Container, FormGroup, Form, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row, InputGroup, InputGroupText } from 'reactstrap';

import Header from "../../../components/Headers/Header";

import { useParams } from "react-router-dom";

import { getUserId, postNuevaOportunidad, cambiarEstadoGestionCaso, getMisCompaniasGestionOportunidades } from '../../../Controller/Controller';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import SearchIcon from '@mui/icons-material/Search';
import Slide from '@mui/material/Slide';

import './GestionOportunidades.css'

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import StarIcon from '@mui/icons-material/Star';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const GestionDeOportunidadesComponent = () => {

  let path = useParams()
  const history = useHistory ();

  // ************************************************************************************************
  // Funciones dee Notificacion

  const [mostrarNotificacion, setMostrarNotificacion] = useState(false)
  const [mensajeNotificacionMostrar, setmensajeNotificacionMostrar] = useState("")
  
  const TransitionUp = (props) => {
    return <Slide {...props} direction="up" timeout={3000} />;
  }

  const cerrarNotificacion = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setMostrarNotificacion(false);
  };

  // ************************************************************************************************
  // Funcion Crear Nueva Oportunidad

  const [nombreEmpresa, setNombreEmpresa] = useState("")
  const [nombreCompañiaSeleccionado, setNombreCompañiaSeleccionado] = useState("")
  const [nombreOportunidad, setNombreOportunidad] = useState("")
  const [descripcionRequerimientos, setDescripcionRequerimientos] = useState("")
  const [precio, setPrecio] = useState("")
  const [etapa, setEtapa] = useState("REQUERIMIENTO")

  const CrearCaso = async(e) =>{
    e.preventDefault();

    const form = new FormData();
    form.append('NombreEmpresa',nombreCompañiaSeleccionado);
    form.append('NombreOportunidad',nombreOportunidad);
    form.append('DescripcionRequerimiento',descripcionRequerimientos);
    form.append('Precio',precio);
    form.append('EtapaOportunidad',etapa);
    form.append('UsuarioId',getUserId());
    form.append('CompañiaServicioId',compañiaServicioIdSeleccionado);

    const oportunidadCreada = await postNuevaOportunidad(form);

    if(oportunidadCreada.status === 201){
      setMostrarNotificacion(true)
      // setTimeout(() => {
      //     history.push("/ITBF/crm-itbf");
      // }, 5000);
    }else{
      alert("Ocurrio un problema")
    }
  }

  // ************************************************************************************************



  // ************************************************************************************************
  // Obtener Mis Compañias

  const [compañias, setCompañias] = useState([])
  const [compañiasRespaldo, setCompañiasRespaldo] = useState([])
  const [modalListado, setModalListado] = useState(false)
  const [compañiaServicioIdSeleccionado, setCompañiaServicioIdSeleccionado] = useState("")
  

  const ObtenerMisCompañias = async() => {
    const misComp = await getMisCompaniasGestionOportunidades();
    // console.log(misComp)
    setCompañias(misComp[0].compañiaServiciosId ? misComp : [])
    setCompañiasRespaldo(misComp[0].compañiaServiciosId ? misComp : [])
  }

  const MostrarListadoCompanias = () =>{
    setModalListado(!modalListado)
    setCompañias(compañiasRespaldo)
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

  const SeleccionarEmpresa = (CompaniaSeleccionada) => {
    setCompañiaServicioIdSeleccionado(CompaniaSeleccionada.compañiaServiciosId)
    setNombreCompañiaSeleccionado(CompaniaSeleccionada.companyRazonSocial)
    setModalListado(!modalListado)
  }

  // ************************************************************************************************



  const modalStyles={
    position: "absolute",
    top: '60%',
    left: '50%',
    width: '50%',
    transform: 'translate(-50%, -80%)'
  }

  useLayoutEffect(() => {
    ObtenerMisCompañias()
  }, []);




  return (
    <>
      <Header></Header>
      <Container className="mt-5" fluid>

        <div className="container-fluid page-body-wrapper">
          <div className="main-panel">
            <div className="content-wrapper">
              <div className="card">
                <div className="card-body" >
                  <div style={{textAlign:"center"}}>
                    <h1>Nueva Oportunidad</h1>
                  </div>
                  <br></br>
                  <Form onSubmit={(e) => CrearCaso(e)} >
                    <Row>
                      <Col xl="6">
                        <FormGroup>
                          <Label>Nombre de la empresa:</Label>
                          <InputGroup>
                            <Input type="text" disabled={true} value={nombreCompañiaSeleccionado}></Input>
                            <Button className="boton-busqueda-gestion" onClick={MostrarListadoCompanias}>
                              <SearchIcon fontSize="small"></SearchIcon>
                            </Button>
                          </InputGroup>
                        </FormGroup>
                      </Col>
                      <Col xl="6">
                        <FormGroup>
                          <Label>Nombre de la oportunidad:</Label>
                          <Input type="text" onChange={(e) => setNombreOportunidad(e.target.value)} ></Input>
                        </FormGroup>
                      </Col>
                      <Col xl="12">
                        <FormGroup>
                          <Label>Descripcion de los requirimientos:</Label>
                          <Input type="textarea" rows="5" onChange={(e) => setDescripcionRequerimientos(e.target.value)} ></Input>
                        </FormGroup>
                      </Col>
                      <Col xl="6">
                        <FormGroup>
                          <Label>Precio:</Label>
                          <InputGroup>
                            <InputGroupText >
                              $
                            </InputGroupText>
                            <Input type="number" step="0.01" onChange={(e) => setPrecio(e.target.value)} ></Input>
                          </InputGroup>
                        </FormGroup>
                      </Col>
                      <Col xl="6">
                        <FormGroup>
                          <Label>Etapa de la oportunidad:</Label>
                          <Tooltip title="Al crear una oportunidad esta siempre se iniciará en el estado de REQUERIMIENTO" followCursor>
                            <Box>
                              <Input type="text"  value={etapa} onChange={(e) => setEtapa(e.target.value)} disabled></Input>
                            </Box>
                          </Tooltip>
                        </FormGroup>
                      </Col>
                      <Col xl="12">
                        <Button type={"submit"}> Crear Oportunidad</Button>
                      </Col>
                    </Row>
                  </Form>
                </div>

              </div>
            </div>
          </div>
        </div>
        <Modal isOpen={modalListado} style={modalStyles}>
          <ModalHeader>Listado de Compañias</ModalHeader>
          <ModalBody>
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

          </ModalBody>
          <ModalFooter>
            <Button onClick={MostrarListadoCompanias}>Cerrar</Button>
          </ModalFooter>
        </Modal>

        <Snackbar
        anchorOrigin={{ vertical:'top', horizontal:'center' }}
        autoHideDuration={4000}
        TransitionComponent={TransitionUp}
        open={mostrarNotificacion}
        onClose={cerrarNotificacion}
        // message="I love snacks"
        key={'top-center'}>
          <Alert severity="success" onClose={() => cerrarNotificacion()}>
            <AlertTitle>Completo</AlertTitle>
            La oportunidad se creo exitosamente — <strong>Genial!</strong>
          </Alert>
          
        </Snackbar>

      </Container>
    </>
    
  );
}

export default GestionDeOportunidadesComponent;