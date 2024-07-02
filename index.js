import express from 'express';
import { Configuration, OpenAIApi } from 'openai';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { db } from "./db.js";
import cors from 'cors';
dotenv.config();

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// function parseSteps(response) {
//     const stepPattern = /\d+\.\s([A-Za-z\s]+):/g;
//     let match;
//     const steps = [];

//     while ((match = stepPattern.exec(response)) !== null) {
//         steps.push(match[1].trim());
//     }

//     return steps;
// }
function extractSteps(text) {
    const steps = [];
    const stepRegex = /Step\s+(\d+):\s*(.*?)\n-\s*(.*?)(?=\nStep\s+\d+:|\n\n|$)/gs;
    let match;

    while ((match = stepRegex.exec(text)) !== null) {
        steps.push({
            stepNo: match[1].trim(),
            processName: match[2].trim(),
            processDescription: match[3].trim()
        });
    }

    return steps;
}

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    try {
        const response = await openai.createChatCompletion({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: 'provide consistent process sheet with steps of manufacturing of' },
                { role: 'user', content: userMessage }
            ],
            temperature:0,
            top_p:0
        });
        
        const botMessage = response.data.choices[0].message.content;
        const processdata=extractSteps(botMessage);
        res.json(processdata)
        // console.log(botMessage); 
        // const steps = parseSteps(botMessage);
        // console.log(steps);
        // const results = [];
        // for (const step of steps) {
        //      // Use UNNEST to handle text[] array and apply LIKE to each element
        //      const query = `
        //          SELECT worker_name 
        //          FROM worker 
        //          CROSS JOIN UNNEST(process) AS p 
        //          WHERE p LIKE $1
        //      `;
        // }
        //     const params = [`%${step}%`];
        //     const result = await db.query(query, params);

        //     if (result.rows.length > 0) {
        //         // Extract worker names from the result
        //         const workerNames = result.rows.map(row => row.worker_name); // Extract worker names
        //         results.push({ step, workers: workerNames });
        //     }
        // }

        // // Send results back to client
        // res.json({ results });

    } catch (error) {
        console.error('Error communicating with OpenAI:', error.response ? error.response.data : error.message);
        res.status(500).send('Internal Server Error');
    }
});
app.get("/",async(req,res)=>{
    res.send("hello world");
})
 
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
