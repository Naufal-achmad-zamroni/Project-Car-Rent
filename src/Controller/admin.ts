import { Request,Response } from 'express';
import {PrismaClient} from '@prisma/client';
import md5 from "md5";
import { sign } from "jsonwebtoken";

const prisma = new PrismaClient();

const createAdmin = async(request: Request, response : Response) => {
    try {
        const {namaAdmin,email } = request.body;
        const password = md5(request.body);

    const admin = await prisma.admin.create({
        data : {
            namaAdmin,
            email,
            password
        }
    })

    return response.status(200).json({
        data : {
            status : true,
            message : `Admin has been created`,
            admin
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

 const showAdmin = async (request: Request, response : Response) => {
    try {
        const page = Number(request.query.page) || 1;
        const qty = Number(request.query.qty) || 5
        const keyword = request.query.keyword?.toString() || ""

        const admin = await prisma.admin.findMany({
            take : qty,
            skip : (page - 1) * qty,
            where : {
                OR : [
                    {namaAdmin: {contains : keyword}},
                    {email: {contains : keyword}}
                ]
            },
            orderBy : {
                namaAdmin : "asc"
            }
        })

        return response.status(200).json({
            status : true,
            message : `Berhasil`,
            admin
        })
        
    } catch (error) {
        response.status(500).json({
            status : false,
            error
        })
    }
}

const deleteAdmin = async (request : Request, response : Response) => {
    try {

        const adminID = request.params.adminID

        const findAdmins = await prisma.admin.findFirst({
            where : {
                adminID : Number(adminID)
            },
        });

        if(!findAdmins){
            return response.status(400)
            .json({
                status : false,
                message : `Data ID not found`
            })
        }

        const adminDelete = await prisma.admin.delete({
            where : {
                adminID : Number(adminID)
            }
        })

        return response.status(200).json({
            status : false,
            message : `event with ID ${adminDelete} has been deleted`,
            data : adminDelete
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

        const {namaAdmin, email} = request.body
        const password = md5(request.body.password);

        const adminID = request.params.adminID

        const findAdmins = await prisma.admin.findFirst({
            where : {
                adminID : Number(adminID)
            },
        });

        if(!findAdmins){
            return response.status(400)
            .json({
                status : false,
                message : `Data event not found`
            })
        }
        
        const adminUpdate = await prisma.admin.update({
            where : {
                adminID : Number(adminID)
            },
            data : {
                namaAdmin : namaAdmin || findAdmins.namaAdmin,
                email : email || findAdmins.email,
                password : password || findAdmins.email
            }
        })

        return response.status(200).json({
            status : true,
            message : `Data has been updated`,
            data : adminUpdate
        })

    } catch (error) {
        response.status(500).json({
            status : false,
            error
        })
    }
}

const loginAdmin = async(request:Request, response:Response) => {
    try {
        const email = request.body.email
        const password = md5(request.body)

        const admin = await prisma.admin.findFirst({
            where : {
                email : email,
                password : password
            }
        })

        if(admin){
            const payload = admin
            const secretKey = "bakso"
            const token = sign(payload,secretKey)

            return response.status(200)
            .json({
                status : true,
                message : `Login success`,
                token : token
            })
            
        }else{
            return response.status(200)
            .json({
                status : false,
                message : `ID Not found`
            })  
        }

    } catch (error) {
        response.status(500).json({
            status : false,
            error
        })
    }
}

export {createAdmin,showAdmin,updateAdmin,deleteAdmin,loginAdmin}