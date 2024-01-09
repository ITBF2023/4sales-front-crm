const { createProxyMiddleware } = require('http-proxy-middleware');
const { env } = require('process');

const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
  env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'http://localhost:57922';

const context =  [
    "/weatherforecast",
    "/api/administrator",
    "/api/bitacora",
    "/api/carpetas",
    "/api/codigoQR",
    "/api/company",
    "/api/department",
    "/api/documentosBitacora", 
    "/api/documentos", 
    "/api/login",
    "/api/redesSociales",
    "/api/serviciosGoogle",
    "/api/serviciosItbf",
    "/api/sucursal",
    "/api/tarjetaPresentacion",
    "/api/tiposBitacora",
    "/api/users",
    "/api/usuariosExternos",
    "/api/gestionCasos",
    "/api/observacionesGestionCaso",
    "/api/documentosGestionCaso",
    "/api/gestionDeOportunidades",
    "/api/bitacorasOportunidad",
    "/api/metaComercial",
    "/api/graficos",
    "/api/eventosCalendario",
    "/api/chatInterno",
    "/api/notificaciones",
    "/api/tareas",
    "/api/desarrolloTarea",
    "/offers"
];
 
module.exports = function(app) {
  const appProxy = createProxyMiddleware(context, {
    target: target,
    secure: false,
    ws: true,
  });

  app.use(appProxy);
};
