import React, { useContext, useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  WMSTileLayer,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { LayerContext } from "@/context/LayerContext";
import { Button } from "../ui/button";
import { Square } from "lucide-react";

function FixedSquareOverlay({ setBounds }) {
  const [center, setCenter] = useState(null);

  useMapEvents({
    moveend: (e) => {
      const newCenter = e.target.getCenter();
      setCenter(newCenter);
      console.log(newCenter);

      // Convert 1024 meters to degrees based on latitude
      const latFactor = 1024 / 111320; // 1024m in degrees latitude
      const lngFactor =
        1024 / (111320 * Math.cos((newCenter.lat * Math.PI) / 180)); // Adjust for longitude distortion

      const bounds = [
        [newCenter.lat - latFactor / 2, newCenter.lng - lngFactor / 2], // Bottom-left
        [newCenter.lat + latFactor / 2, newCenter.lng + lngFactor / 2], // Top-right
      ];
      setBounds(bounds);
    },
  });

  return (
    <div className="absolute top-1/2 left-1/2 w-[100px] h-[100px] -translate-x-1/2 -translate-y-1/2 border-2 border-blue-500 z-[9999] pointer-events-none"></div>
  );
}

function Sentinel() {
  const {
    fromDate,
    toDate,
    selectedBand,
    selectedBandSaturation,
    selectedBounds,
    setSelectedBounds,
  } = useContext(LayerContext);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    if (selectedBounds) {
      console.log("Updated Bounds:", selectedBounds);
    }
  }, [selectedBounds]);

  return (
    <div style={{ position: "relative" }}>
      <Button
        onClick={() => setShowOverlay((prev) => !prev)}
        className="absolute top-2 right-2 z-[9999] px-4 py-2  border border-gray-300 shadow-md rounded-md  transition"
      >
        <Square />
      </Button>
      <MapContainer
        center={[22.351, 78.667]} // Center of India
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
        <Marker position={[23.026895, 72.529828]} />
        {showOverlay && <FixedSquareOverlay setBounds={setSelectedBounds} />}
      </MapContainer>
    </div>
  );
}

export default Sentinel;
