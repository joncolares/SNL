import express from 'express';
import cors from 'cors';
import path from 'path';
import routes from './routes';

const app = express();

app.use(cors());
//para que o express interprete o json
app.use(express.json());
//uso das rotas
app.use(routes);

app.use('/uploads', express.static(path.resolve(__dirname, '..', '..', 'uploads')));






app.listen(3333);