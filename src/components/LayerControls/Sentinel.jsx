import React, { useContext, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format, parse } from "date-fns";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "../ui/select";
import { LayerContext } from "@/context/LayerContext";
import { bandOptions, saturationOptions } from "@/helpers/layerConfig";

function SentinelControls() {
  const {
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    selectedBand,
    setSelectedBand,
    selectedBandSaturation,
    setSelectedBandSaturation,
  } = useContext(LayerContext);

  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);

  // Convert formatted string to a Date object
  const getDateObject = (dateString) => {
    return dateString ? parse(dateString, "yyyyMMdd", new Date()) : null;
  };

  // Format date for display
  const formatDisplayDate = (dateString) => {
    if (!dateString) return null;
    const dateObj = parse(dateString, "yyyyMMdd", new Date());
    return format(dateObj, "dd/MM/yyyy");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Sentinel Data</h2>
      {/* From & To Date Picker in One Line */}
      <div className="flex space-x-4">
        {/* From Date Picker */}
        <div className="flex flex-col w-1/2">
          <Label className="text-sm font-medium mb-1">From</Label>
          <Popover open={fromOpen} onOpenChange={setFromOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full">
                {formatDisplayDate(fromDate) || "Select Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={getDateObject(fromDate)}
                onSelect={(date) => {
                  setFromDate(format(date, "yyyyMMdd"));
                  setFromOpen(false);
                  if (toDate && date > getDateObject(toDate)) {
                    setToDate(null);
                  }
                }}
                disabled={{
                  after: new Date(), // Disable future dates
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* To Date Picker */}
        <div className="flex flex-col w-1/2">
          <Label className="text-sm font-medium mb-1">To</Label>
          <Popover open={toOpen} onOpenChange={setToOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full">
                {formatDisplayDate(toDate) || "Select Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={getDateObject(toDate)}
                onSelect={(date) => {
                  setToDate(format(date, "yyyyMMdd"));
                  setToOpen(false);
                }}
                disabled={{
                  before: getDateObject(fromDate),
                  after: new Date(), // Disable past dates
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="flex space-x-4">
        <div className="flex flex-col w-1/3">
          <Label className="text-sm font-medium mb-1">R</Label>
          <Select
            value={selectedBand.r}
            onValueChange={(value) => {
              setSelectedBand({ ...selectedBand, r: value });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="R" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {bandOptions.map((i) => (
                  <SelectItem key={i.val} value={i.val}>
                    {i.lbl}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col w-1/3">
          <Label className="text-sm font-medium mb-1">G</Label>
          <Select
            value={selectedBand.g}
            onValueChange={(value) => {
              setSelectedBand({ ...selectedBand, g: value });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="G" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {bandOptions.map((i) => (
                  <SelectItem key={i.val} value={i.val}>
                    {i.lbl}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col w-1/3">
          <Label className="text-sm font-medium mb-1">B</Label>
          <Select
            value={selectedBand.b}
            onValueChange={(value) => {
              setSelectedBand({ ...selectedBand, b: value });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="B" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {bandOptions.map((i) => (
                  <SelectItem key={i.val} value={i.val}>
                    {i.lbl}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex space-x-4">
        <div className="flex flex-col w-1/3">
          <Label className="text-sm font-medium mb-1">RMax</Label>
          <Select
            value={selectedBandSaturation.r}
            onValueChange={(value) => {
              setSelectedBandSaturation({
                ...selectedBandSaturation,
                r: value,
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="RMax" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {saturationOptions.map((i) => (
                  <SelectItem key={i.val} value={i.val}>
                    {i.lbl}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col w-1/3">
          <Label className="text-sm font-medium mb-1">GMax</Label>
          <Select
            value={selectedBandSaturation.g}
            onValueChange={(value) => {
              setSelectedBandSaturation({
                ...selectedBandSaturation,
                g: value,
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="G" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {saturationOptions.map((i) => (
                  <SelectItem key={i.val} value={i.val}>
                    {i.lbl}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col w-1/3">
          <Label className="text-sm font-medium mb-1">BMax</Label>
          <Select
            value={selectedBandSaturation.b}
            onValueChange={(value) => {
              setSelectedBandSaturation({
                ...selectedBandSaturation,
                b: value,
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="BMax" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {saturationOptions.map((i) => (
                  <SelectItem key={i.val} value={i.val}>
                    {i.lbl}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

export default SentinelControls;
