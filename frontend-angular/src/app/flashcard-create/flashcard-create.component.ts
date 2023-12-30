// flashcard-create.component.ts
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
    selector: 'app-flashcard-create',
    templateUrl: './flashcard-create.component.html',
    styleUrls: ['./flashcard-create.component.css']
})
export class FlashcardCreateComponent implements OnInit {
    decks: any[] = [];
    selectedDeckId: number | null = null;
    front = '';
    back = '';
    selectedFile: File | null = null;

    constructor(private apiService: ApiService) {}

    ngOnInit(): void {
        this.loadDecks();
    }

    loadDecks(): void {
        this.apiService.getDecks().subscribe(
            (data: any[]) => {
                this.decks = data.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
            },
            error => {
                console.error('Error fetching decks', error);
            }
        );
    }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
    } else {
      this.selectedFile = null;
    }
  }

    uploadCsv(): void {
        // selectedDeckId와 selectedFile이 유효한지 확인합니다.
        if (!this.selectedDeckId) {
            alert('Please select a deck before uploading.');
            return;
        }

        if (!this.selectedFile) {
            alert('Please select a CSV file to upload.');
            return;
        }

        // 파일을 파싱하는 함수를 호출합니다.
        this.parseCsvFile(this.selectedFile);
    }

  convertCsvToFlashcards(csvText: string): { front: string, back: string }[] {
    const flashcards = [];
    const lines = csvText.split('\n');

    for (let line of lines) {
      const [front, back] = line.split(',').map(s => s.trim());

      // 간단한 유효성 검사: 빈 줄이나 누락된 데이터가 있는 줄은 건너뜁니다.
      if (!front || !back) {
        continue;
      }

      flashcards.push({ front, back });
    }

    return flashcards;
  }

  parseCsvFile(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === 'string') {
        const flashcards = this.convertCsvToFlashcards(text);

        // deckId가 null이 아닌 경우에만 bulkAddFlashcards를 호출합니다.
        if (this.selectedDeckId !== null) {
          this.bulkAddFlashcards(this.selectedDeckId, flashcards);
        }
      }
    };
    reader.readAsText(file);
  }

    bulkAddFlashcards(deckId: number, flashcards: { front: string, back: string }[]): void {
        // API 서비스를 사용하여 여러 플래시카드를 추가하는 로직 구현
        // 예를 들어:
        this.apiService.addFlashcardsBulk(deckId, flashcards).subscribe({
            next: data => {
                console.log('Flashcards added successfully', data);
                alert('Flashcards added to deck.');
                // 성공 후 필요한 추가 작업 수행
            },
            error: error => {
                console.error('Error adding flashcards', error);
                alert('Failed to add flashcards.');
            }
        });
    }

    onDeckSelectChange(deckId: string): void {
        // Convert to number and ensure it's not null
        const id = Number(deckId);
        if (!isNaN(id)) {
            this.selectedDeckId = id;
        } else {
            this.selectedDeckId = null;
        }
    }

    addFlashcard(): void {
        if (this.selectedDeckId) {
            if (!this.front.trim() || !this.back.trim()) {
                alert('Please fill in both front and back of the flashcard.');
                return;
            }

            this.apiService.addFlashcard(this.selectedDeckId, this.front, this.back).subscribe({
                next: data => {
                    console.log('Flashcard created successfully', data);
                    alert('Flashcard added to deck.');
                    this.front = ''; // Reset the form fields
                    this.back = '';
                },
                error: error => {
                    console.error('Error creating flashcard', error);
                    alert('Failed to add flashcard.');
                }
            });
        } else {
            alert('Please select a deck first.');
        }
    }
}



