import express from 'express';
import { getTrendingRepos } from '../controllers/repoController.js';
const repoRouter = express.Router();

repoRouter.get('/trending', async (req, res, next)=>{
    try{
        const {duration = "week", limit=10} = req.query;
        const repos = await getTrendingRepos({
            duration,
            limit: Number(limit)
        });
        res.status(200).json(repos);
    } catch(error){
        next(error);
    }
});
export default repoRouter;