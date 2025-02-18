import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useMousePosition from "./hooks/useMousePosition";
import { MinusCircle, PlusCircle, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { useDebounce } from "@uidotdev/usehooks";
import Loading from "./Loading";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Card } from "./ui/card";

function ExtractedImage() {
  const [pixelPoints, setPixelPoints] = useState([]);
  const [hoverPixelPoints, setHoverPixelPoints] = useState([]);
  const [bgFgIdentifier, setBgFgIdentifier] = useState([]);
  const [tooglePixelPoints, setTooglePixelPoints] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedPointIndex, setSelectedPointIndex] = useState(null);
  const [searchParams] = useSearchParams();
  const imageUrl = searchParams.get("wmsUrl");
  const [blob, setBlob] = useState(null);
   const isLocal = window.location.hostname === "localhost";
  let imgUrl = isLocal
    ? imageUrl.replace(/^https:\/\/vedas\.sac\.gov\.in\//, "/api/")
    : imageUrl;

  const mousePosition = useDebounce(useMousePosition({ id: "myCanvas" }), 300);

  useEffect(() => {
    setHoverPixelPoints([mousePosition]);
  }, [mousePosition]);

  const getImgData = async () => {
    setLoading(true);
    try {
      const res = await fetch(imgUrl);
      const blobData = await res.blob();
      setBlob(blobData);
    } catch (error) {
      console.log("Error fetching image:" + error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (imgUrl) {
      getImgData();
    }
  }, [imgUrl]);

  useEffect(() => {
    if (!blob) return;

    const c = document.getElementById("myCanvas");
    const ctx = c.getContext("2d");
    const img = new Image();
    img.src = URL.createObjectURL(blob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0, 500, 500);
      pixelPoints.forEach(({ x, y }, i) => {
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        bgFgIdentifier[i] === "0"
          ? (ctx.fillStyle = "rgba(0, 150, 255, 1)")
          : (ctx.fillStyle = "rgba(255, 87, 51, 1)");
        ctx.fill();
        if (i === selectedPointIndex) {
          ctx.strokeStyle = "yellow";
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });
    };
    console.log(pixelPoints, bgFgIdentifier);
  }, [blob, selectedPointIndex, pixelPoints]);
  const handleCanvasClick = (event) => {
    const canvas = event.target;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const clickedIndex = pixelPoints.findIndex(
      (p) => Math.hypot(p.x - x, p.y - y) < 5
    );

    if (clickedIndex !== -1) {
      setSelectedPointIndex(clickedIndex);
    } else {
      setSelectedPointIndex(null);
      if (tooglePixelPoints === true) {
        setPixelPoints([...pixelPoints, { x, y }]);
        setBgFgIdentifier([...bgFgIdentifier, "0"]);
        const ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI); // Draws a circle
        ctx.fillStyle = "rgba(0, 150, 255, 1)"; // Semi-transparent blue fill
        ctx.fill();
      } else if (tooglePixelPoints === false) {
        setPixelPoints([...pixelPoints, { x, y }]);
        setBgFgIdentifier([...bgFgIdentifier, "1"]);
        const ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI); // Draws a circle
        ctx.fillStyle = "rgba(255, 87, 51, 1)"; // Semi-transparent blue fill
        ctx.fill();
      }
    }
  };
  const handleDeletePoint = () => {
    if (selectedPointIndex !== null) {
      setPixelPoints(pixelPoints.filter((_, i) => i !== selectedPointIndex));
      setBgFgIdentifier(
        bgFgIdentifier.filter((_, i) => i !== selectedPointIndex)
      );
      setSelectedPointIndex(null);
    }
  };
  const resetPoint = () => {
    setPixelPoints([]);
    setBgFgIdentifier([]);
    setSelectedPointIndex(null);
  };

  return (
    <div>
      <Loading
        visibilityClass={loading ? "block" : "hidden"}
        text="Extracting Image..."
      />

      <div
        className={`flex justify-center items-center ${
          loading ? "hidden" : "block"
        }`}
      >
        {" "}
        <TooltipProvider>
          <Card className="p-4 fixed left-10 rounded-2xl shadow-lg border border-gray-200 flex flex-col space-y-4">
            <div className="flex flex-col space-y-6">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={tooglePixelPoints ? "default" : "outline"}
                    onClick={() => setTooglePixelPoints(true)}
                  >
                    <PlusCircle className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add Foreground Point</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={!tooglePixelPoints ? "default" : "outline"}
                    onClick={() => setTooglePixelPoints(false)}
                  >
                    <MinusCircle className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add Background Point</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="destructive"
                    onClick={handleDeletePoint}
                    disabled={selectedPointIndex === null}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete Selected Point</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" onClick={resetPoint}>
                    <RotateCcw className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Reset All Points</TooltipContent>
              </Tooltip>
            </div>
          </Card>
        </TooltipProvider>
        <canvas
          id="myCanvas"
          className="mt-8 "
          width="500"
          height="500"
          onClick={handleCanvasClick}
        ></canvas>
      </div>
    </div>
  );
}

export default ExtractedImage;
