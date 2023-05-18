const shareButton = document.getElementById('share-button');
const shareComponent = document.getElementById('share-component');
const shareComponentContainer = document.getElementById('share-container_1');

shareComponent.setAttribute('aria-hidden', 'true');

shareButton.addEventListener('click', () => {
  openShareComponent();
});

// by default aria-hidden="false" and share-component is shown if javascript is disabled, if not share-component is hidden and aria-hidden="true"
function openShareComponent() {
  shareComponentContainer.classList.toggle('open');
  if (shareComponent.classList.contains('open')) {
    shareComponent.setAttribute('aria-hidden', 'false');
    shareButton.setAttribute('aria-expanded', 'true');
  } else {
    shareComponent.setAttribute('aria-hidden', 'true');
    shareButton.setAttribute('aria-expanded', 'false');
  }
}

// embed social share

const link = encodeURI(window.location.href);
const facebookLink = document.getElementById('facebook-link');
const twitterLink = document.getElementById('twitter-link');
const pinterestLink = document.getElementById('pinterest-link');
facebookLink.href = `https://www.facebook.com/share.php?u=${link}`;
twitterLink.href = `https://www.twitter.com/share?&url=${link}`;
pinterestLink.href = `https://www.pinterest.com/pin/create/button/?url=${link}`;
console.log(facebookLink);
