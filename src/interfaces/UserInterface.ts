export enum UserRole {
  Passanger = 'passanger',
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
  id: String,
  createdAt: Date,
  role: UserRole,
  username: String,
  name: String,
  email: String,
  phoneNumber: String,
  password: String,
  location: LocationInterface,
  driverMeta?: DriverMetaInterface
};

export default class User implements UserInterface {
  public id: String;
  public createdAt: Date;
  public role: UserRole;
  public username: String;
  public name: String;
  public email: String;
  public phoneNumber: String;
  public password: String;
  public location: LocationInterface;
  public driverMeta?: DriverMetaInterface;

  constructor(user: UserInterface) {
    this.id = user.id,
    this.createdAt = user.createdAt,
    this.role = user.role,
    this.username = user.username,
    this.name = user.name,
    this.email = user.email,
    this.phoneNumber = user.phoneNumber,
    this.password = user.password,
    this.location = user.location,
    this.driverMeta = user.driverMeta
  };
};