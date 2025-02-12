import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { format, parse } from "date-fns";
import React, { useContext, useState } from "react";
import { LayerContext } from "@/context/LayerContext";
import AwifsControls from "./LayerControls/Awifs";
import SentinelControls from "./LayerControls/Sentinel";

function AppSidebar({ children }) {
  const { selectedLayer, setSelectedLayer } = useContext(LayerContext);

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader />
        <SidebarContent className="flex flex-col h-full">
          <Tabs
            value={selectedLayer}
            onValueChange={setSelectedLayer}
            className="w-full flex flex-col"
          >
            <TabsList className="flex flex-col h-full">
              <TabsTrigger value="awifs" className="flex  bg-cover bg-center ">
                AWiFS
              </TabsTrigger>
              <TabsTrigger
                value="sentinel"
                className="flex  bg-cover bg-center "
              >
                Sentinel
              </TabsTrigger>
            </TabsList>
            <div className="flex-grow flex items-end w-full">
              <TabsContent value="awifs" className="w-full">
                <SidebarGroup className="p-4">
                  <AwifsControls />
                </SidebarGroup>
              </TabsContent>

              <TabsContent value="sentinel" className="w-full">
                <SidebarGroup className="p-4 space-y-4">
                  <SentinelControls/>
                </SidebarGroup>
              </TabsContent>
            </div>
          </Tabs>
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
      <main className="flex-1 h-screen overflow-hidden">{children}</main>
    </SidebarProvider>
  );
}

export default AppSidebar;
