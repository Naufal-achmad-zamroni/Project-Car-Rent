import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

const verifyUser = async (req: Request,res: Response,next: NextFunction) => {
  try {
    // Membaca data header request
    const header = req.headers.authorization;
    // Membaca data token yang dikirimkan
    const token = header?.split(" ")[1] || "";
    const secretKey = "epep";
    // Proses verifikasi token
    verify(token, secretKey, (error) => {
      if (error) {
        return res.status(401).json({
          status: false,
          message: "Unauthorized",
        });
      }
      next();
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      error,
    });
  }
};

export {verifyUser}