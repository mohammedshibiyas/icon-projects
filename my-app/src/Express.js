
import express from 'express'
import cors from 'cors'
const app = express();

app.use(cors());

app.get('/api/PatientMstr/PatientSearchMaster', (req, res) => {
    // Your API logic here
    res.json({ message: "CORS enabled response" });
});

app.listen(8082, () => {
    console.log('Server running on port 8082');
});