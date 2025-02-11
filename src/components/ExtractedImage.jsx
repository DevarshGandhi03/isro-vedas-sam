import React, { useContext } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import {useSearchParams } from "react-router-dom";

function ExtractedImage() {
  const [searchParams] = useSearchParams();
  const imageUrl = searchParams.get("wmsUrl");
  

  return (
    <div className="flex justify-center items-center">
      <img  src={decodeURIComponent(imageUrl)}/>
    </div>
  );
}

export default ExtractedImage;
