// 注: ejsの構文（<%= %>）を他ファイル（showPageMap.js）からshow.ejsに読み込んだ場合、評価されない！
// mapboxgl.accessToken = '<%= process.env.MAPBOX_TOKEN %>'; // ダメ

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 10, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<h4>${campground.title}</h4><p>${campground.location}</p>`)
    )
    .addTo(map);