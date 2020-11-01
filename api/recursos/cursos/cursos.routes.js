const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const jwtAuthenticate = passport.authenticate('jwt',{session:false});
const procesarErrores = require('./../../libs/errorHandler').procesarErrores;
const log = require('../../../utils/logger');
const cursosController = require('../../recursos/cursos/cursos.controller')
const config = require('./../../../config')
const cursoRouter = express.Router();
const validarInscripcion = require('./cursos.validate').validarInscripcion;
const validarCambioHorario = require('./cursos.validate').validarCambioHorario;
const validarCurso = require('./cursos.validate').validarCurso;
const ErrorYaInscripto = require('./cursos.errors').ErrorYaInscripto;
const ErrorInscripcionNoViable = require('./cursos.errors').ErrorInscripcionNoViable
const ErrorEncabezado = require('./cursos.errors').ErrorEncabezado
const EncabezadoVacio = require('./cursos.errors').EncabezadoVacio
const ErrorCalificaciones = require('./cursos.errors').ErrorCalificaciones

const validarYaInscripto = (req,res,next)=>{

    const id_curso = req.body.id;
    const id_alumno = req.body.id_alumno;

    const alumnosDelCurso = cursosController.obtenerAlumnosDelCurso(id_curso)
    .then(alumnos=>{
        const verificarPresencia = alumnos.recordset.findIndex(item=>item.id_alumno===id_alumno)

        if(verificarPresencia===-1){
            next();
        }else{
            res.status(400).send(`El alumno con id ${id_alumno} ya está inscripto en el curso ${id_curso}`)
        }
    }).catch(err=>{
        res.status(500).send(err.message)
    })
    
}

const validarPosibilidadesInscripcion = (req,res,next)=>{
    const {id,id_alumno,hora_individual} = req.body;

    cursosController.verificarPosibilidadInscripcion(id,id_alumno,hora_individual)
    .then(posibilidades=>{
        const resultado = posibilidades.recordset;

        if(resultado[0].error===null){
            next();
        }else{
            throw new ErrorInscripcionNoViable(resultado[0].error)
        }
    }).catch(err=>{
        res.status(500).send(err.message)
    })
}

const transformarYvalidarCalificaciones = (req,res,next)=>{

    const calificaciones = req.body;

    const calificacionesMapeadas = {
        columna_1 : mapearCalificacion(calificaciones.columna_1),
        columna_2 : mapearCalificacion(calificaciones.columna_2),
        columna_3 : mapearCalificacion(calificaciones.columna_3),
        columna_4 : mapearCalificacion(calificaciones.columna_4),
        columna_5 : mapearCalificacion(calificaciones.columna_5),
        columna_6 : mapearCalificacion(calificaciones.columna_6),
        columna_7 : mapearCalificacion(calificaciones.columna_7),
        columna_8 : mapearCalificacion(calificaciones.columna_8),
        promedio : mapearCalificacion(calificaciones.promedio),
        concepto : mapearCalificacion(calificaciones.concepto),
        condicional : mapearCalificacionCondicional(calificaciones.condicional)
    }
    
    const objetoTransformadoEnVector = Object.values(calificacionesMapeadas)

    const huboError = objetoTransformadoEnVector.some(item=>item=='ERROR')

    log.error(`Error al validar y mapear las calificaciones ORIGINAL ${JSON.stringify(calificaciones)} MAPEADAS ${objetoTransformadoEnVector}`)

    if (huboError){
        res.status(500).send('Se encontró un error al mapear las calificaciones enviadas')
    }else{
        req.body = {...calificacionesMapeadas}
        next()
    }

}

const mapearCalificacionCondicional = (calificacion)=>{
    let nota;

    switch(calificacion.trim()){
     
        case '':
            nota = '';
            break;
        case 'COND':
            nota = 'COND';
            break;
        default:
            nota = 'ERROR'
    }

    return nota;
}

const mapearCalificacion = (calificacion)=>{
    let nota;

    switch(calificacion){
        case null:
            nota = 0;
            break;        
        case '--':
            nota = 0;
            break;
        case 'AUS':
            nota = 254;
            break;
        case 'AJ':
            nota = 251;
            break;
        case 'AI':
            nota = 525;
            break;
        case 'I':
            nota = 253;
            break;
        case 'INC':
            nota = 255;
            break;
        default:
            if (Number.isInteger(Number(calificacion))){
                nota = Number(calificacion)
            }else{
                nota = 'ERROR'
            }
    }

    return nota;
}


cursoRouter.get('/all/:id_cuatrimestre',jwtAuthenticate,procesarErrores((req,res)=>{
    const cuatrimestre = req.params.id_cuatrimestre;

    return cursosController.obtenerCursos({cuatrimestre:cuatrimestre})
    .then(cursos=>{
        res.status(200).json(cursos.recordset)
    })
}))

cursoRouter.get('/profesor/:id_cuatrimestre/:id_prof',jwtAuthenticate,procesarErrores((req,res)=>{
    const cuatrimestre = req.params.id_cuatrimestre;
    const profesor = req.params.id_prof;

    return cursosController.obtenerCursos({cuatrimestre:cuatrimestre,profesor:profesor})
    .then(cursos=>{
        console.log('0000000000000',cursos.recordset)
        res.status(200).json(cursos.recordset)
    })
}))

cursoRouter.get('/materia/:id_cuatrimestre/:id_materia',jwtAuthenticate,procesarErrores((req,res)=>{
    const cuatrimestre = req.params.id_cuatrimestre;
    const materia = req.params.id_materia;

    return cursosController.obtenerCursos({cuatrimestre:cuatrimestre,materia:materia})
    .then(cursos=>{
        res.status(200).json(cursos.recordset)
    })
}))

cursoRouter.get('/cuatrimestre/:id',jwtAuthenticate,procesarErrores((req,res)=>{
    const id_cuatrimestre = req.params.id;

    return cursosController.obtenerCuatrimestreMoverAotraRuta(id_cuatrimestre)
    .then(cuatrimestre=>{
        res.status(200).json(cuatrimestre.recordset)
    })
}))

cursoRouter.get('/cuatrimestres/all',jwtAuthenticate,procesarErrores((req,res)=>{
    return cursosController.obtenerCuatrimestresMoverAotraRuta()
    .then(cuatrimestres=>{
        res.status(200).json(cuatrimestres.recordset)
    })
}))

/*
cursoRouter.get('/:id',(req,res)=>{
    const id = req.params.id;
    res.status(200).send(`get del curso ${id}`)
})
*/

cursoRouter.get('/curso/:id',jwtAuthenticate,procesarErrores((req,res)=>{
    const id = req.params.id;
    return cursosController.obtenerCurso(id)
    .then(curso=>{
        res.status(200).json(curso.recordset[0])
    })
}))

cursoRouter.get('/curso/calificaciones/:id',jwtAuthenticate,procesarErrores((req,res)=>{
    const id = req.params.id;
    return fusionarCalificacionesConEncabezados(id)
    .then(curso=>{
        res.status(200).json(curso)
    }).catch(err=>{                 // esta ruta no funciona como las demas, si hay un error no se catchean como las otras por eso agrego el catch aquí
        res.status(500).send(err)   // el error que se manda al cliente es el que se forzón con throw error
    })
}))

async function fusionarCalificacionesConEncabezados(id){

    try{
        const encabezado = await traerEncabecezado(id);

        if (!encabezado){
            throw new EncabezadoVacio()
        }

        const encabezado_mapeado = {columna_1 : encabezado.columna_1 !='' ? encabezado.columna_1 : null,
        columna_2 : encabezado.columna_2 !='' ? encabezado.columna_2 : null,
        columna_3 : encabezado.columna_3 !='' ? encabezado.columna_3 : null,
        columna_4 : encabezado.columna_4 !='' ? encabezado.columna_4 : null,
        columna_5 : encabezado.columna_5 !='' ? encabezado.columna_5 : null,
        columna_6 : encabezado.columna_6 !='' ? encabezado.columna_6 : null,
        columna_7 : encabezado.columna_7 !='' ? encabezado.columna_7 : null,
        columna_8 : encabezado.columna_8 !='' ? encabezado.columna_8 : null,
        concepto : encabezado.Concepto !='' ? encabezado.Concepto : null}
    
        const calificaciones = await traerCalificaciones(id);
    
        if (!calificaciones){
            throw new ErrorCalificaciones()
        }
 
        const calificaciones_mapeadas = calificaciones.map(item=>{
            return {columna_1 : encabezado.columna_1 !='' ? item.columna_1 : null,
            columna_2 : encabezado.columna_2 !='' ? item.columna_2 : null,
            columna_3 : encabezado.columna_3 !='' ? item.columna_3 : null,
            columna_4 : encabezado.columna_4 !='' ? item.columna_4 : null,
            columna_5 : encabezado.columna_5 !='' ? item.columna_5 : null,
            columna_6 : encabezado.columna_6 !='' ? item.columna_6 : null,
            columna_7 : encabezado.columna_7 !='' ? item.columna_7 : null,
            columna_8 : encabezado.columna_8 !='' ? item.columna_8 : null,
            concepto : encabezado.Concepto !='' ? item.concepto : null,
            promedio:item.promedio, condicional:item.condicional,
            id_alumno :item.id_alumno,
            fecha:item.fecha,
            hora:item.hora,
            dia:traducirDia(item.dia),
            usuario:item.usuario}
        })
        return [encabezado_mapeado,...calificaciones_mapeadas]
    }catch(err){
        throw new ErrorEncabezado()
    }

}

function traducirDia(dia){
    let nombre;

    switch(dia){
        case 'Monday':
            nombre='Lunes';
            break;
        case 'Tuesday':
            nombre='Martes';
            break;            
        case 'Wednesday':
            nombre='Miércoles';
            break;            
        case 'Thursday':
            nombre='Jueves';
            break;            
        case 'Friday':
            nombre='Viernes';
            break;            
        case 'Saturday':
            nombre='Sábado';
            break;            
        default :
            nombre='Domingo';
    }

    return nombre;
}

async function traerEncabecezado(id){
    try{
        const encabezado = await cursosController.obtenerEncabezados(id)
        return encabezado.recordset[0]
    }catch(err){
        log.error(`Error al buscar los encabezados para el curso ${id} -- ${err}`)
    }
}

async function traerCalificaciones(id){
    try{
        const calificaciones = await cursosController.obtenerCalificaciones(id)
        return calificaciones.recordset
    }catch(err){
        log.error(`Error al buscar los encabezados para el curso ${id} -- ${err}`)
    }
}

cursoRouter.get('/altasrecientes',jwtAuthenticate,procesarErrores((req,res)=>{
    return cursosController.obtenerUltimasAltas()
    .then(curso=>{
        res.status(200).json(curso.recordset)
    })
}))

cursoRouter.get('/curso/abm/:id',jwtAuthenticate,procesarErrores((req,res)=>{
    const id = req.params.id;
    console.log(`${JSON.stringify(req.body)} es el usuario que hace el request`)
    return cursosController.obtenerCursoCompleto(id)
    .then(curso=>{
        res.status(200).json(curso.recordset[0])
    })
}))


cursoRouter.post('/inscripcion',[jwtAuthenticate,
                                validarInscripcion,
                                validarYaInscripto,
                                validarPosibilidadesInscripcion],
     procesarErrores((req,res)=>{

    const {id,id_alumno,id_tipo_cursada,hora_individual} = req.body;
    
    return cursosController.inscribirAlumno(id,id_alumno,id_tipo_cursada,hora_individual)
    .then((resultado)=>{
        log.info(`Se inscribe al alumno con id ${id_alumno} en el curso ${id} con tipo de cursada ${id_tipo_cursada} y hora individual ${hora_individual}`)
        res.status(200).send("Inscripción realizada con éxito")
    })
}))


cursoRouter.post('/alumno/cambiohora',[jwtAuthenticate,validarCambioHorario],procesarErrores((req,res)=>{
    const {id,id_alumno,nuevohorario}= req.body;

    return cursosController.modificarHorarioIndividual(id,id_alumno,nuevohorario)
            .then((resultado)=>{
                res.status(200).send("Modificación realizada con éxito")
            })
}))

cursoRouter.delete('/alumno/:curso/:alumno',[jwtAuthenticate],procesarErrores((req,res)=>{
    const id = req.params.curso;
    const id_alumno = req.params.alumno;

    return cursosController.borrarAlumnoInscripto(id,id_alumno)
            .then((resultado)=>{
                res.status(200).send("El alumno fue eliminado del curso")
            })
}))

cursoRouter.get('/alumnos/:id',jwtAuthenticate,procesarErrores((req,res)=>{
    const id = req.params.id;

    return cursosController.obtenerAlumnosDelCurso(id)
    .then(alumnos=>{
        res.status(200).json(alumnos.recordset)
    })
}))

cursoRouter.get('/test',jwtAuthenticate,procesarErrores((req,res)=>{

    return cursosController.test()
    .then(respuesta=>{
        res.status(200).json(respuesta.recordset)
    })
}))


cursoRouter.post('/',[jwtAuthenticate,validarCurso],procesarErrores((req,res)=>{

    const curso = req.body;
    return cursosController.grabarCurso({curso:curso}) // paso los parámetros como un objeto, es otra forma de pasar parametros cuando uno o mas son opcionales. Aqui se aplica porque grabarCurso puede recibir o no el id segúns sea una modificación o un alta 
    .then((respuesta)=>{
        log.info(`Se crea el curso ${respuesta.nro_curso}`);
        log.info(`Curso creado ${JSON.stringify(respuesta)}`);
        res.status(200).json(respuesta.recordset[0])
        }
    )
}))

cursoRouter.put('/:id',[jwtAuthenticate,validarCurso],procesarErrores((req,res)=>{
   
    const curso = req.body;

    const idCursoRecibido = req.params.id;

    return cursosController.grabarCurso({curso:curso, id:idCursoRecibido}) // paso los parámetros como un objeto, es otra forma de pasar parametros cuando uno o mas son opcionales. Aqui se aplica porque grabarCurso puede recibir o no el id segúns sea una modificación o un alta 
    .then((respuesta)=>{
        log.info(`Se modifica el curso ${respuesta.nro_curso}`);
        log.info(`Curso modificado ${JSON.stringify(respuesta)}`);
        res.status(200).json(respuesta)
        }
    )

}))

cursoRouter.put('/calificaciones/observaciones/:id',[jwtAuthenticate],procesarErrores((req,res)=>{
   
    const {observaciones} = req.body;

    const idCursoRecibido = req.params.id;
    log.info(`OBSERVACIONES TEST${JSON.stringify(req.body)} es el usuario que hace el request`)

    return cursosController.grabarObservacionesCurso(idCursoRecibido,observaciones) // paso los parámetros como un objeto, es otra forma de pasar parametros cuando uno o mas son opcionales. Aqui se aplica porque grabarCurso puede recibir o no el id segúns sea una modificación o un alta 
    .then((respuesta)=>{
        res.status(200).json(respuesta)
        }
    )

}))

cursoRouter.put('/calificaciones/:id/:id_alumno/:id_usuario',[jwtAuthenticate,
                                                  transformarYvalidarCalificaciones],
    procesarErrores((req,res)=>{
   
    const calificaciones = req.body;

    log.info(JSON.stringify(calificaciones))
    const idCursoRecibido = req.params.id;
    const id_alumno = req.params.id_alumno;
    const id_usuario = req.params.id_usuario;

    return cursosController.grabarCalificaciones(idCursoRecibido, id_alumno,id_usuario, calificaciones) 
    .then((respuesta)=>{
        res.status(200).json(respuesta)
        }
    )

}))

module.exports = cursoRouter;