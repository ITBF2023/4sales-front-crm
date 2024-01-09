import React, { useState , useLayoutEffect} from "react";
import moment from "moment";

import { getAllUser, deleteUser, bloquearUsuario } from '../../../../Controller/Controller';

import '../../../../assets/css/ViewStyles/registerUser.css';
import { Button, Container, Form, Input } from "reactstrap";
import Header from "../../../../components/Headers/Header";
import DataTable from 'react-data-table-component'

import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";

const EdicionUsuariosCRMComponent = ( {isAdmin}) => {

  const [usuarios, setusuarios ] = useState([]);
  const [usuariosrespaldo, setusuariosrespaldo ] = useState([]);


    const getUsuarios = async () => {
        const users = await getAllUser();
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
          await deleteUser(id);
          getUsuarios();
      }
    }
 
    const mostrarDepartamento = ( departmentid) => {
        // if (departmentid === 1) {
        //     return <td><label className="badge badge-danger">Recursos <br></br> humanos</label></td>
        // }else if (departmentid === 1)

        switch (departmentid) {
            case 1:
              return <label className="badge badge-primary">Recursos <br></br> humanos</label>
            case 2:
              return <label className="badge badge-dark">Contabilidad</label>
            case 3:
              return <label className="badge badge-success">Financiera</label>
            case 4:
              return <label className="badge badge-info">Comercial</label>
            case 5:
              return <label className="badge badge-danger">Commiunity  <br></br> Manager</label>
            case 6:
              return <label className="badge badge-warning">Talento <br></br>  Humano</label>
            case 7:
              return <label className="badge badge-info">Ejecutiva de <br></br> Cuentas</label>
            case 10:
              return <label className="badge badge-success">IT</label>
            case 11:
              return <label className="badge badge-dark">Analista <br></br> Contable</label>
            default:
              return <label className="badge badge-primary">Gerente</label>
          }
    }

    const estadoUsuario = (estado) =>{
      if(estado){
        return "Activo"
      }else{
        return "Bloqueado"
      }
    }

    const BuscarUsuario = (busqueda) => {
      const usuariosnuevos = [...usuariosrespaldo]
  
      if(busqueda.trim()=== "" || busqueda.trim().length === 0){
        setusuarios(usuariosnuevos)
      }else{
        const result = usuariosnuevos.filter(user => user.userName.toLowerCase().includes(busqueda.toLowerCase()) 
                                          || user.userLastname.toLowerCase().includes(busqueda.toLowerCase()) 
                                          || user.userMail.toLowerCase().includes(busqueda.toLowerCase())
                                          || user.userWorkstation.toLowerCase().includes(busqueda.toLowerCase()))
  
        setusuarios(result)
      }
    }

    const BloquearUsuario = async (idrecibido) => {
      if (window.confirm("Si bloquea al usuario este ya no podra acceder a la plataforma \n ¿Desea continuar?")) {
        let formData = new FormData()
        formData.append('userActive', false)
        await bloquearUsuario(formData, idrecibido, false);
        getUsuarios();
      }
    }

    const ActivarUsuario = async (idrecibido) => {
      if (window.confirm("Si activa al usuario este podra acceder a la plataforma \n ¿Desea continuar?")) {
        let formData = new FormData()
        formData.append('userActive', true)

        await bloquearUsuario(formData, idrecibido, true);
        getUsuarios();
      }
    }

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
          name: 'Fecha de Creacion',
          selector: row => convert(row.userCreateDate),
          sortable: true,
      },
      {
        name: 'Estado',
        selector: row => estadoUsuario(row.userActive),
        sortable: true,
      },
      {
          name: 'Departamento',
          selector: row => mostrarDepartamento(row.departmentId),
          sortable: true
      },
      {
          name: 'Acciones',
          selector: row => mostrarBotonAcciones(row.userId, row.userActive),
          grow: 1.5
      },
    ];
  
    const mostrarBotonAcciones = (usuarioId, usuarioActivorecibido) => {
      return <div style={{display: "flex"}}>
              <Link color="info" size="sm" data-tip data-for="tool-tip-update-user" to={'actualizacionUsuarios-' + usuarioId} id='botonComercioUsers' ><i className='mdi mdi-account-edit'></i></Link>
              <ReactTooltip id="tool-tip-update-user" place="top" type="dark" effect="float">Editar Usuario</ReactTooltip>
              <Button color="info" size="sm" data-tip data-for="tool-tip-delete-user" id='botonComercioUsers' style={{border:'none'}}  onClick={() => DeleteUser(usuarioId)}><i className='mdi mdi-trash-can'></i></Button>
              <ReactTooltip id="tool-tip-delete-user" place="top" type="dark" effect="float">Eliminar Usuario</ReactTooltip>
              {usuarioActivorecibido ? <><Button color="info" size="sm" data-tip data-for="tool-tip-off-user" id='botonComercioUsers' style={{border:'none'}}  onClick={() => BloquearUsuario(usuarioId)}><i className='mdi mdi-account-off'></i></Button>
              <ReactTooltip id="tool-tip-off-user" place="top" type="dark" effect="float">Bloquear Usuario</ReactTooltip></>:
              <><Button color="info" size="sm" data-tip data-for="tool-tip-on-user" id='botonComercioUsers' style={{border:'none'}}  onClick={() => ActivarUsuario(usuarioId)}><i className='mdi mdi-account-key'></i></Button>
              <ReactTooltip id="tool-tip-on-user" place="top" type="dark" effect="float">Activar Usuario</ReactTooltip></>}
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

export default EdicionUsuariosCRMComponent;