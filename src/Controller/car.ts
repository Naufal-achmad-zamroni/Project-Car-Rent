import { Request, Response } from "express";
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

 const createCar = async(request: Request, response : Response) => {
    try {
        const {nopol,merkmobil,hargaperhari} = request.body

    const car = await prisma.car.create({
        data : {
            nopol : nopol,
            merkmobil : merkmobil,
            hargaperhari : hargaperhari
        }
    })

    return response.status(200).json({
        data : {
            status : true,
            message : `Car has been created`,
            car
        }
    })

    } catch (error) {
        return response.status(500)
        .json({
            status : false,
            error
        })
    }
}

 const showCar = async (request: Request, response : Response) => {
    try {
        const page = Number(request.query.page) || 1;
        const qty = Number(request.query.qty) || 5
        const keyword = request.query.keyword?.toString() || ""

        const car = await prisma.car.findMany({
            take : qty,
            skip : (page - 1) * qty,
            where : {
                OR : [
                    {nopol: {contains : keyword}},
                    {merkmobil: {contains : keyword}}
                ]
            },
            orderBy : {
                merkmobil : "asc"
            }
        })

        return response.status(200).json({
            status : true,
            message : `Berhasil`,
            car
        })
        
    } catch (error) {
        response.status(500).json({
            status : false,
            error
        })
    }
}

 const deleteCar = async (request : Request, response : Response) => {
    try {

        const carID = request.params.carID

        const findCar = await prisma.car.findFirst({
            where : {
                carID : Number(carID)
            },
        });

        if(!findCar){
            return response.status(400)
            .json({
                status : false,
                message : `Data ID not found`
            })
        }

        const carDelete = await prisma.car.delete({
            where : {
                carID : Number(carID)
            }
        })

        return response.status(200).json({
            status : false,
            message : `event with ID ${carDelete} has been deleted`,
            data : carDelete
        })

    } catch (error){
        response.status(500).json({
            status : false,
            error
        })
    }
}

const updateAdmin = async  (request : Request, response : Response) => {
    try {
        const {nopol,merkMobil} = request.body
        const carID = request.params.carID

        const findCar = await prisma.car.findFirst({
            where : {
                carID : Number(carID)
            },
        });

        if(!findCar){
            return response.status(400)
            .json({
                status : false,
                message : `Data event not found`
            })
        }
        
        const carUpdate = await prisma.car.update({
            where : {
                carID : Number(carID)
            },
            data : {
                nopol : nopol || findCar.nopol,
                merkmobil : merkMobil || findCar.merkmobil
            }
        })

        return response.status(200).json({
            status : true,
            message : `Data has been updated`,
            data : carID
        })

    } catch (error) {
        response.status(500).json({
            status : false,
            error
        })
    }
}

export{createCar,showCar,updateAdmin,deleteCar}