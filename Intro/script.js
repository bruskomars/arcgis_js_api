require([
  "esri/config",
  "esri/Map",
  "esri/views/MapView",
  "esri/WebMap",
  "esri/widgets/Legend",
  "esri/widgets/LayerList",
  "esri/geometry/Point",
  "esri/Graphic",
  "esri/layers/GraphicsLayer",
  "esri/layers/FeatureLayer",
  "esri/widgets/FeatureTable",
], function (
  esriConfig,
  Map,
  MapView,
  WebMap,
  Legend,
  LayerList,
  Point,
  Graphic,
  GraphicsLayer,
  FeatureLayer,
  FeatureTable,
) {
  // Set your API key
  esriConfig.apiKey =
    "AAPTaJYkH5ASSLWvdKQWeQ8cs5Q..JmR5E1jJCVswiUjDOD07Wfgyesr87fOEEparDrWmYzJRv8_mIZXixUdW6w1OxvvckCGEgkPO-zZvE8B1QkYxJiSujtj3D0k2rzxDdqW1XZyV1W_cjxWl3UKfyxiNbi13vIjFxMZxZIs9AeCRiRXtxxG-yMJa6kKzD9NkU6qh9bsoyG8UwbEKJfL59DitldgFK8GT9idjo5Hj2OBB-jrWDdIq8NDQIMJCmPCy4nxlgwr8UABdhQKrPrebGBU.AT1_U02ceave";

  // // Create a map with a topographic basemap
  // const map = new Map({
  //   basemap: "arcgis-streets",
  // });

  // layer from itemID
  const map = new WebMap({
    portalItem: {
      id: "391a540d56b64375a0f76d4778d1880a",
      // id: "e691172598f04ea8881cd2a4adaa45ba",
      // id: "41281c51f9de45edaf1c8ed44bb10e30",
    },
  });

  // //Layer from feature service
  const featureLayer = new FeatureLayer({
    url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/PHL_Boundaries_view/FeatureServer",
  });
  // Add to map
  map.add(featureLayer);

  // Create a view and link it to the map
  const view = new MapView({
    container: "viewDiv", // ID of the HTML element
    map: map, // Reference to the map
    center: [121.894019, 14.359301], // Longitude, Latitude
    zoom: 5, // Zoom level
  });

  const featureTable = new FeatureTable({
    view: view,
    layer: featureLayer,
    container: "tableDiv",
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

  //layer list dropdown widget
  // Build dropdown options once the webmap is loaded
  view.when(() => {
    const select = document.getElementById("layerName");
    map.layers.forEach((layer) => {
      // console.log(layer.title);
      let option = document.createElement("option");
      option.textContent = layer.title;
      option.value = layer.id; // use the layer id for lookup
      select.appendChild(option);
    });

    select.addEventListener("change", (e) => {
      const selectedId = e.target.value;
      const selectedLayer = map.layers.find((l) => l.id === selectedId);

      if (selectedLayer) {
        // Switch the FeatureTable to the selected layer
        featureTable.layer = selectedLayer;
      } else {
        console.warn("No layer found for id:", selectedId);
      }
    });
  });

  let lyrList = document.getElementById("layerList");
  view.ui.add(lyrList, "top-left");

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

  /*
  const graphicsLayer = new GraphicsLayer();
  view.map.add(graphicsLayer);


  // creating point geometry
  const point = new Point({
    longitude: 120.93151,
    latitude: 15.07021,
  });
  // creating simple point graphics
  const pointGraphic = new Graphic({
    geometry: point,
    symbol: {
      type: "simple-marker",
      color: "red",
      size: "12px",
    },
  });

  graphicsLayer.add(pointGraphic);
  */

  // added input html in map
  view.ui.add(document.getElementById("queryFeatures"), "top-left");
  document
    .getElementById("queryBtn")
    .addEventListener("click", queryFeatureLayer);

  // create Query for the layer
  function queryFeatureLayer() {
    // wait for the map to be fully loaded
    map.when(() => {
      let featureName = document.getElementById("searchInput").value;
      // alert(featureName);

      // getting the layers since im using a webmap
      const layer = map.layers.find((layer) => layer.type === "feature");
      // layer.fields.forEach((f) => {
      //   console.log("Field name:", f.name, "Alias:", f.alias, "Type:", f.type);
      // });

      let query = layer.createQuery();

      // define the parameters for the query
      query.where = `NAME='${featureName}'`;
      query.outFields = ["*"];
      query.returnGeometry = true;
      // execute the query
      layer.queryFeatures(query).then((result) => {
        console.log("Features found:", result);

        // highlight and zoom to result
        if (result && result.features && result.features.length > 0) {
          const feature = result.features[0];
          view.whenLayerView(layer).then((layerView) => {
            if (layerView.highlightHandle) {
              layerView.highlightHandle.remove();
            }
            // Highlight the feature (default yellow outline)
            layerView.highlightHandle = layerView.highlight(feature);

            // Zoom to the feature
            view.goTo(feature.geometry);
          });
        } else {
          alert(`${featureName} not found in Cities Boundaries`);
        }
      });
    });
  }

  //
});
