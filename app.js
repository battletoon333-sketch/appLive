const express = require('express');
const teleRouter = require('./routes/teleRouter.js');
const waRouter = require('./routes/waRouter.js');
const connectDB = require('./db/db.js');
const cors = require('cors');
const app = express();

require('dotenv').config();

connectDB();

const port = process.env.PORT || 3003;

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/tg', teleRouter);
app.use('/wa', waRouter);

app.listen(port, () => console.log(`http://localhost:${port}`));

