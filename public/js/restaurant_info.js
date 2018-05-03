let restaurant,map,mapLoaded=!1;if(document.addEventListener("DOMContentLoaded",()=>{fetchRestaurantFromURL((e,t)=>{e?console.error(e):(fillBreadcrumb(),lazyLoadImages(),loadStaticMap(t))})}),window.initMap=(()=>{mapLoaded=!0,self.map=new google.maps.Map(document.getElementById("map"),{zoom:16,center:self.restaurant.latlng,scrollwheel:!1}),DBHelper.mapMarkerForRestaurant(self.restaurant,self.map)}),fetchRestaurantFromURL=(e=>{if(self.restaurant)return void e(null,self.restaurant);const t=getParameterByName("id");t?DBHelper.fetchRestaurantById(t,(t,a)=>{self.restaurant=a,a?(fillRestaurantHTML(),e(null,a)):console.error(t)}):e("No restaurant id in URL",null)}),fetchReviewsForRestaurant=(()=>{self.restaurant.reviews?fillReviewsHTML(self.restaurant.reviews):DBHelper.fetchReviewsByRestaurantId(self.restaurant.id,(e,t)=>{self.restaurant.reviews=t,fillReviewsHTML(self.restaurant.reviews)})}),fillRestaurantHTML=((e=self.restaurant)=>{document.getElementById("restaurant-name").innerHTML=e.name,document.getElementById("restaurant-address").innerHTML=e.address;const t=document.getElementById("restaurant-img");t.className="lozad",t.setAttribute("data-src",DBHelper.imageUrlForRestaurant(e)),t.alt=`photo of ${e.name} restaurant`,document.getElementById("restaurant-cuisine").innerHTML=e.cuisine_type;const a=document.getElementById("restaurant-favorite");e.is_favorite&&a.classList.add("is-favorite"),a.tabIndex="0",a.setAttribute("aria-label",`Favorite restaurant ${e.name}`),a.addEventListener("click",t=>favoriteRestaurant(t.target,e)),e.operating_hours&&fillRestaurantHoursHTML(),fetchReviewsForRestaurant()}),fillRestaurantHoursHTML=((e=self.restaurant.operating_hours)=>{const t=document.getElementById("restaurant-hours");for(let a in e){const n=document.createElement("tr");n.tabIndex=0;const r=document.createElement("td");r.innerHTML=a,n.appendChild(r);const s=document.createElement("td");s.innerHTML=e[a],n.appendChild(s),t.appendChild(n)}}),fillReviewsHTML=((e=self.restaurant.reviews)=>{const t=document.getElementById("reviews-container");if(!e){const e=document.createElement("p");return e.innerHTML="No reviews yet!",void t.appendChild(e)}const a=document.getElementById("reviews-list");e.forEach(e=>{a.appendChild(createReviewHTML(e))}),t.appendChild(a)}),createReviewHTML=(e=>{const t=document.createElement("li");t.tabIndex=0;const a=document.createElement("p");a.innerHTML=e.name,a.className="review-name",t.appendChild(a);const n=document.createElement("span");n.setAttribute("aria-label",`Rating: ${e.rating}`);for(let t=0;t<5;t++){const a=document.createElement("span");a.innerHTML="★",t<e.rating&&(a.className="reviews-rating"),n.appendChild(a)}t.appendChild(n);const r=document.createElement("span");r.innerHTML=new Date(e.createdAt).toDateString(),t.appendChild(r);const s=document.createElement("p");return s.innerHTML=e.comments,t.appendChild(s),t}),fillBreadcrumb=((e=self.restaurant)=>{const t=document.getElementById("breadcrumb"),a=document.createElement("li");a.innerHTML=e.name,t.appendChild(a)}),getParameterByName=((e,t)=>{t||(t=window.location.href),e=e.replace(/[\[\]]/g,"\\$&");const a=new RegExp(`[?&]${e}(=([^&#]*)|&|#|$)`).exec(t);return a?a[2]?decodeURIComponent(a[2].replace(/\+/g," ")):"":null}),lazyLoadImages=(()=>{lozad().observe()}),loadStaticMap=(e=>{const t=document.getElementById("map");let a=t.clientHeight,n=t.clientWidth,r=1;(a>640||n>640)&&(a=Math.floor(a/2),n=Math.floor(n/2),r=2),t.style.backgroundImage=`url(https://maps.googleapis.com/maps/api/staticmap?size=${n}x${a}&markers=size:mid|${e.latlng.lat},${e.latlng.lng}&key=AIzaSyDKsWF94cMGUciBs96YIpbCmexfRKT75x4&scale=${r})`}),loadRealMap=(()=>{if(mapLoaded)return;const e=document.createElement("script");e.type="text/javascript",e.src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDKsWF94cMGUciBs96YIpbCmexfRKT75x4&libraries=places&callback=initMap",document.body.appendChild(e)}),showAddReviewDialog=(()=>{document.getElementById("addReviewDialog").showModal()}),!window.HTMLDialogElement){const e=document.createElement("script");e.src="dialog-polyfill.js",e.type="text/javascript",e.onload=function(){const e=document.querySelector("dialog");dialogPolyfill.registerDialog(e)},document.body.appendChild(e);const t=document.createElement("link");t.rel="stylesheet",t.type="text/css",t.href="dialog-polyfill.css",document.head.appendChild(t)}submitReview=(()=>{const e={restaurant_id:self.restaurant.id,name:document.getElementById("name").value,rating:parseInt(document.querySelector('input[name="rating"]:checked').value),comments:document.getElementById("comments").value,createdAt:(new Date).getTime()};DBHelper.addReview(e),document.querySelector("form").reset(),document.getElementById("reviews-list").appendChild(createReviewHTML(e)),document.querySelector("dialog").close()}),cancelAddReview=(()=>{document.querySelector("form").reset(),document.querySelector("dialog").close()}),favoriteRestaurant=((e,t)=>{e.className.indexOf("is-favorite")>-1?(e.classList.remove("is-favorite"),DBHelper.favoriteRestaurant(t,!1)):(e.classList.add("is-favorite"),DBHelper.favoriteRestaurant(t,!0))});
//# sourceMappingURL=restaurant_info.js.map