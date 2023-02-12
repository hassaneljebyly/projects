'use strict';

const unreadNotifications = document.querySelectorAll('.notification[aria-label="unread notification"]');
const unreadNotificationsNumber = document.querySelectorAll('#unred-notification-number');
const markAllAsRead = document.querySelectorAll('#mark-all-as-read');

setNotificationNumber();

unreadNotifications.forEach((notification) => {
  notification.addEventListener('click', () => {
    notification.setAttribute('aria-label', '');
    console.log(document.querySelectorAll('.notification[aria-label="unread notification"]').length);
    setNotificationNumber();
  });
});

function setNotificationNumber() {
  let number = document.querySelectorAll('.notification[aria-label="unread notification"]').length;
  number === 0 ? (unreadNotificationsNumber[0].style.display = 'none') : (unreadNotificationsNumber[0].innerHTML = number);
}

/* It's better to avoid expensive queries like these, for things like mark all as read or unfollow all...  */
markAllAsRead[0].addEventListener('click', () => {
  let allUnreadNotifications = document.querySelectorAll('.notification[aria-label="unread notification"]');
  allUnreadNotifications.forEach((notification) => {
    notification.setAttribute('aria-label', '');
  });
  setNotificationNumber();
});
