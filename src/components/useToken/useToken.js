import moment from 'moment';
import { useState } from 'react';

const useToken = ( ) => {

  let fechainicio = new Date()
  let fechafin = new Date()
  fechafin.setDate((fechainicio.getDate() + 1))
  fechafin = (moment(fechafin).format("YYYY/MM/DD HH:mm:ss"))
  fechainicio = (moment(new Date()).format("YYYY/MM/DD HH:mm:ss"))

  const getToken = () => {
    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken?.token
  };

  const [token, setToken] = useState(getToken());

  const saveToken = userToken => {
    localStorage.setItem('token', JSON.stringify(userToken[0]));
    localStorage.setItem('usuario', JSON.stringify(userToken[1]));
    localStorage.setItem('rol', JSON.stringify(userToken[2]));
    localStorage.setItem('fechas', JSON.stringify({ fechalogin : fechainicio, fechaexpira: fechafin}))
    setToken(userToken[0].token);
  };
  return {
      setToken: saveToken,
      token
  }
}

export default useToken;