import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/tasks';

  constructor(private http: HttpClient) {}

  getTasks(filtros: { status?: string, data_vencimento?: string }) {
    return this.http.get<any[]>(this.apiUrl, { params: filtros });
  }

  createTask(data: { titulo: string, descricao?: string, status?: string, data_vencimento?: string }) {
    return this.http.post<any>(this.apiUrl, data);
  }

  updateTask(id: number, data: any) {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  deleteTask(id: number) {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  shareTask(taskId: number, email: string) {
    return this.http.post<any>(`${this.apiUrl}/${taskId}/share`, { email });
  }

  unshareTask(taskId: number, email: string) {
    return this.http.post<any>(`${this.apiUrl}/${taskId}/unshare`, { email });
  }
}
