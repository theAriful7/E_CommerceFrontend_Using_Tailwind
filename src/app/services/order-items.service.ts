import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderItem } from '../models/order-items.model';

@Injectable({
  providedIn: 'root'
})
export class OrderItemsService {

  private baseUrl = 'http://localhost:8080/api/order-items'; // backend path

  constructor(private http: HttpClient) {}

  getAll(): Observable<OrderItem[]> {
    return this.http.get<OrderItem[]>(this.baseUrl);
  }

  getById(id: number): Observable<OrderItem> {
    return this.http.get<OrderItem>(`${this.baseUrl}/${id}`);
  }

  create(orderItem: OrderItem): Observable<OrderItem> {
    return this.http.post<OrderItem>(this.baseUrl, orderItem);
  }

  update(id: number, orderItem: OrderItem): Observable<OrderItem> {
    return this.http.put<OrderItem>(`${this.baseUrl}/${id}`, orderItem);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
