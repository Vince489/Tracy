const fs = require('fs');

// Function to create Markov model from cleaned stories
function makeMarkovModel(cleanedStories, nGram = 4) {
  const markovModel = {};

  for (let i = 0; i < cleanedStories.length - nGram; i++) {
      let currState = "";

      for (let j = 0; j < nGram; j++) {
          currState += cleanedStories[i + j] + " ";
      }

      currState = currState.trim();

      const nextState = cleanedStories[i + nGram];
      
      if (!markovModel[currState]) {
          markovModel[currState] = {};
          markovModel[currState][nextState] = 1;
      } else {
          if (markovModel[currState][nextState]) {
              markovModel[currState][nextState]++;
          } else {
              markovModel[currState][nextState] = 1;
          }
      }
  }

  // calculating transition probabilities
  for (const currState in markovModel) {
      if (markovModel.hasOwnProperty(currState)) {
          const transitions = markovModel[currState];
          const total = Object.values(transitions).reduce((acc, val) => acc + val, 0);
          for (const nextState in transitions) {
              if (transitions.hasOwnProperty(nextState)) {
                  markovModel[currState][nextState] /= total;
              }
          }
      }
  }

  return markovModel;
}

// Function to generate story based on Markov model and input
function generateStory(model, input, nGram = 3, length = 10) {
  let story = input.slice(); // Initialize the story with the input
  while (story.length < length) {
      let currState = story.slice(-nGram).join(" ");
      if (!model[currState]) {
          break;
      }
      let nextState = selectNextState(model[currState]);
      if (!nextState) {
          break;
      }
      story.push(nextState);
  }
  return story.join(" ");
}

// Function to select next state based on probabilities
function selectNextState(transitions) {
  const random = Math.random();
  let sum = 0;
  for (const nextState in transitions) {
      if (transitions.hasOwnProperty(nextState)) {
          sum += transitions[nextState];
          if (random < sum) return nextState;
      }
  }
  return null;
}

// Example usage:
const cleanedStories = JSON.parse(fs.readFileSync('lower.json', 'utf8')); // Parse JSON data

const nGram = 1;
const model = makeMarkovModel(cleanedStories, nGram); // Generating the Markov model

// Generating the story based on the input ["the", "words", "you", "add"]
const input = ["eat","this"]; // Initial input to start the story
const generatedStory = generateStory(model, input, nGram, 8); // Generate the story
console.log("Generated Story:", generatedStory);
