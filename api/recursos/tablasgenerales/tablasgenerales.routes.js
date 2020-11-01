const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const jwtAuthenticate = passport.authenticate('jwt',{session:false});
const procesarErrores = require('./../../libs/errorHandler').procesarErrores;
const log = require('../../../utils/logger');
const tablasgeneralesController = require('../../recursos/tablasgenerales/tablasgenerales.controller')
const config = require('./../../../config')
const tablasgeneralesRouter = express.Router();
const ParametrosEntradaIncompletos = require('./tablasgenerales.errors').ParametrosEntradaIncompletos;
const DatosRepetidos = require('./tablasgenerales.errors').DatosRepetidos;
const validarCuatrimestre = require('./tablasgenerales.validate').validarCuatrimestre;
const validarInstrumento = require('./tablasgenerales.validate').validarInstrumento;
const validarInstrumentoRepetido = require('./tablasgenerales.validate').validarInstrumentoRepetido;
const validarAulaRepetida = require('./tablasgenerales.validate').validarAulaRepetida;
const validarAula = require('./tablasgenerales.validate').validarAula;
const validarCuatrimestreRepetido = require('./tablasgenerales.validate').validarCuatrimestreRepetido;
const validarMateria = require('./tablasgenerales.validate').validarMateria;
const validarMateriaRepetida = require('./tablasgenerales.validate').validarMateriaRepetida;

const hacerBackupsAntesIniciliazacionMaterias = (req,res,next)=>{
    const id = req.params.id;

    tablasgeneralesController.obtenerMateriasCorrelativas(id)
    .then(respuesta=>{
        const materias = respuesta.recordset;

        log.info(`BACKUP de materias correlativas de la materia ${id} antes de borrado por inicialización de materias correlativas ${JSON.stringify(materias)}`)  
        next()

    }).catch(err=>{
        log.error(err)
        res.status(500).send({message:'Error al ejecutar respaldo de datos de materias correlativas antes de einicialización'})
    })
}

const inicializarMateriasCorrelativas = (req,res,next)=>{
    const id = req.params.id;

    tablasgeneralesController.inicializarMateriasCorrelativas(id)
    .then(respuesta=>{
        log.info(`Se borraron las materias correlativas de la materia ${id}`)  
        next()

    }).catch(err=>{
        log.error(err)
        res.status(500).send({message:'Error al borrar materias correlativas'})
    })
}

tablasgeneralesRouter.get('/',jwtAuthenticate,procesarErrores((req,res)=>{

    return tablasgeneralesController.obtenerAlumnos()
    .then(alumnos=>{
        res.status(200).json(alumnos.recordset)
    })
}))

tablasgeneralesRouter.get('/materias',jwtAuthenticate,procesarErrores((req,res)=>{

    return tablasgeneralesController.obtenerMaterias()
    .then(materias=>{
        res.status(200).json(materias.recordset)
    })
}))

tablasgeneralesRouter.get('/profesores',jwtAuthenticate,procesarErrores((req,res)=>{

    return tablasgeneralesController.obtenerProfesores()
    .then(profesores=>{
        res.status(200).json(profesores.recordset)
    })
}))

tablasgeneralesRouter.get('/cuatrimestres',jwtAuthenticate,procesarErrores((req,res)=>{

    return tablasgeneralesController.obtenerCuatrimestres()
    .then(cuatrimestres=>{
        res.status(200).json(cuatrimestres.recordset)
    })
}))

tablasgeneralesRouter.put('/cuatrimestre/:id',[jwtAuthenticate,validarCuatrimestre,validarCuatrimestreRepetido],procesarErrores((req,res)=>{

    const cuatrimestre = req.body;
    const id = req.params.id;

    return tablasgeneralesController.grabarCuatrimestre({cuatrimestre:cuatrimestre,id:id})
    .then((respuesta)=>{
        log.info(`Se modifica el cuatrimestre ${respuesta.id_cuatrimestre}`);
        log.info(`Cuatrimestre modificado ${JSON.stringify(respuesta)}`);
        res.status(200).json(respuesta.recordset[0])
        }
    )
}))

tablasgeneralesRouter.post('/cuatrimestre/',[jwtAuthenticate,validarCuatrimestre,validarCuatrimestreRepetido],procesarErrores((req,res)=>{

    const cuatrimestre = req.body;
    return tablasgeneralesController.grabarCuatrimestre({cuatrimestre:cuatrimestre})
    .then((respuesta)=>{
        log.info(`Se crea el cuatrimestre ${respuesta.id_cuatrimestre}`);
        log.info(`Cuatrimestre creado ${JSON.stringify(respuesta)}`);
        res.status(200).json(respuesta.recordset[0])
        }
    )
}))

tablasgeneralesRouter.get('/tiposcursos',jwtAuthenticate,procesarErrores((req,res)=>{

    return tablasgeneralesController.obtenerTiposCursos()
    .then(tipos=>{
        res.status(200).json(tipos.recordset)
    })
}))

tablasgeneralesRouter.get('/nivelesi',jwtAuthenticate,procesarErrores((req,res)=>{

    return tablasgeneralesController.obtenerNivelesI()
    .then(tipos=>{
        res.status(200).json(tipos.recordset)
    })
}))

tablasgeneralesRouter.get('/permisosusuario',jwtAuthenticate,procesarErrores((req,res)=>{

    return tablasgeneralesController.obtenerPermisosUsuarios()
    .then(permisos=>{
        res.status(200).json(permisos.recordset)
    })
}))

tablasgeneralesRouter.get('/tiposusuario',jwtAuthenticate,procesarErrores((req,res)=>{

    return tablasgeneralesController.obtenerTiposUsuarios()
    .then(tipos=>{
        res.status(200).json(tipos.recordset)
    })
}))

tablasgeneralesRouter.get('/nivelese',jwtAuthenticate,procesarErrores((req,res)=>{

    return tablasgeneralesController.obtenerNivelesE()
    .then(tipos=>{
        res.status(200).json(tipos.recordset)
    })
}))

tablasgeneralesRouter.get('/encabezados',jwtAuthenticate,procesarErrores((req,res)=>{

    return tablasgeneralesController.obtenerEncabezados()
    .then(tipos=>{
        res.status(200).json(tipos.recordset)
    })
}))

tablasgeneralesRouter.get('/regimenes/:encabezado',jwtAuthenticate,procesarErrores((req,res)=>{
    const id = req.params.encabezado;

    return tablasgeneralesController.obtenerRegimenesPorEncabezado(id)
    .then(tipos=>{
        res.status(200).json(tipos.recordset)
    })
}))

tablasgeneralesRouter.get('/regimenesall',jwtAuthenticate,procesarErrores((req,res)=>{
// uso otra ruta porque si usara regimenes/all tomaría como la otra ruta considerando a /all como un id
    return tablasgeneralesController.obtenerRegimenes()
    .then(tipos=>{
        res.status(200).json(tipos.recordset)
    })
}))

tablasgeneralesRouter.get('/paises',jwtAuthenticate,procesarErrores((req,res)=>{
    return tablasgeneralesController.obtenerPaises()
    .then(paises=>{
        res.status(200).json(paises.recordset)
    })
}))

tablasgeneralesRouter.get('/provincias/all',jwtAuthenticate,procesarErrores((req,res)=>{
    return tablasgeneralesController.obtenerProvinciasAll()
    .then(provincias=>{
        res.status(200).json(provincias.recordset)
    })
}))

tablasgeneralesRouter.get('/nacionalidades',jwtAuthenticate,procesarErrores((req,res)=>{
    return tablasgeneralesController.obtenerNacionalidades()
    .then(nacionalidades=>{
        res.status(200).json(nacionalidades.recordset)
    })
}))

tablasgeneralesRouter.get('/dias',jwtAuthenticate,procesarErrores((req,res)=>{
    return tablasgeneralesController.obtenerDias()
    .then(tipos=>{
        res.status(200).json(tipos.recordset)
    })
}))

tablasgeneralesRouter.get('/instrumentos',jwtAuthenticate,procesarErrores((req,res)=>{
    return tablasgeneralesController.obtenerInstrumentos()
    .then(instrumentos=>{
        res.status(200).json(instrumentos.recordset)
    })
}))

tablasgeneralesRouter.get('/instrumento/:id',jwtAuthenticate,procesarErrores((req,res)=>{
    const id=req.params.id;

    return tablasgeneralesController.obtenerInstrumento(id)
    .then(instrumento=>{
        res.status(200).json(instrumento.recordset[0])
    })
}))

tablasgeneralesRouter.put('/instrumento/:id',[jwtAuthenticate,validarInstrumento,validarInstrumentoRepetido],procesarErrores((req,res)=>{

    const instrumento = req.body;
    const id = req.params.id;

    return tablasgeneralesController.grabarInstrumento({instrumento:instrumento,id:id})
    .then((respuesta)=>{
        log.info(`Se modifica el instrumento ${respuesta.id_instrumento}`);
        log.info(`Curso modificado ${JSON.stringify(respuesta)}`);
        res.status(200).json(respuesta.recordset[0])
        }
    )
}))

tablasgeneralesRouter.post('/instrumento/',[jwtAuthenticate,validarInstrumento,validarInstrumentoRepetido],procesarErrores((req,res)=>{

    const instrumento = req.body;
    return tablasgeneralesController.grabarInstrumento({instrumento:instrumento})
    .then((respuesta)=>{
        log.info(`Se crea el instrumento ${respuesta.id_instrumento}`);
        log.info(`Instrumento creado ${JSON.stringify(respuesta)}`);
        res.status(200).json(respuesta.recordset[0])
        }
    )
}))


tablasgeneralesRouter.get('/aulas',jwtAuthenticate,procesarErrores((req,res)=>{
    return tablasgeneralesController.obtenerAulas()
    .then(tipos=>{
        res.status(200).json(tipos.recordset)
    })
}))

tablasgeneralesRouter.get('/aula/:id',jwtAuthenticate,procesarErrores((req,res)=>{
    const id=req.params.id;

    return tablasgeneralesController.obtenerAula(id)
    .then(aula=>{
        res.status(200).json(aula.recordset[0])
    })
}))

tablasgeneralesRouter.put('/aula/:id',[jwtAuthenticate,validarAula,validarAulaRepetida],procesarErrores((req,res)=>{

    const aula = req.body;
    const id = req.params.id;

    return tablasgeneralesController.grabarAula({aula:aula,id:id})
    .then((respuesta)=>{
        log.info(`Se modifica el aula ${respuesta.id_aula}`);
        log.info(`Aula modificada ${JSON.stringify(respuesta)}`);
        res.status(200).json(respuesta.recordset[0])
        }
    )
}))

tablasgeneralesRouter.post('/aula/',[jwtAuthenticate,validarAula,validarAulaRepetida],procesarErrores((req,res)=>{

    const aula = req.body;
    return tablasgeneralesController.grabarAula({aula:aula})
    .then((respuesta)=>{
        log.info(`Se crea el aula ${respuesta.id_aula}`);
        log.info(`Aula creada ${JSON.stringify(respuesta)}`);
        res.status(200).json(respuesta.recordset[0])
        }
    )
}))

tablasgeneralesRouter.post('/materia/',[jwtAuthenticate,validarMateria,validarMateriaRepetida],procesarErrores((req,res)=>{

    const materia = req.body;
    return tablasgeneralesController.grabarMateria({materia:materia})
    .then((respuesta)=>{
        log.info(`Se crea la materia ${respuesta.id_materia}`);
        log.info(`Materia creada ${JSON.stringify(respuesta)}`);
        res.status(200).json(respuesta.recordset[0])
        }
    )
}))

tablasgeneralesRouter.put('/materia/:id',[jwtAuthenticate,validarMateria,validarMateriaRepetida],procesarErrores((req,res)=>{

    const materia = req.body;
    const id = req.params.id;

    return tablasgeneralesController.grabarMateria({materia:materia,id:id})
    .then((respuesta)=>{
        log.info(`Se modifica la materia ${respuesta.id_materia}`);
        log.info(`Materia modificada ${JSON.stringify(respuesta)}`);
        res.status(200).json(respuesta.recordset[0])
        }
    )
}))

tablasgeneralesRouter.post('/materiascorrelativas/:id',
        [jwtAuthenticate,
         hacerBackupsAntesIniciliazacionMaterias,
         inicializarMateriasCorrelativas], (req,res)=>{

    const materias = req.body.materias;

    const id = req.params.id;
    let contadorM = 0;
    const totalM = materias.length;

    log.info(`Comenzando a grabar materias correlativas ${JSON.stringify(materias)}`)

    try{

       // res.status(200).send("Se grabaron todos los instrumentos y materias aprobadas del alumno")

        materias.forEach((item,index)=>{
            log.info(JSON.stringify(item))
            tablasgeneralesController.grabarMateriaCorrelativa(id,item.id_materia)
            contadorM++;
         })

        res.status(200).send("Se grabaron todas las materias correlativas")

    }catch(err){
        log.error(err)
        res.status(500).send({message:`Error al grabar las materias correlativas. Se grabaron ${contadorM} de ${totalM} materias aprobadas`})
    }
})

tablasgeneralesRouter.get('/materia/:id',jwtAuthenticate,procesarErrores((req,res)=>{
    const id=req.params.id;

    return tablasgeneralesController.obtenerMateria(id)
    .then(materia=>{
        res.status(200).json(materia.recordset[0])
    })
}))

tablasgeneralesRouter.get('/cuatrimestre/:id',jwtAuthenticate,procesarErrores((req,res)=>{
    const id=req.params.id;

    return tablasgeneralesController.obtenerCuatrimestre(id)
    .then(cuatrimestre=>{
        res.status(200).json(cuatrimestre.recordset[0])
    })
}))

tablasgeneralesRouter.get('/materias/correlativas/:id',jwtAuthenticate,procesarErrores((req,res)=>{
    const id=req.params.id;

    return tablasgeneralesController.obtenerMateriasCorrelativas(id)
    .then(correlativas=>{
        res.status(200).json(correlativas.recordset)
    })
}))

tablasgeneralesRouter.get('/estadisticas/contar/inscriptosall/:id',jwtAuthenticate,procesarErrores((req,res)=>{
    const id=req.params.id;

    return tablasgeneralesController.obtenerInscriptosPorCuatrimestre(id) 
    .then(estadisticas=>{
        res.status(200).json(Object.values(estadisticas.recordset[0])[0])
    })
}))

tablasgeneralesRouter.get('/estadisticas/contar/inscriptossexo/:id/:sexo',jwtAuthenticate,procesarErrores((req,res)=>{
    const id=req.params.id;
    const sexo=req.params.sexo;

    return tablasgeneralesController.obtenerInscriptosPorCuatrimestrePorSexo(id,sexo)
    .then(estadisticas=>{
        // el stored me devuelve un select count y llega como un recordset tipo [{'':500}]
        // En lugar de reescribir el stored tomo el primer elemento del recordset que es un objeto
        // lo transformo a array con Object.values y tomo el primer elemento

        res.status(200).json(Object.values(estadisticas.recordset[0])[0])
    })
}))

tablasgeneralesRouter.get('/estadisticas/contar/materias/:id',jwtAuthenticate,procesarErrores((req,res)=>{
    const id=req.params.id;
// el stored me devuelve un select count y llega como un recordset tipo [{'':500}]
// En lugar de reescribir el stored tomo el primer elemento del recordset que es un objeto
// lo transformo a array con Object.values y tomo el primer elemento
    return tablasgeneralesController.obtenerTotalMateriasDictadas(id)
    .then(estadisticas=>{
        res.status(200).json(Object.values(estadisticas.recordset[0])[0])
    })
}))

tablasgeneralesRouter.get('/estadisticas/contar/cursos/:id',jwtAuthenticate,procesarErrores((req,res)=>{
    const id=req.params.id;
// el stored me devuelve un select count y llega como un recordset tipo [{'':500}]
// En lugar de reescribir el stored tomo el primer elemento del recordset que es un objeto
// lo transformo a array con Object.values y tomo el primer elemento
    return tablasgeneralesController.obtenerTotalCursosAbiertos(id)
    .then(estadisticas=>{
        res.status(200).json(Object.values(estadisticas.recordset[0])[0])
    })
}))

tablasgeneralesRouter.get('/estadisticas/contar/profesores/:id',jwtAuthenticate,procesarErrores((req,res)=>{
    const id=req.params.id;
// el stored me devuelve un select count y llega como un recordset tipo [{'':500}]
// En lugar de reescribir el stored tomo el primer elemento del recordset que es un objeto
// lo transformo a array con Object.values y tomo el primer elemento
    return tablasgeneralesController.obtenerTotalProfesores(id)
    .then(estadisticas=>{
        res.status(200).json(Object.values(estadisticas.recordset[0])[0])
    })
}))

tablasgeneralesRouter.get('/estadisticas/profesor/alumnos/:id/:id_prof',jwtAuthenticate,procesarErrores((req,res)=>{
    const id=req.params.id;
    const id_prof=req.params.id_prof;
        // el stored me devuelve un select count y llega como un recordset tipo [{'':500}]
        // En lugar de reescribir el stored tomo el primer elemento del recordset que es un objeto
        // lo transformo a array con Object.values y tomo el primer elemento
    return tablasgeneralesController.obtenerAlumnosPorProfesor(id,id_prof)
    .then(estadisticas=>{
        res.status(200).json(Object.values(estadisticas.recordset[0])[0])
    })
}))

tablasgeneralesRouter.get('/estadisticas/profesor/materias/:id/:id_prof',jwtAuthenticate,procesarErrores((req,res)=>{
    const id=req.params.id;
    const id_prof=req.params.id_prof;
        // el stored me devuelve un select count y llega como un recordset tipo [{'':500}]
        // En lugar de reescribir el stored tomo el primer elemento del recordset que es un objeto
        // lo transformo a array con Object.values y tomo el primer elemento
    return tablasgeneralesController.obtenerMateriasPorProfesor(id,id_prof)
    .then(estadisticas=>{
        res.status(200).json(Object.values(estadisticas.recordset[0])[0])
    })
}))


tablasgeneralesRouter.get('/estadisticas/profesor/cursos/:id/:id_prof',jwtAuthenticate,procesarErrores((req,res)=>{
    const id=req.params.id;
    const id_prof=req.params.id_prof;
        // el stored me devuelve un select count y llega como un recordset tipo [{'':500}]
        // En lugar de reescribir el stored tomo el primer elemento del recordset que es un objeto
        // lo transformo a array con Object.values y tomo el primer elemento
    return tablasgeneralesController.obtenerCursosPorProfesor(id,id_prof)
    .then(estadisticas=>{
        res.status(200).json(Object.values(estadisticas.recordset[0])[0])
    })
}))

tablasgeneralesRouter.get('/estadisticas/materia/profesores/:id/:id_materia',jwtAuthenticate,procesarErrores((req,res)=>{
    const id=req.params.id;
    const id_materia=req.params.id_materia;
        // el stored me devuelve un select count y llega como un recordset tipo [{'':500}]
        // En lugar de reescribir el stored tomo el primer elemento del recordset que es un objeto
        // lo transformo a array con Object.values y tomo el primer elemento
    return tablasgeneralesController.obtenerProfesoresPorMateria(id,id_materia)
    .then(estadisticas=>{
        res.status(200).json(Object.values(estadisticas.recordset[0])[0])
    })
}))

tablasgeneralesRouter.get('/estadisticas/materia/alumnos/:id/:id_materia',jwtAuthenticate,procesarErrores((req,res)=>{
    const id=req.params.id;
    const id_materia=req.params.id_materia;
        // el stored me devuelve un select count y llega como un recordset tipo [{'':500}]
        // En lugar de reescribir el stored tomo el primer elemento del recordset que es un objeto
        // lo transformo a array con Object.values y tomo el primer elemento
    return tablasgeneralesController.obtenerAlumnosPorMateria(id,id_materia)
    .then(estadisticas=>{
        res.status(200).json(Object.values(estadisticas.recordset[0])[0])
    })
}))

tablasgeneralesRouter.get('/estadisticas/materia/cursos/:id/:id_materia',jwtAuthenticate,procesarErrores((req,res)=>{
    const id=req.params.id;
    const id_materia=req.params.id_materia;
        // el stored me devuelve un select count y llega como un recordset tipo [{'':500}]
        // En lugar de reescribir el stored tomo el primer elemento del recordset que es un objeto
        // lo transformo a array con Object.values y tomo el primer elemento

    return tablasgeneralesController.obtenerCursosPorMateria(id,id_materia)
    .then(estadisticas=>{
        res.status(200).json(Object.values(estadisticas.recordset[0])[0])
    })
}))

tablasgeneralesRouter.get('/estadisticas/comparativas/:periodo1/:periodo2/:orden',procesarErrores((req,res)=>{
    const periodo1=req.params.periodo1;
    const periodo2=req.params.periodo2;
    const orden=req.params.orden;

    return tablasgeneralesController.obtenerComparativasInscripcion(periodo1,periodo2,Number(orden))
    .then(estadisticas=>{
        res.status(200).json(estadisticas.recordset)
    })
}))

tablasgeneralesRouter.get('/estadisticas/inscripciones/:id',jwtAuthenticate,procesarErrores((req,res)=>{
    const id=req.params.id;

    return tablasgeneralesController.obtenerInscrpcionesPorCuatrimestre(id)
    .then(estadisticas=>{
        res.status(200).json(estadisticas.recordset)
    })
}))

tablasgeneralesRouter.get('/estadisticas/alumnospais/:id',jwtAuthenticate,procesarErrores((req,res)=>{
    const id=req.params.id;

    return tablasgeneralesController.obtenerAlumnosPorPais(id)
    .then(estadisticas=>{
        res.status(200).json(estadisticas.recordset)
    })
}))

tablasgeneralesRouter.get('/estadisticas/alumnosprovincia/:id/:id_pais',jwtAuthenticate,procesarErrores((req,res)=>{
    const id=req.params.id;
    const id_pais=req.params.id_pais;

    return tablasgeneralesController.obtenerAlumnosPorProvincia(id,id_pais)
    .then(estadisticas=>{
        res.status(200).json(estadisticas.recordset)
    })
}))

module.exports = tablasgeneralesRouter;

