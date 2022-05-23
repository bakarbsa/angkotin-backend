import { Request, Response, NextFunction } from 'express';
import JWT from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import db from './services/db';
import { doc, getDoc } from 'firebase/firestore';
import { UserInterface, UserRole } from './interfaces/UserInterface';
import { APIResponse } from './interfaces/Response';

const unauthorizedResponse = <APIResponse> {
  success: false,
  message: 'Not authorized'
};

export async function Authentication(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;
  const token = authorization?.substring(7);

  if (!token) {
    res.status(401).json(unauthorizedResponse);
    return;
  }

  try {
    const id = JWT.verify(token, fs.readFileSync(path.join(__dirname, '../private.key')));

    const userRef = doc(db, 'users', id as string);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists) {
      res.status(401).json(unauthorizedResponse);
      return;
    }

    const user = {
      id: userSnap.id,
      ...userSnap.data()
    } as UserInterface;

    res.locals.user = user;
    next();

  } catch (err) {
    res.json(<APIResponse> {
      success: false,
      error: (err as Error).message
    });
    return;
  }
}

export function IsAdmin({res, next}: {res: Response, next: NextFunction}): void {
  const { user } = res.locals;
    
  if (user.role !== UserRole.Admin) {
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

  if (user.role != UserRole.Passenger) {
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

  if (user.role != UserRole.Driver) {
    res.json(<APIResponse>{
      success: false,
      message: 'Only for driver'
    })

    return;
  }

  next();
}