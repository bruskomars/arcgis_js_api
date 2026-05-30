require([
  "esri/config",
  "esri/Map",
  "esri/views/MapView",
  "esri/WebMap",
  "esri/widgets/Legend",
  "esri/widgets/LayerList",
  "esri/Graphic",
  "esri/layers/GraphicsLayer",
  "esri/widgets/FeatureTable",
  "esri/layers/FeatureLayer",
], (
  esriConfig,
  Map,
  MapView,
  WebMap,
  Legend,
  LayerList,
  Graphic,
  GraphicsLayer,
  FeatureTable,
  FeatureLayer,
) => {
  esriConfig.apiKey =
    "AAPTaJYkH5ASSLWvdKQWeQ8cs5Q..JmR5E1jJCVswiUjDOD07Wfgyesr87fOEEparDrWmYzJRv8_mIZXixUdW6w1OxvvckCGEgkPO-zZvE8B1QkYxJiSujtj3D0k2rzxDdqW1XZyV1W_cjxWl3UKfyxiNbi13vIjFxMZxZIs9AeCRiRXtxxG-yMJa6kKzD9NkU6qh9bsoyG8UwbEKJfL59DitldgFK8GT9idjo5Hj2OBB-jrWDdIq8NDQIMJCmPCy4nxlgwr8UABdhQKrPrebGBU.AT1_U02ceave";

  const map = new WebMap({
    portalItem: {
      id: "391a540d56b64375a0f76d4778d1880a",
    },
  });

  const view = new MapView({
    container: "viewDiv",
    map: map,
    center: [121.894019, 14.359301], // Longitude, Latitude
    zoom: 5, // Zoom level
  });

  const legend = new Legend({
    view: view,
  });
  view.ui.add(legend, {
    position: "bottom-right",
  });

  const featureLayer = new FeatureLayer({
    url: "https://services3.arcgis.com/PDfv0I40sqpcaZxV/arcgis/rest/services/PHL_ADM2_PSA_NAMRIA_updated_diss3_pop/FeatureServer",
  });
  map.add(featureLayer);

  const featureTable = new FeatureTable({
    view: view,
    layer: featureLayer,
    container: "tableDiv",
  });

  const layerList = new LayerList({
    view: view,
  });
  view.ui.add(layerList, {
    position: "top-right",
  });

  // layer dropdown list
  view.ui.add(document.getElementById("layerListDropdown"), "top-left");

  view.when(() => {
    const select = document.getElementById("layerName");
    map.layers.forEach((layer) => {
      let option = document.createElement("option");
      option.textContent = layer.title;
      option.value = layer.id;
      select.appendChild(option);
    });

    select.addEventListener("change", (e) => {
      const selectedId = e.target.value;
      const selectedLayer = map.layers.find((l) => l.id === selectedId);

      if (selectedLayer) {
        console.log(`Switch to ${selectedLayer}`);
        featureTable.layer = selectedLayer;
      } else {
        console.warn("No layer found for id:", selectedId);
      }
    });
  });

  // query records
  view.ui.add(document.getElementById("queryDiv"), "top-left");
  $("#queryBtn").on("click", queryRecords);

  //get latlong when clicking on the map
  view.on("pointer-move", (e) => {
    const point = view.toMap({ x: event.x, y: event.y });
    if (point) {
      $("#mapCoords").html(
        `Latitude: ${point.latitude.toFixed(6)} Longitude: ${point.longitude.toFixed(6)}`,
      );
    }
  });

  function queryRecords() {
    map.when(() => {
      const input = $("#searchInput").val();

      // get all feature layer
      const layers = map.layers.filter((layer) => layer.type === "feature");

      layers.forEach((layer) => {
        let query = layer.createQuery();

        query.where = `NAME='${input}'`;
        query.outFields = ["*"];
        query.returnGeometry = true;

        layer
          .queryFeatures(query)
          .then((result) => {
            layer.visible = true;

            if (result.features.length > 0) {
              const gLayer = new GraphicsLayer({
                title: `Query Result: ${input}`,
              });

              result.features.forEach((f) => {
                const graphic = new Graphic({
                  geometry: f.geometry,
                  attributes: f.attributes,
                  symbol: {
                    type: "simple-fill", // adjust depending on geometry type
                    color: [255, 0, 0, 0.2],
                    outline: {
                      color: [255, 0, 0],
                      width: 2,
                    },
                  },
                });
                gLayer.add(graphic);
              });
              map.add(gLayer);
              view.goTo(result.features.map((f) => f.geometry));
            } else {
              layer.visible = false;
            }
          })
          .catch((error) => {
            layer.visible = false;
          });
      });
    });
  }
  //
});
