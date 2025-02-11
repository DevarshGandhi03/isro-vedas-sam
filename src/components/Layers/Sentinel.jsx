import React, { useContext, useEffect, useRef, useState } from "react";
import { MapContainer, Marker, WMSTileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { LayerContext } from "@/context/LayerContext";
import { Button } from "../ui/button";
import { Layers, Square } from "lucide-react";
import useSidebar from "../ui/sidebar";

function FixedSquareOverlay({ setBounds, isCalled }) {
  const map = useMap();
  const updateBounds = () => {
    const centerPoint = map.latLngToContainerPoint(map.getCenter());
    const halfSize = 150;

    const topLeft = L.point(centerPoint.x - halfSize, centerPoint.y - halfSize);
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

  useEffect(() => {
    if (isCalled) {
      updateBounds();
    }
  }, [isCalled]);

  return (
    <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] -translate-x-1/2 -translate-y-1/2 border-2 border-blue-500 z-[9999] pointer-events-none"></div>
  );
}

function Sentinel() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [isCalled, setIsCalled] = useState(false);
  const { toggleSidebar } = useSidebar();
  const {
    fromDate,
    toDate,
    selectedBand,
    selectedBandSaturation,
    selectedBounds,
    setSelectedBounds,
    setImageUrl,
  } = useContext(LayerContext);

  useEffect(() => {
    if (selectedBounds && isCalled) {
      fetchImage();
    }
  }, [selectedBounds]);

  const fetchImage = () => {
    const [[south, west], [north, east]] = selectedBounds;

    const wmsUrl =
      `https://vedas.sac.gov.in/ridam_server2/wms/?service=WMS&request=GetMap&layers=T0S0M1&styles=RIDAM_RGB&format=image/png&transparent=true&version=1.3.0&name=RIDAM_RGB&LAYERS=RIDAM_RGB&PROJECTION=EPSG:4326&ARGS=r_dataset_id:T0S1P0;g_dataset_id:T0S1P0;b_dataset_id:T0S1P0;r_from_time:${fromDate};r_to_time:${toDate};g_from_time:${fromDate};g_to_time:${toDate};b_from_time:${fromDate};b_to_time:${toDate};r_index:${selectedBand.r};g_index:${selectedBand.g};b_index:${selectedBand.b};r_max:${selectedBandSaturation.r};g_max:${selectedBandSaturation.g};b_max:${selectedBandSaturation.b}&WIDTH=500&HEIGHT=500&crs=EPSG:4326&bbox=${south},${west},${north},${east}`.replace(
        /\s+/g,
        ""
      );
    setImageUrl(wmsUrl);
    window.open("/extracted-image?wmsUrl="+encodeURIComponent(wmsUrl));
    setIsCalled(false);
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
        onClick={() => {
          showOverlay?setIsCalled(true):null;
        }}
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
            ARGS: `r_dataset_id:T0S1P0;g_dataset_id:T0S1P0;b_dataset_id:T0S1P0;r_from_time:${fromDate};r_to_time:${toDate};g_from_time:${fromDate};g_to_time:${toDate};b_from_time:${fromDate};b_to_time:${toDate};r_index:${selectedBand.r};g_index:${selectedBand.g};b_index:${selectedBand.b};r_max:${selectedBandSaturation.r};g_max:${selectedBandSaturation.g};b_max:${selectedBandSaturation.b}`,
          }}
          attribution="&copy; OpenStreetMap contributors"
        />
        {showOverlay && (
          <FixedSquareOverlay
            setBounds={setSelectedBounds}
            isCalled={isCalled}
            setIsCalled={setIsCalled}
          />
        )}
      </MapContainer>
    </div>
  );
}

export default Sentinel;
