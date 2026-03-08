import React, { useState, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';

export default function AnamorphicCalculatorV4() {
  const [selectedCamera, setSelectedCamera] = useState('');
  const [sensorFormat, setSensorFormat] = useState('');
  const [anamorphicRatio, setAnamorphicRatio] = useState('');
  const [desiredAspectRatio, setDesiredAspectRatio] = useState('');
  const [useCustomPixels, setUseCustomPixels] = useState(false);
  const [customPixelWidth, setCustomPixelWidth] = useState('');
  const [customPixelHeight, setCustomPixelHeight] = useState('');
  const [useCustomAnamorphic, setUseCustomAnamorphic] = useState(false);
  const [customAnamorphicRatio, setCustomAnamorphicRatio] = useState('');
  const [useCustomAspectRatio, setUseCustomAspectRatio] = useState(false);
  const [customOutputAspectRatio, setCustomOutputAspectRatio] = useState('');

  const cameraList = [
    { id: 'arri-alexa-35', name: 'ARRI Alexa 35' },
    { id: 'arri-alexa-mini-lf', name: 'ARRI Alexa Mini LF' },
    { id: 'sony-burano', name: 'Sony Burano' },
    { id: 'sony-fx3', name: 'Sony FX3' },
    { id: 'sony-fx6', name: 'Sony FX6' },
    { id: 'sony-fx9', name: 'Sony FX9' },
    { id: 'sony-venice', name: 'Sony Venice' },
    { id: 'sony-venice-2', name: 'Sony Venice 2' },
    { id: 'red-komodo-x', name: 'RED Komodo-X' },
    { id: 'red-gemini', name: 'RED Gemini 5K' },
    { id: 'red-monstro', name: 'RED Monstro 8K' },
    { id: 'fujifilm-eterna', name: 'Fujifilm GFX ETERNA' },
    { id: 'fujifilm-gfx', name: 'Fujifilm GFX' },
  ];

  const sensorsByCamera = {
    'sony-venice-2': {
      'sony-venice-2-8k': { name: 'Sony Venice 2 - 8.6K 3:2 (8640x5760)', width: 35.9, height: 24.0, pixels: '8640 x 5760', aspectRatio: '3:2' },
      'sony-venice-2-8k-17-9': { name: 'Sony Venice 2 - 8.6K 17:9 (8640x4556)', width: 35.9, height: 19.0, pixels: '8640 x 4556', aspectRatio: '17:9' },
      'sony-venice-2-8k2-17-9': { name: 'Sony Venice 2 - 8.2K 17:9 (8192x4320)', width: 34.1, height: 18.0, pixels: '8192 x 4320', aspectRatio: '17:9' },
      'sony-venice-2-8k1-16-9': { name: 'Sony Venice 2 - 8.1K 16:9 (8100x4556)', width: 33.7, height: 19.0, pixels: '8100 x 4556', aspectRatio: '16:9' },
      'sony-venice-2-7k-16-9': { name: 'Sony Venice 2 - 7.6K 16:9 (7680x4320)', width: 31.9, height: 18.0, pixels: '7680 x 4320', aspectRatio: '16:9' },
      'sony-venice-2-8k2-239': { name: 'Sony Venice 2 - 8.2K 2.39:1 (8192x3432)', width: 34.1, height: 14.3, pixels: '8192 x 3432', aspectRatio: '2.39:1' },
      'sony-venice-2-5k8-6-5': { name: 'Sony Venice 2 - 5.8K 6:5 (5792x4854)', width: 24.1, height: 20.2, pixels: '5792 x 4854', aspectRatio: '6:5' },
      'sony-venice-2-5k8-4-3': { name: 'Sony Venice 2 - 5.8K 4:3 (5792x4276)', width: 24.1, height: 17.8, pixels: '5792 x 4276', aspectRatio: '4:3' },
      'sony-venice-2-5k8-17-9': { name: 'Sony Venice 2 - 5.8K 17:9 (5792x3056)', width: 24.1, height: 12.7, pixels: '5792 x 3056', aspectRatio: '17:9' },
      'sony-venice-2-5k4-16-9': { name: 'Sony Venice 2 - 5.4K 16:9 (5434x3056)', width: 22.6, height: 12.7, pixels: '5434 x 3056', aspectRatio: '16:9' },
      'sony-venice-2-5k5-239': { name: 'Sony Venice 2 - 5.5K 2.39:1 (5480x2296)', width: 22.8, height: 9.6, pixels: '5480 x 2296', aspectRatio: '2.39:1' },
    },
    'sony-venice': {
      'sony-venice-6k-3-2': { name: 'Sony Venice - 6K 3:2 (6048x4032)', width: 35.9, height: 24.0, pixels: '6048 x 4032', aspectRatio: '3:2' },
      'sony-venice-6k-185': { name: 'Sony Venice - 6K 1.85:1 (6054x3272)', width: 36.0, height: 19.4, pixels: '6054 x 3272', aspectRatio: '1.85:1' },
      'sony-venice-6k-17-9': { name: 'Sony Venice - 6K 17:9 (6054x3192)', width: 36.0, height: 19.0, pixels: '6054 x 3192', aspectRatio: '17:9' },
      'sony-venice-6k-239': { name: 'Sony Venice - 6K 2.39:1 (6048x2534)', width: 35.9, height: 15.0, pixels: '6048 x 2534', aspectRatio: '2.39:1' },
      'sony-venice-5k7-16-9': { name: 'Sony Venice - 5.7K 16:9 (5674x3192)', width: 33.7, height: 19.0, pixels: '5674 x 3192', aspectRatio: '16:9' },
      'sony-venice-4k-6-5': { name: 'Sony Venice - 4K 6:5 (4096x3432)', width: 24.3, height: 20.4, pixels: '4096 x 3432', aspectRatio: '6:5' },
      'sony-venice-4k-4-3': { name: 'Sony Venice - 4K 4:3 (4096x3024)', width: 24.3, height: 18.0, pixels: '4096 x 3024', aspectRatio: '4:3' },
      'sony-venice-4k-17-9': { name: 'Sony Venice - 4K 17:9 (4096x2160)', width: 24.3, height: 12.8, pixels: '4096 x 2160', aspectRatio: '17:9' },
      'sony-venice-4k-239': { name: 'Sony Venice - 4K 2.39:1 (4096x1716)', width: 24.3, height: 10.3, pixels: '4096 x 1716', aspectRatio: '2.39:1' },
      'sony-venice-3k8-16-9': { name: 'Sony Venice - 3.8K 16:9 (3840x2160)', width: 22.8, height: 12.8, pixels: '3840 x 2160', aspectRatio: '16:9' },
    },
    'sony-burano': {
      'sony-burano-8k6-16-9': { name: 'Sony Burano - 8.6K 16:9 (8632×4856)', width: 35.9, height: 20.2, pixels: '8632 x 4856', aspectRatio: '16:9' },
      'sony-burano-8k6-17-9-a': { name: 'Sony Burano - 8.6K 17:9 (8632×4552)', width: 35.9, height: 18.9, pixels: '8632 x 4552', aspectRatio: '17:9' },
      'sony-burano-8k6-17-9-b': { name: 'Sony Burano - 8.6K 17:9 (8192×4320)', width: 35.9, height: 18.9, pixels: '8192 x 4320', aspectRatio: '17:9' },
      'sony-burano-8k-16-9': { name: 'Sony Burano - 8.6K 16:9 (7680×4320)', width: 35.9, height: 20.2, pixels: '7680 x 4320', aspectRatio: '16:9' },
      'sony-burano-6k-17-9-a': { name: 'Sony Burano - 6K 17:9 (6052×3192)', width: 33.6, height: 17.7, pixels: '6052 x 3192', aspectRatio: '17:9' },
      'sony-burano-6k-16-9': { name: 'Sony Burano - 6K 16:9 (6052×3404)', width: 33.6, height: 18.9, pixels: '6052 x 3404', aspectRatio: '16:9' },
      'sony-burano-6k-17-9-dci': { name: 'Sony Burano - 6K 17:9 DCI (4096×2160)', width: 33.57, height: 17.7, pixels: '4096 x 2160', aspectRatio: '17:9' },
      'sony-burano-6k-16-9-dci': { name: 'Sony Burano - 6K 16:9 DCI (3840×2160)', width: 33.6, height: 18.9, pixels: '3840 x 2160', aspectRatio: '16:9' },
      'sony-burano-6k-16-9-hd': { name: 'Sony Burano - 6K 16:9 HD (1920×1080)', width: 33.6, height: 18.9, pixels: '1920 x 1080', aspectRatio: '16:9' },
      'sony-burano-s35-5k8-17-9': { name: 'Sony Burano - 5.8K 17:9 Super 35 (5760×3036)', width: 24.0, height: 12.6, pixels: '5760 x 3036', aspectRatio: '17:9' },
      'sony-burano-s35-5k8-16-9': { name: 'Sony Burano - 5.8K 16:9 Super 35 (5760×3240)', width: 24.0, height: 13.5, pixels: '5760 x 3240', aspectRatio: '16:9' },
      'sony-burano-s35-4k-17-9': { name: 'Sony Burano - 4K 17:9 Super 35 (4096×2160)', width: 24.0, height: 12.6, pixels: '4096 x 2160', aspectRatio: '17:9' },
      'sony-burano-s35-4k-16-9': { name: 'Sony Burano - 4K 16:9 Super 35 (3840×2160)', width: 24.0, height: 13.5, pixels: '3840 x 2160', aspectRatio: '16:9' },
      'sony-burano-s35-4k-16-9-hd': { name: 'Sony Burano - 4K 16:9 Super 35 HD (1920×1080)', width: 24.0, height: 13.5, pixels: '1920 x 1080', aspectRatio: '16:9' },
      'sony-burano-s35c-4k-17-9': { name: 'Sony Burano - 4K 17:9 Super 35c (4096×2160)', width: 17.0, height: 9.0, pixels: '4096 x 2160', aspectRatio: '17:9' },
    },
    'sony-fx6': {
      'sony-fx6-4k-dci': { name: 'Sony FX6 - 4K DCI (4096x2160)', width: 35.84, height: 19.0, pixels: '4096 x 2160', aspectRatio: '17:9' },
      'sony-fx6-4k-uhd': { name: 'Sony FX6 - 4K UHD (3840x2160)', width: 35.84, height: 20.16, pixels: '3840 x 2160', aspectRatio: '16:9' },
      'sony-fx6-hd': { name: 'Sony FX6 - HD (1920x1080)', width: 35.84, height: 20.16, pixels: '1920 x 1080', aspectRatio: '16:9' },
    },
    'sony-fx3': {
      'sony-fx3-4k-dci': { name: 'Sony FX3 - 4K DCI (4096x2160)', width: 35.6, height: 18.9, pixels: '4096 x 2160', aspectRatio: '17:9' },
      'sony-fx3-4k-uhd': { name: 'Sony FX3 - 4K UHD (3840x2160)', width: 35.6, height: 20.0, pixels: '3840 x 2160', aspectRatio: '16:9' },
      'sony-fx3-hd': { name: 'Sony FX3 - HD (1920x1080)', width: 35.6, height: 20.0, pixels: '1920 x 1080', aspectRatio: '16:9' },
    },
    'sony-fx9': {
      'sony-fx9-4k-dci': { name: 'Sony FX9 - 4K DCI (4096x2160)', width: 35.84, height: 19.0, pixels: '4096 x 2160', aspectRatio: '17:9' },
      'sony-fx9-4k-uhd': { name: 'Sony FX9 - 4K UHD (3840x2160)', width: 35.84, height: 20.16, pixels: '3840 x 2160', aspectRatio: '16:9' },
      'sony-fx9-hd': { name: 'Sony FX9 - HD (1920x1080)', width: 35.84, height: 20.16, pixels: '1920 x 1080', aspectRatio: '16:9' },
    },
    'arri-alexa-35': {
      'arri-alexa-35-4k6-og': { name: 'ARRI Alexa 35 - 4.6K 3:2 (4608x3164)', width: 27.99, height: 19.22, pixels: '4608 x 3164', aspectRatio: '3:2' },
      'arri-alexa-35-4k6-16-9': { name: 'ARRI Alexa 35 - 4.6K 16:9 (4608x2592)', width: 27.99, height: 19.22, pixels: '4608 x 2592', aspectRatio: '16:9' },
      'arri-alexa-35-4k-16-9': { name: 'ARRI Alexa 35 - 4K 16:9 (4096x2304)', width: 27.99, height: 19.22, pixels: '4096 x 2304', aspectRatio: '16:9' },
      'arri-alexa-35-4k-2-1': { name: 'ARRI Alexa 35 - 4K 2:1 (4096x2048)', width: 27.99, height: 19.22, pixels: '4096 x 2048', aspectRatio: '2:1' },
      'arri-alexa-35-3k3-6-5': { name: 'ARRI Alexa 35 - 3.3K 6:5 (3408x2856)', width: 27.99, height: 19.22, pixels: '3408 x 2856', aspectRatio: '6:5' },
      'arri-alexa-35-3k-1-1': { name: 'ARRI Alexa 35 - 3K 1:1 (3024x3024)', width: 27.99, height: 19.22, pixels: '3024 x 3024', aspectRatio: '1:1' },
    },
    'arri-alexa-mini-lf': {
      'arri-mini-lf-4k5-og-3-2': { name: 'ARRI Alexa Mini LF - 4.5K LF 3:2 Open Gate (4448x3096)', width: 36.70, height: 25.54, pixels: '4448 x 3096', aspectRatio: '3:2' },
      'arri-mini-lf-4k5-239': { name: 'ARRI Alexa Mini LF - 4.5K LF 2.39:1 (4448x1856)', width: 36.70, height: 15.38, pixels: '4448 x 1856', aspectRatio: '2.39:1' },
      'arri-mini-lf-4k3-16-9-a': { name: 'ARRI Alexa Mini LF - 4.3K LF 16:9 4K (3840x2160)', width: 31.87, height: 17.91, pixels: '3840 x 2160', aspectRatio: '16:9' },
      'arri-mini-lf-4k3-16-9-b': { name: 'ARRI Alexa Mini LF - 4.3K LF 16:9 HD (1920x1080)', width: 31.87, height: 17.91, pixels: '1920 x 1080', aspectRatio: '16:9' },
      'arri-mini-lf-3k8-16-9-a': { name: 'ARRI Alexa Mini LF - 3.8K LF 16:9 4K (3840x2160)', width: 31.87, height: 17.91, pixels: '3840 x 2160', aspectRatio: '16:9' },
      'arri-mini-lf-3k8-16-9-b': { name: 'ARRI Alexa Mini LF - 3.8K LF 16:9 2K (2048x1152)', width: 31.87, height: 17.91, pixels: '2048 x 1152', aspectRatio: '16:9' },
      'arri-mini-lf-3k8-16-9-c': { name: 'ARRI Alexa Mini LF - 3.8K LF 16:9 HD (1920x1080)', width: 31.87, height: 17.91, pixels: '1920 x 1080', aspectRatio: '16:9' },
      'arri-mini-lf-2k8-1-1': { name: 'ARRI Alexa Mini LF - 2.8K LF 1:1 Square (2880x2880)', width: 23.88, height: 23.88, pixels: '2880 x 2880', aspectRatio: '1:1' },
      'arri-mini-lf-3k4-s35-3-2': { name: 'ARRI Alexa Mini LF - 3.4K S35 3:2 (3424x2202)', width: 22.58, height: 14.53, pixels: '3424 x 2202', aspectRatio: '3:2' },
      'arri-mini-lf-3k2-s35-16-9': { name: 'ARRI Alexa Mini LF - 3.2K S35 16:9 (3200x1800)', width: 21.10, height: 11.87, pixels: '3200 x 1800', aspectRatio: '16:9' },
      'arri-mini-lf-2k8-s35-4-3': { name: 'ARRI Alexa Mini LF - 2.8K S35 4:3 (2880x2160)', width: 18.98, height: 14.24, pixels: '2880 x 2160', aspectRatio: '4:3' },
      'arri-mini-lf-2k8-s35-16-9': { name: 'ARRI Alexa Mini LF - 2.8K S35 16:9 HD (1920x1080)', width: 12.65, height: 7.12, pixels: '1920 x 1080', aspectRatio: '16:9' },
    },
    'red-komodo-x': {
      'red-komodo-x-6k': { name: 'RED Komodo-X - 6K 17:9 (6144x3240)', width: 27.03, height: 14.25, pixels: '6144 x 3240', aspectRatio: '17:9' },
      'red-komodo-x-4k': { name: 'RED Komodo-X - 4K 17:9 (4096x2160)', width: 27.03, height: 14.25, pixels: '4096 x 2160', aspectRatio: '17:9' },
      'red-komodo-x-2k': { name: 'RED Komodo-X - 2K 17:9 (2048x1080)', width: 27.03, height: 14.25, pixels: '2048 x 1080', aspectRatio: '17:9' },
    },
    'red-gemini': {
      'red-gemini-5k-6-5': { name: 'RED Gemini 5K - 5K 6:5 (3600x3000)', width: 24.89, height: 20.74, pixels: '3600 x 3000', aspectRatio: '6:5' },
      'red-gemini-5k-16-9': { name: 'RED Gemini 5K - 5K 16:9 (5120x2880)', width: 24.89, height: 20.74, pixels: '5120 x 2880', aspectRatio: '16:9' },
      'red-gemini-4k-6-5': { name: 'RED Gemini 5K - 4K 6:5 (2400x2000)', width: 24.89, height: 20.74, pixels: '2400 x 2000', aspectRatio: '6:5' },
    },
    'red-monstro': {
      'red-monstro-8k-6-5': { name: 'RED Monstro 8K - 8K 6:5 (5120x4320)', width: 24.89, height: 20.74, pixels: '5120 x 4320', aspectRatio: '6:5' },
      'red-monstro-8k-16-9': { name: 'RED Monstro 8K - 8K 16:9 (8192x4608)', width: 24.89, height: 20.74, pixels: '8192 x 4608', aspectRatio: '16:9' },
      'red-monstro-4k-6-5': { name: 'RED Monstro 8K - 4K 6:5 (2560x2160)', width: 24.89, height: 20.74, pixels: '2560 x 2160', aspectRatio: '6:5' },
    },
    'fujifilm-eterna': {
      'fujifilm-eterna-8k-4-3': { name: 'Fujifilm GFX ETERNA - 8K 4:3 (7680x5760)', width: 43.8, height: 32.9, pixels: '7680 x 5760', aspectRatio: '4:3' },
      'fujifilm-eterna-6k-16-9': { name: 'Fujifilm GFX ETERNA - 6.3K 16:9 (6144x3456)', width: 43.8, height: 32.9, pixels: '6144 x 3456', aspectRatio: '16:9' },
      'fujifilm-eterna-5k-239': { name: 'Fujifilm GFX ETERNA - 5.8K 2.39:1 (5824x2438)', width: 43.8, height: 32.9, pixels: '5824 x 2438', aspectRatio: '2.39:1' },
      'fujifilm-eterna-4k-4-3': { name: 'Fujifilm GFX ETERNA - 4K 4:3 (4096x3072)', width: 43.8, height: 32.9, pixels: '4096 x 3072', aspectRatio: '4:3' },
    },
    'fujifilm-gfx': {
      'fujifilm-gfx-8k-4-3': { name: 'Fujifilm GFX 100S - 8K 4:3 (7680x5760)', width: 43.8, height: 32.9, pixels: '7680 x 5760', aspectRatio: '4:3' },
      'fujifilm-gfx-6k-16-9': { name: 'Fujifilm GFX 100S - 6.3K 16:9 (6144x3456)', width: 43.8, height: 32.9, pixels: '6144 x 3456', aspectRatio: '16:9' },
      'fujifilm-gfx-4k-4-3': { name: 'Fujifilm GFX 100S - 4K 4:3 (4096x3072)', width: 43.8, height: 32.9, pixels: '4096 x 3072', aspectRatio: '4:3' },
    },
  };

  const currentSensors = sensorsByCamera[selectedCamera] || {};

  const anamorphicOptions = [
    { value: '1.3', label: '1.3x' },
    { value: '1.5', label: '1.5x' },
    { value: '1.8', label: '1.8x' },
    { value: '2.0', label: '2.0x' },
  ];

  const calculations = useMemo(() => {
    const sensor = currentSensors[sensorFormat];
    if (!sensor) {
      return {
        sensor: {},
        pixelWidth: 0,
        pixelHeight: 0,
        usedPixelWidth: 0,
        usedPixelHeight: 0,
        croppedPixelWidth: 0,
        croppedPixelHeight: 0,
        usedWidth: '0',
        usedHeight: '0',
        coverage: '0',
        naturalAspectRatio: '0',
        croppedHeight: '0',
        croppedWidth: '0',
        croppingFromTop: false,
        croppedPercentage: '0',
      };
    }
    const squeeze = parseFloat(useCustomAnamorphic ? customAnamorphicRatio : anamorphicRatio) || 1;
    const desiredAR = parseFloat(useCustomAspectRatio ? customOutputAspectRatio : desiredAspectRatio) || 2.39;

    let pixelWidth, pixelHeight;
    if (useCustomPixels) {
      pixelWidth = parseFloat(customPixelWidth) || 0;
      pixelHeight = parseFloat(customPixelHeight) || 0;
    } else {
      const pixelParts = sensor.pixels.split(' x ');
      pixelWidth = parseFloat(pixelParts[0]);
      pixelHeight = parseFloat(pixelParts[1]);
    }

    const sensorWidth = sensor.width;
    const sensorHeight = sensor.height;
    
    const usedWidth = sensorWidth;
    const usedHeight = sensorHeight;
    const coverage = 100;
    const usedPixelWidth = pixelWidth;
    const usedPixelHeight = pixelHeight;

    const desqueezedAspectRatio = (sensorWidth * squeeze) / sensorHeight;
    
    let croppedHeight = usedHeight;
    let croppedWidth = usedWidth;
    let croppedPixelWidth = usedPixelWidth;
    let croppedPixelHeight = usedPixelHeight;
    let croppingFromTop = false;
    let croppedPercentage = 0;

    if (desiredAR < desqueezedAspectRatio) {
      let testCroppedHeight = (usedPixelWidth * squeeze) / desiredAR;
      
      if (testCroppedHeight <= usedPixelHeight) {
        croppedPixelHeight = testCroppedHeight;
        croppedHeight = (sensorWidth * squeeze) / desiredAR;
        croppingFromTop = false;
        croppedPercentage = ((usedPixelHeight - croppedPixelHeight) / usedPixelHeight * 100);
      } else {
        croppedPixelWidth = (desiredAR * usedPixelHeight) / squeeze;
        croppedWidth = (desiredAR * usedHeight) / squeeze;
        croppingFromTop = true;
        croppedPercentage = ((usedPixelWidth - croppedPixelWidth) / usedPixelWidth * 100);
      }
    } else if (desiredAR > desqueezedAspectRatio) {
      let testCroppedWidth = (desiredAR * usedPixelHeight) / squeeze;
      
      if (testCroppedWidth <= usedPixelWidth) {
        croppedPixelWidth = testCroppedWidth;
        croppedWidth = (desiredAR * usedHeight) / squeeze;
        croppingFromTop = true;
        croppedPercentage = ((usedPixelWidth - croppedPixelWidth) / usedPixelWidth * 100);
      } else {
        croppedPixelHeight = (usedPixelWidth * squeeze) / desiredAR;
        croppedHeight = (sensorWidth * squeeze) / desiredAR;
        croppingFromTop = false;
        croppedPercentage = ((usedPixelHeight - croppedPixelHeight) / usedPixelHeight * 100);
      }
    } else {
      croppedPixelWidth = usedPixelWidth;
      croppedPixelHeight = usedPixelHeight;
      croppedWidth = usedWidth;
      croppedHeight = usedHeight;
      croppingFromTop = false;
      croppedPercentage = 0;
    }

    croppedPixelWidth = Math.min(croppedPixelWidth, usedPixelWidth);
    croppedPixelHeight = Math.min(croppedPixelHeight, usedPixelHeight);
    croppedWidth = Math.min(croppedWidth, usedWidth);
    croppedHeight = Math.min(croppedHeight, usedHeight);

    if (croppedPixelHeight < usedPixelHeight) {
      croppedPercentage = ((usedPixelHeight - croppedPixelHeight) / usedPixelHeight * 100);
    } else if (croppedPixelWidth < usedPixelWidth) {
      croppedPercentage = ((usedPixelWidth - croppedPixelWidth) / usedPixelWidth * 100);
    } else {
      croppedPercentage = 0;
    }

    return {
      sensor,
      pixelWidth: Math.round(pixelWidth),
      pixelHeight: Math.round(pixelHeight),
      usedPixelWidth: Math.round(usedPixelWidth),
      usedPixelHeight: Math.round(usedPixelHeight),
      croppedPixelWidth: Math.round(croppedPixelWidth),
      croppedPixelHeight: Math.round(croppedPixelHeight),
      usedWidth: usedWidth.toFixed(2),
      usedHeight: usedHeight.toFixed(2),
      coverage: coverage.toFixed(1),
      naturalAspectRatio: desqueezedAspectRatio.toFixed(2),
      croppedHeight: croppedHeight.toFixed(2),
      croppedWidth: croppedWidth.toFixed(2),
      croppingFromTop,
      croppedPercentage: croppedPercentage.toFixed(1),
    };
  }, [sensorFormat, anamorphicRatio, desiredAspectRatio, useCustomPixels, customPixelWidth, customPixelHeight, useCustomAnamorphic, customAnamorphicRatio, useCustomAspectRatio, customOutputAspectRatio, currentSensors]);

  return (
    <div className="min-h-screen bg-white text-black" style={{ fontFamily: '"Segoe UI", Roboto, sans-serif' }}>
      {/* Header */}
      <div className="border-b border-black border-opacity-10">
        <div className="max-w-7xl mx-auto px-8 py-16">
          <h1 className="text-5xl font-light tracking-tight mb-2" style={{ fontWeight: 300, letterSpacing: '-1px' }}>
            ANAMORPHIC LENS CALCULATOR
          </h1>
          <div className="w-16 h-px bg-black mt-6 mb-0"></div>
          <p className="text-sm tracking-widest text-black text-opacity-60 mt-6">FOR DIGITAL & FILM</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <h2 className="text-sm font-semibold tracking-widest mb-8 text-black text-opacity-70">PARAMETERS</h2>

              {/* Camera Selection */}
              <div className="mb-10">
                <label className="block text-xs tracking-widest text-black text-opacity-60 mb-3 font-semibold">CAMERA</label>
                <select
                  value={selectedCamera}
                  onChange={(e) => {
                    setSelectedCamera(e.target.value);
                    setSensorFormat('');
                  }}
                  className="w-full bg-white border border-black border-opacity-20 text-black px-4 py-3 rounded text-sm focus:outline-none focus:border-black focus:border-opacity-50 transition-all"
                >
                  <option value="">Select Camera</option>
                  {cameraList.map((camera) => (
                    <option key={camera.id} value={camera.id}>
                      {camera.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sensor Format */}
              <div className="mb-10">
                <label className="block text-xs tracking-widest text-black text-opacity-60 mb-3 font-semibold">SENSOR FORMAT</label>
                <select
                  value={sensorFormat}
                  onChange={(e) => {
                    setSensorFormat(e.target.value);
                    setUseCustomPixels(false);
                  }}
                  className="w-full bg-white border border-black border-opacity-20 text-black px-4 py-3 rounded text-sm focus:outline-none focus:border-black focus:border-opacity-50 transition-all"
                >
                  <option value="">Select Sensor</option>
                  {Object.entries(currentSensors).map(([key, sensor]) => (
                    <option key={key} value={key}>
                      {sensor.name}
                    </option>
                  ))}
                </select>

                {/* Custom Resolution */}
                <div className="mt-6 pt-6 border-t border-black border-opacity-10">
                  <label className="flex items-center gap-3 text-sm font-semibold cursor-pointer mb-4">
                    <input
                      type="checkbox"
                      checked={useCustomPixels}
                      onChange={(e) => setUseCustomPixels(e.target.checked)}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span className="text-black text-opacity-70">CUSTOM RESOLUTION</span>
                  </label>
                  {useCustomPixels && (
                    <div className="space-y-3">
                      <input
                        type="number"
                        value={customPixelWidth}
                        onChange={(e) => setCustomPixelWidth(e.target.value)}
                        placeholder="Width"
                        className="w-full bg-white border border-black border-opacity-20 text-black px-4 py-2 rounded text-sm focus:outline-none focus:border-black focus:border-opacity-50"
                      />
                      <input
                        type="number"
                        value={customPixelHeight}
                        onChange={(e) => setCustomPixelHeight(e.target.value)}
                        placeholder="Height"
                        className="w-full bg-white border border-black border-opacity-20 text-black px-4 py-2 rounded text-sm focus:outline-none focus:border-black focus:border-opacity-50"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Anamorphic Ratio */}
              <div className="mb-10">
                <label className="block text-xs tracking-widest text-black text-opacity-60 mb-3 font-semibold">SQUEEZE RATIO</label>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {anamorphicOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setAnamorphicRatio(opt.value);
                        setUseCustomAnamorphic(false);
                      }}
                      disabled={!sensorFormat}
                      className={`py-2 px-3 rounded text-sm font-semibold transition-all border ${
                        !sensorFormat
                          ? 'bg-white text-black text-opacity-30 border-black border-opacity-10 cursor-not-allowed'
                          : !useCustomAnamorphic && anamorphicRatio === opt.value
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-black border-black border-opacity-20 hover:border-opacity-40'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                <div className="pt-4 border-t border-black border-opacity-10">
                  <label className="flex items-center gap-3 text-sm font-semibold cursor-pointer mb-3">
                    <input
                      type="checkbox"
                      checked={useCustomAnamorphic}
                      onChange={(e) => setUseCustomAnamorphic(e.target.checked)}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span className="text-black text-opacity-70">CUSTOM RATIO</span>
                  </label>
                  {useCustomAnamorphic && (
                    <input
                      type="number"
                      value={customAnamorphicRatio}
                      onChange={(e) => setCustomAnamorphicRatio(e.target.value)}
                      placeholder="e.g. 1.5"
                      className="w-full bg-white border border-black border-opacity-20 text-black px-4 py-2 rounded text-sm focus:outline-none focus:border-black focus:border-opacity-50 font-mono"
                      step="0.1"
                      min="1"
                      max="3"
                    />
                  )}
                </div>
              </div>

              {/* Output Aspect Ratio */}
              <div>
                <label className="block text-xs tracking-widest text-black text-opacity-60 mb-3 font-semibold">OUTPUT ASPECT</label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {['1.33', '1.66', '1.85', '2.0', '2.35', '2.39'].map((ar) => (
                    <button
                      key={ar}
                      onClick={() => {
                        setDesiredAspectRatio(ar);
                        setUseCustomAspectRatio(false);
                      }}
                      disabled={!anamorphicRatio && !useCustomAnamorphic}
                      className={`flex-1 min-w-16 text-xs py-2 rounded transition-all border font-mono font-semibold ${
                        !anamorphicRatio && !useCustomAnamorphic
                          ? 'bg-white text-black text-opacity-30 border-black border-opacity-10 cursor-not-allowed'
                          : !useCustomAspectRatio && desiredAspectRatio === ar
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-black border-black border-opacity-20 hover:border-opacity-40'
                      }`}
                    >
                      {ar}
                    </button>
                  ))}
                </div>

                <div className="pt-4 border-t border-black border-opacity-10">
                  <label className="flex items-center gap-3 text-sm font-semibold cursor-pointer mb-3">
                    <input
                      type="checkbox"
                      checked={useCustomAspectRatio}
                      onChange={(e) => setUseCustomAspectRatio(e.target.checked)}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span className="text-black text-opacity-70">CUSTOM RATIO</span>
                  </label>
                  {useCustomAspectRatio && (
                    <input
                      type="number"
                      value={customOutputAspectRatio}
                      onChange={(e) => setCustomOutputAspectRatio(e.target.value)}
                      placeholder="e.g. 2.39"
                      className="w-full bg-white border border-black border-opacity-20 text-black px-4 py-2 rounded text-sm focus:outline-none focus:border-black focus:border-opacity-50 font-mono"
                      step="0.01"
                      min="1"
                      max="4"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Results */}
          <div className="lg:col-span-3">
            {!selectedCamera || !sensorFormat || (!anamorphicRatio && !useCustomAnamorphic) || (!desiredAspectRatio && !useCustomAspectRatio) ? (
              <div className="text-center py-16">
                <p className="text-black text-opacity-40 text-sm tracking-wide">Select all parameters to view calculations</p>
              </div>
            ) : (
              <>
                {/* Camera Info */}
                <div className="mb-12 pb-12 border-b border-black border-opacity-10">
                  <h3 className="text-sm font-semibold tracking-widest text-black text-opacity-70 mb-6">CAMERA SPEC</h3>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <p className="text-xs text-black text-opacity-50 tracking-widest mb-2">CAMERA</p>
                      <p className="text-lg font-light">{calculations.sensor?.name || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-black text-opacity-50 tracking-widest mb-2">NATIVE RESOLUTION</p>
                      <p className="text-lg font-mono font-light">{calculations.pixelWidth} × {calculations.pixelHeight}</p>
                    </div>
                    <div>
                      <p className="text-xs text-black text-opacity-50 tracking-widest mb-2">SENSOR SIZE</p>
                      <p className="text-lg font-mono font-light">{calculations.sensor?.width?.toFixed(1) || '-'} × {calculations.sensor?.height?.toFixed(1) || '-'} mm</p>
                    </div>
                    <div>
                      <p className="text-xs text-black text-opacity-50 tracking-widest mb-2">NATIVE ASPECT</p>
                      <p className="text-lg font-mono font-light">{calculations.sensor?.aspectRatio || '-'}</p>
                    </div>
                  </div>
                </div>

                {/* Visualization */}
                <div className="mb-12 pb-12 border-b border-black border-opacity-10">
                  <h3 className="text-sm font-semibold tracking-widest text-black text-opacity-70 mb-8">DESQUEEZED OUTPUT</h3>
                  <div className="flex justify-center">
                    <div style={{ position: 'relative', width: '100%', maxWidth: '600px' }}>
                      <div 
                        className="bg-black bg-opacity-5 border border-black border-opacity-30"
                        style={{
                          aspectRatio: (calculations.pixelWidth * parseFloat(anamorphicRatio || customAnamorphicRatio || 1.5)) / calculations.pixelHeight || 2.0,
                        }}
                      >
                        {calculations.croppedPixelWidth > 0 && calculations.croppedPixelHeight > 0 && (
                          <>
                            <div
                              className="absolute border-2 border-black"
                              style={{
                                left: `${Math.max(0, Math.min(100, ((calculations.usedPixelWidth - calculations.croppedPixelWidth) / calculations.usedPixelWidth / 2) * 100))}%`,
                                top: `${Math.max(0, Math.min(100, ((calculations.usedPixelHeight - calculations.croppedPixelHeight) / calculations.usedPixelHeight / 2) * 100))}%`,
                                width: `${Math.max(0, Math.min(100, (calculations.croppedPixelWidth / calculations.usedPixelWidth) * 100))}%`,
                                height: `${Math.max(0, Math.min(100, (calculations.croppedPixelHeight / calculations.usedPixelHeight) * 100))}%`,
                                boxSizing: 'border-box'
                              }}
                            />
                            {/* Crop overlays */}
                            {calculations.croppedPixelHeight < calculations.usedPixelHeight && (
                              <>
                                <div
                                  className="absolute bg-black bg-opacity-20"
                                  style={{
                                    left: '0',
                                    top: '0',
                                    width: '100%',
                                    height: `${((calculations.usedPixelHeight - calculations.croppedPixelHeight) / calculations.usedPixelHeight / 2) * 100}%`,
                                  }}
                                />
                                <div
                                  className="absolute bg-black bg-opacity-20"
                                  style={{
                                    left: '0',
                                    bottom: '0',
                                    width: '100%',
                                    height: `${((calculations.usedPixelHeight - calculations.croppedPixelHeight) / calculations.usedPixelHeight / 2) * 100}%`,
                                  }}
                                />
                              </>
                            )}
                            {calculations.croppedPixelWidth < calculations.usedPixelWidth && (
                              <>
                                <div
                                  className="absolute bg-black bg-opacity-20"
                                  style={{
                                    left: '0',
                                    top: '0',
                                    width: `${((calculations.usedPixelWidth - calculations.croppedPixelWidth) / calculations.usedPixelWidth / 2) * 100}%`,
                                    height: '100%',
                                  }}
                                />
                                <div
                                  className="absolute bg-black bg-opacity-20"
                                  style={{
                                    right: '0',
                                    top: '0',
                                    width: `${((calculations.usedPixelWidth - calculations.croppedPixelWidth) / calculations.usedPixelWidth / 2) * 100}%`,
                                    height: '100%',
                                  }}
                                />
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Results Grid */}
                <div className="grid grid-cols-2 gap-6 mb-12">
                  <div className="pb-6 border-b border-black border-opacity-10">
                    <p className="text-xs text-black text-opacity-50 tracking-widest mb-3 font-semibold">DESQUEEZED ASPECT</p>
                    <p className="text-3xl font-light">{calculations.naturalAspectRatio}:1</p>
                  </div>
                  <div className="pb-6 border-b border-black border-opacity-10">
                    <p className="text-xs text-black text-opacity-50 tracking-widest mb-3 font-semibold">TARGET ASPECT</p>
                    <p className="text-3xl font-light">{desiredAspectRatio || customOutputAspectRatio}:1</p>
                  </div>
                  <div className="pb-6 border-b border-black border-opacity-10">
                    <p className="text-xs text-black text-opacity-50 tracking-widest mb-3 font-semibold">CROP REQUIRED</p>
                    <p className="text-3xl font-light">{Math.abs(parseFloat(calculations.croppedPercentage)).toFixed(1)}%</p>
                  </div>
                  <div className="pb-6 border-b border-black border-opacity-10">
                    <p className="text-xs text-black text-opacity-50 tracking-widest mb-3 font-semibold">OUTPUT UTILIZATION</p>
                    <p className="text-3xl font-light">{calculations.coverage}%</p>
                  </div>
                </div>

                {/* Crop Details */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="pb-6 border-b border-black border-opacity-10">
                    <p className="text-xs text-black text-opacity-50 tracking-widest mb-3 font-semibold">CROP TOP</p>
                    <p className="text-2xl font-mono font-light">{calculations.croppedPixelHeight < calculations.usedPixelHeight ? Math.round((calculations.usedPixelHeight - calculations.croppedPixelHeight) / 2) : 0}</p>
                    <p className="text-xs text-black text-opacity-40 mt-2">px</p>
                  </div>
                  <div className="pb-6 border-b border-black border-opacity-10">
                    <p className="text-xs text-black text-opacity-50 tracking-widest mb-3 font-semibold">CROP BOT</p>
                    <p className="text-2xl font-mono font-light">{calculations.croppedPixelHeight < calculations.usedPixelHeight ? Math.round((calculations.usedPixelHeight - calculations.croppedPixelHeight) / 2) : 0}</p>
                    <p className="text-xs text-black text-opacity-40 mt-2">px</p>
                  </div>
                  <div className="pb-6 border-b border-black border-opacity-10">
                    <p className="text-xs text-black text-opacity-50 tracking-widest mb-3 font-semibold">CROP LEFT</p>
                    <p className="text-2xl font-mono font-light">{calculations.croppedPixelWidth < calculations.usedPixelWidth ? Math.round((calculations.usedPixelWidth - calculations.croppedPixelWidth) / 2) : 0}</p>
                    <p className="text-xs text-black text-opacity-40 mt-2">px</p>
                  </div>
                  <div className="pb-6 border-b border-black border-opacity-10">
                    <p className="text-xs text-black text-opacity-50 tracking-widest mb-3 font-semibold">CROP RIGHT</p>
                    <p className="text-2xl font-mono font-light">{calculations.croppedPixelWidth < calculations.usedPixelWidth ? Math.round((calculations.usedPixelWidth - calculations.croppedPixelWidth) / 2) : 0}</p>
                    <p className="text-xs text-black text-opacity-40 mt-2">px</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        input[type='number'] {
          -moz-appearance: textfield;
        }
        input[type='number']::-webkit-outer-spin-button,
        input[type='number']::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
