export interface AuthResponse {
    isSuccess: boolean;
    message?: string;
    tempToken?: string;
    token?: string;
}

export interface User {
  id: string;
  fullname: string;
  lastname: string;
  email: string;
  role: 'Admin' | 'User' | '';
}

export interface JwtPayload {
  aud: string;
  email: string;
  exp: number;
  iat: number;
  iss: string;
  name: string;
  nameid: string;  // User ID
  nbf: number;
  role: 'Admin' | 'User' | '';
}