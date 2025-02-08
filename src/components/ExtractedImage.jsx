import React, { useContext } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { LayerContext } from "@/context/LayerContext";

function ExtractedImage() {
    const {imageUrl}=useContext(LayerContext)

  return (
    <div className="flex justify-center items-center">
      <img  src={imageUrl}/>
    </div>
  );
}

export default ExtractedImage;
