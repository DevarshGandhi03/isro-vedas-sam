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
import {
  awifsBandOptions,
  awifsSaturationOptions,
} from "@/helpers/layerConfig";

function AwifsControls() {
  const {
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    selectedBandSaturationAwifs,
    setSelectedBandSaturationAwifs,
    selectedBandAwifs,
    setSelectedBandAwifs,
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
      <h2 className="text-lg font-semibold">AWiFS Data</h2>
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
                    setToDate(null); // Reset To date if invalid
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
                  after: new Date(), // Disable dates before 'From'
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
            value={selectedBandAwifs.r}
            onValueChange={(value) => {
              setSelectedBandAwifs({ ...selectedBandAwifs, r: value });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="R" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {awifsBandOptions.map((i) => (
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
            value={selectedBandAwifs.g}
            onValueChange={(value) => {
              setSelectedBandAwifs({ ...selectedBandAwifs, g: value });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="G" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {awifsBandOptions.map((i) => (
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
            value={selectedBandAwifs.b}
            onValueChange={(value) => {
              setSelectedBandAwifs({ ...selectedBandAwifs, b: value });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="B" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {awifsBandOptions.map((i) => (
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
            value={selectedBandSaturationAwifs.r}
            onValueChange={(value) => {
              setSelectedBandSaturationAwifs({
                ...selectedBandSaturationAwifs,
                r: value,
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="RMax" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {awifsSaturationOptions.map((i) => (
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
            value={selectedBandSaturationAwifs.g}
            onValueChange={(value) => {
              setSelectedBandSaturationAwifs({
                ...selectedBandSaturationAwifs,
                g: value,
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="G" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {awifsSaturationOptions.map((i) => (
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
            value={selectedBandSaturationAwifs.b}
            onValueChange={(value) => {
              setSelectedBandSaturationAwifs({
                ...selectedBandSaturationAwifs,
                b: value,
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="BMax" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {awifsSaturationOptions.map((i) => (
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

export default AwifsControls;
