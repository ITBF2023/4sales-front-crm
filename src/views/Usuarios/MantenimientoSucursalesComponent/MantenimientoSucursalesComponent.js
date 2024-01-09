import React, { useState , useLayoutEffect} from "react";
import { getAllMySucursales, deleteSucursal, getUserId, getAllMyCompanies, getFilterContactbyCompany} from '../../../Controller/Controller';

import '../../../assets/css/ViewStyles/mantenimientoCompanies.css';

import DataTable from 'react-data-table-component'
import Select from 'react-select'
import { Button, Container } from "reactstrap";
import Header from "../../../components/Headers/Header";
import { Link } from "react-router-dom";

const MantenimientoSucursalesComponent = ({isAdmin}) => {

    const mostrarRazonSocial = (nombre, contactoId) => {
        return <div style={{paddingTop: '25px', paddingBottom: '25px'}}><Link to={'/SISTEMA/ITBF/crm-itbf/edicionContacto-'+contactoId}> {nombre}</Link></div>
    }
    
    const mostrarBotonAcciones = (contactoId) => {
      return (
        <div style={{display: "flex"}}>
            <Button color="info" size="sm"><Link to={'/SISTEMA/ITBF/crm-itbf/edicionContacto-' + contactoId } style={{color:"white"}}><i className='mdi mdi-account-edit'></i></Link></Button>
            <Button color="info" size="sm" onClick={() => DeleteSucursa(contactoId)}><i className='mdi mdi-trash-can'></i></Button>
        </div>)
    } 

    const columns = [
    {
        name: '#',
        selector: row => row.sucursalID,
        sortable: true,
        grow: 0.5
        },
    {
        name: 'Nombre Contacto',
        selector: row => mostrarRazonSocial(row.sucursalNombreContacto,row.sucursalID),
        sortable: true,
        grow: 2
    },
    {
        name: 'Cargo',
        selector: row => row.sucursalCargoContacto,
        sortable: true,
        grow: 1.5
    },
    {
        name: 'Correo',
        selector: row => row.sucursalCorreoContacto,
        sortable: true,
        grow: 1.5
    },
    {
        name: 'Celular',
        selector: row => row.sucursalCelularContacto,
        sortable: true,
        grow: 1.5
    },
    {
        name: 'Ciudad',
        selector: row => row.sucursalCity,
        sortable: true
    },
    {
        name: 'Acciones',
        selector: row => mostrarBotonAcciones(row.sucursalID),
    },
    ];

    const getSucursal = async () => {
        const sucursal = await getAllMySucursales(getUserId());
        if(!sucursal){
            setSucursales([])
            setSucursalRespaldo([])
        }else{
            setSucursales(sucursal)
            setSucursalRespaldo(sucursal)
        }
    }

    useLayoutEffect(() => {
        if (isAdmin === true){
            window.location.href = "/*"
        }else{
            getSucursal();
            getCompanies();
        }
        
      }, []);
    
    const DeleteSucursa = async(id ) => {
        if (window.confirm("Esta Seguro de eliminar este contacto")) {
            await deleteSucursal(id);
            getSucursal();
        }
    }

    const [options, setOptions] = useState([{ value: '0', label: 'Todos' },])

    const getCompanies = async () => {
        const company = await getAllMyCompanies(getUserId());
        // console.log(company)
        if(!company[0].compañiaServiciosId){
        }else{
            var op = options
            company.map((comp)=>{
                var servicio = comp.servicioDescripcion != undefined ? comp.servicioDescripcion : "Por Definir"
                var labelmo = comp.companyRazonSocial + " 🢂 Servicio: " + servicio  + "🢀 "
                var valor = {value: comp.compañiaServiciosId, label: labelmo}
                op.push(valor)
            })
            setOptions(op)
        }
    }

    const [sucursales, setSucursales ] = useState([]);
    const [sucursalRespaldo, setSucursalRespaldo ] = useState([]);

    const SearchContacts = async (cadena) => {

      const nuevassucursales = [...sucursalRespaldo]

      if(cadena.trim()=== "" || cadena.trim().length === 0){
        setSucursales(nuevassucursales)
      }else{
        // console.log(cadena)
        // console.log(nuevassucursales)
        const result = nuevassucursales.filter(sucu => sucu.sucursalNombreContacto?.toLowerCase().includes(cadena.toLowerCase()) 
                                        || sucu.sucursalCargoContacto?.toLowerCase().includes(cadena.toLowerCase())
                                        || sucu.sucursalCorreoContacto?.toLowerCase().includes(cadena.toLowerCase())
                                        || sucu.sucursalCelularContacto?.toLowerCase().includes(cadena.toLowerCase())
                                        || sucu.sucursalCity?.toLowerCase().includes(cadena.toLowerCase()) )

        setSucursales(result)
      }

    }

    const ChangeCompany = async (value) => {
        const contacts = await getFilterContactbyCompany(value.value == 0 ? "00000000-0000-0000-0000-000000000000" : value.value, getUserId())
        if (!contacts) {
            setSucursales([])
        }else{
            setSucursales(contacts)
        }
    }


    return(
    <>
      <Header></Header>
      <Container className="mt-5" fluid>
      <div className="col">
        <div className="container-fluid page-body-wrapper">
            <div className="main-panel">
              <div className="content-wrapper">
                <div className="page-header">
                <h3 className="page-title"> Contactos Registrados </h3>
                </div>
                <div className="row">
                    <div className="col-lg-12 grid-margin stretch-card">
                        <div className="card">
                        <div className="card-body">

                            <div className="page-header contenedor-filtro-busqueda">
                                <div className="nav-item col-sm-8 filtro-sucursal">
                                    <div className="col-sm-2">Filtrar por empresas</div>
                                    <div style={{paddingTop: "5px"}}>
                                        <Select 
                                            options={options} 
                                            styles={{option: (provided, state) => ({
                                                ...provided,
                                                borderBottom: '1px dotted pink',
                                                color: 'black',
                                                padding: 10,
                                            }),control: () => ({
                                                display: "flex",
                                                backgroundColor: "white",
                                                width: 400,
                                                borderRadius: "10px",
                                                border:'1px solid #666'
                                            }),}}
                                            onChange={ChangeCompany}>
                                        </Select>
                                    </div>
                                </div>

                                <form className="nav-item col-sm-4 form-search-sucursales">
                                    <input type="text" className="form-control" onChange={e => SearchContacts(e.target.value)}  placeholder="Buscar por Nombre Contacto / Cargo / Correo / Celular / Ciudad"/>
                                </form>
                            </div>
                            <br></br>
                            <br></br>
                            <DataTable
                                columns={columns}
                                data={sucursales}
                                pagination
                                theme="mantenimientoContacts"
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
            </div>
        </div>
      </div>
      </Container>
    </>  
    )
}

export default MantenimientoSucursalesComponent;