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

    if (found) {
      continue;
    }

    // ends with common or country-specific domain: .com , .net, .org, .io, .gov, or .ca, etc
    for (const someDomain of DOMAINS) {
      searchString = someDomain;
      firstIndex = word.toUpperCase().indexOf(searchString.toUpperCase());
      if (firstIndex != -1) {
        break;
      }
    }

    if (firstIndex != -1) {
      wordAndPunc = splitWordAndEndingPunctuation(word);
      if (wordAndPunc[1]) {
        // found an ending punctuation char
        newString = `<a target="_blank" href="http://www.${wordAndPunc[0]}">http://www.${wordAndPunc[0]}</a>${wordAndPunc[1]}`;
      } else {
        // did not find an ending punctuation char
        newString = `<a target="_blank" href="http://www.${word}">http://www.${word}</a>`;
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

const COMMON_DOMAINS = ['.com', '.net', '.org', '.io', '.gov'];
const COUNTRY_DOMAINS = [
  '.al',
  '.ax',
  '.dz',
  '.as',
  '.ad',
  '.ao',
  '.ai',
  '.aq',
  '.ag',
  '.ar',
  '.am',
  '.aw',
  '.au',
  '.at',
  '.az',
  '.bs',
  '.bh',
  '.bd',
  '.bb',
  '.by',
  '.be',
  '.bz',
  '.bj',
  '.bm',
  '.bt',
  '.bo',
  '.bq',
  '.ba',
  '.bw',
  '.bv',
  '.br',
  '.io',
  '.bn',
  '.bg',
  '.bf',
  '.bi',
  '.cv',
  '.kh',
  '.cm',
  '.ca',
  '.ky',
  '.cf',
  '.td',
  '.cl',
  '.cn',
  '.cx',
  '.cc',
  '.co',
  '.km',
  '.cd',
  '.cg',
  '.ck',
  '.cr',
  '.hr',
  '.cu',
  '.cw',
  '.cy',
  '.cz',
  '.ci',
  '.dk',
  '.dj',
  '.dm',
  '.do',
  '.ec',
  '.eg',
  '.sv',
  '.gq',
  '.er',
  '.ee',
  '.sz',
  '.et',
  '.fk',
  '.fo',
  '.fj',
  '.fi',
  '.fr',
  '.gf',
  '.pf',
  '.tf',
  '.ga',
  '.gm',
  '.ge',
  '.de',
  '.gh',
  '.gi',
  '.gr',
  '.gl',
  '.gd',
  '.gp',
  '.gu',
  '.gt',
  '.gg',
  '.gn',
  '.gw',
  '.gy',
  '.ht',
  '.hm',
  '.va',
  '.hn',
  '.hk',
  '.hu',
  '.is',
  '.in',
  '.id',
  '.ir',
  '.iq',
  '.ie',
  '.im',
  '.il',
  '.it',
  '.jm',
  '.jp',
  '.je',
  '.jo',
  '.kz',
  '.ke',
  '.ki',
  '.kp',
  '.kr',
  '.kw',
  '.kg',
  '.la',
  '.lv',
  '.lb',
  '.ls',
  '.lr',
  '.ly',
  '.li',
  '.lt',
  '.lu',
  '.mo',
  '.mg',
  '.mw',
  '.my',
  '.mv',
  '.ml',
  '.mt',
  '.mh',
  '.mq',
  '.mr',
  '.mu',
  '.yt',
  '.mx',
  '.fm',
  '.md',
  '.mc',
  '.mn',
  '.me',
  '.ms',
  '.ma',
  '.mz',
  '.mm',
  '.na',
  '.nr',
  '.np',
  '.nl',
  '.nc',
  '.nz',
  '.ni',
  '.ne',
  '.ng',
  '.nu',
  '.nf',
  '.mp',
  '.no',
  '.om',
  '.pk',
  '.pw',
  '.ps',
  '.pa',
  '.pg',
  '.py',
  '.pe',
  '.ph',
  '.pn',
  '.pl',
  '.pt',
  '.pr',
  '.qa',
  '.mk',
  '.ro',
  '.ru',
  '.rw',
  '.re',
  '.bl',
  '.sh',
  '.kn',
  '.lc',
  '.mf',
  '.pm',
  '.vc',
  '.ws',
  '.sm',
  '.st',
  '.sa',
  '.sn',
  '.rs',
  '.sc',
  '.sl',
  '.sg',
  '.sx',
  '.sk',
  '.si',
  '.sb',
  '.so',
  '.za',
  '.gs',
  '.ss',
  '.es',
  '.lk',
  '.sd',
  '.sr',
  '.sj',
  '.se',
  '.ch',
  '.sy',
  '.tw',
  '.tj',
  '.tz',
  '.th',
  '.tl',
  '.tg',
  '.tk',
  '.to',
  '.tt',
  '.tn',
  '.tr',
  '.tm',
  '.tc',
  '.tv',
  '.ug',
  '.ua',
  '.ae',
  '.gb',
  '.um',
  '.us',
  '.uy',
  '.uz',
  '.vu',
  '.ve',
  '.vn',
  '.vg',
  '.vi',
  '.wf',
  '.eh',
  '.ye',
  '.zm',
  '.zw',
];

export const DOMAINS = [...COUNTRY_DOMAINS, ...COMMON_DOMAINS];
