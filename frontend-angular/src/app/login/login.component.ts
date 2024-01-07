// EduFun/frontend-angular/src/app/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ApiService } from '../api.service'; // Import the ApiService

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginData = {
    email: '',
    password: ''
  };
  loginError = '';

  constructor(
      private router: Router,
      private apiService: ApiService, // Inject the ApiService
      private authService: AuthService
  ) { }

  ngOnInit(): void {
    // localStorage에서 signupEmail 값을 가져옵니다.
    const signupEmail = localStorage.getItem('signupEmail');
    if (signupEmail) {
      this.loginData.email = signupEmail;

      // 더 이상 필요하지 않으므로 signupEmail을 localStorage에서 삭제합니다.
      localStorage.removeItem('signupEmail');
    }
  }

  onLogin(): void {
    // Use the ApiService for the login process
    this.apiService.login(this.loginData.email, this.loginData.password).subscribe({
      next: (response: any) => {
        // Store user data in localStorage upon successful login
        localStorage.setItem('user', JSON.stringify({ email: this.loginData.email, token: response.token }));

        this.authService.setToken(response.token);
        this.authService.setUserEmail(this.loginData.email);

        // Navigate to a page that will show "Welcome, [User's Email]!"
        this.router.navigate(['/']);
      },
      error: (error) => {
        let userAction: string | null;
        switch (error.status) {
          case 404:
            userAction = window.confirm('Account not found. Do you want to sign up?') ? 'yes' : 'no';
            if (userAction === 'yes') {
              this.router.navigate(['/signup']);
            } else {
              this.router.navigate(['/login']);
            }
            break;
          case 401:
            userAction = window.confirm('Password is incorrect. Do you want to reset your password?') ? 'yes' : 'no';
            if (userAction === 'yes') {
              // Implement password reset logic here
              this.router.navigate(['/reset-password'], { queryParams: { email: this.loginData.email } });
            } else {
              this.router.navigate(['/login']);
            }
            break;
          default:
            this.loginError = 'An unexpected error occurred. Please try again later.';
            break;
        }
      }
    });
  }

  // 로그아웃 함수를 정의합니다.
  logout(): void {
    // Call logout from AuthService to clear the user's session
    this.authService.logout();

    // Optionally check the user's logged-in status or perform other cleanup
    // Navigate the user back to the home page or login page
    this.router.navigate(['/login']).then(() => {
      // Perform any additional operations after successful navigation if needed
      window.location.reload(); // This is to refresh the app and clear any authenticated state
    });
  }
}
