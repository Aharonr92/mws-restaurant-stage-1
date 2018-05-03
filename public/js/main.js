let restaurants,neighborhoods,cuisines,map;var markers=[];let mapLoaded=!1;document.addEventListener("DOMContentLoaded",()=>{fetchNeighborhoods(),fetchCuisines(),updateRestaurants()}),fetchNeighborhoods=(()=>{DBHelper.fetchNeighborhoods((e,t)=>{e?console.error(e):(self.neighborhoods=t,fillNeighborhoodsHTML())})}),fillNeighborhoodsHTML=((e=self.neighborhoods)=>{const t=document.getElementById("neighborhoods-select");e.forEach(e=>{const a=document.createElement("option");a.innerHTML=e,a.value=e,t.append(a)})}),fetchCuisines=(()=>{DBHelper.fetchCuisines((e,t)=>{e?console.error(e):(self.cuisines=t,fillCuisinesHTML())})}),fillCuisinesHTML=((e=self.cuisines)=>{const t=document.getElementById("cuisines-select");e.forEach(e=>{const a=document.createElement("option");a.innerHTML=e,a.value=e,t.append(a)})}),window.initMap=(()=>{mapLoaded=!0;self.map=new google.maps.Map(document.getElementById("map"),{zoom:12,center:{lat:40.722216,lng:-73.987501},scrollwheel:!1}),setTimeout(addMarkersToMap(restaurants),0)}),updateRestaurants=(()=>{const e=document.getElementById("cuisines-select"),t=document.getElementById("neighborhoods-select"),a=e.selectedIndex,s=t.selectedIndex,n=e[a].value,r=t[s].value;DBHelper.fetchRestaurantByCuisineAndNeighborhood(n,r,(e,t)=>{e?console.error(e):(resetRestaurants(t),fillRestaurantsHTML(),addMarkersToMap(t),lazyLoadImages())})}),resetRestaurants=(e=>{self.restaurants=[],document.getElementById("restaurants-list").innerHTML="",self.markers.forEach(e=>e.setMap(null)),self.markers=[],self.restaurants=e}),fillRestaurantsHTML=((e=self.restaurants)=>{const t=document.getElementById("restaurants-list");e.forEach(e=>{t.append(createRestaurantHTML(e))})}),createRestaurantHTML=(e=>{const t=document.createElement("li"),a=document.createElement("img");a.className="restaurant-img lozad",a.setAttribute("data-src",DBHelper.imageUrlForRestaurant(e)),a.alt=`photo of ${e.name} restaurant`,t.append(a);const s=document.createElement("h2");s.innerHTML=e.name,t.append(s);const n=document.createElement("p");n.innerHTML=e.neighborhood,t.append(n);const r=document.createElement("p");r.innerHTML=e.address,t.append(r);const o=document.createElement("a");return o.innerHTML="View Details",o.title=e.name,o.setAttribute("aria-label",e.name),o.href=DBHelper.urlForRestaurant(e),t.append(o),t}),lazyLoadImages=(()=>{lozad().observe()}),addMarkersToMap=((e=self.restaurants)=>{mapLoaded?e.forEach(e=>{const t=DBHelper.mapMarkerForRestaurant(e,self.map);google.maps.event.addListener(t,"click",()=>{window.location.href=t.url}),self.markers.push(t)}):document.getElementById("map").style.backgroundImage=`url(https://maps.googleapis.com/maps/api/staticmap?size=640x200&markers=size:mid|${e.map(e=>`${e.latlng.lat},${e.latlng.lng}|`).join("")}&key=AIzaSyDKsWF94cMGUciBs96YIpbCmexfRKT75x4&scale=2&zoom=10&maptype=terrain)`}),loadRealMap=(()=>{if(mapLoaded)return;const e=document.createElement("script");e.type="text/javascript",e.src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDKsWF94cMGUciBs96YIpbCmexfRKT75x4&libraries=places&callback=initMap",document.body.appendChild(e)});
//# sourceMappingURL=main.js.map