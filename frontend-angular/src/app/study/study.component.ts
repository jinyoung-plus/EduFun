// study.component.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../api.service';
import { Deck, Card, ReviewCard } from '../card.model';

@Component({
  selector: 'app-study',
  templateUrl: './study.component.html',
  styleUrls: ['./study.component.css']
})
export class StudyComponent implements OnInit {
  decks: any[] = [];
  selectedDeckId: number | null = null;
  selectedDeck?: Deck; // Declare the selectedDeck property
  currentDeck: any;
  currentCard?: Card | null = null; //ReviewCard | null = null; // To hold the current card
  currentCardIndex: number = 0; // To keep track of the current card's index
  reviewSession: ReviewCard[] = [];
  showAnswerFlag: boolean = false; // To determine whether to show the answer
  reviewMade = false;
  buttonsDisabled = false;
  public userMessage: string = ''; // 사용자 메시지를 위한 속성 추가
  studyDirection: string = 'basic'; // New property for study direction
  cardOrder: string = 'sequential'; // New property for card order

  constructor(
      private apiService: ApiService,
      private changeDetector: ChangeDetectorRef // 변경 감지기 추가
  ) {}

  ngOnInit(): void {
    this.getDecks();
  }

  onSelectDeck(): void {
    this.selectedDeck = this.decks.find(deck => deck.id === this.selectedDeckId);
    // Perform additional logic if necessary
  }

  getDecks(): void {
    this.apiService.getDecks().subscribe(
        (decks) => {
          this.decks = decks.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
        },
      error => {
        console.error('Error fetching decks', error);
      }
    );
  }
  // Updated startStudy method
  startStudy(): void {
    if (!this.selectedDeckId) {
      alert('Please select a deck to start studying.');
      return;
    }
    const deckId = Number(this.selectedDeckId);
    this.selectedDeck = this.decks.find(deck => deck.id === this.selectedDeckId);

    if (deckId) {
      const token = localStorage.getItem('authToken') || '';
      if (token) {
        this.apiService.getFlashcardsForDeck(token, deckId).subscribe(
          (cards: Card[]) => {
            this.reviewSession = cards.map(card => ({
              ...card,
              review: false,
              currentInterval: 0,
              easinessFactor: 2.5,
            }));

            // Randomize the cards if 'random' is selected
            if (this.cardOrder === 'random') {
              this.shuffleArray(this.reviewSession);
            }

            // Reverse the cards if 'reverse' is selected
            if (this.studyDirection === 'reverse') {
              this.reviewSession.forEach(card => {
                [card.front, card.back] = [card.back, card.front];
              });
            }

            // Set the first card
            this.setFirstCard();
          },
          error => console.error('Error fetching flashcards', error)
        );
      } else {
        console.error('No auth token found');
      }
    } else {
      console.error('No deck selected');
    }
  }

// Utility method to shuffle an array
  shuffleArray(array: any[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Method to set the first card of the session
  setFirstCard(): void {
    if (this.reviewSession.length > 0) {
      this.currentCardIndex = 0;
      this.currentCard = this.reviewSession[this.currentCardIndex];
      this.showAnswerFlag = false;
      this.changeDetector.detectChanges(); // Update the view
    }
  }

  showAnswer(): void {
    // Toggle the flag to show the answer
    if (this.currentCard) {
      this.showAnswerFlag = true;
    }
  }

  previousCard(): void {
    if (this.currentCardIndex > 0) {
      this.currentCardIndex--;
      this.currentCard = this.reviewSession[this.currentCardIndex];
      this.showAnswerFlag = false;
      this.reviewMade = false;
      this.buttonsDisabled = false;
      this.userMessage = ''; // 메시지 초기화
    } else {
      // Display message when the user is at the first card
      alert('There is no more card.');
    }
  }

  nextCard(): void {
    if (this.currentCardIndex < this.reviewSession.length - 1) {
      this.currentCardIndex++;
      this.currentCard = this.reviewSession[this.currentCardIndex];
      this.showAnswerFlag = false;
      this.reviewMade = false;
      this.buttonsDisabled = false;
      this.userMessage = ''; // 메시지 초기화
    } else {
      // Display message when the user is at the last card
      alert('There is no more card.');
    }
  }

  reviewCard(cardId: number, performanceRating: number): void {
    if (!this.currentCard) {
      console.error('No card is currently selected.');
      return;
    }
    console.log(`Reviewing card with ID: ${cardId} and performance rating: ${performanceRating}`);

    const card = this.reviewSession.find(card => card.id === cardId);
    if (!card) {
      console.error(`Card with ID: ${cardId} not found in review session`);
      return;
    }

    console.log('Sending SRS calculation request to the backend with:', {
      performanceRating: performanceRating,
      currentInterval: card.currentInterval,
      easinessFactor: card.easinessFactor,
    });

    this.apiService.calculateSRS(
        performanceRating,
        card.currentInterval,
        card.easinessFactor
    ).subscribe(
        response => {
          console.log('Received SRS calculation response:', response);
          card.currentInterval = response.newInterval;
          card.easinessFactor = response.newEasinessFactor;
          card.review = true;

          console.log(`Updating card with ID: ${cardId}`);
          this.apiService.updateCard(cardId, {
            currentInterval: response.newInterval,
            easinessFactor: response.newEasinessFactor
          }).subscribe(
              () => console.log(`Card with ID: ${cardId} updated successfully`),
              updateError => console.error(`Failed to update card with ID: ${cardId}`, updateError)
          );
        },
        srsError => console.error('Error calculating SRS', srsError)
    );
    this.reviewMade = true;
    this.buttonsDisabled = true;
  }

  endSession(): void {
    if (this.currentDeck && this.reviewSession.length) {
      const token = localStorage.getItem('authToken') || '';
      const reviewedCards = this.reviewSession.filter(card => card.review);

      if (token && reviewedCards.length) {
        this.apiService.saveSession(token, reviewedCards).subscribe(
            (response: any) => { // Ideally, replace 'any' with a more specific type
              // Handle the response here
              alert('Study session saved.');
            },
            (error: any) => { // Ideally, replace 'any' with a more specific type
              console.error('Failed to save session', error);
            }
        );
      }
    }



    alert('Reset study session.');
    // Reset session state
    this.currentDeck = null;
    this.currentCard = null;
    this.currentCardIndex = 0;
    this.reviewSession = [];
    this.selectedDeckId = null;
  }
}

