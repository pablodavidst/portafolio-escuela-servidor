const log = require("../../utils/logger");

//esta función se usa para poder omitir todos catchs que se hacen en la ejecucion de la funcion
// fn. Al pasar la función como parametro se puede agregar 1 solo catch que en el caso de 
// que haya un error y lo capture será procesado por los midleware de errores
exports.procesarErrores = (fn)=>{

    return function(req,res,next){
        fn(req,res,next).catch(next)  // ejecutamos la funciòn asyncronica pasada por parametro
                                      // la cual devuelve una promesa. Como devuelve una promesa
                                      // podemos ponerle el catch
                                      // en la funciòn hija que es envuelta por esta nos aseguramos
                                      // que devuelva una promesa al ponerle return
                                      // si hubiese algùn error lo capturamos con catch
                                      // y le indicamos que vaya a la siguiente funciòn en la cadena
                                      // de middlewares de manejo de errores.
                                      // si no hubo errores retorna la funcion ejecutada 
                                      // normalmente
    }
}

// esta funcion es un middleware de manejo de errores
// Error handler middlewares que por default express reconoce que son de errores porque tienen
// 4 parametros siendo el primero un err.
// Y SIEMPRE SE UBICAN en el index.js y AL FINAL DESPUES DE TODOS LOS MIDDLEWARES NORMALES

exports.procesarErroresDeDB = (err,req,res,next)=>{
    
    const simulacionErrorBaseDatos= 'Algo que determine que es un error de mongo o mssql';

    // si el error es de bd adjunto algunas propiedades nuevsa a err
    // una propiedad message y un status
    if (err.name === simulacionErrorBaseDatos){
        log.error('Ocurrió un error de base de datos',err);
        err.message = 'Error ocurrido en la base de datos. Para ayuda contactar a sistemas@gmail.com';
        err.status = 500
    } // si el error no es de base de datos no hace nada de lo anterior sino que solamente
      // llama a next(err)

    next(err) // En este caso el middleware de manejo de error se usa solo para agregar info al
              // objeto error y pasar al siguiente middleware de manejo de errores
              // por eso llamamos a next(err) para que vaya al proximo middleware de errores con
              // propiedades nuevas si son errores de base de datos.
              // al pasar un argumento a next express entiende por default que se trata de un error
              // y lo pasa al siguiente middleware de errores 
}

exports.erroresEnProduccion = (err,req,res,next)=>{
    log.error(err.message)
    res.status(err.status || 500);      // si err.status existe envialo o si no 500
    res.send({
        message: err.message
    })
    // este middleware de manejo de errores no usa next porque termina el flujo de la peticion
    // enviando al cliente un status y un mensaje interrumpiendo el flujo hacia otros procesos
}

exports.erroresEnDesarrollo = (err,req,res,next)=>{
    log.error(err.message)
    res.status(err.status || 500);   // si err.status existe o si no 500
    res.send({
        message: err.message,
        stack: err.stack || ''             // si err.stack existe anvialo o si no nada
    })
    // este middleware de manejo de errores no usa next porque termina el flujo de la peticion
    // enviando al cliente un status y un mensaje interrumpiendo el flujo hacia otros procesos    
}

