
const { sql,poolPromise } = require('./../../../database/db')
const {ErrorDeBaseDeDatos} = require('./usuarios.errors');
const procesarErrores = require('./../../libs/errorHandler').procesarErrores;
const utilFechas = require('../../../utils/fechas')

const log = require('../../../utils/logger');
const dbconfig = require('./../../../config').dbconfig;

async function validarLogin(username , password){

    try{

        const pool = await poolPromise

        return pool.request() 
        .input('Usuario', sql.VarChar, username)
        .input('Contrasena', sql.VarChar, password)
        .execute('spLogin_new')
    }catch (err) {
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }

}

async  function obtenerUsuarios(esprofesor){

    let todos;

    if (esprofesor) { // si profesor viene con 1 (profesor) o 0 (administrativo)
        todos = false;
    }else{ // si viene con null.
        todos = true;
    }
   
    try{
        const pool = await poolPromise
        
        return pool.request() 
        .input('EsProfesor', sql.Bit, true)
        .input('todos', sql.Bit, true)
        .execute('spListarProfesores_new')
    }catch{
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async function obtenerUsuario(id){

    try {
        const pool = await poolPromise

        return pool.request() 
        .input('NroProfesor', sql.Int, id)
        .execute('spCargarProfesor_new')

    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async function grabarUsuario({usuario:usuario,id:id}){ // recibo los parámetros como un objeto, es otra forma de pasar parametros cuando uno o mas son opcionales. Aqui se aplica porque grabarUsuario puede recibir o no el id segúns sea una modificación o un alta 

    const {dia,mes,anio} = usuario.fechaNacimiento;

    const fecha_nacimiento = utilFechas.transformarDiaMesAnioAfechaSQL(dia,mes,anio)
    console.log('xxxxxxxxx',usuario.fechaNacimiento)

    console.log('????????????????????',fecha_nacimiento)
    try {
        const pool = await poolPromise

        const idUsuario = id ? id : -1;

        console.log('el usuario es ', usuario)
        return pool.request() 
        .input('NroProfesor', sql.Int, idUsuario)
        .input('Apellido', sql.NVarChar, usuario.apellido)
        .input('Nombre', sql.NVarChar, usuario.nombre)
        .input('Direccion', sql.NVarChar, usuario.direccion)
        .input('FechaNacimiento', sql.NVarChar, fecha_nacimiento)
        .input('Email', sql.NVarChar, usuario.email)
        .input('Telefono', sql.NVarChar, usuario.telefono)
        .input('Documento', sql.NVarChar, usuario.documento)
        .input('Pais', sql.NVarChar, usuario.pais)
        .input('Provincia', sql.NVarChar, usuario.provincia)
        .input('Localidad', sql.NVarChar, usuario.localidad)
        .input('CodigoPostal', sql.NVarChar, usuario.codigoPostal)
        .input('NroTipoUsuario', sql.Int, usuario.tipoUsuarioId)
        .input('NombreUsuario', sql.NVarChar, usuario.nombreUsuario)
        .input('ContraseñaPredet', sql.NVarChar, 0) // cero significa no actualizar contraseña si envío 1 va a modificar la contraseña con la predeterminada 123456
        .input('NroPermiso', sql.Int, usuario.permisoId)
        .input('activo', sql.Int, usuario.activo)

        .execute('spGrabarProfesor_new')

    }catch(err){
        log.error('se produjo un error '+ err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerHistorialProfesor(id){
    try{
        const pool = await poolPromise
        
        return pool.request() 
        .input('NroProfesor', sql.Int, id)
        .execute('spListarHistorialProfesor_new')
    }catch{
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

module.exports={
    validarLogin,
    obtenerUsuario,
    obtenerUsuarios,
    grabarUsuario,
    obtenerHistorialProfesor
}