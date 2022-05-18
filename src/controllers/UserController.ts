import { Request, Response } from 'express';
import { collection, getDocs } from 'firebase/firestore';
import db from '../services/db'
import { APIResponse } from '../interfaces/Response';
import { UserInterface } from '../interfaces/UserInterface';

export async function getAllUsers(req: Request, res: Response) {
  const snapshot = await getDocs(collection(db, 'users'));
  const users = snapshot.docs.map(user => user.data());
  
  res.json(<APIResponse<{ users: Array<UserInterface>} >>{
    success: true,
    data: {
      users: users,
    }
  });
};

export async function getUserById(req: Request, res: Response) {

};

export async function submitUser(req: Request, res: Response) {

};

export async function updateUser(req: Request, res: Response) {

};