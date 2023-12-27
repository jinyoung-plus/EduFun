// EduFun/frontend-angular/src/app/signup/signup.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service'; // Import the ApiService

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupData = {
<<<<<<< HEAD
    email: '',
=======
    username: '',
>>>>>>> 2bef0d337ba1be9af7f9a79a70dd3cab85f37d25
    password: ''
  };

  constructor(
      private router: Router,
      private apiService: ApiService // Inject the ApiService
  ) {}

  ngOnInit(): void {
    // 초기화 로직이 필요하다면 여기에 작성
  }

  onSignup(): void {
<<<<<<< HEAD
    // Use the ApiService for the signup process
    this.apiService.signup(this.signupData.email, this.signupData.password).subscribe({
      next: (_response) => {
        // 회원가입 성공 메시지 표시
        alert('Registration successful! Redirecting to login page.');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        // 중복 이메일 에러 메시지 표시
        if (error.status === 409) {
          alert('This email is already registered. Please use a different email.');
        } else {
          // 다른 종류의 에러 처리
          console.error('Signup failed:', error);
          alert('An error occurred during signup. Please try again.');
        }
      }
    });
=======
    if (this.signupData.username === 'admin' && this.signupData.password === 'admingong') {
      // 로그인 성공, admin 페이지로 이동
      this.router.navigate(['/admin']);
    } else {
      // 로그인 실패, 에러 메시지 표시 등
      console.error('Invalid login credentials');
    }
>>>>>>> 2bef0d337ba1be9af7f9a79a70dd3cab85f37d25
  }
}
