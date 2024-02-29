import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createRent = async (request: Request, response: Response) => {
  try {
    const carID = Number(request.body.carID);
    const { namaPenyewa, lamaSewa } = request.body;

    const car = await prisma.car.findFirst({
      where: {
        carID: carID,
      },
    });

    if (!car) {
      return response.status(400).json({
        status: false,
        error: "Data mobil tidak ditemukan.",
      });
    }

    const totalbayar = lamaSewa * car.hargaperhari;

    const rent = await prisma.rent.create({
      data: {
        carID,
        namaPenyewa,
        lamaSewa,
        totalbayar,
      },
    });

    return response.status(200).json({
      status: true,
      message: "Berhasil",
      rent,
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      status: false,
      error,
    });
  }
};


const showRent = async (request: Request, response: Response) => {
  try {
    const page = Number(request.query.page) || 1;
    const qty = Number(request.query.qty) || 5;
    const keyword = request.query.keyword?.toString() || "";

    const rent = await prisma.rent.findMany({
      take: qty,
      skip: (page - 1) * qty,
      where: {
        OR: [{ namaPenyewa: { contains: keyword } }],
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return response.status(200).json({
      status: true,
      message: `Berhasil`,
      rent,
    });
  } catch (error) {
    response.status(500).json({
      status: false,
      error,
    });
  }
};

const updateRent = async (request: Request, response: Response) => {
  try {
    const carID = Number(request.body.carID);
    const { namaPenyewa, lamaSewa } = request.body;
    const rentID = Number(request.params.rentID)

    const car = await prisma.rent.findFirst({
      where: {
        carID,
      },
      include: {
        car_details: true,
      },
    });

    if (!car || !car.car_details) {
      return response.status(400).json({
        status: false,
        error: "Data mobil tidak ditemukan.",
      });
    }

    const totalbayar = lamaSewa * car.car_details.hargaperhari;

    const update = await prisma.rent.update({
      where: {
        rentID: rentID
      },
      data: {
        namaPenyewa,
        lamaSewa,
        totalbayar
      }
    })

    return response.status(201).json({
      status: true,
      message: "Berhasil",

    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      status: false,
      error: "Terjadi kesalahan saat menyimpan data sewa.",
    })
  }
}

const deleteRent = async (request: Request, response: Response) => {
  try {

    const rentID = request.params.rentID

    const findrent = await prisma.rent.findFirst({
      where: {
        rentID: Number(rentID)
      },
    });

    if (!findrent) {
      return response.status(400)
        .json({
          status: false,
          message: `Data ID not found`
        })
    }

    const rentDelete = await prisma.rent.delete({
      where: {
        rentID: Number(rentID)
      }
    })

    return response.status(200).json({
      status: false,
      message: `event with ID ${rentDelete} has been deleted`,
      rentDelete
    })

  } catch (error) {
    response.status(500).json({
      status: false,
      error
    })
  }
}

export { createRent, showRent, updateRent, deleteRent }