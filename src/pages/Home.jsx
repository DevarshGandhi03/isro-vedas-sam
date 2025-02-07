import React, { useContext } from "react";
import "leaflet/dist/leaflet.css";
import { LayerContext } from "@/context/layerContext";
import Awifs from "@/components/Layers/Awifs";
import Sentinal from "@/components/Layers/Sentinel";

function Home() {
  const { selectedLayer } = useContext(LayerContext);

  return (
    <div>
      {selectedLayer === "awifs" && <Awifs />}
      {selectedLayer === "sentinel" && <Sentinal />}
    </div>
  );
}

export default Home;
