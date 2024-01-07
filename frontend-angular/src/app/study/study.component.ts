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
  private currentStudySessionId: number | null = null;
  isStudySessionActive: boolean = false;
  studySessionId: number | null = null;
  // Add new property to track if a flashcard review has started
  isFlashcardStudyActive: boolean = false;

    private getCurrentStudySessionId(): number | null {
        const storedSessionId = localStorage.getItem('activeStudySessionId');
        return storedSessionId ? parseInt(storedSessionId) : null;
    }

  constructor(
      private apiService: ApiService,
      private changeDetector: ChangeDetectorRef // 변경 감지기 추가
  ) {}

  ngOnInit(): void {
    this.getDecks();
    const activeSessionId = localStorage.getItem('activeStudySessionId');
    if (activeSessionId) {
      this.studySessionId = Number(activeSessionId);
      this.isStudySessionActive = true;
    }
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

  onSelectCardOrder(): void {
    if (this.cardOrder === 'srs') {
      // SRS 기반 학습 시작 로직을 호출합니다.
      this.beginFlashcardStudy();
    }
  }
  // Updated startStudy method
  // Method to begin flashcard review for a selected deck
    beginFlashcardStudy(): void {
        if (!this.selectedDeckId) {
            alert('Please select a deck to start studying.');
            return;
        }
        if (this.isFlashcardStudyActive) {
            alert('Flashcard study is already in progress.');
            return;
        }
        const deckId = Number(this.selectedDeckId);
        this.selectedDeck = this.decks.find(deck => deck.id === this.selectedDeckId);

        if (deckId) {
            const token = this.getToken();
            if (token) {
                // 학습 세션을 시작하는 로직을 추가합니다.
                this.startStudySession().then(() => {
                    // 세션 시작이 성공적으로 완료되면 카드를 가져옵니다.
                    if (this.cardOrder === 'srs') {
                        this.apiService.getFlashcardsForDeckSRS(token, deckId).subscribe(
                            (cards: Card[]) => {
                                // 카드를 ReviewCard 형태로 매핑합니다.
                                this.reviewSession = cards.map(card => ({
                                    ...card,
                                    review: false,
                                    currentInterval: 0,
                                    easinessFactor: 2.5,
                                    repetitions: 0,
                                }));
                                this.setFirstCard();
                            },
                            error => console.error('Error fetching flashcards for SRS', error)
                        );
                    } else {
                        this.apiService.getFlashcardsForDeck(token, deckId).subscribe(
                            (cards: Card[]) => {
                                this.reviewSession = cards.map(card => ({
                                    ...card,
                                    review: false,
                                    currentInterval: 0,
                                    easinessFactor: 2.5,
                                    repetitions: 0,
                                }));
                                // 카드 순서를 적용합니다.
                                if (this.cardOrder === 'random') {
                                    this.shuffleArray(this.reviewSession);
                                } else if (this.cardOrder === 'reverse') {
                                    this.reviewSession = this.reviewSession.reverse();
                                }
                                // 카드 방향을 적용합니다.
                                if (this.studyDirection === 'reverse') {
                                    this.reviewSession.forEach(card => {
                                        [card.front, card.back] = [card.back, card.front];
                                    });
                                }
                                this.setFirstCard();
                            },
                            error => console.error('Error fetching flashcards', error)
                        );
                    }
                }).catch(error => {
                    console.error('Failed to start a new study session', error);
                });
            } else {
                console.error('No auth token found');
            }
        } else {
            console.error('No deck selected');
        }
    }

  startStudySession(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isStudySessionActive) {
       // alert('A study session is already in progress.'); // 사용자에게 학습 세션이 이미 진행 중임을 알립니다.
        resolve();
        return;
      }

      const token = this.getToken();
      if (!token) {
        alert('You must be logged in to start a study session.');
        reject();
        return;
      }

      this.apiService.startStudySession(token).subscribe(
        (response) => {
          this.studySessionId = response.id;
          this.isStudySessionActive = true;
          localStorage.setItem('activeStudySessionId', this.studySessionId!.toString());
          alert('The study session has started.'); // 학습 세션 시작 메시지를 사용자에게 보여줍니다.
          resolve();
        },
        (error) => {
          console.error('Failed to start study session', error);
          if (error.status === 400) {
            alert(error.error.message);
          } else {
            alert('There was an error starting the study session. Please try again.');
          }
          reject();
        }
      );
    });
  }
    private createStudySessionId(): number {
    // 현재 시간의 타임스탬프를 유니크한 학습 세션 ID로 사용합니다.
    return Date.now();
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

    // Method to handle the review of a card
  // Method to handle the review of a card
  reviewCard(cardId: number, performanceRating: number): void {
    if (this.buttonsDisabled) {
      // If a request is already in process, do not proceed
      return;
    }

    this.buttonsDisabled = true; // Disable buttons to prevent duplicate submissions

    // Retrieve the user's auth token from local storage
    const token: string | null = localStorage.getItem('authToken');

    // Ensure that a study session ID is present before proceeding
    if (!this.studySessionId) {
      console.error('No active study session. Cannot create review.');
      this.buttonsDisabled = false; // Re-enable the buttons
      return;
    }

    // Find the selected card in the review session
    const card = this.reviewSession.find(card => card.id === cardId);
    if (!card || !token) {
      console.error(`Card with ID: ${cardId} not found in review session or user is not authenticated`);
      this.buttonsDisabled = false; // Re-enable the buttons
      return;
    }

    // Call the API service method to process the review on the backend
    this.apiService.processReview(token, {
      flashcardId: cardId,
      studySessionId: this.studySessionId,
      performanceRating: performanceRating
    }).subscribe(
      reviewResponse => {
        console.log('Review processed successfully', reviewResponse);
        // Update local state with the new repetition count and intervals as needed
        card.currentInterval = reviewResponse.newInterval;
        card.easinessFactor = reviewResponse.newEasinessFactor;
        card.repetitions = reviewResponse.repetitions;
        this.buttonsDisabled = false; // Re-enable the buttons
      },
      reviewError => {
        console.error('Failed to process review', reviewError);
        this.buttonsDisabled = false; // Re-enable the buttons
      }
    );
  }

    private calculateNextReviewDate(interval: number): Date {
        // Calculate the next review date based on the interval
        const nextReviewDate = new Date();
        nextReviewDate.setDate(nextReviewDate.getDate() + interval);
        return nextReviewDate;
    }


  getCurrentUserId(): number | null {
    const userId = localStorage.getItem('userId');
    // Check if the retrieved value is not null before parsing
    return userId ? parseInt(userId) : null;
  }
  // Utility method to get current user ID - placeholder for actual implementation


  // Utility method to retrieve the current user's token
  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // End the current study session
  // End the current study session
  endStudySession(): void {
    const token = this.getToken();
    if (!token) {
      alert('You must be logged in to end a study session.');
      return;
    }

    // Retrieve the session ID from localStorage
      const storedSessionId = localStorage.getItem('activeStudySessionId');
      const activeSessionId = storedSessionId ? parseInt(storedSessionId) : null;
      console.log('!!!! activeSessionId', activeSessionId);

      if (activeSessionId == null || !this.isStudySessionActive) {
          // 활성화된 학습 세션이 없을 때 메시지가 표시되지 않는 문제를 수정합니다.
          alert('There is no active study session to end.'); // 학습 세션이 시작되지 않았다는 메시지를 보여줍니다.
          return;
      }

    this.apiService.endStudySession(token, activeSessionId).subscribe(
      (response) => {
        this.isStudySessionActive = false;
        this.studySessionId = null;
        localStorage.removeItem('activeStudySessionId'); // Remove the session ID from localStorage
        alert('Study session ended successfully.');
        // Reset session state
        this.currentDeck = null;
        this.currentCard = null;
        this.currentCardIndex = 0;
        this.reviewSession = [];
        this.selectedDeckId = null;
      },
      (error) => {
        console.error('Failed to end study session', error);
      }
    );
  }
}
