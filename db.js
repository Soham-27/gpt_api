import pg from "pg";
import dotenv from 'dotenv';
dotenv.config();
const {Client}=pg;
//const string =process.env.STRING||"postgres://india:wFvuADVTXlLtL0AD7ENLfTI26MewuEeN@dpg-co40ibq1hbls73bnlt10-a.oregon-postgres.render.com/past2present";
const db=new pg.Client({
        host: "ep-flat-boat-a1x897lm.ap-southeast-1.aws.neon.tech",
        user: "cosocket_owner",
        port: 5432,
        database: "cosocket",
        password:"w8h7aNIKzsDu",
        ssl:{
            rejectUnauthorized:false
        }

})
try {
    // Connect to the database using the connect method
    db.connect()
        .then(() => {
            console.log("Database connected!!");
            
        })
        .catch((error) => {
            console.error("Error connecting to the database:", error);
        }); 
} catch (error) { 
    console.log(error);  
} 



export {db}; 