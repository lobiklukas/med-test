// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs/promises");

const questionRegex = /^(\d+)\.\s(.*)$/;
const optionRegex = /^(\w)\)\s(.*)$/;

const main = async () => {
  const file = await fs.readFile(__dirname + "/data.txt", "utf-8");
  const lines = file.split("\n");
  const questions = {};
  let lastCategory = "";
  let lastQuestion = "";

  for (const line of lines) {
    if (line.trim() === "") continue;

    const questionMatch = line.match(questionRegex);
    const optionMatch = line.match(optionRegex);

    const isQuestion = !!questionMatch;
    const isOption = !!optionMatch;

    if (!isQuestion && !isOption) {
      lastCategory = line;
      questions[lastCategory] = [];
      continue;
    }

    const [, id, text] = questionMatch || [];
    const [, option, optionText] = optionMatch || [];

    const isCorrect = line.endsWith(" X");

    if (isQuestion) {
      questions[lastCategory].push({
        id: id + lastCategory,
        order: parseInt(id),
        text,
        category: lastCategory,
        options: [],
      });
      lastQuestion = id + lastCategory;
    } else if (isOption) {
      questions[lastCategory]
        .find((x) => x.id === lastQuestion)
        .options.push({
          option,
          text: isCorrect ? optionText.slice(0, -2) : optionText,
          isCorrect,
        });
    }
  }
  return questions;
};

main().then((x) =>
  fs.writeFile(__dirname + "/data.json", JSON.stringify(x, null, 2))
);
