import React, { useLayoutEffect, useState } from "react";

import { updateCompany, getUserId, getCompanybyID, getServiciosItbf } from '../../../Controller/Controller';

import '../../../assets/css/ViewStyles/registerCompany.css';
import AlertComponent from "../AlertComponent/AlertComponent";
import { Link, useHistory, useParams } from "react-router-dom";
import { Container } from "reactstrap";
import Header from "../../../components/Headers/Header";

const FormularioActualizacionEmpresa = ({isAdmin}) => {

    useLayoutEffect(()=> {
        if (isAdmin === true){
            window.location.href = "/*"
        }else{
            getDatosEmpresa();
        }
        getServicios()

    }, [isAdmin])

    const hiddenFileInput = React.useRef(null);

    let path = useParams();
    const history = useHistory ();

    const [alert , setAlert] = useState(true)
    const [mensa , setMensaje] = useState("")
    const [erro , setError] = useState(true)

    const imagenDefault = require('../../../assets/images/components/company-profile.png');
    const imageform = require('../../../assets/images/components/company.jpg');

    const [companyNIT, setNit] = useState("");
    const [companyRazonSocial, setRazonsocial] = useState("");
    const [companyAddress, setDireccion] = useState("");
    const [companyOwner, setPropietario] = useState("");
    const [companyEmail, setEmail] = useState("");
    const [companyCity, setCiudad] = useState("");
    const [companyWorkPlan, setPlantrabajo] = useState("");
    const [companyTelefono, setTelefono] = useState("");
    const [companyWebpage, setPaginaWeb] = useState("");
    const [companyImage, setImagensrc] = useState(imagenDefault);
    const [ImageFile, setImagenfile] = useState(null);

    const [imagenDiferente, setImagenDiferente] = useState(false);

    // Servicios
    const [services, setServices] = useState([]);
    const [serviceId, setServiceId] = useState(0);

    const RegisterCompany = async() =>{
        let formData = new FormData()
        formData.append('companyNIT', companyNIT)
        formData.append('companyRazonSocial', companyRazonSocial)
        formData.append('companyAddress', companyAddress)
        formData.append('companyMainContact', companyOwner)
        formData.append('companyMainCellphone', companyTelefono)
        formData.append('companyMainEmail', companyEmail)
        formData.append('companyCity', companyCity)
        formData.append('companyWebPage', companyWebpage)
        formData.append('companyWorkPlan', companyWorkPlan)
        formData.append('companyImage', companyImage)
        formData.append('ImageFile', ImageFile)
        formData.append('userId', getUserId())
        formData.append('servicioId', serviceId)
        
        const register = await updateCompany(formData, path.id)
        if(register === "OK"){
            setError(false)
            setMensaje("Los datos de la empresa se actualizo exitosamente")
            setAlert(false)
            setTimeout(() => {
                history.push("/SISTEMA/ITBF/crm-itbf/Comercial");
              }, 3000);
        }else if (register.status === 400) {
            setError(true)
            setMensaje(register.data)
            setAlert(false)
        }else{
            setError(true)
            setMensaje("Ocurrio un problema inesperado")
            setAlert(false)
        }
    }

    const handleSubmit= async e => {
        e.preventDefault();
        RegisterCompany();
    }

    const getDatosEmpresa = async() => {
        const empresa = await getCompanybyID(path.id);
        // console.log(empresa)
        if(!empresa){
        }else{
            setNit(empresa.compañia.companyNIT ? empresa.compañia.companyNIT : "" )
            setRazonsocial(empresa.compañia.companyRazonSocial ? empresa.compañia.companyRazonSocial : "")
            setDireccion(empresa.compañia.companyAddress ? empresa.compañia.companyAddress : "" )
            setPropietario(empresa.contactoPrincipal ? empresa.contactoPrincipal : "" )
            setEmail(empresa.correoPrincipal ? empresa.correoPrincipal : "" )
            setCiudad(empresa.compañia.companyCity ? empresa.compañia.companyCity : "" )
            setPlantrabajo(empresa.planDeTrabajo ? empresa.planDeTrabajo : "" )
            setTelefono(empresa.telefonoPrincipal ? empresa.telefonoPrincipal : "" )
            setPaginaWeb(empresa.compañia.companyWebPage ? empresa.compañia.companyWebPage : "" )
            setImagensrc(empresa.compañia.companyImage ? empresa.compañia.companyImage : "" )
            if(empresa.servicio){
                setServiceId(empresa.servicio.servicioId)
                // console.log(empresa.servicio.servicioId)
            }
        }
    }

    const changeImage = e => {
        if (e.target.files && e.target.files[0]){
            let imageFil = e.target.files[0];
            const reader = new FileReader();
            reader.onload = x => {
                setImagensrc(x.target.result)
                setImagenfile(imageFil)
                setImagenDiferente(true)
            }
            reader.readAsDataURL(imageFil)
        }else{
            setImagensrc(imagenDefault)
            setImagenfile(null)
        }
    }

    const getServicios = async() =>{
        const serv = await getServiciosItbf()
        if(serv){
            setServices(serv)
        }else{
            setServices([])
        }
    }

    const changeCompany = async e => {
        setServiceId(e.target.value)
    }

    const clickInputFile = () => {
        hiddenFileInput.current.click();
    }

    return(
    <>
    <Header></Header>
    <Container className="mt-5" fluid>
    <div >
        <div >
            <div className="main-panel">
                <div >
                    <div className="">
                        <div className="col-md-12 grid-margin" style={{boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px"}}>
                          <div className="form-group row">
                            <div className="col-sm-3 col-form-label card"  id="cardxd" style={{border: "1px solid rgb(165, 217, 219) !important"}}  >
                                <h1 className="texto-titulo-user-form">
                                    Puedes modificar todos los datos de la empresa seleccionada
                                </h1>
                                <div className="contenedorImagenRegister">
                                    <img src={imageform} className="imagenRegisterComponent" alt=""/>
                                </div>
                            </div>
                            <div className="card col-sm-9" id='card-body-register'>
                                <div className="card-body">
                                    <form className="forms-sample" onSubmit={handleSubmit}>
                                        <div className="image-company-form">
                                            {imagenDiferente ? <img src={companyImage} className="newimagenRegisterComponent" alt=""/> :
                                            <img src={'Images/Companies/'+companyImage} className="newimagenRegisterComponent" alt=""/>}
                                            <button onClick={clickInputFile} className="buttonnewimage" type="button"><img src="https://i.pinimg.com/originals/91/04/ab/9104ab6b89dd59d25881d8a74b1cb848.png" style={{width:'100%' , height:'auto', marginTop: '6px', marginBottom: 'auto'}}></img></button>
                                            <input type="file" ref={hiddenFileInput}  name="img[]" accept="image/*" className="file-upload-default" 
                                                onChange={changeImage} ></input>
                                        </div>
                                        <div className="form-group row">
                                        <label htmlFor="InputNit" className="col-sm-3 col-form-label" style={{height:'20px !important'}}>Nit</label>
                                            <div className="col-sm-9">
                                            <input type="text" className="form-control" id="InputNit" 
                                                placeholder="NIT de la empresa" value={companyNIT} onChange={e => setNit(e.target.value)}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="InputRazonSocial" className="col-sm-3 col-form-label">Razon Social</label>
                                            <div className="col-sm-9">
                                                <input type="text" className="form-control" id="InputRazonSocial" 
                                                    placeholder="Razon Social de la empresa" value={companyRazonSocial} onChange={e => setRazonsocial(e.target.value)}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="FormControlSelect" className="col-sm-3 col-form-label">Seleccionar Servicio</label>
                                            <div className="col-sm-9">
                                                <select className="form-control" id="FormControlSelectDepartment" onChange={changeCompany} value={serviceId}>
                                                    <option value={0}>Selecciona un Servicio</option>
                                                    {services.map((service) =>
                                                        <option key={service.servicioId} value={service.servicioId}> {service.servicioDescripcion} </option>
                                                    )}
                                                </select>
                                            </div>
                                            
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="InputDireccion" className="col-sm-3 col-form-label">Direccion</label>
                                            <div className="col-sm-9">
                                                <input type="text" className="form-control" id="InputDireccion" 
                                                    placeholder="Direccion de la empresa"  value={companyAddress} onChange={e => setDireccion(e.target.value)}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="InputPropietario" className="col-sm-3 col-form-label">Contacto Principal</label>
                                            <div className="col-sm-9">
                                                <input type="text" className="form-control" id="InputPropietario" 
                                                    placeholder="Nombre del Contacto Principal de la empresa" value={companyOwner} onChange={e => setPropietario(e.target.value)}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="InputTelefono" className="col-sm-3 col-form-label">Telefono Principal</label>
                                            <div className="col-sm-9">
                                                <input type="text" className="form-control" id="InputTelefono" 
                                                    placeholder="Telefono principal de la empresa" value={companyTelefono} onChange={e => setTelefono(e.target.value)}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="InputEmail" className="col-sm-3 col-form-label">Email Principal</label>
                                            <div className="col-sm-9">
                                                <input type="email" className="form-control" id="InputEmail" 
                                                    placeholder="Email principal de la empresa" value={companyEmail} onChange={e => setEmail(e.target.value)}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="InputCiudad" className="col-sm-3 col-form-label">Ciudad</label>
                                            <div className="col-sm-9">
                                                <input type="text" className="form-control" id="InputCiudad" 
                                                    placeholder="Ciudad de la empresa" value={companyCity} onChange={e => setCiudad(e.target.value)}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="InputWebPage" className="col-sm-3 col-form-label">Pagina Web</label>
                                            <div className="col-sm-9">
                                                <input type="text" className="form-control" id="InputWebPage" 
                                                    placeholder="Pagina web de la empresa" value={companyWebpage} onChange={e => setPaginaWeb(e.target.value)}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="TextareaPlanTrabajo" className="col-sm-3 col-form-label">Descripcion  <br></br>actividad principal <br></br>de la empresa</label>
                                            <div className="col-sm-9">
                                                <textarea className="form-control" id="TextareaPlanTrabajo" rows="3" 
                                                placeholder="Plan de Trabajo de la empresa" value={companyWorkPlan} onChange={e => setPlantrabajo(e.target.value)}></textarea>
                                            </div>
                                        </div>
                                        <br></br>
                                        <button type="submit" className="btn btn-primary mr-2">Actualizar</button>
                                        <Link type="button" className="btn btn-dark" to="/SISTEMA/ITBF/crm-itbf/companies">Cancelar</Link>
                                    </form>
                                </div>
                            </div>
                          </div>
                        </div>
                    </div>
                </div>
                {alert ? <p></p> : <AlertComponent openmodal={true} mensaje={mensa} error={erro} setAlert={setAlert}></AlertComponent>}
            </div>
        </div>
    </div>
    </Container>
    </>
    )
}

export default FormularioActualizacionEmpresa;