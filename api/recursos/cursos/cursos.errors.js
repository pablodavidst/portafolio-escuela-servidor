class ErrorDeBaseDeDatos extends Error {
    constructor(message){ // el mensaje es opcional...se incluye o no al hacer new...
        super(message);
        this.message = message || 'Error en la base de datos';
        this.status=500;
        this.name='basededatos'
    }
}

class ErrorYaInscripto extends Error {
    constructor(message){ // el mensaje es opcional...se incluye o no al hacer new...
        super(message);
        this.message = message || 'El alumno ya se encuentra inscripto en el curso';
        this.status=500;
        this.name='yainscripto'
    }
}

class ErrorInscripcionNoViable extends Error {
    constructor(message){ // el mensaje es opcional...se incluye o no al hacer new...
        super(message);
        this.message = message || 'No es posible inscribir al alumno por cupo o por superposición de horarios';
        this.status=401;
        this.name='inscripcionNoViable'
    }
}

class ErrorEncabezado extends Error {
    constructor(message){ // el mensaje es opcional...se incluye o no al hacer new...
        super(message);
        this.message = message || 'Error al buscar los encabezados';
        this.status=401;
        this.name='busquedaEncabezado'
    }
}

class EncabezadoVacio extends Error {
    constructor(message){ // el mensaje es opcional...se incluye o no al hacer new...
        super(message);
        this.message = message || 'El encabezado no se pudo obtener';
        this.status=401;
        this.name='encabezadoVacio'
    }
}

class ErrorCalificaciones extends Error {
    constructor(message){ // el mensaje es opcional...se incluye o no al hacer new...
        super(message);
        this.message = message || 'Error al buscar las calificaciones';
        this.status=401;
        this.name='errorCalificaciones'
    }
}

module.exports = {
    ErrorDeBaseDeDatos,ErrorYaInscripto,ErrorInscripcionNoViable,ErrorEncabezado,EncabezadoVacio,ErrorCalificaciones
}