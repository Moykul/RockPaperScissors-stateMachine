import { createMachine } from 'xstate';

const rockPaperScissorsTwoPlayerMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QCcD2BjA1gBQIYAcxkBldAS1llWVgBUB3VbAG1wE8iA6MiZsAYmK0AggCVaAbQAMAXUSh8qWGQAuZVADt5IAB6IAjPoBMAFk4mArAHZ9JqQDYjU-Q4A0INohP6AnJynWtlI+ABy2Fj5GAL5R7mhYeIQk5JTUdIws7Fz4rBzIAPIaYADCABaoZOgCovnFANLSckggispqmtp6CLZGAMzmIdZSvVbB9voW7p4IVn4WIY6zISFG9la9PjFxGDgERKQUVDQMTLnZZwVFZRVV-NjC2ACioo3ararqWs1dPf0mg6MRmMJr0pogRvZOE57JFDAEfPZhvYtiB4rskgdUscMhdODkspcSuVKgJiMUAJLEYj5UTEV7Nd7tL6gH52SG9fRWUwmezjXpSEJWMEICzeTiiiz2EJSWYudabWKonaJfYpI7pU4EvEXE7XEn8Gr1ekKJQfDrfAwbfTi3owuwhBE+UWgjyIKUhThhSw+ByC6zzFFolXJQ5pE6ZPLagm64m3e5PF6yN6mpmdAxszi9MIWIw+HwbVY+IWuhAhDZQywrIyDNYBEyB5V7ENYjUR87Rxh625kynU2nGlopz5p7reCycPMrey9CwWfS8kLCgC0878q0W89l0+GDYSTcx6vDuIgYBURAAtmQigB1K9FZD8a-kgByAH1sAAZYQATWer-0A6MsOFoIL0TgThy4z-PoIwmLmkwlhEVgTlYqErBYYHzhsu7oqqobYpqkYnmeyCXjed5EI+L7vl+v6iP+Ej6E0JptMBLLglmnDznBPpOPoCwzsKYHjjKAJSCYGzicY9aKkG+5qmGOJasRF5XmAt4aPeVFvp+P5-kYgFDua7GgbaXGRIMPK8lI4nrMKnJGJ686cjOPJjvYFg4cGB6KYRXAqaRakaVpAAiojCNehmscZujgjynBWP8tr-BJ-GJfYwpShOiKmFY8yDIY+hefJ+GtriaAAK4aBA+QAG6Uc+jwABq0K+NQAKrPiFUVmsysWlnB-gmHmeb8nl4wZSWRiJRORg9NKMEuDKnmyY2GIKQRbbIJwUC4OeYB1ZRoiPEIYiSEmDJGX1XQhIN4kjfmy0TcK3gevNs5gWsVjZsV62lUeymnqp5GaZRT46bRf60Ne+Q9amIH8h6piOIi+X5j4EwvdNnDTryIw2CYw1rDEioaKgJ7wM0cl-S2AN5Mm0XXYgK4zuYoyhBJrlco4y5GJKOPSpKoxSkWZYrdse404eSmRjwfAM71I5LeOBPVnm4QWOJL38WzPS8iY6zOeLSqS3htMy+2eSFESNxgAr8MmcYvRmHKMF2BJgTFtM3jWkYc1wQuHJcjKv1m9LfnbfieQxrb9tsf1nIYVxArztOiUBJjJYbB60owr4lgjD43gyRLuHNuHW2cAFZHqRRyBxzFXRLoKbPBLdvRc6sRiZR34rVhMwQBKhHeh+XvmV5V1WHfXl2MyONhSAl33WB5DrDaKwrTeOpgPR3tpZnlo8+ZtuK7ft08N0zMwuEvAKr0XTomNrHoG3r9gG5BEwk1EQA */
  id: 'rockPaperScissorsTwoPlayer',
  initial: 'idle',
  context: {
    playerOneChoice: null,
    playerTwoChoice: null,
    playerOneScore: 0,
    playerTwoScore: 0,
    roundsWonByPlayerOne: 0,
    roundsWonByPlayerTwo: 0,
  },
  states: {
    idle: {
      on: { START: 'playerOneChoice' }
    },
    playerOneChoice: {
      on: {
        ROCK: {
          target: 'playerTwoChoice',
          actions: 'setPlayerOneChoice'
        },
        PAPER: {
          target: 'playerTwoChoice',
          actions: 'setPlayerOneChoice'
        },
        SCISSORS: {
          target: 'playerTwoChoice',
          actions: 'setPlayerOneChoice'
        }
      }
    },
    playerTwoChoice: {
      on: {
        ROCK: {
          target: 'determineWinner',
          actions: 'setPlayerTwoChoice'
        },
        PAPER: {
          target: 'determineWinner',
          actions: 'setPlayerTwoChoice'
        },
        SCISSORS: {
          target: 'determineWinner',
          actions: 'setPlayerTwoChoice'
        }
      }
    },
    determineWinner: {
      entry: ['determineWinner', 'updateScore'],
      on: {
        WIN_PLAYER_TWO: "gameOver",

        DRAW: 'roundOver',
        WIN_PLAYER_2: { target: 'roundOver' },
        WIN_PLAYER_1: [
          { target: 'gameOver', cond: 'checkOverallWinner' },
          { target: 'roundOver' }
        ]
      }
    },
    roundOver: {
      on: { NEXT_ROUND: 'playerOneChoice' }
    },
    gameOver: {
      on: { RESTART: 'idle' }
    }
  }
}, {
  actions: {
    setPlayerOneChoice(context, event) {
      context.playerOneChoice = event.type; // Set Player One's choice
    },
    setPlayerTwoChoice(context, event) {
      context.playerTwoChoice = event.type; // Set Player Two's choice
    },
    determineWinner(context) {
      const { playerOneChoice, playerTwoChoice } = context;

      if (playerOneChoice === playerTwoChoice) {
        // Emit DRAW event
        return { type: 'DRAW' };
      } else if (
        (playerOneChoice === 'ROCK' && playerTwoChoice === 'SCISSORS') ||
        (playerOneChoice === 'SCISSORS' && playerTwoChoice === 'PAPER') ||
        (playerOneChoice === 'PAPER' && playerTwoChoice === 'ROCK')
      ) {
        // Emit WIN_PLAYER_ONE event
        return { type: 'WIN_PLAYER_ONE' };
      } else {
        // Emit WIN_PLAYER_TWO event
        return { type: 'WIN_PLAYER_TWO' };
      }
    },
    updateScore(context, event) {
      if (event.type === 'WIN_PLAYER_ONE') {
        context.roundsWonByPlayerOne += 1; // Increment Player One's round win count
      } else if (event.type === 'WIN_PLAYER_TWO') {
        context.roundsWonByPlayerTwo += 1; // Increment Player Two's round win count
      }

      // Log scores and round wins
      console.log(`Scores - Player One Wins this Round:${context.roundsWonByPlayerOne}, Player Two Wins this Round:${context.roundsWonByPlayerTwo}`);
    }
  },
  guards: {
    checkOverallWinner(context) {
      return context.roundsWonByPlayerOne === 2 || context.roundsWonByPlayerTwo === 2;
    }
  }
});