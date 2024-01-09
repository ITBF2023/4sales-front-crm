import React, { useState } from 'react';
// reactstrap components
import { Button, Container, Row } from "reactstrap";


import Header from "../../../components/Headers/Header.js";

const EscogerCompañiaComponent = (props) => {

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt-5" fluid>
        <div >
          <div className="col-md-6" style={{display:'block', margin:'auto'}}>
            <div className="form-group row" >
              <div className="card col-sm-12">
                <form className="forms-sample">
                  <div className="form-group row">
                    <div className="col-sm-9" style={{display:"block", margin:"auto"}}>
                      <br></br>
                      <h1>Selecciona la Compañia</h1>
                      <br></br>
                      <span>Debes seleccionar la compañia con la que deseas trabajar</span>
                      <br></br>
                      <br></br>
                      <select className="form-control" id="FormControlSelectDepartment" >
                        <option value={undefined}>Selecciona la empresa con la que trabajaras</option>
                        <option value={"A"}> ITBF </option>
                        <option value={"M"}> Fixu </option>
                        <option value={"T"}> CRM </option>
                      </select>
                      <br></br>
                      <br></br>
                      <div style={{textAlign:"center"}}>
                      <Button className='btn' id='botonComercioUsers'>Seleccionar Compañia</Button>
                      <br></br>
                      <br></br>
                      </div>
                    </div>
                  </div>
                  </form>
              </div>
            </div>
          </div>
        </div>
        
        
      </Container>
    </>
  );
};

export default EscogerCompañiaComponent;
