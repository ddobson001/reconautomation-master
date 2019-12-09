
const AWS = require('aws-sdk');
require('dotenv').config();
const csv = require('fast-csv');
const mysql = require('mysql')


let orginalHeaderDatas = [];

let updatedData = [];
let headerDatas = []
let headersWithProperties = [];
let myData = [];
let correctHeaderFormat = [];
//Headers from CSV is stored ind dataArr
let dataArr = [];
let dataArr2 = [];

// Credentials to connect to AWS Bucket
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESSKEYID,
    secretAccessKey: process.env.AWS_AMAZON_SECRET_KEY,
    region: 'us-east-2'
});

const params = {
    Bucket: 'lqrecon',
    Key: 'LQ2.csv',
};

const populateLqDb2 = () => {
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
    // Reads only Headers from CSV File
    const s3Stream = s3.getObject(params).createReadStream()
    stream = require('fast-csv').parseStream(s3Stream, {
        headers: true, skip_blanks: true
    })
        .on("data", data => {
            dataArr.push(data);

        })
    stream = require('fast-csv').parseStream(s3Stream)
        .on("data", data => {
            dataArr2.push(data);
        })

        .on("end", () => {

            let csvStream = csv
                .parse({ ignoreEmpty: true })
                .on('data', function (dataArr2) {
                    myData.push(dataArr2);

                })
                .on('end', function () {
                    dataArr2.shift();

                    console.log('dataArr2 ' + myData)


                    if (dataArr.length > 0) {

                        let columnsIn = dataArr[0];

                        for (let key in columnsIn) {
                            headerDatas.push(key)

                        }
                        for (let key in columnsIn) {
                            orginalHeaderDatas.push(key)
                        }

                        for (i = 0; i < headerDatas.length; i++) {
                            newData = headerDatas[i].split(' ').join('_');
                            correctHeaderFormat.push(newData)
                        }


                        // Assigns approriate Sql property to headers
                        let databaseId = headerDatas[0].split(' ').join('_');
                        let leaseDiscription = headerDatas[1].split(' ').join('_');
                        //Removes Headers that are not DEC propertys 
                        headerDatas.shift();
                        headerDatas.shift();

                        let newdatabaseId = databaseId + ' int(25) NOT NULL'

                        let newleaseDiscription = leaseDiscription + ' varchar(255) NULL'

                        //adds property to the end of the remaining headers in array
                        for (i = 0; i < headerDatas.length; i++) {
                            newData = headerDatas[i].split(' ').join('_') + ' dec(25,2) NULL';
                            updatedData.push(newData)
                        }

                        //Adds headers that were removed from array and primary key to updated array
                        let key = 'PRIMARY KEY (Database_ID)'
                        headersWithProperties.push(updatedData)
                        headersWithProperties.unshift(newleaseDiscription)
                        headersWithProperties.unshift(newdatabaseId)
                        headersWithProperties.push(key)
                    } else {
                        console.log('No columns');
                    }

                    // open the connection
                    connection.connect((error) => {


                        if (error) {
                            console.error(error);
                        } else {

                            let createTable = 'CREATE TABLE `LQ 2`' + '(' + headersWithProperties + ')'
                            let insertData = 'INSERT INTO `LQ 2` ' + '(' + correctHeaderFormat + ') ' + 'VALUES ?'

                            //create table
                            connection.query(createTable, (error, response) => {
                                console.log("bottom" + connection.query)
                                console.log(error || response);
                            });

                            //insert data
                            connection.query(insertData, [dataArr2], (error, response) => {
                                console.log("bottom" + connection.query)
                                console.log(error || response);
                            });

                        }

                    });
                });

            stream.pipe(csvStream);
        });

    //reset arrays so not to double values
    dataArr.length = 0
    orginalHeaderDatas.length = 0;
    updatedData.length = 0;
    headerDatas.length = 0;
    headersWithProperties.length = 0;
    myData.length = 0;
    correctHeaderFormat.length = 0;
    dataArr2.length = 0;

}

module.exports = populateLqDb2;


