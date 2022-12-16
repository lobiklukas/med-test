// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs/promises");

const main = async () => {
  const file = await fs.readFile("./data.txt", "utf-8");
  const lines = file.split("\n");
  const questions = {};

  for (const line of lines) {
    const [id, option, text, isCorrect] = line.split("\t");
    if (!questions[id]) {
      questions[id] = {
        title: text,
        options: [],
      };
    }
    if (option) {
      questions[id].options.push({
        text,
        isCorrect: !!isCorrect,
      });
    }
  }

  return questions;
};

main().then((x) => console.log(JSON.stringify(x)));
