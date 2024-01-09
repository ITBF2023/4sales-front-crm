import {
    Button,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Form,
    Input,
    InputGroupText,
    InputGroup,
    Row,
    Col
  } from "reactstrap";

import ReactJsAlert from "reactjs-alert"

import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from 'axios';
import { useLayoutEffect } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom";

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Slide from '@mui/material/Slide';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { cambioContraseñaCodigoValidado, validarCodigoRecuperarContraseña } from "../../../Controller/Controller";
import { CircularProgress } from "@mui/material";

const RecuperarContraseñaComponent = () => {

  const [title, setTitle] = useState("");

  const [codigoIngresado, setCodigoIngresado] = useState("");

  const [status, setStatus] = useState(false);

  const history = useHistory();
  const path = useParams();

  useLayoutEffect(()=> {
  }, [])

  const RecuperarContraseña  = async (e) => {
    e.preventDefault();

    let cambios = new FormData()
    cambios.append('Correo', path.id)
    cambios.append('Codigo', codigoIngresado)

    const codigoValidado = await validarCodigoRecuperarContraseña(cambios)
    if(codigoValidado.status === 201){
      setMostrarNotificacion(true)
      setChecked((prev) => !prev)
    }else{
      setTitle(codigoValidado.data)
      setStatus(true)
    }
  }

  // ************************************************************************************************
  // Funciones dee Notificacion

  const [mostrarNotificacion, setMostrarNotificacion] = useState(false)
  
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


  // ************************************************************************************************
  // Funciones Mostrar Card Cambiar Password

  const [checked, setChecked] = useState(false);
  const containerRef = React.useRef(null);

  const [nuevaContraseña, setNuevaContraseña] = useState("")
  const [contraseñaRepetida, setContraseñaRepetida] = useState("")
  const [procesoCambioContrasena, setProcesoCambioContraseña] = useState(false)

  const ValidarContraseñas = async() => {
    if(nuevaContraseña === contraseñaRepetida){
      setProcesoCambioContraseña(true)
      let cambios = new FormData()
      cambios.append('Correo', path.id)
      cambios.append('NuevaContraseña', nuevaContraseña)

      const cambioExitoso = await cambioContraseñaCodigoValidado(cambios)
      if(cambioExitoso.status === 201){
        alert("Cambio de contraseña exitoso, inicia sesion con tus nuevas credenciales")
        history.push("login");
      }else{
        setTitle(cambioExitoso.data)
        setStatus(true)
      }
      setProcesoCambioContraseña(false)
    }else{
      setTitle("Las contraseñas no coinciden")
      setStatus(true)
      setProcesoCambioContraseña(false)
    }
  }

  const icon = (
    <Paper elevation={4}>
      <Card>
        <CardBody className="px-lg-5 py-lg-5">
          <div className="text-center text-muted mb-4">
            <small>Crea una nueva contraseña</small>
          </div>
          <FormGroup className="mb-3">
            <InputGroup className="input-group-alternative">
                <InputGroupText>
                  <i className="fa-solid fa-lock" />
                </InputGroupText>
              <Input
                placeholder="Ingresa la nueva contraseña"
                type="password"
                onChange={(e) => setNuevaContraseña(e.target.value)}
              />
            </InputGroup>
          </FormGroup>
          <FormGroup className="mb-3">
            <InputGroup className="input-group-alternative">
                <InputGroupText>
                  <i className="fa-solid fa-lock" />
                </InputGroupText>
              <Input
                placeholder="Repite la contraseña"
                type="password"
                onChange={(e) => setContraseñaRepetida(e.target.value)}
              />
            </InputGroup>
          </FormGroup>
          <div className="text-center">
            <Button className="my-4" color="primary" type="button" onClick={ValidarContraseñas} disabled={procesoCambioContrasena}>
              confirmar {procesoCambioContrasena ? <CircularProgress size={15} color="inherit" /> :<></>}
            </Button>
          </div>
        </CardBody>
      </Card>
    </Paper>
  )

  // ************************************************************************************************


  return (
    <>
      <ReactJsAlert
        status={status}   // true or false
        type="error"   // success, warning, error, info
        title={title}   // title you want to display
        Close={() => setStatus(false)}   // callback method for hide
      />
      <Col lg="5" md="7" ref={containerRef}>
        {checked ? <></> : <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>Ingresa el codigo de confirmación</small>
            </div>
            <Form role="form" onSubmit={RecuperarContraseña}>
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                    <InputGroupText>
                      <i className="fa-regular fa-circle-check" />
                    </InputGroupText>
                  <Input
                    placeholder="Ingresa el codigo"
                    type="text"
                    value={codigoIngresado}
                    onChange={(e) => setCodigoIngresado(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <div className="text-center">
                <Button className="my-4" color="primary" type="submit">
                  confirmar
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>}
        <Slide direction="up" in={checked} timeout={3000} container={containerRef.current} >
          {icon}
        </Slide>
        <Row className="mt-3">
          <Col xs="6">
          </Col>
          <Col className="text-right" xs="6">
            <Link
              className="text-light"
              to="login"
            >
              <small>Regresar a iniciar Sesion</small>
            </Link>
          </Col>
        </Row>
      </Col>
      <Snackbar
        anchorOrigin={{ vertical:'top', horizontal:'center' }}
        autoHideDuration={4000}
        TransitionComponent={TransitionUp}
        open={mostrarNotificacion}
        onClose={cerrarNotificacion}
        // message="I love snacks"
        key={'top-center'}>
          <Alert severity="success" onClose={() => cerrarNotificacion()}>
            <AlertTitle>Validado</AlertTitle>
            El codigo fue validado exitosamente — <strong>cree una nueva contraseña!</strong>
          </Alert>
          
        </Snackbar>
    </>
  );
  };
  
  export default RecuperarContraseñaComponent;
  