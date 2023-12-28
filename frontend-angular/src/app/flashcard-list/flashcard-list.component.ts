// flashcard-list.component.ts
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
          this.decks = data.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
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

  enableFlashcardEditing(flashcard: any): void {
    flashcard.editing = true;
    // You might want to make a copy of the flashcard in case the user cancels editing
    flashcard.originalFront = flashcard.front;
    flashcard.originalBack = flashcard.back;
  }

  cancelFlashcardEditing(flashcard: any): void {
    flashcard.editing = false;
    // Revert changes if the user cancels editing
    flashcard.front = flashcard.originalFront;
    flashcard.back = flashcard.originalBack;
  }

  saveFlashcardChanges(flashcard: any): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.apiService.updateFlashcard(token, flashcard.id, flashcard.front, flashcard.back).subscribe(
          response => {
            console.log('Flashcard updated successfully', response);
            flashcard.editing = false;
            // Update local flashcards array or reload flashcards here if needed
          },
          error => {
            console.error('Failed to update flashcard', error);
          }
      );
    } else {
      console.error('Authorization token not found');
    }
  }

  deleteFlashcard(flashcardId: number): void {
    const token = localStorage.getItem('authToken');
    if (token && confirm('Are you sure you want to delete this flashcard?')) {
      this.apiService.deleteFlashcard(token, flashcardId).subscribe(
          response => {
            console.log('Flashcard deleted successfully', response);
            // Remove the deleted flashcard from the local array
            this.flashcards = this.flashcards.filter(flashcard => flashcard.id !== flashcardId);
          },
          error => {
            console.error('Failed to delete flashcard', error);
          }
      );
    } else {
      console.error('Authorization token not found or user cancelled delete action');
    }
  }

}

