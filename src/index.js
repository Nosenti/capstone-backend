import express from 'express';
import connectDB from './config/db.js';
import 'dotenv/config.js';
import fileupload from 'express-fileupload';
import router from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3000;

connectDB()
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(fileupload({
  useTempFiles: true
}));

app.use('/', router);

app.listen(PORT, () => {
  console.log('Server has started at port', PORT);
});

export default app;