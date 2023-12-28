// deck-list.component.ts
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-deck-list',
  templateUrl: './deck-list.component.html',
  styleUrls: ['./deck-list.component.css']
})
export class DeckListComponent implements OnInit {
  decks: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadDecks();
  }

    loadDecks(): void {
        this.apiService.getDecks().subscribe(
            (decksData: any[]) => {
                this.decks = decksData.sort((a, b) => a.name.localeCompare(b.name));
            },
            error => {
                console.error('Error fetching decks', error);
            }
        );
    }

    enableEditing(deck: any): void {
    deck.editing = true;
  }

  cancelEditing(deck: any): void {
    deck.editing = false;
    // Optionally refresh the deck list if you need to discard unsaved changes
    this.loadDecks();
  }

  saveChanges(deck: any): void {
    const updatedName = deck.name; // 수정된 덱 이름을 임시 변수에 저장합니다.
    const deckData = { name: updatedName }; // API가 예상하는 데이터 형식에 맞추어 객체를 생성합니다.

    this.apiService.updateDeck(deck.id, deckData).subscribe(
      () => {
        // 서버에서 덱 이름이 성공적으로 업데이트된 경우
        // 덱 객체의 editing 속성을 false로 설정하고
        // 덱 객체의 name 속성만 새로운 값으로 갱신합니다.
        const index = this.decks.findIndex(d => d.id === deck.id); // 수정된 덱의 인덱스를 찾습니다.
        if (index !== -1) {
          this.decks[index].name = updatedName; // 배열 내 해당 덱의 이름을 업데이트합니다.
        }
        deck.editing = false; // 인라인 편집 상태를 종료합니다.
        alert('Deck updated successfully');
      },
      error => {
        console.error('Failed to update deck', error);
        alert('Failed to update deck');
      }
    );
  }

  deleteDeck(deckId: number): void {
    if (confirm('Are you sure you want to delete this deck?')) {
      this.apiService.deleteDeck(deckId).subscribe(
        () => {
          alert('Deck deleted successfully');
          this.loadDecks(); // Reload the decks to reflect the change
        },
        error => {
          console.error('Error deleting deck', error);
          alert('Failed to delete the deck');
        }
      );
    }
  }
}
