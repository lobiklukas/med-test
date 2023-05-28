"use client";
import { type NextPage } from "next";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import data from "../../src/scripts/data.json";
import type { Question } from "../../src/types";
import QuizCard from "../../src/components/QuizCard";

const filterQuestions = (quizes: string) => {
  const quizData: Question[] = [];
  if (quizes) {
    const quizKeys = quizes.split(",") as Array<keyof typeof data>;
    for (const key of quizKeys) {
      quizData.push(...data[key]);
    }
  }
  return quizData;
};

const shuffle = (array: Question[], length: number) => {
  return array.sort(() => Math.random() - 0.5).slice(0, length);
};

const Quiz: NextPage = () => {
  const searchParams = useSearchParams();
  const [quizData, setQuizData] = useState<Question[]>([]);
  const quizes = searchParams.get("quizes");
  const length = searchParams.get("length");
  const ignoreKnown = searchParams.get("ignoreKnown");

  useEffect(() => {
    let parsedQuizData: Question[] = [];
    let shuffledQuizData: Question[] = [];
    if (quizes) {
      parsedQuizData = filterQuestions(quizes);
    }
    if (length) {
      shuffledQuizData = shuffle(parsedQuizData, parseInt(length));
    }
    setQuizData(shuffledQuizData.length ? shuffledQuizData : parsedQuizData);
  }, [length, quizes]);
  return (
    <>
      <QuizCard
        data={quizData}
        handleShuffle={() => {
          if (length) {
            const shuffledQuizData = shuffle(quizData, quizData.length);
            setQuizData(shuffledQuizData);
          }
        }}
        ignoreFilter={ignoreKnown === "true"}
      />
    </>
  );
};

export default Quiz;
