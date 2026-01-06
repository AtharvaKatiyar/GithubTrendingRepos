import express from 'express';
import cors from 'cors';
import repoRouter from './routes/repoRouter.js';
import 'dotenv/config'
const app = express();
app.use(cors());

app.use((req, res, next) => {
    console.log(req.url, req.method);
    next();
})
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/repos',repoRouter);
app.get('/health', (req, res) =>{
    res.status(200).json({status:'ok'});
})

app.use((err, req, res, next)=>{
    console.error(err.message);
    res.status(500).json({
        error: err.message || "Internal server error"
    });
})
const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`Server hosted on http://localhost:${port}`)
})