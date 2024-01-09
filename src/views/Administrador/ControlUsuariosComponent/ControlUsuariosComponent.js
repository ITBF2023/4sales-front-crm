import Header from "../../../components/Headers/Header";
import React, { useLayoutEffect, useState} from "react";
import { Container } from "reactstrap";

import { getControlUser } from '../../../Controller/Controller';
import DataTable from 'react-data-table-component'
import { Link } from "react-router-dom";

const ControlUsuariosComponent = ({isAdmin}) => {

    const getUsuarios = async () => {
        const users = await getControlUser();
        setusuarios(users)
    }

    useLayoutEffect(() => {
      if (isAdmin === false){
        window.location.href = "/403-Fordibben"
      }else{
        getUsuarios();
      }
        
      }, []);

    const [usuarios, setusuarios ] = useState([]);

    const columns = [
      {
        name: '#',
        selector: row => row.userId,
        sortable: true,
        grow: 0.5
      },
      {
          name: 'Nombre',
          selector: row => row.userName,
          sortable: true,
      },
      {
          name: 'Apellido',
          selector: row => row.userLastname,
          sortable: true,
      },
      {
        name: 'Correo',
        selector: row => row.userMail,
        sortable: true,
      },
      {
        name: 'Cant. Empresas',
        selector: row => row.cantidadEmpresas,
        sortable: true,
      },
      {
        name: 'Cant. Contactos',
        selector: row => row.cantidadContactos,
        sortable: true,
      },
      {
        name: 'Acciones',
        selector: row => <Link className='btn' id='botonComercioUsers' to={"empresasByUser-"+ row.userId} >Ver Bitacoras</Link>,
      },
  ];

    return (
    <>
      <Header></Header>
      <Container className="mt-5" fluid >                    
        <div className="col" >
          <div className="card" >
            <div className="card-body" >
              <h4 className="card-title">Control de Usuarios</h4>
              
              <DataTable
                    columns={columns}
                    data={usuarios}
                    pagination
                    theme="solarized"
              />
            </div>
          </div>
        </div>
      </Container>
    </>
    )
}

export default ControlUsuariosComponent;