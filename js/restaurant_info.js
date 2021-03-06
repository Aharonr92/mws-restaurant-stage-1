let restaurant, map;
let mapLoaded = false;


document.addEventListener('DOMContentLoaded', () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      fillBreadcrumb();
      lazyLoadImages();
      loadStaticMap(restaurant);
    }
  });
});

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  mapLoaded = true;
  self.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 16,
    center: self.restaurant.latlng,
    scrollwheel: false
  });
  DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
};

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant);
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    callback('No restaurant id in URL', null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant)
    });
  }
};

fetchReviewsForRestaurant = () => {
  if (self.restaurant.reviews)
    fillReviewsHTML(self.restaurant.reviews);
  else {
    DBHelper.fetchReviewsByRestaurantId(self.restaurant.id, (error, reviews) => {
      self.restaurant.reviews = reviews;
      fillReviewsHTML(self.restaurant.reviews);
    });
  }
};

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;

  const image = document.getElementById('restaurant-img');
  image.className = 'lozad';
  image.setAttribute('data-src', DBHelper.imageUrlForRestaurant(restaurant));
  image.alt = `photo of ${restaurant.name} restaurant`;


  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

  const favoriteToggle = document.getElementById('restaurant-favorite');
  if (restaurant.is_favorite) favoriteToggle.classList.add('is-favorite');
  favoriteToggle.tabIndex = '0';
  favoriteToggle.setAttribute('aria-label', `Favorite restaurant ${restaurant.name}`);
  favoriteToggle.addEventListener('click', event => favoriteRestaurant(event.target, restaurant));

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  fetchReviewsForRestaurant();
};

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('tr');
    row.tabIndex = 0;
    const day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
};

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews = self.restaurant.reviews) => {
  const container = document.getElementById('reviews-container');
  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
};

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
  const li = document.createElement('li');
  li.tabIndex = 0;
  const name = document.createElement('p');
  name.innerHTML = review.name;
  name.className = 'review-name';
  li.appendChild(name);

  const rating = document.createElement('span');
  rating.setAttribute('aria-label', `Rating: ${review.rating}`);
  for (let i = 0; i < 5; i++) {
    const star = document.createElement('span');
    star.innerHTML = '★';
    if (i < review.rating)
      star.className = 'reviews-rating';
    rating.appendChild(star)
  }
  li.appendChild(rating);

  const date = document.createElement('span');
  date.innerHTML = new Date(review.createdAt).toDateString();
  li.appendChild(date);


  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  li.appendChild(comments);

  return li;
};

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant = self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = restaurant.name;
  breadcrumb.appendChild(li);
};

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};


/**
 * Lazy load images
 */
lazyLoadImages = () => {
  const observer = lozad();
  observer.observe();
};

loadStaticMap = (restaurant) => {
  const mapElement = document.getElementById('map');
  let clientHeight = mapElement.clientHeight;
  let clientWidth = mapElement.clientWidth;
  let scale = 1;
  if (clientHeight > 640 || clientWidth > 640) {
    clientHeight = Math.floor(clientHeight / 2);
    clientWidth = Math.floor(clientWidth / 2);
    scale = 2;
  }
  mapElement.style.backgroundImage = `url(https://maps.googleapis.com/maps/api/staticmap?size=${clientWidth}x${clientHeight}&markers=size:mid|${restaurant.latlng.lat},${restaurant.latlng.lng}&key=AIzaSyDKsWF94cMGUciBs96YIpbCmexfRKT75x4&scale=${scale})`
};

loadRealMap = () => {
  if (mapLoaded) return;
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDKsWF94cMGUciBs96YIpbCmexfRKT75x4&libraries=places&callback=initMap';
  document.body.appendChild(script);
};

showAddReviewDialog = () => {
  document.getElementById('addReviewDialog').showModal()
};

if (!window.HTMLDialogElement) {
  const script = document.createElement('script');
  script.src = 'dialog-polyfill.js';
  script.type = 'text/javascript';
  script.onload = function () {
    const dialog = document.querySelector('dialog');
    dialogPolyfill.registerDialog(dialog);
  };
  document.body.appendChild(script);
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = 'dialog-polyfill.css';
  document.head.appendChild(link);
}

submitReview = () => {
  const review = {
    restaurant_id: self.restaurant.id,
    name: document.getElementById('name').value,
    rating: parseInt(document.querySelector('input[name="rating"]:checked').value),
    comments: document.getElementById('comments').value,
    createdAt: new Date().getTime()
  };

  DBHelper.addReview(review);

  document.querySelector('form').reset();
  document.getElementById('reviews-list').appendChild(createReviewHTML(review));
  document.querySelector('dialog').close();
};

cancelAddReview = () => {
  document.querySelector('form').reset();
  document.querySelector('dialog').close();
};

favoriteRestaurant = (target, restaurant) => {
  if (target.className.indexOf('is-favorite') > -1) {
    target.classList.remove('is-favorite');
    DBHelper.favoriteRestaurant(restaurant, false);
  } else {
    target.classList.add('is-favorite');
    DBHelper.favoriteRestaurant(restaurant, true);
  }
};