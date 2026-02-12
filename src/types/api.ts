export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  userData: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}

export interface CreateOrganizationRequest {
  name: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  logo_link_url: string;
  logo_link_name: string;
  img_link_url: string;
  img_link_name: string;
  hasBooking?: boolean;
  waitingPeople?: boolean;
  hasSMS?: boolean;
}

export interface UpdateOrganizationRequest extends Partial<CreateOrganizationRequest> {
  status?: boolean;
  remainingSMS?: number;
}

export interface CreateEstablishmentRequest {
  name: string;
  description?: string;
  address: string;
  city: string;
  phone: string;
  img_link: string;
  organizationId: string;
  askingName?: boolean;
  askingPhone?: boolean;
  hasSMS?: boolean;
}

export interface UpdateEstablishmentRequest extends Partial<CreateEstablishmentRequest> {
  status?: boolean;
  remainingSMS?: number;
}

export interface CreateUserRequest {
  name: string;
  surname?: string;
  username: string;
  password: string;
  email: string;
  role: string;
  establishmentId?: string;
  language?: string;
}

export interface UpdateUserRequest extends Partial<CreateUserRequest> {
  status?: boolean;
  emailverified?: boolean;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  status?: boolean;
  days?: number;
  [key: string]: any;
}