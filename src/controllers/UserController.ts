import { Request, Response } from 'express';
import { 
  collection, 
  query, 
  where, 
  getDocs,
  getDoc, 
  addDoc,
  deleteDoc,
  updateDoc 
} from 'firebase/firestore';
import db from '../services/db'
import BCrypt from 'bcrypt';
import { APIResponse } from '../interfaces/Response';
import { UserInterface, UserRole } from '../interfaces/UserInterface';

/* PASSENGER CONTROLLER */
export async function getAllPassenger(req: Request, res: Response) {
  const snapshot = await getDocs(collection(db, 'users'));
  const users = snapshot.docs.map(user => user.data());
  
  res.json(<APIResponse<{ users: Array<UserInterface>} >>{
    success: true,
    data: {
      users: users,
    }
  });
};

export async function getPassengerById(req: Request, res: Response) {

};

export async function addPassenger(req: Request, res: Response) {
  const { 
    name, 
    nik, 
    phoneNumber, 
    password, 
    latitude, 
    longitude 
  } = req.body;

  if (!nik || !phoneNumber) {
    res.json(<APIResponse> {
      success: false,
      message: 'NIK or phone cannot be empty'
    });
    return;
  }

  const colRef = collection(db, 'users');
  
  const phoneNumberQuery = query(colRef, where('phoneNumber', '==', phoneNumber));
  const nikQuery = query(colRef, where('nik', '==', nik));
  
  const phoneNumberFound= await getDocs(phoneNumberQuery);
  const nikFound= await getDocs(nikQuery);

  if (!phoneNumberFound.empty) {
    res.json(<APIResponse>{
      success: false,
      message: 'Phone number has been used'
    });
    return;
  }
  if (!nikFound.empty) {
    res.json(<APIResponse>{
      success: false,
      message: 'NIK has been used'
    });
    return;
  }

  const hashedPass = BCrypt.hashSync(password, 10);

  const user: UserInterface = {
    name: name as string,
    nik: nik as string,
    phoneNumber: phoneNumber as string,
    password: hashedPass as string,
    location: {
      latitude: latitude ? latitude as number : 0,
      longitude: longitude ? longitude as number : 0,
    },
    createdAt: new Date(),
    role: UserRole.Passenger,
  };

  await addDoc(colRef, user).then(() => {
    res.json(<APIResponse<UserInterface>> {
      success: true,
      data: user
    });
  }).catch(err => {
    res.json(<APIResponse> {
      success: false,
      error: err
    })
  });
};

export async function updatePassenger(req: Request, res: Response) {

};

export async function removePassenger(req: Request, res: Response) {

}

/* DRIVER CONTROLLER */
export async function getAllDriver(req: Request, res: Response) {

};

export async function getDriverById(req: Request, res: Response) {
  
}

export async function addDriver(req: Request, res: Response) {

}

export async function updateDriver(req: Request, res: Response) {

};

export async function removeDriver(req: Request, res: Response) {
  
}

/* ADMIN CONTROLLER */
export async function getAllAdmin(req: Request, res: Response) {

}

export async function addAdmin(req: Request, res: Response) {

}

export async function removeAdmin(req: Request, res: Response) {
  
}