import express, { Request,Response } from "express";
import adminRoute from './route/adminRoute'
import carRoute from './route/carRoute'
import rentRoute from './route/rentRoute'

const app = express();
const port = 8000;

app.use(adminRoute)
app.use(carRoute)
app.use(rentRoute)

app.listen(port, () => {
    console.log(`Your running on port ${port}`)
})