const connection = require('../config/connection');
const excel = require('exceljs');
require('dotenv').config({path: '../.env'});
var Stream = require('stream');
  const AWS = require('aws-sdk');

   // Credentials to connect to AWS Bucket
   const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESSKEYID,
    secretAccessKey: process.env.AWS_AMAZON_SECRET_KEY,
    region: 'us-east-2'
  });
const exportResultMonth2 = () => {
  const reconQuery = 'SELECT T1.Database_ID, Lease_Description, SUM(BR_Current_Month_Cash - BR_Current_Month_Cash_Client) total, SUM(Total_Current_Month_Cash - Total_Current_Month_Cash_Client) total2 FROM `LQ 2` AS T1  INNER JOIN `CD 2` AS T2 ON T1.Database_ID = T2.Database_ID GROUP BY Database_ID'


  connection.query(reconQuery,
    function (err, reconQuery, field) {
console.log(err)
      const jsonReconData = JSON.parse(JSON.stringify(reconQuery));


   

const stream = new Stream.PassThrough();
const workbook = new excel.Workbook();
let worksheet = workbook.addWorksheet('Month 2'); //creating worksheet
     //  WorkSheet Header
  worksheet.columns = [
    { header: 'Database ID', key: 'Database_ID', width: 10 },
    { header: 'Lease Description', key: 'Lease_Description', width: 30 },
    { header: 'Base Rent Difference', key: 'total', width: 30},
      { header: 'Total Difference', key: 'total2', width: 30},
     
  ];
// Add Array Rows
worksheet.addRows(jsonReconData);

workbook.xlsx.write(stream)
    .then(() => {
        return s3.upload({
            Key: 'Month2.xlsx',
            Bucket: 'lqrecon',
            Body: stream,
            ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ACL: "public-read"

        }).promise();
    })
    .catch(function(e) {
      console.log(e.message)
    }).then(function(){
      console.log('upload successful!');
    }, function (error) {
      console.error(error);
    });

  }
  )


}

module.exports = exportResultMonth2;
