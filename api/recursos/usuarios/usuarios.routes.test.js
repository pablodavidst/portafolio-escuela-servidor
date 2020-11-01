let request = require('supertest');
let app = require('../../../index').app;
let server = require('../../../index').server;
let config = require('../../../config');

describe('Usuarios',()=>{ // inicio callback tests Usuarios

    describe('GET /usuarios/login',()=>{ // inicio callback test ruta GET /usuarios/login

        const usuarioPrueba = {
            username:'jodos',
            password:'123456'
        }
        test('Si el usuario y password son correctos debería generar status 200 y devolver un json con los datos del usuario',(done)=>{
            request(app)
            .post('/usuarios/login')
            .send(usuarioPrueba)
            .end((err,res)=>{
                expect(res.status).toBe(200);
                expect(res.body).toBeInstanceOf(Object);
                expect(res.body[0].nombre).includes('jodos').toBe(true);
                done();
            })
        })

    }) // inicio callback test ruta GET /usuarios)
  }) // fin callback tests usuarios
