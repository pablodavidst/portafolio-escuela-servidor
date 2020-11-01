const ambiente = process.env.NODE_ENV || 'development'

const configuracionBase = {   // esta configuración base será modificada eventualmente
    jwt:{},                   // por valores que están seteados en los archivos dev,prod, test.etc
    puerto:3002,                // LUEGO DEL SWITCH SE VAN A SOBREESCRIBIR LOS VALORES
    suprimirLogs:false,        // según el ambiente
    dbconfig:{}
}

let configuracionDeAmbiente = {}

// configuracionDeAmbiente va a tomar el objeto jwt del archivo dev.js o prod.js los cuales
// tienen valores propios de cada ambiente para el secreto y para el tiempo de expiracion
// no hay que usar el secreto de produccion en los tests de desarrollo
switch (ambiente){
    case 'desarrollo':
    case 'dev':
    case 'development':
        configuracionDeAmbiente = require('./dev')
        break;
    case 'producción':
    case 'prod':
        configuracionDeAmbiente = require('./prod');
        break;
    case 'test':
        configuracionDeAmbiente = require('./test');
        break;
    default:
        configuracionDeAmbiente = require('./dev')
}


// esta técnica la usamos para modificar la propiedad jwt del objeto configuracionBase 
// configuracionBase originalmente tiene la propiedad jwt como un obj vacio {}
// como exportamos un objeto con un spread de 2 objetos configuracionBase y configuracionDeAmbiente
// como ambos tienen la misma propiedad jwt se va a tomar la del segundo y se va a pisar
// con lo que venga del archivo dev.js o prod.js según el resultado del swicht
// es una forma de hacer un merge de 2 objetos cuyas propiedades comunes se modifican dinamicamente
// tomando el valor del ultimo objeto es decir en este caso de configuracionDeAmbiente
module.exports = {              
    ...configuracionBase,
    ...configuracionDeAmbiente
} // devolvemos un objeto que tiene la integración de 2 objetos.
  // el primer objeto es la configuracion base y el 2do es un objeto que eventualmente
  // va a pisar o actualizar algún valor de la confiración base