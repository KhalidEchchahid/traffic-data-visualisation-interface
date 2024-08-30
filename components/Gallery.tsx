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
  productMedia: { image: string; name: string }[];
  selectedColor: string;
  setSelectedColor: (color: string) => void;
}

const Gallery = ({
  productMedia,
  selectedColor,
  setSelectedColor,
}: GalleryProps) => {
  const initialImage =
    productMedia.find((media) => media.name === selectedColor)?.image ||
    productMedia[0].image;
  const [mainImage, setMainImage] = useState(initialImage);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);

  useEffect(() => {
    const selectedColorObj = productMedia.find(
      (media) => media.image === mainImage
    );
    if (selectedColorObj) {
      setSelectedColor(selectedColorObj.name);
    }
  }, [mainImage, productMedia, setSelectedColor]);

  useEffect(() => {
    const selectedColorObj = productMedia.find(
      (media) => media.name === selectedColor
    );
    if (selectedColorObj) {
      setMainImage(selectedColorObj.image);
    }
  }, [selectedColor, productMedia]);

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
      const currentIndex = productMedia.findIndex(
        (media) => media.image === mainImage
      );
      const prevIndex =
        (currentIndex - 1 + productMedia.length) % productMedia.length;
      setMainImage(productMedia[prevIndex].image);
    },
    onSwipedRight: () => {
      const currentIndex = productMedia.findIndex(
        (media) => media.image === mainImage
      );
      const nextIndex = (currentIndex + 1) % productMedia.length;
      setMainImage(productMedia[nextIndex].image);
    },
    trackMouse: true,
  });

  return (
    <div className="flex flex-col gap-3 max-w-[500px]" id="gallery">
      <Dialog>
        <DialogTrigger asChild>
          <div {...handlers} className="relative">
            <Image
              src={mainImage}
              width={500}
              height={500}
              alt="product"
              className="w-96 h-96 rounded-lg shadow-xl object-cover relative cursor-pointer"
              onClick={() => openModal(mainImage)}
            />
          </div>
        </DialogTrigger>
        <DialogContent className="bg-inherit w-full max-h-screen p-0">
          <DialogHeader className="hidden">
            <DialogTitle>full image</DialogTitle>
          </DialogHeader>
          {modalImage && (
            <Image
              src={modalImage}
              alt="Full Image"
              objectFit="contain"
              className="rounded-lg w-full h-full"
              width={600}
              height={700}
            />
          )}
        </DialogContent>
      </Dialog>
      <div className="flex gap-2 overflow-auto tailwind-scrollbar-hide custom-scrollbar max-w-96">
        {productMedia.map((media, index) => (
          <Image
            key={index}
            src={media.image}
            height={200}
            width={200}
            alt="product"
            className={`w-20 h-20 rounded-lg object-cover cursor-pointer ${
              mainImage === media.image ? "border-2 border-pink-500" : ""
            }`}
            onClick={() => setMainImage(media.image)}
          />
        ))}
      </div>
    </div>
  );
};

export default Gallery;
