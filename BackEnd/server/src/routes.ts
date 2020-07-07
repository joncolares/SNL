import express from 'express';

import multer from 'multer';
import multerConfig from './config/multer';


import PointsController from './Controllers/PointsControllers'
import ItensController from './Controllers/ItensControllers';

const routes = express.Router();
const uploads = multer(multerConfig);


const pointsController = new PointsController();
const itensController = new ItensController();

//index = Listagem
// show = Consulta de 1 registro
//create , update, delete
routes.get('/itens', itensController.index);
routes.get('/points/:id', pointsController.show);
routes.get('/points', pointsController.index);

routes.post('/points', uploads.single('image'),pointsController.create);


export default routes;