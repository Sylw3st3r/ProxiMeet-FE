import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useField } from "formik";
import { useTranslation } from "react-i18next";
import {
  Box,
  Typography,
  FormHelperText,
  FormControl,
  InputLabel,
  IconButton,
  Dialog,
  Slider,
  Button,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import Cropper from "react-easy-crop";

// TODO: Fix this workaround
const CropperComponent = Cropper as unknown as React.ComponentType<any>;

export const getCroppedImg = async (
  imageSrc: string,
  crop: { x: number; y: number },
  zoom: number,
  aspect: number,
  croppedAreaPixels: any,
): Promise<Blob> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = croppedAreaPixels.width;
  canvas.height = croppedAreaPixels.height;
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Could not get canvas context");

  ctx.drawImage(
    image,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error("Canvas is empty"));
      resolve(blob);
    }, "image/jpeg");
  });
};

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

export default function ImageUpload({ name, label, aspect = 16 / 9 }: any) {
  const [field, meta, helpers] = useField(name);
  const { t } = useTranslation();

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const onCropComplete = useCallback((_: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setCropDialogOpen(true);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleCropSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    const croppedBlob = await getCroppedImg(
      imageSrc,
      crop,
      zoom,
      aspect,
      croppedAreaPixels,
    );
    const croppedFile = new File([croppedBlob], "cropped.jpeg", {
      type: "image/jpeg",
    });
    helpers.setValue(croppedFile);
    helpers.setTouched(false);
    setCropDialogOpen(false);
    setImageSrc(null);
  };

  const handleRemove = () => {
    helpers.setValue(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const showError = Boolean(meta.error && meta.touched);

  return (
    <>
      <FormControl fullWidth error={showError} variant="standard">
        {label && (
          <InputLabel focused shrink htmlFor={`image-upload-${name}`}>
            {label}
          </InputLabel>
        )}

        {!field.value && (
          <Box
            {...getRootProps()}
            sx={{
              borderBottom: 1,
              borderColor: showError ? "error.main" : "text.primary",
              pb: 0.5,
              pt: 2.5,
              cursor: "pointer",
              "&:hover": {
                backgroundColor: isDragActive ? "action.hover" : "transparent",
              },
            }}
          >
            <input {...getInputProps()} id={`image-upload-${name}`} />
            <Typography
              variant="body2"
              color={showError ? "error.main" : "textSecondary"}
            >
              {t("Drag 'n' drop an image here, or click to select")}
            </Typography>
          </Box>
        )}

        {field.value && (
          <Box
            mt={2}
            display="flex"
            flexDirection="row"
            alignItems="flex-start"
            gap={1}
          >
            <Box flex={1}>
              <img
                src={
                  typeof field.value === "string"
                    ? `http://localhost:3001/images/${field.value}`
                    : URL.createObjectURL(field.value)
                }
                alt="Preview"
                style={{
                  width: "100%",
                  objectFit: "contain",
                  borderRadius: 4,
                  boxSizing: "border-box",
                  border: "1px solid #ccc",
                }}
              />
            </Box>
            <IconButton
              aria-label={t("Remove image")}
              onClick={handleRemove}
              size="small"
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </Box>
        )}

        {showError && <FormHelperText>{meta.error}</FormHelperText>}
      </FormControl>

      {/* Crop Dialog */}
      <Dialog open={cropDialogOpen} fullWidth maxWidth="sm">
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: 400,
            bgcolor: "black",
          }}
        >
          <CropperComponent
            image={imageSrc!}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </Box>
        <Box p={2}>
          <Typography gutterBottom>{t("Zoom")}</Typography>
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            onChange={(_, z) => setZoom(z as number)}
          />
          <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
            <Button onClick={() => setCropDialogOpen(false)}>
              {t("Cancel")}
            </Button>
            <Button onClick={handleCropSave} variant="contained">
              {t("Crop & Save")}
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}
