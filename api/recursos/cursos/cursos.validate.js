const Joi = require('joi');
const log = require('../../../utils/logger');

const bluePrintInscripcion = Joi.object().keys(
    {
        id:Joi.number().min(1).integer().required().error(()=>"El id del curso para inscribir es obligatorio y debe ser un número válido"),
        id_alumno:Joi.number().min(1).integer().required().error(()=>"El id del alumno a inscribir es obligatorio y debe ser un número válido"),
        id_tipo_cursada:Joi.number().min(1).integer().required().error(()=>"El id del tipo de inscripción es obligatorio y debe ser un número válido"),
        tipo:Joi.string().valid(['INDIVIDUAL','GRUPAL']).required().error(()=>"Debe especificar el tipo de curso: GRUPAL o INDIVIDUAL"),
        hora_individual:Joi.string().when('tipo',{is:'INDIVIDUAL',then:Joi.string().trim().regex(/^[0-9]|0[0-9]|1[0-9]|2[0-3]:[0-5][0-9]$/).required().error(()=>"Debe especificar un horario si el curso a inscribir es INDIVIDUAL"),otherwise: Joi.string().trim().valid([""])})
     }
)

const vectorHorasValidas = cargarVectorHorasValidas();

const bluePrintCurso = Joi.object().keys(
    {
        materia:Joi.number().min(1).integer().required(),
        profesor:Joi.number().min(1).integer().required(),
        tipoCurso:Joi.number().min(0).integer().required(),
        cuatrimestre:Joi.number().min(1).integer().required(),
        nivelE:Joi.number().min(0).integer().required(),
        nivelI:Joi.number().min(0).integer().required(),
        encabezado:Joi.number().min(1).integer().required(),
        regimen:Joi.number().min(1).integer().required(),
        aula:Joi.number().min(1).integer().required(),
        dia:Joi.number().min(1).integer().required(),
        diaString:Joi.string().required(),
        capacidad:Joi.number().min(1).max(99).required(),
        recuperatorio:Joi.boolean().required(),
        subdivisioni:Joi.boolean().required(),
        horai:Joi.string().valid(vectorHorasValidas).required(),
        minutoi:Joi.string().valid(['00','30']).required(),
        horaf:Joi.string().valid(vectorHorasValidas).required(),
        minutof:Joi.string().valid(['00','30']).required(),
        horaDesde:Joi.number().required(),
        horaHasta:Joi.number().greater(Joi.ref('horaDesde')).required()
    }
)

let validarCurso = (req,res,next)=>{

    // en vez de validar el body, creo un objetoAvalidar que toma lo que trae el body y le agrega 2 campos
    // antes de hacer la validación agrego 2 propiedades para que se validen en el esquema
    const {horai,minutoi,horaf,minutof} = req.body;

    const {hora_desde, hora_hasta} = convertirHorasMinutosAnumero(horai,minutoi,horaf,minutof)

    const objetoAvalidar = {...req.body,horaDesde:hora_desde, horaHasta:hora_hasta}

    log.info(JSON.stringify(objetoAvalidar))
    // En el objetoAvalidar además de lo que traía el body se agregó horaDesde y horaHasta para que se valide que horaHasta sea mayor a horaDesde

    // agrego la propiedad allowUnknown con valor true porque en el objeto que mando
    // hay un campo que lo uso en el cliente para validaciones pero que aquí no sirve y no
    // lo permite a no ser que le indique con allowUnknown que acepte otros campos que no están
    // en el esquema del servidor con Joi (pero que estan en el esquema del cliente con yup)
    const resultado = Joi.validate(objetoAvalidar,bluePrintCurso,{abortEarly:false,convert:false,allowUnknown:true})

    if (resultado.error===null){
        next()
    }else{
        let erroresDeValidacion = resultado.error.details.reduce((acumulador,error)=>{
            return acumulador + ` ${error.message}` 
        },"")

        res.status(400).send({message:erroresDeValidacion})
    }
}

let validarInscripcion = (req,res,next)=>{
    const resultado = Joi.validate(req.body,bluePrintInscripcion,{abortEarly:false,convert:false})

    if (resultado.error===null){
        next()
    }else{
        let erroresDeValidacion = resultado.error.details.reduce((acumulador,error)=>{
            return acumulador + ` ${error.message}` 
        },"")

        res.status(400).send({message:erroresDeValidacion})
    }
}


const bluePrintCambioHorario = Joi.object().keys(
    {
        id:Joi.number().min(1).integer().required().error(()=>"El id del curso para inscribir es obligatorio y debe ser un número válido"),
        id_alumno:Joi.number().min(1).integer().required().error(()=>"El id del alumno a inscribir es obligatorio y debe ser un número válido"),
        nuevohorario:Joi.string().trim().regex(/^[0-9]|0[0-9]|1[0-9]|2[0-3]:[0-5][0-9]$/).length(5).required(),
    }
)


let validarCambioHorario = (req,res,next)=>{

    const resultado = Joi.validate(req.body,bluePrintCambioHorario,{abortEarly:false,convert:false})

    if (resultado.error===null){
        next()
    }else{
        let erroresDeValidacion = resultado.error.details.reduce((acumulador,error)=>{
            return acumulador + ` ${error.message}` 
        },"")
        res.status(400).send({message:erroresDeValidacion})
    }

}

function cargarVectorHorasValidas() {
    let hora;
    let vector_horas = []

    for (var i = 8; i < 23; i++) {
        if (i < 10) {
            hora = `0${i}`;
        } else {
            hora = `${i}`;
        }
        vector_horas.push(hora);
    }

    return vector_horas
}

function convertirHorasMinutosAnumero(horai,minutoi,horaf,minutof){

    let hora_desde_numerica = Number(horai + minutoi)
    let hora_hasta_numerica = Number(horaf + minutof)

    return {hora_desde:hora_desde_numerica, hora_hasta:hora_hasta_numerica}
}
module.exports = {validarInscripcion,validarCambioHorario,validarCurso};