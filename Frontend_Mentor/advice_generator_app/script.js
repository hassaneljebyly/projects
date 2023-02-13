const generateAdviceButton = document.getElementById('generate-advice-btn');
let adviceInnerHTML = document.getElementById('the-advice');
let adviceNumber = document.getElementById('advice-number');
let randomAdviceURL = 'https://api.adviceslip.com/advice';
let patternDividerIcon = document.getElementById('pattern-divider-icon');

generateAdviceButton.addEventListener('click', displayNewAdvice);

async function fetchAdvice() {
  try {
    const response = await fetch(randomAdviceURL);
    const data = await response.json();
    return data;
  } catch (error) {
    /* go back to original advice if there's an error */
    return {
      id: 117,
      advice: `It is easy to sit up and take notice, what's difficlut is getting up and taking action.`,
    };
  }
}

function displayNewAdvice() {
  fetchAdvice().then((data) => {
    let { id, advice } = data.slip;
    adviceNumber.innerText = id;
    adviceInnerHTML.innerText = advice;
  });
}

setPatternDividerIcon();
function setPatternDividerIcon() {
  window.innerWidth > 375 ? patternDividerIcon.setAttribute('xlink:href', './icons.svg#pattern-divider-desktop') : patternDividerIcon.setAttribute('xlink:href', './icons.svg#pattern-divider-mobile');
}
window.addEventListener('resize', () => {
  setPatternDividerIcon();
});
