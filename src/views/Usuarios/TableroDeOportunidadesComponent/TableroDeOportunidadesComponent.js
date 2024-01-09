import React, { useLayoutEffect, useState} from "react";
        

import Header from "../../../components/Headers/Header";

import { useParams } from "react-router-dom";

import {Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, Container, Row, Col, Card, CardBody, CardTitle, CustomInput, CardHeader} from 'reactstrap';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CancelIcon from '@mui/icons-material/Cancel';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import Tooltip from '@mui/material/Tooltip';

import './TableroDeOportunidades.css'

import { getMisOportunidadesGestion, deleteMiOportunidad, getBitacoraByCompany, getUserId, postBitacora, updateBitacora, deleteBitacora, 
  postDocumentosBitacora, getCountDocumentBitacora, getTiposBitacora} from '../../../Controller/Controller';
import { ListItemButton } from "@mui/material";
import { Link } from "react-router-dom/cjs/react-router-dom";

import Icon from '@mdi/react';
import { mdiHandshake } from '@mdi/js';
import { mdiDeleteOutline    } from '@mdi/js';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import ListItemIcon from '@mui/material/ListItemIcon';

const TableroDeOportunidadesComponent = () => {

  let path = useParams()
  const handleDelete = () =>{

  }

  const [oportunidadesRequerimiento, setOportunidadesRequerimiento] = useState([]);
  const [oportunidadesCotizacion, setOportunidadesCotizacion] = useState([]);
  const [oportunidadesVentaCerrada, setOportunidadesVentaCerrada] = useState([]);
  const [oportunidadesCantidadRequerimiento, setOportunidadesCantidadRequerimiento] = useState(0);
  const [oportunidadesCantidadCotizacion, setOportunidadesCantidadCotizacion] = useState(0);
  const [oportunidadesCantidadVentaCerrada, setOportunidadesCantidadVentaCerrada] = useState(0);
  
  const [precioRequerimientosTotal, setPrecioRequerimientosTotal] = useState(0);
  const [precioCotizandoTotal, setPrecioCotizandoTotal] = useState(0);
  const [precioVentaCerradaTotal, setPrecioVentaCerradaTotal] = useState(0);

  const FormatoMoneda = (valorPrecio) =>{
    return valorPrecio.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
  }


  const ObtenerMisOportunidades = async() => {
    const oportunidad = await getMisOportunidadesGestion();
    setPrecioRequerimientosTotal(oportunidad[0].precioTotal != null ? FormatoMoneda(oportunidad[0].precioTotal) : 0 )
    setPrecioCotizandoTotal(oportunidad[1].precioTotal != null ? FormatoMoneda(oportunidad[1].precioTotal) : 0 )
    setPrecioVentaCerradaTotal(oportunidad[2].precioTotal != null ? FormatoMoneda(oportunidad[2].precioTotal) : 0 )
    setOportunidadesCantidadRequerimiento(oportunidad[0].cantidadOportunidades != null ? oportunidad[0].cantidadOportunidades : 0 )
    setOportunidadesCantidadCotizacion(oportunidad[1].cantidadOportunidades != null ? oportunidad[1].cantidadOportunidades : 0 )
    setOportunidadesCantidadVentaCerrada(oportunidad[2].cantidadOportunidades != null ? oportunidad[2].cantidadOportunidades : 0 )
    setOportunidadesRequerimiento(oportunidad[0].estadoOportunidad == "REQUERIMIENTO" ? oportunidad[0].oportunidades : [] )
    setOportunidadesCotizacion(oportunidad[1].estadoOportunidad == "COTIZANDO" ? oportunidad[1].oportunidades : [] )
    setOportunidadesVentaCerrada(oportunidad[2].estadoOportunidad == "VENTA CERRADA" ? oportunidad[2].oportunidades : [] )
  }

  // ***********************************************************************************************************************************
  // Funcion Eliminar ********************************************************************************************************************

  const EliminarOportunidad = async(idOportunidadEliminar) =>{
    if(window.confirm("Esta seguro de eliminar esta oportunidad?")){
      const borrar = await deleteMiOportunidad(idOportunidadEliminar)
      if(borrar.status === 201){
        alert("Oportunidad Eliminada")
        ObtenerMisOportunidades();
      }
    }
  };
  // ***********************************************************************************************************************************


  useLayoutEffect(() => {
    // console.log("Hola mundo ")
    ObtenerMisOportunidades()
  }, []);
  // const onRowClicked = (row, event) => {
  //   // console.log(row)
  //   // console.log(event)
  // };

  

  return(
    <>
    <Header></Header>
    <Container className="mt-5" fluid>
      <Row>
        <Col xl={4}>
          <Button style={{borderRadius:'50px', width:'100%', display:'flex', border:'1px solid gray'}}>
            <Avatar style={{float:'left'}}>1</Avatar>
            <div className="estados-Oportunidad-Cabeceras" >Requerimiento ( {oportunidadesCantidadRequerimiento} )</div>
            <ArrowForwardIosIcon className="estados-Oportunidad-Cabeceras"  style={{float:'right'}} />
          </Button>
          <Card>
            <CardHeader>
              <div className="contenedor-card-header-estados">
                <div className="estados-Oportunidad-Cabeceras">
                  COL$ {precioRequerimientosTotal}
                </div>
                <ArrowForwardIosIcon style={{float:'right'}} fontSize="large"/>
              </div>
            </CardHeader>
            <CardBody style={{maxHeight:"400px", overflow:"scroll", overflowX:"hidden"}}>
              <List sx={{ width: '100%', maxWidth: '100%', bgcolor: 'background.paper' }}>
                { oportunidadesRequerimiento.map((oportuni, index) =>
                <div key={index}>
                  <ListItem alignItems="flex-start">
                    <Link to={"DetallesOportunidad/"+oportuni.oportunidadId}>
                      <ListItemButton>
                        <ListItemAvatar>
                          <Avatar alt="ImagenCompany" src={"Images/Companies/"+ oportuni.companyImage} />
                        </ListItemAvatar>

                        <ListItemText
                          primary={oportuni.nombreOportunidad}
                          secondary={
                            <React.Fragment>
                              COL$ {FormatoMoneda(oportuni.precio)} <br></br>
                              <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                              {oportuni.companyRazonSocial}
                              </Typography>
                              {" — " + oportuni.servicioDescripcion}
                            </React.Fragment>
                          }
                        />
                      </ListItemButton>
                    </Link>
                    <ListItemAvatar>
                      <Tooltip title="Eliminar Oportunidad" arrow>
                        <DeleteOutlineIcon className="boton-eliminar-oportunidad" onClick={() => EliminarOportunidad(oportuni.oportunidadId)} style={{float:'right'}} sx={{ color:'#000000' }} fontSize="large"/>
                      </Tooltip>
                    </ListItemAvatar>
                  </ListItem>
                  <Divider />
                </div>
                )}
              </List>
            </CardBody>
          </Card>
        </Col>
        <Col xl={4}>
          <Button style={{borderRadius:'50px', width:'100%', display:'flex', border:'1px solid gray'}}>
            <Avatar style={{float:'left'}}>2</Avatar>
            <div className="estados-Oportunidad-Cabeceras" >COTIZACION / NEGOCIACION ( {oportunidadesCantidadCotizacion} )</div>
            <ArrowForwardIosIcon className="estados-Oportunidad-Cabeceras"  style={{float:'right'}} />
          </Button>
          <Card>
            <CardHeader>
              <div className="contenedor-card-header-estados">
                <div className="estados-Oportunidad-Cabeceras">
                COL$ {precioCotizandoTotal}
                </div>
                <ArrowForwardIosIcon style={{float:'right'}} fontSize="large"/>
              </div>
            </CardHeader>
            <CardBody style={{maxHeight:"400px", overflow:"scroll", overflowX:"hidden"}}>
              <List sx={{ width: '100%', maxWidth: '100%', bgcolor: 'background.paper' }}>
                { oportunidadesCotizacion.map((oportuni, index) => 
                <div key={index}>
                  <ListItem alignItems="flex-start">
                    <Link to={"DetallesOportunidad/"+oportuni.oportunidadId}>
                      <ListItemButton>
                        <ListItemAvatar>
                          <Avatar alt="ImagenCompany" src={"Images/Companies/"+ oportuni.companyImage} />
                        </ListItemAvatar>

                        <ListItemText
                          primary={oportuni.nombreOportunidad}
                          secondary={
                            <React.Fragment>
                              COL$ {FormatoMoneda(oportuni.precio)} <br></br>
                              <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                              {oportuni.companyRazonSocial}
                              </Typography>
                              {" — " + oportuni.servicioDescripcion}
                            </React.Fragment>
                          }
                        />
                      </ListItemButton>
                    </Link>
                    <ListItemAvatar>
                      <Tooltip title="Eliminar Oportunidad" arrow>
                        <DeleteOutlineIcon className="boton-eliminar-oportunidad" onClick={() => EliminarOportunidad(oportuni.oportunidadId)} style={{float:'right'}} sx={{ color:'#000000' }} fontSize="large"/>
                      </Tooltip>
                    </ListItemAvatar>
                  </ListItem>
                  <Divider />
                </div>
                )}
              </List>
            </CardBody>
          </Card>
        </Col>
        <Col xl={4}> 
          <Button style={{borderRadius:'50px', width:'100%', display:'flex', border:'1px solid gray'}}>
            <Avatar style={{float:'left'}}>3</Avatar>
            <div className="estados-Oportunidad-Cabeceras" >VENTA CERRADA ( {oportunidadesCantidadVentaCerrada} )</div>
            <ArrowForwardIosIcon className="estados-Oportunidad-Cabeceras"  style={{float:'right'}} />
          </Button>
          <Card>
            <CardHeader>
              <div className="contenedor-card-header-estados">
                <div className="estados-Oportunidad-Cabeceras">
                COL$ {precioVentaCerradaTotal}
                </div>
                <Icon path={mdiHandshake} size={1.5} />
                {/* <EmojiEventsIcon style={{float:'right'}} fontSize="large"/> */}
              </div>
            </CardHeader>
            <CardBody style={{maxHeight:"400px", overflow:"scroll", overflowX:"hidden"}}>
              <List sx={{ width: '100%', maxWidth: '100%', bgcolor: 'background.paper' }}>
                { oportunidadesVentaCerrada.map((oportuni, index) => 
                <div key={index}>
                  <ListItem alignItems="flex-start">
                    <Tooltip title={"ESTADO FINAL: VENTA " + oportuni.estadoFinalVenta} followCursor>
                    <Link to={"DetallesOportunidad/"+oportuni.oportunidadId}>
                      <ListItemButton>
                        <ListItemAvatar>
                          <Avatar alt="ImagenCompany" src={"Images/Companies/"+ oportuni.companyImage} />
                        </ListItemAvatar>

                        <ListItemText
                          primary={oportuni.nombreOportunidad}
                          secondary={
                            <React.Fragment>
                              COL$ {FormatoMoneda(oportuni.precio)} <br></br>
                              <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                              {oportuni.companyRazonSocial}
                              </Typography>
                              {" — " + oportuni.servicioDescripcion}
                            </React.Fragment>
                          }
                        />
                      </ListItemButton>
                    </Link>
                    </Tooltip>

                    <ListItemAvatar>
                    <Tooltip title={"ESTADO FINAL: VENTA " + oportuni.estadoFinalVenta} followCursor>
                      {oportuni.estadoFinalVenta == "GANADA" ? <EmojiEventsIcon sx={{ color:'#E2D100', float:'right', padding:'3px' }} fontSize="large" /> : 
                      oportuni.estadoFinalVenta == "APLAZADA" ? <MoreTimeIcon sx={{ color:'#98DDE1', float:'right', padding:'3px' }} fontSize="large" /> : 
                      oportuni.estadoFinalVenta == "PERDIDA" ? <CancelIcon sx={{ color:'#F15D5D', float:'right', padding:'3px' }} fontSize="large" />: <></>}
                    </Tooltip>
                      <br></br>
                      <Tooltip title="Eliminar Oportunidad" arrow>
                        <DeleteOutlineIcon onClick={() => EliminarOportunidad(oportuni.oportunidadId)} style={{float:'right'}} sx={{ color:'#000000' }} fontSize="large" className="boton-eliminar-oportunidad"/>
                      </Tooltip>
                    </ListItemAvatar>
                  </ListItem>
                  <Divider />
                </div>
                )}
              </List>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
    </>
  )
}

export default TableroDeOportunidadesComponent;