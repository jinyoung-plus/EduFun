import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {
  signupData = {
    username: '',
    password: ''
  };

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onSignup(): void {
    if (this.signupData.username === 'admin' && this.signupData.password === 'admingong') {
      // 로그인 성공, admin 페이지로 이동
      this.router.navigate(['/admin']);
    } else {
      // 로그인 실패, 에러 메시지 표시 등
      console.error('Invalid login credentials');
    }
  }
}
