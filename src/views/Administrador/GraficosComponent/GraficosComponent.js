import React, { useLayoutEffect, useState} from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Pie, Doughnut, Scatter } from 'react-chartjs-2';

import {getGraficosUsuarios, getGraficosEmpresa, getGraficosContactoByUser} from '../../../Controller/Controller';
import Header from "../../../components/Headers/Header";
import { Container } from "reactstrap";


const GraficosComponent = ({isAdmin}) => {

  const getgra = async () => {
    var bitacoras = []
    var empresas = []
    var nombres = []
    const graf = await getGraficosUsuarios();
    graf.map((grafico) => {
      nombres.push(grafico.nombre)
      bitacoras.push(grafico.cantidadBitacoras)
      empresas.push(grafico.cantidadEmpresas)
    })

    setBit(bitacoras)
    setEmpr(empresas)
    setNombre(nombres)
  }

  const getGraficosContacto = async () => {
    var empresas = []
    var contactos = []
    const graf = await getGraficosEmpresa();
    graf.map((grafico) => {
      contactos.push(grafico.cantidadContactos)
      empresas.push(grafico.nombreEmpresa)
    })

    setnombreEmpresas(empresas)
    setcantidadContactos(contactos)
  }

  const getGraficosContactobyU = async () => {
    var nombres = []
    var contactos = []
    const graf = await getGraficosContactoByUser();
    graf.map((grafico) => {
      contactos.push(grafico.cantidadContactos)
      nombres.push(grafico.nombre)
    })

    setnombreUsuarios(nombres)
    setcantContByUser(contactos)
  }

  const [bit , setBit] = useState([])
  const [empr , setEmpr] = useState([])
  const [nombre , setNombre] = useState([])
  const [nombreEmpresas , setnombreEmpresas] = useState([])
  const [cantidadContactos , setcantidadContactos] = useState([])
  const [nombreUsuarios , setnombreUsuarios] = useState([])
  const [cantContByUser , setcantContByUser] = useState([])

  useLayoutEffect(() => {
    if (isAdmin === false){
      window.location.href = "/403-Fordibben"
    }else{
      getgra();
      getGraficosContacto();
      getGraficosContactobyU();
    }
  }, []);

  return(
  <>
        <br></br>
        <div className="row">
          <div className="col-lg-6 grid-margin stretch-card">
            <div className="card index-card-bordes">
              <div className="card-body">
                <h4 className="card-title">Empresas Por Usuario</h4>
                {/* <Line options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    }
                  },
                }} data={{
                  labels: ['2013', '2014', '2015', '2016', '2017', '2018'],
                  datasets: [{
                    label: 'My First Dataset',
                    data: [10, 19, 3, 5, 2, 3 ],
                    backgroundColor: [
                      'rgba(255, 99, 132, 0.2)'
                    ],
                    borderColor: [
                      'rgb(255, 99, 132)'
                    ],
                    borderWidth: 1,
                    tension: 0.3
                  }]
                }}></Line> */}

                  <Bar options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top',
                      }
                    },
                    scales: [
                      // {backgroundColor: 'red'}
                    ]
                  }}
                  data= {{
                    labels: nombre,
                    datasets: [{
                        label: 'Cantidad de Empresas',
                        data: empr,
                        backgroundColor: [
                          'rgba(75, 192, 192, 0.2)',
                        ],
                        borderColor: [
                          'rgba(75, 192, 192, 0.2)',
                        ],
                        borderWidth: 1,
                        hoverBorderColor: 'green'
                    },
                  ],
                }}/> 
                
                
              </div>
            </div>
          </div>
          <div className="col-lg-6 grid-margin stretch-card">
            <div className="card index-card-bordes">
              <div className="card-body">
                <h4 className="card-title">Cantidad de Bitacoras</h4>
                  <Bar options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top',
                      }
                    },
                    scales: [
                      // {backgroundColor: 'red'}
                    ]
                  }}
                  data= {{
                    labels: nombre,
                    datasets: [{
                        label: 'Cantidad de Bitacoras',
                        data: bit,
                        backgroundColor: [
                            'rgba(54, 162, 235, 0.2)',
                        ],
                        borderColor: [
                            'rgba(54, 162, 235, 1)',
                        ],
                        borderWidth: 1,
                        hoverBorderColor: 'skyblue'
                    },
                  ],
                }}
                
                /> 
              </div>
            </div>
          </div>
        </div>
        <br></br>
        <div className="row">
          <div className="col-lg-6 grid-margin stretch-card">
            <div className="card index-card-bordes">
              <div className="card-body" >
                <h4 className="card-title">Cantidad de Contactos por Usuario</h4>
                <div style={{marginRight: "10%", marginLeft: "10%"}}>
                <Doughnut 
                  data= {{
                    labels: nombreUsuarios,
                    datasets: [{
                        label: '# of Votes',
                        data: cantContByUser,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }
                  ],
                }}
                
                width={800}
                height={800}>

                </Doughnut>
                </div>
                
              </div>
            </div>
          </div>
        </div>
  </>
  )
}

export default GraficosComponent;