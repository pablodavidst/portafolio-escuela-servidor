const Joi = require('joi');
const log = require('../../../utils/logger')

const blueprintPedidoLogin = Joi.object().keys({
    username: Joi.string().required(),
    password:Joi.string().required()
})

let validarPedidoLogin =(req,res,next)=>{
    const resultado = Joi.validate(req.body,blueprintPedidoLogin,{abortEarly:false,convert:false})
    if (resultado.error===null){
        next();
    }else{
        res.status(400).send("Fallò el login. Debes especificar el usuario y contraseña. Ambos deben ser strings")
    }
}

let validarUsuario = (req,res,next) =>{

    const anioActual = new Date().getFullYear();
    
    const fechaNacimiento = {...req.body.fechaNacimiento, anioActual:anioActual}
    // tomo el objeto fechaNacimiento original y le agrego un nuevo campo anioActual

    const objetoAvalidar = {...req.body, fechaNacimiento } 
    // tomo el body original y le piso el objeto  fechaNacimiento con el nuevo campo para
    // poder validar fechaNacimiento.anio contra fechaNacimiento.anioActual

    // El campo anioActual tuve que incluirlo dentro del objeto fechaNacimiento porque 
    // si lo incluía afuera del objeto no lo reconocía. Si no hubiera definido la fecha de nacimiento
    // El campo de referencia debe estar en el mismo nivel que el campo que lo usa.

    const resultado = Joi.validate(objetoAvalidar,blueprintUsuario,{abortEarly:false,convert:false})

    if (resultado.error===null){
        next()
    }else{

        let erroresDeValidacion = resultado.error.details.reduce((acumulador,error)=>{
            return acumulador + ` ${error.message}` 
        },"")

        log.error(`Error al validar el objeto ${JSON.stringify(objetoAvalidar)} resultando en errores de validación ${erroresDeValidacion}`)
        res.status(400).send({message:erroresDeValidacion})

    }
}

const blueprintUsuario = Joi.object().keys({
    apellido: Joi.string().max(20).required().error(()=>"El apellido no es válido"),
    nombre:Joi.string().max(20).required().error(()=>"El nombre no es válido"),
    direccion:Joi.string().max(50).required(),
    fechaNacimiento: 
    {
        anioActual:Joi.number().required(), // lo agrego manualmente para calcular el año actual
                                            // y luego referenciarlo en el campo anio
        dia:Joi.number().min(1).max(31).required(),
        mes:Joi.number().min(1).max(12).required(),
        anio:Joi.number().integer().min(1900).max(Joi.ref('anioActual')).required()
    },
    email:Joi.string().email().required(),
    telefono:Joi.string().label("Teléfono de contacto").required(),
    documento:Joi.string().regex(/^[0-9]*$/).min(7).max(9).required(),
    pais:Joi.string().max(15).required(),
    provincia:Joi.string().max(15).required(),
    localidad:Joi.string().max(15).required(),
    codigoPostal:Joi.string().max(15).required(),
    tipoUsuarioId:Joi.number().required().max(1).min(0), // 0 administrativo 1 profesor
    nombreUsuario:Joi.string().alphanum().max(15).required(),
    permisoId:Joi.number().required().min(0).max(3), // 0 profesor 1 secretaria 2 direccion 3 administracion 
    activo:Joi.boolean().required()
})

module.exports = {validarPedidoLogin,validarUsuario};