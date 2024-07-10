const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10;
let storedNumbers = [];


app.get('/numbers/:numberid', async (req, res) => {
    const { numberid } = req.params;
    
    try {
       
        const response = await axios.get(`http://thirdpartyapi.com/${numberid}`);
        const numbers = response.data.numbers || [];

        
        numbers.forEach(num => {
            if (!storedNumbers.includes(num)) {
                storedNumbers.push(num);
            }
        });

        
        if (storedNumbers.length > WINDOW_SIZE) {
            storedNumbers = storedNumbers.slice(-WINDOW_SIZE);
        }

      
        const average = calculateAverage(storedNumbers);

        
        const responseJSON = {
            windowPrevState: [], 
            windowCurrState: storedNumbers,
            numbers: storedNumbers,
            avg: average.toFixed(2) 
        };

        res.json(responseJSON);
    } catch (error) {
        console.error('Error fetching numbers:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


function calculateAverage(numbers) {
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((acc, curr) => acc + curr, 0);
    return sum / numbers.length;
}


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${9876}`);
});
