export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum ROLES {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE',
  USER = 'USER'
}

export interface Organization extends BaseEntity {
  name: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  status: boolean;
  logo_link_url: string;
  logo_link_name: string;
  img_link_url: string;
  img_link_name: string;
  hasBooking: boolean;
  waitingPeople: boolean;
  hasSMS: boolean;
  remainingSMS: number;
  establishments?: Establishment[];
  services?: Service[];
}

export interface Establishment extends BaseEntity {
  name: string;
  description?: string;
  address: string;
  city: string;
  phone: string;
  img_link: string;
  status: boolean;
  askingName: boolean;
  askingPhone: boolean;
  hasSMS: boolean;
  remainingSMS: number;
  organization: Organization;
  organizationId: string;
  users?: User[];
  kiosks?: Kiosk[];
  waitingAreas?: WaitingArea[];
  queues?: Queue[];
}

export interface User extends BaseEntity {
  name: string;
  surname?: string;
  profilePhotoURL?: string;
  socialMediaUser: boolean;
  status: boolean;
  language?: string;
  emailverified: boolean;
  username: string;
  password: string;
  email: string;
  verificationToken: string;
  role: ROLES;
  establishment?: Establishment;
  establishmentId?: string;
}

export interface Service extends BaseEntity {
  name: string;
  description?: string;
  duration: number;
  price: number;
  status: boolean;
  organizationId: string;
  organization?: Organization;
}

export interface Kiosk extends BaseEntity {
  name: string;
  description?: string;
  status: boolean;
  establishmentId: string;
  establishment?: Establishment;
}

export interface WaitingArea extends BaseEntity {
  name: string;
  description?: string;
  capacity: number;
  status: boolean;
  establishmentId: string;
  establishment?: Establishment;
}

export interface Queue extends BaseEntity {
  name: string;
  description?: string;
  priority: number;
  status: boolean;
  establishmentId: string;
  establishment?: Establishment;
}

export interface Turn extends BaseEntity {
  number: string;
  status: string;
  userId?: string;
  user?: User;
  serviceId: string;
  service?: Service;
  queueId: string;
  queue?: Queue;
  estimatedTime?: Date;
  calledTime?: Date;
  finishedTime?: Date;
}

export interface Screen extends BaseEntity {
  name: string;
  description?: string;
  location: string;
  status: boolean;
  establishmentId: string;
  establishment?: Establishment;
}

export interface Workspace extends BaseEntity {
  name: string;
  description?: string;
  status: boolean;
  establishmentId: string;
  establishment?: Establishment;
}

// Dashboard statistics interfaces
export interface DashboardStats {
  totalOrganizations: number;
  totalEstablishments: number;
  totalUsers: number;
  totalTurns: number;
  totalServices: number;
  activeQueues: number;
  activeTurns: number;
  completedTurns: number;
}

export interface ChartData {
  name: string;
  value: number;
  label?: string;
}

export interface TimeSeriesData {
  date: string;
  value: number;
  label?: string;
}