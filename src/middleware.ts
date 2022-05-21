import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import JWT from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import db from './services/db';
import { doc, getDoc } from 'firebase/firestore';
import { UserInterface, UserRole } from './interfaces/UserInterface';
import { APIResponse } from './interfaces/Response';

dotenv.config();

const unauthorizedResponse = <APIResponse> {
  success: false,
  message: 'Not authorized'
};

export async function Authentication(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;
  const token = authorization?.substring(7);

  if (!token) {
    res.json(unauthorizedResponse);
    return;
  }

  try {
    const id = JWT.verify(token, fs.readFileSync(path.join(__dirname, '../../private.key')), <JWT.VerifyOptions> {
      algorithms: ['PS256']
    });

    const userRef = doc(db, 'users', id as string);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists) {
      res.json(unauthorizedResponse);
      return;
    }

    const user = {
      id: userSnap.id,
      ...userSnap.data()
    } as UserInterface;

    res.locals.user = user;
    next();

  } catch (err) {
    res.json(unauthorizedResponse);
  }
}

export function IsAdmin({res, next}: {res: Response, next: NextFunction}): void {
  const { user } = res.locals;
    
  if (user.UserRole !== UserRole.Admin) {
    res.json(<APIResponse>{
      success: false,
      message: 'Only for admin'
    })
    
    return;
  }

  next()
}

export function IsPassenger({res, next}: {res: Response, next: NextFunction}): void {
  const { user } = res.locals;

  if (user.UserRole != UserRole.Passenger) {
    res.json(<APIResponse>{
      success: false,
      message: 'Only for passenger'
    })

    return;
  }

  next();
}

export function IsDriver({res, next}: {res: Response, next: NextFunction}): void {
  const { user } = res.locals;

  if (user.UserRole != UserRole.Driver) {
    res.json(<APIResponse>{
      success: false,
      message: 'Only for driver'
    })

    return;
  }

  next();
}