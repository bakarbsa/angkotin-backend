export enum UserRole {
  Passenger = 'passenger',
  Driver = 'driver',
  Admin = 'admin',
};

export interface LocationInterface {
  latitude: number,
  longitude: number,
};

export interface DriverMetaInterface {
  angkotNumber: string,
  isActive: boolean,
};

export interface UserInterface {
  id?: string,
  createdAt: Date,
  role: UserRole,
  nik: string,
  name: string,
  phoneNumber: string,
  password: string,
  location: LocationInterface,
  driverMeta?: DriverMetaInterface
};