// add js class to html tag to inform css javascript is available and implement mobile version navigation
document.getElementById('check-javascript').classList.add('js');

// stop empty links from refreshing the page
const aTags = document.querySelectorAll('a');
aTags.forEach((link) => {
  link.addEventListener('click', (e) => {
    link.getAttribute('href') === '#' ? e.preventDefault() : '';
  });
});

const toggleNavBtn = document.getElementById('main-nav__toggle-btn');
const toggleNavBtnIcon = document.getElementById('main-nav-toggle-button-icon');
const navigationMenu = document.getElementById('navigation-menu');
const mainNavListIteams = document.querySelectorAll('.main-nav__list-item');
const mainHeader = document.getElementById('main-header');
const headerOverlay = document.getElementById('header-overlay');

toggleNavBtn.addEventListener('click', () => {
  document.getElementsByTagName('body')[0].classList.toggle('lock-scroll');
  mainHeader.classList.toggle('nav-is-open');
  mainHeader.classList.contains('nav-is-open') ? openMainNav() : closeMainNav();
});

headerOverlay.addEventListener('click', () => {
  document.getElementsByTagName('body')[0].classList.toggle('lock-scroll');
  closeMainNav();
});

function openMainNav() {
  setElementsAttrebutes(true);
  headerOverlay.classList.toggle('show-header-overlay');
  navigationMenu.classList.add('open-Main-Nav-js');
  navigationMenu.classList.remove('close-Main-Nav-js');
  setTimeout(() => {
    mainNavListIteams.forEach((listItem, key) => {
      listItem.style = `transition-delay: ${key * 100}ms;`;
      listItem.classList.add('slide-in-main-nav__list-item-js');
      listItem.classList.remove('slide-out-main-nav__list-item-js');
    });
  }, 100);
}
function closeMainNav() {
  setElementsAttrebutes(false);
  // insures nav menu waits until the last element finishes animation before it slide up
  let lastListIteamDelay = Number(mainNavListIteams[mainNavListIteams.length - 1].style['transition-delay'].slice(0, -2));
  mainNavListIteams.forEach((listItem, key) => {
    listItem.style = `transition-delay: ${key * 100}ms;`;
    listItem.classList.add('slide-out-main-nav__list-item-js');
    listItem.classList.remove('slide-in-main-nav__list-item-js');
  });
  setTimeout(() => {
    navigationMenu.classList.remove('open-Main-Nav-js');
    navigationMenu.classList.add('close-Main-Nav-js');
    headerOverlay.classList.toggle('show-header-overlay');
  }, lastListIteamDelay);
}

function setElementsAttrebutes(open) {
  if (open) {
    toggleNavBtn.setAttribute('aria-label', 'close main nav');
    toggleNavBtn.setAttribute('aria-expanded', 'true');
    toggleNavBtnIcon.setAttribute('xlink:href', 'icons.svg#icon-close');
  } else {
    toggleNavBtn.setAttribute('aria-expanded', 'false');
    toggleNavBtn.setAttribute('aria-label', 'open main nav');
    toggleNavBtnIcon.setAttribute('xlink:href', 'icons.svg#icon-hamburger');
  }
}
