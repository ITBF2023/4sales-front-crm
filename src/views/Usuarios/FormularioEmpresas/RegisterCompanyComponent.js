import React, { useLayoutEffect, useState } from "react";
// import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { postCompany, getUserId, getServiciosItbf, postValidateCompany, postSucursales} from '../../../Controller/Controller';

import '../../../assets/css/ViewStyles/registerCompany.css';
import AlertComponent from "../AlertComponent/AlertComponent";

import Header from "../../../components/Headers/Header";
import { Alert, Container, Row } from "reactstrap";
import { Link, useHistory } from "react-router-dom";

const RegisterCompanyComponent = ({isAdmin}) => {

    useLayoutEffect(()=> {
        // if (isAdmin === true){
        //     window.location.href = "/*"
        // }

        getServicios()
    }, [isAdmin])

    const history = useHistory ();


    const hiddenFileInput = React.useRef(null);

    const [alerta , setAlerta] = useState("")
    const [mensajeValidate , setMensajeValidate] = useState("")
    
    const [alert , setAlert] = useState(true)
    const [mensa , setMensaje] = useState(true)
    const [erro , setError] = useState(true)

    const imagenDefault = require('../../../assets/images/components/company-profile.png');
    const imageform = require('../../../assets/images/components/company.jpg');

    // const NewDate = (moment(new Date()).format("YYYY/MM/DD HH:mm:ss.sss")).toString(); 

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

    // Datos Autocompletados

    const [razonSocialObtenido, setRazonSocialObtenido] = useState(false)
    const [direccionObtenido, setDireccionObtenido] = useState(false)
    const [ciudadObtenido, setCiudadObtenido] = useState(false)
    const [paginaWebObtenido, setPaginawebOtenido] = useState(false)

    // Servicios
    const [services, setServices] = useState([]);
    const [serviceId, setServiceId] = useState([]);

    const [styleInputNit, setStyleInputNit] = useState({border: '2px solid #FE1313'});
    const [labelErrorNit, setLabelErrorNit] = useState(false)

    const [crearEmpresa, setCrearEmpresa] = useState(true)

    const [companyServices, setCompanyServices] = useState([]);


    const [open, setOpen] = useState(false);

    const [companyExiste, setCompanyExiste] = useState({})

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const RegisterCompany = async() =>{
        setCrearEmpresa(true)
        let formData = new FormData()
        formData.append('companyNIT', companyNIT)
        formData.append('companyRazonSocial', companyRazonSocial)
        formData.append('companyAddress', companyAddress)
        formData.append('companyMainContact', companyOwner ? companyOwner : "")
        formData.append('companyMainCellphone', companyTelefono)
        formData.append('[companyMainEmail]', companyEmail)
        formData.append('companyCity', companyCity)
        formData.append('companyWebPage', companyWebpage)
        formData.append('companyWorkPlan', companyWorkPlan)
        formData.append('companyImage', companyImage)
        formData.append('ImageFile', ImageFile)
        formData.append('userId', getUserId())
        formData.append('servicioId', serviceId)
        
        const register = await postCompany(formData)
        // console.log(register)
        if(register.status === 200){
          setError(false)
          setMensaje("La Empresa se creo exitosamente")
          setAlert(false)
          LimpiarFormulario()
          setCrearEmpresa(false)
        //   RegisterMainContact(register.data.companyID)
          setTimeout(() => {
              history.push("/SISTEMA/ITBF/crm-itbf/companie-sucursal-"+register.data.companyID);
          }, 3000);
        }else if(register.status === 400){
            setError(true)
            setMensaje(register.data)
            setAlert(false)
            setCrearEmpresa(false)
        }else{
          setError(true)
          setMensaje("Ocurrio un problema inesperado")
          setAlert(false)
          setCrearEmpresa(false)
        }
    }

    const handleSubmit= async e => {
        e.preventDefault();
        RegisterCompany();
    }

    const changeImage = e => {
        if (e.target.files && e.target.files[0]){
            let imageFil = e.target.files[0];
            const reader = new FileReader();
            reader.onload = x => {
                setImagensrc(x.target.result)
                setImagenfile(imageFil)
            }
            reader.readAsDataURL(imageFil)
        }else{
            setImagensrc(imagenDefault)
            setImagenfile(null)
        }
    }

    const getServicios = async() =>{
        const serv = await getServiciosItbf()
        if(serv[0]){
            setServices(serv)
        }else{
            setServices([])
        }
    }

    const changeCompany = async e => {
        setServiceId(e.target.value)
    }

    const LimpiarFormulario = () => {
        setNit("")
        setRazonsocial("");
        setDireccion("");
        setPropietario("");
        setEmail("");
        setCiudad("");
        setPlantrabajo("");
        setTelefono("");
        setPaginaWeb("");
        setCompanyExiste(null)
        setImagensrc(imagenDefault);

        setRazonSocialObtenido(false)
        setCiudadObtenido(false)
        setPaginawebOtenido(false)
        setDireccionObtenido(false)

    }

    const LlenarFormulario = (companyRecibida) => {
        setRazonsocial(companyRecibida.companyRazonSocial);
        setDireccion(companyRecibida.companyAddress);
        // setPropietario(companyRecibida.companyMainContact);
        // setEmail(companyRecibida.companyMainEmail);
        setCiudad(companyRecibida.companyCity);
        // setPlantrabajo(companyRecibida.companyWorkPlan);
        // setTelefono(companyRecibida.companyMainCellphone);
        setPaginaWeb(companyRecibida.companyWebPage);
        setImagensrc(companyRecibida.companyImage);
        setRazonSocialObtenido(true)
        setCiudadObtenido(true)
        setPaginawebOtenido(true)
        setDireccionObtenido(true)
    }
    
    const ChangeNitCompany = async e => {
        var cadena = e.target.value
        cadena = cadena.replaceAll(' ', '')

        var regexp = new RegExp('^([0-9]{9})+-[0-9]{1}$');
        if(regexp.test(cadena)){
            setStyleInputNit({})
            setLabelErrorNit(true)
            setCrearEmpresa(false)
            var datos = new FormData()
            datos.append('CompanyNit', cadena)
            var validar = await postValidateCompany(datos)
            // console.log(validar)
            if(validar[0] != null){
                handleClickOpen()
                setCompanyServices(validar)
                setMensajeValidate("La compañia "+validar[0].companyRazonSocial+ " ya existe en el sistema, y esta asociado a los siguientes Servicios:")
                setAlerta("Puedes asociarla a otros servicios distintos a los mostrados")
                setCompanyExiste(validar[0].compañia)
                LlenarFormulario(validar[0].compañia)
                // console.log(validar[0])

            }else{
                setImagensrc(imagenDefault)
                setCompanyExiste(null)
                // LimpiarFormulario()
                // console.log()
                handleClickOpen()
                setCompanyServices([])
                setMensajeValidate("La compañia no existe en el sistema, debe agregar todos los datos necesarios")
                setAlerta("")
            }
        }else{

            setCompanyServices([])
            setMensajeValidate("La compañia no existe en el sistema, debe agregar todos los datos necesarios")
            setAlerta("")

            setStyleInputNit({border: '2px solid #FE1313'})
            setLabelErrorNit(false)
            setCrearEmpresa(true)
        }
        setNit(cadena)
    }

    const ConsultaValidador = () =>{
        if(companyNIT.length === 11){
            handleClickOpen()
        }
    }

    const clickInputFile = () => {
        hiddenFileInput.current.click();
    }
    

    return(
    <>
    <Header></Header>
    <Container className="mt-5" fluid>
        <Row>
        <div className="col" >
            <div className="main-panel">
                <div className="content-wrapper">
                    <div className="container-form-company">
                        <div className="col-md-12 grid-margin" >
                          <div className="form-group row" style={{boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px"}} >
                            <div className="col-sm-3 col-form-label card" id="cardxd">
                                <h1 className="texto-titulo-user-form">
                                    Puedes crear diferentes tipos de empresas
                                </h1>
                                <div className="contenedorImagenRegister">
                                    <img src={imageform} className="imagenRegisterComponent" alt="imagen registro compañia"/>
                                </div>
                            </div>
                            <div className="card col-sm-9" style={{border: "1px solid rgb(165, 217, 219)"}}>
                                <div className="card-body">
                                    <form className="forms-sample" onSubmit={handleSubmit}>
                                        <div className="image-company-form">
                                            { companyExiste?.companyImage ? <img src={ window.location.protocol+"//"+window.location.host+"/Images/Companies/" + companyImage} className="newimagenRegisterComponent" alt="imagen nueva compañia"/>:
                                            <img src={companyImage} className="newimagenRegisterComponent" alt="imagen compañia"/>}
                                            { companyExiste?.companyImage ? <></> : <button className="buttonnewimage" type="button" onClick={clickInputFile}>
                                                <img src="https://i.pinimg.com/originals/91/04/ab/9104ab6b89dd59d25881d8a74b1cb848.png" alt="imagen camara" style={{width:'100%' , height:'auto', marginTop: '6px', marginBottom: 'auto'}}></img>
                                            </button>}
                                            <input type="file" ref={hiddenFileInput}  name="img[]" accept="image/*" className="file-upload-default" 
                                                onChange={changeImage} ></input>
                                        </div>
                                        <div className="form-group row">
                                        <label htmlFor="InputNit" className="col-sm-3 col-form-label">Nit</label>
                                            <div className="col-sm-9">
                                                <input type="text" className="form-control" id="InputNit" 
                                                    placeholder="NIT de la empresa" style={styleInputNit} onClick={ConsultaValidador} onChange={ChangeNitCompany} value={companyNIT}/>                                                    
                                                {labelErrorNit ? <span></span> : <label style={{color:'#FE1313', paddingTop:'10px'}}>El NIT debe contener 9 digitos, un guion "-" y el digito de verficación<br></br> Ejemplo: "123456789-1"</label>}
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="InputRazonSocial" className="col-sm-3 col-form-label">Razon Social</label>
                                            <div className="col-sm-9">
                                                <input type="text" className="form-control" id="InputRazonSocial" disabled={razonSocialObtenido} value={companyRazonSocial}
                                                    placeholder="Razon Social de la empresa" onChange={e => setRazonsocial(e.target.value)}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="FormControlSelect" className="col-sm-3 col-form-label">Seleccionar Servicio</label>
                                            <div className="col-sm-9">
                                                <select className="form-control" onChange={changeCompany}>
                                                    <option value={0}>Selecciona un Servicio</option>
                                                    {services.map((service) =>
                                                        <option key={service.servicioId} value={service.servicioId}> {service.servicioDescripcion} </option>
                                                    )}
                                                </select>
                                            </div>
                                            
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="InputDireccion" className="col-sm-3 col-form-label" >Direccion</label>
                                            <div className="col-sm-9">
                                                <input type="text" className="form-control" id="InputDireccion" disabled={direccionObtenido} value={companyAddress}
                                                    placeholder="Direccion de la empresa" onChange={e => setDireccion(e.target.value)}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="InputPropietario" className="col-sm-3 col-form-label">Contacto Principal</label>
                                            <div className="col-sm-9">
                                                <input type="text" className="form-control" id="InputPropietario" value={companyOwner}
                                                    placeholder="Nombre del Contacto Principal de la empresa" onChange={e => setPropietario(e.target.value)}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="InputTelefono" className="col-sm-3 col-form-label">Telefono Principal</label>
                                            <div className="col-sm-9">
                                                <input type="text" className="form-control" id="InputTelefono" value={companyTelefono}
                                                    placeholder="Telefono principal de la empresa" onChange={e => setTelefono(e.target.value)}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="InputEmail" className="col-sm-3 col-form-label">Email Principal</label>
                                            <div className="col-sm-9">
                                                <input type="email" className="form-control" id="InputEmail"  value={companyEmail}
                                                    placeholder="Email principal de la empresa" onChange={e => setEmail(e.target.value)}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="InputCiudad" className="col-sm-3 col-form-label" >Ciudad</label>
                                            <div className="col-sm-9">
                                                <input type="text" className="form-control" id="InputCiudad" disabled={ciudadObtenido} value={companyCity}
                                                    placeholder="Ciudad de la empresa" onChange={e => setCiudad(e.target.value)}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="InputWebPage" className="col-sm-3 col-form-label">Pagina Web</label>
                                            <div className="col-sm-9">
                                                <input type="text" className="form-control" id="InputWebPage" disabled={paginaWebObtenido} value={companyWebpage}
                                                    placeholder="Pagina web de la empresa" onChange={e => setPaginaWeb(e.target.value)}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="TextareaPlanTrabajo" className="col-sm-3 col-form-label">Descripcion  <br></br>Plan de Trabajo </label>
                                            <div className="col-sm-9">
                                                <textarea className="form-control" id="TextareaPlanTrabajo" rows="3" defaultValue={companyWorkPlan}
                                                placeholder="Plan de Trabajo de la empresa" onChange={e => setPlantrabajo(e.target.value)}></textarea>
                                            </div>
                                        </div>
                                        <br></br>
                                        <button type="submit" className="btn btn-primary mr-2" disabled={crearEmpresa}>Crear</button>
                                        <Link type="button" className="btn btn-dark" to="/SISTEMA/ITBF/crm-itbf/companies">Cancelar</Link>
                                    </form>
                                </div>
                            </div>
                          </div>
                        </div>
                    </div>
                </div>
                {alert ? <p></p> : <AlertComponent openmodal={true} mensaje={mensa} error={erro} setAlert={setAlert}></AlertComponent>}
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    component={'div'}
                >
                    <DialogTitle id="alert-dialog-title" component={'div'}>
                    NIT: {companyNIT}
                    </DialogTitle>
                    <DialogContent component={'div'}>
                    <DialogContentText id="alert-dialog-description" component={'div'}>
                        <div>
                        {mensajeValidate}{companyServices[0] ? <div><br></br></div>: <span></span> }
                        {companyServices.map((servi, index) => 
                            <div key={index} style={{display:'flex'}}>
                                <div style={{width:'30px', height:'30px', marginTop:'auto', marginBottom:'auto'}}>
                                    <img src={require("../../../assets/images/alertComponent/okey2.gif")} width={'100%'} alt="imagen esta"/>
                                </div>
                                <div style={{paddingTop:'2px', width: '35%'}}>{servi.servicio?.servicioDescripcion}
                                </div>
                                <div style={{width: '30%', marginTop:'auto', marginBottom:'auto'}}> {" >> Gestionada por >>"}</div>
                                <div style={{marginTop:'auto', marginBottom:'auto'}}> {servi.usuario?.userName} {servi.usuario?.userLastname} </div>
                            </div>
                        )}
                        {companyServices[0] ? <div><br></br></div>: <span></span> }{alerta}
                        </div>
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleClose}>OK</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
        </Row>
    </Container>
    </>
    )
}

export default RegisterCompanyComponent;