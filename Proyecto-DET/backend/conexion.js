import mysql from 'mysql2/promise';
export async function connectToDatabase() {
 try {
    const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'det'    
   });

    console.log('Conectando a mysql...');
    return connection;
 }
 catch (error) {
    console.error('Error al conectar a la base de datos:', error); 
 }
}