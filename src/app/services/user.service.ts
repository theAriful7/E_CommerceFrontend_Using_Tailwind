import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginRequest } from '../models/login-request.model';
import { RegisterRequest } from '../models/register-request.model';
import { UserRequest } from '../models/user-request.model';
import { UserResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:8080/api/users'; // Spring Boot er base path

  constructor(private http: HttpClient) {}

  createUser(data: UserRequest): Observable<UserResponse> {
  return this.http.post<UserResponse>(`${this.baseUrl}`, data);
}

  // 🟢 Register new user
  register(data: RegisterRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.baseUrl}/register`, data);
  }

  // 🟢 Login user (static + database)
  login(data: LoginRequest): Observable<UserResponse | null> {
    return this.http.post<UserResponse | null>(`${this.baseUrl}/login`, data);
  }

  // 🟢 Get all users
  getAllUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(this.baseUrl);
  }

  // 🟢 Get user by ID
  getUserById(id: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.baseUrl}/${id}`);
  }


    // 🟡 Update user
  updateUser(id: number, data: UserRequest): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.baseUrl}/${id}`, data);
  }

  // 🔴 Delete user (or deactivate)
  deleteUser(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }
}
