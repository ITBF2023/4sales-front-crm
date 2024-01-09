import React, { useState , useLayoutEffect} from "react";

import { getAllDepartement, getUserById, updateUser } from '../../../Controller/Controller';

import { Link, useHistory, useParams } from "react-router-dom";

import AlertComponent from "../../Usuarios/AlertComponent/AlertComponent";

import '../../../assets/css/ViewStyles/registerUser.css';
import Header from "../../../components/Headers/Header";
import { Container } from "reactstrap";

const FormularioActualizacionUsuarioComponent = ( {isAdmin} ) => {

    const getDepartments = async () => {
        const getdepart = await getAllDepartement();
        // console.log(getdepart)
        if(!getDepartments){
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
            GetDatosUsuario();
        }
        
      }, []);  

    let path = useParams();
    
    
    const [alert , setAlert] = useState(true)
    const [mensa , setMensaje] = useState("")
    const [erro , setError] = useState(true)

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

    const history = useHistory()
    const hiddenFileInput = React.useRef(null);

    const GetDatosUsuario = async() => {
        const us = await getUserById(path.id)
        if(!us){
        }else{
            setuserName(us.userName)
            setuserLastname(us.userLastname)
            setuserMail(us.userMail)
            setuserPassword(us.userPassword)
            setuserPhone(us.userPhone)
            setuserCellPhone(us.userCellPhone)
            setImagensrc(us.userImage)
            setuserWorkstation(us.userWorkstation)
            setuserActive(us.userActive)
            setdepartmentId(us.departmentId)
        }
    }

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
        formData.append('userImage', userImage)
        formData.append('ImageFile', ImageFile)
        
        const register = await updateUser(formData, path.id)
        if(register === "OK"){
            setError(false)
            setMensaje("Usuario actualizado exitosamente")
            setAlert(false)
            setTimeout(() => {
                history.push("users");
            }, 2000);
        }else if (register === "ERROR") {
            setError(true)
            setMensaje("Ocurrio un problema inesperado")
            setAlert(false)
        }else{
            if(register === "" || !register){
                setMensaje("Ocurrio un problema inesperado")
            }else{
                setMensaje(register)
            }
            setError(true)
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
                                Puedes editar el usuario y tambien cambiarlo a otro departamento
                            </h1>
                            <div className="contenedorImagenRegister">
                                <img src={imageform} className="imagenRegisterUser" alt=""/>
                            </div>
                        </div>
                        <div className="card col-sm-9">
                            <div className="card-body">
                                <form className="forms-sample" onSubmit={handleSubmit}>
                                    <div className="image-company-form">
                                        <img src={"Images/Users/"+userImage} className="newimagenRegisterComponent" alt=""/>
                                        <button className="buttonnewimage" type="button" onClick={clickInputFile}><img src="https://i.pinimg.com/originals/91/04/ab/9104ab6b89dd59d25881d8a74b1cb848.png" style={{width:'100%' , height:'auto'}}></img></button>
                                        <input type="file" name="img[]" ref={hiddenFileInput} accept="image/*" className="file-upload-default"
                                                onChange={changeImage} />
                                    </div>
                                    <div className="form-group row">
                                    <label htmlFor="InputNit" className="col-sm-3 col-form-label">Nombres Completos</label>
                                        <div className="col-sm-9">
                                        <input type="text" className="form-control" id="InputNombre" 
                                            placeholder="Nombres del usuario" value={userName} onChange={e => setuserName(e.target.value)}/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="InputRazonSocial" className="col-sm-3 col-form-label">Apellidos Completos</label>
                                        <div className="col-sm-9">
                                            <input type="text" className="form-control" id="InputApellido" 
                                                placeholder="Apellidos del usuario" value={userLastname} onChange={e => setuserLastname(e.target.value)}/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="InputDireccion" className="col-sm-3 col-form-label">Correo</label>
                                        <div className="col-sm-9">
                                            <input type="email" className="form-control" id="InputMail" 
                                                placeholder="Correo del Usuario" value={userMail} onChange={e => setuserMail(e.target.value)}/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="InputEmail" className="col-sm-3 col-form-label">Telefono</label>
                                        <div className="col-sm-9">
                                            <input type="text" className="form-control" id="InputTelefono" 
                                                placeholder="Telefono del usuario" value={userPhone} onChange={e => setuserPhone(e.target.value)}/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="InputCiudad" className="col-sm-3 col-form-label">Celular</label>
                                        <div className="col-sm-9">
                                            <input type="text" className="form-control" id="InputCelular" 
                                                placeholder="Celular del usuario" value={userCellPhone} onChange={e => setuserCellPhone(e.target.value)}/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="FormControlSelect" className="col-sm-3 col-form-label">Departmento de Trabajo</label>
                                        <div className="col-sm-9">
                                            <select className="form-control" id="FormControlSelectDepartment" value={departmentId} onChange={changeDeparmet}>
                                                <option>Selecciona un departamento</option>
                                                {departments.map((department) =>
                                                    <option key={department.departmentId} value={department.departmentId}> {department.departmentName} </option>
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                    <br></br>
                                    <button type="submit" className="btn btn-primary mr-2">Actualizar</button>
                                    <Link type="button" className="btn btn-dark" to="users">Cancelar</Link>
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

export default FormularioActualizacionUsuarioComponent;