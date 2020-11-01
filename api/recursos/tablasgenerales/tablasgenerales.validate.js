const Joi = require('joi');
const log = require('../../../utils/logger');
const tablasgeneralesController = require('../tablasgenerales/tablasgenerales.controller')
const utilFechas = require('../../../utils/fechas')

const bluePrintAula = Joi.object().keys(
     {
        nombre:Joi.string().max(20).required(),
      }
)

const bluePrintCuatrimestre = Joi.object().keys(
    {
        nombre:Joi.string().max(25).required(),
        activo:Joi.boolean().required(),
        dia_i:Joi.number().min(1).max(31).integer().required(),
        mes_i:Joi.number().min(1).max(12).integer().required(),
        anio_i:Joi.number().min(aniosPermitidos().desde).max(aniosPermitidos().hasta).integer().required(),
        dia_f:Joi.number().min(1).max(31).integer().required(),
        mes_f:Joi.number().min(1).max(12).integer().required(),
        anio_f:Joi.number().min(aniosPermitidos().desde).max(aniosPermitidos().hasta).integer().required()
     }
)

const bluePrintMateria = Joi.object().keys(
    {
        nombre:Joi.string().max(50).required(),
        codigo:Joi.string().max(4).required(),
        id_encabezado:Joi.number().min(1).integer().required(),
        id_regimen:Joi.number().min(1).integer().required(),
        clase_individual:Joi.boolean().required(),
        multiple_inscripcion:Joi.boolean().required(),
        capacidad:Joi.number().min(1).max(99).integer().required(),
        creditos:Joi.number().min(0).max(10).integer().required(),
        activa:Joi.boolean().required()
     }
)

const bluePrintInstrumento = Joi.object().keys(
    {
        nombre:Joi.string().max(20).required(),
        abreviatura:Joi.string().max(3).required(),
      }
)

let validarAula = (req,res,next)=>{
    const resultado = Joi.validate(req.body,bluePrintAula,{abortEarly:false,convert:false})

    if (resultado.error===null){
        next()
    }else{
        let erroresDeValidacion = resultado.error.details.reduce((acumulador,error)=>{
            return acumulador + ` ${error.message}` 
        },"")

        res.status(400).send(erroresDeValidacion)
    }
}

let validarInstrumento = (req,res,next)=>{
    const resultado = Joi.validate(req.body,bluePrintInstrumento,{abortEarly:false,convert:false})

    if (resultado.error===null){
        next()
    }else{
        let erroresDeValidacion = resultado.error.details.reduce((acumulador,error)=>{
            return acumulador + ` ${error.message}` 
        },"")

        res.status(400).send(erroresDeValidacion)
    }
}

let validarCuatrimestre = (req,res,next)=>{
    const resultado = Joi.validate(req.body,bluePrintCuatrimestre,{abortEarly:false,convert:false})

    if (resultado.error===null){
        next()
    }else{
        let erroresDeValidacion = resultado.error.details.reduce((acumulador,error)=>{
            return acumulador + ` ${error.message}` 
        },"")

        res.status(400).send(erroresDeValidacion)
    }
}

let validarMateria = (req,res,next)=>{
    const resultado = Joi.validate(req.body,bluePrintMateria,{abortEarly:false,convert:false})

    if (resultado.error===null){
        next()
    }else{
        let erroresDeValidacion = resultado.error.details.reduce((acumulador,error)=>{
            return acumulador + ` ${error.message}` 
        },"")

        res.status(400).send(erroresDeValidacion)
    }
}

async function validarInstrumentoRepetido(req,res,next){
    const {nombre,abreviatura} = req.body;
    const id = req.params.id;

    try{
        const instrumentos = await tablasgeneralesController.obtenerInstrumentos();

        if (id){ // es una modificación
            let datosIguales=instrumentos.recordset.filter(item=>item.nombre.toUpperCase()===nombre.toUpperCase() && item.id_instrumento != id)

            if (datosIguales.length>0){
                res.status(400).send('El nombre del instrumento está en uso')
                return
            }

            datosIguales=instrumentos.recordset.filter(item=>item.abreviatura.toUpperCase()===abreviatura.toUpperCase() && item.id_instrumento != id)
            
            if (datosIguales.length>0){
                res.status(400).send('La abreviatura del instrumento está en uso')
                return
            }

            next()

        }else{ // es una alta
            let datosIguales=instrumentos.recordset.filter(item=>item.nombre.toUpperCase()===nombre.toUpperCase())

            if (datosIguales.length>0){
                res.status(400).send('El nombre del instrumento está en uso')
                return
            }

            datosIguales=instrumentos.recordset.filter(item=>item.abreviatura.toUpperCase()===abreviatura.toUpperCase())
            
            if (datosIguales.length>0){
                res.status(400).send('La abreviatura del instrumento está en uso')
                return
            }

            next()
        }
    }catch(err){
        res.status(500).send(err.message)
    }
}

async function validarCuatrimestreRepetido(req,res,next){
    const {nombre} = req.body;
    const id = req.params.id;

    try{
        const cuatrimestres = await tablasgeneralesController.obtenerCuatrimestres();

        if (id){ // es una modificación
            let datosIguales=cuatrimestres.recordset.filter(item=>item.nombre.toUpperCase()===nombre.toUpperCase() && item.id_cuatrimestre != id)

            if (datosIguales.length>0){
                res.status(400).send('El nombre del cuatrimestre está en uso')
                return
            }

            next()

        }else{ // es una alta
            let datosIguales=cuatrimestres.recordset.filter(item=>item.nombre.toUpperCase()===nombre.toUpperCase())

            if (datosIguales.length>0){
                res.status(400).send('El nombre del cuatrimestre está en uso')
                return
            }

            next()
        }
    }catch(err){
        res.status(500).send(err.message)
    }
}

async function validarAulaRepetida(req,res,next){
    const {nombre} = req.body;
    const id = req.params.id;

    try{
        const aulas = await tablasgeneralesController.obtenerAulas();

        if (id){ // es una modificación
            let datosIguales=aulas.recordset.filter(item=>item.descripcion.toUpperCase()===nombre.toUpperCase() && item.id_aula != id)

            if (datosIguales.length>0){
                res.status(400).send('El nombre del aula está en uso')
                return
            }

            next()

        }else{ // es una alta
            let datosIguales=aulas.recordset.filter(item=>item.descripcion.toUpperCase()===nombre.toUpperCase())

            if (datosIguales.length>0){
                res.status(400).send('El nombre del aula está en uso')
                return
            }

            next()
        }
    }catch(err){
        res.status(500).send(err.message)
    }
}

async function validarMateriaRepetida(req,res,next){
    const {nombre,codigo} = req.body;
    const id = req.params.id;

    try{
        const materias = await tablasgeneralesController.obtenerMaterias();

        if (id){ // es una modificación
            let datosIguales=materias.recordset.filter(item=>item.descripcion.toUpperCase()===nombre.toUpperCase() && item.id_materia != id)

            if (datosIguales.length>0){
                res.status(400).send('El nombre de la materia está en uso')
                return
            }

            datosIguales=materias.recordset.filter(item=>item.cod_materia.toUpperCase()===codigo.toUpperCase() && item.id_materia != id)

            if (datosIguales.length>0){
                res.status(400).send('El código de la materia está en uso')
                return
            }

            next()

        }else{ // es una alta
            let datosIguales=materias.recordset.filter(item=>item.descripcion.toUpperCase()===nombre.toUpperCase())

            if (datosIguales.length>0){
                res.status(400).send('El nombre de la materia está en uso')
                return
            }

            datosIguales=materias.recordset.filter(item=>item.cod_materia.toUpperCase()===codigo.toUpperCase())

            if (datosIguales.length>0){
                res.status(400).send('El código de la materia está en uso')
                return
            }            

            next()
        }
    }catch(err){
        res.status(500).send(err.message)
    }
}

function aniosPermitidos(){
    var fecha_actual = new Date();
    var anio_hasta = Number(fecha_actual.getFullYear()+1);
    var anio_desde = Number(fecha_actual.getFullYear()-50);

    return {desde:anio_desde,hasta:anio_hasta}
}

module.exports = {validarAula,
                  validarAulaRepetida,
                  validarInstrumento,
                  validarCuatrimestre,
                  validarCuatrimestreRepetido,
                  validarInstrumentoRepetido,
                  validarMateriaRepetida,
                  validarMateria};