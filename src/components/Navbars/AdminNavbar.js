/*!
=========================================================
* Argon Dashboard React - v1.2.2
=========================================================
* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)
* Coded by Creative Tim
=========================================================
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import { Box, Button, Chip, Divider, IconButton, Typography } from "@mui/material";
import { Link } from "react-router-dom";
// reactstrap components
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Navbar,
  Nav,
  Container,
  Media,
  // Form,
  // FormGroup,
  // InputGroup,
  // InputGroupAddon,
  // InputGroupText,
  // Input
} from "reactstrap";
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import './AdminNavbar.css'
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import React, { useEffect, useState} from "react";
import EventIcon from '@mui/icons-material/Event';
import PhotoCameraFrontIcon from '@mui/icons-material/PhotoCameraFront';
import ListAltIcon from '@mui/icons-material/ListAlt';
import moment from "moment";
import { PutCambiarNotificacionLeida, PutCambiarNotificacionMostrada } from "../../Controller/Controller";

const AdminNavbar = (props) => {

  const getuser = localStorage.getItem("usuario")
  const usuario = JSON.parse(getuser)

  const [connection, setConnection] = useState(null);
  const [notificaciones, setNotificaciones] = useState([]);
  const [cantidadNotificaciones, setCantidadNotificaciones] = useState(0);

  useEffect(() => {
    const connect = new HubConnectionBuilder()
      .withUrl("https://4sales.com.co/SISTEMA/offers")
      // .withUrl("https://localhost:44487/offers")
      .withAutomaticReconnect()
      .build();

    setConnection(connect);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          // alert("conexion creada");
          connection.on("RecibirNotificaciones", ( notificaciones) => {
            // console.log(notificaciones)
            if(notificaciones?.notificaciones){
              setNotificaciones(notificaciones.notificaciones)
              setCantidadNotificaciones(notificaciones.cantidadNotificacionesSinLeer)
              if(notificaciones.notificacionesMostrar.length > 0){
                notificaciones.notificacionesMostrar.forEach(mostrarNoti => {
                  Notification.requestPermission().then(perm => {
                    if(perm === "granted"){
                      const notificacion = new Notification(mostrarNoti.titulo, {
                        body:mostrarNoti.descripcion,
                        data:{},
                        icon:"Logo Centered.pg",
                        image:"https://4sales.com.co/static/media/logo-4sales-crm.3c09e529536ca7ee414b.png"
                      }) 
                      CambiarMostrarNotificacion(mostrarNoti) 
                      notificacion.addEventListener("click", (event) =>{
                        window.open("https://4sales.com.co/SISTEMA/ITBF/crm-itbf/"+(mostrarNoti.tipoNotificacion==="TAREA"?"tareas":"calendario"))
                        notificacion.close()
                      })
                    }
                  })
                });
              }
            }else{
              setNotificaciones([])
              setCantidadNotificaciones(0)
              // console.log(notificaciones)
            }
          });
          Iniciar()
        })
        .catch((error) => console.log(error));


        connection.onclose(e => {
          console.log("connection Onclose")
        }); 
    }
    return() =>{
      TerminarConexion()
    }
  }, [connection]);

  const Iniciar = async () =>{
    // console.log(usuario.userId)
    await connection.invoke("IniciarEscuchaAlertas", (usuario.userId) ).then(console.log("EN conectado"));
  }

  // const Detener = async () =>{
  //   await connection.invoke("DetenerEscuchaAlertas", (2) ).then(alert("IniciarEscuchaAlertas desconectado"));
  // }

  const TerminarConexion = async() =>{
    try {
      await connection.invoke("DetenerEscuchaAlertas", (2) ).then(console.log("EN desconectado"));
      // await connection.stop();

      console.log("Conexion Terminada")
    } catch (e) {
      console.log(e);
    }
  }

  const MostrarTipoNotificacion = (tipoNotificacionRecibido) => {
    switch(tipoNotificacionRecibido){
      case "REUNION":
        return <PhotoCameraFrontIcon className="icon-tipo-notificacion" sx={{fontSize:32}}/>;
      case "EVENTO":
        return <EventIcon className="icon-tipo-notificacion" sx={{fontSize:32}}/>;
      case "TAREA":
      return <ListAltIcon className="icon-tipo-notificacion" sx={{fontSize:32}}/>

    }
  }

  const LogoutSession = () => {
    localStorage.clear()
  }

  const CambiarEstadoLeidoNotificacion = async(notificacionRecibida) =>{
    var cambiar = new FormData();
    cambiar.append("Estado","Leido")

    await PutCambiarNotificacionLeida(notificacionRecibida.notificacionId, cambiar)
  }

  const CambiarMostrarNotificacion = async(notificacionRecibida) =>{
    var cambiar = new FormData();
    cambiar.append("Estado","Leido")

    await PutCambiarNotificacionMostrada(notificacionRecibida.notificacionId, cambiar)
  }

  return (
    <>
      <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
        <Container fluid>
          <Link
            className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
            to="/SISTEMA/ITBF/crm-itbf"
          >
            {props.brandText}
          </Link>
          {/* <Form className="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto">
            <FormGroup className="mb-0">
              <InputGroup className="input-group-alternative">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="fas fa-search" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input placeholder="Search" type="text" />
              </InputGroup>
            </FormGroup>
          </Form> */}
          <Box className="mr-3 d-none d-md-flex ml-lg-auto">
            
            <UncontrolledDropdown nav className="contenedor-dropdown-notificaciones">
              <DropdownToggle className="pr-0" nav>
                <IconButton className="button-notificaciones-navbar">
                  <Badge color="error" badgeContent={cantidadNotificaciones} max={99}>
                    <NotificationsIcon sx={{color:'rgb(255, 255, 255) ', fontSize: 25}}/>
                  </Badge>
                </IconButton>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow dropdown-notificaciones-navbar" right>
                <DropdownItem className="noti-title" header tag="div">
                  <h6 className="text-overflow m-0">Notificaciones</h6>
                </DropdownItem>
                <div className="style-scrollbar-dropdown">
                  {(notificaciones.length > 0) ? notificaciones.map((notifi, index) =>
                    <div key={index} >
                      <DropdownItem to={"/SISTEMA/ITBF/crm-itbf/"+(notifi.tipoNotificacion==="TAREA"?"tareas":"calendario")} tag={Link} style={{padding:'5px'}} onClick={()=>CambiarEstadoLeidoNotificacion(notifi)}>
                        <Box className="contenedor-descripcion-notificacion" >
                          <div className="notificacion-icono">
                            {MostrarTipoNotificacion(notifi.tipoNotificacion)}
                          </div>
                          <div className="notificacion-cuerpo">
                            <div className="descripcion-titulo">{notifi.titulo}</div>
                            <div className="descripcion-notificacion">
                              <p>
                                {notifi.descripcion}
                              </p>
                            </div>
                          </div>
                          {(notifi.notificacionLeida)? <></> : <div className="contenedor-notificacion-sin-leer">
                            <div className="notificacion-sin-leer">
                              <p></p>
                            </div>
                          </div>}
                          
                        </Box>
                      </DropdownItem>
                      <Divider variant="middle" >
                        <Chip sx={{textTransform:'capitalize'}} label={moment(notifi.fechaCreacion).format("DD MMM YYYY HH:mm A")} />
                      </Divider>
                    </div> ) : <>
                    <DropdownItem className="noti-title" header tag="div">
                      <h6 className="text-overflow m-0">aun no hay notificaciones</h6>
                    </DropdownItem>
                  </>}
                </div>

                {/* <DropdownItem divider /> */}
                {/* <DropdownItem href="#pablo" onClick={() => LogoutSession()}>
                  <i className="ni ni-user-run" />
                  <span>Cerrar Sesión</span>
                </DropdownItem> */}
              </DropdownMenu>
            </UncontrolledDropdown>
            
          </Box>
          <Nav className="align-items-center d-none d-md-flex" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
                  <span className="">
                    <img
                      alt="userimage"
                      src={'Images/Users/'+usuario?.userImage}
                      style={{width:"35px", height:"35px", borderRadius:"50%"}}
                    />
                  </span>
                  <Media className="ml-2 d-none d-lg-block">
                    <span className="mb-0 text-sm font-weight-bold">
                      {usuario?.userName +" " +usuario?.userLastname}
                    </span>
                  </Media>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem className="noti-title" header tag="div">
                  <h6 className="text-overflow m-0">Bienvenid@!</h6>
                </DropdownItem>
                {/* <DropdownItem to="/crm-itbf/user-profile" tag={Link}>
                  <i className="ni ni-single-02" />
                  <span>My profile</span>
                </DropdownItem>
                <DropdownItem to="/crm-itbf/user-profile" tag={Link}>
                  <i className="ni ni-settings-gear-65" />
                  <span>Settings</span>
                </DropdownItem>
                <DropdownItem to="/crm-itbf/user-profile" tag={Link}>
                  <i className="ni ni-calendar-grid-58" />
                  <span>Activity</span>
                </DropdownItem>
                <DropdownItem to="/crm-itbf/user-profile" tag={Link}>
                  <i className="ni ni-support-16" />
                  <span>Support</span>
                </DropdownItem> */}
                <DropdownItem divider />
                <DropdownItem href="#pablo" onClick={() => LogoutSession()}>
                  <i className="ni ni-user-run" />
                  <span>Cerrar Sesión</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
