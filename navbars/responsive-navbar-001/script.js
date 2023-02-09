'use strict';
const toggleSearchInput = document.getElementById('toggle-search-btn');
const toggleSearchInputIcon = document.getElementById('toggle-search-btn-icon');
const SearchInput = document.getElementById('search-input');

const openNavMenuButton = document.getElementById('open-menu-btn');
const closeNavMenuButton = document.getElementById('close-menu-btn');
const navigationMenu = document.getElementById('navigation-menu');

toggleSearchInput.addEventListener('click', toggleSearchInputField);
openNavMenuButton.addEventListener('click', () => {
  openNavigationMenu();
  toggleSearchInput.style.display = 'none';
});
closeNavMenuButton.addEventListener('click', () => {
  closeNavigationMenu();
  toggleSearchInput.style.display = 'block';
});

function openNavigationMenu() {
  openNavMenuButton.style.display = 'none';
  closeNavMenuButton.style.display = 'block';
  navigationMenu.style = `
  transform: translateX(calc(var(--container-padding)/2));
  transition: transform ease-in-out 250ms
  `;
  navigationMenu.setAttribute('aria-hidden', 'false');
  navigationMenu.setAttribute('data-menu', 'open');
}
function closeNavigationMenu() {
  navigationMenu.style = `
  transform: translateX(-100vw);
  transition: transform ease-in-out 250ms
  `;
  openNavMenuButton.style.display = 'block';
  closeNavMenuButton.style.display = 'none';
  navigationMenu.setAttribute('aria-hidden', 'true');
  navigationMenu.setAttribute('data-menu', 'closed');
  // when window is resized bigger than the brekpoint the navigation menu will close if open
  setTimeout(() => {
    navigationMenu.setAttribute('style', '');
    openNavMenuButton.setAttribute('style', '');
    toggleSearchInput.setAttribute('style', 'background-color: transparent; ');
  }, 250);
}

function toggleSearchInputField() {
  let state = toggleSearchInputIcon.getAttribute('xlink:href');
  if (state === './icons.svg#search') {
    SearchInput.style.display = 'flex';
    document.querySelector('input[type=search]').focus();
    SearchInput.setAttribute('aria-hidden', 'false');
    toggleSearchInput.setAttribute('aria-label', 'close search button');
    toggleSearchInputIcon.setAttribute('xlink:href', './icons.svg#close');
  } else {
    SearchInput.style.display = 'none';
    SearchInput.setAttribute('aria-hidden', 'true');
    toggleSearchInput.setAttribute('aria-label', 'open search button');
    toggleSearchInputIcon.setAttribute('xlink:href', './icons.svg#search');
  }
}
/* if search input and navigation menu are hidden, add aria-hidden="true" else "false*/
window.addEventListener('load', () => {
  let match = window.matchMedia('(max-width: 750px)').matches;
  if (match) {
    SearchInput.setAttribute('aria-hidden', 'true');
    navigationMenu.setAttribute('aria-hidden', 'true');
  } else {
    SearchInput.setAttribute('aria-hidden', 'false');
    navigationMenu.setAttribute('aria-hidden', 'false');
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth < 749) {
    SearchInput.setAttribute('aria-hidden', 'true');
    navigationMenu.setAttribute('aria-hidden', 'true');
  } else {
    // when window is resized bigger than the brekpoint the navigation menu will close if open
    // it caused some bugs, setTimeout in line 40 fixed them
    if (navigationMenu.getAttribute('data-menu') === 'open') {
      // closeNavMenuButton.click();
      // console.log('clicked');
      navigationMenu.setAttribute('style', '');
      openNavMenuButton.setAttribute('style', '');
      closeNavMenuButton.setAttribute('style', 'background-color: transparent;');
      navigationMenu.setAttribute('data-menu', 'closed');
    }
    SearchInput.setAttribute('aria-hidden', 'false');
    navigationMenu.setAttribute('aria-hidden', 'false');
  }
});
