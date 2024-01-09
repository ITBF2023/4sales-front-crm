import React, { useState , useLayoutEffect} from "react";

import { postUser, getAllDepartement } from '../../../Controller/Controller';

import '../../../assets/css/ViewStyles/registerUser.css';
import { Container } from "reactstrap";
import Header from "../../../components/Headers/Header";
import AlertComponent from "../../../views/Usuarios/AlertComponent/AlertComponent";
import { Link, useHistory } from "react-router-dom";

const RegisterUserComponent = ( {isAdmin} ) => {

    const getDepartments = async () => {
        const getdepart = await getAllDepartement();
        // console.log(getdepart)
        if(!getdepart[0]){
            setdepartments([])
        }else{
            setdepartments(getdepart)
        }
    }

    useLayoutEffect(() => {
        if (isAdmin === false){
            window.location.href = "/403-Fordibben"
        }else{
            getDepartments();
        }
        
      }, []);  

    const imagenDefault = require('../../../assets/images/components/user-default.png');
    const imageform = require('../../../assets/images/components/user-form.png');

    const [departments, setdepartments ] = useState([]);

    const [userName, setuserName] = useState("");
    const [userLastname, setuserLastname] = useState("");
    const [userMail, setuserMail] = useState("");
    const [userPassword, setuserPassword] = useState("");
    const [userPhone, setuserPhone] = useState("");
    const [userCellPhone, setuserCellPhone] = useState("");
    const [userImage, setImagensrc] = useState(imagenDefault);
    const [userWorkstation, setuserWorkstation] = useState("");
    const [userActive, setuserActive] = useState("");
    const [departmentId, setdepartmentId] = useState("");
    const [ImageFile, setImagenfile] = useState(null);

    const [alert , setAlert] = useState(true)
    const [mensa , setMensaje] = useState(true)
    const [erro , setError] = useState(true)

    const hiddenFileInput = React.useRef(null);
    const history = useHistory()

    const RegisterUser = async() =>{
        let formData = new FormData()
        formData.append('userName', userName)
        formData.append('userLastname', userLastname)
        formData.append('userMail', userMail)
        formData.append('userPassword', userPassword)
        formData.append('userPhone', userPhone)
        formData.append('userCellPhone', userCellPhone)
        formData.append('userWorkstation', userWorkstation)
        formData.append('userActive', userActive)
        formData.append('departmentId', departmentId)
        formData.append('Rol', "U")
        formData.append('userImage', userImage)
        formData.append('ImageFile', ImageFile)
        
        const register = await postUser(formData)
        if(register === "OK"){
            setError(false)
            setMensaje("El usuario se creo exitosamente")
            setAlert(false)
            setTimeout(() => {
                history.push("users");
            }, 2000);
        }else if (register === "ERROR") {
            setError(true)
            setMensaje("Ocurrio un problema inesperado")
            setAlert(false)

        }else{
            setError(true)
            setMensaje(register)
            setAlert(false)

        }
    }

    const handleSubmit= async e => {
        e.preventDefault();
        RegisterUser();
    }

    const changeDeparmet = e => {
        if(!(parseInt(e.target.value , 8))){
            setdepartmentId(0)
            setuserWorkstation(null)
        }else{
            setdepartmentId(e.target.value)
            setuserWorkstation(e.target[e.target.selectedIndex].text)
            setuserActive(true)
        }
    }

    const changeImage = e => {
        if (e.target.files && e.target.files[0]){
            let imageFil = e.target.files[0];
            const reader = new FileReader();
            reader.onload = x => {
                setImagensrc(x.target.result)
                // console.log(x.target.result)
                setImagenfile(imageFil)
            }
            reader.readAsDataURL(imageFil)
        }else{
            setImagensrc(imagenDefault)
            setImagenfile(null)
        }
    }

    const clickInputFile = () => {
        hiddenFileInput.current.click();
    }

    return(
    <>
        <Header></Header>
        <Container className="mt-5" fluid>
            <div className="content-wrapper">
                <div className="container-form-company">
                    <div className="col-md-12 grid-margin" >
                        <div className="form-group row" >
                        <div className="col-sm-3 col-form-label card"  id="cardxd"  >
                            <h1 className="texto-titulo-user-form">
                                Puedes crear usuarios y asignarlos a los diferentes departamentos
                            </h1>
                            <div className="contenedorImagenRegister">
                                <img src={imageform} className="imagenRegisterUser" alt=""/>
                            </div>
                        </div>
                        <div className="card col-sm-9">
                            <div className="card-body">
                                <form className="forms-sample" onSubmit={handleSubmit}>
                                    <div className="image-company-form">
                                        <img src={userImage} className="newimagenRegisterComponent" alt=""/>
                                        <button className="buttonnewimage" type="button" onClick={clickInputFile}><img src="https://i.pinimg.com/originals/91/04/ab/9104ab6b89dd59d25881d8a74b1cb848.png" style={{width:'100%' , height:'auto'}}></img></button>
                                        <input type="file" name="img[]"  ref={hiddenFileInput} accept="image/*" className="file-upload-default" 
                                                onChange={changeImage} style={{display:"none"}} />
                                    </div>
                                    <div className="form-group row">
                                    <label htmlFor="InputNit" className="col-sm-3 col-form-label">Nombres Completos</label>
                                        <div className="col-sm-9">
                                        <input type="text" className="form-control" id="InputNombre" 
                                            placeholder="Nombres del usuario" onChange={e => setuserName(e.target.value)}/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="InputRazonSocial" className="col-sm-3 col-form-label">Apellidos Completos</label>
                                        <div className="col-sm-9">
                                            <input type="text" className="form-control" id="InputApellido" 
                                                placeholder="Apellidos del usuario" onChange={e => setuserLastname(e.target.value)}/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="InputDireccion" className="col-sm-3 col-form-label">Correo</label>
                                        <div className="col-sm-9">
                                            <input type="email" className="form-control" id="InputMail" 
                                                placeholder="Correo del Usuario" onChange={e => setuserMail(e.target.value)}/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="InputPropietario" className="col-sm-3 col-form-label">Contraseña</label>
                                        <div className="col-sm-9">
                                            <input type="password" className="form-control" id="InputPassword" 
                                                placeholder="Constraseña del usuario" onChange={e => setuserPassword(e.target.value)}/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="InputEmail" className="col-sm-3 col-form-label">Telefono</label>
                                        <div className="col-sm-9">
                                            <input type="text" className="form-control" id="InputTelefono" 
                                                placeholder="Telefono del usuario" onChange={e => setuserPhone(e.target.value)}/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="InputCiudad" className="col-sm-3 col-form-label">Celular</label>
                                        <div className="col-sm-9">
                                            <input type="text" className="form-control" id="InputCelular" 
                                                placeholder="Celular del usuario" onChange={e => setuserCellPhone(e.target.value)}/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="FormControlSelect" className="col-sm-3 col-form-label">Departmento de Trabajo</label>
                                        <div className="col-sm-9">
                                            <select className="form-control" id="FormControlSelectDepartment" onChange={changeDeparmet}>
                                                <option>Selecciona un departamento</option>
                                                {departments.map((department) =>
                                                    <option key={department.departmentId} value={department.departmentId}> {department.departmentName} </option>
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                    <br></br>
                                    <button type="submit" className="btn btn-primary mr-2">Crear</button>
                                    <Link to={"RegistroUsuario"} className="btn btn-dark" type="button">Cancelar</Link>
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

export default RegisterUserComponent;