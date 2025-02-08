import { format } from "date-fns";
import React, { useState } from "react";

export const LayerContext = React.createContext(null);

function LayerProvider({ children }) {
  const [selectedLayer, setSelectedLayer] = useState("awifs");

  const [selectedBounds, setSelectedBounds] = useState(null);
  const [selectedBandAwifs, setSelectedBandAwifs] = useState({
    r: "3",
    g: "2",
    b: "1",
  });
  const [selectedBand, setSelectedBand] = useState({
    r: "8",
    g: "4",
    b: "3",
  });
  const [selectedBandSaturationAwifs, setSelectedBandSaturationAwifs] =
    useState({
      r: "0.35",
      g: "0.3",
      b: "0.3",
    });
  const [selectedBandSaturation, setSelectedBandSaturation] = useState({
    r: "5000",
    g: "4000",
    b: "4000",
  });
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);

  return (
    <LayerContext.Provider
      value={{
        selectedLayer,
        setSelectedLayer,
        fromDate,
        setFromDate,
        toDate,
        setToDate,
        selectedBand,
        setSelectedBand,
        selectedBandSaturation,
        setSelectedBandSaturation,
        selectedBandSaturationAwifs,
        setSelectedBandSaturationAwifs,
        selectedBandAwifs,
        setSelectedBandAwifs,
        selectedBounds,
        setSelectedBounds,imageUrl, setImageUrl
      }}
    >
      <div>{children}</div>
    </LayerContext.Provider>
  );
}

export default LayerProvider;
