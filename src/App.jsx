import { useState, useRef, useEffect } from "react";
import "./App.css";
import finishSound from "./assets/finishSound.mp3";
import exerciseChangeSound from "./assets/exerciseChangeSound.mp3";

function App() {
  const [totalTimer, setTotalTimer] = useState(0);
  const [exerciseTimer, setExerciseTimer] = useState(0);
  const [started, setStarted] = useState(false);
  const totalTimerRef = useRef(totalTimer);
  const exerciseTimerRef = useRef(exerciseTimer);
  const formRef = useRef();

  useEffect(() => {
    totalTimerRef.current = totalTimer;
  }, [totalTimer]);

  useEffect(() => {
    exerciseTimerRef.current = exerciseTimer;
  }, [exerciseTimer]);

  function playSound(sound) {
    const audio = new Audio(sound);
    audio.play();
  }

  function handleStart(e) {
    e.preventDefault();
    setStarted(true); // mark timer as started

    const totalTimerIntervalId = setInterval(() => {
      setTotalTimer((prev) => {
        // If total timer reached 0
        if (prev === 0) {
          playSound(finishSound);
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
            playSound(exerciseChangeSound);
            return (exerciseTimerRef.current = exerciseTimer) - 1;
          }

          // Otherwise keep counting down
          return prev - 1;
        });
      }

      // Total timer is finished -> stop everything
      else {
        clearInterval(exerciseTimerIntervalId);
        setExerciseTimer(0);
        setStarted(false);
      }
    }, 1000);

    formRef.current.reset();
  }

  /* When click start and total timer is still running set states to 0*/

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

      {started ? (
        <button
          className="App__restart-button"
          onClick={() => {
            setStarted(false);
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
            onChange={(e) => setTotalTimer(Number(e.target.value) * 60)}
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

          <button className="App__start-button">Start</button>
        </form>
      )}
    </div>
  );
}

export default App;
