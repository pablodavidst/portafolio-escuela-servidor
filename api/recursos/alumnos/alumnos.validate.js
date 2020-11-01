const Joi = require('joi');
const log = require('../../../utils/logger');
const anioMaximo = calcularAnioMaximo();
const anioMinimo = calcularAnioMinimo();

const bluePrintAlumno = Joi.object().keys(
    {
        pais:Joi.number().min(1).integer().required(),
        provincia:Joi.number().min(1).integer().required(),
         celular:Joi.string().max(100).allow(''),       
         telefono:Joi.string().max(100).when('celular',{
            is:'',
            then:Joi.required().label("Informe celular y/o teléfono"),
            otherwise:Joi.allow('') 
         }),           
        telef_alternativo:Joi.string().max(100).allow(''),
        telef_laboral:Joi.string().max(100).allow(''),
        email:Joi.string().email().max(200).required(),
        email_secundario:Joi.string().email().max(200).allow(''),
        domicilio:Joi.string().max(50).required(),
        domicilio2:Joi.string().max(50).allow(''),
        localidad:Joi.string().max(15).required(),
        codpostal:Joi.string().max(10).allow(''),
        nombre:Joi.string().max(20).required(),
        apellido:Joi.string().max(20).required(),
        documento:Joi.string().max(15).required(),
        nacionalidad:Joi.string().max(15).required(),
        obs_finanzas:Joi.string().max(1000).allow(''),
        sexo:Joi.string().valid(['M','F']).required(),
        dia:Joi.number().min(1).max(31).integer().required(),
        mes:Joi.number().min(1).max(12).integer().required(),
        anio:Joi.number().min(anioMinimo).max(anioMaximo).integer().required()
    }
)

let validarAlumno = (req,res,next)=>{

    // en vez de validar el body, creo un objetoAvalidar que toma lo que trae el body y le agrega 2 campos
    // antes de hacer la validación agrego 2 propiedades para que se validen en el esquema
    const {horai,minutoi,horaf,minutof} = req.body;

    const objetoAvalidar = {...req.body.datosgenerales}

    log.info(JSON.stringify(objetoAvalidar))
    // En el objetoAvalidar además de lo que traía el body se agregó horaDesde y horaHasta para que se valide que horaHasta sea mayor a horaDesde

    // agrego la propiedad allowUnknown con valor true porque en el objeto que mando
    // hay un campo que lo uso en el cliente para validaciones pero que aquí no sirve y no
    // lo permite a no ser que le indique con allowUnknown que acepte otros campos que no están
    // en el esquema del servidor con Joi (pero que estan en el esquema del cliente con yup)
    const resultado = Joi.validate(objetoAvalidar,bluePrintAlumno,{abortEarly:false,convert:false,allowUnknown:true})

    if (resultado.error===null){
        next()
    }else{
        let erroresDeValidacion = resultado.error.details.reduce((acumulador,error)=>{
            return acumulador + ` ${error.message}` 
        },"")

        res.status(400).send({message:erroresDeValidacion})
    }
}

function calcularAnioMaximo(){
    let fecha = new Date();

    return fecha.getFullYear()-3
}

function calcularAnioMinimo(){
    let fecha = new Date();
    return fecha.getFullYear()-80
}


module.exports = {validarAlumno};