import { Request, Response } from "express";
import { getDocs , query, where, collection } from "firebase/firestore";
import JWT from 'jsonwebtoken';
import BCrypt from 'bcrypt';
import dotenv from 'dotenv';
import fs from 'fs';
import path from "path";
import db from "../services/db";
import { UserInterface, UserRole } from "../interfaces/UserInterface";
import { APIResponse } from "../interfaces/Response";

dotenv.config();

export async function AuthController(req: Request, res: Response) {
  const { phoneNumber, password } = req.body;

  const accountInvalid: APIResponse = {
    success: false,
    message: 'Phone number or password invalid',
  };
    
  const q = query(collection(db, 'users'), where('phoneNumber', '==', phoneNumber));
  const userQuery = await getDocs(q);

  if (userQuery.empty) {
    res.status(404).json(accountInvalid);
    return;
  }

  const user = {
    id: userQuery.docs[0].id,
    ...userQuery.docs[0].data()
  } as UserInterface;

  const passwordMatch = await BCrypt.compare(password, user.password);
  if (!passwordMatch) {
    res.status(404).json(accountInvalid);
    return;
  }

  const jwt = JWT.sign(String(user.id), fs.readFileSync(path.join(__dirname, '../../private.key')));

  let endPoint = '/';
  if (user.role == UserRole.Admin) {
    endPoint = '/admins';
  } else if (user.role == UserRole.Driver) {
    endPoint = '/drivers';
  } else if (user.role == UserRole.Passenger) {
    endPoint = '/passengers';
  }

  interface ResponInterface {
    token: string,
    endPoint: string
  }

  res.status(200).json(<APIResponse<ResponInterface>> {
    success: true,
    data: {
      token: jwt,
      endPoint: endPoint
    }
  });
};