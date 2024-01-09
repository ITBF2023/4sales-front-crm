import { useState } from 'react';

const useRol = ( ) => {
    const getRol = () => {
      const roluser = localStorage.getItem('rol');
      const rol = JSON.parse(roluser);
      return rol?.rolUser
    };

    const [ isAdmin, setAdmin ] = useState(getRol());

    const saveRol = userToken => {
      setAdmin(userToken[2].rolUser);
    };
    return {
        setAdmin: saveRol,
        isAdmin
      }
}

export default useRol;