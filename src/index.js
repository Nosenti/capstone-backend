import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import connectDB from './config/db.js';
import 'dotenv/config.js';
import fileupload from 'express-fileupload';
import router from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3000;

connectDB()
// Security HTTP headers
app.use(helmet())

app.use(express.urlencoded({ extended: false }));
// Body parser, reading from body into req.body
app.use(express.json({limit:'10kb'}));

// Data sanitization agains NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// prevent parameter pollution
app.use(hpp( ));

app.use(fileupload({
  useTempFiles: true
}));

// Limit requests from teh same IP Address
const limiter = rateLimit({
  max: 100,
  windowMs: 60*60*1000,
  message: 'Too many requests from this IP. Please try again in an hour' 
})

app.use('/api', limiter)


app.use('/api', router);

app.listen(PORT, () => {
  console.log('Server has started at port', PORT);
});

export default app;