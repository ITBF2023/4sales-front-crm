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

// reactstrap components
import React, { useLayoutEffect, useRef, useState  } from 'react';
import './Login.scss'

import ClockLoader  from "react-spinners/ClockLoader";
import Backdrop from '@mui/material/Backdrop';

import ReactJsAlert from "reactjs-alert"

import moment from 'moment';
import { Button, Card, CardBody, CardFooter, CardHeader, Input, Label, Modal } from 'reactstrap';
import { Dialog, Button as ButtonMUI, Stack, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { enviarCodigoRecuperarCorreoUsuario, validarCorreoUsuarioRecuperar } from '../../Controller/Controller';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { green } from '@mui/material/colors';
import Fab from '@mui/material/Fab';
import CheckIcon from '@mui/icons-material/Check';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const Register = () => {

  var history = useHistory()

  let fechainicio = new Date()
  let fechafin = new Date()
  fechafin.setDate((fechainicio.getDate() + 1))
  fechafin = (moment(fechafin).format("YYYY/MM/DD HH:mm:ss"))
  fechainicio = (moment(new Date()).format("YYYY/MM/DD HH:mm:ss"))

  const [openbackdrop, setOpenBackdrop] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [color, setColor] = useState("#ffffff");

  const [username, setUserName] = useState();
  const [password, setPassword] = useState();

  // Alert
  const [status, setStatus] = useState(false);

  const loginUser = async (credentials) =>{

    setOpenBackdrop(!openbackdrop)
      return (
      fetch('https://4sales.com.co/SISTEMA/api/login/Users', {
      method: 'POST',
      headers: {
        'Access-Control-Allow-Origin':'*',
        'Content-Type':'application/json; charset=utf-8',
        'Access-Control-Allow-Headers':'Origin, Content-Type, X-Auth-Token',
      },
      body: JSON.stringify(credentials)
    })
      .then(data => data.json())
      .catch(error => {
        setOpenBackdrop(false)
        setTitle("No hay respuesta del servidor")
        setStatus(true)
      })
    )
  }

  const handleSubmit = async e => {
    e.preventDefault();
    const token = await loginUser({
      username,
      password
    });
    // console.log(token)
    if(token.statusCode === 404){
      setOpenBackdrop(false)
      showSwal(token.message)
    }else if(token.status === 400) {
      setOpenBackdrop(false)
      showSwal("Usuario o Clave Faltante")
    }
    else if(token[0].userId){
      setOpenBackdrop(false)
      localStorage.setItem('usuario', JSON.stringify(token[0]));
      localStorage.setItem('rol', JSON.stringify(token[1]));
      localStorage.setItem('fechas', JSON.stringify({ fechalogin : fechainicio, fechaexpira: fechafin}))
      window.location.href = "/SISTEMA/ITBF/crm-itbf"
    }
  }

  const [openModalCambiarPass, setOpenModalCambiarPass] = useState(false)
  const [correoEnviarCodigo, setCorreoEnviarCodigo] = useState("");
  const [validandoCorreo, setValidandoCorreo] = useState(false);

  const AbrirModalCambiarContraseña = () => {
    setOpenModalCambiarPass(!openModalCambiarPass)
    setValidandoCorreo(false)
    setSuccess(false)
  }

  const ValidarCorreoIngresado = async() =>{
    setValidandoCorreo(true)
    let valid = new FormData()
    valid.append('Correo', correoEnviarCodigo)

    const correoValido = await validarCorreoUsuarioRecuperar(valid)
    if(correoValido.status === 201){
      RecuperarContraseña(correoEnviarCodigo)
    }else{
      alert(correoValido.data)
      setValidandoCorreo(false)
    }
  }

  const RecuperarContraseña  = async (direccionMail) => {

    let cambios = new FormData()
    cambios.append('DireccionEmailEnviar', direccionMail)

    const enviarEmail = await enviarCodigoRecuperarCorreoUsuario(cambios)
    if(enviarEmail.status === 201){
      setSuccess(true);
      alert("Se envio el mensaje al correo")
      setValidandoCorreo(false)
      history.push("RecuperarContraseña/mail-"+direccionMail);
    }else{
      alert(enviarEmail.data)
      AbrirModalCambiarContraseña()
    }
  }

  const [success, setSuccess] = useState(false);
  const timer = useRef();

  const buttonSx = {
    ...(success && {
      bgcolor: green[500],
      '&:hover': {
        bgcolor: green[700],
      },
    }),
  };

  const showSwal = (texto) => {
    withReactContent(Swal).fire({
      icon: "error",
      title: "Oops...",
      text: texto,
      focusConfirm: false,
      confirmButtonText: `Okay`,
      confirmButtonAriaLabel: "Thumbs up, great!",
    })
  }

  useLayoutEffect(()=> {
    return () => {
      clearTimeout(timer.current);
    };
  }, [])


  return (
    <>
      <div className='contenedor-login'>
        <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 10 }}
        open={openbackdrop}>
          <ClockLoader  color={color} loading={loading} size={150} />
        </Backdrop>

        <div className="contenedor is-open" >
          <form onSubmit={handleSubmit}>
            <div className="contenedor-container">
              <div className="contenedor-left">
                <h1 className="contenedor-title">¡Bienvenido!</h1>
                <p className="contenedor-desc">Para acceder a la plataforma debes ingresar tus credenciales</p>
                <div className="input-block">
                  <label htmlFor="email" className="input-label">Correo</label>
                  <input type="email" name="email" id="email" placeholder="Ingresa tu correo" onChange={e => setUserName(e.target.value)}/>
                </div>
                <div className="input-block">
                  <label htmlFor="password" className="input-label">Contraseña</label>
                  <input type="password" name="password" id="password" placeholder="Ingresa tu contraseña" onChange={e => setPassword(e.target.value)} />
                </div>
                <div className="contenedor-buttons">
                  <Button className="button-olvidaste-pass" onClick={AbrirModalCambiarContraseña}>Olvidaste tu contraseña?</Button>
                  <button className="input-button">Inicio Sesion</button>
                </div>
              </div>
              <div className="contenedor-right">
                <img src={require("../../assets/img/brand/Logo4SalesShort.png")} alt=""/>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Dialog open={openModalCambiarPass} onClose={AbrirModalCambiarContraseña} >
        <Card>
          <CardHeader className='text-center' style={{paddingBottom:'0'}}>
            <Typography variant="h5" gutterBottom>
              Recuperación de contraseña
            </Typography>
          </CardHeader>
          <CardBody>
          {validandoCorreo ? 
            <>
              <Box sx={{ display: 'block'}}>
                <Box sx={{ m: 1, display:'flex'}}>
                  {success ? 
                  <Fab aria-label="save" color="primary" sx={buttonSx}>
                     <CheckIcon />
                  </Fab>
                  : <CircularProgress size={68} sx={{ color: green[500],margin:'0 auto 0 auto',zIndex: 1,}}/>}
                </Box>
              </Box>
            </> : <>
              <Label>Correo asociado:</Label>
              <Input type='email' placeholder='Ingresa el correo asociado que desea recuperar'
              onChange={(e) => setCorreoEnviarCodigo(e.target.value)}></Input>
              </>}
          </CardBody>
          <CardFooter >
            <Stack direction="row" spacing={1} style={{float:'right', display: 'block'}}>
              <ButtonMUI variant="contained" endIcon={<SendIcon />} onClick={() => ValidarCorreoIngresado()} disabled={validandoCorreo}>Enviar codigo de confirmación</ButtonMUI>
              <ButtonMUI variant="outlined" onClick={AbrirModalCambiarContraseña}>Cancelar</ButtonMUI>
            </Stack>
          </CardFooter>
        </Card>
      </Dialog>
    </>
  );
};

export default Register;
