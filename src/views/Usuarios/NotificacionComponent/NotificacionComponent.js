import React, {useLayoutEffect, useState } from "react";

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Slide from '@mui/material/Slide';


const NotificacionComponent = ({mensaje, strong, tipo, proceso, mostrar, setMostrar}) => {

  // ************************************************************************************************
  // Funciones dee Notificacion

  const [mensajeCuerpoMostrar, setMensajeCuerpoMostrar] = useState("")
  const [strongNotificacion, setStrongNotificacion] = useState("")
  const [tipoNotificacion, setTipoNotificacion] = useState("info")
  const [procesoNotificacion, setProcesoNotificacion] = useState("")
  
  const TransitionUp = (props) => {
    return <Slide {...props} direction="up" timeout={3000} />;
  }

  const cerrarNotificacion = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setMostrar(false);
  };

  // ************************************************************************************************

  useLayoutEffect(() => {
    setMensajeCuerpoMostrar(mensaje)
    setStrongNotificacion(strong)
    setTipoNotificacion(tipo)
    setProcesoNotificacion(proceso)
  }, []);

  return (
    <>
      <Snackbar
      anchorOrigin={{ vertical:'top', horizontal:'center' }}
      autoHideDuration={4000}
      TransitionComponent={TransitionUp}
      open={mostrar}
      onClose={cerrarNotificacion}
      // message="I love snacks"
      key={'top-center'}>
        <Alert severity={tipoNotificacion} onClose={() => cerrarNotificacion()}>
          <AlertTitle>{procesoNotificacion}</AlertTitle>
          {mensajeCuerpoMostrar} — <strong>{strongNotificacion}</strong>
        </Alert>
        
      </Snackbar>
    </>
    
  );
}

export default NotificacionComponent;