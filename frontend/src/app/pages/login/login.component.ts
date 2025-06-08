import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterLink, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error = '';
  success = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.error = '';
    this.success = '';
    this.loading = true;
    this.http.post('http://localhost:3000/auth/login', {
      email: this.email,
      senha: this.password,
    }).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        this.success = 'Login realizado com sucesso!';
        setTimeout(() => {
          this.router.navigate(['/tasks']);
        }, 1000);
      },
      error: err => {
        this.error = err.error?.message || 'Erro no login';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}