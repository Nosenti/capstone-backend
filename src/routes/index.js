import express from 'express';

const router = express.Router()
router.use(express.json());

router.get('/',(req,res)=>{
  res.status(200).send('Welcome to ALUxFeed')
})

export default router;