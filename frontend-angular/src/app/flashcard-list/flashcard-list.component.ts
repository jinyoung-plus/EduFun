import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-flashcard-list',
  templateUrl: './flashcard-list.component.html',
  styleUrls: ['./flashcard-list.component.css']
})
export class FlashcardListComponent implements OnInit {
  decks: any[] = [];
  flashcards: any[] = [];
  selectedDeckId: number | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadDecks();
  }

  loadDecks(): void {
    this.apiService.getDecks().subscribe(
        (data: any[]) => {
          this.decks = data;
        },
        error => {
          console.error('Error fetching decks', error);
        }
    );
  }

  onDeckSelectChange(deckId: number): void {
    this.selectedDeckId = deckId;
    this.loadFlashcardsForDeck(deckId);
  }

  loadFlashcardsForDeck(deckId: number): void {
    if (deckId === null) return;
    const token = localStorage.getItem('authToken');
    if (token) {
      this.apiService.getFlashcardsForDeck(token, deckId).subscribe(
          (data: any[]) => {
            this.flashcards = data;
          },
          error => {
            console.error('Error fetching flashcards for the deck', error);
          }
      );
    } else {
      console.error('Authorization token not found');
    }
  }
}

