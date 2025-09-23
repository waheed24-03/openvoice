// File: src/components/ImageCropModal.jsx

import React, { useState, useRef } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import PrimaryButton from './PrimaryButton';

// Helper function to create the initial crop area
function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop({ unit: '%', width: 90 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight,
  );
}

const ImageCropModal = ({ imageSrc, onClose, onSave }) => {
  const imgRef = useRef(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const aspect = 1; // Square aspect ratio for profile pictures

  function onImageLoad(e) {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, aspect));
  }

  const handleSaveCrop = async () => {
    if (!completedCrop || !imgRef.current) {
      return;
    }

    const canvas = document.createElement('canvas');
    const image = imgRef.current;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const crop = completedCrop;

    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );
    
    // Convert canvas to blob, which can be uploaded to Supabase
    canvas.toBlob((blob) => {
        if (blob) {
            onSave(blob);
        }
    }, 'image/png');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-secondary rounded-lg p-6 w-full max-w-md border border-border-color mx-4"
      >
        <h2 className="text-xl font-bold text-text-primary mb-4">Crop Your Image</h2>
        <div className="flex justify-center">
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
              circularCrop
            >
              <img
                ref={imgRef}
                alt="Crop me"
                src={imageSrc}
                onLoad={onImageLoad}
                className="max-h-[60vh]"
              />
            </ReactCrop>
        </div>
        <div className="flex justify-end mt-6 space-x-4">
            <button onClick={onClose} className="text-text-secondary font-bold">Cancel</button>
            <PrimaryButton label="Save" onClick={handleSaveCrop} />
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;