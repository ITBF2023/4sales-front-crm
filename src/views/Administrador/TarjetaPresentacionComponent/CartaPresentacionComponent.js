import React, { useLayoutEffect, useState} from "react";
import moment from "moment";

import { getAllUser } from '../../../Controller/Controller';
import { Container } from "reactstrap";
import Header from "../../../components/Headers/Header";
import DataTable from 'react-data-table-component'
import { Link } from "react-router-dom";

const CartaPresentacionComponent = ({isAdmin}) => {

  const getUsers = async() => {
      const users = await getAllUser()
      setUsuarios(users)
  }

  useLayoutEffect(() => {
    if (isAdmin === false){
      window.location.href = "/403-Fordibben"
    }else{
      getUsers();
    }
    
  }, []);

  const convert = fecha => {
    return ( (moment(Date.parse(fecha)).format("DD MMM YYYY")).toString())
  }

  const [usuarios, setUsuarios] = useState([]);

  const columns = [
    {
      name: '#',
      selector: row => row.userId,
      sortable: true,
      grow: 0.5
    },
    {
        name: 'Nombres',
        selector: row => row.userName,
        sortable: true,
    },
    {
        name: 'Apellidos',
        selector: row => row.userLastname,
        sortable: true,
    },
    {
      name: 'Correo',
      selector: row => row.userMail,
      sortable: true,
    },
    {
      name: 'Fecha Creacion',
      selector: row => convert(row.userCreateDate),
      sortable: true,
    },
    {
      name: 'Acciones',
      selector: row => <Link className='btn bg-success' to={"tarjeta-"+ row.userId }> Generar </Link>,
    },
  ];

  const mostrarBotonVerMas = (usuarioId) => {
    return <div></div>
  } 

  return(
    <>
      <Header></Header>
      <Container className="mt-5" fluid>
        <div className="content-wrapper">
          <div className="page-header">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <h3 className="page-title">Generar Carta de Presentacion</h3>
              </ol>
            </nav>
          </div>
          <div className="grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Usuarios</h4>
                
                <DataTable
                  columns={columns}
                  data={usuarios}
                  pagination
                  theme="solarized"
                />

              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}

export default CartaPresentacionComponent;