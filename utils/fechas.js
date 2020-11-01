const moment = require('moment');

function transformarHoraMinutoAfechaSQL(hora,min){
        
    
    let fecha = moment({ year :1900, month :0, day :1, 
        hour :hora, minute :min, second:0, millisecond:0});

    return fecha.format('YYYY-MM-DD HH:mm:ss')
}

function transformarDiaMesAnioAfechaSQL(dia,mes,anio){
        
    
    let fecha = moment({ year :anio, month :mes-1, day :dia, 
        hour :0, minute :0, second:0, millisecond:0});

    return fecha.format('YYYY-MM-DD HH:mm:ss')
}

function fechasSolapadas(f_desde,f_hasta,fecha_a_comparar){
    
return fecha_a_comparar.isBetween(f_desde, f_hasta); 
}

module.exports = {transformarHoraMinutoAfechaSQL,transformarDiaMesAnioAfechaSQL,fechasSolapadas}