// add.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service'; // 백엔드 서비스 추가

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent {
  wordData = {
    frontend: '',
    backend: ''
  };

  constructor(private router: Router, private apiService: ApiService) { }

  onSave(): void {
    // 데이터 유효성 검사 등 추가 로직이 필요할 수 있습니다.

    // ApiService를 통해 백엔드 서버에 데이터 전송
    this.apiService.saveWord(this.wordData).subscribe(
      () => {
        console.log('Word saved successfully');
        // 페이지를 이동하거나 추가 로직을 수행할 수 있습니다.
        // this.router.navigate(['/some-page']);
      },
      error => console.error('Error saving word', JSON.stringify(error))
    );
  }
}
