
class CredencialesIncorrectas extends Error {
    constructor(message){ // el mensaje es opcional...se incluye o no al hacer new...
        super(message);
        this.message = message || 'Credenciales inválias. Usuario o password incorrectos';
        this.status=400;
        this.name='credencialesIncorrectas'
    }
}


class UsuarioNoExiste extends Error {
    constructor(message){ // el mensaje es opcional...se incluye o no al hacer new...
        super(message);
        this.message = message || 'El usuario no existe';
        this.status=404;
        this.name='usuarioInexistente'
    }
}

class ErrorDeBaseDeDatos extends Error {
    constructor(message){ // el mensaje es opcional...se incluye o no al hacer new...
        super(message);
        this.message = message || 'Error en la base de datos';
        this.status=500;
        this.name='basededatos'
    }
}

module.exports = {
    CredencialesIncorrectas,
    ErrorDeBaseDeDatos,
    UsuarioNoExiste
}
