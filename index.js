const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('passport');
const path = require('path'); // para producción
const logger = require ('./utils/logger');
const config = require('./config');
const usuariosRouter = require('./api/recursos/usuarios/usuarios.routes');
const cursosRouter = require('./api/recursos/cursos/cursos.routes');
const alumnosRouter = require('./api/recursos/alumnos/alumnos.routes');
const tablasgeneralesRouter = require('./api/recursos/tablasgenerales/tablasgenerales.routes');
const errorHandler = require('./api/libs/errorHandler')
const authJWT = require('./api/libs/auth');

passport.use(authJWT);


const app = express();

app.use(morgan('short',{
    stream: {write: message => logger.info(message.trim())}
}))

// comentar en producción
app.get('/',(req,res)=>{
    res.send('inicialización de la api emc')
})
// fin comentar en producción

app.use(bodyParser.json());
app.use('/api/usuarios', usuariosRouter);
app.use('/api/cursos', cursosRouter);
app.use('/api/alumnos', alumnosRouter);
app.use('/api/tablasgenerales',tablasgeneralesRouter);

// descomentar en produccion
/*app.use(express.static(path.join(__dirname, 'build')));


app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
*/
//fin descomentar en produccion

//******************midlewares de errores COMIENZO ****************/
app.use(errorHandler.procesarErroresDeDB);

// al haber procesado el middleware anterior luego se va a pasar el control a alguno de los siguientes
// middlewares de errores (también tienen 4 argumentos) según el ambiente
// estos no llaman a next(err) porque están diseñados para parar el flujo y devolver el error al cliente
if (config.ambiente === 'prod'){
    app.use(errorHandler.erroresEnProduccion) // final de la cadena de ejecuciòn
}else{
    app.use(errorHandler.erroresEnDesarrollo) // final de la cadena de ejecuciòn
}

//******************midlewares de errores FIN ****************/

app.use(passport.initialize());

app.get('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    logger.info(req.user)
    res.send('api comienzo')
})

app.listen(config.puerto,()=>{
    console.log(`escuchando en el puerto ${config.puerto}`)
})