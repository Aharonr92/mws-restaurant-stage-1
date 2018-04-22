if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
}

//
// .then(registration => {
//   registration.addEventListener('updatefound', () => {
//     const installingWorker = registration.installing;
//     installingWorker.addEventListener('statechange', () => {
//       if (installingWorker.state === 'installed') {
//         if (navigator.serviceWorker.controller) {
//           // At this point, the old content will have been purged and
//           // the fresh content will have been added to the cache.
//           // It's the perfect time to display a "New content is
//           // available; please refresh." message in your web app.
//
//           function refresh() {
//             installingWorker.postMessage({action: 'skipWaiting'});
//           }
//
//           showSnackbar("New version availableNew version available<button onclick='refresh()'>refresh</button>")
//           console.log('New content is available; please refresh.');
//         } else {
//           // At this point, everything has been precached.
//           // It's the perfect time to display a
//           // "Content is cached for offline use." message.
//           console.log('Content is cached for offline use.');
//         }
//       }
//     });
//   });
// })
//
// showSnackbar = (innerHtml) => {
//   if (!innerHtml) return;
//   const x = document.getElementById("snackbar");
//   x.innerHTML = innerHtml;
//   x.className = "show";
//   setTimeout(function () {
//     x.className = x.className.replace("show", "");
//   }, 3000);
// };
