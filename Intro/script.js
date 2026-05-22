require(["esri/config", "esri/Map", "esri/views/MapView"], function (
  esriConfig,
  Map,
  MapView,
) {
  // Set your API key
  esriConfig.apiKey =
    "AAPTaJYkH5ASSLWvdKQWeQ8cs5Q..JmR5E1jJCVswiUjDOD07Wfgyesr87fOEEparDrWmYzJRv8_mIZXixUdW6w1OxvvckCGEgkPO-zZvE8B1QkYxJiSujtj3D0k2rzxDdqW1XZyV1W_cjxWl3UKfyxiNbi13vIjFxMZxZIs9AeCRiRXtxxG-yMJa6kKzD9NkU6qh9bsoyG8UwbEKJfL59DitldgFK8GT9idjo5Hj2OBB-jrWDdIq8NDQIMJCmPCy4nxlgwr8UABdhQKrPrebGBU.AT1_U02ceave";

  // Create a map with a topographic basemap
  const map = new Map({
    basemap: "arcgis-streets",
  });

  // Create a view and link it to the map
  const view = new MapView({
    container: "viewDiv", // ID of the HTML element
    map: map, // Reference to the map
    center: [121.894019, 14.359301], // Longitude, Latitude
    zoom: 5, // Zoom level
  });
});
