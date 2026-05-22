require(["esri/config", "esri/Map", "esri/views/MapView"], function (
  esriConfig,
  Map,
  MapView,
) {
  // Set your API key
  esriConfig.apiKey = "YOUR_API_KEY";

  // Create a map with a topographic basemap
  const map = new Map({
    basemap: "hybrid",
  });

  // Create a view and link it to the map
  const view = new MapView({
    container: "viewDiv", // ID of the HTML element
    map: map, // Reference to the map
    center: [121.894019, 14.359301], // Longitude, Latitude
    zoom: 5, // Zoom level
  });
});
