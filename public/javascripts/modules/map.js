import axios from 'axios';
import { $ } from './bling';

const mapOptions = {
  center: { lat: 30.2, lng: -97.7},
  zoom: 10
};

function loadPlaces(map, lat = 30.2, lng = -97.7) {
  axios.get(`/api/listings/near?lat=${lat}&lng=${lng}`)
    .then(res => {
      const places = res.data;
      if(!places.length){
        return;
      }
      //create a bounds
      const bounds = new google.maps.LatLngBounds();
      const infoWindow = new google.maps.InfoWindow();

      const markers = places.map(place => {
        const [placeLng, placeLat] = place.location.coordinates;
        const position = {lat: placeLat, lng: placeLng};
        bounds.extend(position);
        const marker = new google.maps.Marker({ map, position});
        marker.place = place;
        return marker;
      });

        // when someone clicks on a marker, show the listing details
      markers.forEach(marker => marker.addListener('click', function(){
        const html = `
          <div class='popup'>
            <a href="/listing/${this.place.slug}">
              <img src="/uploads/${this.place.pic || 'store.png'}" alt="${this.place.title}" />
              <p>${this.place.title} - ${this.place.location.address}</p>
          </a>
        </div>
        `;
        infoWindow.setContent(html);
        infoWindow.open(map, this);
      }));

      // then zoom the map to fit all the markers
      map.setCenter(bounds.getCenter());
      map.fitBounds(bounds);
    });
}
// const currentLocation = navigation.geolocation.getCurrentPosition

function makeMap(mapDiv){
  if(!mapDiv) return;

  const map = new google.maps.Map(mapDiv, mapOptions);
  loadPlaces(map);

  const input = $('[name="geolocate"]');
  const autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    loadPlaces(map, place.geometry.location.lat(), place.geometry.location.lng());
  });
}

export default makeMap;
