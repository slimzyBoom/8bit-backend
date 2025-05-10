import { TRIVIA_API } from "../config/env.config.js";
import axios from "axios";
import he from "he";
import shuffleArray from "../utils/shuffleArray.js";

// Interact with trivial api to get sanitized questions
const getTrivialQuiz = async ({ category = 9, difficulty = "easy", type = "multiple", amount = 10 }) => {
  try {
    const response = await axios.get(`${TRIVIA_API}/api.php`, {
      params: {
        amount,
        difficulty,
        type,
        category,
      },
    });
    return response.data.results.map((item) => {
      const incorrect_answers = item.incorrect_answers.map((answer) =>
        he.decode(answer)
      );
      const correct_answer = he.decode(item.correct_answer);
      const all_answers = [...incorrect_answers, correct_answer];
      const shuffled_answers = shuffleArray(all_answers);
      return {
        question: he.decode(item.question),
        correct_answer,
        options: shuffled_answers,
        category: item.category,
        difficulty: item.difficulty,
      };
    });
  } catch (error) {
    console.error("Error fetching trivia quiz:", error);
  }
};

const getCategories = async () => {
  try {
    const response = await axios.get(`${TRIVIA_API}/api_category.php`);
    return response.data.trivia_categories.map((item) => {
      return {
        id: item.id,
        name: item.name,
      };
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

export { getTrivialQuiz, getCategories };
