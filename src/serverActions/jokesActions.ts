import { createServerFn } from "@tanstack/react-start";
import * as fs from 'node:fs';
import { v4 as uuidv4 } from 'uuid';
import type { Joke, JokesData } from '../types/';

const JOKES_FILE = 'src/data/jokes.json';

export const getJokes = createServerFn({ method: 'GET' }).handler(async () => {
  const jokes = await fs.promises.readFile(JOKES_FILE, 'utf-8');

  return JSON.parse(jokes) as JokesData;
});

export const addJoke = createServerFn({ method: 'POST' })
  .inputValidator((data: { question: string, answer: string }) => {

    if (!data.question || !data.question.trim()) {
      throw new Error('je moet wel een grapje vertelle');
    }

    if (!data.answer || !data.answer.trim()) {
      throw new Error('Oke maar je hebt ook echt een punchline nodig');
    }

    return data;
  }).handler(async ({ data }) => {
    try {

      const JokesData = await getJokes();

      const newJoke: Joke = {
        id: uuidv4(),
        question: data.question,
        answer: data.answer,
      }

      const updatedJokes = [...JokesData, newJoke];

      await fs.promises.writeFile(
        JOKES_FILE,
        JSON.stringify(
          updatedJokes,
          null, 2),
        'utf-8'
      );

      return newJoke;
    } catch (error) {
      console.error('geen grapje kunnen toevoegen want:', error);
      throw new Error('kaka in je grapje');
    }
  });
