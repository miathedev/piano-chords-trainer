import React, { useState, useEffect, useRef } from 'react';
import { getRandomChord, checkChordMatch, ROOT_NOTES } from './utils/midi';
import { getHighScore, setHighScore } from './utils/cookies';
import { startAudioContext, playNoteOn, playNoteOff, playChord } from './utils/audio';
import { Keyboard } from './Keyboard';
import { Guide } from './Guide';
import './index.css';

function App() {
  const [midiAccess, setMidiAccess] = useState(null);
  const [targetChord, setTargetChord] = useState(getRandomChord());
  const [activeNotes, setActiveNotes] = useState(new Set());
  const [score, setScore] = useState(0);
  const [highScore, setHighScoreState] = useState(getHighScore());
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [showSolution, setShowSolution] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const activeNotesRef = useRef(activeNotes);
  const targetChordRef = useRef(targetChord);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const requestRef = useRef(null);

  useEffect(() => {
    activeNotesRef.current = activeNotes;
  }, [activeNotes]);

  useEffect(() => {
    targetChordRef.current = targetChord;
  }, [targetChord]);

  useEffect(() => {
    navigator.requestMIDIAccess()
      .then(onMIDISuccess, onMIDIFailure);

    function onMIDISuccess(access) {
      setMidiAccess(access);
      for (let input of access.inputs.values()) {
        input.onmidimessage = getMIDIMessage;
      }
      access.onstatechange = (e) => {
        // Re-attach listeners if devices change
        for (let input of access.inputs.values()) {
          input.onmidimessage = getMIDIMessage;
        }
      };
    }

    function onMIDIFailure(msg) {
      setError("Failed to get MIDI access. Make sure you are using a compatible browser (like Chrome/Edge) and have a MIDI keyboard connected.");
    }
  }, []);

  function getMIDIMessage(message) {
    const command = message.data[0];
    const note = message.data[1];
    const velocity = (message.data.length > 2) ? message.data[2] : 0;

    startAudioContext().then(() => {
      if (command === 144 && velocity > 0) {
        // Note On
        const normalizedVelocity = velocity / 127;
        playNoteOn(note, normalizedVelocity);
        setActiveNotes(prev => {
          const newSet = new Set(prev);
          newSet.add(note);
          return newSet;
        });
      } else if (command === 128 || (command === 144 && velocity === 0)) {
        // Note Off
        playNoteOff(note);
        setActiveNotes(prev => {
          const newSet = new Set(prev);
          newSet.delete(note);
          return newSet;
        });
      }
    });
  }

  const updateProgress = (timestamp) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp;
    const elapsed = timestamp - startTimeRef.current;
    
    if (elapsed >= 1000) {
      // 1 second passed
      setProgress(100);
      handleSuccess();
    } else {
      setProgress((elapsed / 1000) * 100);
      requestRef.current = requestAnimationFrame(updateProgress);
    }
  };

  const handleSuccess = () => {
    cancelAnimationFrame(requestRef.current);
    timerRef.current = null;
    
    // Increment score
    setScore(s => {
      const newScore = s + 1;
      if (newScore > highScore) {
        setHighScoreState(newScore);
        setHighScore(newScore);
      }
      return newScore;
    });
    
    // Reset progress and get new chord
    setTimeout(() => {
      setProgress(0);
      setShowSolution(false);
      const nextChord = getRandomChord();
      setTargetChord(nextChord);
      playChord(nextChord.pitchClasses, nextChord.root);
    }, 200); // small delay to see full bar
  };

  useEffect(() => {
    const isMatch = checkChordMatch(activeNotes, targetChord.pitchClasses);
    
    if (isMatch && !timerRef.current) {
      // Start timer
      startTimeRef.current = performance.now();
      timerRef.current = true;
      requestRef.current = requestAnimationFrame(updateProgress);
    } else if (!isMatch && timerRef.current) {
      // Cancel timer
      cancelAnimationFrame(requestRef.current);
      timerRef.current = null;
      setProgress(0);
    }
  }, [activeNotes, targetChord]);

  const activeNoteNames = Array.from(activeNotes)
    .sort((a, b) => a - b)
    .map(note => `${ROOT_NOTES[note % 12]}${Math.floor(note / 12) - 1}`);

  return (
    <>
      <div className="app-container">
        <header>
          <div className="score-board">
            <div className="score-item">
              <span className="label">Score</span>
              <span className="value">{score}</span>
            </div>
            <div className="score-item">
              <span className="label">High Score</span>
              <span className="value">{highScore}</span>
            </div>
          </div>
          {midiAccess ? (
            <div className="status connected">MIDI Connected</div>
          ) : (
            <div className="status disconnected">Waiting for MIDI...</div>
          )}
        </header>

        <main>
          {error ? (
            <div className="error">{error}</div>
          ) : (
            <div className="chord-display">
              <h2>Play the chord:</h2>
              <div className="target-chord">{targetChord.name}</div>
              <div className="button-group">
                <button 
                  className="play-btn"
                  onClick={() => {
                    startAudioContext().then(() => {
                      playChord(targetChord.pitchClasses, targetChord.root);
                    });
                  }}
                >
                  Hear Chord
                </button>
                <button 
                  className="solution-btn"
                  onClick={() => setShowSolution(true)}
                >
                  Show Solution
                </button>
                <button 
                  className="guide-btn"
                  onClick={() => setShowGuide(true)}
                >
                  Theory Guide
                </button>
              </div>

              {showSolution && (
                <div className="solution-text">
                  <Keyboard targetChord={targetChord} />
                </div>
              )}
              
              <div className="progress-container">
                <div 
                  className={`progress-bar ${progress === 100 ? 'success' : ''}`} 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </main>

        <footer>
          <p>Hold the chord for 1 second to score.</p>
          <div className="active-notes">
            Active Notes: {activeNoteNames.length > 0 ? activeNoteNames.join(', ') : 'None'}
          </div>
        </footer>
      </div>
      {showGuide && <Guide onClose={() => setShowGuide(false)} />}
    </>
  );
}

export default App;
