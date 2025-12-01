import { useState, useRef, useEffect } from "react";
import "./App.css";
import finishSound from "./assets/finishSound.mp3";

function App() {
  // Timer states
  const [totalTimer, setTotalTimer] = useState(0);
  const [exerciseTimer, setExerciseTimer] = useState(0);
  const [timerStarted, setTimerStarted] = useState(false);
  const [wantSound, setWantSound] = useState(false);

  // Refs to hold current timer values for intervals
  const totalTimerRef = useRef(totalTimer);
  const exerciseTimerRef = useRef(exerciseTimer);
  const formRef = useRef();

  // Preload audio once
  const finishAudio = useRef(new Audio(finishSound));

  // Play a finish sound if enabled
  function playFinishSound() {
    if (wantSound) {
      finishAudio.current.play();
    }
  }

  // Keep refs updated with current stat
  useEffect(() => {
    totalTimerRef.current = totalTimer;
  }, [totalTimer]);

  useEffect(() => {
    exerciseTimerRef.current = exerciseTimer;
  }, [exerciseTimer]);

  // Handle Start button click
  function handleStart(e) {
    e.preventDefault();
    setTimerStarted(true);

    const totalTimerIntervalId = setInterval(() => {
      setTotalTimer((prev) => {
        // If total timer reached 0
        if (prev === 0) {
          playFinishSound();

          setExerciseTimer(0);
          setTimerStarted(false);
          clearInterval(totalTimerIntervalId);
          clearInterval(exerciseTimerIntervalId);

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const exerciseTimerIntervalId = setInterval(() => {
      // If total timer is still running
      if (totalTimerRef.current > 0) {
        setExerciseTimer((prev) => {
          // Exercise timer reached 0 -> reset it
          if (prev === 0) {
            return (exerciseTimerRef.current = exerciseTimer) - 1;
          }

          // Otherwise keep counting down
          return prev - 1;
        });
      }
    }, 1000);

    // Reset input form on timer start
    formRef.current.reset();
  }

  // Timer display
  const totalTimerMinutes = Math.floor(totalTimer / 60);
  const totalTimerSeconds = totalTimer % 60;

  return (
    <div className="App">
      <div className="App__timers-container">
        <h1 className="App__total-timer-display">
          {totalTimerMinutes}:{totalTimerSeconds.toString().padStart(2, "0")}
        </h1>

        <h2 className="App__exercise-timer-display">
          0:{exerciseTimer.toString().padStart(2, "0")}
        </h2>
      </div>

      {timerStarted ? (
        <button
          className="App__restart-button"
          onClick={() => {
            setTimerStarted(false);
            setTotalTimer(0);
            setExerciseTimer(0);
          }}
        >
          Restart
        </button>
      ) : (
        <form ref={formRef} onSubmit={handleStart} className="App__form">
          <input
            type="number"
            placeholder="Total time (10 to 20 min.):"
            onChange={(e) => setTotalTimer(Number(e.target.value * 60))}
            min={10}
            max={20}
            required
          />

          <input
            type="number"
            id="exerciseTime"
            placeholder=" Exercise time (10 to 60 sec.):"
            onChange={(e) => setExerciseTimer(Number(e.target.value))}
            min={10}
            max={60}
            required
          />

          <button type="submit" className="App__start-button">
            Start
          </button>
          <button
            type="button"
            className="App__sound-button"
            onClick={() => setWantSound((prevValue) => !prevValue)}
          >
            {wantSound ? "Sound on" : "Sound off"}
          </button>
        </form>
      )}
    </div>
  );
}

export default App;
