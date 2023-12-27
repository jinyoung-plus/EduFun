// study.component.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../api.service';
import { Card, ReviewCard } from '../card.model';

@Component({
  selector: 'app-study',
  templateUrl: './study.component.html',
  styleUrls: ['./study.component.css']
})
export class StudyComponent implements OnInit {
  decks: any[] = [];
  selectedDeckId: number | null = null;
  selectedDeck: any; // Declare the selectedDeck property
  currentDeck: any;
  currentCard: ReviewCard | null = null; // To hold the current card
  currentCardIndex: number = 0; // To keep track of the current card's index
  reviewSession: ReviewCard[] = [];
  showAnswerFlag: boolean = false; // To determine whether to show the answer


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
      decks => this.decks = decks,
      error => console.error('Error fetching decks', error)
    );
  }

  startStudy(): void {
    // selectedDeckId가 문자열로 오고 있다면, 숫자로 변환합니다.
    const deckId = Number(this.selectedDeckId);
    this.selectedDeck = this.decks.find(deck => deck.id === this.selectedDeckId);

    if (deckId) {
      const token = localStorage.getItem('authToken') || '';

      if (token) {
        this.apiService.getFlashcardsForDeck(token, deckId).subscribe(
            (cards: Card[]) => {
              // 선택된 덱 ID와 일치하는 덱 객체를 찾습니다.
              this.currentDeck = this.decks.find(deck => deck.id === deckId);

              if (this.currentDeck) {
                this.reviewSession = cards.map(card => ({
                  ...card,
                  review: false,
                  currentInterval: 0, // 간격 초기화
                  easinessFactor: 2.5, // 용이성 계수 초기화

                }));
              } else {
                console.error('Selected deck not found in the decks array');
              }
            },
            error => console.error('Error fetching flashcards', error)
        );
      } else {
        console.error('No auth token found');
      }
    } else {
      console.error('No deck selected');
    }
    if (this.reviewSession.length > 0) {
      this.currentCardIndex = 0;
      this.currentCard = this.reviewSession[this.currentCardIndex];
      this.showAnswerFlag = false;
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
      this.showAnswerFlag = false; // Reset the answer flag
    }
  }

  nextCard(): void {
    if (this.currentCardIndex < this.reviewSession.length - 1) {
      this.currentCardIndex++;
      this.currentCard = this.reviewSession[this.currentCardIndex];
      this.showAnswerFlag = false; // Reset the answer flag
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
  }

  endSession(): void {
    // 세션 종료 로직을 추가합니다.
    // 예를 들어, 리뷰가 완료된 카드 정보를 서버에 저장하거나 사용자에게 피드백을 제공할 수 있습니다.
    alert('Study session ended');
    // 세션 종료 후에는 현재 덱과 리뷰 세션을 초기화합니다.
    this.currentDeck = null;
    this.reviewSession = [];
  }
}

