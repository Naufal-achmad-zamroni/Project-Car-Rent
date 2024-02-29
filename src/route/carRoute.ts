import express from 'express';
import * as car from '../Controller/car'

const app = express();
app.use(express.json());

app.post('/car', car.createCar);
app.get('/car', car.showCar);
app.delete('/delete/:carID', car.deleteCar);
app.put('/update/:carID',  car.updateAdmin)

export default app