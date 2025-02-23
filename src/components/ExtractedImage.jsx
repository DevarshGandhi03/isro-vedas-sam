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
import axios from "axios";
import { env, InferenceSession, Tensor } from "onnxruntime-web";
import { handleImageScale } from "@/helpers/calculateScale";
import { runModelOnUserInteraction } from "@/helpers/modelHelper";
const MODEL_DIR = "/sam.onnx";

function ExtractedImage() {
  const [pixelPoints, setPixelPoints] = useState([]);
  const [embeddings, setEmbeddings] = useState([]);
  const [loadingText, setLoadingText] = useState("Extracing Image...");
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
    : `/api/proxy?url=${encodeURIComponent(imageUrl)}`;

  const mousePosition = useDebounce(useMousePosition({ id: "myCanvas" }), 300);
  // States for mask generation
  
  const [model, setModel] = useState(null);
  const [maskImg, setMaskImg] = useState(null);
  const [tensor, setTensor] = useState(null);
  const [modelScale, setModelScale] = useState(null);

  useEffect(() => {
    setHoverPixelPoints([mousePosition]);
  }, [mousePosition]);


// Getting image data and setting tensor
  const getImgData = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      const res = await axios.get(imgUrl, { responseType: "blob" });
      const blobData = await res.data;
      formData.append("image", blobData);
      setBlob(blobData);
      setLoadingText("Getting Image Embeddings...");
      try {
        const res = await axios.post(
          "https://vedas.sac.gov.in/satsam/api/get_embeddings",
          formData
        );
        const embeddingsArr = await res.data.embeddings;
        const embedding = new Tensor(
          "float32",
          new Float32Array(embeddingsArr),
          res.data.shape
        );

        setEmbeddings(embeddingsArr);
        setTensor(embedding);
      } catch (error) {
        console.log(error);
      }
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
  async function setmodel(blob) {
    const  samScale  = await handleImageScale(blob);

    setModelScale(samScale);
  }
  useEffect(() => {
    if (blob) {
      setmodel(blob);
    }
  }, [blob]);

  useEffect(() => {
    console.log(embeddings);
  }, [embeddings]);

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
        setPixelPoints([...pixelPoints, { x, y, label: 1 }]);
        setBgFgIdentifier([...bgFgIdentifier, "0"]);
        const ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI); // Draws a circle
        ctx.fillStyle = "rgba(0, 150, 255, 1)"; // Semi-transparent blue fill
        ctx.fill();
      } else if (tooglePixelPoints === false) {
        setPixelPoints([...pixelPoints, { x, y, label: 0 }]);
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
  useEffect(() => {
    const initModel = async () => {
      try {
        if (!MODEL_DIR) {
          console.error("Model directory is not defined.");
          return;
        }
        env.wasm.init = true;
        env.wasm.wasmPaths = "/node_modules/onnxruntime-web/dist/";

        const session = await InferenceSession.create(MODEL_DIR, {
          executionProviders: ["wasm"], // Try 'cpu' if 'wasm' fails
        });

        setModel(session);
        console.log("ONNX Model loaded successfully!");
      } catch (error) {
        console.error("Error loading ONNX model:", error);
      }
    };

    initModel();
  }, []);

  useEffect(() => {
    const handleUserInteraction = async (event) => {
      if (tensor && modelScale && pixelPoints) {
        try {
          await runModelOnUserInteraction({
            clicks: pixelPoints,
            model: model,
            modelScale: modelScale,
            setMaskImg: setMaskImg,
            tensor: tensor,
          });
          // console.log("reaching");
        } catch (error) {
          console.error("Error running model on user interaction:", error);
        }
      } else {
        console.log("else reaching");
        console.log(tensor, modelScale, pixelPoints);
      }
    };

    handleUserInteraction();
  }, [tensor, modelScale, pixelPoints]);

  return (
    <div>
      <Loading
        visibilityClass={loading ? "block" : "hidden"}
        text={loadingText}
      />

      <div
        className={`flex justify-center items-center ${
          loading ? "hidden" : "block"
        }`}
      >
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
