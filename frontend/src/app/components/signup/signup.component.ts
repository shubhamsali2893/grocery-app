import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  username = '';
  email = '';
  password = '';
  role = 'USER';
  error = '';
  success = '';

  constructor(private http: HttpClient, private router: Router, private auth: AuthService) {}

  signup() {
    this.http.post<any>('http://localhost:8080/api/auth/signup', {
      username: this.username,
      email: this.email,
      password: this.password,
      role: this.role
    }).subscribe({
      next: (res) => {
        // Option 1: Show success and redirect to login
        // this.success = 'Signup successful! Please login.';
        // setTimeout(() => this.router.navigate(['/login']), 1500);

        // Option 2: Show success and redirect to home
        // this.success = 'Signup successful! Redirecting to home...';
        // setTimeout(() => this.router.navigate(['/']), 1500);

        // Option 3: Auto-login after signup (default)
        this.auth.setAuth(res.token, { username: res.username, email: res.email, role: res.role });
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.error = err.error;
      }
    });
  }
}
