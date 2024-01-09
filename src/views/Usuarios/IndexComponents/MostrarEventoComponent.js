import React, { useState } from 'react';

import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import {Box, Button as ButtonMUI, ClickAwayListener, Chip, Stack, TextareaAutosize}  from '@mui/material';
import { Card, CardBody, CardHeader, Container, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';

import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SegmentIcon from '@mui/icons-material/Segment';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import Skeleton from '@mui/material/Skeleton';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';

import './MostrarEventoStyles.css'
import moment from 'moment';
import { deleteEventoCalendario, getDetallesEventoCalendario, getUserId, updateAceptarEvento, updateDenegarEvento } from '../../../Controller/Controller';

const MostarEventoComponent = ({evento, obtenerEventosPorMes, mesMostrar, EditarDetallesEvento}) =>{

  const getuser = localStorage.getItem("usuario")
  const usuario = JSON.parse(getuser)

  const [open, setOpen] = useState(false);
  const [detalleEvento, setDetalleEvento] = useState({});

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = (eventoIdRecibido) => {
    setOpen(true);
    ObtenerDetallesEvento(eventoIdRecibido)
  };

  const ObtenerDetallesEvento = async(eventoIdRecibido) => {
    const detalleObtenido = await getDetallesEventoCalendario(eventoIdRecibido, getUserId())
    if(detalleObtenido?.eventoId){
      // console.log(detalleObtenido)
      setDetalleEvento(detalleObtenido)
    }else{
      setDetalleEvento({})
    }
  }

  const ObtenerTiempoEvento = () => {
    // console.log(evento.fechaInicio)
    var a = new Date(evento.fechaInicio)
    var b = new Date(evento.fechaFin)
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

  const EliminarEventoCalendarioSeleccionado = async(idEventoEliminar) => {
    if (window.confirm("Esta seguro de eliminar este evento")) {
      const eventoeliminar = await deleteEventoCalendario(idEventoEliminar)
      if (eventoeliminar.status === 201) {
        // setmensajeNotificacionMostrar("Nota Eliminada Satisfactorimente!")
        // setMostrarNotificacion(true)
        alert("Evento Eliminado")
        obtenerEventosPorMes(mesMostrar)
      }
    }
    handleTooltipClose()
  }

  const EditarEventoCalendarioSeleccionado = (detallesEvento) => {
    EditarDetallesEvento(detallesEvento)
    handleTooltipClose()
  }

  const AceptarEvento = async(invitacionEventoId) => {

    var formdataRespuesta = new FormData();
    formdataRespuesta.append('AceptarReunion',true)
    formdataRespuesta.append('DenegarReunion',false)
    formdataRespuesta.append('MotivoAusencia','')

    const resp = await updateAceptarEvento(invitacionEventoId, formdataRespuesta)
    if (resp.status === 201) {
      alert("Respuesta al usuario enviada")
      obtenerEventosPorMes(mesMostrar)
    }
    handleTooltipClose()
  }

  const [modalMotivo, setModalMotivo] = useState(false)
  const [motivoAusencia, setMotivoAusencia] = useState("")

  const AbrirModalMotivo = () => {
    setModalMotivo(!modalMotivo)
    handleTooltipClose()
    setMotivoAusencia("")
  }

  const DenegarEvento = async(invitacionEventoId) => {

    var formdataRespuesta = new FormData();
    formdataRespuesta.append('AceptarReunion',false)
    formdataRespuesta.append('DenegarReunion',true)
    formdataRespuesta.append('MotivoAusencia',motivoAusencia)

    const resp = await updateDenegarEvento(invitacionEventoId, formdataRespuesta)
    if (resp.status === 201) {
      alert("Respuesta al usuario enviada")
      obtenerEventosPorMes(mesMostrar)
    }
    handleTooltipClose()
    AbrirModalMotivo()
  }


  const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} 
    PopperProps={{
      disablePortal: true,
    }}
    onClose={handleTooltipClose}
    open={open}
    disableFocusListener
    disableHoverListener
    disableTouchListener
    placement="right"/>
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: 'white',
      color: 'rgba(0, 0, 0, 0.87)',
      width: 400,
      fontSize: theme.typography.pxToRem(12),
      // border: '1px solid gray',
      padding: '0 0 0 0',
      borderRadius:'5px',
      boxShadow: 'rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset',
    },
    [`& .${tooltipClasses.arrow}`]: {
      color: 'black',
    },
  }));


  return (
    <div className='container-evento-fecha'>
      <ClickAwayListener onClickAway={handleTooltipClose}>
        <div>
        <HtmlTooltip 
          title={
            <React.Fragment>
              {detalleEvento.eventoId ? <Container className="container-tooltip-detalle-evento">
                <Box className="cabecera-tooltip-vista-evento">
                  <span className='titulo'>Eventos</span> - {usuario?.userName + " " + usuario?.userLastname}- {usuario?.usuarioCorreo}
                </Box>
                <Divider></Divider>
                <List style={{display:'block'}}> 
                  <ListItem className='lista-tooltip-detalles-evento' disablePadding>
                    <Container style={{margin:'5px 0 5px 0', padding:'0 5px 0 5px', display:'flex'}} disabled>
                      <ListItemAvatar className='icon-centrar-top'>
                      </ListItemAvatar>
                      <Container style={{display:'block',width:'100%', marginLeft:'0'}}>
                        <div className='titulo-evento-detalle'>{evento.titulo}</div>
                      </Container>
                    </Container>
                    <Divider sx={{marginLeft:'30px'}} textAlign="right"><Chip sx={{height:'auto'}} label={'Titulo'} /></Divider>
                  </ListItem>
                  <ListItem disablePadding className='lista-tooltip-detalles-evento'>
                    <Container style={{margin:'5px 0 5px 0', padding:'0 5px 0 5px', display:'flex'}} disabled>
                      <ListItemAvatar className='icon-centrar-top'>
                        <CalendarMonthIcon fontSize="small"/>
                      </ListItemAvatar>
                      <Container style={{display:'block',width:'100%', marginLeft:'0', textTransform:'capitalize'}}>
                        <div className=''>Inicio: {moment(new Date(evento.fechaInicio)).format("ddd DD/MM/YYYY HH:mm A")}</div>
                        <div className=''>Fin: {moment(new Date(evento.fechaFin)).format("ddd DD/MM/YYYY HH:mm A")}</div>
                        <div className=''>tiempo: {ObtenerTiempoEvento()}</div>
                      </Container>
                    </Container>
                    <Divider sx={{marginLeft:'30px'}} textAlign="right"><Chip sx={{height:'auto'}} label={'Hora'} /></Divider>
                  </ListItem>
                  <ListItem disablePadding className='lista-tooltip-detalles-evento'>
                    <Container style={{margin:'5px 0 5px 0', padding:'0 5px 0 5px', display:'flex'}} disabled>
                      <ListItemAvatar className='icon-centrar-top'>
                        <SegmentIcon fontSize="small"/>
                      </ListItemAvatar>
                      <Container style={{display:'block',width:'100%', marginLeft:'0'}}>
                        <div className=''>{evento.descripcion.trim().length == 0 ? "Sin descripcion" : evento.descripcion}</div>
                      </Container>
                    </Container>
                    <Divider sx={{marginLeft:'30px'}} textAlign="right"><Chip sx={{height:'auto'}} label={'Descripcion'} /></Divider>
                  </ListItem>
                  {detalleEvento.eventoConReunion ? <ListItem disablePadding className='lista-tooltip-detalles-evento'>
                    <Container style={{margin:'5px 0 5px 0', padding:'0 5px 0 5px', display:'flex'}} disabled>
                      <ListItemAvatar className='icon-centrar-top'>
                        <VideocamIcon fontSize="small"/>
                      </ListItemAvatar>
                      <Container style={{display:'block',width:'100%', marginLeft:'0', fontSize:'15px'}}>
                        <div style={{margin:'0 0 5px 0'}}>{detalleEvento.tipoEvento}</div>
                        <ButtonMUI sx={{textTransform:'none'}} variant="outlined" size="small" startIcon={<VideoCallIcon />}><a href={detalleEvento.enlaceEvento} target='_blank'>Unirme a la reunion</a></ButtonMUI>
                      </Container>
                    </Container>
                    <Divider sx={{marginLeft:'30px'}} textAlign="right"><Chip sx={{height:'auto'}} label={'Descripcion'} /></Divider>
                  </ListItem>:<></>}
                </List>
                {detalleEvento.usuarioCreadorEvento ? <Box className="contenedor-botones-accion">
                  <ButtonMUI variant="outlined" color="success" size='small' onClick={() => EditarEventoCalendarioSeleccionado(detalleEvento)} endIcon={<EditNoteOutlinedIcon />}>Editar</ButtonMUI>
                  <ButtonMUI variant="outlined" color="error" size='small' onClick={() => EliminarEventoCalendarioSeleccionado(evento.eventoId)} endIcon={<DeleteOutlineOutlinedIcon />}>Eliminar</ButtonMUI>
                </Box> : 
                  evento.eventoAceptado ? <br></br> :
                    <Box className="contenedor-botones-accion">
                      <ButtonMUI variant="outlined" color="success" size='small' onClick={() => AceptarEvento(evento.invitacionId)} endIcon={<DoneIcon />}>Aceptar</ButtonMUI>
                      <ButtonMUI variant="outlined" color="error" size='small' onClick={AbrirModalMotivo} endIcon={<ClearIcon />}>Denegar</ButtonMUI>
                    </Box> 
                }
              </Container>
              : <Container>
                  <Stack spacing={1}>
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    <div style={{display:'flex'}}>
                      <Skeleton className='icon-centrar-top' sx={{margin:'0 10px 0 0'}}  variant="circular" width={30} height={30} />
                      <Skeleton variant="rectangular" width={217} height={40} />
                    </div>
                    <div style={{display:'flex'}}>
                      <Skeleton sx={{margin:'0 10px 0 0'}}  variant="circular" width={30} height={30} />
                      <Skeleton variant="rectangular" width={217} height={60} />
                    </div>
                    <div style={{display:'flex'}}>
                      <Skeleton sx={{margin:'0 10px 0 0'}}  variant="circular" width={30} height={30} />
                      <Skeleton variant="rectangular" width={217} height={60} />
                    </div>
                    <Skeleton variant="rounded" height={60} />
                    <br></br>
                  </Stack>
                </Container>}
            </React.Fragment>
          }
        >
          {/* <Button className='button-evento' onClick={() => EventoSeleccionado()}>{evento.titulo}</Button> */}
          <ButtonMUI className={evento.usuarioCreadorEvento ? 'button-evento' : 'button-evento-invitado'} onClick={(e) => handleTooltipOpen(evento.eventoId)}>
            {evento.fechaInicio.split("T")[1].slice(0,5)} {evento.tipoEvento != "Evento" ? <VideoCameraFrontIcon sx={{ fontSize: 16 }}/> : "►"} {evento.titulo}
          </ButtonMUI>
        </HtmlTooltip>
        </div>
      </ClickAwayListener>
      {modalMotivo ? <Modal isOpen={modalMotivo}>
        <ModalHeader>Motivo de ausencia en el evento</ModalHeader>
        <ModalBody>
          <TextareaAutosize style={{width:'100%'}} minRows={3} placeholder='Ingrese el motivo por el cual estara ausente en el evento' onChange={(e) => setMotivoAusencia(e.target.value)}>
          </TextareaAutosize>
        </ModalBody>
        <ModalFooter>
          <ButtonMUI  variant="outlined" size="small" onClick={() => DenegarEvento(evento.invitacionId)}>Enviar</ButtonMUI>
          <ButtonMUI  variant="outlined" size="small" onClick={AbrirModalMotivo}>Cancelar</ButtonMUI>
        </ModalFooter>
      </Modal> : <></>}
    </div>
  )
}

export default MostarEventoComponent;