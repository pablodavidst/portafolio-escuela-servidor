const log = require('./../../utils/logger');
const bcrypt = require('bcrypt');
const passportJWT = require('passport-jwt');
const config = require('./../../config'); // importa por default un archivo index si se require una carpeta
const usuarioController = require('../recursos/usuarios/usuarios.controller');

let jwtOptions = {
    secretOrKey : config.jwt.secreto,
    jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()
}

module.exports = new passportJWT.Strategy(jwtOptions,(jwtPyload,next)=>{

    usuarioController.obtenerUsuario(jwtPyload.id)
    .then(usuario=>{
        console.log(usuario)
        if(usuario.recordset.length===0){
            log.info(`JWT token no es válido. Usuario con id ${jwtPyload.id} no existe`)
            next(null,false)
            return
        }

        log.info(`JWT token es vàlido. Usuario con id ${jwtPyload.id} autenticado`)

      /*  next(null,{
            username:usuario.recordset[0].usuario,
            id:usuario.id,
            user:{id_prof:usuario.recordset[0].id_prof, 
                    nya: `${usuario.recordset[0].nombre} ${usuario.recordset[0].apellido}`, 
                    nombre: `${usuario.recordset[0].nombre}`, 
                    id_permiso:usuario.recordset[0].id_permiso} 
        })*/
        next(null,{usuario:{
                    id_prof:usuario.recordset[0].id_prof,
                    nombre: `${usuario.recordset[0].nombre} ${usuario.recordset[0].apellido}`,
                    id_permiso:usuario.recordset[0].id_permiso
                        }
                  })
    })
    .catch(err=>{
        log.error("Error al tratar de validar el token", err,jwtPyload.id)
        next(err)
    })

})
