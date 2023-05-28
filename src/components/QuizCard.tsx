"use client";
import clsx from "clsx";
import React, { useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import type { Question } from "../types";
import { isEqual } from "lodash";

interface QuizCardProps {
  data: Question[];
  handleShuffle?: () => void;
  ignoreFilter?: boolean;
}

const DEFAULT_ANSWERS = [false, false, false, false];

export const QuizCard: React.FC<QuizCardProps> = ({
  data,
  handleShuffle,
  ignoreFilter,
}) => {
  const [known, setKnown] = useLocalStorage<string[]>("known", []);
  const [filtered, setFiltered] = useState<Question[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  console.log("🚀 ~ file: QuizCard.tsx:24 ~ selectedId:", selectedId);
  const [selectedAnswer, setSelectedAnswer] =
    useState<boolean[]>(DEFAULT_ANSWERS);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(1);

  useEffect(() => {
    const filtered = data.filter((item) => !known.includes(item.id));
    console.log("🚀 ~ file: QuizCard.tsx:33 ~ useEffect ~ filtered:", filtered);
    if (filtered.length) {
      setSelectedId(filtered?.[0]?.id as string);
      setFiltered(filtered);
    }
  }, [known, data]);

  const selectedQuestion = useMemo(
    () => data.find((item) => item.id === selectedId),
    [selectedId, data]
  );

  const handleAnswer = (index: number) => {
    const newSelectedAnswer = [...selectedAnswer];
    newSelectedAnswer[index] = !newSelectedAnswer[index];
    setSelectedAnswer(newSelectedAnswer);
  };

  const handleNextQuestion = () => {
    const index = filtered.findIndex((key) => key.id === selectedId) as number;
    const nextId = filtered[index + 1]?.id;
    const correstAnswers = selectedQuestion?.options.map(
      (item) => item.isCorrect
    );
    if (isEqual(selectedAnswer, correstAnswers)) {
      setKnown([...known, selectedId]);
    }
    if (nextId) {
      setShowAnswer(false);
      setProgress(progress + 1);
      setSelectedId(nextId.toString());
      setSelectedAnswer(DEFAULT_ANSWERS);
    } else {
      setProgress(1);
      setIsFinished(true);
      handleShuffle && handleShuffle();
    }
  };

  const handleShowAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col justify-around">
      {isFinished && (
        <div className="mt-4 w-full text-center">
          <h2 className="text-2xl font-bold">Finished!</h2>
          <div className="mt-4 flex justify-center gap-2">
            {known.length !== data.length && (
              <button
                className="btn-primary btn"
                onClick={() => {
                  setIsFinished(false);
                  setSelectedId(filtered[0]?.id as string);
                  setSelectedAnswer(DEFAULT_ANSWERS);
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
                setSelectedAnswer(DEFAULT_ANSWERS);
                setSelectedId(data[0]?.id as string);
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
            <div className="w-full p-4">
              <h5 className="text-center ">{selectedQuestion.category}</h5>
              <h2 className="text-center text-2xl">
                {selectedQuestion.order}. {selectedQuestion.text}
              </h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {selectedQuestion.options.map(({ text, isCorrect }, i) => (
                  <button
                    key={i}
                    onClick={() => (!showAnswer ? handleAnswer(i) : null)}
                    className={clsx(
                      "btn-primary btn flex h-auto flex-nowrap justify-start gap-4 text-left",
                      {
                        "btn-success": showAnswer && isCorrect,
                        "btn-error":
                          showAnswer &&
                          selectedAnswer[i] === true &&
                          !isCorrect,
                        "cursor-not-allowed": selectedAnswer !== undefined,
                      }
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={selectedAnswer[i]}
                      className="checkbox-accent checkbox"
                    />
                    <span className="py-6 leading-relaxed">{text}</span>
                  </button>
                ))}
              </div>
              <div className="mt-4 w-full text-center">
                <button
                  className="btn-primary btn mx-auto"
                  onClick={handleShowAnswer}
                >
                  {showAnswer ? "Hide" : "Show"} Answer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex w-full items-center justify-center gap-6 px-8">
        <div className="grow">
          <div className="relative">
            <p className="text-center text-sm">
              Session progress: {progress} / {filtered.length}
            </p>
            <progress
              className="progress progress-info"
              value={progress}
              max={filtered.length}
            />
          </div>
          <div className="relative">
            <p className="text-center text-sm">
              Learned: {data.length - filtered.length} / {data.length}
            </p>
            <progress
              className="progress progress-success"
              value={data.length - filtered.length}
              max={data.length}
            />
          </div>
        </div>
        {selectedAnswer !== undefined && !isFinished && (
          <button
            className="btn-primary btn mx-auto"
            onClick={handleNextQuestion}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizCard;
