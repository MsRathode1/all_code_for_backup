const mysql = require('mysql')

const connectDB = () => {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'cruddb'
    });

    connection.connect(function (err) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        }
        console.log('connected to db ');
    });
    return connection
}



module.exports = connectDB