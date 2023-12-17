import { Component } from '@angular/core';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'EduFun';
  userName: string = ''; // 사용자 이름을 저장할 변수
  message: string = ''; // 사용자에게 표시할 메시지를 저장할 변수

  constructor(private userService: UserService) {} // UserService를 주입합니다.

  saveName(): void {
    console.log('Sending username to backend:', this.userName);
    // Send the userName to the server and subscribe to the response
    this.userService.saveUserName(this.userName).subscribe(
      response => {
        console.log('Response:', response);
        this.message = '이름이 입력되었습니다.'; // 메시지 업데이트
        this.userName = ''; // 입력 필드 초기화
      },
      error => {
        console.error('Error:', error);
        this.message = '오류가 발생했습니다. 다시 시도해 주세요.'; // 오류 메시지 설정
      }
    );
  }
}


