const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const jwtAuthenticate = passport.authenticate('jwt',{session:false});
const procesarErrores = require('./../../libs/errorHandler').procesarErrores;
const log = require('../../../utils/logger');
const alumnosController = require('../../recursos/alumnos/alumnos.controller')
const config = require('./../../../config')
const alumnoRouter = express.Router();
const ParametrosEntradaIncompletos = require('./alumnos.errors').ParametrosEntradaIncompletos;
const ErrorBackup = require('./alumnos.errors').ErrorBackup;
const ErrorInicializacion = require('./alumnos.errors').ErrorInicializacion;
const ErrorInstMaterias = require('./alumnos.errors').ErrorInstMaterias;


const validarAlumno = require('./alumnos.validate').validarAlumno;



const inicializarInstrumentosYmateriasAlumno = (req,res,next)=>{
    const id = req.params.id;

    alumnosController.inicializarInstrumentosYmateriasAlumno(id)
    .then(respuesta=>{
        log.info(`Se borraron las materias, niveles e instrumentos del alumno ${id}`)  
        next()

    }).catch(err=>{
        log.error(err)
        res.status(500).send({message:'Error al ejecutar respaldo de datos de instrumentos del alumno antes de reinicialización'})
    })
}

const hacerBackupsAntesIniciliazacionInstrumentos = (req,res,next)=>{
    const id = req.params.id;

    alumnosController.obtenerInstrumentosAlumnoBackup(id)
    .then(respuesta=>{
        console.log('%%%%%%%%%%%%%',respuesta)
        const instrumentos = respuesta.recordset;

        log.info(`BACKUP de instrumentos y niveles antes de borrado por inicialización alumno ${id} ${JSON.stringify(instrumentos)}`)  
        next()
    }).catch(err=>{
        log.error(err)
        res.status(500).send({message:'Error al ejecutar respaldo de datos de instrumentos del alumno antes de reinicialización'})
    })
}

const hacerBackupsAntesIniciliazacionMaterias = (req,res,next)=>{
    const id = req.params.id;

    alumnosController.obtenerMateriasAprobadasTestAlumno(id)
    .then(respuesta=>{
        const materias = respuesta.recordset;

        log.info(`BACKUP de materias aprobadas antes de borrado por inicialización alumno ${id} ${JSON.stringify(materias)}`)  
        next()

    }).catch(err=>{
        log.error(err)
        res.status(500).send({message:'Error al ejecutar respaldo de datos de materias aprobadas antes de reinicialización'})
    })
}

alumnoRouter.get('/all/:activo',jwtAuthenticate,procesarErrores((req,res)=>{
    let activos = req.params.activo

    if (!activos){
        activos = 1;
    }else{ // el 1 o cero viene como string, tengo que pasarlo a numero o a boolean para que se interprete como bit
        if (activos=="1"){
            activos = 1;
        }else{
            activos = 0;
        }
    }

    return alumnosController.obtenerAlumnos(activos)
    .then(alumnos=>{
        res.status(200).json(alumnos.recordset)
    })
}))

alumnoRouter.get('/listaplus/:incluir',jwtAuthenticate,procesarErrores((req,res)=>{
    let incluir = req.params.incluir

    console.log('*****',incluir)
    return alumnosController.obtenerListaAlumnosPlus(incluir)
    .then(alumnos=>{
        res.status(200).json(alumnos.recordset)
    })
}))

alumnoRouter.get('/inactivos',jwtAuthenticate,procesarErrores((req,res)=>{

    return alumnosController.obtenerAlumnosInactivos()
    .then(alumnos=>{
        res.status(200).json(alumnos.recordset)
    })
}))

alumnoRouter.get('/egresados',jwtAuthenticate,procesarErrores((req,res)=>{

    return alumnosController.obtenerAlumnosEgresados()
    .then(alumnos=>{
        res.status(200).json(alumnos.recordset)
    })
}))

alumnoRouter.get('/alertas/:id/:materia',procesarErrores((req,res)=>{

    const id_alumno = req.params.id;
    const id_materia = req.params.materia;


    if (!id_alumno || !id_materia){
        throw new ParametrosEntradaIncompletos('Falta especificar id de alumno o id de materia')
    }
    
    return alumnosController.obtenerAlertasAlumno(id_alumno,id_materia)
    .then(alertas=>{
        res.status(200).json(alertas.recordset)
    })
}))

alumnoRouter.get('/instrumentos/:id',jwtAuthenticate,procesarErrores((req,res)=>{

    const id_alumno = req.params.id;

    if (!id_alumno){
        throw new ParametrosEntradaIncompletos('Falta especificar id de alumno')
    }
    
    return alumnosController.obtenerInstrumentosAlumno(id_alumno)
    .then(instrumentos=>{
        res.status(200).json(instrumentos.recordset)
    })
}))

alumnoRouter.get('/materiastest/:id',jwtAuthenticate,procesarErrores((req,res)=>{

    const id_alumno = req.params.id;

    if (!id_alumno){
        throw new ParametrosEntradaIncompletos('Falta especificar id de alumno')
    }
    
    return alumnosController.obtenerMateriasAprobadasTestAlumno(id_alumno)
    .then(materiasTest=>{
        res.status(200).json(materiasTest.recordset)
    })
}))

alumnoRouter.get('/analitico/parcial/:id',jwtAuthenticate,procesarErrores((req,res)=>{

    const id_alumno = req.params.id;

    if (!id_alumno){
        throw new ParametrosEntradaIncompletos('Falta especificar id de alumno')
    }
    
    return alumnosController.obtenerCursosAnaliticoParcialAlumno(id_alumno)
    .then(cursos=>{
        res.status(200).json(cursos.recordset)
    })
}))

alumnoRouter.get('/analitico/final/:id',jwtAuthenticate,procesarErrores((req,res)=>{

    const id_alumno = req.params.id;

    if (!id_alumno){
        throw new ParametrosEntradaIncompletos('Falta especificar id de alumno')
    }
    
    return alumnosController.obtenerCursosAnaliticoFinalAlumno(id_alumno)
    .then(cursos=>{
        res.status(200).json(cursos.recordset)
    })
}))

alumnoRouter.get('/altasrecientes',jwtAuthenticate,procesarErrores((req,res)=>{

    return alumnosController.obtenerUltimasAltas()
    .then(alumnos=>{
        res.status(200).json(alumnos.recordset)
    })
}))

alumnoRouter.get('/cambiosstatus',jwtAuthenticate,procesarErrores((req,res)=>{

    return alumnosController.obtenerUltimosCambiosStatus()
    .then(cambios=>{
        res.status(200).json(cambios.recordset)
    })
}))

alumnoRouter.get('/status/:id',jwtAuthenticate,procesarErrores((req,res)=>{
    const id = req.params.id;

    return alumnosController.obtenerStatusAlumno(id)
    .then(status=>{
        res.status(200).json(status.recordset[0])
    })
}))

alumnoRouter.get('/historialm/:id_alumno/:id_materia',jwtAuthenticate,procesarErrores((req,res)=>{
    const id_alumno = req.params.id_alumno;
    const id_materia = req.params.id_materia;

    return alumnosController.obtenerHistorialMateria(id_alumno,id_materia)
    .then(status=>{
        res.status(200).json(status.recordset)
    })
}))



alumnoRouter.post('/',[jwtAuthenticate,validarAlumno],procesarErrores((req,res)=>{

    
    const alumno = req.body.datosgenerales;
    return alumnosController.grabarAlumno({alumno:alumno})
    .then((respuesta)=>{
        log.info(`Se crea el alumno ${respuesta.id_alumno}`);
        log.info(`Alumno creado ${JSON.stringify(respuesta)}`);
        res.status(200).json(respuesta.recordset[0])
        }
    )
}))

alumnoRouter.post('/instrumentosmaterias/:id',
        [jwtAuthenticate,
         hacerBackupsAntesIniciliazacionInstrumentos,
         hacerBackupsAntesIniciliazacionMaterias,
         inicializarInstrumentosYmateriasAlumno], (req,res)=>{

    const instrumentos = req.body.instrumentos;
    const materias = req.body.materias;

    const id = req.params.id;
    let contadorI = 0;
    let contadorM = 0;
    const totalI = instrumentos.length;
    const totalM = materias.length;

    log.info(`Comenzando a grabar instrumentos y materias del alumno ${JSON.stringify(instrumentos)} ${JSON.stringify(materias)}`)

    try{

       // res.status(200).send("Se grabaron todos los instrumentos y materias aprobadas del alumno")

        instrumentos.forEach((item,index)=>{
           log.info(JSON.stringify(item))
           alumnosController.grabarInstrumentosAlumno(id,item.id_instrumento,item.id_nivel_instrumental,item.id_nivel_ensamble)
           contadorI++;
        })

        materias.forEach((item,index)=>{
            log.info(JSON.stringify(item))
            alumnosController.grabarMateriasAprobadasAlumno(id,item.id_materia)
            contadorM++;
         })

        res.status(200).send("Se grabaron todos los instrumentos y materias aprobadas del alumno")

    }catch(err){
        console.log('--7-7-7-7-7-',err)
        log.error(err)
        res.status(500).send({message:`Error al grabar los instrumentos y materias por alumno. Se grabaron ${contadorI} de ${totalI} instrumentos y ${contadorM} de ${totalM} materias aprobadas`})
    }
})

alumnoRouter.put('/test/:id',[jwtAuthenticate,validarAlumno],procesarErrores((req,res)=>{
   
    const alumno = req.body.datosgenerales;
    const materias = req.body.materias;
    const instrumentos = req.body.instrumentos;

    const idAlumnoRecibido = req.params.id;

    return alumnosController.grabarAlumno({alumno:alumno, id:idAlumnoRecibido}) // grabo datos grales
    .then((respuesta)=>{
        log.info(`Se modifica el alumno ${respuesta.id_alumno}`);
        log.info(`Alumno modificado ${JSON.stringify(respuesta)}`);
        res.status(200).json(respuesta.recordset[0])
    }) // fin .then grabarAlumno
})) // fin put

alumnoRouter.put('/:id',[jwtAuthenticate,validarAlumno],procesarErrores((req,res)=>{
   
    const alumno = req.body.datosgenerales;

    const idAlumnoRecibido = req.params.id;

    return alumnosController.grabarAlumno({alumno:alumno, id:idAlumnoRecibido}) // grabo datos grales
    .then((respuesta)=>{
        log.info(`Se modifica el alumno ${respuesta.id_alumno}`);
        log.info(`Alumno modificado ${JSON.stringify(respuesta)}`);
        res.status(200).json(respuesta.recordset[0])
    }) 
})) 

alumnoRouter.put('/egresar/:id/:usuario',[jwtAuthenticate],procesarErrores((req,res)=>{
   
    const idAlumnoRecibido = req.params.id;
    const id_usuario = req.params.usuario;

    log.info(`Se solicita egresar al alumno ${idAlumnoRecibido}`);

    return alumnosController.egresarAlumno(idAlumnoRecibido, id_usuario) // grabo datos grales
    .then(()=>{
        log.info(`Alumno egresado exitosamente ${idAlumnoRecibido}`);
        res.status(200).send('Alumno egresado exitosamente')
    }) 
})) 

alumnoRouter.put('/restaurar/:id/:usuario',[jwtAuthenticate],procesarErrores((req,res)=>{
   
    const idAlumnoRecibido = req.params.id;
    const id_usuario = req.params.usuario;

    log.info(`Se solicita restaurar como regular al alumno ${idAlumnoRecibido}`);

    return alumnosController.restaurarAlumno(idAlumnoRecibido,id_usuario) // grabo datos grales
    .then(()=>{
        log.info(`Alumno restaurado exitosamente ${idAlumnoRecibido}`);
        res.status(200).send('Alumno restaurado exitosamente')
    }) 
})) 

async function grabarMateriasInstrumentosNiveles(id,materias,instrumentos){
    try{
        const opMaterias= alumnosController.grabarMateriasAprobadasAlumno;
        const opInstrumentos=alumnosController.grabarInstrumentosAlumno;

        console.log(materias)
        console.log(instrumentos)

        materias.forEach(item=>{
            try{
                opMaterias(id,item.id_materia)
            }catch(err){
                throw new ErrorInstMaterias(err)
            }
        })

        instrumentos.forEach(item=>{
            try{
                opInstrumentos(id,item.id_instrumento,item.nivel_i,item.nivel_e)
            }catch(err){
                throw new ErrorInstMaterias(err)
            }
        })

    }catch(err){
        throw new ErrorInstMaterias()
    }
   

}

async function hacerBackupsAntesIniciliazacion(id){

    console.log('**************************',id)
    try{

        //const backupMaterias = alumnosController.obtenerMateriasAprobadasTestAlumno

        const instrumentos = await alumnosController.obtenerInstrumentosAlumnoBackup(id);

        log.info(`BACKUP de instrumentos y niveles antes de borrado por inicialización alumno ${id} ${JSON.stringify(instrumentos.recordset)}`)  

        const materias = await alumnosController.obtenerMateriasAprobadasTestAlumno(id);

        log.info(`BACKUP de materias aprobadas antes de borrado por inicialización alumno ${id} ${JSON.stringify(materias.recordset)}`)  

    }catch(err){
        log.error("/////&%$%&/((((()))·$·$·")
        throw new ErrorBackup(err)
    }

}


/*async function hacerBackupsAntesIniciliazacion(id){

    console.log('**************************',id)
    try{

        //const backupMaterias = alumnosController.obtenerMateriasAprobadasTestAlumno
        const backupInstrumentos = alumnosController.obtenerInstrumentosAlumnoBackup

        const pepe = await Promise.all[alumnosController.obtenerInstrumentosAlumnoBackup(id)];

        console.log('························',pepe)
       // log.info(`BACKUP de Materias aprobadas por test antes de borrado por inicialización alumno ${id} ${JSON.stringify(resultado[0].recordset)}`)  
        log.info(`BACKUP de instrumentos y niveles antes de borrado por inicialización alumno ${id} ${JSON.stringify(pepe[0].recordset)}`)  
    }catch(err){
        throw new ErrorBackup(err)
    }

}*/


alumnoRouter.get('/historial/:id/:cuatrimestreactualsino',jwtAuthenticate,procesarErrores((req,res)=>{

    const id_alumno = req.params.id;
    const cuatrimestreactualsino = Number(req.params.cuatrimestreactualsino);

    log.info("El cuatrimestre actual es " + cuatrimestreactualsino)
    if (!id_alumno){
        throw new ParametrosEntradaIncompletos('Falta especificar id de alumno')
    }
    
    return alumnosController.obtenerHistorialAlumno(id_alumno,cuatrimestreactualsino)
    .then(historial=>{
        res.status(200).json(historial.recordset)
    })
}))

alumnoRouter.get('/:id',(req,res)=>{
    const id = req.params.id;

    return alumnosController.obtenerAlumno(id)
    .then(alumno=>{
        res.status(200).json(alumno.recordset)
    })
})

module.exports = alumnoRouter;