
const { sql,poolPromise } = require('./../../../database/db')
const {ErrorDeBaseDeDatos} = require('./alumnos.errors');
const procesarErrores = require('./../../libs/errorHandler').procesarErrores;
const log = require('../../../utils/logger');
const dbconfig = require('./../../../config').dbconfig;
const utilFechas = require('../../../utils/fechas')

async function obtenerAlumno(id){
    try{
        const pool = await poolPromise
        
        return pool.request() 
        .input('NroAlumno', sql.Int, id)
        .execute('spCargarAlumno_new')
    }catch{
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async function inicializarInstrumentosYmateriasAlumno(id){
    try{
        const pool = await poolPromise
        
        return pool.request() 
        .input('NroAlumno', sql.Int, id)
        .execute('spInicializarAlumnosINSTRyMAT')
    }catch{
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function grabarMateriasAprobadasAlumno(id,materia){
    try{
        const pool = await poolPromise
        
        return pool.request() 
        .input('NroAlumno', sql.Int, id)
        .input('NroMateria', sql.Int, materia)
         .execute('spGrabarAlumno_MateriasAprobadasPorTest') 
    }catch{
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}


async function grabarInstrumentosAlumno(id,instrumento,niveli,nivele){
    try{
        const pool = await poolPromise
        
        return pool.request() 
        .input('NroAlumno', sql.Int, id)
        .input('NroInstrumento', sql.Int, instrumento)
        .input('NroNivelInstrumental', sql.Int, niveli)
        .input('NroNivelEnsamble', sql.Int, nivele)
        .execute('spGrabarAlumno_InstrumentoPorAlumno')
    }catch{
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async function egresarAlumno(id,id_usuario){
    try{
        const pool = await poolPromise
        
        return pool.request() 
        .input('NroAlumno', sql.Int, id)
        .input('id_prof', sql.Int, id_usuario)
        .execute('spGrabarAlumno_ComoEgresado_new')
    }catch{
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async function restaurarAlumno(id,id_usuario){
    try{
        const pool = await poolPromise
        
        return pool.request() 
        .input('NroAlumno', sql.Int, id)
        .input('id_prof', sql.Int, id_usuario)
        .execute('spEliminarAlumno_ComoEgresado_new')
    }catch{
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerMateriasAprobadasTestAlumno(id){
    try{
        const pool = await poolPromise
        
        return pool.request() 
        .input('NroAlumno', sql.Int, id)
        .execute('spCargarAlumno_MateriasAprobadasPorTest_new')
    }catch{ 
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerHistorialAlumno(id,cuatrimestreActual){
    try{
        const pool = await poolPromise
        
        return pool.request() 
        .input('NroAlumno', sql.Int, id)
        .input('Puntero', sql.Int, 1)
        .input('activo', sql.Bit, cuatrimestreActual)
        .execute('spListarHistorialAlumno_new')
    }catch{
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerCursosAnaliticoFinalAlumno(id){
    try{
        const pool = await poolPromise
        
        return pool.request() 
        .input('NroAlumno', sql.Int, id)
        .execute('spListarCursosParaAnaliticosFinales_new')
    }catch{
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerCursosAnaliticoParcialAlumno(id){
    try{
        const pool = await poolPromise
        
        return pool.request() 
        .input('NroAlumno', sql.Int, id)
        .execute('spListarCursosParaAnaliticosParciales_new')
    }catch{
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerInstrumentosAlumno(id){
    try{
        const pool = await poolPromise
        
        return pool.request() 
        .input('NroAlumno', sql.Int, id)
        .execute('spCargarAlumno_InstrumentosPorAlumno_new')
    }catch{
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerUltimasAltas(id){
    try{
        const pool = await poolPromise
        
        return pool.request() 
        .execute('spListarUltimosAlumnosCreados_new')
    }catch{
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerUltimosCambiosStatus(){
    try{
        const pool = await poolPromise
        
        return pool.request() 
        .execute('spListarUltimosCambiosStatus_new')
    }catch{
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

/*
async  function obtenerInstrumentosAlumnoBackup(id){

    console.log('?????????????????????????',id)
    try{
        const pool = await poolPromise
        
        const result = await pool.request() 
        .input('NroAlumno', sql.Int, id)
        .execute('spBackup_InstrumentosPorAlumno_new')

        console.log('&&&&&&&&&&&&&&&&&&',result.recordset)

        return(result.recordset)
    }catch{
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

*/

async  function obtenerInstrumentosAlumnoBackup(id){

    try{
        const pool = await poolPromise
        
        return pool.request() 
        .input('NroAlumno', sql.Int, id)
        .execute('spBackup_InstrumentosPorAlumno_new')

    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}


async  function obtenerAlertasAlumno(id,id_materia){
    try{
        const pool = await poolPromise
        
        return pool.request() 
        .input('NroAlumno', sql.Int, id)
        .input('NroMateria', sql.Int, id_materia)
        .execute('spCargarAlertasyCorrelatividad_new')
    }catch{
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async function grabarAlumno({alumno:alumno,id:id}){

    try {
        const pool = await poolPromise

        const idAlumno = id ? id : null;
        const {dia,mes,anio} = alumno;

        const fecha_nacimiento = utilFechas.transformarDiaMesAnioAfechaSQL(dia,mes,anio)

        return pool.request() 
        .input('ID', sql.Int, idAlumno)
        .input('Apellido', sql.VarChar, alumno.apellido)
        .input('Nombre', sql.VarChar, alumno.nombre)
        .input('Direccion', sql.VarChar, alumno.domicilio)
        .input('Direccion_2', sql.VarChar, alumno.domicilio2)
        .input('NroPais', sql.Int, alumno.pais)
        .input('NroProvincia', sql.Int, alumno.provincia)
        .input('FechaNac', sql.VarChar, fecha_nacimiento)
        .input('Email', sql.VarChar, alumno.email)
        .input('Doc', sql.VarChar, alumno.documento)
        .input('Pais', sql.VarChar, '')
        .input('Provincia', sql.VarChar, '')
        .input('Localidad', sql.VarChar, alumno.localidad)
        .input('Nacionalidad', sql.VarChar, alumno.nacionalidad)
        .input('CodPostal', sql.VarChar, alumno.codpostal)
        .input('Sexo', sql.VarChar, alumno.sexo)
        .input('ObsFinanzas', sql.VarChar, alumno.obs_finanzas)
        .input('TelefonoAlternativo', sql.VarChar, alumno.telef_alternativo)
        .input('TelefonoLaboral', sql.VarChar, alumno.telef_laboral)
        .input('Celular', sql.VarChar, alumno.celular)
        .input('Telefono', sql.VarChar, alumno.telefono)
        .input('EmailSecundario', sql.VarChar, alumno.email_secundario)
        .input('PassGenerado', sql.VarChar, '123456')
        .execute('spGrabarAlumno_new')

    }catch(err){
        log.error('se produjo un error '+ err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerAlumnos(activos){
    try{
        const pool = await poolPromise
        
        return pool.request() 
        .input('ID', sql.Int, 0)
        .input('Apellidos', sql.VarChar, '')
        .input('Nombres', sql.VarChar, '')
        .input('Activos', sql.Bit, activos)
        .input('Egresado', sql.Bit, false)
        .execute('spListarAlumnos_new')
    }catch{
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerAlumnosInactivos(){
    try{
        const pool = await poolPromise
        
        return pool.request() 
        .execute('spListarAlumnosInactivos_new')
    }catch{
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerAlumnosEgresados(){
    try{
        const pool = await poolPromise
        
        return pool.request() 
        .execute('spListarAlumnosEgresados_new')
    }catch{
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}


async  function obtenerListaAlumnosPlus(incluirCursadas){
    try{
        const pool = await poolPromise
        
        console.log('0000000000000',typeof(incluirCursadas))
        return pool.request() 
        .input('IncluirCursadas', sql.Bit,Number(1))
        .execute('spListarAlumnosActivosPlus_new')
    }catch{
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerHistorialMateria(id_alumno, id_materia){
    try{
        const pool = await poolPromise
        
        return pool.request() 
        .input('NroMateria', sql.Int, id_materia)
        .input('NroAlumno', sql.Int, id_alumno)
        .execute('spListarHistorialMateria_new')
    }catch{
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}



async  function obtenerStatusAlumno(id){
    try{
        const pool = await poolPromise
        
        return pool.request() 
        .input('NroAlumno', sql.Int, id)
        .execute('spCargarStatusAlumno_new')
    }catch{
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

module.exports={
    obtenerAlumnos,
    obtenerAlumno,
    obtenerHistorialAlumno,
    obtenerInstrumentosAlumno,
    obtenerAlertasAlumno,
    obtenerMateriasAprobadasTestAlumno,
    obtenerCursosAnaliticoFinalAlumno,
    obtenerCursosAnaliticoParcialAlumno,
    grabarAlumno,
    inicializarInstrumentosYmateriasAlumno,
    grabarMateriasAprobadasAlumno,
    grabarInstrumentosAlumno,
    obtenerInstrumentosAlumnoBackup,
    obtenerUltimasAltas,
    obtenerAlumnosInactivos,
    obtenerListaAlumnosPlus,
    restaurarAlumno,
    egresarAlumno,
    obtenerUltimosCambiosStatus,
    obtenerStatusAlumno,
    obtenerAlumnosEgresados,
    obtenerHistorialMateria
}