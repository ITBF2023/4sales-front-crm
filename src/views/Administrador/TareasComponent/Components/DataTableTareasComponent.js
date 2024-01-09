import React,{ useLayoutEffect } from "react";
import { useState } from "react";

import DataTable from 'react-data-table-component';
import CabeceraTablaTareas from "./CabeceraTablaTareas";

const DataTableTareasComponent = ({usuarioActivos, columns, paginationOptions, customStyles, data, setData, respaldoTareas}) => {

  return (
    <div className="contenedor-tabla-tareas container-scroll-tabla-tareas">
      <DataTable className="tabla-modulo-tareas container-scroll-tabla-tareas" 
        title={<CabeceraTablaTareas setData={setData} respaldoTareas={respaldoTareas} usuarioActivos={usuarioActivos} ></CabeceraTablaTareas>}
        columns={columns}
        data={data}
        pagination 
        paginationComponentOptions={paginationOptions}
        customStyles={customStyles}
      />
    </div>   
  )
}



export default DataTableTareasComponent;