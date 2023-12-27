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



