import { useCallback, useEffect, useState } from 'react';
import words from './wordList.json';
import { HangerDrawing } from './components/HangerDrawing';
import Keyboard from './components/Keyboard';
import { HangerWord } from './components/HangerWord';

function getWord() {
  return words[Math.floor(Math.random() * words.length)];
}

const App = () => {
  const [wordToGuess, setWordToGuess] = useState(getWord);

  const [guessedLetters, setGuessLetters] = useState<string[]>([]);

  const inCorrectLetters = guessedLetters.filter((letter) => !wordToGuess.includes(letter));

  const isLoser = inCorrectLetters.length >= 6;

  const isWinner = wordToGuess.split('').every((letter) => guessedLetters.includes(letter));

  const addGuessedLetter = useCallback(
    (letter: string) => {
      if (guessedLetters.includes(letter) || isLoser || isWinner) return;

      setGuessLetters((currentLetters) => [...currentLetters, letter]);
    },
    [guessedLetters, isWinner, isLoser]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key;

      if (!key.match(/^[a-z]$/)) return;

      e.preventDefault();
      addGuessedLetter(key);
    };

    document.addEventListener('keypress', handler);

    return () => {
      document.removeEventListener('keypress', handler);
    };
  }, [guessedLetters]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key;

      if (key !== 'Enter') return;

      e.preventDefault();
      setGuessLetters([]);
      setWordToGuess(getWord());
    };

    document.addEventListener('keypress', handler);

    return () => {
      document.removeEventListener('keypress', handler);
    };
  }, []);

  return (
    <div
      style={{
        maxWidth: '800px',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        margin: '0 auto',
        alignItems: 'center'
      }}
    >
     

      <div style={{ fontSize: '2rem', textAlign: 'center' }}>
        <h1>HANG MAN WORD GAME</h1>
        {isWinner && 'Winner! - Start New '}
        {isLoser && `Looser!!\b Press "Enter" to try again`}
      </div>
      <HangerDrawing numberOfGuesses={inCorrectLetters.length} />
      <HangerWord reveal={isLoser} guessedLetters={guessedLetters} wordToGuess={wordToGuess} />
      <div style={{ alignSelf: 'stretch' }}>
        <Keyboard
          disabled={isWinner || isLoser}
          activeLetters={guessedLetters.filter((letter) => wordToGuess.includes(letter))}
          inactiveLetters={inCorrectLetters}
          addGuessedLetter={addGuessedLetter}
        />
      </div>
    </div>
  );
};

export default App;
