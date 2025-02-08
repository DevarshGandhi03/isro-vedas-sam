import React, { useContext, useEffect, useState } from "react";
import { MapContainer, Marker, WMSTileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";
import { LayerContext } from "@/context/LayerContext";
import { Button } from "../ui/button";
import { Layers, Square } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useSidebar from "../ui/sidebar";

function FixedSquareOverlay({ setBounds }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const updateBounds = () => {
      const centerPoint = map.latLngToContainerPoint(map.getCenter());
      const halfSize = 150;
      const topLeft = L.point(
        centerPoint.x - halfSize,
        centerPoint.y - halfSize
      );
      const bottomRight = L.point(
        centerPoint.x + halfSize,
        centerPoint.y + halfSize
      );
      const topLeftLatLng = map.containerPointToLatLng(topLeft);
      const bottomRightLatLng = map.containerPointToLatLng(bottomRight);
      setBounds([
        [bottomRightLatLng.lat, topLeftLatLng.lng], // Bottom-left
        [topLeftLatLng.lat, bottomRightLatLng.lng], // Top-right
      ]);
    };

    updateBounds();
    map.on("moveend", updateBounds);

    return () => {
      map.off("moveend", updateBounds);
    };
  }, [map, setBounds]);

  return (
    <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] -translate-x-1/2 -translate-y-1/2 border-2 border-blue-500 z-[9999] pointer-events-none"></div>
  );
}

function Awifs() {
  const [showOverlay, setShowOverlay] = useState(false);
  const { toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const {
    fromDate,
    toDate,
    selectedBandSaturationAwifs,
    selectedBandAwifs,
    selectedBounds,
    setSelectedBounds,
    setImageUrl,
  } = useContext(LayerContext);

  useEffect(() => {
    if (selectedBounds) {
      console.log(selectedBounds);
    }
  }, [selectedBounds]);

  const fetchImage = () => {
    if (!selectedBounds) return;

    const [[south, west], [north, east]] = selectedBounds; // Extract BBOX coordinates

    const wmsUrl =
      `https://vedas.sac.gov.in/ridam_server2/wms/?service=WMS&request=GetMap&layers=T0S0M1&styles=RIDAM_RGB&format=image/png&transparent=true&version=1.3.0&name=RIDAM_RGB&LAYERS=RIDAM_RGB&PROJECTION=EPSG:4326&ARGS=r_dataset_id:T0S1P1;g_dataset_id:T0S1P1;b_dataset_id:T0S1P1;r_from_time:${fromDate};r_to_time:${toDate};g_from_time:${fromDate};g_to_time:${toDate};b_from_time:${fromDate};b_to_time:${toDate};r_index:${selectedBandAwifs.r};g_index:${selectedBandAwifs.g};b_index:${selectedBandAwifs.b};r_max:${selectedBandSaturationAwifs.r};g_max:${selectedBandSaturationAwifs.g};b_max:${selectedBandSaturationAwifs.b};r_min:0.001;g_min:0.001;b_min:0.001&WIDTH=500&HEIGHT=500&crs=EPSG:4326&bbox=${south},${west},${north},${east}`.replace(
        /\s+/g,
        ""
      );
    console.log(wmsUrl);
    setImageUrl(wmsUrl);
    navigate("/extracted-image");
  };

  return (
    <div style={{ position: "relative" }}>
      <Button
        onClick={() => setShowOverlay((prev) => !prev)}
        className="absolute top-2 right-2 z-[9999] px-4 py-2  border border-gray-300 shadow-md rounded-md  transition"
      >
        <Square />
      </Button>
      <Button
        onClick={fetchImage}
        className="absolute top-12 right-2 z-[9999] px-4 py-2  border border-gray-300 shadow-md rounded-md  transition"
      >
        Extract
      </Button>
      <Button
        onClick={() => {
          toggleSidebar();
        }}
        className="absolute top-40 left-0 z-[9999] p-4  border border-gray-300  rounded-none  transition"
      >
        <Layers />
      </Button>
      <MapContainer
        center={[22.351, 78.667]}
        zoom={5}
        scrollWheelZoom={true}
        style={{ height: "500px", width: "100%" }}
      >
        <WMSTileLayer
          url="https://vedas.sac.gov.in/ridam_server2/wms/"
          layers="T0S0M1"
          format="image/png"
          transparent={true}
          version="1.3.0"
          crs={L.CRS.EPSG4326}
          styles="RIDAM_RGB"
          params={{
            name: "RIDAM_RGB",
            LAYERS: "RIDAM_RGB",
            PROJECTION: "EPSG:4326",
            ARGS: `r_dataset_id:T0S1P1;g_dataset_id:T0S1P1;b_dataset_id:T0S1P1;r_from_time:${fromDate};r_to_time:${toDate};g_from_time:${fromDate};g_to_time:${toDate};b_from_time:${fromDate};b_to_time:${toDate};r_index:${selectedBandAwifs.r};g_index:${selectedBandAwifs.g};b_index:${selectedBandAwifs.b};r_max:${selectedBandSaturationAwifs.r};g_max:${selectedBandSaturationAwifs.g};b_max:${selectedBandSaturationAwifs.b};r_min:0.001;g_min:0.001;b_min:0.001`,
          }}
          attribution="&copy; OpenStreetMap contributors"
        />

        <Marker position={[25.026895, 78.529828]} />
        {showOverlay && <FixedSquareOverlay setBounds={setSelectedBounds} />}
      </MapContainer>
    </div>
  );
}

export default Awifs;
