import React, { useState , useLayoutEffect} from "react";
// import moment from "moment";

import { getAllMyCompanies, postSucursales, getUserId, getCompanybyID} from '../../../Controller/Controller';
import AlertComponent from "../AlertComponent/AlertComponent";

import '../../../assets/css/ViewStyles/registerUser.css';
import { Container } from "reactstrap";
import Header from "../../../components/Headers/Header";
import { Link, useHistory } from "react-router-dom";

const RegisterUserContactComponent = ( {isAdmin} ) => {

    const getDepartments = async () => {
        const companiesget = await getAllMyCompanies(getUserId());
        // console.log(companiesget)
        setcompanies(companiesget)
    }

    const [alert , setAlert] = useState(true)
    const [mensa , setMensaje] = useState("")
    const [erro , setError] = useState(true)

    useLayoutEffect(() => {
        if (isAdmin === true){
            window.location.href = "/*"
        }else{
            getDepartments();
        }
        
      }, []);  

    const history = useHistory ();

    const imageform = require('../../../assets/images/components/sucursal-form.png');

    const [companies, setcompanies ] = useState([]);

    const [companyNIT, setCompanyNIT] = useState("");
    const [companyRazonSocial, setcompanyRazonSocial] = useState("");
    const [companyAddress, setCompanyAddress] = useState("");


    const [sucursalNombreContacto, setsucursalNombreContacto] = useState("");
    const [sucursalCargoContacto, setsucursalCargoContacto] = useState("");
    const [sucursalCorreoContacto, setsucursalCorreoContacto] = useState("");
    const [sucursalTelefonoContacto, setsucursalTelefonoContacto] = useState("");
    const [sucursalExtension, setsucursalExtension] = useState("");
    const [sucursalCelularContacto, setsucursalCelularContacto] = useState("");
    const [sucursalCity, setsucursalCity] = useState("");
    const [companyServicioId, setcompanyServicioID] = useState("");

    const RegisterSucursal = async() =>{

        let formData = new FormData()
        formData.append('sucursalNombreContacto', sucursalNombreContacto)
        formData.append('sucursalCargoContacto', sucursalCargoContacto)
        formData.append('sucursalCorreoContacto', sucursalCorreoContacto)
        formData.append('sucursalTelefonoContacto', sucursalTelefonoContacto)
        formData.append('sucursalExtension', sucursalExtension)
        formData.append('sucursalCelularContacto', sucursalCelularContacto)
        formData.append('sucursalCity', sucursalCity)
        formData.append('userId', getUserId())
        formData.append('compañiaServicioItbfId', companyServicioId)

        const post = await postSucursales(formData);
        // console.log(post)
        if(post === "OK"){
            setError(false)
            setMensaje("Contacto creado exitosamente")
            setAlert(false)
            setTimeout(() => {
                history.push("/SISTEMA/ITBF/crm-itbf/Comercial");
            }, 3000);
        }else if (post === "ERROR") {
            setError(true)
            setMensaje("Ocurrio un problema inesperado")
            setAlert(false)
        }else{
            if(post === "" || !post){
                setMensaje("Ocurrio un problema inesperado")
            }else{
                setMensaje(post)
            }
            setError(true)
            setAlert(false)
        }

    }

    const handleSubmit= async e => {
        e.preventDefault();
        RegisterSucursal();
    }

    const changeCompany = async e => {
        // console.log(e.target.value)
        if(e.target.value === "0"){
            setcompanyServicioID(0)
            setCompanyNIT("")
            setcompanyRazonSocial("")
            setCompanyAddress("")
        }else{
            const getCompany = await getCompanybyID(e.target.value)
            setCompanyNIT(getCompany?.compañia.companyNIT)
            setcompanyRazonSocial(getCompany?.compañia.companyRazonSocial)
            setCompanyAddress(getCompany?.compañia.companyAddress)
            setcompanyServicioID(e.target.value)
        }
    }

    return(
    <>
      <Header></Header>
      <Container className="mt-5" fluid>
        
        <div className="container-form-company" >
            <div className="col-md-12 grid-margin" >
            <div className="form-group row" >
                <div className="col-sm-3 col-form-label card"  id="cardxd"  >
                    <h1 className="texto-titulo-user-form">
                        Puedes crear Contactos asociados a diferentes empresas
                    </h1>
                    <div className="contenedorImagenRegister">
                        <img src={imageform} className="imagenRegisterUser" alt=""/>
                    </div>
                </div>
                <div className="card col-sm-9">
                    <div className="card-body">
                        <form className="forms-sample" onSubmit={handleSubmit}>
                            <br></br>
                            <div className="form-group row">
                                <label htmlFor="FormControlSelect" className="col-sm-3 col-form-label">Seleccionar Empresa</label>
                                <div className="col-sm-9">
                                    <select className="form-control" id="FormControlSelectDepartment" onChange={changeCompany}>
                                        <option value={0}>Selecciona una Empresa</option>
                                        {companies.map((company) =>
                                            <option key={company.compañiaServiciosId} value={company.compañiaServiciosId}> {company.companyRazonSocial} 🢂 {company.servicioDescripcion} 🢀 </option>
                                        )}
                                    </select>
                                </div>
                                
                            </div>
                            <div className="form-group row">
                            <label htmlFor="InputNit" className="col-sm-3 col-form-label">NIT</label>
                                <div className="col-sm-9">
                                <input type="text" className="form-control" id="InputSucursalNIT" style={{color: "black"}}
                                    placeholder="NIT de la compañia" value={companyNIT} disabled={true}/>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="InputRazonSocial" className="col-sm-3 col-form-label">Razon Social</label>
                                <div className="col-sm-9">
                                    <input type="text" className="form-control" id="InputSucursalRazonSocial" value={companyRazonSocial}
                                        placeholder="Razon Social de la compañia" disabled={true} style={{color: "black"}}/>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="InputDireccion" className="col-sm-3 col-form-label">Direccion</label>
                                <div className="col-sm-9">
                                    <input type="text" className="form-control" id="InputDireccionSucursal" value={companyAddress}
                                        placeholder="Direccion de la Compañia" disabled={true} style={{color: "black"}}/>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="InputNombre" className="col-sm-3 col-form-label">Nombre Contacto</label>
                                <div className="col-sm-9">
                                    <input type="text" className="form-control" id="InputNombreContacto" 
                                        placeholder="Nombre de Contacto" onChange={e => setsucursalNombreContacto(e.target.value)}/>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="InputCargoContacto" className="col-sm-3 col-form-label">Cargo de Contacto</label>
                                <div className="col-sm-9">
                                    <input type="text" className="form-control" id="InputCargoContacto" 
                                        placeholder="Cargo de Contacto" onChange={e => setsucursalCargoContacto(e.target.value)}/>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="InputCorreoContacto" className="col-sm-3 col-form-label">Correo Contacto</label>
                                <div className="col-sm-9">
                                    <input type="text" className="form-control" id="InputCorreoContacto" 
                                        placeholder="Correo de Contacto" onChange={e => setsucursalCorreoContacto(e.target.value)}/>
                                </div>
                            </div>
                            
                            <div className="form-group row">
                                <label htmlFor="InputTelefonoContacto" className="col-sm-3 col-form-label">Telefono Contacto</label>
                                <div className="col-sm-9">
                                    <input type="text" className="form-control" id="InputTelefonoContacto" 
                                        placeholder="Telefono de Contacto" onChange={e => setsucursalTelefonoContacto(e.target.value)}/>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="InputExtension" className="col-sm-3 col-form-label">Extension</label>
                                <div className="col-sm-9">
                                    <input type="text" className="form-control" id="InputExtension" 
                                        placeholder="Extension" onChange={e => setsucursalExtension(e.target.value)}/>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="InputCelularcontacto" className="col-sm-3 col-form-label">Celular Contacto</label>
                                <div className="col-sm-9">
                                    <input type="text" className="form-control" id="InputCelularcontacto" 
                                        placeholder="Celular de contacto" onChange={e => setsucursalCelularContacto(e.target.value)}/>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="InputCiudad" className="col-sm-3 col-form-label">Ciudad</label>
                                <div className="col-sm-9">
                                    <input type="text" className="form-control" id="InputSucursalCiudad" 
                                        placeholder="Ciudad de contacto" onChange={e => setsucursalCity(e.target.value)}/>
                                </div>
                            </div>
                            
                            <br></br>
                            <button type="submit" className="btn btn-primary mr-2">Crear</button>
                            <Link type="button" className="btn btn-dark" to="/SISTEMA/ITBF/crm-itbf/sucursales">Cancelar</Link>
                        </form>
                    </div>
                </div>
            </div>
            </div>
        </div>
        {alert ? <p></p> : <AlertComponent openmodal={true} mensaje={mensa} error={erro} setAlert={setAlert}></AlertComponent>}
                
      </Container>
    </>
        
        
    )
}

export default RegisterUserContactComponent;