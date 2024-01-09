import React, { useState } from "react";
import PropTypes from 'prop-types';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';


import '../../../assets/css/ViewStyles/registerCompany.css';

const AlertComponent = ({openmodal, mensaje, error, setAlert}) => {

    const [modalAlert , setmodalAlert] = useState(openmodal)
    var imagenchek = '';

    if (error){
        imagenchek = require('../../../assets/images/alertComponent/error.gif');
    }else{
        imagenchek = require('../../../assets/images/alertComponent/okey2.gif');
    }

    const abrirModalAlert = () =>{
        setmodalAlert(!modalAlert)
        setAlert(true)
    }

    const modalStyles={
    position: "absolute",
    top: '50%',
    left: '50%',
    width: '50%',
    transform: 'translate(-50%, -80%)',
    color: 'black',
    borderRadius:'20px'
    }

    return(

    <div className="container-scroller">
        <Modal isOpen={modalAlert}  style={modalStyles}>
            <div style={{backgroundColor: 'rgba(247, 246, 246, 0.89)'}}>
            <ModalHeader>
                Mensaje de Respuesta
            </ModalHeader>
            <ModalBody>
                <div style={{display:"flex"}}>
                <div style={{width:"100%"}}>
                    <div className="centrarimagenalert">
                        <div className="centrarimagenalertmensaje">
                            <h1 className="texto-body-alert">{mensaje}</h1>
                        </div>
                    </div>
                    
                </div>
                  <div style={{width:"50%"}}>
                    <div className="centrarimagenalert">
                        <img src={imagenchek} width={"100%"} alt="imagen estado"/>
                    </div>
                  </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={abrirModalAlert}>Cerrar</Button>
            </ModalFooter>
            </div>
            
        </Modal>
    </div>
        
    )
}

AlertComponent.propTypes = {
    setAlert: PropTypes.func.isRequired
}

export default AlertComponent;