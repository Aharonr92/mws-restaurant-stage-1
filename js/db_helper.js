/**
 * Common database helper functions.
 */
class DBHelper {
  constructor() {

  }

  static get DB_NAME() {
    return 'mws-restaurant'
  }

  static get DB_VERSION() {
    return 1
  }

  static get RESTAURANTS_STORE_NAME() {
    return 'restaurants'
  }

  static get REVIEWS_STORE_NAME() {
    return 'reviews'
  }

  static get DATABASE_URL() {
    return "http://localhost:1337";
  }

  static get RESTAURANTS_URL() {
    return this.DATABASE_URL + "/restaurants";
  }

  static get REVIEWS_URL() {
    return this.DATABASE_URL + "/reviews";
  }


  static dbPromise() {
    // If the browser doesn't support service worker,
    // we don't care about having a database
    if (!navigator.serviceWorker) {
      return Promise.resolve();
    }

    return idb.open(this.DB_NAME, this.DB_VERSION, upgradeDb => {
      const restaurantsStore = upgradeDb.createObjectStore(this.RESTAURANTS_STORE_NAME, {
        keyPath: 'id',
        autoIncrement: true
      });
      restaurantsStore.createIndex('hesUpdates', 'hesUpdates', {unique: false});

      const reviewsStore = upgradeDb.createObjectStore(this.REVIEWS_STORE_NAME, {keyPath: 'id', autoIncrement: true});
      reviewsStore.createIndex('hesUpdates', 'hesUpdates', {unique: false});
    });
  }

  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants(callback) {
    DBHelper.dbPromise().then(db => {
      if (!db) return;
      return db.transaction(DBHelper.RESTAURANTS_STORE_NAME).objectStore(DBHelper.RESTAURANTS_STORE_NAME).getAll();
    }).then(data => {
      if (data && data.length > 0) return callback(null, data);
      else {
        fetch(this.RESTAURANTS_URL)
          .then(res => {
            if (res.status !== 200) callback(error = (`error fetching restaurants data. status: ${res.status}`), null);
            else return res.json();
          })
          .then(restaurants => {
            DBHelper.dbPromise().then(db => {
              if (!db) return;
              const store = db.transaction(DBHelper.RESTAURANTS_STORE_NAME, 'readwrite').objectStore(DBHelper.RESTAURANTS_STORE_NAME);
              restaurants.map(restaurant => {
                restaurant['hesUpdates'] = 'false';
                store.put(restaurant);
              });
            });
            return callback(null, restaurants);
          })
          .catch(error => callback(error, null));
      }
    });
  }

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) { // Got the restaurant
          callback(null, restaurant);
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null);
        }
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type === cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood === neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants;
        if (cuisine !== 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type === cuisine);
        }
        if (neighborhood !== 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood === neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood);
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) === i);
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type);
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) === i);
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    return (`/img/${restaurant && restaurant.photograph ? restaurant.photograph : 'no_restaurant_img'}.webp`);
  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    return new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP
    });
  }

  /**
   * Fetch all restaurants.
   */
  static fetchReviews(callback) {
    DBHelper.dbPromise().then(db => {
      if (!db) return;
      return db.transaction(DBHelper.REVIEWS_STORE_NAME).objectStore(DBHelper.REVIEWS_STORE_NAME).getAll();
    }).then(data => {
      if (data && data.length > 0) return callback(null, data);
      else {
        fetch(this.REVIEWS_URL)
          .then(res => {
            if (res.status !== 200) callback(error = (`error fetching reviews data. status: ${res.status}`), null);
            else return res.json();
          })
          .then(reviews => {
            DBHelper.dbPromise().then(db => {
              if (!db) return;
              const store = db.transaction(DBHelper.REVIEWS_STORE_NAME, 'readwrite').objectStore(DBHelper.REVIEWS_STORE_NAME);
              reviews.map(review => {
                review['hesUpdates'] = 'false';
                store.put(review);
              });
            });
            return callback(null, reviews);
          })
          .catch(error => callback(error, null));
      }
    });
  }

  /**
   * Fetch a review by its ID.
   */
  static fetchReviewsByRestaurantId(restaurantId, callback) {
    // fetch all reviews with proper error handling.
    DBHelper.fetchReviews((error, reviews) => {
      if (error) {
        callback(error, null);
      } else {
        const filteredReviews = reviews.filter(r => r.restaurant_id == restaurantId);
        if (filteredReviews) { // Got the reviews
          callback(null, filteredReviews);
        } else { // Reviews does not exist in the database
          callback('Reviews does not exist', null);
        }
      }
    });
  }

  static addReview(review) {
    if (!review) return;
    review.hasOwnProperty('id') && delete review.id;

    fetch(DBHelper.REVIEWS_URL, {
      method: 'POST',
      body: JSON.stringify(review)
    })
      .then(resp => {
        if (resp.status !== 201) {
          resp['hesUpdates'] = 'true';
        }
        return resp.json();
      })
      .then(rev => {
        rev['hesUpdates'] = 'false';
        DBHelper.addReviewToDB(rev, () => {
        });
      })
      .catch(err => {
        console.log(review)
        review['hesUpdates'] = 'true';
        DBHelper.addReviewToDB(review, () => {
        });
        return review;
      });
    return review;
  }

  static addReviewToDB(review, callback) {
    DBHelper.dbPromise().then(db => {
      if (!db) return;
      db.transaction(DBHelper.REVIEWS_STORE_NAME, 'readwrite').objectStore(DBHelper.REVIEWS_STORE_NAME).put(review);
      callback()
    }).catch(err => console.log(err))
  }

  static deleteReviewFromDB(id, callback) {
    DBHelper.dbPromise().then(db => {
      if (!db) return;
      db.transaction(DBHelper.REVIEWS_STORE_NAME, 'readwrite').objectStore(DBHelper.REVIEWS_STORE_NAME).delete(id);
      callback()
    }).catch(err => console.log(err))
  }

  static updateDB() {
    DBHelper.dbPromise().then(db => {
      if (!db) return;
      return db.transaction(DBHelper.REVIEWS_STORE_NAME).objectStore(DBHelper.REVIEWS_STORE_NAME).index('hesUpdates').openCursor('true');
    }).then(function loopCursor(cursor) {
      if (!cursor) return;
      let review = cursor.value;
      DBHelper.deleteReviewFromDB(review.id, () => {
        review['hesUpdates'] = 'false';
        DBHelper.addReview(review);
      });
      return cursor.continue().then(loopCursor);
    });
    DBHelper.dbPromise().then(db => {
      if (!db) return;
      return db.transaction(DBHelper.RESTAURANTS_STORE_NAME).objectStore(DBHelper.RESTAURANTS_STORE_NAME).index('hesUpdates').openCursor('true');
    }).then(function loopCursor(cursor) {
      if (!cursor) return;
      //todo
      return cursor.continue().then(loopCursor);
    });
  }
}

window.addEventListener('online', (e) => {
  DBHelper.updateDB()
})