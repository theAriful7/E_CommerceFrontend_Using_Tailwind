import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SubCategoryRequest, SubCategoryResponse } from '../models/sub-category.model';

@Injectable({
  providedIn: 'root'
})
export class SubCategoryService {

    private baseUrl = 'http://localhost:8080/api/sub-categories';

  //  private apiUrl = `${environment.apiUrl}/sub-categories`;

  constructor(private http: HttpClient) { }

  // Create SubCategory
  createSubCategory(subCategory: SubCategoryRequest): Observable<SubCategoryResponse> {
    return this.http.post<SubCategoryResponse>(this.baseUrl, subCategory);
  }

  // Get All SubCategories
  getAllSubCategories(): Observable<SubCategoryResponse[]> {
    return this.http.get<SubCategoryResponse[]>(this.baseUrl);
  }

  // Get SubCategory by ID
  getSubCategoryById(id: number): Observable<SubCategoryResponse> {
    return this.http.get<SubCategoryResponse>(`${this.baseUrl}/${id}`);
  }

  // Get SubCategories by Category ID
  getSubCategoriesByCategory(categoryId: number): Observable<SubCategoryResponse[]> {
    return this.http.get<SubCategoryResponse[]>(`${this.baseUrl}/category/${categoryId}`);
  }

  // Update SubCategory
  updateSubCategory(id: number, subCategory: SubCategoryRequest): Observable<SubCategoryResponse> {
    return this.http.put<SubCategoryResponse>(`${this.baseUrl}/${id}`, subCategory);
  }

  // Delete SubCategory
  deleteSubCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Search SubCategories
  searchSubCategories(keyword: string): Observable<SubCategoryResponse[]> {
    const params = new HttpParams().set('keyword', keyword);
    return this.http.get<SubCategoryResponse[]>(`${this.baseUrl}/search`, { params });
  }
}
