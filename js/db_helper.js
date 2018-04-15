/**
 * Common database helper functions.
 */
class DBHelper {
  constructor(){

  }

  static get DB_NAME() {
    return 'mws-restaurant'
  }

  static get DB_VERSION() {
    return 1
  }

  static get STORE_NAME() {
    return 'restaurants'
  }

  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    return "http://localhost:1337/restaurants";
  }


  static dbPromise() {
    // If the browser doesn't support service worker,
    // we don't care about having a database
    if (!navigator.serviceWorker) {
      return Promise.resolve();
    }

    return idb.open(this.DB_NAME, this.DB_VERSION, upgradeDb => {
      const store = upgradeDb.createObjectStore(this.STORE_NAME, {
        keyPath: 'id'
      });
    });
  }

  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants(callback) {
    DBHelper.dbPromise().then(db => {
      if (!db) return;
      return db.transaction(DBHelper.STORE_NAME).objectStore(DBHelper.STORE_NAME).getAll();
    }).then(data => {
      if (data && data.length > 0) return callback(null, data);
      else {
        fetch(this.DATABASE_URL)
          .then(res => {
            if (res.status !== 200) console.error(`error fetching restaurants data. status: ${res.status}`);
            else return res.json();
          })
          .then(restaurants => {
            DBHelper.dbPromise().then(db => {
              if (!db) return;
              const store = db.transaction(DBHelper.STORE_NAME, 'readwrite').objectStore(DBHelper.STORE_NAME);
              restaurants.map(restaurant => store.put(restaurant));
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
    return (`/img/${restaurant&& restaurant.photograph?restaurant.photograph:'no_restaurant_img'}.webp`);
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
}
