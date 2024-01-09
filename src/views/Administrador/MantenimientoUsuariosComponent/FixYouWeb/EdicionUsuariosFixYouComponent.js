import React, { useState , useLayoutEffect} from "react";
import moment from "moment";

import { getAllUserFixYouWeb, deleteUserExternoFixYouWeb } from '../../../../Controller/Controller';

import '../../../../assets/css/ViewStyles/registerUser.css';
import { Button, Container, Form, Input } from "reactstrap";
import Header from "../../../../components/Headers/Header";
import DataTable from 'react-data-table-component'

import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";

const EdicionUsuariosFixYouComponent = ( {isAdmin}) => {

  const [usuarios, setusuarios ] = useState([]);
  const [usuariosrespaldo, setusuariosrespaldo ] = useState([]);


    const getUsuarios = async () => {
        const users = await getAllUserFixYouWeb();
        // console.log(users)
        if(!users[0]){
          setusuarios([])
          setusuariosrespaldo([])
        }else{
          setusuarios(users)
          setusuariosrespaldo(users)
        }
    }
    const convert = fecha => {
        return ( (moment(Date.parse(fecha)).format("DD MMM YYYY")).toString())
    }
    useLayoutEffect(() => {
      if (isAdmin === false){
        window.location.href = "/403-Fordibben"
      }else{
        getUsuarios();
      }
        
      }, []);

    const DeleteUser = async(id ) => {
      if (window.confirm("Esta Seguro de eliminar este usuario")) {
          await deleteUserExternoFixYouWeb(id);
          getUsuarios();
      }
    }
 
    const mostrarPerfil = ( perfilId) => {

        switch (perfilId) {
            case 4:
              return <label className="badge badge-success">Motorizado</label>
            case 3:
              return <label className="badge badge-info">Tecnico</label>
            case 1:
              return <label className="badge badge-dark">Administrador</label>
            case 2:
              return <label className="badge badge-info">PQR</label>
            default:
              return <label className="badge badge-primary">No Definido</label>
          }
    }

    const BuscarUsuario = (busqueda) => {
      const usuariosnuevos = [...usuariosrespaldo]
  
      if(busqueda.trim()=== "" || busqueda.trim().length === 0){
        setusuarios(usuariosnuevos)
      }else{
        const result = usuariosnuevos.filter(user => user.usuarioNombre.toLowerCase().includes(busqueda.toLowerCase()) 
                                          || user.usuarioCorreo.toLowerCase().includes(busqueda.toLowerCase()) 
                                          || user.usuarioTelefono1.toLowerCase().includes(busqueda.toLowerCase()))
  
        setusuarios(result)
      }
    }


    const columns = [
      {
          name: '#',
          selector: row => row.usuarioId,
          sortable: true,
          grow: 0.5
          },
      {
          name: 'Nombres',
          selector: row => row.usuarioNombre,
          sortable: true,
      },
      {
          name: 'Correo',
          selector: row => row.usuarioCorreo,
          sortable: true,
      },
      {
        name: 'Telefono',
        selector: row => row.usuarioTelefono1,
        sortable: true,
      },
      {
          name: 'Fecha de Creacion',
          selector: row => convert(row.usuarioFechaRegistro),
          sortable: true,
      },
      {
        name: 'Estado',
        selector: row => "Activo",
        sortable: true,
      },
      {
          name: 'Perfil',
          selector: row => mostrarPerfil(row.perfilId),
          sortable: true
      },
      {
          name: 'Acciones',
          selector: row => mostrarBotonAcciones(row.usuarioId),
          grow: 1.5
      },
    ];
  
    const mostrarBotonAcciones = (usuarioId) => {
      return <div style={{display: "flex"}}>
              <Link color="info" size="sm" data-tip data-for="tool-tip-update-user" to={'actualizacionUsuarioFixu-' + usuarioId} id='botonComercioUsers' ><i className='mdi mdi-account-edit'></i></Link>
              <ReactTooltip id="tool-tip-update-user" place="top" type="dark" effect="float">Editar Usuario</ReactTooltip>
              <Button color="info" size="sm" data-tip data-for="tool-tip-delete-user" id='botonComercioUsers' style={{border:'none'}}  onClick={() => DeleteUser(usuarioId)}><i className='mdi mdi-trash-can'></i></Button>
              <ReactTooltip id="tool-tip-delete-user" place="top" type="dark" effect="float">Eliminar Usuario</ReactTooltip>
             </div>
    }

    return(
    <>
      <Header></Header>
      <Container className="mt-5" fluid>
        <div className="content-wrapper">
          <div className="page-header">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <h3 className="page-title"> Tabla de Usuarios </h3>
              </ol>
            </nav>
          </div>
          <div className="row">
            <div className="col-lg-12 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <Form className="row justify-content-end"><Input className='col-sm-6 input-busqueda' placeholder='Buscar usuario' onChange={(e) => BuscarUsuario(e.target.value)}/></Form>

                  <DataTable
                    columns={columns}
                    data={usuarios}
                    pagination
                    paginationComponentOptions={{
                        rowsPerPageText: 'Filas por Página',
                        rangeSeparatorText: 'de',
                        selectAllRowsItem: true,
                        selectAllRowsItemText: 'Todos'
                    }}
                    fixedHeaderScrollHeight="600px"
                    highlightOnHover
                    pointerOnHover
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
    )
}

export default EdicionUsuariosFixYouComponent;