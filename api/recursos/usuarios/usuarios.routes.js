const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const jwtAuthenticate = passport.authenticate('jwt',{session:false});
const procesarErrores = require('./../../libs/errorHandler').procesarErrores;
const log = require('../../../utils/logger');
const validarPedidoLogin = require('../usuarios/usuarios.validate').validarPedidoLogin;
const validarUsuario = require('../usuarios/usuarios.validate').validarUsuario;
const usuariosController = require('../usuarios/usuarios.controller');
const {CredencialesIncorrectas,ErrorDeBaseDeDatos} = require('./usuarios.errors');
const {UsuarioNoExiste} = require('./usuarios.errors');
const config = require('./../../../config')
const usuarioRouter = express.Router();

function pasarBodyAminusculas(req,res,next){
    req.body.username && req.body.username.toLowerCase();
    req.body.password && req.body.password.toLowerCase();
    next()
}

function transformarFecha(req,res,next){
    
    const {dia, mes, anio} = req.body.fechaNacimiento;
    
    //transforma el objeto fechaNacimiento en una fecha con formato dd/mm/aaaa
    const fecha = `${dia}/${mes}/${anio}`
    
    
    req.body = {...req.body, fechaNacimiento:fecha}

    log.info(req.body.fechaNacimiento)
    next()
}


function ponerFecha(req,res,next){
    const datos = req.body;
    const fecha = new Date(datos.fechaNacimiento);
    log.info(fecha)
    req.body = {...datos,fechaNacimiento:fecha}
    next()
}

usuarioRouter.get('/profesores',procesarErrores((req,res)=>{
    return usuariosController.obtenerUsuarios(1)
    .then(usuarios=>{
        res.status(200).json(usuarios.recordset)
    })
}))

usuarioRouter.get('/profesores/historial/:id',procesarErrores((req,res)=>{
    const id = req.params.id;

    return usuariosController.obtenerHistorialProfesor(id)
    .then(historial=>{
        res.status(200).json(historial.recordset)
    })
}))

usuarioRouter.get('/administrativos',procesarErrores((req,res)=>{
    return usuariosController.obtenerUsuarios(0)
    .then(usuarios=>{
        res.status(200).json(usuarios.recordset)
    })
}))

usuarioRouter.get('/all',procesarErrores((req,res)=>{
    return usuariosController.obtenerUsuarios(null)
    .then(usuarios=>{
        res.status(200).json(usuarios.recordset)
    })
}))

usuarioRouter.get( // esta ruta la uso para poder reconectar al usuario si hay un token
    '/whoami',      // en su localStorage. Entra aquí, lo captura el middleware de autenticación
    [jwtAuthenticate],    // si el token es válido le añade al request el usuario que encontró
    procesarErrores(async (req, res) => {
      res.json(req.user);
    })
  );

usuarioRouter.post('/',[jwtAuthenticate,validarUsuario],procesarErrores((req,res)=>{

    const usuario = req.body;
    return usuariosController.grabarUsuario({usuario:usuario}) // paso los parámetros como un objeto, es otra forma de pasar parametros cuando uno o mas son opcionales. Aqui se aplica porque grabarUsuario puede recibir o no el id segúns sea una modificación o un alta 
    .then((resultado)=>{
        log.info(`Se crea al usuario ${usuario.usuario} ${usuario.nombre} ${usuario.apellido}`);
        res.status(200).json(resultado.recordset[0])
        }
    )
    res.status(200).json(usuario)
}))

usuarioRouter.put('/:id',[jwtAuthenticate,validarUsuario],procesarErrores(async (req,res)=>{
    const usuario = req.body;

    const idUsuarioRecibido = req.params.id;
    
    const usuarioRegistrado = await usuariosController.obtenerUsuario(idUsuarioRecibido);


    if (usuarioRegistrado.recordset.length===0){
        throw new UsuarioNoExiste()
    }
    return usuariosController.grabarUsuario({usuario:usuario,id:idUsuarioRecibido}) // paso los parámetros como un objeto, es otra forma de pasar parametros cuando uno o mas son opcionales. Aqui se aplica porque grabarUsuario puede recibir o no el id segúns sea una modificación o un alta 
    .then((resultado)=>{
        log.info(`Se modifica al usuario ${usuario.usuario} ${usuario.nombre} ${usuario.apellido}`);
        res.status(200).json(resultado.recordset[0])
        }
    )
}))

usuarioRouter.get('/:id',jwtAuthenticate,(req,res)=>{

    return usuariosController.obtenerUsuario(req.params.id)
    .then(usuarios=>{
        res.status(200).json(usuarios.recordset)
    })
})

usuarioRouter.post('/login',[validarPedidoLogin,pasarBodyAminusculas],procesarErrores((req,res)=>{

    let {username,password} = req.body;

   return usuariosController.validarLogin(username,password)
    .then(
        usuario=>{

            const usuarioNoRegistrado = usuario.recordset;

            log.info(`el usuario trata de loguearse ${username}`)

            if (usuarioNoRegistrado.length===0){
                throw new CredencialesIncorrectas();
            }

            //  si es un usuario valido creamos un token.
            // Dentro de la info del token guardamos su id para que podamos validar ese dato
            // en los requests que recibamos contra la api

            let token = jwt.sign({id: usuarioNoRegistrado[0].id_prof}, 
                                    config.jwt.secreto,
                                    {expiresIn:config.jwt.tiempoDeExpiracion}
                                )

            log.info(`Se loguea ${usuarioNoRegistrado[0].nombre}`)
            res.status(200).json({ token, usuario: usuarioNoRegistrado[0] })
        }
    )
}))


module.exports = usuarioRouter