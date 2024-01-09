import React, { useState , useLayoutEffect} from "react";
import moment from "moment";

import { getAllUserCardMaker, deleteUserExternoCardMaker } from '../../../../Controller/Controller';

import '../../../../assets/css/ViewStyles/registerUser.css';
import { Button, Container, Form, Input } from "reactstrap";
import Header from "../../../../components/Headers/Header";
import DataTable from 'react-data-table-component'

import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";

const EdicionUsuariosCardMakerComponent = ( {isAdmin}) => {

  const [usuarios, setusuarios ] = useState([]);
  const [usuariosrespaldo, setusuariosrespaldo ] = useState([]);


    const getUsuarios = async () => {
        const users = await getAllUserCardMaker();
        // console.log(users)
        if(!users[0]){
          setusuarios([])
          setusuariosrespaldo([])
        }else{
          setusuarios(users)
          setusuariosrespaldo(users)
        }
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
          await deleteUserExternoCardMaker(id);
          getUsuarios();
      }
    }

    const BuscarUsuario = (busqueda) => {
      const usuariosnuevos = [...usuariosrespaldo]
  
      if(busqueda.trim()=== "" || busqueda.trim().length === 0){
        setusuarios(usuariosnuevos)
      }else{
        const result = usuariosnuevos.filter(user => user.nombre.toLowerCase().includes(busqueda.toLowerCase()) 
                                          || user.apellidos.toLowerCase().includes(busqueda.toLowerCase()) 
                                          || user.email.toLowerCase().includes(busqueda.toLowerCase()))
  
        setusuarios(result)
      }
    }

    const columns = [
      {
          name: '#',
          selector: row => row.secuencia,
          sortable: true,
          grow: 0.5
          },
      {
          name: 'Nombre',
          selector: row => row.nombre,
          sortable: true,
      },
      {
          name: 'Apellido',
          selector: row => row.apellidos,
          sortable: true,
      },
      {
          name: 'Correo',
          selector: row => row.email,
          sortable: true,
      },
      {
          name: 'Rol Usuario',
          selector: row => row.rolUsuario,
          sortable: true,
      },
      {
        name: 'Estado',
        selector: row => "Activo",
        sortable: true,
    },
      {
          name: 'Acciones',
          selector: row => mostrarBotonAcciones(row.usuarioId),
          grow: 1.5
      },
    ];
  
    const mostrarBotonAcciones = (usuarioId) => {
      return <div style={{display: "flex"}}>
              <Link color="info" size="sm" data-tip data-for="tool-tip-update-user" to={'actualizacionUsuarioCardMaker-' + usuarioId} id='botonComercioUsers' ><i className='mdi mdi-account-edit'></i></Link>
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

export default EdicionUsuariosCardMakerComponent;