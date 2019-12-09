require('dotenv').config();
const mysql = require('mysql')




const dropAllTables = () => {

    if (process.env.JAWSDB_URL) {
        // Database is JawsDB on Heroku
        connection = mysql.createConnection(process.env.JAWSDB_URL)
    } else {
        connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'testdb',

        });

    }



    // open the connection
    connection.connect((error) => {


        if (error) {
            console.error(error);
        } else {

            let dropLQ3Table = 'DROP TABLE IF EXISTS `LQ 3`'
            let dropLQ2Table = 'DROP TABLE IF EXISTS `LQ 2`'
            let dropLQ1Table = 'DROP TABLE IF EXISTS `LQ 1`'

            let dropCD1Table = 'DROP TABLE IF EXISTS `CD 1`'
            let dropCD2Table = 'DROP TABLE IF EXISTS `CD 2`'
            let dropCD3Table = 'DROP TABLE IF EXISTS `CD 3`'


            // Drops table if exsist 
            connection.query(dropLQ3Table, (error, response) => {
                console.log("bottom" + connection.query)
                console.log(error || response);
            });
            // Drops table if exsist 
            connection.query(dropLQ2Table, (error, response) => {
                console.log("bottom" + connection.query)
                console.log(error || response);
            });

            // Drops table if exsist 
            connection.query(dropLQ1Table, (error, response) => {
                console.log("bottom" + connection.query)
                console.log(error || response);
            });


            // Drops table if exsist 
            connection.query(dropCD1Table, (error, response) => {
                console.log("bottom" + connection.query)
                console.log(error || response);
            });

            // Drops table if exsist 
            connection.query(dropCD2Table, (error, response) => {
                console.log("bottom" + connection.query)
                console.log(error || response);
            });

            // Drops table if exsist 
            connection.query(dropCD3Table, (error, response) => {
                console.log("bottom" + connection.query)
                console.log(error || response);
            });
        }

    });
}

module.exports = dropAllTables;
