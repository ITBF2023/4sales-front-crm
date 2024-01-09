import Header from "../../../components/Headers/Header";
import React, { useLayoutEffect, useState} from "react";
import { Button, Card, CardBody, CardTitle, Col, Container, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";

import './IndexAdminEstilos.css';

import { getAsesoresActivos, getControlUser, getGraficoOportunidadEtapa, getMisMetasComerciales, getUserId, postMetaComercial } from '../../../Controller/Controller';
import { Pie } from 'react-chartjs-2';
import GraficosComponent from "../GraficosComponent/GraficosComponent";

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextareaAutosize from '@mui/base/TextareaAutosize';

import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { CircularProgress, useScrollTrigger } from "@mui/material";

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

import NotificacionComponent from "../../Usuarios/NotificacionComponent/NotificacionComponent";
import moment from "moment";
import 'moment/locale/es';

const IndexAdminComponent = ({isAdmin}) => {

  const [asesores, setAsesores ] = useState({});

  const getAsesores = async () => {
      const activo = await getAsesoresActivos();
      if(activo.asesoresActivos){
        setAsesores(activo)
      }else{
        setAsesores({})
      }
  }

  // Graficos
  const [cantidadRequerimiento, setCantidadRequerimiento] = useState(0);
  const [cantidadCotizando, setCantidadCotizando] = useState(0);
  const [cantidadVentaCerrada, setCantidadVentaCerrada] = useState(0);

  const [cantidadGanada, setCantidadGanada] = useState(0);
  const [cantidadVentaAplazada, setCantidadVentaAplazada] = useState(0);
  const [cantidadPerdida, setCantidadPerdida] = useState(0);

  const data = { 
    labels: ['REQUERIMIENTO', 'COTIZANDO', 'VENTA CERRADA'],
    datasets: [
      {
        label: '# of Votes',
        data: [cantidadRequerimiento, cantidadCotizando, cantidadVentaCerrada],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const dataVentas = { 
    labels: ['VENTA GANADA', 'VENTA APLAZADA', 'VENTA PERDIDA'],
    datasets: [
      {
        label: 'Cantidad',
        data: [cantidadGanada, cantidadVentaAplazada, cantidadPerdida],
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(255, 99, 132, 0.2)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // ******************************************************************
  // Meta Comercial

  const [modalMetaComercial, setModalMetaComercial] = useState(false)
  const [descripcionMeta, setDescripcionMeta] = useState("")
  const [fechaExpiracionMeta, setFechaExpiracionMeta] = useState("")
  const [visibilidadMeta, setVisibilidadMeta] = useState("TM")
  const [botonCrearMeta, setBotonCrearMeta] = useState(false)
  const [mostraNotificacionExito, setNotificacionExito] = useState(false)
  const [mostraNotificacionError, setNotificacionError] = useState(false)

  const AbrilModalMetaComercial = () => {
    setModalMetaComercial(!modalMetaComercial)
    setNotificacionExito(false)
    setNotificacionError(false)
    setBotonCrearMeta(false)
  }

  const crearMetaComercial = async () => {
    const formMeta = new FormData();
    formMeta.append('Descripcion',descripcionMeta);
    formMeta.append('FechaExpiracion',fechaExpiracionMeta);
    formMeta.append('Visibilidad',visibilidadMeta);
    formMeta.append('UsuarioId',getUserId());

    setBotonCrearMeta(true)
    const metaCreacion = await postMetaComercial(formMeta);
    if(metaCreacion.status === 201){
      setNotificacionExito(true)
    }else{
      setNotificacionError(true)
    }
    setTimeout(() => {
      AbrilModalMetaComercial()
      obtenerMisMetasComerciales()
    }, 3000);

  }

  // ******************************************************************


  // ******************************************************************
  // Mis Metas Comerciales

  const [misMetasComerciales, setMisMetasComerciales] = useState([]);

  const obtenerMisMetasComerciales = async () => {

    const metas = await getMisMetasComerciales(getUserId());
    if(metas[0]?.metaId){
      setMisMetasComerciales(metas)
    }else{
      setMisMetasComerciales([])
    }
  }

  const ObtenerGraficosEtapasOportunidad =  async() =>{
    const va = await getGraficoOportunidadEtapa();
    if(va.cantidadOportunidadesRequerimiento){
      setCantidadRequerimiento(va.cantidadOportunidadesRequerimiento)
      setCantidadCotizando(va.cantidadOportunidadesCotizacion)
      setCantidadVentaCerrada(va.cantidadOportunidadesVentaCerrada)
      setCantidadGanada(va.cantidadOportunidadesGanadas)
      setCantidadVentaAplazada(va.cantidadOportunidadesAplazada)
      setCantidadPerdida(va.cantidadOportunidadesPerdidas)
    }
  }


  useLayoutEffect(() => {
    if (isAdmin === false){
      window.location.href = "/403-Fordibben"
    }else{
      getAsesores();
      obtenerMisMetasComerciales();
      ObtenerGraficosEtapasOportunidad();
      moment.locale('es')
    }
  }, []);

  
  const modalStyles={
    top: '10%',
  }

  return (
  <>
    <Header></Header>
    <Container className="mt-5" fluid >                    
      <Row style={{marginBottom:'10px'}}>
        <Col lg="6" xl="6">
          <Card className="card-stats mb-4 mb-xl-0 index-card-bordes">
            <CardBody>
              <Row>
                <div className="col">
                  <CardTitle
                    tag="h5"
                    className="text-uppercase text-muted mb-0"
                  >
                    Meta Comercial ({misMetasComerciales.length})
                  </CardTitle>
                  <span className="h2 font-weight-bold mb-0">
                    {/* 350,897 */}
                  </span>
                </div>
                <Col className="col-auto">
                  <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                    {/* <i className="fas fa-chart-bar" /> */}
                    <i className="fa-solid fa-hand-point-up" />
                  </div>
                </Col>
              </Row><br></br>
              <Row className="style-scrollbar">
                {misMetasComerciales.map((meta, index) =>
                  <Col key={meta.metaId} lg="12" xl="12" >
                    <div style={{textAlign:'justify'}} >
                      {meta.descripcion}
                      <p className="mt-3 mb-0 text-muted text-sm">
                        <span className="text-nowrap">Del {moment(meta.fechaCreacion).format('DD MMMM YYYY')} al {moment(meta.fechaExpiracion).format('DD MMMM YYYY')}</span>
                      </p>
                    </div>
                    <hr></hr>
                  </Col>
                )}
              </Row>
              <Row>
                <div style={{margin:'0 auto 0 0'}}>
                   <p className="mt-3 mb-0 text-muted text-sm">
                    <span className="text-success mr-2">
                      <i className="fa fa-arrow-up" /> 100 %
                    </span>{" "}
                    <span className="text-nowrap">Por mes</span>
                  </p>
                </div>
                <div style={{display:'block',margin:'auto 0 auto 0'}}>
                  <Fab aria-label="add" className="bg-info" onClick={AbrilModalMetaComercial}>
                    <AddIcon />
                  </Fab>
                </div>
              </Row>
            </CardBody>
          </Card>
          <br></br>          
          <Card className="card-stats mb-4 mb-xl-0 index-card-bordes" >
            <p>En desarrollo</p>
            <CardBody style={{opacity:'0.3'}}>
              <Row>
                <div className="col">
                  <CardTitle
                    tag="h5"
                    className="text-uppercase text-muted mb-0"
                  >
                    Mensajes Recibos Pendientes
                  </CardTitle>
                  <span className="h2 font-weight-bold mb-0">3</span>
                </div>
                <Col className="col-auto">
                  <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                    <i className="fas fa-users" />
                  </div>
                </Col>
              </Row><br></br>
              <Row>
                <div className="col">
                  <CardTitle
                    tag="h5"
                    className="text-uppercase text-muted mb-0"
                  >
                    Mensajes Totales Recibidos
                  </CardTitle>
                  <span className="h2 font-weight-bold mb-0">10</span>
                </div>
              </Row>
              <p className="mt-3 mb-0 text-muted text-sm">
                <span className="text-success mr-2">
                  <i className="fas fa-arrow-up" /> 70%
                </span>{" "}
                <span className="text-nowrap">Por semana</span>
              </p>
            </CardBody>
          </Card>
        </Col>
        <Col lg="6" xl="6">
          <Row>
            <Col lg="6" xl="6">
              <Card className="card-stats mb-4 mb-xl-0 index-card-bordes">
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle
                        tag="h5"
                        className="text-uppercase text-muted mb-0"
                      >
                        Asesores Activos
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">{asesores.asesoresActivos}</span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                        <i className="fas fa-chart-pie" />
                      </div>
                    </Col>
                  </Row>
                  <p className="mt-3 mb-0 text-muted text-sm">
                    <span className="text-danger mr-2">
                      {/* <i className="fas fa-arrow-down" /> 3.48% */}
                    </span><br></br>
                    <span className="text-nowrap">Por semana</span>
                  </p>
                </CardBody>
              </Card>
            </Col>
            <Col lg="6" xl="6">
              <Card className="card-stats mb-4 mb-xl-0 index-card-bordes">
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle
                        tag="h5"
                        className="text-uppercase text-muted mb-0"
                      >
                        Asesores Totales
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">{asesores.asesoresTotales}</span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                        <i className="fas fa-chart-pie" />
                      </div>
                    </Col>
                  </Row>
                  <p className="mt-3 mb-0 text-muted text-sm">
                    <span className="text-danger mr-2">
                      <i className="fas fa-arrow-down" /> {parseFloat((asesores.asesoresTotales-asesores.asesoresActivos)*100/asesores.asesoresTotales).toFixed(2)}%
                    </span><br></br>
                    <span className="text-nowrap">Por semana</span>
                  </p>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <br></br>
          <Card className="card-stats mb-4 mb-xl-0 index-card-bordes">
            <CardBody>
              <Row>
                <div className="col">
                  <CardTitle
                    tag="h5"
                    className="text-uppercase text-muted mb-0"
                  >
                    Grafica de Oportunidades
                  </CardTitle>
                  {/* <span className="text-nowrap">Por semana</span> */}
                </div>
                <Col className="col-auto">
                  <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                    <i className="fas fa-chart-pie" />
                  </div>
                </Col>
              </Row>
              <Row>
                <Pie data={data} disabled={true} />
              </Row>
              {/* <p className="mt-3 mb-0 text-muted text-sm">
                <span className="text-success mr-2">
                  <i className="fas fa-arrow-up" /> 12%
                </span>{" "}
                <span className="text-nowrap">Por semana</span>
              </p> */}
            </CardBody>
          </Card>
          <br></br>
          <Card className="card-stats mb-4 mb-xl-0 index-card-bordes">
            <CardBody>
              <Row>
                <div className="col">
                  <CardTitle
                    tag="h5"
                    className="text-uppercase text-muted mb-0"
                  >
                    Grafica de Ventas
                  </CardTitle>
                  {/* <span className="text-nowrap">Por semana</span> */}
                </div>
                <Col className="col-auto">
                  <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                    <i className="fas fa-chart-pie" />
                  </div>
                </Col>
              </Row>
              <Row>
                <Pie data={dataVentas} disabled={true} />
              </Row>
              {/* <p className="mt-3 mb-0 text-muted text-sm">
                <span className="text-success mr-2">
                  <i className="fas fa-arrow-up" /> 12%
                </span>{" "}
                <span className="text-nowrap">Por semana</span>
              </p> */}
            </CardBody>
          </Card>
          <Row></Row>
        </Col>
      </Row>
      <GraficosComponent></GraficosComponent>
    </Container>
    <Modal isOpen={modalMetaComercial} style={modalStyles}>
      <ModalHeader>Crear Nueva Meta Comercial</ModalHeader>
      <ModalBody>
        <FormGroup>
          <Label>Descripcion</Label>
          {/* <Input type="textarea" rows="3" placeholder="Ingresa la descripcion" id="TexareaDescripcion"></Input> */}
          <TextareaAutosize className="InputIndexAdminComponent" minRows={3} maxRows={4} placeholder="Ingresa la descripcion" 
          onChange={(e) => setDescripcionMeta(e.target.value)}></TextareaAutosize>
          <Label>Fecha de Expiración</Label>
          <Input type="datetime-local" onChange={(e) => setFechaExpiracionMeta(e.target.value)}></Input>
          <Label>¿Quien puede ver esta meta?</Label>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="TM"
            name="radio-buttons-group"
            onChange={(e) => setVisibilidadMeta(e.target.value)}
          >
            <FormControlLabel value="TM" control={<Radio />} label="Todo el Mundo" style={{marginTop:'0', marginBottom:'0'}} />
            <FormControlLabel value="SC" control={<Radio />} label="Solo Comercial" style={{marginTop:'0', marginBottom:'0'}}/>
            <FormControlLabel value="SY" control={<Radio />} label="Solo Yo" style={{marginTop:'0', marginBottom:'0'}}/>
          </RadioGroup>
        </FormGroup>
        <div style={{float:'right'}}>
          <Button onClick={AbrilModalMetaComercial}>Cancelar</Button>
          <Button color="primary" disabled={botonCrearMeta} onClick={crearMetaComercial}>
            {botonCrearMeta ? <>Creando <CircularProgress size={17} color="inherit" /></>: <>Crear</>}
          </Button>
        </div>
      </ModalBody>
      <NotificacionComponent mensaje={"La meta comercial se creo correctamente"} strong={"Genial!"} tipo={"success"} proceso={"Completo!"} 
      mostrar={mostraNotificacionExito} setMostrar={setNotificacionExito}></NotificacionComponent>
      <NotificacionComponent mensaje={"Ocurrio un error"} strong={"Ups!"} tipo={"error"} proceso={"Error"} mostrar={mostraNotificacionError} 
      setMostrar={setNotificacionError}></NotificacionComponent>
    </Modal>
  </>
  )
}

export default IndexAdminComponent;