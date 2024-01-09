import React, { useState , useLayoutEffect} from "react";

import { updateSucursales, getUserId, getSucursalbyID} from '../../../Controller/Controller';
import AlertComponent from "../AlertComponent/AlertComponent";

import '../../../assets/css/ViewStyles/registerUser.css';
import { Link, useHistory, useParams } from "react-router-dom";
import { Container } from "reactstrap";
import Header from "../../../components/Headers/Header";

const FormularioActualizacionContactoComponent = ( {isAdmin} ) => {

    // const getDepartments = async () => {
    //     const companiesget = await getAllMyCompanies(getUserId());
    //     setcompanies(companiesget)
    // }

    let path = useParams();
    const history = useHistory ();

    const [alert , setAlert] = useState(true)
    const [mensa , setMensaje] = useState("")
    const [erro , setError] = useState(true)

    useLayoutEffect(() => {
        if (isAdmin === true){
            window.location.href = "/*"
        }else{
            // getDepartments();
            ObtenerInformacionContacto();
        }
        
      }, []);

    const imageform = require('../../../assets/images/components/sucursal-form.png');

    // const [companies, setcompanies ] = useState([]);

    // const [companyNIT, setCompanyNIT] = useState();
    // const [companyRazonSocial, setcompanyRazonSocial] = useState();
    // const [companyAddress, setCompanyAddress] = useState();

    const [sucursalNombreContacto, setsucursalNombreContacto] = useState("");
    const [sucursalCargoContacto, setsucursalCargoContacto] = useState("");
    const [sucursalCorreoContacto, setsucursalCorreoContacto] = useState("");
    const [sucursalTelefonoContacto, setsucursalTelefonoContacto] = useState("");
    const [sucursalExtension, setsucursalExtension] = useState("");
    const [sucursalCelularContacto, setsucursalCelularContacto] = useState("");
    const [sucursalCity, setsucursalCity] = useState("");
    // const [companyImage, setImagensrc] = useState(imagenDefault);
    const [companyID, setcompanyID] = useState();
    // const [ImageFile, setImagenfile] = useState(null);
    
    const ObtenerInformacionContacto = async() => {
        const contacto = await getSucursalbyID(path.id)
        if(!contacto){
        }else{
            setsucursalNombreContacto(contacto.sucursalNombreContacto ? contacto.sucursalNombreContacto : "")
            setsucursalCargoContacto(contacto.sucursalCargoContacto ? contacto.sucursalCargoContacto : "")
            setsucursalCorreoContacto(contacto.sucursalCorreoContacto ? contacto.sucursalCorreoContacto : "")
            setsucursalTelefonoContacto(contacto.sucursalTelefonoContacto ? contacto.sucursalTelefonoContacto : "")
            setsucursalExtension(contacto.sucursalExtension ? contacto.sucursalExtension : "")
            setsucursalCelularContacto(contacto.sucursalCelularContacto ? contacto.sucursalCelularContacto : "")
            setsucursalCity(contacto.sucursalCity ? contacto.sucursalCity : "")
        }
    }

    const UpdateSucursal = async() =>{

        let formData = new FormData()
        formData.append('sucursalNombreContacto', sucursalNombreContacto ? sucursalNombreContacto :"NN")
        formData.append('sucursalCargoContacto', sucursalCargoContacto ? sucursalCargoContacto : "NN")
        formData.append('sucursalCorreoContacto', sucursalCorreoContacto ? sucursalCorreoContacto :"NN")
        formData.append('sucursalTelefonoContacto', sucursalTelefonoContacto ? sucursalTelefonoContacto : "0")
        formData.append('sucursalExtension', sucursalExtension  ? sucursalExtension :"NN")
        formData.append('sucursalCelularContacto', sucursalCelularContacto ? sucursalCelularContacto :"0")
        formData.append('sucursalCity', sucursalCity ? sucursalCity :"NN")

        const post = await updateSucursales(formData, path.id );
        // console.log(post)
        if(post === "OK"){
            setError(false)
            setMensaje("Contacto actualizado exitosamente")
            setAlert(false)
            setTimeout(() => {
                history.push("/SISTEMA/ITBF/crm-itbf/sucursales");
            }, 2000);
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
        UpdateSucursal();
    }

    // const changeCompany = async e => {
    //     if(!(parseInt(e.target.value , 8))){
    //         setcompanyID(0)
    //         setCompanyNIT(null)
    //         setcompanyRazonSocial(null)
    //         setCompanyAddress(null)
    //     }else{
    //         const getCompany = await getCompanybyID(e.target.value)
    //         setCompanyNIT(getCompany?.companyNIT)
    //         setcompanyRazonSocial(getCompany?.companyRazonSocial)
    //         setCompanyAddress(getCompany?.companyAddress)
    //         setcompanyID(e.target.value)
    //     }
    // }


    return(
    <>
      <Header></Header>
      <Container className="mt-5" fluid>
        <div className="content-wrapper">
            <div className="container-form-company">
                <div className="col-md-12 grid-margin" >
                    <div className="form-group row" >
                    <div className="col-sm-3 col-form-label card"  id="cardxd"  >
                        <h1 className="texto-titulo-user-form" style={{marginTop: "20%"}}>
                            Edicion del contacto
                        </h1>
                        <div className="contenedorImagenRegister">
                            <img src={imageform} className="imagenRegisterUser" alt=""/>
                        </div>
                    </div>
                    <div className="card col-sm-9">
                        <div className="card-body">
                            <form className="forms-sample" onSubmit={handleSubmit}>
                                <br></br>
                                {/* <div className="form-group row">
                                    <label htmlFor="FormControlSelect" className="col-sm-3 col-form-label">Seleccionar Empresa</label>
                                    <div className="col-sm-9">
                                        <select className="form-control select-options" id="FormControlSelectDepartment" onChange={changeCompany}>
                                            <option>Selecciona una Empresa</option>
                                            {companies.map((company) =>
                                                <option key={company.companyID} value={company.companyID}> {company.companyRazonSocial} </option>
                                            )}
                                        </select>
                                    </div>
                                    
                                </div>
                                <div className="form-group row">
                                <label htmlFor="InputNit" className="col-sm-3 col-form-label">NIT</label>
                                    <div className="col-sm-9">
                                    <input type="text" className="form-control" id="InputSucursalNIT" style={{color: "black"}}
                                        placeholder="NIT de la compañia" value={companyNIT} disabled="true"/>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="InputRazonSocial" className="col-sm-3 col-form-label">Razon Social</label>
                                    <div className="col-sm-9">
                                        <input type="text" className="form-control" id="InputSucursalRazonSocial" value={companyRazonSocial}
                                            placeholder="Razon Social de la compañia" disabled="true" style={{color: "black"}}/>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="InputDireccion" className="col-sm-3 col-form-label">Direccion</label>
                                    <div className="col-sm-9">
                                        <input type="text" className="form-control" id="InputDireccionSucursal" value={companyAddress}
                                            placeholder="Direccion de la Compañia" disabled="true" style={{color: "black"}}/>
                                    </div>
                                </div> */}
                                <div className="form-group row">
                                    <label htmlFor="InputNombre" className="col-sm-3 col-form-label">Nombre Contacto</label>
                                    <div className="col-sm-9">
                                        <input type="text" className="form-control" id="InputNombreContacto" 
                                            placeholder="Nombre de Contacto" value={sucursalNombreContacto} onChange={e => setsucursalNombreContacto(e.target.value)}/>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="InputCargoContacto" className="col-sm-3 col-form-label">Cargo de Contacto</label>
                                    <div className="col-sm-9">
                                        <input type="text" className="form-control" id="InputCargoContacto" 
                                            placeholder="Cargo de Contacto" value={sucursalCargoContacto} onChange={e => setsucursalCargoContacto(e.target.value)}/>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="InputCorreoContacto" className="col-sm-3 col-form-label">Correo Contacto</label>
                                    <div className="col-sm-9">
                                        <input type="text" className="form-control" id="InputCorreoContacto" 
                                            placeholder="Correo de Contacto" value={sucursalCorreoContacto} onChange={e => setsucursalCorreoContacto(e.target.value)}/>
                                    </div>
                                </div>
                                
                                <div className="form-group row">
                                    <label htmlFor="InputTelefonoContacto" className="col-sm-3 col-form-label">Telefono Contacto</label>
                                    <div className="col-sm-9">
                                        <input type="text" className="form-control" id="InputTelefonoContacto" 
                                            placeholder="Telefono de Contacto" value={sucursalTelefonoContacto} onChange={e => setsucursalTelefonoContacto(e.target.value)}/>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="InputExtension" className="col-sm-3 col-form-label">Extension</label>
                                    <div className="col-sm-9">
                                        <input type="text" className="form-control" id="InputExtension" 
                                            placeholder="Extension" value={sucursalExtension} onChange={e => setsucursalExtension(e.target.value)}/>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="InputCelularcontacto" className="col-sm-3 col-form-label">Celular Contacto</label>
                                    <div className="col-sm-9">
                                        <input type="text" className="form-control" id="InputCelularcontacto" 
                                            placeholder="Celular de contacto" value={sucursalCelularContacto} onChange={e => setsucursalCelularContacto(e.target.value)}/>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="InputCiudad" className="col-sm-3 col-form-label">Ciudad</label>
                                    <div className="col-sm-9">
                                        <input type="text" className="form-control" id="InputSucursalCiudad" 
                                            placeholder="Ciudad de contacto" value={sucursalCity} onChange={e => setsucursalCity(e.target.value)}/>
                                    </div>
                                </div>
                                
                                <br></br>
                                <button type="submit" className="btn btn-primary mr-2">Actualizar</button>
                                <Link type="button" className="btn btn-dark" to="/SISTEMA/ITBF/crm-itbf/sucursales">Cancelar</Link>
                            </form>
                        </div>
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

export default FormularioActualizacionContactoComponent;