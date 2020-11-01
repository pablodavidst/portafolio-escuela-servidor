const sql = require('mssql')
const dbconfig = require('./../config').dbconfig
const log = require('./../utils/logger');

const config = {
 ...dbconfig
} 

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
   // console.log('Connected to MSSQL')
    return pool
  })
  .catch(err => 
    log.error(`Database Connection Failed! Bad Config: ${err}`))

module.exports = {
  sql, poolPromise
}

/*const sql = require('mssql/msnodesqlv8')
const dbconfig = require('./../config').dbconfig
const log = require('./../utils/logger');

const config = {
 ...dbconfig
} 

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    return pool
  })
  .catch(err => 
    log.error(`Database Connection Failed! Bad Config: ${err}`))

module.exports = {
  sql, poolPromise
}
*/