import axios from "axios";
export const getJudge0LanguageId = (language) => {
  const languageMap = {
    PYTHON: 71,
    JAVA: 62,
    JAVASCRIPT: 63,
  };

  return languageMap[language.toUpperCase()];
};

export const submitBatch = async (submissions) => {
  const { data } = await axios.post(
    `${process.env.JUDGE0_API}/submissions/batch?base64_encoded=false`,
    {
      submissions,
    }
  );

  console.log("Submission results:", data);

  return data;
};
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const pollBatchResults = async (tokens) => {
  while (true) {
    const { data } = await axios.get(
      `${process.env.JUDGE0_API}/submissions/batch`,
      {
        params: {
          tokens: tokens.join(","),
          base_encoded: false,
        },
      }
    );

    const results = data.submissions;
    const isAlldone = results.every(
      (r) => r.status.id !== 1 && r.status.id !== 2
    );
    if (isAlldone) return results;
    await sleep(1000);
  }
};
