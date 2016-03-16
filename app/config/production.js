
/*
|--------------------------------------------------------------------------
| Application Config (Production)
|--------------------------------------------------------------------------
*/

exports = module.exports = {


    /*
    |--------------------------------------------------------------------------
    | Database
    |--------------------------------------------------------------------------
    */
    
    db: {
        host     : 'localhost',
        user     : process.env.DATABASE_USERNAME,
        password : process.env.DATABASE_PASSWORD,
        database : process.env.DATABASE
    }

}
