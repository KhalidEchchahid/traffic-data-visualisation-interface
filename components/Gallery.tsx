"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface GalleryProps {
  images: string[];
}

const Gallery = ({ images }: GalleryProps) => {
  const [mainImage, setMainImage] = useState(images[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [prevImage, setPrevImage] = useState(images[images.length - 1]);
  const [nextImage, setNextImage] = useState(images[1]);

  useEffect(() => {
    const currentIndex = images.indexOf(mainImage);
    setPrevImage(images[(currentIndex - 1 + images.length) % images.length]);
    setNextImage(images[(currentIndex + 1) % images.length]);
  }, [mainImage, images]);

  const openModal = (image: string) => {
    setModalImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImage(null);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      const currentIndex = images.indexOf(mainImage);
      const nextIndex = (currentIndex + 1) % images.length;
      setMainImage(images[nextIndex]);
    },
    onSwipedRight: () => {
      const currentIndex = images.indexOf(mainImage);
      const prevIndex = (currentIndex - 1 + images.length) % images.length;
      setMainImage(images[prevIndex]);
    },
    trackMouse: true,
  });

  return (
    <div className="flex flex-col gap-3 max-w-[500px]" id="gallery">
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <div {...handlers} className="relative">
            {" "}
            <Image
              src={mainImage}
              width={300}
              height={300}
              alt="product"
              className="w-96 h-96 rounded-lg shadow-xl object-cover relative cursor-pointer"
              onClick={() => openModal(mainImage)}
            />
          </div>
        </DialogTrigger>
        <DialogContent className="bg-white w-full max-h-screen p-0">
          <DialogHeader className="hidden">
            <DialogTitle>Full image</DialogTitle>
          </DialogHeader>
          {modalImage && (
            <Image
              src={modalImage || "/placeholder.svg"}
              alt="Full Image"
              width={600}
              height={700}
              quality={100}
              className="rounded-lg w-full h-full object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
      <div className="flex gap-2 overflow-x-auto tailwind-scrollbar-hide custom-scrollbar max-w-96">
        {images.map((image, index) => (
          <Image
            key={index}
            src={image || "/placeholder.svg"}
            height={80}
            width={80}
            loading="lazy"
            alt={`product-${index}`}
            className={`w-20 h-20 rounded-lg object-cover cursor-pointer ${
              mainImage === image ? "border-2 border-blue-500" : ""
            }`}
            onClick={() => setMainImage(image)}
          />
        ))}
      </div>
      <div className="hidden">
        <Image
          src={prevImage || "/placeholder.svg"}
          width={300}
          height={300}
          priority
          alt="Preload previous"
        />
        <Image
          src={nextImage || "/placeholder.svg"}
          width={300}
          height={300}
          priority
          alt="Preload next"
        />
      </div>
    </div>
  );
};

export default Gallery;
