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
        this.status=500;
        this.name='backupsdatos'
    }
}

class ErrorBackup extends Error {
    constructor(message){ // el mensaje es opcional...se incluye o no al hacer new...
        super(message);
        this.message = message || 'Error al hacer backup de datos antes de borrado por inicialiación';
        this.status=400;
        this.name='parametrosEntrada'
    }
}
 class ErrorInicializacion extends Error {
        constructor(message){ // el mensaje es opcional...se incluye o no al hacer new...
            super(message);
            this.message = message || 'Error al hacer inicializar datos de materias, instrumentos y niveles';
            this.status=400;
            this.name='inicializacionIyM'
        }    
}

class ErrorInstMaterias extends Error {
    constructor(message){ // el mensaje es opcional...se incluye o no al hacer new...
        super(message);
        this.message = message || 'Error al grabar la lista de instrumentos y materias del alumno';
        this.status=400;
        this.name='instrumentosymaterias'
    }    
}

module.exports = {
    ErrorDeBaseDeDatos,
    ParametrosEntradaIncompletos,
    ErrorBackup,
    ErrorInicializacion,
    ErrorInstMaterias
}