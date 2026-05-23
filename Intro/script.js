require([
  "esri/config",
  "esri/Map",
  "esri/views/MapView",
  "esri/WebMap",
  "esri/widgets/Legend",
  "esri/widgets/LayerList",
], function (esriConfig, Map, MapView, WebMap, Legend, LayerList) {
  // Set your API key
  esriConfig.apiKey =
    "AAPTaJYkH5ASSLWvdKQWeQ8cs5Q..JmR5E1jJCVswiUjDOD07Wfgyesr87fOEEparDrWmYzJRv8_mIZXixUdW6w1OxvvckCGEgkPO-zZvE8B1QkYxJiSujtj3D0k2rzxDdqW1XZyV1W_cjxWl3UKfyxiNbi13vIjFxMZxZIs9AeCRiRXtxxG-yMJa6kKzD9NkU6qh9bsoyG8UwbEKJfL59DitldgFK8GT9idjo5Hj2OBB-jrWDdIq8NDQIMJCmPCy4nxlgwr8UABdhQKrPrebGBU.AT1_U02ceave";

  //   // Create a map with a topographic basemap
  //   const map = new Map({
  //     basemap: "arcgis-streets",
  //   });

  const webmap = new WebMap({
    portalItem: {
      // id: "391a540d56b64375a0f76d4778d1880a",
      id: "e691172598f04ea8881cd2a4adaa45ba",
      // id: "f701172599f04ea8781de2a4adzz46ab",
    },
  });

  // Create a view and link it to the map
  const view = new MapView({
    container: "viewDiv", // ID of the HTML element
    map: webmap, // Reference to the map
    center: [121.894019, 14.359301], // Longitude, Latitude
    zoom: 5, // Zoom level
  });

  view.on("click", function (e) {
    console.log(e);
    console.log(e.mapPoint.latitude);

    // $("#xCoords").html(`Latitude: ${e.mapPoint.latitude.toFixed(5)}`);
    // $("#yCoords").html(`Longitude: ${e.mapPoint.longitude.toFixed(5)}`);
    if (e.mapPoint) {
      $("#map_coords").html(
        `Latitude: ${e.mapPoint.latitude.toFixed(5)} Longitude: ${e.mapPoint.longitude.toFixed(5)}`,
      );
    }
  });

  // Legend widget
  let legendWidget = new Legend({
    view: view,
  });
  // add widget to view
  view.ui.add(legendWidget, "bottom-right");

  // layer list widget
  view.ui.add(
    new LayerList({
      view: view,
    }),
    "top-right",
  );

  // getting the layername
  view.when(() => {
    webmap.layers.forEach((layer) => {
      console.log(layer.title);
      let option = document.createElement("option");
      option.textContent = layer.title;
      let select = document.getElementById("layerName");
      select.appendChild(option);
    });
  });

  let lyrList = document.getElementById("layerList");
  view.ui.add(lyrList, "top-right");
});
