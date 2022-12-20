import { data } from "../data";
import React, { useState } from "react";
import clsx from "clsx";
import { useLocalStorage } from "usehooks-ts";

export const Quiz = () => {
  const keys = Object.keys(data);
  const [known, setKnown] = useLocalStorage<string[]>("known", []);
  const filtered = keys.filter((key) => !known.includes(key));
  const [selectedId, setSelectedId] = useState<string>(filtered[0] as string);
  const [selectedAnswer, setSelectedAnswer] = useState<number>();
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const selectedQuestion = data[selectedId as keyof typeof data];

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleNextQuestion = () => {
    const index = filtered.findIndex((key) => key === selectedId) as number;
    const nextId = filtered[index + 1];
    if (selectedQuestion?.options[selectedAnswer as number]?.isCorrect) {
      setKnown([...known, selectedId]);
    }
    if (nextId) {
      setSelectedId(nextId.toString());
      setSelectedAnswer(undefined);
    } else {
      setIsFinished(true);
    }
  };

  return (
    <>
      <div className="text-center">
        Learned: {known.length} / {keys.length}{" "}
      </div>
      {isFinished && (
        <div className="mt-4 w-full text-center">
          <h2 className="text-2xl font-bold">Finished!</h2>
          <div className="mt-4 flex justify-center gap-2">
            {known.length !== keys.length && (
              <button
                className="btn-primary btn"
                onClick={() => {
                  setIsFinished(false);
                  setSelectedId(filtered[0] as string);
                  setSelectedAnswer(undefined);
                }}
              >
                Continue Learning
              </button>
            )}

            <button
              className="btn-secondary btn"
              onClick={() => {
                setIsFinished(false);
                setKnown([]);
                setSelectedAnswer(undefined);
                setSelectedId(keys[0] as string);
              }}
            >
              Restart Quiz
            </button>
          </div>
        </div>
      )}
      {selectedQuestion && !isFinished && (
        <div className="mx-auto">
          <div className="mt-4">
            <div className="card w-full bg-base-100 p-12 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">{selectedQuestion.title}</h2>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {selectedQuestion.options.map(({ title, isCorrect }, i) => (
                    <button
                      key={i}
                      onClick={() =>
                        selectedAnswer === undefined && handleAnswer(i)
                      }
                      className={clsx("btn-primary btn", {
                        "btn-success":
                          selectedAnswer !== undefined && isCorrect,
                        "btn-error": selectedAnswer === i && !isCorrect,
                        "cursor-not-allowed": selectedAnswer !== undefined,
                      })}
                    >
                      {title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {selectedAnswer !== undefined && !isFinished && (
        <div className="mt-4 w-full text-center">
          <button
            className="btn-primary btn mx-auto"
            onClick={handleNextQuestion}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default Quiz;
