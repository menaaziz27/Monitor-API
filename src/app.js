const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const express = require('express');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middlewares/errorMiddlewares');
const app = express();

app.set('view engine', 'ejs');
app.set('views', './src/views');
app.options('*', cors());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(morgan('combined'));

app.use('/v1/api', routes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
