import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private http: HttpClient, private router: Router, private auth: AuthService) {}

  login() {
    this.http.post<any>('http://localhost:8080/api/auth/login', {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        this.auth.setAuth(res.token, { username: res.username, email: res.email, role: res.role });
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.error = err.error;
      }
    });
  }
}
