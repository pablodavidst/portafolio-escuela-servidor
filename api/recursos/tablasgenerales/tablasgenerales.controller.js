
const { sql,poolPromise } = require('./../../../database/db')
const {ErrorDeBaseDeDatos} = require('./tablasgenerales.errors');
const procesarErrores = require('./../../libs/errorHandler').procesarErrores;
const log = require('../../../utils/logger');
const dbconfig = require('./../../../config').dbconfig;
const utilFechas = require('../../../utils/fechas')

async  function obtenerAlgo(id){
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

async function grabarUsuario({usuario:usuario,id:id}){

    try {
        const pool = await poolPromise

        const idUsuario = id ? id : -1;

        console.log('el usuario es ', usuario)
        return pool.request() 
        .input('NroProfesor', sql.Int, idUsuario)
        .input('Apellido', sql.NVarChar, usuario.apellido)
        .input('Nombre', sql.NVarChar, usuario.nombre)
        .input('Direccion', sql.NVarChar, usuario.direccion)
        .input('FechaNacimiento', sql.DateTime, usuario.fechaNacimiento)
        .input('Email', sql.NVarChar, usuario.email)
        .input('Telefono', sql.NVarChar, usuario.telefono)
        .input('Documento', sql.NVarChar, usuario.documento)
        .input('Pais', sql.NVarChar, usuario.pais)
        .input('Provincia', sql.NVarChar, usuario.provincia)
        .input('Localidad', sql.NVarChar, usuario.localidad)
        .input('CodigoPostal', sql.NVarChar, usuario.codigoPostal)
        .input('NroTipoUsuario', sql.Int, usuario.tipoUsuarioId)
        .input('NombreUsuario', sql.NVarChar, usuario.nombreUsuario)
        .input('ContraseñaPredet', sql.NVarChar, usuario.password)
        .input('NroPermiso', sql.Int, usuario.permisoId)
        .input('activo', sql.Int, usuario.activo)

        .execute('spGrabarProfesor_new')

    }catch(err){
        log.error('se produjo un error '+ err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerMaterias(){
    try{
        const pool = await poolPromise
        
        return pool.request() 
        .execute('spListarMaterias_new')
    }catch{
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}





async  function obtenerTiposUsuarios(){
    try{
        const pool = await poolPromise
        
        return pool.request() 
        .execute('spListarTiposDeUsuarios')
    }catch{
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerPermisosUsuarios(){
    try{
        const pool = await poolPromise
        
        return pool.request() 
        .execute('spListarPermisos')
    }catch{
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerTiposCursos(){
    try{
        const pool = await poolPromise
        
        return pool.request() 
        .execute('spListarTiposDeCursos')
    }catch{
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerProfesores(){
    try{
        const pool = await poolPromise
        return pool.request() 
        .input('EsProfesor', sql.Bit, true)
        .execute('spListarProfesores_new')
    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerCuatrimestres(){
    try{
         const pool = await poolPromise
        
        return pool.request() 
        .execute('spListarCuatrimestres')
    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerNivelesI(){
    try{
         const pool = await poolPromise
        
        return pool.request() 
        .execute('spListarNivelesInstrumental')
    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerNivelesE(){
    try{
         const pool = await poolPromise
        
        return pool.request() 
        .execute('spListarNivelesEnsamble')
    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerEncabezados(){
    try{
         const pool = await poolPromise
        
        return pool.request() 
        .execute('spListarEncabezados')
    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerRegimenes(){
    try{
         const pool = await poolPromise
        
        return pool.request() 
        .execute('spListarRegimenesEditCurso_new')
    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerPaises(){
    try{
         const pool = await poolPromise
        
        return pool.request() 
        .execute('spListarPaises')
    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerRegimenesPorEncabezado(id){
    try{
         const pool = await poolPromise
        
        return pool.request() 
        .input('NroEncabezado', sql.Int,id)
        .execute('spListarRegimenesSegunEncabezado_new')
    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerAulas(){
    try{
         const pool = await poolPromise
        
        return pool.request() 
        .execute('spListarAulas')
    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerDias(){
    try{
         const pool = await poolPromise
        
        return pool.request() 
        .execute('spListarDias')
    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerPaises(){
    try{
         const pool = await poolPromise
        
        return pool.request() 
        .execute('spListarPaises ')
    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerProvinciasAll(){
    try{
         const pool = await poolPromise
        
        return pool.request() 
        .input('NroPais', sql.Int,-1)
        .execute('spListarProvinciasSegunPais_new')
    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerNacionalidades(){
    try{
         const pool = await poolPromise
        
        return pool.request() 
        .execute('spListarNacionalidades_new')
    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerInstrumentos(){
    try{
         const pool = await poolPromise
        
        return pool.request() 
        .execute('spListarInstrumentos')
    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerInstrumento(id){
    try{
         const pool = await poolPromise
        
        return pool.request() 
        .input('NroInstrumento', sql.Int, id)
        .execute('spCargarInstrumento')
    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerAula(id){
    try{
         const pool = await poolPromise
        
        return pool.request() 
        .input('NroAula', sql.Int, id)
        .execute('spCargarAula')
    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerCuatrimestre(id){
    try{
         const pool = await poolPromise
        
        return pool.request() 
        .input('NroCuatrimestre', sql.Int, id)
        .execute('spCargarCuatrimestre_new')
    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerMateria(id){
    try{
         const pool = await poolPromise
        
        return pool.request() 
        .input('NroMateria', sql.Int, id)
        .execute('spCargarMateria_new')
    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}


async  function obtenerMateriasCorrelativas(id){
    try{
         const pool = await poolPromise
        
        return pool.request() 
        .input('NroMateria', sql.Int, id)
        .execute('spCargarMateria_Correlativas_new')
    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async function inicializarMateriasCorrelativas(id){
    try{
        const pool = await poolPromise
        
        return pool.request() 
        .input('NroMateria', sql.Int, id)
        .execute('spInicializarMateriasCorrelativas')
    }catch{
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}


async function grabarMateriaCorrelativa(id,id_correlativa){

    try {
        const pool = await poolPromise

        return pool.request() 
        .input('NroMateria', sql.Int, id)
        .input('NroMateriaCorrelativa', sql.Int, id_correlativa)
        .execute('spGrabarMateria_MateriasCorrelativas')

    }catch(err){
        log.error('se produjo un error '+ err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async function grabarMateria({materia:materia,id:id}){

    try {
        const pool = await poolPromise

        const idMateria = id ? id : null;

        return pool.request() 
        .input('NroMateria', sql.Int, idMateria)
        .input('Nombre', sql.NVarChar, materia.nombre)
        .input('Codigo', sql.NVarChar, materia.codigo.toUpperCase())
        .input('Creditos', sql.Int, materia.creditos)
        .input('MultipleInscripcion', sql.Bit, materia.multiple_inscripcion)
        .input('NroCiclo', sql.Int, 0)
        .input('NroCapacidad', sql.Int, materia.capacidad)
        .input('TipoEncabezado', sql.Int, materia.id_encabezado)
        .input('Regimen', sql.Int, materia.id_regimen)
        .input('EsIndividual', sql.Bit, materia.clase_individual)
        .input('activa', sql.Bit, materia.activa)

        .execute('spGrabarMateria2_new')

    }catch(err){
        log.error('se produjo un error '+ err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async function grabarInstrumento({instrumento:instrumento,id:id}){

    try {
        const pool = await poolPromise

        const idInstrumento = id ? id : null;

        return pool.request() 
        .input('NroInstrumento', sql.Int, idInstrumento)
        .input('Nombre', sql.NVarChar, instrumento.nombre)
        .input('Abreviatura', sql.NVarChar, instrumento.abreviatura.toUpperCase())


        .execute('spGrabarInstrumento_new')

    }catch(err){
        log.error('se produjo un error '+ err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async function grabarAula({aula:aula,id:id}){

    try {
        const pool = await poolPromise

        const idAula = id ? id : null;

        return pool.request() 
        .input('NroAula', sql.Int, idAula)
        .input('Nombre', sql.NVarChar, aula.nombre)

        .execute('spGrabarAula_new')

    }catch(err){
        log.error('se produjo un error '+ err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async function grabarCuatrimestre({cuatrimestre:cuatrimestre,id:id}){

    try {
        const pool = await poolPromise

        const {dia_i,mes_i,anio_i} = cuatrimestre;
        const {dia_f,mes_f,anio_f} = cuatrimestre;

        const fecha_inicio_new = utilFechas.transformarDiaMesAnioAfechaSQL(dia_i,mes_i,anio_i)
        const fecha_fin_new = utilFechas.transformarDiaMesAnioAfechaSQL(dia_f,mes_f,anio_f)

        const idCuatrimestre = id ? id : -1;

        return pool.request() 
        .input('NroCuatrimestre', sql.Int, idCuatrimestre)
        .input('Nombre', sql.NVarChar, cuatrimestre.nombre)
        .input('FechaInicio', sql.NVarChar, fecha_inicio_new)
        .input('FechaFin', sql.NVarChar, fecha_fin_new)
        .input('Activo', sql.Bit, cuatrimestre.activo)

        .execute('spGrabarCuatrimestre_new')

    }catch(err){
        log.error('se produjo un error '+ err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerInscriptosPorCuatrimestrePorSexo(id,sexo){
    try{
         const pool = await poolPromise
        
        return pool.request() 
        .input('NroCuatrimestre', sql.Int, id)
        .input('Sexo', sql.VarChar, sexo)
        .execute('spContarInscriptosSegunCuatrimestresSegunSexo')
    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerInscriptosPorCuatrimestre(id){
    try{
         const pool = await poolPromise
        
        return pool.request() 
        .input('NroCuatrimestre', sql.Int, id)
        .input('MesaExamen', sql.Bit, 0)
        .execute('spContarInscriptosSegunCuatrimestres')
    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerTotalMateriasDictadas(id,me){
    try{
         const pool = await poolPromise
        
        return pool.request() 
        .input('NroCuatrimestre', sql.Int, id)
        .execute('spContarMateriasSegunCuatrimestres')
    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerTotalCursosAbiertos(id){
    try{
         const pool = await poolPromise
        
        return pool.request() 
        .input('NroCuatrimestre', sql.Int, id)
        .execute('spContarCursosAbiertosSegunCuatrimestres')
    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}


async  function obtenerTotalProfesores(id,me){
    try{
         const pool = await poolPromise
        
        return pool.request() 
        .input('NroCuatrimestre', sql.Int, id)
        .execute('spContarProfesoresSegunCuatrimestres')
    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}


async  function obtenerAlumnosPorMateria(id,id_materia){
    try{
         const pool = await poolPromise
        
        return pool.request() 
        .input('NroCuatrimestre', sql.Int, id)
        .input('NroMateria', sql.Int, id_materia)
        .execute('spContarAlumnosSegunMateriasSegunCuatrimestres')
    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerAlumnosPorProfesor(id,id_prof){
    try{
         const pool = await poolPromise
        
        return pool.request() 
        .input('NroCuatrimestre', sql.Int, id)
        .input('NroProfesor', sql.Int, id_prof)
        .execute('spContarAlumnosSegunProfesorSegunCuatrimestres')
    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}


async  function obtenerProfesoresPorMateria(id,id_materia){
    try{
         const pool = await poolPromise
        
        return pool.request() 
        .input('NroCuatrimestre', sql.Int, id)
        .input('NroMateria', sql.Int, id_materia)
        .execute('spContarProfesoresSegunMateriasSegunCuatrimestres')
    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerMateriasPorProfesor(id,id_prof){
    try{
         const pool = await poolPromise
        
        return pool.request() 
        .input('NroCuatrimestre', sql.Int, id)
        .input('NroProfesor', sql.Int, id_prof)
        .execute('spContarMateriasSegunProfesorSegunCuatrimestres')
    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}


async  function obtenerCursosPorMateria(id,id_materia){
    try{
         const pool = await poolPromise
        
        return pool.request() 
        .input('NroCuatrimestre', sql.Int, id)
        .input('NroMateria', sql.Int, id_materia)
        .execute('spContarCursosSegunMateriasSegunCuatrimestres')
    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerCursosPorProfesor(id,id_prof){
    try{
         const pool = await poolPromise
        
        return pool.request() 
        .input('NroCuatrimestre', sql.Int, id)
        .input('NroProfesor', sql.Int, id_prof)
        .execute('spContarCursosSegunProfesorSegunCuatrimestres')
    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerCursosPorProfesor(id,id_prof){
    try{
         const pool = await poolPromise
        
        return pool.request() 
        .input('NroCuatrimestre', sql.Int, id)
        .input('NroProfesor', sql.Int, id_prof)
        .execute('spContarCursosSegunProfesorSegunCuatrimestres')
    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerCursosPorProfesor(id,id_prof){
    try{
         const pool = await poolPromise
        
        return pool.request() 
        .input('NroCuatrimestre', sql.Int, id)
        .input('NroProfesor', sql.Int, id_prof)
        .execute('spContarCursosSegunProfesorSegunCuatrimestres')
    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerComparativasInscripcion(periodo1,periodo2,orden){
    try{
         const pool = await poolPromise
        
         console.log(orden)
        return pool.request() 
        .input('NroCuatrimestre_1', sql.Int, periodo1)
        .input('NroCuatrimestre_2', sql.Int, periodo2)
        .input('OrdenLeyenda', sql.Bit, Number(orden))
        .execute('spListarComparativaDeInscripciones_new')
    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}


async  function obtenerInscrpcionesPorCuatrimestre(id){
    try{
         const pool = await poolPromise
        
        return pool.request() 
        .input('NroCuatrimestre', sql.Int, id)
        .execute('spListarCantMatInscriptasSegunCuatrimestre_new')
    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerAlumnosPorPais(id){
    try{
         const pool = await poolPromise
        
        return pool.request() 
        .input('NroCuatrimestre', sql.Int, id)
        .execute('spListarCantidadAlumnosPaisesSegunCuatrimestres')
    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerAlumnosPorProvincia(id,id_pais){
    try{
         const pool = await poolPromise
        
        return pool.request() 
        .input('NroCuatrimestre', sql.Int, id)
        .input('NroPais', sql.Int, id_pais)
        .execute('spListarCantidadAlumnosProvinciasSegunCuatrimestres')
    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

/*
Datos globales
obtenerInscriptosPorCuatrimestrePorSexo
obtenerInscriptosPorCuatrimestre
obtenerTotalMateriasDictadas
obtenerTotalCursosAbiertos
obtenerTotalProfesores


obtenerAlumnosPorProfesor
obtenerMateriasPorProfesor
obtenerCursosPorProfesor

obtenerProfesoresPorMateria
obtenerAlumnosPorMateria
obtenerCursosPorMateria

obtenerComparativasInscripcion

obtenerInscrpcionesPorCuatrimestre

obtenerAlumnosPorPais
obtenerAlumnosPorProvincia
*/

module.exports={
    obtenerAlgo,
    obtenerMaterias,
    obtenerProfesores,
    obtenerCuatrimestres,
    obtenerTiposCursos,
    obtenerNivelesE
    ,obtenerNivelesI,
    obtenerEncabezados,
    obtenerRegimenesPorEncabezado,
    obtenerAulas,
    obtenerDias,
    obtenerRegimenes,
    obtenerPaises,
    obtenerProvinciasAll,
    obtenerNacionalidades,
    obtenerInstrumentos,
    obtenerTiposUsuarios,
    obtenerPermisosUsuarios,
    grabarInstrumento,
    grabarAula,
    grabarCuatrimestre,
    obtenerInstrumento,
    obtenerAula,
    obtenerCuatrimestre,
    obtenerMateria,
    obtenerMateriasCorrelativas,
    grabarMateria,
    inicializarMateriasCorrelativas,
    grabarMateriaCorrelativa,
    obtenerInscriptosPorCuatrimestrePorSexo,
    obtenerInscriptosPorCuatrimestre,
    obtenerTotalMateriasDictadas,
    obtenerTotalCursosAbiertos,
    obtenerTotalProfesores,
    obtenerAlumnosPorProfesor,
    obtenerMateriasPorProfesor,
    obtenerCursosPorProfesor,
    obtenerProfesoresPorMateria,
    obtenerAlumnosPorMateria,
    obtenerCursosPorMateria,
    obtenerComparativasInscripcion,
    obtenerInscrpcionesPorCuatrimestre,
    obtenerAlumnosPorPais,
    obtenerAlumnosPorProvincia
}