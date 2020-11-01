class ErrorDeBaseDeDatos extends Error {
    constructor(message){ // el mensaje es opcional...se incluye o no al hacer new...
        super(message);
        this.message = message || 'Error en la base de datos';
        this.status=500;
        this.name='basededatos'
    }
}

class ParametrosEntradaIncompletos extends Error {
    constructor(message){ // el mensaje es opcional...se incluye o no al hacer new...
        super(message);
        this.message = message || 'Los parámetros de la petición son insuficientes';
        this.status=400;
        this.name='parametrosEntrada'
    }
}

class DatosRepetidos extends Error {
    constructor(message){ // el mensaje es opcional...se incluye o no al hacer new...
        super(message);
        this.message = message || 'Existen datos que se repiten';
        this.status=400;
        this.name='datosrepetidos'
    }
}

module.exports = {
    ErrorDeBaseDeDatos,
    ParametrosEntradaIncompletos,
    DatosRepetidos
}