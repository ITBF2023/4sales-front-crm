import React, { useLayoutEffect, useState } from 'react';
// reactstrap components
import { Button, Card, CardBody,  Container,Row } from "reactstrap";
import { DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { makeStyles } from "@material-ui/core/styles";

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { esES } from '@mui/x-date-pickers/locales';

import Header from "../components/Headers/Header.js";
import moment from 'moment';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import 'moment/locale/es';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import Menu from '@mui/material/Menu';
import { MonthCalendar } from '@mui/x-date-pickers/MonthCalendar';
import { YearCalendar } from '@mui/x-date-pickers/YearCalendar';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
// import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import {Button as ButtonMUI, ClickAwayListener}  from '@mui/material';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import AssignmentIcon from '@mui/icons-material/Assignment';

import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';

import ListItemAvatar from '@mui/material/ListItemAvatar';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import { styled } from '@mui/material/styles';
import { Chip} from '@mui/material';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';


import { getMisEventosCalendarioPorMes, getUserId} from '../Controller/Controller.js';
import CrearEventoComponent from './Usuarios/IndexComponents/CrearEventoComponent.js';
import './index.css'
import Typography from '@mui/material/Typography';
import MostarEventoComponent from './Usuarios/IndexComponents/MostrarEventoComponent.js';
import MostrarEventosDiaDrawer from './Usuarios/IndexComponents/MostrarEventosDiasDrawer.js';
import EditarEventoComponent from './Usuarios/IndexComponents/EditarEventoComponent.js';

const Index = (props) => {

  // const { height, width } = useWindowDimensions();

  var mes = moment(new Date(Date.now())).format('MMMM');

  const [diasCalendarioMostrar, setDiasCalendarioMostrar] = useState([])

  const [fechaDatePickerActual, setFechaDatePickerActual] = useState(moment(new Date(Date.now())))

  const [diaActual, setDiaActual] = useState(new Date(Date.now()).getDate()) 
  const [mesActual, setMesActual] = useState(new Date(Date.now()).getMonth()) 
  const [añoActual, setAñoActual] = useState(new Date(Date.now()).getFullYear())

  // const [diaMostrar, setDiaMostrar] = useState(new Date(Date.now()).getDate()) 
  const [mesMostrar, setMesMostrar] = useState(new Date(Date.now()).getMonth()) 
  const [mesDescripcionMostrar, setMesDescripcionMostrar] = useState(mes.charAt(0).toUpperCase() + mes.slice(1)) 
  const [añoMostrar, setAñoMostrar] = useState(new Date(Date.now()).getFullYear())
  
  const fechaActual = diaActual+"-"+mesActual+"-"+añoActual;
  const fechaMostrar = (dia, mes) => {
    return dia+"-"+mes+"-"+añoMostrar
  }

  const theme = createTheme(
    {
      palette: {
        primary: { main: '#1976d2' },
      },
    },
    esES, 
  );

  // Obtener Eventos *****************************************************************************
  const [eventos, setEventos] = useState([]);

  const ObtenerEventosPorMes = async(mesRecibido) => {
    const eventosObtenidosss = await getMisEventosCalendarioPorMes(getUserId(),(mesRecibido+1));
    // console.log(eventosObtenidosss)
    if(eventosObtenidosss[0]?.eventoId){
      setEventos(eventosObtenidosss)
    }
    CerrarDrawer()
  }

  // *********************************************************************************************


  const ObtenerCalendarioActual = (fechaRecibida) => {
    // console.log("cargar")
    const diasSemana = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]
    const fecha = fechaRecibida
    const dia = fecha.getDate();
    const mes = fecha.getMonth();
    const año = fecha.getFullYear();

    const fechaInicial = new Date(año, mes, 1)

    var diaFechaInicial = fechaInicial.toString().substring(0,3)
    var ultimoDiaMesAnterior = new Date(fecha.getFullYear(), fecha.getMonth(), 0)
    var ultimoDiaMesActual = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0)
    // console.log(diasSemana.indexOf(diaFechaInicial))
    // console.log(diaFinalMesAnterior,moment(diaFinalMesAnterior))
    // console.log(ultimoDiaMesActual.getDate())

    var diasLlenarCalendario = []
    var bucle = true;
    var index = 1;
    var indexPrimerasFechasProximoMes = 1;
    var fechainicialbucle = (ultimoDiaMesAnterior.getDate())-(diasSemana.indexOf(diaFechaInicial))+1
    var numeroMaximoVueltas = 0;
    // console.log(bucle,index, fechainicialbucle)

    while(bucle){
      numeroMaximoVueltas++;
      // console.log(bucle,index, fechainicialbucle)
      if(fechainicialbucle <= ultimoDiaMesAnterior.getDate()){
        diasLlenarCalendario.push({"dia": fechainicialbucle, "mes":mes-1});
        fechainicialbucle++;
      }else{
        if(index <= ultimoDiaMesActual.getDate()){
          diasLlenarCalendario.push({"dia": index, "mes":mes});
          index ++;
        }
      }

      if(index > ultimoDiaMesActual.getDate()){
        if(diasLlenarCalendario.length%7 == 0){
          // console.log("Termino")
          bucle = false;
          break;
        }else{
          diasLlenarCalendario.push({"dia": indexPrimerasFechasProximoMes, "mes":mes+1});
          indexPrimerasFechasProximoMes ++;
        }
      }
      if(numeroMaximoVueltas == 50){
        bucle = false
      }
    }
    // console.log(diasLlenarCalendario)
    if(diasLlenarCalendario.length === 42){
      var element = document.getElementById("calendario-mes-mostrar");
      element.classList.remove("container-grid-rows-5");
      element.classList.add("container-grid-rows-6");
    }else{
      var element = document.getElementById("calendario-mes-mostrar");
      element.classList.remove("container-grid-rows-6");
      element.classList.add("container-grid-rows-5");
    }
    setDiasCalendarioMostrar(diasLlenarCalendario)
    ObtenerEventosPorMes(mes);
    // console.log( (moment(Date.parse(fechaInicial)).format("DD")).toString())
    // console.log(dia, mes, año)
    // console.log( (moment(Date.parse(fecha)).format("dddd")).toString())
  }

  const seleccionarFecha = (fecha) => {
    var fechaAnteriorSeleccionada = document.getElementsByClassName("fecha-seleccionada")
    var longitud = fechaAnteriorSeleccionada.length
    // console.log(fechaAnteriorSeleccionada)
    // if(fechaAnteriorSeleccionada[0]){fechaAnteriorSeleccionada[0].classList.remove("fecha-seleccionada")}
    // console.log(fechaAnteriorSeleccionada)
    for(var contador = 0; contador < longitud ; contador++){
      // console.log(fechaAnteriorSeleccionada[contador], contador, longitud)
      fechaAnteriorSeleccionada[0].classList.remove("fecha-seleccionada");
    }
    var fechaSelecciona = document.getElementById(fecha.getDate()+"-"+fecha.getMonth()+"-"+fecha.getFullYear())
    fechaSelecciona.classList.add("fecha-seleccionada")
  }

  const ObtenerFechaSeleccionada = (valor, fechaRecibida) => {
    setFechaDatePickerActual(valor)
    var fecha = new Date(fechaRecibida);
    if(fecha.getMonth() != mesMostrar || fecha.getFullYear() != añoMostrar){
      ObtenerCalendarioActual(fecha)
    }
    setMesMostrar(fecha.getMonth())
    var esco = moment(fecha).format('MMMM')
    setAñoMostrar(fecha.getFullYear())
    setMesDescripcionMostrar(esco.charAt(0).toUpperCase() + esco.slice(1))
    setTimeout(() => {
      seleccionarFecha(fecha);
    }, "200");
  }

  const FechaCalendarioSeleccionado = (diaRecibido, mesRecibido) =>{
    // console.log(diaRecibido+"-"+mesRecibido+"-"+añoMostrar)
    setFechaDatePickerActual(moment(new Date(añoMostrar,mesRecibido,diaRecibido)));
    ObtenerFechaSeleccionada(moment(new Date(añoMostrar,mesRecibido,diaRecibido)),new Date(añoMostrar,mesRecibido,diaRecibido));
    CambiarDatosMostrarDrawer(diaRecibido, mesRecibido)
  }

  const EventoSeleccionado = () =>{
    // console.log("Evento Seleccionado")
  }

  const FechaActualSeleccionar = () =>{
    setFechaDatePickerActual(moment(new Date(Date.now())))
    ObtenerFechaSeleccionada(moment(new Date(Date.now())),new Date(Date.now()))
  }

  // Cambiar Mes ***************************************************************************
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClose = (event) => {
    if(event._d){
      setFechaDatePickerActual(event)
      ObtenerFechaSeleccionada(event,new Date(event._d))
      // console.log(event._d)
    }
    setAnchorEl(null);
  };

  const CambiarMesCalendario = (event) => {
    setAnchorEl(event.currentTarget);
  }
  // *****************************************************************************************

  // Cambiar Año ***************************************************************************
  const [anchorElAño, setAnchorElAño] = useState(null);
  const openYearCalendar = Boolean(anchorElAño);
  const handleCloseYearCalendar = (event) => {
    if(event._d){
      setFechaDatePickerActual(event)
      ObtenerFechaSeleccionada(event,new Date(event._d))
      // console.log(event._d)
    }
    setAnchorElAño(null);
  };
  const CambiarAñoCalendario = (event) => {
    setAnchorElAño(event.currentTarget);
  }
  // *****************************************************************************************

  // Cambiar Mes Adelante ***************************************************************************
  const CambiarMesAumentar = () => {
    setFechaDatePickerActual(moment(new Date(añoMostrar,mesMostrar+1,1)))
    ObtenerFechaSeleccionada(moment(new Date(añoMostrar,mesMostrar+1,1)),new Date(añoMostrar,mesMostrar+1,1))
  };
  // *************************************************************************************************
  
  // Cambiar Mes Atras *******************************************************************************
  const CambiarMesReducir = () => {
    setFechaDatePickerActual(moment(new Date(añoMostrar,mesMostrar-1,1)))
    ObtenerFechaSeleccionada(moment(new Date(añoMostrar,mesMostrar-1,1)),new Date(añoMostrar,mesMostrar-1,1))
  };
  // *************************************************************************************************


  // Mostrar Eventos Drawer *******************************************************************************
  const [mostrarDrawer, setMostrarDrawer] = useState(false)
  const [eventosMostrarDrawer, setEventoMostrarDrawer] = useState([])
  // const [estadoDrawer, setEstadoDrawer] = useState({display: 'none'});

  const toggleDrawer = (fechaCalendarioRecibida)=> {
    // console.log(fechaCalendarioRecibida)
    // setAltura(divContainerCalendar.current.clientHeight)
    // setState(true);
    setMostrarDrawer(true)
    setEventoMostrarDrawer(eventos.filter((chip) => chip.fechaInicio.split("T")[0] === fechaCalendarioRecibida))
    // setEstadoDrawer({display:'block'})
    var drawerPrueba = document.getElementById("drawer-pruebas")
    drawerPrueba.style.width = "100%"
    // console.log(drawerdocument)
  };

  const ObtenerTiempoEvento = (fechaInicioRecibida,fechaFinRecibida) => {
    // console.log(evento.fechaInicio)
    var a = new Date(fechaInicioRecibida)
    var b = new Date(fechaFinRecibida)
    var c = ((b-a)/1000)
    var nuevo = new Date('2023-01-01T00:00')
    nuevo.setSeconds(c)
    // console.log(nuevo.setSeconds(c))
    var tiempo = ""
    tiempo = nuevo.getHours() > 0 ? (nuevo.getHours() + " horas") : ""
    tiempo += nuevo.getHours() > 0 && nuevo.getMinutes() > 0 ? " y " : ""
    tiempo += nuevo.getMinutes() > 0 ? (nuevo.getMinutes() + " minutos") : ""
    // console.log(tiempo)
    return tiempo;
  }

  const CambiarDatosMostrarDrawer = (diaMesRecibido,mesRecibido) =>{
    var fechaCabeceraEventos = new Date(añoMostrar,mesRecibido,diaMesRecibido)
    // console.log(fechaCabeceraEventos, añoMostrar, mesRecibido, diaMesRecibido)
    setFechaEventosMostrar(moment(fechaCabeceraEventos).format("dddd").slice(0,3)+", "+moment(fechaCabeceraEventos).format("DD")+" de "+ moment(fechaCabeceraEventos).format("MMMM"))
    setFechaCrearNuevoEventoMostrar(moment(fechaCabeceraEventos).format("dddd")+", "+moment(fechaCabeceraEventos).format("DD")+" de "+ moment(fechaCabeceraEventos).format("MMMM"))
  }

  const CerrarDrawer = () => {
    // setState(false);
    setMostrarDrawer(false)
    // setEstadoDrawer({display:'none'})
    var drawerPrueba = document.getElementById("drawer-pruebas")
    drawerPrueba.style.width = "0"
  }
  // *************************************************************************************************

  const [fechaEventosMostrar, setFechaEventosMostrar] = useState("");
  const [fechaCrearNuevoEventoMostrar, setFechaCrearNuevoEventoMostrar] = useState("");

  // Crear Nuevo Evento *******************************************************************************
  const [modalCrearEvento, setModalCrearEvento] =  useState(false);
  const [nuevaFechaEventoCrearEnviar, setNuevaFechaEventoCrearEnviar] = useState((new Date(Date.now())).toISOString().split("T")[0])

  const CrearNuevoEvento = (diaRecibido, mesRecibido) => {
    setModalCrearEvento(!modalCrearEvento)
    setNuevaFechaEventoCrearEnviar((new Date(añoMostrar,mesRecibido,diaRecibido)).toISOString().split("T")[0])
  }

  // *************************************************************************************************

  const FormatoValidarFechaEvento = (mesrecibido,diaRecibido) => {
    return moment(new Date(añoMostrar,mesrecibido ,diaRecibido)).format("YYYY-MM-DD")
  }

  const MostrarEventosCalendario = (eventosRecibidos, dias) =>{
    var fechasSimilares = eventosRecibidos.filter((chip) => chip.fechaInicio.split("T")[0] === (FormatoValidarFechaEvento(dias.mes,dias.dia)));
    if(fechasSimilares.length < 4){
      return <>  
      {fechasSimilares.map((evento, index)=>
        <div key={index}>
          <MostarEventoComponent evento={evento} obtenerEventosPorMes={ObtenerEventosPorMes} mesMostrar={mesMostrar} EditarDetallesEvento={EditarEvento}></MostarEventoComponent>
        </div>
      )}
      </>
    }else{
      return <>  
        <MostarEventoComponent evento={fechasSimilares[0]} obtenerEventosPorMes={ObtenerEventosPorMes} mesMostrar={mesMostrar} EditarDetallesEvento={EditarEvento}></MostarEventoComponent>
        <MostarEventoComponent evento={fechasSimilares[1]} obtenerEventosPorMes={ObtenerEventosPorMes} mesMostrar={mesMostrar} EditarDetallesEvento={EditarEvento}></MostarEventoComponent>
        <div className='container-evento-fecha'>
          <Button className='button-evento' onClick={() => toggleDrawer(FormatoValidarFechaEvento(dias.mes,dias.dia))}>Ver mas {fechasSimilares.length-2}+</Button>
        </div>
        
      </>
    }
    
      
  }

  // Editar Evento *******************************************************************************
  const [modalEditarEvento, setModalEditarEvento] =  useState(false);
  const [detallesEventoEditar, setDetallesEventoEditar] = useState({})

  const EditarEvento = (detallesRecibidos) => {
    setDetallesEventoEditar(detallesRecibidos)
    setModalEditarEvento(!modalEditarEvento)
  }

  // *************************************************************************************************

  useLayoutEffect(() => {
    moment.locale('es')
    ObtenerCalendarioActual(new Date(Date.now()))
  }, []);

  return (
    <>
      <Header/>
      {/* Page content */}
      <Container className="mt-3 container-index-calendar" fluid >
        
        <Row className='row-container-calendario'>
          <Container className="modal-lateral-datepicker-calendario">
            <Row>
              <Card className='card-componentes-calendario'>
              <ThemeProvider theme={theme}>
                <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="es">
                  <DemoItem>
                    <StaticDatePicker sx={{height:'460px'}} onChange={(e) => ObtenerFechaSeleccionada(e, e._d)} value={fechaDatePickerActual} views={['year', 'month', 'day']}/>
                  </DemoItem>
                </LocalizationProvider>
              </ThemeProvider>
              </Card>
            </Row>
          </Container>
          <Container className="modal-central-calendario" >
            <Row >
              <div className='card card-componentes-calendario'>
                <CardBody>
                  <Row style={{display:'flex', width:'100%'}}>
                      <Button className='boton-cabecera-calendario' onClick={FechaActualSeleccionar}>Hoy</Button>
                      <Button className='boton-mes-calendario' onClick={CambiarMesAumentar} >
                        <KeyboardArrowUpIcon sx={{ fontSize: 30 }} />
                      </Button>
                      <Button className='boton-mes-calendario' onClick={CambiarMesReducir} >
                        <KeyboardArrowDownIcon sx={{ fontSize: 30 }} />
                      </Button>
                      <Button className='boton-mes-calendario' onClick={CambiarMesCalendario} >
                        {mesDescripcionMostrar} <ArrowDropDownIcon sx={{ fontSize: 30 }} />
                      </Button>
                      <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                          'aria-labelledby': 'basic-button',
                        }}
                      >
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DemoItem label="">
                              <MonthCalendar onChange={(e) => handleClose(e)} value={fechaDatePickerActual}/>
                            </DemoItem>
                        </LocalizationProvider>
                      </Menu>
                      <Button className='boton-mes-calendario' onClick={CambiarAñoCalendario}>
                        {añoMostrar}<ArrowDropDownIcon sx={{ fontSize: 30 }} />
                      </Button>
                      <Menu
                        id="basic-menu"
                        anchorEl={anchorElAño}
                        open={openYearCalendar}
                        onClose={handleCloseYearCalendar}
                        MenuListProps={{
                          'aria-labelledby': 'basic-button',
                        }}
                      >
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DemoItem label="">
                              <YearCalendar onChange={(e) => handleCloseYearCalendar(e)} value={fechaDatePickerActual}/>
                            </DemoItem>
                        </LocalizationProvider>
                      </Menu>
                      {/* <div style={{margin:'auto 0 auto 0', fontWeight:'600'}}>{mesDescripcionMostrar} {añoMostrar}</div> */}
                  </Row >
                  <Row className='mt-3'>
                    <ul className="weekdays">
                      <li>
                        <div>Lunes</div>
                      </li>
                      <li>
                        <div>Martes</div>
                      </li>
                      <li>
                        <div>Miercoles</div>
                      </li>
                      <li>
                        <div>Jueves</div>
                      </li>
                      <li>
                        <div>Viernes</div>
                      </li>
                      <li>
                        <div>Sabado</div>
                      </li>
                      <li>
                        <div>Domingo</div>
                      </li>
                    </ul>
                  </Row>
                  <Row>
                    <ol className="day-grid container-grid-rows-5" id='calendario-mes-mostrar'>
                      {diasCalendarioMostrar.map((dias, index) =>
                      <div key={index} className={dias.mes == mesMostrar ? "": "fechas-pasadas"} onDoubleClick={() => CrearNuevoEvento(dias.dia,dias.mes)} onClick={() => FechaCalendarioSeleccionado(dias.dia,dias.mes)}>
                        {/* <li className='fecha-seleccionada'> */}
                        <li id={fechaMostrar(dias.dia, dias.mes)} className={(fechaMostrar(dias.dia, dias.mes)) === fechaActual? "fecha-seleccionada":""}>
                          <div className='container-li-evento'>
                            <div style={{marginTop:'1%'}}>
                              {(fechaMostrar(dias.dia, dias.mes)) === fechaActual ?
                              <div className='contenedor-fecha-bloque'>
                                <div className="fecha-normal">
                                  <span className='fecha-actual'>{dias.dia}</span> {moment(new Date(2023,dias.mes,1)).format("MMM")}
                                </div>
                                <Tooltip title="Mostrar Eventos">
                                  <div>
                                    <Button className='boton-mostrar-descripcion-evento' onClick={() => toggleDrawer(FormatoValidarFechaEvento(dias.mes,dias.dia))}>
                                      <VisibilityIcon sx={{ fontSize: 18 }} className='icon-centrar-top'/>
                                    </Button>
                                  </div> 
                                </Tooltip>
                              </div>
                              : <div className='contenedor-fecha-bloque'>
                                  <span className='fecha-normal'>{dias.dia} {moment(new Date(2023,dias.mes,1)).format("MMM")}</span>
                                  <Tooltip title="Mostrar Eventos">
                                    <div>
                                      <Button className='boton-mostrar-descripcion-evento' onClick={() => toggleDrawer(FormatoValidarFechaEvento(dias.mes,dias.dia))}>
                                        <VisibilityIcon sx={{ fontSize: 18 }} className='icon-centrar-top'/>
                                      </Button>
                                    </div> 
                                </Tooltip>
                                </div>}
                              {/* // <div><Button className='button-evento'>+</Button></div> */}
                            </div>
                            {/* <div className='container-evento-fecha'>
                              <Button className='button-evento' onClick={() => EventoSeleccionado()}>Evento 1</Button>
                            </div>
                            <div className='container-evento-fecha'>
                              <Button className='button-evento'>Evento 2</Button>
                            </div>
                            <div className='container-evento-fecha'>
                              <Button className='button-evento'>Ver +</Button>
                            </div> */}
                            {/* {.map((evento,index) =>
                              <>
                                
                              </>
                            )} */}
                            {MostrarEventosCalendario(eventos, dias)}
                          </div>
                        </li>
                      </div>
                      )}
                    </ol>
                    {/* <Button onClick={() => EventoSeleccionado()}>Agregar</Button> */}
                  </Row>
                </CardBody>
                <div id='drawer-pruebas' className='contenedor-principal-drawer'>
                {mostrarDrawer ? <div className='drawer-contenido-tamaño' id='drawer-contenedor-desaparecer'>
                  <ClickAwayListener onClickAway={CerrarDrawer}>
                    <Box sx={{ width: "auto" }} className="drawer-tamaño ">
                      <Container style={{padding: "0 0 0 0"}} >
                        <Button className='boton-descripcion-evento' onClick={CerrarDrawer}>
                          <div>Ocultar</div>
                          <VisibilityOffIcon sx={{ fontSize: 20 }} className='icon-centrar-top'/>
                        </Button> 
                        <Divider/>
                      </Container>
                      <Container>
                        <div className='fecha-lista-eventos-cabecera'>
                          <CalendarMonthIcon sx={{ fontSize: 20 }} className='icon-centrar-top '/>
                          <Container className='contenedor-evento-descripcion-mostrar'>{fechaEventosMostrar}</Container>
                        </div>
                      </Container>
                      <Divider />
                      <List style={{display:'block', height:'84%', width:'auto'}} className='container-scroll'> 
                        {eventosMostrarDrawer.length > 0 ? 
                          eventosMostrarDrawer.map((evento, index) =>
                            <ListItem disablePadding key={index}>
                              <MostrarEventosDiaDrawer evento={evento} obtenerEventosPorMes={ObtenerEventosPorMes} mesMostrar={mesMostrar} EditarDetallesEvento={EditarEvento}></MostrarEventosDiaDrawer>
                              <Divider variant="middle" textAlign="right"><Chip label={evento.tipoEvento} /></Divider>
                            </ListItem>
                          )
                        : <></>}
                      </List>
                    </Box>
                  </ClickAwayListener>
                </div> : <></>}
                </div>
              </div> 
            </Row>
            {/* width: {width} ~ height: {height} */}
          </Container>
        </Row>
      </Container>

      {modalCrearEvento ? 
        <CrearEventoComponent 
          abrirModal={modalCrearEvento} 
          setAbrirModalCrearEvento={setModalCrearEvento} 
          NuevaFechaEventoRecibida={nuevaFechaEventoCrearEnviar} 
          fechaCabeceraEventoMostrar={fechaCrearNuevoEventoMostrar}
          RecargarEventos = {ObtenerEventosPorMes}
          mesMostrar = {mesMostrar}>
        </CrearEventoComponent>:<></>}
      
      {modalEditarEvento ? 
        <EditarEventoComponent
          eventoRecibido = {detallesEventoEditar}
          abrirModal={modalEditarEvento} 
          setAbrirModalCrearEvento={setModalEditarEvento} 
          RecargarEventos = {ObtenerEventosPorMes}
          mesMostrar = {mesMostrar}>
        </EditarEventoComponent>:<></>}
      
    </>
  );
};

export default Index;

