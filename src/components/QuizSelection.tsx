"use client";
import data from "../scripts/data.json";
import React from "react";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "usehooks-ts";

export const QuizSelection: React.FC = () => {
  const router = useRouter();
  const keys = Object.keys(data);
  const [selected, setSelected] = React.useState<string[]>([]);
  const [numOfQuestions, setNumOfQuestions] = React.useState<number>(10);
  const [known, setKnown] = useLocalStorage<string[]>("known", []);

  const handleQuizSelection = (
    data: string[],
    length?: number,
    ignoreKnown?: boolean
  ) => {
    const url = new URL("/quiz", window.location.href);
    url.searchParams.set("quizes", data.join(","));
    if (length) {
      url.searchParams.set("length", length.toString());
    }
    if (ignoreKnown) {
      url.searchParams.set("ignoreKnown", "true");
    }
    router.push(url.href);
  };

  const handleReset = () => {
    setKnown([]);
  };

  return (
    <>
      <button
        onClick={handleReset}
        className="btn-secondary btn absolute left-5 top-5"
      >
        Reset learned
      </button>
      <div className="text-center">
        <h2 className="text-4xl font-bold">Start Single Quiz</h2>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {keys.map((key) => (
            <button
              key={key}
              className="btn-primary btn"
              onClick={() => handleQuizSelection([key])}
            >
              {key}
            </button>
          ))}
        </div>
        <div className="divider mt-4" />
        <div className="mt-4">
          <h2 className="text-4xl font-bold">Random Quiz</h2>
          <div className="flex justify-center">
            <label className="label cursor-pointer">
              <span className="label-text">Number of questions:</span>
              <input
                type="number"
                min={1}
                defaultValue={10}
                onChange={(e) => setNumOfQuestions(parseInt(e.target.value))}
                className="input-bordered input ml-2"
              />
            </label>
          </div>
          <h3 className="text-xl">Quizes which should be included:</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {keys.map((key) => (
              <div key={key} className="form-control">
                <label className="label cursor-pointer">
                  <input
                    type="checkbox"
                    className="checkbox-primary checkbox mr-2"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelected([...selected, key]);
                      } else {
                        setSelected(selected.filter((s) => s !== key));
                      }
                    }}
                  />
                  <span className="label-text">{key}</span>
                </label>
              </div>
            ))}
          </div>
          <button
            className="btn-primary btn mt-2"
            onClick={() => handleQuizSelection(selected, numOfQuestions, true)}
            disabled={selected.length === 0}
          >
            Start
          </button>
        </div>
      </div>
    </>
  );
};

export default QuizSelection;
