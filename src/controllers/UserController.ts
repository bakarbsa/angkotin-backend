import { Request, Response } from 'express';
import { 
  collection, 
  query, 
  doc,
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
  try {
    const colRef = collection(db, 'users');
    const passengerQuery = query(colRef, where('role', '==', 'passenger'));
    const passangerSnap = await getDocs(passengerQuery);
    const passangers = passangerSnap.docs.map(passanger => passanger.data());
    
    res.status(200).json(<APIResponse<{ passangers: Array<UserInterface>} >>{
      success: true,
      data: {
        passangers: passangers,
      }
    });
    return;
  } catch (err) {
    res.status(500).json(<APIResponse> {
      success: false,
      error: (err as Error).message
    });
    return;
  }
};

export async function getPassengerById(req: Request, res: Response) {
  const { id } = req.params;

  const docRef = doc(db, 'users', id);
  await getDoc(docRef).then(passengerSnap => {
    if (!passengerSnap.exists()) {
      res.status(404).json(<APIResponse> {
        success: false,
        message: 'Passenger not found'
      });
      return;
    }
    
    const user = {
      id: passengerSnap.id,
      ...passengerSnap.data()
    } as UserInterface;
    
    res.status(200).json(<APIResponse<UserInterface>> {
      success: true,
      data: user
    });
    return;
  }).catch(err => {
    res.status(500).json(<APIResponse> {
      success: false,
      error: (err as Error).message
    });
    return;
  });
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
  
  if (!nik || !phoneNumber || !name || !password) {
    res.status(417).json(<APIResponse> {
      success: false,
      message: `NIK or phone cannot be empty`
    });
    return;
  }

  const colRef = collection(db, 'users');
  
  const phoneNumberQuery = query(colRef, where('phoneNumber', '==', phoneNumber));
  const nikQuery = query(colRef, where('nik', '==', nik));
  
  const phoneNumberFound= await getDocs(phoneNumberQuery);
  const nikFound= await getDocs(nikQuery);

  if (!phoneNumberFound.empty) {
    res.status(406).json(<APIResponse>{
      success: false,
      message: 'Phone number has been used'
    });
    return;
  }
  if (!nikFound.empty) {
    res.status(406).json(<APIResponse>{
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
    res.status(201).json(<APIResponse<UserInterface>> {
      success: true,
      data: user
    });
    return;
  }).catch(err => {
    res.status(500).json(<APIResponse> {
      success: false,
      error: err
    })
  });
  return;
};

export async function updatePassenger(req: Request, res: Response) {
  const { id } = req.params;
  const { name, phoneNumber, password, longitude, latitude } = req.body;

  const docRef = doc(db, 'users', id);
  
  await getDoc(docRef).then(async userSnap => {
    if(!userSnap.exists()) {
      res.status(404).json(<APIResponse> {
        success: false,
        message: 'Passenger not found'
      });
      return;
    }

    const user = {
      id: userSnap.id,
      ...userSnap.data()
    } as UserInterface;
    
    if (user.role != UserRole.Passenger) {
      res.status(417).json(<APIResponse> {
        success: false,
        message: 'Only can update driver'
      });
      return;
    }

    if (phoneNumber) {
      console.log(phoneNumber);
      
      user.phoneNumber = phoneNumber;
      
    }
    if (name) {
      user.name = name;
    }
    if (password) {
      user.password = BCrypt.hashSync(password, 10);
    }
    if (longitude) {
      user.location.longitude = longitude;
    }
    if (latitude) {
      user.location.latitude = latitude;
    }
    

    await updateDoc(docRef, {...user}).then(() => {
      res.status(200).json(<APIResponse> {
        success: true,
        message: 'Passenger updated successful'
      })
      return;
    }).catch(err => {
      res.status(500).json(<APIResponse> {
        success: false,
        error: (err as Error).message
      });
    });
    return;
  }).catch(err => {
    res.status(500).json(<APIResponse> {
      success: false,
      error: (err as Error).message
    });
    return;
  });
};

export async function removePassenger(req: Request, res: Response) {
  const { id } = req.params;

  const docRef = doc(db, 'users', id);
  await deleteDoc(docRef).then(() => {
    res.status(200).json(<APIResponse> {
      success: true,
      message: 'Delete passenger successful'
    });
    return;
  }).catch(err => {
    res.status(500).json(<APIResponse> {
      success: false,
      error: (err as Error).message
    });
    return;
  });
}

/* DRIVER CONTROLLER */
export async function getAllDriver(req: Request, res: Response) {
  try {
    const colRef = collection(db, 'users');
    const driverQuery = query(colRef, where('role', '==', 'driver'));
    const driverSnap = await getDocs(driverQuery);
    const drivers = driverSnap.docs.map(driver => driver.data());
    
    res.status(200).json(<APIResponse<{ drivers: Array<UserInterface>} >>{
      success: true,
      data: {
        drivers: drivers,
      }
    });
    return;
  } catch (err) {
    res.status(500).json(<APIResponse> {
      success: true,
      error: (err as Error).message
    });
    return;
  }
};

export async function getDriverById(req: Request, res: Response) {
  const { id } = req.params;

  const docRef = doc(db, 'users', id);
  await getDoc(docRef).then(driverSnap => {
    if (!driverSnap.exists()) {
      res.status(404).json(<APIResponse> {
        success: false,
        message: 'Driver not found'
      });
      return;
    }
    
    const user = {
      id: driverSnap.id,
      ...driverSnap.data()
    } as UserInterface;
    
    res.status(200).json(<APIResponse<UserInterface>> {
      success: true,
      data: user
    });
    return;
  }).catch(err => {
    res.status(500).json(<APIResponse> {
      success: false,
      error: (err as Error).message
    });
    return;
  });
}

export async function addDriver(req: Request, res: Response) {
  const { 
    name, 
    nik, 
    phoneNumber, 
    password, 
    latitude, 
    longitude,
    angkotNumber,
    angkotLabel,
    isActive 
  } = req.body;

  if (!nik || !phoneNumber || !password || !name || !angkotNumber || !angkotLabel) {
    res.status(417).json(<APIResponse> {
      success: false,
      message: 'NIK, phone, angkot number, and angkot label cannot be empty'
    });
    return;
  }

  const colRef = collection(db, 'users');
  
  const phoneNumberQuery = query(colRef, where('phoneNumber', '==', phoneNumber));
  const nikQuery = query(colRef, where('nik', '==', nik));
  const angkotNumberQuery = query(colRef, where('angkotNumber', '==', angkotNumber));
  
  const phoneNumberFound= await getDocs(phoneNumberQuery);
  const nikFound= await getDocs(nikQuery);
  const angkotNumberFound = await getDocs(angkotNumberQuery);

  if (!phoneNumberFound.empty) {
    res.status(406).json(<APIResponse>{
      success: false,
      message: 'Phone number has been used'
    });
    return;
  }
  if (!nikFound.empty) {
    res.status(406).json(<APIResponse>{
      success: false,
      message: 'NIK has been used'
    });
    return;
  }
  if (!angkotNumberFound.empty) {
    res.status(406).json(<APIResponse>{
      success: false,
      message: 'Angkot number has been used'
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
    role: UserRole.Driver,
    driverMeta: {
      angkotNumber: angkotNumber as string,
      angkotLabel: angkotLabel,
      isActive: isActive ? isActive as boolean : false
    }
  };

  await addDoc(colRef, user).then(() => {
    res.status(201).json(<APIResponse<UserInterface>> {
      success: true,
      data: user
    });
    return;
  }).catch(err => {
    res.status(201).json(<APIResponse> {
      success: false,
      error: err
    })
  });
  return;
}

export async function updateDriver(req: Request, res: Response) {
  const { id } = req.params;
  const { name, phoneNumber, password, longitude, latitude } = req.body;

  const docRef = doc(db, 'users', id);
  
  await getDoc(docRef).then(async userSnap => {
    if(!userSnap.exists()) {
      res.status(404).json(<APIResponse> {
        success: false,
        message: 'Driver not found'
      });
      return;
    }

    const user = {
      id: userSnap.id,
      ...userSnap.data()
    } as UserInterface;
    
    if (user.role != UserRole.Driver) {
      res.status(417).json(<APIResponse> {
        success: false,
        message: 'Only can update driver'
      });
      return;
    }

    if (phoneNumber) {
      user.phoneNumber = phoneNumber;
    }
    if (name) {
      user.name = name;
    }
    if (password) {
      user.password = BCrypt.hashSync(password, 10);
    }
    if (longitude) {
      user.location.longitude = longitude;
    }
    if (latitude) {
      user.location.latitude = latitude;
    }
    

    await updateDoc(docRef, {...user}).then(() => {
      res.status(200).json(<APIResponse> {
        success: true,
        message: 'Passenger updated successful'
      })
      return;
    }).catch(err => {
      res.status(500).json(<APIResponse> {
        success: false,
        error: (err as Error).message
      });
    });
    return;
  }).catch(err => {
    res.status(500).json(<APIResponse> {
      success: false,
      error: (err as Error).message
    });
    return;
  });
};

export async function removeDriver(req: Request, res: Response) {
  const { id } = req.params;

  const docRef = doc(db, 'users', id);
  await deleteDoc(docRef).then(() => {
    res.status(200).json(<APIResponse> {
      success: true,
      message: 'Delete driver successful'
    });
    return;
  }).catch(err => {
    res.status(500).json(<APIResponse> {
      success: false,
      error: (err as Error).message
    });
    return;
  });
}

/* ADMIN CONTROLLER */
export async function getAllAdmin(req: Request, res: Response) {
  try {
    const colRef = collection(db, 'users');
    const adminQuery = query(colRef, where('role', '==', 'admin'));
    const adminSnap = await getDocs(adminQuery);
    const admins = adminSnap.docs.map(admin => admin.data());
    
    res.status(200).json(<APIResponse<{ admins: Array<UserInterface>} >>{
      success: true,
      data: {
        admins: admins,
      }
    });
    return;
  } catch (err) {
    res.status(500).json(<APIResponse> {
      success: true,
      error: (err as Error).message
    });
    return;
  }
}

export async function addAdmin(req: Request, res: Response) {
  const { 
    name, 
    nik, 
    phoneNumber, 
    password, 
    latitude, 
    longitude 
  } = req.body;

  if (!nik || !phoneNumber) {
    res.status(417).json(<APIResponse> {
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
    res.status(406).json(<APIResponse>{
      success: false,
      message: 'Phone number has been used'
    });
    return;
  }
  if (!nikFound.empty) {
    res.status(406).json(<APIResponse>{
      success: false,
      message: 'NIK has been used'
    });
    return;
  }

  const hashedPass = BCrypt.hashSync(password, 10);

  const user: UserInterface = {
    name: name ? name as string : "admin",
    nik: nik as string,
    phoneNumber: phoneNumber as string,
    password: hashedPass as string,
    location: {
      latitude: latitude ? latitude as number : 0,
      longitude: longitude ? longitude as number : 0,
    },
    createdAt: new Date(),
    role: UserRole.Admin,
  };

  await addDoc(colRef, user).then(() => {
    res.status(201).json(<APIResponse<UserInterface>> {
      success: true,
      data: user
    });
    return;
  }).catch(err => {
    res.status(500).json(<APIResponse> {
      success: false,
      error: err
    })
  });
  return;
}

export async function removeAdmin(req: Request, res: Response) {
  const { id } = req.params;

  const docRef = doc(db, 'users', id);
  await deleteDoc(docRef).then(() => {
    res.status(200).json(<APIResponse> {
      success: true,
      message: 'Delete driver successful'
    });
    return;
  }).catch(err => {
    res.status(500).json(<APIResponse> {
      success: false,
      error: (err as Error).message
    });
  });
  return;
}