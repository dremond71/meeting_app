/**
 * Looks for punctuation at the end of a word.
 *
 * If it finds punctuation, it returns the separated
 *   word and punctuation in the form of an array.
 *   The first element is the word.
 *   The second element is the punctuation.
 *
 * Otherwise it returns the entire word in the first element
 * and undefined in the second element.
 *
 * @param {*} someWord
 * @returns
 */
function splitWordAndEndingPunctuation(someWord) {
  const data = [undefined, undefined];

  const possibleDelimiters = [',', '.', ';', '!', '?'];
  let theLastChar = undefined;
  if (someWord) {
    const lastChar = someWord.charAt(someWord.length - 1);

    for (const someChar of possibleDelimiters) {
      if (lastChar === someChar) {
        theLastChar = someChar;
        break;
      }
    }

    if (theLastChar) {
      data[0] = someWord.substr(0, someWord.length - 1);
      data[1] = theLastChar;
    } else {
      data[0] = someWord;
      data[1] = undefined;
    }
  }

  return data;
}

/**
 * Takes a message (sentence), looks for any urls, and properly
 * wraps them in an HTML anchor <a>.
 * @param {*} someMessage
 * @returns
 */
export function anchorAnyURLs(someMessage) {
  let words = someMessage.split(' ');

  let wordAndPunc = undefined;
  const newWords = [];
  for (const word of words) {
    let found = false;
    let newString = undefined;
    let searchString = 'http://';
    let firstIndex = word.toUpperCase().indexOf(searchString.toUpperCase());
    if (firstIndex == 0) {
      wordAndPunc = splitWordAndEndingPunctuation(word);
      if (wordAndPunc[1]) {
        // found an ending punctuation char
        newString = `<a  target="_blank" href="${wordAndPunc[0]}">${wordAndPunc[0]}</a>${wordAndPunc[1]}`;
      } else {
        // did not find an ending punctuation char
        newString = `<a  target="_blank" href="${word}">${word}</a>`;
      }
      newWords.push(newString);
      found = true;
    }

    if (found) {
      continue;
    }

    searchString = 'https://';
    firstIndex = word.toUpperCase().indexOf(searchString.toUpperCase());
    if (firstIndex == 0) {
      wordAndPunc = splitWordAndEndingPunctuation(word);
      if (wordAndPunc[1]) {
        // found an ending punctuation char
        newString = `<a target="_blank" href="${wordAndPunc[0]}">${wordAndPunc[0]}</a>${wordAndPunc[1]}`;
      } else {
        // did not find an ending punctuation char
        newString = `<a target="_blank" href="${word}">${word}</a>`;
      }

      newWords.push(newString);
      found = true;
    }

    if (found) {
      continue;
    }

    searchString = 'www.';
    firstIndex = word.toUpperCase().indexOf(searchString.toUpperCase());
    if (firstIndex == 0) {
      wordAndPunc = splitWordAndEndingPunctuation(word);
      if (wordAndPunc[1]) {
        // found an ending punctuation char
        newString = `<a target="_blank" href="http://${wordAndPunc[0]}">http://${wordAndPunc[0]}</a>${wordAndPunc[1]}`;
      } else {
        // did not find an ending punctuation char
        newString = `<a target="_blank" href="http://${word}">http://${word}</a>`;
      }
      newWords.push(newString);
      found = true;
    }

    if (!found) {
      newWords.push(word);
    }
  }

  let updatedMessage = undefined;

  if (newWords.length > 0) {
    updatedMessage = newWords.join(' ');
  } else {
    updatedMessage = someMessage;
  }

  return updatedMessage;
}
