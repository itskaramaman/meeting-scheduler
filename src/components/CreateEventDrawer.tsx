"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useSearchParams, useRouter } from "next/navigation";
import EventForm from "./EventForm";
import { useEffect, useState } from "react";

const CreateEventDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const create = searchParams.get("create");
    if (create === "true") {
      setIsOpen(true);
    }
  }, [searchParams]);

  const handleClose = () => {
    setIsOpen(false);
    if (searchParams.get("create") === "true") {
      router.replace(window?.location?.pathname);
    }
  };

  return (
    <Drawer open={isOpen} onClose={handleClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create New Event</DrawerTitle>
          <EventForm onSubmitForm={() => handleClose()} />
        </DrawerHeader>
        <DrawerClose asChild>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
        </DrawerClose>
      </DrawerContent>
    </Drawer>
  );
};

export default CreateEventDrawer;
