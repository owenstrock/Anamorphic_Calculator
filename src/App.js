import React, { useState, useMemo } from "react";
import { ChevronDown } from "lucide-react";

export default function AnamorphicCalculator() {
  // Format type selector
  const [formatType, setFormatType] = useState("digital"); // 'digital' or 'film'

  // DIGITAL STATE
  const [selectedCamera, setSelectedCamera] = useState("");
  const [lensImageCircle, setLensImageCircle] = useState("");
  const [bypassLensCircle, setBypassLensCircle] = useState(false);
  const [bypassCameraSelection, setBypassCameraSelection] = useState(false);
  const [sensorFormat, setSensorFormat] = useState("");
  const [anamorphicRatio, setAnamorphicRatio] = useState("");
  const [desiredAspectRatio, setDesiredAspectRatio] = useState("");
  const [useCustomPixels, setUseCustomPixels] = useState(false);
  const [customPixelWidth, setCustomPixelWidth] = useState("");
  const [customPixelHeight, setCustomPixelHeight] = useState("");
  const [useCustomAnamorphic, setUseCustomAnamorphic] = useState(false);
  const [customAnamorphicRatio, setCustomAnamorphicRatio] = useState("");
  const [useCustomAspectRatio, setUseCustomAspectRatio] = useState(false);
  const [customOutputAspectRatio, setCustomOutputAspectRatio] = useState("");

  // FILM STATE
  const [selectedFilmFormat, setSelectedFilmFormat] = useState("");
  const [filmAnamorphicRatio, setFilmAnamorphicRatio] = useState("");
  const [filmDesiredAspectRatio, setFilmDesiredAspectRatio] = useState("");
  const [useCustomFilmAnamorphic, setUseCustomFilmAnamorphic] = useState(false);
  const [customFilmAnamorphic, setCustomFilmAnamorphic] = useState("");
  const [useCustomFilmAspectRatio, setUseCustomFilmAspectRatio] =
    useState(false);
  const [customFilmAspectRatio, setCustomFilmAspectRatio] = useState("");

  // Comparison state
  const [comparisonTabsDigital, setComparisonTabsDigital] = useState([]);
  const [comparisonStatesDigital, setComparisonStatesDigital] = useState([{}]);
  const [comparisonTabsFilm, setComparisonTabsFilm] = useState([]);
  const [comparisonStatesFilm, setComparisonStatesFilm] = useState([{}]);

  // Collapsible sections for mobile
  const [showParameters, setShowParameters] = useState(true);

  const toggleParameters = () => {
    setShowParameters(!showParameters);
  };

  // Use format-specific comparison state
  const comparisonTabs =
    formatType === "digital" ? comparisonTabsDigital : comparisonTabsFilm;
  const setComparisonTabs =
    formatType === "digital" ? setComparisonTabsDigital : setComparisonTabsFilm;
  const comparisonStates =
    formatType === "digital" ? comparisonStatesDigital : comparisonStatesFilm;
  const setComparisonStates =
    formatType === "digital"
      ? setComparisonStatesDigital
      : setComparisonStatesFilm;

  // ============================================
  // DATA STRUCTURES
  // ============================================

  const cameraList = [
    {
      id: "arri-alexa-35",
      name: "ARRI Alexa 35",
      imageCircle: "super-35",
      format: "digital",
    },
    {
      id: "arri-alexa-mini",
      name: "ARRI Alexa Mini",
      imageCircle: "super-35",
      format: "digital",
    },
    {
      id: "arri-alexa-mini-lf",
      name: "ARRI Alexa Mini LF",
      imageCircle: "both",
      format: "digital",
    },
    {
      id: "sony-burano",
      name: "Sony Burano",
      imageCircle: "both",
      format: "digital",
    },
    {
      id: "sony-fx3",
      name: "Sony FX3",
      imageCircle: "full-frame",
      format: "digital",
    },
    {
      id: "sony-fx6",
      name: "Sony FX6",
      imageCircle: "full-frame",
      format: "digital",
    },
    {
      id: "sony-fx9",
      name: "Sony FX9",
      imageCircle: "full-frame",
      format: "digital",
    },
    {
      id: "sony-venice",
      name: "Sony Venice",
      imageCircle: "both",
      format: "digital",
    },
    {
      id: "sony-venice-2",
      name: "Sony Venice 2",
      imageCircle: "both",
      format: "digital",
    },
    {
      id: "red-komodo-x",
      name: "RED Komodo-X",
      imageCircle: "super-35",
      format: "digital",
    },
    {
      id: "red-gemini",
      name: "RED Gemini 5K",
      imageCircle: "super-35",
      format: "digital",
    },
    {
      id: "red-monstro",
      name: "RED Monstro 8K",
      imageCircle: "full-frame",
      format: "digital",
    },
    {
      id: "fujifilm-eterna",
      name: "Fujifilm GFX ETERNA",
      imageCircle: "both",
      format: "digital",
    },
    {
      id: "fujifilm-gfx",
      name: "Fujifilm GFX",
      imageCircle: "full-frame",
      format: "digital",
    },
  ];

  const filmFormats = [
    {
      id: "super-16mm",
      name: "Super 16mm (12.52×7.41mm)",
      negativeWidth: 12.52,
      negativeHeight: 7.41,
      squeeze: 2.0,
      projectedAspectRatio: 2.39,
    },
    {
      id: "super-35-4perf",
      name: "Super 35mm 4-perf (24.89×18.66mm)",
      negativeWidth: 24.89,
      negativeHeight: 18.66,
      squeeze: 2.0,
      projectedAspectRatio: 2.39,
    },
    {
      id: "65mm",
      name: "65mm (52.63×23.01mm)",
      negativeWidth: 52.63,
      negativeHeight: 23.01,
      squeeze: 1.25,
      projectedAspectRatio: 2.76,
    },
  ];

  const anamorphicOptions = [
    { value: "1.3", label: "1.3x" },
    { value: "1.5", label: "1.5x" },
    { value: "1.6", label: "1.6x" },
    { value: "1.8", label: "1.8x" },
    { value: "2", label: "2.0x" },
  ];

  const filmAnamorphicOptions = [
    { value: "1.25", label: "1.25x" },
    { value: "1.3", label: "1.3x" },
    { value: "1.5", label: "1.5x" },
    { value: "2", label: "2.0x" },
  ];

  const aspectRatioOptions = [
    { value: "1.37", label: "1.37:1", divisor: "(4:3)" },
    { value: "1.78", label: "1.78:1", divisor: "(16:9)" },
    { value: "1.85", label: "1.85:1", divisor: "(US)" },
    { value: "1.9", label: "1.9:1", divisor: "(17:9)" },
    { value: "2.0", label: "2.0:1", divisor: "(2:1)" },
    { value: "2.35", label: "2.35:1", divisor: "(Vintage)" },
    { value: "2.39", label: "2.39:1", divisor: "(Modern)" },
    { value: "2.76", label: "2.76:1", divisor: "(Ultra)" },
  ];

  const sensorImageCircle = {
    "sony-venice-2-8k": "full-frame",
    "sony-venice-2-8k-17-9": "full-frame",
    "sony-venice-2-8k2-17-9": "full-frame",
    "sony-venice-2-8k1-16-9": "full-frame",
    "sony-venice-2-7k-16-9": "full-frame",
    "sony-venice-2-8k2-239": "full-frame",
    "sony-venice-2-5k8-6-5": "super-35",
    "sony-venice-2-5k8-4-3": "super-35",
    "sony-venice-2-5k8-17-9": "super-35",
    "sony-venice-2-5k4-16-9": "super-35",
    "sony-venice-2-5k5-239": "super-35",
    "sony-venice-6k-3-2": "full-frame",
    "sony-venice-6k-185": "full-frame",
    "sony-venice-6k-17-9": "full-frame",
    "sony-venice-6k-239": "full-frame",
    "sony-venice-5k7-16-9": "full-frame",
    "sony-venice-4k-6-5": "super-35",
    "sony-venice-4k-4-3": "super-35",
    "sony-venice-4k-17-9": "super-35",
    "sony-venice-4k-239": "super-35",
    "sony-venice-3k8-16-9": "super-35",
    "arri-alexa-35-4k6-og": "super-35",
    "arri-alexa-35-4k6-16-9": "super-35",
    "arri-alexa-35-4k-16-9": "super-35",
    "arri-alexa-35-4k-2-1": "super-35",
    "arri-alexa-35-3k3-6-5": "super-35",
    "arri-alexa-35-3k-1-1": "super-35",
    "arri-mini-4k-og": "super-35",
    "arri-mini-4k-16-9": "super-35",
    "arri-mini-4k-239": "super-35",
    "arri-mini-s16-2k-og": "super-16",
    "arri-mini-s16-2k-16-9": "super-16",
    "arri-mini-s16-2k-239": "super-16",
    "arri-mini-lf-4k5-og-3-2": "full-frame",
    "arri-mini-lf-4k5-239": "full-frame",
    "arri-mini-lf-4k3-16-9-a": "full-frame",
    "arri-mini-lf-4k3-16-9-b": "full-frame",
    "arri-mini-lf-3k8-16-9-a": "full-frame",
    "arri-mini-lf-3k8-16-9-b": "full-frame",
    "arri-mini-lf-2k88-16-9": "full-frame",
    "arri-mini-lf-2k2-16-9-a": "full-frame",
    "arri-mini-lf-2k2-16-9-b": "full-frame",
    "arri-mini-lf-2k2-16-9-c": "full-frame",
    "arri-mini-lf-2k-16-9-a": "full-frame",
    "arri-mini-lf-2k-16-9-b": "full-frame",
    "arri-mini-lf-2k-16-9-c": "full-frame",
    "arri-mini-lf-s35-3k4-3-2": "super-35",
    "arri-mini-lf-s35-3k2-16-9": "super-35",
    "arri-mini-lf-s35-3k2-4-3": "super-35",
    "arri-mini-lf-s35-2k8-16-9": "super-35",
  };

  const sensorsByCamera = {
    "sony-venice-2": {
      "sony-venice-2-8k": {
        name: "Sony Venice 2 - 8.6K 3:2 (8640x5760)",
        width: 35.9,
        height: 24.0,
        pixels: "8640 x 5760",
        aspectRatio: "3:2",
      },
      "sony-venice-2-8k-17-9": {
        name: "Sony Venice 2 - 8.6K 17:9 (8640x4556)",
        width: 35.9,
        height: 19.0,
        pixels: "8640 x 4556",
        aspectRatio: "17:9",
      },
      "sony-venice-2-8k2-17-9": {
        name: "Sony Venice 2 - 8.2K 17:9 (8192x4320)",
        width: 34.1,
        height: 18.0,
        pixels: "8192 x 4320",
        aspectRatio: "17:9",
      },
      "sony-venice-2-8k1-16-9": {
        name: "Sony Venice 2 - 8.1K 16:9 (8100x4556)",
        width: 33.7,
        height: 19.0,
        pixels: "8100 x 4556",
        aspectRatio: "16:9",
      },
      "sony-venice-2-7k-16-9": {
        name: "Sony Venice 2 - 7.6K 16:9 (7680x4320)",
        width: 31.9,
        height: 18.0,
        pixels: "7680 x 4320",
        aspectRatio: "16:9",
      },
      "sony-venice-2-8k2-239": {
        name: "Sony Venice 2 - 8.2K 2.39:1 (8192x3432)",
        width: 34.1,
        height: 14.3,
        pixels: "8192 x 3432",
        aspectRatio: "2.39:1",
      },
      "sony-venice-2-5k8-6-5": {
        name: "Sony Venice 2 - 5.8K 6:5 (5792x4854)",
        width: 24.1,
        height: 20.2,
        pixels: "5792 x 4854",
        aspectRatio: "6:5",
      },
      "sony-venice-2-5k8-4-3": {
        name: "Sony Venice 2 - 5.8K 4:3 (5792x4276)",
        width: 24.1,
        height: 17.8,
        pixels: "5792 x 4276",
        aspectRatio: "4:3",
      },
      "sony-venice-2-5k8-17-9": {
        name: "Sony Venice 2 - 5.8K 17:9 (5792x3056)",
        width: 24.1,
        height: 12.7,
        pixels: "5792 x 3056",
        aspectRatio: "17:9",
      },
      "sony-venice-2-5k4-16-9": {
        name: "Sony Venice 2 - 5.4K 16:9 (5434x3056)",
        width: 22.6,
        height: 12.7,
        pixels: "5434 x 3056",
        aspectRatio: "16:9",
      },
      "sony-venice-2-5k5-239": {
        name: "Sony Venice 2 - 5.5K 2.39:1 (5480x2296)",
        width: 22.8,
        height: 9.6,
        pixels: "5480 x 2296",
        aspectRatio: "2.39:1",
      },
    },
    "sony-venice": {
      "sony-venice-6k-3-2": {
        name: "Sony Venice - 6K 3:2 (6048x4032)",
        width: 35.9,
        height: 24.0,
        pixels: "6048 x 4032",
        aspectRatio: "3:2",
      },
      "sony-venice-6k-185": {
        name: "Sony Venice - 6K 1.85:1 (6054x3272)",
        width: 36.0,
        height: 19.4,
        pixels: "6054 x 3272",
        aspectRatio: "1.85:1",
      },
      "sony-venice-6k-17-9": {
        name: "Sony Venice - 6K 17:9 (6054x3192)",
        width: 36.0,
        height: 19.0,
        pixels: "6054 x 3192",
        aspectRatio: "17:9",
      },
      "sony-venice-6k-239": {
        name: "Sony Venice - 6K 2.39:1 (6048x2534)",
        width: 35.9,
        height: 15.0,
        pixels: "6048 x 2534",
        aspectRatio: "2.39:1",
      },
      "sony-venice-5k7-16-9": {
        name: "Sony Venice - 5.7K 16:9 (5674x3192)",
        width: 33.7,
        height: 19.0,
        pixels: "5674 x 3192",
        aspectRatio: "16:9",
      },
      "sony-venice-4k-6-5": {
        name: "Sony Venice - 4K 6:5 (4096x3432)",
        width: 24.3,
        height: 20.4,
        pixels: "4096 x 3432",
        aspectRatio: "6:5",
      },
      "sony-venice-4k-4-3": {
        name: "Sony Venice - 4K 4:3 (4096x3024)",
        width: 24.3,
        height: 18.0,
        pixels: "4096 x 3024",
        aspectRatio: "4:3",
      },
      "sony-venice-4k-17-9": {
        name: "Sony Venice - 4K 17:9 (4096x2160)",
        width: 24.3,
        height: 12.8,
        pixels: "4096 x 2160",
        aspectRatio: "17:9",
      },
      "sony-venice-4k-239": {
        name: "Sony Venice - 4K 2.39:1 (4096x1716)",
        width: 24.3,
        height: 10.3,
        pixels: "4096 x 1716",
        aspectRatio: "2.39:1",
      },
      "sony-venice-3k8-16-9": {
        name: "Sony Venice - 3.8K 16:9 (3840x2160)",
        width: 22.8,
        height: 12.8,
        pixels: "3840 x 2160",
        aspectRatio: "16:9",
      },
    },
    "sony-burano": {
      "sony-burano-8k6-16-9": {
        name: "Sony Burano - 8.6K 16:9 (8632×4856)",
        width: 35.9,
        height: 20.2,
        pixels: "8632 x 4856",
        aspectRatio: "16:9",
      },
      "sony-burano-8k6-17-9-a": {
        name: "Sony Burano - 8.6K 17:9 (8632×4552)",
        width: 35.9,
        height: 18.9,
        pixels: "8632 x 4552",
        aspectRatio: "17:9",
      },
      "sony-burano-8k6-17-9-b": {
        name: "Sony Burano - 8.6K 17:9 (8192×4320)",
        width: 35.9,
        height: 18.9,
        pixels: "8192 x 4320",
        aspectRatio: "17:9",
      },
      "sony-burano-8k-16-9": {
        name: "Sony Burano - 8.6K 16:9 (7680×4320)",
        width: 35.9,
        height: 20.2,
        pixels: "7680 x 4320",
        aspectRatio: "16:9",
      },
      "sony-burano-6k-17-9-a": {
        name: "Sony Burano - 6K 17:9 (6052×3192)",
        width: 33.6,
        height: 17.7,
        pixels: "6052 x 3192",
        aspectRatio: "17:9",
      },
      "sony-burano-6k-16-9": {
        name: "Sony Burano - 6K 16:9 (6052×3404)",
        width: 33.6,
        height: 18.9,
        pixels: "6052 x 3404",
        aspectRatio: "16:9",
      },
      "sony-burano-6k-17-9-dci": {
        name: "Sony Burano - 6K 17:9 DCI (4096×2160)",
        width: 33.57,
        height: 17.7,
        pixels: "4096 x 2160",
        aspectRatio: "17:9",
      },
      "sony-burano-6k-16-9-dci": {
        name: "Sony Burano - 6K 16:9 DCI (3840×2160)",
        width: 33.6,
        height: 18.9,
        pixels: "3840 x 2160",
        aspectRatio: "16:9",
      },
      "sony-burano-6k-16-9-hd": {
        name: "Sony Burano - 6K 16:9 HD (1920×1080)",
        width: 33.6,
        height: 18.9,
        pixels: "1920 x 1080",
        aspectRatio: "16:9",
      },
      "sony-burano-s35-5k8-17-9": {
        name: "Sony Burano - 5.8K 17:9 Super 35 (5760×3036)",
        width: 24.0,
        height: 12.6,
        pixels: "5760 x 3036",
        aspectRatio: "17:9",
      },
      "sony-burano-s35-5k8-16-9": {
        name: "Sony Burano - 5.8K 16:9 Super 35 (5760×3240)",
        width: 24.0,
        height: 13.5,
        pixels: "5760 x 3240",
        aspectRatio: "16:9",
      },
      "sony-burano-s35-4k-17-9": {
        name: "Sony Burano - 4K 17:9 Super 35 (4096×2160)",
        width: 24.0,
        height: 12.6,
        pixels: "4096 x 2160",
        aspectRatio: "17:9",
      },
      "sony-burano-s35-4k-16-9": {
        name: "Sony Burano - 4K 16:9 Super 35 (3840×2160)",
        width: 24.0,
        height: 13.5,
        pixels: "3840 x 2160",
        aspectRatio: "16:9",
      },
      "sony-burano-s35-4k-16-9-hd": {
        name: "Sony Burano - 4K 16:9 Super 35 HD (1920×1080)",
        width: 24.0,
        height: 13.5,
        pixels: "1920 x 1080",
        aspectRatio: "16:9",
      },
      "sony-burano-s35c-4k-17-9": {
        name: "Sony Burano - 4K 17:9 Super 35c (4096×2160)",
        width: 17.0,
        height: 9.0,
        pixels: "4096 x 2160",
        aspectRatio: "17:9",
      },
    },
    "sony-fx6": {
      "sony-fx6-4k-dci": {
        name: "Sony FX6 - 4K DCI (4096x2160)",
        width: 35.84,
        height: 19.0,
        pixels: "4096 x 2160",
        aspectRatio: "17:9",
      },
      "sony-fx6-4k-uhd": {
        name: "Sony FX6 - 4K UHD (3840x2160)",
        width: 35.84,
        height: 20.16,
        pixels: "3840 x 2160",
        aspectRatio: "16:9",
      },
      "sony-fx6-hd": {
        name: "Sony FX6 - HD (1920x1080)",
        width: 35.84,
        height: 20.16,
        pixels: "1920 x 1080",
        aspectRatio: "16:9",
      },
    },
    "sony-fx3": {
      "sony-fx3-4k-dci": {
        name: "Sony FX3 - 4K DCI (4096x2160)",
        width: 35.6,
        height: 18.9,
        pixels: "4096 x 2160",
        aspectRatio: "17:9",
      },
      "sony-fx3-4k-uhd": {
        name: "Sony FX3 - 4K UHD (3840x2160)",
        width: 35.6,
        height: 20.0,
        pixels: "3840 x 2160",
        aspectRatio: "16:9",
      },
      "sony-fx3-hd": {
        name: "Sony FX3 - HD (1920x1080)",
        width: 35.6,
        height: 20.0,
        pixels: "1920 x 1080",
        aspectRatio: "16:9",
      },
    },
    "sony-fx9": {
      "sony-fx9-4k-dci": {
        name: "Sony FX9 - 4K DCI (4096x2160)",
        width: 35.84,
        height: 19.0,
        pixels: "4096 x 2160",
        aspectRatio: "17:9",
      },
      "sony-fx9-4k-uhd": {
        name: "Sony FX9 - 4K UHD (3840x2160)",
        width: 35.84,
        height: 20.16,
        pixels: "3840 x 2160",
        aspectRatio: "16:9",
      },
      "sony-fx9-hd": {
        name: "Sony FX9 - HD (1920x1080)",
        width: 35.84,
        height: 20.16,
        pixels: "1920 x 1080",
        aspectRatio: "16:9",
      },
    },
    "arri-alexa-35": {
      "arri-alexa-35-4k6-og": {
        name: "ARRI Alexa 35 - 4.6K 3:2 (4608x3164)",
        width: 27.99,
        height: 19.22,
        pixels: "4608 x 3164",
        aspectRatio: "3:2",
      },
      "arri-alexa-35-4k6-16-9": {
        name: "ARRI Alexa 35 - 4.6K 16:9 (4608x2592)",
        width: 27.99,
        height: 19.22,
        pixels: "4608 x 2592",
        aspectRatio: "16:9",
      },
      "arri-alexa-35-4k-16-9": {
        name: "ARRI Alexa 35 - 4K 16:9 (4096x2304)",
        width: 27.99,
        height: 19.22,
        pixels: "4096 x 2304",
        aspectRatio: "16:9",
      },
      "arri-alexa-35-4k-2-1": {
        name: "ARRI Alexa 35 - 4K 2:1 (4096x2048)",
        width: 27.99,
        height: 19.22,
        pixels: "4096 x 2048",
        aspectRatio: "2:1",
      },
      "arri-alexa-35-3k3-6-5": {
        name: "ARRI Alexa 35 - 3.3K 6:5 (3408x2856)",
        width: 27.99,
        height: 19.22,
        pixels: "3408 x 2856",
        aspectRatio: "6:5",
      },
      "arri-alexa-35-3k-1-1": {
        name: "ARRI Alexa 35 - 3K 1:1 (3024x3024)",
        width: 27.99,
        height: 19.22,
        pixels: "3024 x 3024",
        aspectRatio: "1:1",
      },
    },
    "arri-alexa-mini": {
      "arri-mini-4k-og": {
        name: "ARRI Alexa Mini - 4K 3:2 (3840x2560)",
        width: 23.76,
        height: 15.84,
        pixels: "3840 x 2560",
        aspectRatio: "3:2",
      },
      "arri-mini-4k-16-9": {
        name: "ARRI Alexa Mini - 4K 16:9 (3840x2160)",
        width: 23.76,
        height: 15.84,
        pixels: "3840 x 2160",
        aspectRatio: "16:9",
      },
      "arri-mini-4k-239": {
        name: "ARRI Alexa Mini - 4K 2.39:1 (3840x1608)",
        width: 23.76,
        height: 9.96,
        pixels: "3840 x 1608",
        aspectRatio: "2.39:1",
      },
      "arri-mini-s16-2k-og": {
        name: "ARRI Alexa Mini - Super 16 2K 3:2 (1920x1280)",
        width: 11.88,
        height: 7.92,
        pixels: "1920 x 1280",
        aspectRatio: "3:2",
      },
      "arri-mini-s16-2k-16-9": {
        name: "ARRI Alexa Mini - Super 16 2K 16:9 (1920x1080)",
        width: 11.88,
        height: 7.92,
        pixels: "1920 x 1080",
        aspectRatio: "16:9",
      },
      "arri-mini-s16-2k-239": {
        name: "ARRI Alexa Mini - Super 16 2K 2.39:1 (1920x804)",
        width: 11.88,
        height: 4.98,
        pixels: "1920 x 804",
        aspectRatio: "2.39:1",
      },
    },
    "arri-alexa-mini-lf": {
      "arri-mini-lf-4k5-og-3-2": {
        name: "ARRI Alexa Mini LF - 4.5K LF 3:2 Open Gate (4448x3096)",
        width: 36.7,
        height: 25.54,
        pixels: "4448 x 3096",
        aspectRatio: "3:2",
      },
      "arri-mini-lf-4k5-239": {
        name: "ARRI Alexa Mini LF - 4.5K LF 2.39:1 (4448x1856)",
        width: 36.7,
        height: 15.38,
        pixels: "4448 x 1856",
        aspectRatio: "2.39:1",
      },
      "arri-mini-lf-4k3-16-9-a": {
        name: "ARRI Alexa Mini LF - 4.3K LF 16:9 4K (3840x2160)",
        width: 31.87,
        height: 17.91,
        pixels: "3840 x 2160",
        aspectRatio: "16:9",
      },
      "arri-mini-lf-4k3-16-9-b": {
        name: "ARRI Alexa Mini LF - 4.3K LF 16:9 HD (1920x1080)",
        width: 31.87,
        height: 17.91,
        pixels: "1920 x 1080",
        aspectRatio: "16:9",
      },
      "arri-mini-lf-3k8-16-9-a": {
        name: "ARRI Alexa Mini LF - 3.8K LF 16:9 4K (3840x2160)",
        width: 31.87,
        height: 17.91,
        pixels: "3840 x 2160",
        aspectRatio: "16:9",
      },
      "arri-mini-lf-3k8-16-9-b": {
        name: "ARRI Alexa Mini LF - 3.8K LF 16:9 HD (1920x1080)",
        width: 31.87,
        height: 17.91,
        pixels: "1920 x 1080",
        aspectRatio: "16:9",
      },
      "arri-mini-lf-2k88-16-9": {
        name: "ARRI Alexa Mini LF - 2.8K LF 16:9 (2880x1620)",
        width: 31.87,
        height: 17.91,
        pixels: "2880 x 1620",
        aspectRatio: "16:9",
      },
      "arri-mini-lf-2k2-16-9-a": {
        name: "ARRI Alexa Mini LF - 2.2K LF 16:9 A (2048x1152)",
        width: 31.87,
        height: 17.91,
        pixels: "2048 x 1152",
        aspectRatio: "16:9",
      },
      "arri-mini-lf-2k2-16-9-b": {
        name: "ARRI Alexa Mini LF - 2.2K LF 16:9 B (2048x1152)",
        width: 31.87,
        height: 17.91,
        pixels: "2048 x 1152",
        aspectRatio: "16:9",
      },
      "arri-mini-lf-2k2-16-9-c": {
        name: "ARRI Alexa Mini LF - 2.2K LF 16:9 C (2048x1152)",
        width: 31.87,
        height: 17.91,
        pixels: "2048 x 1152",
        aspectRatio: "16:9",
      },
      "arri-mini-lf-2k-16-9-a": {
        name: "ARRI Alexa Mini LF - 2K LF 16:9 A (1920x1080)",
        width: 31.87,
        height: 17.91,
        pixels: "1920 x 1080",
        aspectRatio: "16:9",
      },
      "arri-mini-lf-2k-16-9-b": {
        name: "ARRI Alexa Mini LF - 2K LF 16:9 B (1920x1080)",
        width: 31.87,
        height: 17.91,
        pixels: "1920 x 1080",
        aspectRatio: "16:9",
      },
      "arri-mini-lf-2k-16-9-c": {
        name: "ARRI Alexa Mini LF - 2K LF 16:9 C (1920x1080)",
        width: 31.87,
        height: 17.91,
        pixels: "1920 x 1080",
        aspectRatio: "16:9",
      },
      "arri-mini-lf-s35-3k4-3-2": {
        name: "ARRI Alexa Mini LF - 3.4K S35 3:2 (3424x2202)",
        width: 24.0,
        height: 16.0,
        pixels: "3424 x 2202",
        aspectRatio: "3:2",
      },
      "arri-mini-lf-s35-3k2-16-9": {
        name: "ARRI Alexa Mini LF - 3.2K S35 16:9 (3200x1800)",
        width: 24.0,
        height: 13.5,
        pixels: "3200 x 1800",
        aspectRatio: "16:9",
      },
      "arri-mini-lf-s35-3k2-4-3": {
        name: "ARRI Alexa Mini LF - 3.2K S35 4:3 (2880x2160)",
        width: 24.0,
        height: 18.0,
        pixels: "2880 x 2160",
        aspectRatio: "4:3",
      },
      "arri-mini-lf-s35-2k8-16-9": {
        name: "ARRI Alexa Mini LF - 2.8K S35 16:9 (2880x1620)",
        width: 24.0,
        height: 13.5,
        pixels: "2880 x 1620",
        aspectRatio: "16:9",
      },
    },
    "red-komodo-x": {
      "red-komodo-6k-3-2": {
        name: "RED Komodo-X - 6K 3:2 (6144x4096)",
        width: 25.4,
        height: 16.9,
        pixels: "6144 x 4096",
        aspectRatio: "3:2",
      },
      "red-komodo-6k-16-9": {
        name: "RED Komodo-X - 6K 16:9 (6144x3456)",
        width: 25.4,
        height: 14.3,
        pixels: "6144 x 3456",
        aspectRatio: "16:9",
      },
      "red-komodo-6k-239": {
        name: "RED Komodo-X - 6K 2.39:1 (6144x2572)",
        width: 25.4,
        height: 10.7,
        pixels: "6144 x 2572",
        aspectRatio: "2.39:1",
      },
      "red-komodo-s35-4k-3-2": {
        name: "RED Komodo-X - 4K 3:2 Super 35 (4096x2731)",
        width: 24.0,
        height: 16.0,
        pixels: "4096 x 2731",
        aspectRatio: "3:2",
      },
      "red-komodo-s35-4k-16-9": {
        name: "RED Komodo-X - 4K 16:9 Super 35 (4096x2304)",
        width: 24.0,
        height: 13.5,
        pixels: "4096 x 2304",
        aspectRatio: "16:9",
      },
      "red-komodo-s35-4k-239": {
        name: "RED Komodo-X - 4K 2.39:1 Super 35 (4096x1716)",
        width: 24.0,
        height: 9.0,
        pixels: "4096 x 1716",
        aspectRatio: "2.39:1",
      },
    },
    "red-gemini": {
      "red-gemini-5k-3-2": {
        name: "RED Gemini 5K - 5K 3:2 (5120x3413)",
        width: 26.8,
        height: 17.9,
        pixels: "5120 x 3413",
        aspectRatio: "3:2",
      },
      "red-gemini-5k-16-9": {
        name: "RED Gemini 5K - 5K 16:9 (5120x2880)",
        width: 26.8,
        height: 15.1,
        pixels: "5120 x 2880",
        aspectRatio: "16:9",
      },
      "red-gemini-5k-239": {
        name: "RED Gemini 5K - 5K 2.39:1 (5120x2143)",
        width: 26.8,
        height: 11.3,
        pixels: "5120 x 2143",
        aspectRatio: "2.39:1",
      },
      "red-gemini-4k-3-2": {
        name: "RED Gemini 5K - 4K 3:2 (4096x2731)",
        width: 24.0,
        height: 16.0,
        pixels: "4096 x 2731",
        aspectRatio: "3:2",
      },
      "red-gemini-4k-16-9": {
        name: "RED Gemini 5K - 4K 16:9 (4096x2304)",
        width: 24.0,
        height: 13.5,
        pixels: "4096 x 2304",
        aspectRatio: "16:9",
      },
      "red-gemini-4k-239": {
        name: "RED Gemini 5K - 4K 2.39:1 (4096x1716)",
        width: 24.0,
        height: 9.0,
        pixels: "4096 x 1716",
        aspectRatio: "2.39:1",
      },
    },
    "red-monstro": {
      "red-monstro-8k-3-2": {
        name: "RED Monstro 8K - 8K 3:2 (8192x5464)",
        width: 32.0,
        height: 21.3,
        pixels: "8192 x 5464",
        aspectRatio: "3:2",
      },
      "red-monstro-8k-16-9": {
        name: "RED Monstro 8K - 8K 16:9 (8192x4608)",
        width: 32.0,
        height: 18.0,
        pixels: "8192 x 4608",
        aspectRatio: "16:9",
      },
      "red-monstro-8k-239": {
        name: "RED Monstro 8K - 8K 2.39:1 (8192x3431)",
        width: 32.0,
        height: 13.5,
        pixels: "8192 x 3431",
        aspectRatio: "2.39:1",
      },
      "red-monstro-6k-3-2": {
        name: "RED Monstro 8K - 6K 3:2 (6144x4096)",
        width: 25.4,
        height: 16.9,
        pixels: "6144 x 4096",
        aspectRatio: "3:2",
      },
      "red-monstro-6k-16-9": {
        name: "RED Monstro 8K - 6K 16:9 (6144x3456)",
        width: 25.4,
        height: 14.3,
        pixels: "6144 x 3456",
        aspectRatio: "16:9",
      },
      "red-monstro-6k-239": {
        name: "RED Monstro 8K - 6K 2.39:1 (6144x2572)",
        width: 25.4,
        height: 10.7,
        pixels: "6144 x 2572",
        aspectRatio: "2.39:1",
      },
    },
    "fujifilm-eterna": {
      "fujifilm-eterna-gf-4k-og": {
        name: "Fujifilm GFX ETERNA - GF 4K Open Gate (3840x2880)",
        width: 43.6,
        height: 32.7,
        pixels: "3840 x 2880",
        aspectRatio: "4:3",
      },
      "fujifilm-eterna-gf-4k-dci": {
        name: "Fujifilm GFX ETERNA - GF 4K DCI (4096x2160)",
        width: 43.6,
        height: 23.0,
        pixels: "4096 x 2160",
        aspectRatio: "17:9",
      },
      "fujifilm-eterna-premista-4k-dci": {
        name: "Fujifilm GFX ETERNA - Premista 4K DCI (4096x2160)",
        width: 40.3,
        height: 21.2,
        pixels: "4096 x 2160",
        aspectRatio: "17:9",
      },
      "fujifilm-eterna-35mm-4k-dci": {
        name: "Fujifilm GFX ETERNA - 35mm DCI 4K (4096x2160)",
        width: 35.9,
        height: 23.9,
        pixels: "4096 x 2160",
        aspectRatio: "17:9",
      },
      "fujifilm-eterna-8k-dci": {
        name: "Fujifilm GFX ETERNA - 8K DCI (8129x4320)",
        width: 30.8,
        height: 16.2,
        pixels: "8129 x 4320",
        aspectRatio: "17:9",
      },
      "fujifilm-eterna-s35-4k-dci": {
        name: "Fujifilm GFX ETERNA - Super 35 4K DCI (4096x2160)",
        width: 24.0,
        height: 12.7,
        pixels: "4096 x 2160",
        aspectRatio: "17:9",
      },
    },
    "fujifilm-gfx": {
      "fujifilm-gfx-8k-og": {
        name: "Fujifilm GFX - 8K Open Gate (7680x5760)",
        width: 43.6,
        height: 32.7,
        pixels: "7680 x 5760",
        aspectRatio: "4:3",
      },
      "fujifilm-gfx-6k-16-9": {
        name: "Fujifilm GFX - 6.3K 16:9 (6144x3456)",
        width: 43.6,
        height: 24.5,
        pixels: "6144 x 3456",
        aspectRatio: "16:9",
      },
      "fujifilm-gfx-5k8-239": {
        name: "Fujifilm GFX - 5.8K 2.39:1 (5824x2438)",
        width: 43.6,
        height: 18.3,
        pixels: "5824 x 2438",
        aspectRatio: "2.39:1",
      },
      "fujifilm-gfx-4k-4-3": {
        name: "Fujifilm GFX - 4K 4:3 (4096x3072)",
        width: 43.6,
        height: 32.7,
        pixels: "4096 x 3072",
        aspectRatio: "4:3",
      },
    },
  };

  // ============================================
  // CALCULATION FUNCTIONS
  // ============================================

  // DIGITAL CALCULATIONS
  const calculateDigital = useMemo(() => {
    if (
      !selectedCamera ||
      !sensorFormat ||
      (!anamorphicRatio && !useCustomAnamorphic) ||
      (!desiredAspectRatio && !useCustomAspectRatio)
    ) {
      return null;
    }

    const sensor = sensorsByCamera[selectedCamera]?.[sensorFormat];
    if (!sensor) return null;

    const squeeze =
      parseFloat(
        useCustomAnamorphic ? customAnamorphicRatio : anamorphicRatio
      ) || 1;
    const desiredAR =
      parseFloat(
        useCustomAspectRatio ? customOutputAspectRatio : desiredAspectRatio
      ) || 2.39;

    let pixelWidth, pixelHeight;
    if (useCustomPixels) {
      pixelWidth = parseFloat(customPixelWidth) || 0;
      pixelHeight = parseFloat(customPixelHeight) || 0;
    } else {
      const pixelParts = sensor.pixels.split(" x ");
      pixelWidth = parseFloat(pixelParts[0]);
      pixelHeight = parseFloat(pixelParts[1]);
    }

    const sensorWidth = sensor.width;
    const sensorHeight = sensor.height;
    const usedPixelWidth = pixelWidth;
    const usedPixelHeight = pixelHeight;
    const desqueezedHeight = Math.round(usedPixelHeight / squeeze);
    const desqueezedAspectRatio = (sensorWidth * squeeze) / sensorHeight;

    const desqueezedAR = usedPixelWidth / desqueezedHeight;

    let desqueezedCroppedHeight = desqueezedHeight;
    let desqueezedCroppedWidth = usedPixelWidth;
    let cropPixelsNeeded = 0;
    let cropPercentage = 0;

    if (desiredAR > desqueezedAR) {
      // Desired is wider than desqueezed - crop height (top/bottom)
      desqueezedCroppedHeight = Math.round(usedPixelWidth / desiredAR);
      cropPixelsNeeded = desqueezedHeight - desqueezedCroppedHeight;
      cropPercentage = (cropPixelsNeeded / desqueezedHeight) * 100;
    } else if (desiredAR < desqueezedAR) {
      // Desired is taller than desqueezed - crop width (left/right)
      desqueezedCroppedWidth = Math.round(desqueezedHeight * desiredAR);
      cropPixelsNeeded = usedPixelWidth - desqueezedCroppedWidth;
      cropPercentage = (cropPixelsNeeded / usedPixelWidth) * 100;
    }

    const coverage = 100 - cropPercentage;

    // For crop boxes display
    // croppedPixelHeight = desqueezed cropped height (divide by desqueezedHeight in visualizer)
    // croppedPixelWidth = squeezed cropped width (divide by usedPixelWidth in visualizer)
    let croppedPixelHeight = desqueezedHeight;
    let croppedPixelWidth = usedPixelWidth;

    if (desiredAR > desqueezedAR) {
      // Cropping height (desired is wider) - set desqueezed cropped height
      croppedPixelHeight = desqueezedCroppedHeight;
    } else if (desiredAR < desqueezedAR) {
      // Cropping width (desired is taller) - set squeezed cropped width
      croppedPixelWidth = desqueezedCroppedWidth;
    }

    return {
      pixelWidth: Math.round(pixelWidth),
      pixelHeight: Math.round(pixelHeight),
      usedPixelWidth: Math.round(usedPixelWidth),
      usedPixelHeight: Math.round(usedPixelHeight),
      desqueezedHeight: Math.round(usedPixelHeight / squeeze),
      desqueezedCroppedHeight: desqueezedCroppedHeight,
      desqueezedCroppedWidth: desqueezedCroppedWidth,
      croppedPixelWidth: croppedPixelWidth,
      croppedPixelHeight: croppedPixelHeight,
      cropPixelsNeeded: Math.round(cropPixelsNeeded),
      naturalAspectRatio: desqueezedAspectRatio.toFixed(2),
      coverage: coverage.toFixed(1),
      cropPercentage: cropPercentage.toFixed(1),
      anamorphic: squeeze,
      aspectRatio: desiredAR,
    };
  }, [
    selectedCamera,
    sensorFormat,
    anamorphicRatio,
    desiredAspectRatio,
    useCustomPixels,
    customPixelWidth,
    customPixelHeight,
    useCustomAnamorphic,
    customAnamorphicRatio,
    useCustomAspectRatio,
    customOutputAspectRatio,
  ]);

  // FILM CALCULATIONS
  const calculateFilm = useMemo(() => {
    if (
      !selectedFilmFormat ||
      (!filmAnamorphicRatio && !useCustomFilmAnamorphic) ||
      (!filmDesiredAspectRatio && !useCustomFilmAspectRatio)
    ) {
      return null;
    }

    const filmFormat = filmFormats.find((f) => f.id === selectedFilmFormat);
    if (!filmFormat) return null;

    const squeeze = useCustomFilmAnamorphic
      ? parseFloat(customFilmAnamorphic)
      : parseFloat(filmAnamorphicRatio);
    const desiredAspect = useCustomFilmAspectRatio
      ? parseFloat(customFilmAspectRatio)
      : parseFloat(filmDesiredAspectRatio);

    // Negative dimensions in mm
    const negativeWidth = filmFormat.negativeWidth;
    const negativeHeight = filmFormat.negativeHeight;
    const negativeArea = negativeWidth * negativeHeight;

    // Native negative aspect ratio (squeezed on negative)
    const negativeAspect = negativeWidth / negativeHeight;

    // When unsqueezed by the anamorphic lens/projector
    const unSqueezeWidth = negativeWidth * squeeze;
    const unSqueezeAspect = unSqueezeWidth / negativeHeight;

    // How much of the unsqueezed image do we actually use for desired output?
    // Two cases: crop horizontally (unsqueezed too wide) or vertical pillar-box (unsqueezed too narrow)
    let cropPercentageOfUnsqueezed;
    let usedWidth;
    let usedHeight;
    let isInsufficient = false;

    if (unSqueezeAspect >= desiredAspect) {
      // Unsqueezed is wider than desired - crop horizontally (left/right)
      usedHeight = negativeHeight;
      usedWidth = desiredAspect * usedHeight;
      cropPercentageOfUnsqueezed = (usedWidth / unSqueezeWidth) * 100;
    } else {
      // Unsqueezed is NARROWER than desired - INSUFFICIENT IMAGE!
      // This is a problem - you can't get the desired aspect without pillar-boxing
      isInsufficient = true;
      usedWidth = unSqueezeWidth;
      usedHeight = usedWidth / desiredAspect;
      cropPercentageOfUnsqueezed = (usedHeight / negativeHeight) * 100;
    }

    return {
      negativeWidth,
      negativeHeight,
      negativeArea,
      negativeAspect: parseFloat(negativeAspect.toFixed(3)),
      squeeze,
      unSqueezeWidth: parseFloat(unSqueezeWidth.toFixed(2)),
      unSqueezeAspect: parseFloat(unSqueezeAspect.toFixed(3)),
      desiredAspect,
      usedWidth: parseFloat(usedWidth.toFixed(2)),
      cropPercentageOfUnsqueezed: parseFloat(
        cropPercentageOfUnsqueezed.toFixed(1)
      ),
      isInsufficient,
      formatName: filmFormat.name,
      projectedAspectRatio: filmFormat.projectedAspectRatio,
    };
  }, [
    selectedFilmFormat,
    filmAnamorphicRatio,
    filmDesiredAspectRatio,
    useCustomFilmAnamorphic,
    customFilmAnamorphic,
    useCustomFilmAspectRatio,
    customFilmAspectRatio,
    filmFormats,
  ]);

  // COMPARISON CALCULATIONS - DIGITAL
  const calculateComparisonDigital = (compState, index) => {
    // Use comparison state if set, otherwise fall back to main state
    const compCamera = compState?.camera || selectedCamera;
    const compSensorFormat = compState?.sensorFormat || sensorFormat;
    const compAnamorphicRatio =
      compState?.anamorphicRatio ||
      anamorphicRatio ||
      (useCustomAnamorphic ? customAnamorphicRatio : null);
    const compDesiredAspectRatio =
      compState?.desiredAspectRatio ||
      desiredAspectRatio ||
      (useCustomAspectRatio ? customOutputAspectRatio : null);
    const compUseCustomPixels =
      compState?.useCustomPixels !== undefined
        ? compState.useCustomPixels
        : useCustomPixels;
    const compCustomPixelWidth =
      compState?.customPixelWidth || customPixelWidth;
    const compCustomPixelHeight =
      compState?.customPixelHeight || customPixelHeight;
    const compUseCustomAnamorphic =
      compState?.useCustomAnamorphic !== undefined
        ? compState.useCustomAnamorphic
        : useCustomAnamorphic;
    const compCustomAnamorphicRatio =
      compState?.customAnamorphicRatio || customAnamorphicRatio;
    const compUseCustomAspectRatio =
      compState?.useCustomAspectRatio !== undefined
        ? compState.useCustomAspectRatio
        : useCustomAspectRatio;
    const compCustomOutputAspectRatio =
      compState?.customOutputAspectRatio || customOutputAspectRatio;

    if (
      !compCamera ||
      !compSensorFormat ||
      (!compAnamorphicRatio && !compUseCustomAnamorphic) ||
      (!compDesiredAspectRatio && !compUseCustomAspectRatio)
    ) {
      return null;
    }

    const sensor = sensorsByCamera[compCamera]?.[compSensorFormat];
    if (!sensor) return null;

    const squeeze =
      parseFloat(
        compUseCustomAnamorphic
          ? compCustomAnamorphicRatio
          : compAnamorphicRatio
      ) || 1;
    const desiredAR =
      parseFloat(
        compUseCustomAspectRatio
          ? compCustomOutputAspectRatio
          : compDesiredAspectRatio
      ) || 2.39;

    let pixelWidth, pixelHeight;
    if (compUseCustomPixels) {
      pixelWidth = parseFloat(compCustomPixelWidth) || 0;
      pixelHeight = parseFloat(compCustomPixelHeight) || 0;
    } else {
      const pixelParts = sensor.pixels.split(" x ");
      pixelWidth = parseFloat(pixelParts[0]);
      pixelHeight = parseFloat(pixelParts[1]);
    }

    const sensorWidth = sensor.width;
    const sensorHeight = sensor.height;
    const usedPixelWidth = pixelWidth;
    const usedPixelHeight = pixelHeight;
    const desqueezedAspectRatio = (sensorWidth * squeeze) / sensorHeight;

    let croppedPixelHeight = usedPixelHeight;
    let croppedPixelWidth = usedPixelWidth;
    let croppedPercentage = 0;

    if (desiredAR < desqueezedAspectRatio) {
      let testCroppedHeight = (usedPixelWidth * squeeze) / desiredAR;
      if (testCroppedHeight <= usedPixelHeight) {
        croppedPixelHeight = testCroppedHeight;
        croppedPercentage =
          ((usedPixelHeight - croppedPixelHeight) / usedPixelHeight) * 100;
      } else {
        croppedPixelWidth = (desiredAR * usedPixelHeight) / squeeze;
        croppedPercentage =
          ((usedPixelWidth - croppedPixelWidth) / usedPixelWidth) * 100;
      }
    } else if (desiredAR > desqueezedAspectRatio) {
      let testCroppedWidth = (desiredAR * usedPixelHeight) / squeeze;
      if (testCroppedWidth <= usedPixelWidth) {
        croppedPixelWidth = testCroppedWidth;
        croppedPercentage =
          ((usedPixelWidth - croppedPixelWidth) / usedPixelWidth) * 100;
      } else {
        croppedPixelHeight = (usedPixelWidth * squeeze) / desiredAR;
        croppedPercentage =
          ((usedPixelHeight - croppedPixelHeight) / usedPixelHeight) * 100;
      }
    }

    croppedPixelWidth = Math.min(croppedPixelWidth, usedPixelWidth);
    croppedPixelHeight = Math.min(croppedPixelHeight, usedPixelHeight);
    const coverage = 100 - croppedPercentage;

    return {
      pixelWidth: Math.round(pixelWidth),
      pixelHeight: Math.round(pixelHeight),
      usedPixelWidth: Math.round(usedPixelWidth),
      usedPixelHeight: Math.round(usedPixelHeight),
      croppedPixelWidth: Math.round(croppedPixelWidth),
      croppedPixelHeight: Math.round(croppedPixelHeight),
      naturalAspectRatio: desqueezedAspectRatio.toFixed(2),
      coverage: coverage.toFixed(1),
      cropPercentage: croppedPercentage.toFixed(1),
      anamorphic: squeeze,
      aspectRatio: desiredAR,
    };
  };

  // COMPARISON CALCULATIONS - FILM
  const calculateComparisonFilm = (compState, index) => {
    // Use comparison state if set, otherwise fall back to main state
    const compFilmFormat = compState?.filmFormat || selectedFilmFormat;
    const compFilmAnamorphicRatio =
      compState?.filmAnamorphicRatio ||
      filmAnamorphicRatio ||
      (useCustomFilmAnamorphic ? customFilmAnamorphic : null);
    const compFilmDesiredAspectRatio =
      compState?.filmDesiredAspectRatio ||
      filmDesiredAspectRatio ||
      (useCustomFilmAspectRatio ? customFilmAspectRatio : null);
    const compUseCustomFilmAnamorphic =
      compState?.useCustomFilmAnamorphic !== undefined
        ? compState.useCustomFilmAnamorphic
        : useCustomFilmAnamorphic;
    const compCustomFilmAnamorphic =
      compState?.customFilmAnamorphic || customFilmAnamorphic;
    const compUseCustomFilmAspectRatio =
      compState?.useCustomFilmAspectRatio !== undefined
        ? compState.useCustomFilmAspectRatio
        : useCustomFilmAspectRatio;
    const compCustomFilmAspectRatio =
      compState?.customFilmAspectRatio || customFilmAspectRatio;

    if (
      !compFilmFormat ||
      (!compFilmAnamorphicRatio && !compUseCustomFilmAnamorphic) ||
      (!compFilmDesiredAspectRatio && !compUseCustomFilmAspectRatio)
    ) {
      return null;
    }

    const format = filmFormats.find((f) => f.id === compFilmFormat);
    if (!format) return null;

    const squeeze =
      parseFloat(
        compUseCustomFilmAnamorphic
          ? compCustomFilmAnamorphic
          : compFilmAnamorphicRatio
      ) || 2.0;
    const desiredAspect =
      parseFloat(
        compUseCustomFilmAspectRatio
          ? compCustomFilmAspectRatio
          : compFilmDesiredAspectRatio
      ) || 2.39;

    const negativeWidth = format.negativeWidth;
    const negativeHeight = format.negativeHeight;
    const negativeArea = negativeWidth * negativeHeight;
    const negativeAspect = negativeWidth / negativeHeight;

    const unSqueezeWidth = negativeWidth * squeeze;
    const unSqueezeAspect = unSqueezeWidth / negativeHeight;

    // How much of the unsqueezed image do we actually use for desired output?
    // Two cases: crop horizontally (unsqueezed too wide) or vertically (unsqueezed too tall)
    let cropPercentageOfUnsqueezed;
    let usedWidth;
    let usedHeight;
    let isInsufficient = false;

    if (unSqueezeAspect >= desiredAspect) {
      // Unsqueezed is wider than desired - crop horizontally (left/right)
      usedHeight = negativeHeight;
      usedWidth = desiredAspect * usedHeight;
      cropPercentageOfUnsqueezed = (usedWidth / unSqueezeWidth) * 100;
    } else {
      // Unsqueezed is taller than desired - crop vertically (top/bottom)
      usedWidth = unSqueezeWidth;
      usedHeight = usedWidth / desiredAspect;
      cropPercentageOfUnsqueezed = (usedHeight / negativeHeight) * 100;
    }

    return {
      negativeWidth,
      negativeHeight,
      negativeArea,
      negativeAspect: parseFloat(negativeAspect.toFixed(3)),
      squeeze,
      unSqueezeWidth: parseFloat(unSqueezeWidth.toFixed(2)),
      unSqueezeAspect: parseFloat(unSqueezeAspect.toFixed(3)),
      desiredAspect,
      cropPercentageOfUnsqueezed: parseFloat(
        cropPercentageOfUnsqueezed.toFixed(1)
      ),
      isInsufficient,
    };
  };

  // ============================================
  // UI - FILTER LOGIC
  // ============================================

  const filteredCameraList = cameraList
    .filter((camera) => {
      if (camera.format !== formatType) return false;
      if (bypassCameraSelection) return true;
      if (!lensImageCircle) return true;
      if (lensImageCircle === "super-16") {
        return camera.id === "arri-alexa-mini";
      }
      return (
        camera.imageCircle === lensImageCircle || camera.imageCircle === "both"
      );
    })
    .map((camera) => {
      if (
        (lensImageCircle === "super-35" || lensImageCircle === "super-16") &&
        camera.imageCircle === "both" &&
        camera.id !== "arri-alexa-mini"
      ) {
        return { ...camera, displayName: `${camera.name} (crop)` };
      }
      return { ...camera, displayName: camera.name };
    });

  const currentSensors =
    selectedCamera && sensorsByCamera[selectedCamera]
      ? sensorsByCamera[selectedCamera]
      : {};

  // ============================================
  // PARAMETERS PANEL COMPONENT
  // ============================================

  const ParametersPanel = ({
    state,
    setState,
    cameras = filteredCameraList,
    sensors = currentSensors,
    isComparison = false,
    formatType = "digital",
    filmFormats = [],
  }) => (
    <div className="bg-white bg-opacity-5 backdrop-blur-lg border border-white border-opacity-10 rounded-lg p-4 lg:p-8 sticky top-8">
      <h3 className="text-white text-lg font-bold mb-6 tracking-wider">
        PARAMETERS
      </h3>

      {formatType === "digital" && (
        <div className="mb-8">
          <label className="block text-slate-300 text-sm font-bold mb-3 tracking-widest">
            LENS IMAGE CIRCLE
          </label>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <button
              onClick={() =>
                setState({
                  ...state,
                  lensCircle: "super-16",
                  bypassLens: false,
                })
              }
              className={`py-3 rounded font-bold transition-all border text-sm ${
                state.lensCircle === "super-16"
                  ? "bg-slate-400 text-gray-900 border-slate-400"
                  : "bg-white bg-opacity-10 text-white border-white border-opacity-20 hover:bg-opacity-20"
              }`}
            >
              Super 16
            </button>
            <button
              onClick={() =>
                setState({
                  ...state,
                  lensCircle: "super-35",
                  bypassLens: false,
                })
              }
              className={`py-3 rounded font-bold transition-all border text-sm ${
                state.lensCircle === "super-35"
                  ? "bg-slate-400 text-gray-900 border-slate-400"
                  : "bg-white bg-opacity-10 text-white border-white border-opacity-20 hover:bg-opacity-20"
              }`}
            >
              Super 35
            </button>
            <button
              onClick={() =>
                setState({
                  ...state,
                  lensCircle: "full-frame",
                  bypassLens: false,
                })
              }
              className={`py-3 rounded font-bold transition-all border text-sm ${
                state.lensCircle === "full-frame"
                  ? "bg-slate-400 text-gray-900 border-slate-400"
                  : "bg-white bg-opacity-10 text-white border-white border-opacity-20 hover:bg-opacity-20"
              }`}
            >
              Full Frame+
            </button>
          </div>
          <button
            onClick={() =>
              setState({
                ...state,
                bypassLens: !state.bypassLens,
                lensCircle: !state.bypassLens ? "" : state.lensCircle,
              })
            }
            className={`w-full py-2 rounded text-sm font-bold transition-all border ${
              state.bypassLens
                ? "bg-slate-400 text-gray-900 border-slate-400"
                : "bg-white bg-opacity-10 text-white border-white border-opacity-20 hover:bg-opacity-20"
            }`}
          >
            {state.bypassLens ? "✓ BYPASS SELECTION" : "BYPASS SELECTION"}
          </button>
        </div>
      )}

      <div className="mb-8">
        <label className="block text-slate-300 text-sm font-bold mb-3 tracking-widest">
          {formatType === "film" ? "CAMERA NEGATIVE" : "CAMERA"}
        </label>
        <div className="relative mb-3">
          <select
            value={
              formatType === "film"
                ? state.filmFormat || ""
                : state.camera || ""
            }
            onChange={(e) => {
              if (formatType === "film") {
                setState({
                  ...state,
                  filmFormat: e.target.value,
                  sensorFormat: "",
                });
              } else {
                setState({
                  ...state,
                  camera: e.target.value,
                  sensorFormat: "",
                  bypassCamera: false,
                });
              }
            }}
            className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 text-white px-4 py-3 rounded appearance-none focus:outline-none focus:border-slate-400 transition-all cursor-pointer font-mono text-sm"
          >
            <option value="">
              {formatType === "film"
                ? "-- Please Select Format --"
                : "-- Please Select Camera --"}
            </option>
            {(formatType === "film" ? filmFormats : cameras).map((item) => (
              <option
                key={item.id}
                value={item.id}
                className="bg-gray-900 text-white"
              >
                {item.displayName || item.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
        </div>
        {formatType === "digital" && (
          <button
            onClick={() =>
              setState({
                ...state,
                bypassCamera: !state.bypassCamera,
                camera: !state.bypassCamera ? "" : state.camera,
              })
            }
            className={`w-full py-2 rounded text-sm font-bold transition-all border ${
              state.bypassCamera
                ? "bg-slate-400 text-gray-900 border-slate-400"
                : "bg-white bg-opacity-10 text-white border-white border-opacity-20 hover:bg-opacity-20"
            }`}
          >
            {state.bypassCamera ? "✓ BYPASS SELECTION" : "BYPASS SELECTION"}
          </button>
        )}
      </div>

      {formatType === "digital" && (
        <div className="mb-8">
          <label className="block text-slate-300 text-sm font-bold mb-3 tracking-widest">
            SENSOR FORMAT
          </label>
          <div className="relative mb-3">
            <select
              value={state.sensorFormat}
              onChange={(e) =>
                setState({
                  ...state,
                  sensorFormat: e.target.value,
                  useCustomPixels: false,
                })
              }
              className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 text-white px-4 py-3 rounded appearance-none focus:outline-none focus:border-slate-400 transition-all cursor-pointer font-mono text-sm"
            >
              <option value="">-- Please Select Sensor Format --</option>
              {Object.entries(sensors).map(([key, sensor]) => {
                const sensorCircle = sensorImageCircle[key];
                const isDisabled =
                  state.lensCircle &&
                  sensorCircle &&
                  sensorCircle !== state.lensCircle &&
                  sensorCircle !== "both";
                return (
                  <option
                    key={key}
                    value={key}
                    disabled={isDisabled}
                    className={
                      isDisabled
                        ? "bg-gray-600 text-gray-400"
                        : "bg-gray-900 text-white"
                    }
                    style={{ opacity: isDisabled ? 0.5 : 1 }}
                  >
                    {isDisabled ? "✗ " : ""}
                    {sensor.name} | {sensor.aspectRatio}
                  </option>
                );
              })}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
          </div>

          <div className="mb-8 bg-gray-600 bg-opacity-10 border border-gray-500 border-opacity-20 rounded-lg p-4">
            <label className="flex items-center gap-3 text-white text-sm font-bold mb-3 cursor-pointer">
              <input
                type="checkbox"
                checked={state.useCustomPixels}
                onChange={(e) =>
                  setState({
                    ...state,
                    useCustomPixels: e.target.checked,
                    sensorFormat: "",
                  })
                }
                className="w-5 h-5 cursor-pointer"
              />
              <span className="text-slate-300">CUSTOM RESOLUTION</span>
            </label>
            {state.useCustomPixels && (
              <div className="space-y-3">
                <input
                  type="number"
                  value={state.customPixelWidth}
                  onChange={(e) =>
                    setState({ ...state, customPixelWidth: e.target.value })
                  }
                  placeholder="Width (px)"
                  className="w-full bg-white bg-opacity-10 border border-slate-400 border-opacity-40 text-white px-4 py-2 rounded focus:outline-none focus:border-slate-400 transition-all font-mono text-sm"
                />
                <input
                  type="number"
                  value={state.customPixelHeight}
                  onChange={(e) =>
                    setState({ ...state, customPixelHeight: e.target.value })
                  }
                  placeholder="Height (px)"
                  className="w-full bg-white bg-opacity-10 border border-slate-400 border-opacity-40 text-white px-4 py-2 rounded focus:outline-none focus:border-slate-400 transition-all font-mono text-sm"
                />
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mb-8">
        <label className="block text-slate-300 text-sm font-bold mb-3 tracking-widest">
          SQUEEZE RATIO
        </label>
        {formatType === "digital" && !state.sensorFormat && (
          <p className="text-white text-xs opacity-60 mb-3">
            Select a sensor format first
          </p>
        )}
        {formatType === "film" && !state.filmFormat && (
          <p className="text-white text-xs opacity-60 mb-3">
            Select a film format first
          </p>
        )}
        <div
          className={`grid gap-2 mb-3 ${
            formatType === "digital" ? "grid-cols-5" : "grid-cols-4"
          }`}
        >
          {(formatType === "film"
            ? filmAnamorphicOptions
            : anamorphicOptions
          ).map((opt) => (
            <button
              key={opt.value}
              disabled={formatType === "film" && state.useCustomFilmAnamorphic}
              onClick={() => {
                if (formatType === "film") {
                  setState({
                    ...state,
                    filmAnamorphicRatio: opt.value,
                    useCustomFilmAnamorphic: false,
                  });
                } else {
                  setState({
                    ...state,
                    anamorphicRatio: opt.value,
                    useCustomAnamorphic: false,
                  });
                }
              }}
              className={`py-2 rounded text-sm font-bold transition-all border ${
                formatType === "film" && state.useCustomFilmAnamorphic
                  ? "bg-gray-600 text-gray-400 border-gray-600 opacity-50 cursor-not-allowed"
                  : (formatType === "film"
                      ? state.filmAnamorphicRatio
                      : state.anamorphicRatio) === opt.value
                  ? "bg-slate-400 text-gray-900 border-slate-400"
                  : "bg-white bg-opacity-10 text-white border-white border-opacity-20 hover:bg-opacity-20"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="bg-gray-600 bg-opacity-10 border border-gray-500 border-opacity-20 rounded-lg p-4">
          <label className="flex items-center gap-3 text-white text-sm font-bold mb-3 cursor-pointer">
            <input
              type="checkbox"
              checked={
                formatType === "film"
                  ? state.useCustomFilmAnamorphic
                  : state.useCustomAnamorphic
              }
              onChange={(e) => {
                if (formatType === "film") {
                  setState({
                    ...state,
                    useCustomFilmAnamorphic: e.target.checked,
                  });
                } else {
                  setState({ ...state, useCustomAnamorphic: e.target.checked });
                }
              }}
              className="w-5 h-5 cursor-pointer"
            />
            <span className="text-slate-300">CUSTOM RATIO</span>
          </label>
          {(formatType === "film"
            ? state.useCustomFilmAnamorphic
            : state.useCustomAnamorphic) && (
            <input
              type="number"
              step="0.1"
              value={
                formatType === "film"
                  ? state.customFilmAnamorphic
                  : state.customAnamorphicRatio
              }
              onChange={(e) => {
                if (formatType === "film") {
                  setState({ ...state, customFilmAnamorphic: e.target.value });
                } else {
                  setState({ ...state, customAnamorphicRatio: e.target.value });
                }
              }}
              placeholder="e.g., 2.0"
              className="w-full bg-white bg-opacity-10 border border-slate-400 border-opacity-40 text-white px-4 py-2 rounded focus:outline-none focus:border-slate-400 transition-all font-mono text-sm"
            />
          )}
        </div>
      </div>

      <div className="mb-8">
        <label className="block text-slate-300 text-sm font-bold mb-3 tracking-widest">
          OUTPUT ASPECT RATIO
        </label>
        <div className="grid grid-cols-4 gap-2 mb-3">
          {aspectRatioOptions.map((opt) => (
            <button
              key={opt.value}
              disabled={formatType === "film" && state.useCustomFilmAspectRatio}
              onClick={() => {
                if (formatType === "film") {
                  setState({
                    ...state,
                    filmDesiredAspectRatio: opt.value,
                    useCustomFilmAspectRatio: false,
                  });
                } else {
                  setState({
                    ...state,
                    desiredAspectRatio: opt.value,
                    useCustomAspectRatio: false,
                  });
                }
              }}
              className={`py-1.5 px-2 rounded text-xs font-bold transition-all border ${
                formatType === "film" && state.useCustomFilmAspectRatio
                  ? "bg-gray-600 text-gray-400 border-gray-600 opacity-50 cursor-not-allowed"
                  : (formatType === "film"
                      ? state.filmDesiredAspectRatio
                      : state.desiredAspectRatio) === opt.value
                  ? "bg-slate-400 text-gray-900 border-slate-400"
                  : "bg-white bg-opacity-10 text-white border-white border-opacity-20 hover:bg-opacity-20"
              }`}
            >
              <div className="text-center leading-tight">
                <div>{opt.label}</div>
                <div className="text-xs opacity-75">{opt.divisor}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="bg-gray-600 bg-opacity-10 border border-gray-500 border-opacity-20 rounded-lg p-4">
          <label className="flex items-center gap-3 text-white text-sm font-bold mb-3 cursor-pointer">
            <input
              type="checkbox"
              checked={
                formatType === "film"
                  ? state.useCustomFilmAspectRatio
                  : state.useCustomAspectRatio
              }
              onChange={(e) => {
                if (formatType === "film") {
                  setState({
                    ...state,
                    useCustomFilmAspectRatio: e.target.checked,
                  });
                } else {
                  setState({
                    ...state,
                    useCustomAspectRatio: e.target.checked,
                  });
                }
              }}
              className="w-5 h-5 cursor-pointer"
            />
            <span className="text-slate-300">CUSTOM RATIO</span>
          </label>
          {(formatType === "film"
            ? state.useCustomFilmAspectRatio
            : state.useCustomAspectRatio) && (
            <input
              type="number"
              step="0.01"
              value={
                formatType === "film"
                  ? state.customFilmAspectRatio
                  : state.customOutputAspectRatio
              }
              onChange={(e) => {
                if (formatType === "film") {
                  setState({ ...state, customFilmAspectRatio: e.target.value });
                } else {
                  setState({
                    ...state,
                    customOutputAspectRatio: e.target.value,
                  });
                }
              }}
              placeholder="e.g., 2.39"
              className="w-full bg-white bg-opacity-10 border border-slate-400 border-opacity-40 text-white px-4 py-2 rounded focus:outline-none focus:border-slate-400 transition-all font-mono text-sm"
            />
          )}
        </div>
      </div>
    </div>
  );

  // ============================================
  // EXPORT FUNCTIONS
  // ============================================

  const generateShareLink = () => {
    const params = new URLSearchParams();

    if (formatType === "digital") {
      params.append("format", "digital");
      params.append("camera", selectedCamera);
      params.append("sensorFormat", sensorFormat);
      params.append(
        "anamorphic",
        useCustomAnamorphic ? customAnamorphicRatio : anamorphicRatio
      );
      params.append(
        "aspect",
        useCustomAspectRatio ? customOutputAspectRatio : desiredAspectRatio
      );
    } else {
      params.append("format", "film");
      params.append("filmFormat", selectedFilmFormat);
      params.append(
        "anamorphic",
        useCustomFilmAnamorphic ? customFilmAnamorphic : filmAnamorphicRatio
      );
      params.append(
        "aspect",
        useCustomFilmAspectRatio
          ? customFilmAspectRatio
          : filmDesiredAspectRatio
      );
    }

    const baseUrl = window.location.origin + window.location.pathname;
    const shareUrl = `${baseUrl}?${params.toString()}`;

    // Copy to clipboard
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        alert("Share link copied to clipboard!");
      })
      .catch(() => {
        prompt("Share this link:", shareUrl);
      });
  };

  const downloadScreenshot = async () => {
    try {
      const html2canvas = (
        await import(
          "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"
        )
      ).default;
      const visualizerElement = document.querySelector(
        "[data-export-visualizer]"
      );

      if (!visualizerElement) {
        alert("Visualizer not found");
        return;
      }

      const canvas = await html2canvas(visualizerElement, {
        backgroundColor: "#0f0f14",
        scale: 2,
      });

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `anamorphic-${formatType}-${
        new Date().toISOString().split("T")[0]
      }.png`;
      link.click();
    } catch (error) {
      console.error("Screenshot error:", error);
      alert("Could not generate screenshot");
    }
  };

  const downloadPDF = async () => {
    try {
      const jsPDF = (
        await import(
          "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
        )
      ).jsPDF;
      const html2canvas = (
        await import(
          "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"
        )
      ).default;

      const visualizerElement = document.querySelector(
        "[data-export-visualizer]"
      );
      if (!visualizerElement) {
        alert("Visualizer not found");
        return;
      }

      const canvas = await html2canvas(visualizerElement, {
        backgroundColor: "#0f0f14",
        scale: 2,
      });

      const pdf = new jsPDF("p", "mm", "a4");
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 10, 20, imgWidth, imgHeight);

      // Add metadata
      let yPosition = imgHeight + 40;
      pdf.setFontSize(12);
      pdf.text("ANAMORPHIC CALCULATOR EXPORT", 10, yPosition);

      yPosition += 10;
      pdf.setFontSize(10);

      if (formatType === "digital") {
        const camera = cameraList.find((c) => c.id === selectedCamera);
        const sensor = sensorsByCamera[selectedCamera]?.[sensorFormat];
        pdf.text(`Camera: ${camera?.name || "N/A"}`, 10, yPosition);
        yPosition += 7;
        pdf.text(`Sensor: ${sensor?.name || "N/A"}`, 10, yPosition);
        yPosition += 7;
        pdf.text(
          `Squeeze Ratio: ${
            useCustomAnamorphic ? customAnamorphicRatio : anamorphicRatio
          }x`,
          10,
          yPosition
        );
        yPosition += 7;
        pdf.text(
          `Desired Aspect: ${
            useCustomAspectRatio ? customOutputAspectRatio : desiredAspectRatio
          }:1`,
          10,
          yPosition
        );
        yPosition += 7;
        if (calculateDigital) {
          pdf.text(
            `Natural Aspect: ${calculateDigital.naturalAspectRatio}:1`,
            10,
            yPosition
          );
          yPosition += 7;
          pdf.text(`Coverage: ${calculateDigital.coverage}%`, 10, yPosition);
        }
      } else {
        const format = filmFormats.find((f) => f.id === selectedFilmFormat);
        pdf.text(`Film Format: ${format?.name || "N/A"}`, 10, yPosition);
        yPosition += 7;
        pdf.text(
          `Squeeze Ratio: ${
            useCustomFilmAnamorphic ? customFilmAnamorphic : filmAnamorphicRatio
          }x`,
          10,
          yPosition
        );
        yPosition += 7;
        pdf.text(
          `Desired Aspect: ${
            useCustomFilmAspectRatio
              ? customFilmAspectRatio
              : filmDesiredAspectRatio
          }:1`,
          10,
          yPosition
        );
        yPosition += 7;
        if (calculateFilm) {
          pdf.text(
            `Negative Aspect: ${calculateFilm.negativeAspect}:1`,
            10,
            yPosition
          );
          yPosition += 7;
          pdf.text(
            `Coverage: ${calculateFilm.cropPercentageOfUnsqueezed}%`,
            10,
            yPosition
          );
        }
      }

      yPosition += 10;
      pdf.setFontSize(8);
      pdf.text(`Exported: ${new Date().toLocaleString()}`, 10, yPosition);

      pdf.save(
        `anamorphic-${formatType}-${new Date().toISOString().split("T")[0]}.pdf`
      );
    } catch (error) {
      console.error("PDF error:", error);
      alert("Could not generate PDF");
    }
  };

  // ============================================
  // MAIN RETURN / LAYOUT
  // ============================================

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, #0f0f14 0%, #1a1a24 50%, #14141f 100%)",
      }}
    >
      <div className="fixed top-0 left-0 right-0 h-2 bg-gradient-to-r from-slate-500 via-slate-400 to-slate-300"></div>
      <div className="fixed bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400"></div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div
          className="mb-16 -mx-6 px-6 py-12 flex justify-center"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.02) 100%)",
          }}
        >
          <div className="text-center">
            <h1
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-none"
              style={{
                fontFamily: 'Futura, "Trebuchet MS", sans-serif',
                letterSpacing: "-0.03em",
              }}
            >
              ANAMORPHIC
            </h1>
            <h2
              className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-slate-300 leading-none"
              style={{
                fontFamily: 'Futura, "Trebuchet MS", sans-serif',
                letterSpacing: "-0.02em",
              }}
            >
              LENS CALCULATOR
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-slate-400 to-transparent mt-6 mx-auto"></div>
          </div>
        </div>

        {/* FORMAT TYPE SELECTOR */}
        <div className="mb-12 flex justify-center gap-4">
          <button
            onClick={() => setFormatType("digital")}
            className={`px-8 py-3 rounded font-bold transition-all border ${
              formatType === "digital"
                ? "bg-slate-400 text-gray-900 border-slate-400"
                : "bg-white bg-opacity-10 text-white border-white border-opacity-20 hover:bg-opacity-20"
            }`}
          >
            DIGITAL
          </button>
          <button
            onClick={() => setFormatType("film")}
            className={`px-8 py-3 rounded font-bold transition-all border ${
              formatType === "film"
                ? "bg-slate-400 text-gray-900 border-slate-400"
                : "bg-white bg-opacity-10 text-white border-white border-opacity-20 hover:bg-opacity-20"
            }`}
          >
            FILM
          </button>
        </div>

        {/* SELECT DEFAULTS CHECKBOX */}
        <div className="mb-12 flex justify-center">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              key={formatType}
              type="checkbox"
              onChange={(e) => {
                if (e.target.checked) {
                  if (formatType === "digital") {
                    // Digital defaults
                    setLensImageCircle("full-frame");
                    setSelectedCamera("sony-venice");
                    setSensorFormat("sony-venice-6k-3-2");
                    setAnamorphicRatio("1.5");
                    setDesiredAspectRatio("2.39");
                    setUseCustomAnamorphic(false);
                    setUseCustomAspectRatio(false);
                  } else {
                    // Film defaults
                    setSelectedFilmFormat("super-35-4perf");
                    setFilmAnamorphicRatio("2");
                    setFilmDesiredAspectRatio("2.39");
                    setUseCustomFilmAnamorphic(false);
                    setUseCustomFilmAspectRatio(false);
                  }
                }
              }}
              className="w-5 h-5 cursor-pointer"
            />
            <span className="text-slate-300 font-bold text-sm">
              SELECT DEFAULTS
            </span>
          </label>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            {/* Mobile Parameter Toggle */}
            <button
              onClick={toggleParameters}
              className="lg:hidden w-full mb-4 px-4 py-3 rounded font-bold transition-all border bg-slate-500 bg-opacity-40 text-white border-slate-400 border-opacity-50 hover:bg-opacity-60 flex items-center justify-between"
            >
              <span>{showParameters ? "−" : "+"} PARAMETERS</span>
            </button>

            {showParameters && (
              <div>
                <ParametersPanel
                  state={{
                    lensCircle: lensImageCircle,
                    bypassLens: bypassLensCircle,
                    camera: selectedCamera,
                    filmFormat: selectedFilmFormat,
                    bypassCamera: bypassCameraSelection,
                    sensorFormat: sensorFormat,
                    useCustomPixels: useCustomPixels,
                    customPixelWidth: customPixelWidth,
                    customPixelHeight: customPixelHeight,
                    anamorphicRatio: anamorphicRatio,
                    useCustomAnamorphic: useCustomAnamorphic,
                    customAnamorphicRatio: customAnamorphicRatio,
                    desiredAspectRatio: desiredAspectRatio,
                    useCustomAspectRatio: useCustomAspectRatio,
                    customOutputAspectRatio: customOutputAspectRatio,
                    filmAnamorphicRatio: filmAnamorphicRatio,
                    useCustomFilmAnamorphic: useCustomFilmAnamorphic,
                    customFilmAnamorphic: customFilmAnamorphic,
                    filmDesiredAspectRatio: filmDesiredAspectRatio,
                    useCustomFilmAspectRatio: useCustomFilmAspectRatio,
                    customFilmAspectRatio: customFilmAspectRatio,
                  }}
                  setState={(newState) => {
                    if (newState.lensCircle !== undefined)
                      setLensImageCircle(newState.lensCircle);
                    if (newState.bypassLens !== undefined)
                      setBypassLensCircle(newState.bypassLens);
                    if (newState.camera !== undefined)
                      setSelectedCamera(newState.camera);
                    if (newState.filmFormat !== undefined)
                      setSelectedFilmFormat(newState.filmFormat);
                    if (newState.bypassCamera !== undefined)
                      setBypassCameraSelection(newState.bypassCamera);
                    if (newState.sensorFormat !== undefined)
                      setSensorFormat(newState.sensorFormat);
                    if (newState.useCustomPixels !== undefined)
                      setUseCustomPixels(newState.useCustomPixels);
                    if (newState.customPixelWidth !== undefined)
                      setCustomPixelWidth(newState.customPixelWidth);
                    if (newState.customPixelHeight !== undefined)
                      setCustomPixelHeight(newState.customPixelHeight);
                    if (newState.anamorphicRatio !== undefined)
                      setAnamorphicRatio(newState.anamorphicRatio);
                    if (newState.useCustomAnamorphic !== undefined)
                      setUseCustomAnamorphic(newState.useCustomAnamorphic);
                    if (newState.customAnamorphicRatio !== undefined)
                      setCustomAnamorphicRatio(newState.customAnamorphicRatio);
                    if (newState.desiredAspectRatio !== undefined)
                      setDesiredAspectRatio(newState.desiredAspectRatio);
                    if (newState.useCustomAspectRatio !== undefined)
                      setUseCustomAspectRatio(newState.useCustomAspectRatio);
                    if (newState.customOutputAspectRatio !== undefined)
                      setCustomOutputAspectRatio(
                        newState.customOutputAspectRatio
                      );
                    if (newState.filmAnamorphicRatio !== undefined)
                      setFilmAnamorphicRatio(newState.filmAnamorphicRatio);
                    if (newState.useCustomFilmAnamorphic !== undefined)
                      setUseCustomFilmAnamorphic(
                        newState.useCustomFilmAnamorphic
                      );
                    if (newState.customFilmAnamorphic !== undefined)
                      setCustomFilmAnamorphic(newState.customFilmAnamorphic);
                    if (newState.filmDesiredAspectRatio !== undefined)
                      setFilmDesiredAspectRatio(
                        newState.filmDesiredAspectRatio
                      );
                    if (newState.useCustomFilmAspectRatio !== undefined)
                      setUseCustomFilmAspectRatio(
                        newState.useCustomFilmAspectRatio
                      );
                    if (newState.customFilmAspectRatio !== undefined)
                      setCustomFilmAspectRatio(newState.customFilmAspectRatio);
                  }}
                  formatType={formatType}
                  filmFormats={filmFormats}
                />
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            {formatType === "digital" ? (
              !selectedCamera ||
              !sensorFormat ||
              (!anamorphicRatio && !useCustomAnamorphic) ||
              (!desiredAspectRatio && !useCustomAspectRatio) ? (
                <div className="bg-white bg-opacity-5 backdrop-blur-lg border border-white border-opacity-10 rounded-lg p-4 lg:p-8 text-center">
                  <p className="text-white text-lg opacity-60">
                    Select all parameters above to view calculations
                  </p>
                </div>
              ) : calculateDigital ? (
                <div className="space-y-8">
                  {/* Desqueezed Output Visualization */}
                  <div
                    data-export-visualizer
                    className="bg-white bg-opacity-5 backdrop-blur-lg border border-white border-opacity-10 rounded-lg p-4 lg:p-8 lg:mb-8 mb-4"
                  >
                    <h3 className="text-white text-lg font-bold mb-6 tracking-wider">
                      DESQUEEZED OUTPUT
                    </h3>

                    <div className="flex justify-center items-center mb-8">
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          maxWidth: "500px",
                        }}
                      >
                        <div
                          className="bg-gray-900 border-2 border-blue-400 relative"
                          style={{
                            aspectRatio:
                              (calculateDigital.usedPixelWidth *
                                calculateDigital.anamorphic) /
                                calculateDigital.usedPixelHeight || 2.0,
                            position: "relative",
                            zIndex: 1,
                          }}
                        >
                          <div
                            className="absolute border-2 border-green-400"
                            style={{
                              left: `${Math.max(
                                0,
                                Math.min(
                                  100,
                                  ((calculateDigital.usedPixelWidth -
                                    calculateDigital.croppedPixelWidth) /
                                    calculateDigital.usedPixelWidth /
                                    2) *
                                    100
                                )
                              )}%`,
                              top: `${Math.max(
                                0,
                                Math.min(
                                  100,
                                  ((calculateDigital.desqueezedHeight -
                                    calculateDigital.croppedPixelHeight) /
                                    calculateDigital.desqueezedHeight /
                                    2) *
                                    100
                                )
                              )}%`,
                              width: `${Math.max(
                                0,
                                Math.min(
                                  100,
                                  (calculateDigital.croppedPixelWidth /
                                    calculateDigital.usedPixelWidth) *
                                    100
                                )
                              )}%`,
                              height: `${Math.max(
                                0,
                                Math.min(
                                  100,
                                  (calculateDigital.croppedPixelHeight /
                                    calculateDigital.desqueezedHeight) *
                                    100
                                )
                              )}%`,
                              boxSizing: "border-box",
                            }}
                          />

                          {calculateDigital.croppedPixelHeight <
                            calculateDigital.desqueezedHeight && (
                            <>
                              <div
                                className="absolute bg-black bg-opacity-40"
                                style={{
                                  left: "0",
                                  top: "0",
                                  width: "100%",
                                  height: `${
                                    ((calculateDigital.desqueezedHeight -
                                      calculateDigital.croppedPixelHeight) /
                                      calculateDigital.desqueezedHeight /
                                      2) *
                                    100
                                  }%`,
                                  boxSizing: "border-box",
                                }}
                              />
                              <div
                                className="absolute bg-black bg-opacity-40"
                                style={{
                                  left: "0",
                                  bottom: "0",
                                  width: "100%",
                                  height: `${
                                    ((calculateDigital.desqueezedHeight -
                                      calculateDigital.croppedPixelHeight) /
                                      calculateDigital.desqueezedHeight /
                                      2) *
                                    100
                                  }%`,
                                  boxSizing: "border-box",
                                }}
                              />
                            </>
                          )}

                          {calculateDigital.croppedPixelWidth <
                            calculateDigital.usedPixelWidth && (
                            <>
                              <div
                                className="absolute bg-black bg-opacity-40"
                                style={{
                                  left: "0",
                                  top: "0",
                                  width: `${
                                    ((calculateDigital.usedPixelWidth -
                                      calculateDigital.croppedPixelWidth) /
                                      calculateDigital.usedPixelWidth /
                                      2) *
                                    100
                                  }%`,
                                  height: "100%",
                                  boxSizing: "border-box",
                                }}
                              />
                              <div
                                className="absolute bg-black bg-opacity-40"
                                style={{
                                  right: "0",
                                  top: "0",
                                  width: `${
                                    ((calculateDigital.usedPixelWidth -
                                      calculateDigital.croppedPixelWidth) /
                                      calculateDigital.usedPixelWidth /
                                      2) *
                                    100
                                  }%`,
                                  height: "100%",
                                  boxSizing: "border-box",
                                }}
                              />
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="pt-4 border-t border-white border-opacity-10">
                      <p className="text-slate-300 text-xs font-bold mb-2">
                        LEGEND
                      </p>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 border-2 border-blue-400 bg-gray-900"></div>
                          <span className="text-slate-300">
                            Desqueezed: {calculateDigital.usedPixelWidth}×
                            {calculateDigital.desqueezedHeight}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 border-2 border-green-400 bg-gray-900"></div>
                          <span className="text-slate-300">
                            Cropped: {calculateDigital.croppedPixelWidth}×
                            {calculateDigital.croppedPixelHeight}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stats Grid - floats inside the section */}
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="bg-blue-500 bg-opacity-40 rounded border p-2 lg:p-6">
                        <div className="text-gray-300 text-xs lg:text-sm font-semibold lg:font-bold mb-2">
                          UNSQUEEZED ASPECT
                        </div>
                        <div className="text-lg lg:text-4xl font-bold lg:font-black text-white">
                          {calculateDigital.naturalAspectRatio}:1
                        </div>
                      </div>
                      <div className="bg-purple-500 bg-opacity-40 rounded border p-2 lg:p-6">
                        <div className="text-gray-300 text-xs lg:text-sm font-semibold lg:font-bold mb-2">
                          DESIRED OUTPUT
                        </div>
                        <div className="text-lg lg:text-4xl font-bold lg:font-black text-white">
                          {calculateDigital.aspectRatio}:1
                        </div>
                      </div>
                      <div
                        className={`rounded border p-2 lg:p-6 ${
                          parseFloat(calculateDigital.cropPercentage) > 0
                            ? "bg-red-500 bg-opacity-40"
                            : "bg-green-500 bg-opacity-40"
                        }`}
                      >
                        <div className="text-gray-300 text-xs lg:text-sm font-semibold lg:font-bold mb-2">
                          CROP NEEDED
                        </div>
                        <div className="text-lg lg:text-4xl font-bold lg:font-black text-white">
                          {calculateDigital.cropPixelsNeeded}
                        </div>
                        <div className="text-white text-xs mt-2">pixels</div>
                      </div>
                      <div className="bg-yellow-500 bg-opacity-40 rounded border p-2 lg:p-6">
                        <div className="text-gray-300 text-xs lg:text-sm font-semibold lg:font-bold mb-2">
                          OUTPUT UTILIZATION
                        </div>
                        <div className="text-lg lg:text-4xl font-bold lg:font-black text-gray-900">
                          {calculateDigital.coverage}%
                        </div>
                      </div>
                    </div>

                    {/* Crop Pixel Boxes */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                      <div className="bg-blue-500 bg-opacity-40 rounded border p-2 lg:p-6">
                        <div className="text-gray-300 text-xs lg:text-sm font-semibold lg:font-bold mb-2">
                          CROP TOP
                        </div>
                        <div className="text-lg lg:text-4xl font-bold lg:font-black text-gray-900">
                          {calculateDigital.desqueezedHeight >
                          calculateDigital.desqueezedCroppedHeight
                            ? Math.round(
                                (calculateDigital.desqueezedHeight -
                                  calculateDigital.desqueezedCroppedHeight) /
                                  2
                              )
                            : 0}
                        </div>
                        <div className="text-gray-900 text-xs mt-2">pixels</div>
                      </div>
                      <div className="bg-blue-500 bg-opacity-40 rounded border p-2 lg:p-6">
                        <div className="text-gray-300 text-xs lg:text-sm font-semibold lg:font-bold mb-2">
                          CROP BOTTOM
                        </div>
                        <div className="text-lg lg:text-4xl font-bold lg:font-black text-gray-900">
                          {calculateDigital.desqueezedHeight >
                          calculateDigital.desqueezedCroppedHeight
                            ? Math.round(
                                (calculateDigital.desqueezedHeight -
                                  calculateDigital.desqueezedCroppedHeight) /
                                  2
                              )
                            : 0}
                        </div>
                        <div className="text-gray-900 text-xs mt-2">pixels</div>
                      </div>
                      <div className="bg-green-500 bg-opacity-40 rounded border p-2 lg:p-6">
                        <div className="text-gray-300 text-xs lg:text-sm font-semibold lg:font-bold mb-2">
                          CROP LEFT
                        </div>
                        <div className="text-lg lg:text-4xl font-bold lg:font-black text-white">
                          {calculateDigital.croppedPixelWidth <
                          calculateDigital.usedPixelWidth
                            ? Math.round(
                                (calculateDigital.usedPixelWidth -
                                  calculateDigital.croppedPixelWidth) /
                                  2
                              )
                            : 0}
                        </div>
                        <div className="text-white text-xs mt-2">pixels</div>
                      </div>
                      <div className="bg-green-500 bg-opacity-40 rounded border p-2 lg:p-6">
                        <div className="text-gray-300 text-xs lg:text-sm font-semibold lg:font-bold mb-2">
                          CROP RIGHT
                        </div>
                        <div className="text-lg lg:text-4xl font-bold lg:font-black text-white">
                          {calculateDigital.croppedPixelWidth <
                          calculateDigital.usedPixelWidth
                            ? Math.round(
                                (calculateDigital.usedPixelWidth -
                                  calculateDigital.croppedPixelWidth) /
                                  2
                              )
                            : 0}
                        </div>
                        <div className="text-white text-xs mt-2">pixels</div>
                      </div>
                    </div>

                    {/* Export Buttons */}
                    <div className="flex justify-center gap-3 mt-8">
                      <button
                        onClick={generateShareLink}
                        className="px-4 py-2 rounded font-bold transition-all border bg-blue-500 bg-opacity-20 text-blue-300 border-blue-500 border-opacity-50 hover:bg-opacity-30 flex items-center justify-center gap-2 text-sm"
                      >
                        <span>🔗</span>
                        SHARE
                      </button>
                      <button
                        onClick={downloadScreenshot}
                        className="hidden px-4 py-2 rounded font-bold transition-all border bg-green-500 bg-opacity-20 text-green-300 border-green-500 border-opacity-50 hover:bg-opacity-30 flex items-center justify-center gap-2 text-sm"
                      >
                        <span>📸</span>
                        SCREENSHOT
                      </button>
                      <button
                        onClick={downloadPDF}
                        className="hidden px-4 py-2 rounded font-bold transition-all border bg-purple-500 bg-opacity-20 text-purple-300 border-purple-500 border-opacity-50 hover:bg-opacity-30 flex items-center justify-center gap-2 text-sm"
                      >
                        <span>📄</span>
                        PDF
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white bg-opacity-5 backdrop-blur-lg border border-white border-opacity-10 rounded-lg p-4 lg:p-8 text-center">
                  <p className="text-white text-lg opacity-60">
                    Select all parameters above to view calculations
                  </p>
                </div>
              )
            ) : !selectedFilmFormat ||
              (!filmAnamorphicRatio && !useCustomFilmAnamorphic) ||
              (!filmDesiredAspectRatio && !useCustomFilmAspectRatio) ? (
              <div className="bg-white bg-opacity-5 backdrop-blur-lg border border-white border-opacity-10 rounded-lg p-4 lg:p-8 text-center">
                <p className="text-white text-lg opacity-60">
                  Select all parameters above to view calculations
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* FILM NEGATIVE VISUALIZER */}
                {calculateFilm && (
                  <div
                    data-export-visualizer
                    className="bg-white bg-opacity-5 backdrop-blur-lg border border-white border-opacity-10 rounded-lg p-8"
                  >
                    <h3 className="text-white text-lg md:text-xl font-bold mb-4">
                      NEGATIVE VISUALIZATION
                    </h3>

                    {/* Compact Film Calculations */}
                    <div className="grid grid-cols-3 gap-2 mb-6">
                      <div className="bg-white bg-opacity-5 p-2 rounded border border-white border-opacity-10">
                        <p className="text-slate-300 text-xs font-bold mb-1">
                          NEGATIVE DIMENSIONS
                        </p>
                        <p className="text-white font-mono text-xs">
                          {calculateFilm.negativeWidth}×
                          {calculateFilm.negativeHeight}mm
                        </p>
                      </div>
                      <div className="bg-white bg-opacity-5 p-2 rounded border border-white border-opacity-10">
                        <p className="text-slate-300 text-xs font-bold mb-1">
                          SQUEEZE
                        </p>
                        <p className="text-white font-mono text-xs">
                          {calculateFilm.squeeze}x
                        </p>
                      </div>
                      <div className="bg-white bg-opacity-5 p-2 rounded border border-white border-opacity-10">
                        <p className="text-slate-300 text-xs font-bold mb-1">
                          NEGATIVE ASPECT
                        </p>
                        <p className="text-white font-mono text-xs">
                          {calculateFilm.negativeAspect}:1
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Flow Graphic and Output Container */}
                      <div className="flex flex-col lg:flex-row gap-3 lg:gap-8 items-stretch">
                        {/* Vertical Squeeze Flow Graphic - Far Left */}
                        <div className="hidden lg:flex flex-col items-center justify-between gap-1">
                          {/* Film Negative */}
                          <div className="flex flex-col items-center">
                            <p className="text-slate-300 text-xs font-bold mb-1">
                              Negative
                            </p>
                            <div
                              className="border-2 border-amber-400 bg-gray-900"
                              style={{
                                width: "80px",
                                height: `${
                                  (calculateFilm.negativeHeight /
                                    calculateFilm.negativeWidth) *
                                  80
                                }px`,
                              }}
                            />
                            <p className="text-slate-400 text-xs font-mono mt-1">
                              {calculateFilm.negativeWidth}×
                              {calculateFilm.negativeHeight}mm
                            </p>
                          </div>

                          {/* Arrow and Squeeze Factor */}
                          <div className="flex flex-col items-center gap-0 flex-shrink-0">
                            <div className="h-6 w-1 bg-gradient-to-b from-amber-400 to-emerald-400"></div>
                            <p className="text-emerald-400 font-bold text-xs">
                              {calculateFilm.squeeze}x
                            </p>
                            <div className="w-1.5 h-1.5 border-b border-r border-emerald-400 transform rotate-45"></div>
                          </div>

                          {/* Unsqueezed Image */}
                          <div className="flex flex-col items-center">
                            <p className="text-slate-300 text-xs font-bold mb-1">
                              Unsqueezed
                            </p>
                            <div
                              className="border-2 border-emerald-400 bg-gray-900"
                              style={{
                                width: "160px",
                                height: `${
                                  (1 / calculateFilm.unSqueezeAspect) * 160
                                }px`,
                              }}
                            />
                            <p className="text-slate-400 text-xs font-mono mt-1">
                              {calculateFilm.unSqueezeAspect}:1
                            </p>
                          </div>
                        </div>

                        {/* Large Unsqueezed Image - Right Side */}
                        <div className="flex flex-col items-center flex-1 order-last lg:order-none">
                          <p className="text-slate-300 text-sm font-bold mb-4">
                            YOUR OUTPUT (with desired crop)
                          </p>
                          <div
                            className="border-2 border-emerald-400 bg-gray-900 relative w-full"
                            style={{
                              maxWidth: "600px",
                              aspectRatio: `${calculateFilm.unSqueezeAspect} / 1`,
                            }}
                          >
                            {/* Desired output crop area or pillar-box guide */}
                            {calculateFilm.desiredAspect !==
                              calculateFilm.unSqueezeAspect && (
                              <div
                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-cyan-400 border-dashed"
                                style={{
                                  width: calculateFilm.isInsufficient
                                    ? "100%"
                                    : `${calculateFilm.cropPercentageOfUnsqueezed}%`,
                                  height: calculateFilm.isInsufficient
                                    ? `${calculateFilm.cropPercentageOfUnsqueezed}%`
                                    : "100%",
                                }}
                              />
                            )}
                            {/* Crop overlay - left/right (horizontal crop) */}
                            {calculateFilm.desiredAspect !==
                              calculateFilm.unSqueezeAspect &&
                              !calculateFilm.isInsufficient && (
                                <>
                                  <div
                                    className="absolute top-0 bottom-0 left-0 bg-black bg-opacity-60"
                                    style={{
                                      width: `${
                                        ((1 -
                                          calculateFilm.cropPercentageOfUnsqueezed /
                                            100) /
                                          2) *
                                        100
                                      }%`,
                                    }}
                                  />
                                  <div
                                    className="absolute top-0 bottom-0 right-0 bg-black bg-opacity-60"
                                    style={{
                                      width: `${
                                        ((1 -
                                          calculateFilm.cropPercentageOfUnsqueezed /
                                            100) /
                                          2) *
                                        100
                                      }%`,
                                    }}
                                  />
                                </>
                              )}
                            {/* Pillar-box overlay - top/bottom (vertical crop/insufficient) */}
                            {calculateFilm.desiredAspect !==
                              calculateFilm.unSqueezeAspect &&
                              calculateFilm.isInsufficient && (
                                <>
                                  <div
                                    className="absolute top-0 left-0 right-0 bg-black bg-opacity-60"
                                    style={{
                                      height: `${
                                        ((1 -
                                          calculateFilm.cropPercentageOfUnsqueezed /
                                            100) /
                                          2) *
                                        100
                                      }%`,
                                    }}
                                  />
                                  <div
                                    className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60"
                                    style={{
                                      height: `${
                                        ((1 -
                                          calculateFilm.cropPercentageOfUnsqueezed /
                                            100) /
                                          2) *
                                        100
                                      }%`,
                                    }}
                                  />
                                </>
                              )}
                          </div>
                          <p className="text-slate-400 text-xs font-mono mt-3">
                            {calculateFilm.unSqueezeAspect}:1 | Coverage:{" "}
                            {calculateFilm.cropPercentageOfUnsqueezed}% |
                            Desired: {calculateFilm.desiredAspect}:1
                          </p>
                        </div>
                      </div>

                      {/* Legend */}
                      <div className="pt-4 border-t border-white border-opacity-10">
                        <p className="text-slate-300 text-xs font-bold mb-2">
                          LEGEND
                        </p>
                        <div className="grid grid-cols-3 gap-3 text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 border-2 border-amber-400"></div>
                            <span className="text-slate-300">
                              Squeezed Negative
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 border-2 border-emerald-400"></div>
                            <span className="text-slate-300">
                              Unsqueezed Image
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 border-2 border-cyan-400 border-dashed"></div>
                            <span className="text-slate-300">
                              Desired Output
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4 mt-4">
                        <div className="bg-blue-500 bg-opacity-40 rounded border p-2 lg:p-6">
                          <div className="text-gray-300 text-xs lg:text-sm font-semibold lg:font-bold mb-2">
                            UNSQUEEZED ASPECT
                          </div>
                          <div className="text-lg lg:text-4xl font-bold lg:font-black text-white">
                            {calculateFilm.unSqueezeAspect}:1
                          </div>
                        </div>
                        <div className="bg-purple-500 bg-opacity-40 rounded border p-2 lg:p-6">
                          <div className="text-gray-300 text-xs lg:text-sm font-semibold lg:font-bold mb-2">
                            DESIRED ASPECT
                          </div>
                          <div className="text-lg lg:text-4xl font-bold lg:font-black text-white">
                            {calculateFilm.desiredAspect}:1
                          </div>
                        </div>
                        <div className="bg-red-500 bg-opacity-40 rounded border p-2 lg:p-6">
                          <div className="text-gray-300 text-xs lg:text-sm font-semibold lg:font-bold mb-2">
                            CROP NEEDED
                          </div>
                          <div className="text-lg lg:text-4xl font-bold lg:font-black text-white">
                            {calculateFilm.isInsufficient
                              ? "N/A"
                              : (
                                  100 - calculateFilm.cropPercentageOfUnsqueezed
                                ).toFixed(1) + "%"}
                          </div>
                          <div className="text-white text-xs mt-2">
                            {calculateFilm.isInsufficient
                              ? ""
                              : "of unsqueezed"}
                          </div>
                        </div>
                        <div
                          className={`rounded border p-2 lg:p-6 ${
                            calculateFilm.isInsufficient
                              ? "bg-red-500 bg-opacity-40"
                              : "bg-green-500 bg-opacity-40"
                          }`}
                        >
                          <div className="text-gray-300 text-xs lg:text-sm font-semibold lg:font-bold mb-2">
                            {calculateFilm.isInsufficient
                              ? "INSUFFICIENT"
                              : "IMAGE SIZE"}
                          </div>
                          <div className="text-lg lg:text-4xl font-bold lg:font-black text-white">
                            {calculateFilm.isInsufficient
                              ? "✗"
                              : (
                                  100 +
                                  (100 -
                                    calculateFilm.cropPercentageOfUnsqueezed)
                                ).toFixed(1) + "%"}
                          </div>
                          <div className="text-white text-xs mt-2">
                            {calculateFilm.isInsufficient
                              ? "needs different parameters"
                              : ""}
                          </div>
                        </div>
                      </div>

                      {/* Export Buttons */}
                      <div className="flex justify-center gap-3 mt-8">
                        <button
                          onClick={generateShareLink}
                          className="px-4 py-2 rounded font-bold transition-all border bg-blue-500 bg-opacity-20 text-blue-300 border-blue-500 border-opacity-50 hover:bg-opacity-30 flex items-center justify-center gap-2 text-sm"
                        >
                          <span>🔗</span>
                          SHARE
                        </button>
                        <button
                          onClick={downloadScreenshot}
                          className="hidden px-4 py-2 rounded font-bold transition-all border bg-green-500 bg-opacity-20 text-green-300 border-green-500 border-opacity-50 hover:bg-opacity-30 flex items-center justify-center gap-2 text-sm"
                        >
                          <span>📸</span>
                          SCREENSHOT
                        </button>
                        <button
                          onClick={downloadPDF}
                          className="hidden px-4 py-2 rounded font-bold transition-all border bg-purple-500 bg-opacity-20 text-purple-300 border-purple-500 border-opacity-50 hover:bg-opacity-30 flex items-center justify-center gap-2 text-sm"
                        >
                          <span>📄</span>
                          PDF
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* COMPARE BUTTON - Digital */}
      {formatType === "digital" &&
        selectedCamera &&
        sensorFormat &&
        (anamorphicRatio || useCustomAnamorphic) &&
        (desiredAspectRatio || useCustomAspectRatio) &&
        comparisonTabs.length === 0 && (
          <div className="max-w-6xl mx-auto px-6 py-8 flex justify-center">
            <button
              onClick={() => setComparisonTabs([...comparisonTabs, {}])}
              className="px-8 py-3 rounded font-bold transition-all border bg-white bg-opacity-10 text-white border-white border-opacity-20 hover:bg-opacity-20 flex items-center justify-center gap-2"
            >
              <span className="text-xl">+</span>
              COMPARE CAMERA
            </button>
          </div>
        )}

      {/* COMPARE BUTTON - Film */}
      {formatType === "film" &&
        selectedFilmFormat &&
        (filmAnamorphicRatio || useCustomFilmAnamorphic) &&
        (filmDesiredAspectRatio || useCustomFilmAspectRatio) &&
        comparisonTabs.length === 0 && (
          <div className="max-w-6xl mx-auto px-6 py-8 flex justify-center">
            <button
              onClick={() => setComparisonTabs([...comparisonTabs, {}])}
              className="px-8 py-3 rounded font-bold transition-all border bg-white bg-opacity-10 text-white border-white border-opacity-20 hover:bg-opacity-20 flex items-center justify-center gap-2"
            >
              <span className="text-xl">+</span>
              COMPARE FORMAT
            </button>
          </div>
        )}

      {/* COMPARISON TABS */}
      {comparisonTabs.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 py-16">
          {comparisonTabs.map((tab, index) => (
            <div
              key={index}
              className="mb-16 pb-16 border-t-2 border-white border-opacity-20 pt-16"
            >
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-white text-2xl md:text-3xl font-bold">
                  {formatType === "digital"
                    ? `CAMERA ${index + 2}`
                    : `FORMAT ${index + 2}`}
                </h2>
                <div className="flex gap-4 items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          const updated = [...comparisonStates];
                          if (formatType === "digital") {
                            // Digital defaults
                            updated[index] = {
                              ...updated[index],
                              lensCircle: "full-frame",
                              camera: "arri-alexa-mini-lf",
                              sensorFormat: "arri-mini-lf-4k5-og-3-2",
                              anamorphicRatio: "1.5",
                              desiredAspectRatio: "2.35",
                            };
                          } else {
                            // Film defaults
                            updated[index] = {
                              ...updated[index],
                              filmFormat: "super-35-4perf",
                              filmAnamorphicRatio: "2",
                              filmDesiredAspectRatio: "2.39",
                            };
                          }
                          setComparisonStates(updated);
                        }
                      }}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span className="text-slate-300 font-bold text-xs">
                      DEFAULTS
                    </span>
                  </label>
                  <button
                    onClick={() =>
                      setComparisonTabs(
                        comparisonTabs.filter((_, i) => i !== index)
                      )
                    }
                    className="px-4 py-2 rounded font-bold transition-all border bg-red-500 bg-opacity-20 text-red-300 border-red-500 border-opacity-50 hover:bg-opacity-30 text-sm"
                  >
                    REMOVE
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <ParametersPanel
                    state={{
                      lensCircle: comparisonStates[index]?.lensCircle || "",
                      bypassLens: comparisonStates[index]?.bypassLens || false,
                      camera: comparisonStates[index]?.camera || "",
                      bypassCamera:
                        comparisonStates[index]?.bypassCamera || false,
                      sensorFormat: comparisonStates[index]?.sensorFormat || "",
                      useCustomPixels:
                        comparisonStates[index]?.useCustomPixels || false,
                      customPixelWidth:
                        comparisonStates[index]?.customPixelWidth || "",
                      customPixelHeight:
                        comparisonStates[index]?.customPixelHeight || "",
                      anamorphicRatio:
                        comparisonStates[index]?.anamorphicRatio || "",
                      useCustomAnamorphic:
                        comparisonStates[index]?.useCustomAnamorphic || false,
                      customAnamorphicRatio:
                        comparisonStates[index]?.customAnamorphicRatio || "",
                      desiredAspectRatio:
                        comparisonStates[index]?.desiredAspectRatio || "",
                      useCustomAspectRatio:
                        comparisonStates[index]?.useCustomAspectRatio || false,
                      customOutputAspectRatio:
                        comparisonStates[index]?.customOutputAspectRatio || "",
                      filmFormat: comparisonStates[index]?.filmFormat || "",
                      filmAnamorphicRatio:
                        comparisonStates[index]?.filmAnamorphicRatio || "",
                      useCustomFilmAnamorphic:
                        comparisonStates[index]?.useCustomFilmAnamorphic ||
                        false,
                      customFilmAnamorphic:
                        comparisonStates[index]?.customFilmAnamorphic || "",
                      filmDesiredAspectRatio:
                        comparisonStates[index]?.filmDesiredAspectRatio || "",
                      useCustomFilmAspectRatio:
                        comparisonStates[index]?.useCustomFilmAspectRatio ||
                        false,
                      customFilmAspectRatio:
                        comparisonStates[index]?.customFilmAspectRatio || "",
                    }}
                    setState={(newState) => {
                      const updated = [...comparisonStates];
                      updated[index] = { ...updated[index], ...newState };
                      setComparisonStates(updated);
                    }}
                    cameras={
                      comparisonStates[index]?.lensCircle
                        ? filteredCameraList
                        : cameraList
                    }
                    sensors={
                      comparisonStates[index]?.camera
                        ? sensorsByCamera[comparisonStates[index].camera] || {}
                        : {}
                    }
                    formatType={formatType}
                    filmFormats={filmFormats}
                  />
                </div>

                <div className="lg:col-span-2">
                  {formatType === "digital" ? (
                    !comparisonStates[index]?.camera ||
                    !comparisonStates[index]?.sensorFormat ||
                    !comparisonStates[index]?.anamorphicRatio ||
                    !comparisonStates[index]?.desiredAspectRatio ? (
                      <div className="bg-white bg-opacity-5 backdrop-blur-lg border border-white border-opacity-10 rounded-lg p-4 lg:p-8 text-center">
                        <p className="text-white text-lg opacity-60">
                          Select all parameters to view results
                        </p>
                      </div>
                    ) : calculateComparisonDigital(
                        comparisonStates[index],
                        index
                      ) ? (
                      <div className="space-y-8">
                        {/* Desqueezed Output Visualization */}
                        <div className="bg-white bg-opacity-5 backdrop-blur-lg border border-white border-opacity-10 rounded-lg p-8">
                          <h3 className="text-white text-lg font-bold mb-6 tracking-wider">
                            DESQUEEZED OUTPUT
                          </h3>

                          <div className="flex justify-center items-center mb-8">
                            <div
                              style={{
                                position: "relative",
                                width: "100%",
                                maxWidth: "500px",
                              }}
                            >
                              <div
                                className="bg-gray-900 border-2 border-blue-400 relative"
                                style={{
                                  aspectRatio:
                                    calculateComparisonDigital(
                                      comparisonStates[index],
                                      index
                                    ).naturalAspectRatio || 2.0,
                                  position: "relative",
                                  zIndex: 1,
                                }}
                              >
                                <div
                                  className="absolute border-2 border-green-400"
                                  style={{
                                    left: `${Math.max(
                                      0,
                                      Math.min(
                                        100,
                                        ((calculateComparisonDigital(
                                          comparisonStates[index],
                                          index
                                        ).usedPixelWidth -
                                          calculateComparisonDigital(
                                            comparisonStates[index],
                                            index
                                          ).croppedPixelWidth) /
                                          calculateComparisonDigital(
                                            comparisonStates[index],
                                            index
                                          ).usedPixelWidth /
                                          2) *
                                          100
                                      )
                                    )}%`,
                                    top: `${Math.max(
                                      0,
                                      Math.min(
                                        100,
                                        ((calculateComparisonDigital(
                                          comparisonStates[index],
                                          index
                                        ).usedPixelHeight -
                                          calculateComparisonDigital(
                                            comparisonStates[index],
                                            index
                                          ).croppedPixelHeight) /
                                          calculateComparisonDigital(
                                            comparisonStates[index],
                                            index
                                          ).usedPixelHeight /
                                          2) *
                                          100
                                      )
                                    )}%`,
                                    width: `${Math.max(
                                      0,
                                      Math.min(
                                        100,
                                        (calculateComparisonDigital(
                                          comparisonStates[index],
                                          index
                                        ).croppedPixelWidth /
                                          calculateComparisonDigital(
                                            comparisonStates[index],
                                            index
                                          ).usedPixelWidth) *
                                          100
                                      )
                                    )}%`,
                                    height: `${Math.max(
                                      0,
                                      Math.min(
                                        100,
                                        (calculateComparisonDigital(
                                          comparisonStates[index],
                                          index
                                        ).croppedPixelHeight /
                                          calculateComparisonDigital(
                                            comparisonStates[index],
                                            index
                                          ).usedPixelHeight) *
                                          100
                                      )
                                    )}%`,
                                    boxSizing: "border-box",
                                  }}
                                />

                                {calculateComparisonDigital(
                                  comparisonStates[index],
                                  index
                                ).croppedPixelHeight <
                                  calculateComparisonDigital(
                                    comparisonStates[index],
                                    index
                                  ).usedPixelHeight && (
                                  <>
                                    <div
                                      className="absolute bg-black bg-opacity-40"
                                      style={{
                                        left: "0",
                                        top: "0",
                                        width: "100%",
                                        height: `${
                                          ((calculateComparisonDigital(
                                            comparisonStates[index],
                                            index
                                          ).usedPixelHeight -
                                            calculateComparisonDigital(
                                              comparisonStates[index],
                                              index
                                            ).croppedPixelHeight) /
                                            calculateComparisonDigital(
                                              comparisonStates[index],
                                              index
                                            ).usedPixelHeight /
                                            2) *
                                          100
                                        }%`,
                                        boxSizing: "border-box",
                                      }}
                                    />
                                    <div
                                      className="absolute bg-black bg-opacity-40"
                                      style={{
                                        left: "0",
                                        bottom: "0",
                                        width: "100%",
                                        height: `${
                                          ((calculateComparisonDigital(
                                            comparisonStates[index],
                                            index
                                          ).usedPixelHeight -
                                            calculateComparisonDigital(
                                              comparisonStates[index],
                                              index
                                            ).croppedPixelHeight) /
                                            calculateComparisonDigital(
                                              comparisonStates[index],
                                              index
                                            ).usedPixelHeight /
                                            2) *
                                          100
                                        }%`,
                                        boxSizing: "border-box",
                                      }}
                                    />
                                  </>
                                )}

                                {calculateComparisonDigital(
                                  comparisonStates[index],
                                  index
                                ).croppedPixelWidth <
                                  calculateComparisonDigital(
                                    comparisonStates[index],
                                    index
                                  ).usedPixelWidth && (
                                  <>
                                    <div
                                      className="absolute bg-black bg-opacity-40"
                                      style={{
                                        left: "0",
                                        top: "0",
                                        width: `${
                                          ((calculateComparisonDigital(
                                            comparisonStates[index],
                                            index
                                          ).usedPixelWidth -
                                            calculateComparisonDigital(
                                              comparisonStates[index],
                                              index
                                            ).croppedPixelWidth) /
                                            calculateComparisonDigital(
                                              comparisonStates[index],
                                              index
                                            ).usedPixelWidth /
                                            2) *
                                          100
                                        }%`,
                                        height: "100%",
                                        boxSizing: "border-box",
                                      }}
                                    />
                                    <div
                                      className="absolute bg-black bg-opacity-40"
                                      style={{
                                        right: "0",
                                        top: "0",
                                        width: `${
                                          ((calculateComparisonDigital(
                                            comparisonStates[index],
                                            index
                                          ).usedPixelWidth -
                                            calculateComparisonDigital(
                                              comparisonStates[index],
                                              index
                                            ).croppedPixelWidth) /
                                            calculateComparisonDigital(
                                              comparisonStates[index],
                                              index
                                            ).usedPixelWidth /
                                            2) *
                                          100
                                        }%`,
                                        height: "100%",
                                        boxSizing: "border-box",
                                      }}
                                    />
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Stats Grid */}
                          <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-blue-500 bg-opacity-40 rounded border p-2 lg:p-6">
                              <div className="text-gray-300 text-xs lg:text-sm font-semibold lg:font-bold mb-2">
                                UNSQUEEZED ASPECT
                              </div>
                              <div className="text-lg lg:text-4xl font-bold lg:font-black text-white">
                                {
                                  calculateComparisonDigital(
                                    comparisonStates[index],
                                    index
                                  ).naturalAspectRatio
                                }
                                :1
                              </div>
                            </div>
                            <div className="bg-purple-500 bg-opacity-40 rounded border p-2 lg:p-6">
                              <div className="text-gray-300 text-xs lg:text-sm font-semibold lg:font-bold mb-2">
                                DESIRED OUTPUT
                              </div>
                              <div className="text-lg lg:text-4xl font-bold lg:font-black text-white">
                                {comparisonStates[index]?.desiredAspectRatio ||
                                  desiredAspectRatio}
                                :1
                              </div>
                            </div>
                            <div
                              className={`rounded border p-2 lg:p-6 ${
                                parseFloat(
                                  calculateComparisonDigital(
                                    comparisonStates[index],
                                    index
                                  ).cropPercentage
                                ) > 0
                                  ? "bg-red-500 bg-opacity-40"
                                  : "bg-green-500 bg-opacity-40"
                              }`}
                            >
                              <div className="text-gray-300 text-xs lg:text-sm font-semibold lg:font-bold mb-2">
                                CROP NEEDED
                              </div>
                              <div className="text-lg lg:text-4xl font-bold lg:font-black text-white">
                                {Math.round(
                                  calculateComparisonDigital(
                                    comparisonStates[index],
                                    index
                                  ).usedPixelWidth -
                                    calculateComparisonDigital(
                                      comparisonStates[index],
                                      index
                                    ).croppedPixelWidth +
                                    (calculateComparisonDigital(
                                      comparisonStates[index],
                                      index
                                    ).usedPixelHeight -
                                      calculateComparisonDigital(
                                        comparisonStates[index],
                                        index
                                      ).croppedPixelHeight)
                                )}
                              </div>
                              <div className="text-white text-xs mt-2">
                                pixels
                              </div>
                            </div>
                            <div className="bg-yellow-500 bg-opacity-40 rounded border p-2 lg:p-6">
                              <div className="text-gray-300 text-xs lg:text-sm font-semibold lg:font-bold mb-2">
                                OUTPUT UTILIZATION
                              </div>
                              <div className="text-lg lg:text-4xl font-bold lg:font-black text-gray-900">
                                {
                                  calculateComparisonDigital(
                                    comparisonStates[index],
                                    index
                                  ).coverage
                                }
                                %
                              </div>
                            </div>
                          </div>

                          {/* Crop Pixel Boxes */}
                          <div className="grid grid-cols-4 gap-4">
                            <div className="bg-blue-500 bg-opacity-40 rounded border p-2 lg:p-6">
                              <div className="text-gray-300 text-xs lg:text-sm font-semibold lg:font-bold mb-2">
                                CROP TOP
                              </div>
                              <div className="text-lg lg:text-4xl font-bold lg:font-black text-gray-900">
                                {calculateComparisonDigital(
                                  comparisonStates[index],
                                  index
                                ).croppedPixelHeight <
                                calculateComparisonDigital(
                                  comparisonStates[index],
                                  index
                                ).usedPixelHeight
                                  ? Math.round(
                                      (calculateComparisonDigital(
                                        comparisonStates[index],
                                        index
                                      ).usedPixelHeight -
                                        calculateComparisonDigital(
                                          comparisonStates[index],
                                          index
                                        ).croppedPixelHeight) /
                                        2
                                    )
                                  : 0}
                              </div>
                              <div className="text-gray-900 text-xs mt-2">
                                pixels
                              </div>
                            </div>
                            <div className="bg-blue-500 bg-opacity-40 rounded border p-2 lg:p-6">
                              <div className="text-gray-300 text-xs lg:text-sm font-semibold lg:font-bold mb-2">
                                CROP BOTTOM
                              </div>
                              <div className="text-lg lg:text-4xl font-bold lg:font-black text-gray-900">
                                {calculateComparisonDigital(
                                  comparisonStates[index],
                                  index
                                ).croppedPixelHeight <
                                calculateComparisonDigital(
                                  comparisonStates[index],
                                  index
                                ).usedPixelHeight
                                  ? Math.round(
                                      (calculateComparisonDigital(
                                        comparisonStates[index],
                                        index
                                      ).usedPixelHeight -
                                        calculateComparisonDigital(
                                          comparisonStates[index],
                                          index
                                        ).croppedPixelHeight) /
                                        2
                                    )
                                  : 0}
                              </div>
                              <div className="text-gray-900 text-xs mt-2">
                                pixels
                              </div>
                            </div>
                            <div className="bg-green-500 bg-opacity-40 rounded border p-2 lg:p-6">
                              <div className="text-gray-300 text-xs lg:text-sm font-semibold lg:font-bold mb-2">
                                CROP LEFT
                              </div>
                              <div className="text-lg lg:text-4xl font-bold lg:font-black text-white">
                                {calculateComparisonDigital(
                                  comparisonStates[index],
                                  index
                                ).croppedPixelWidth <
                                calculateComparisonDigital(
                                  comparisonStates[index],
                                  index
                                ).usedPixelWidth
                                  ? Math.round(
                                      (calculateComparisonDigital(
                                        comparisonStates[index],
                                        index
                                      ).usedPixelWidth -
                                        calculateComparisonDigital(
                                          comparisonStates[index],
                                          index
                                        ).croppedPixelWidth) /
                                        2
                                    )
                                  : 0}
                              </div>
                              <div className="text-white text-xs mt-2">
                                pixels
                              </div>
                            </div>
                            <div className="bg-green-500 bg-opacity-40 rounded border p-2 lg:p-6">
                              <div className="text-gray-300 text-xs lg:text-sm font-semibold lg:font-bold mb-2">
                                CROP RIGHT
                              </div>
                              <div className="text-lg lg:text-4xl font-bold lg:font-black text-white">
                                {calculateComparisonDigital(
                                  comparisonStates[index],
                                  index
                                ).croppedPixelWidth <
                                calculateComparisonDigital(
                                  comparisonStates[index],
                                  index
                                ).usedPixelWidth
                                  ? Math.round(
                                      (calculateComparisonDigital(
                                        comparisonStates[index],
                                        index
                                      ).usedPixelWidth -
                                        calculateComparisonDigital(
                                          comparisonStates[index],
                                          index
                                        ).croppedPixelWidth) /
                                        2
                                    )
                                  : 0}
                              </div>
                              <div className="text-white text-xs mt-2">
                                pixels
                              </div>
                            </div>
                          </div>

                          {/* Export Buttons */}
                          <div className="flex justify-center gap-3 mt-8">
                            <button
                              onClick={generateShareLink}
                              className="px-4 py-2 rounded font-bold transition-all border bg-blue-500 bg-opacity-20 text-blue-300 border-blue-500 border-opacity-50 hover:bg-opacity-30 flex items-center justify-center gap-2 text-sm"
                            >
                              <span>🔗</span>
                              SHARE
                            </button>
                            <button
                              onClick={downloadScreenshot}
                              className="hidden px-4 py-2 rounded font-bold transition-all border bg-green-500 bg-opacity-20 text-green-300 border-green-500 border-opacity-50 hover:bg-opacity-30 flex items-center justify-center gap-2 text-sm"
                            >
                              <span>📸</span>
                              SCREENSHOT
                            </button>
                            <button
                              onClick={downloadPDF}
                              className="hidden px-4 py-2 rounded font-bold transition-all border bg-purple-500 bg-opacity-20 text-purple-300 border-purple-500 border-opacity-50 hover:bg-opacity-30 flex items-center justify-center gap-2 text-sm"
                            >
                              <span>📄</span>
                              PDF
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : null
                  ) : !comparisonStates[index]?.filmFormat ||
                    !comparisonStates[index]?.filmAnamorphicRatio ||
                    !comparisonStates[index]?.filmDesiredAspectRatio ? (
                    <div className="bg-white bg-opacity-5 backdrop-blur-lg border border-white border-opacity-10 rounded-lg p-4 lg:p-8 text-center">
                      <p className="text-white text-lg opacity-60">
                        Select all parameters to view results
                      </p>
                    </div>
                  ) : calculateComparisonFilm(
                      comparisonStates[index],
                      index
                    ) ? (
                    <div className="bg-white bg-opacity-5 backdrop-blur-lg border border-white border-opacity-10 rounded-lg p-8">
                      <h3 className="text-white text-lg font-bold mb-4">
                        FORMAT {index + 2}
                      </h3>

                      {/* Compact Film Calculations */}
                      <div className="grid grid-cols-3 gap-2 mb-6">
                        <div className="bg-white bg-opacity-5 p-2 rounded border border-white border-opacity-10">
                          <p className="text-slate-300 text-xs font-bold mb-1">
                            NEGATIVE DIMENSIONS
                          </p>
                          <p className="text-white font-mono text-xs">
                            {
                              calculateComparisonFilm(
                                comparisonStates[index],
                                index
                              ).negativeWidth
                            }
                            ×
                            {
                              calculateComparisonFilm(
                                comparisonStates[index],
                                index
                              ).negativeHeight
                            }
                            mm
                          </p>
                        </div>
                        <div className="bg-white bg-opacity-5 p-2 rounded border border-white border-opacity-10">
                          <p className="text-slate-300 text-xs font-bold mb-1">
                            SQUEEZE
                          </p>
                          <p className="text-white font-mono text-xs">
                            {
                              calculateComparisonFilm(
                                comparisonStates[index],
                                index
                              ).squeeze
                            }
                            x
                          </p>
                        </div>
                        <div className="bg-white bg-opacity-5 p-2 rounded border border-white border-opacity-10">
                          <p className="text-slate-300 text-xs font-bold mb-1">
                            NEGATIVE ASPECT
                          </p>
                          <p className="text-white font-mono text-xs">
                            {
                              calculateComparisonFilm(
                                comparisonStates[index],
                                index
                              ).negativeAspect
                            }
                            :1
                          </p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {/* Flow Graphic and Output Container */}
                        <div className="flex flex-col lg:flex-row gap-3 lg:gap-8 items-stretch">
                          {/* Vertical Squeeze Flow Graphic - Far Left */}
                          <div className="hidden lg:flex flex-col items-center justify-between gap-1">
                            {/* Film Negative */}
                            <div className="flex flex-col items-center">
                              <p className="text-slate-300 text-xs font-bold mb-1">
                                Negative
                              </p>
                              <div
                                className="border-2 border-amber-400 bg-gray-900"
                                style={{
                                  width: "80px",
                                  height: `${
                                    (calculateComparisonFilm(
                                      comparisonStates[index],
                                      index
                                    ).negativeHeight /
                                      calculateComparisonFilm(
                                        comparisonStates[index],
                                        index
                                      ).negativeWidth) *
                                    80
                                  }px`,
                                }}
                              />
                              <p className="text-slate-400 text-xs font-mono mt-1">
                                {
                                  calculateComparisonFilm(
                                    comparisonStates[index],
                                    index
                                  ).negativeWidth
                                }
                                ×
                                {
                                  calculateComparisonFilm(
                                    comparisonStates[index],
                                    index
                                  ).negativeHeight
                                }
                                mm
                              </p>
                            </div>

                            {/* Arrow and Squeeze Factor */}
                            <div className="flex flex-col items-center gap-0 flex-shrink-0">
                              <div className="h-6 w-1 bg-gradient-to-b from-amber-400 to-emerald-400"></div>
                              <p className="text-emerald-400 font-bold text-xs">
                                {
                                  calculateComparisonFilm(
                                    comparisonStates[index],
                                    index
                                  ).squeeze
                                }
                                x
                              </p>
                              <div className="w-1.5 h-1.5 border-b border-r border-emerald-400 transform rotate-45"></div>
                            </div>

                            {/* Unsqueezed Image */}
                            <div className="flex flex-col items-center">
                              <p className="text-slate-300 text-xs font-bold mb-1">
                                Unsqueezed
                              </p>
                              <div
                                className="border-2 border-emerald-400 bg-gray-900"
                                style={{
                                  width: "160px",
                                  height: `${
                                    (1 /
                                      calculateComparisonFilm(
                                        comparisonStates[index],
                                        index
                                      ).unSqueezeAspect) *
                                    160
                                  }px`,
                                }}
                              />
                              <p className="text-slate-400 text-xs font-mono mt-1">
                                {
                                  calculateComparisonFilm(
                                    comparisonStates[index],
                                    index
                                  ).unSqueezeAspect
                                }
                                :1
                              </p>
                            </div>
                          </div>

                          {/* Large Unsqueezed Image - Right Side */}
                          <div className="flex flex-col items-center flex-1 order-last lg:order-none">
                            <p className="text-slate-300 text-sm font-bold mb-4">
                              YOUR OUTPUT (with desired crop)
                            </p>
                            <div
                              className="border-2 border-emerald-400 bg-gray-900 relative w-full"
                              style={{
                                maxWidth: "600px",
                                aspectRatio: `${
                                  calculateComparisonFilm(
                                    comparisonStates[index],
                                    index
                                  ).unSqueezeAspect
                                } / 1`,
                              }}
                            >
                              {calculateComparisonFilm(
                                comparisonStates[index],
                                index
                              ).desiredAspect !==
                                calculateComparisonFilm(
                                  comparisonStates[index],
                                  index
                                ).unSqueezeAspect && (
                                <div
                                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-cyan-400 border-dashed"
                                  style={{
                                    width: calculateComparisonFilm(
                                      comparisonStates[index],
                                      index
                                    ).isInsufficient
                                      ? "100%"
                                      : `${
                                          calculateComparisonFilm(
                                            comparisonStates[index],
                                            index
                                          ).cropPercentageOfUnsqueezed
                                        }%`,
                                    height: calculateComparisonFilm(
                                      comparisonStates[index],
                                      index
                                    ).isInsufficient
                                      ? `${
                                          calculateComparisonFilm(
                                            comparisonStates[index],
                                            index
                                          ).cropPercentageOfUnsqueezed
                                        }%`
                                      : "100%",
                                  }}
                                />
                              )}
                              {calculateComparisonFilm(
                                comparisonStates[index],
                                index
                              ).desiredAspect !==
                                calculateComparisonFilm(
                                  comparisonStates[index],
                                  index
                                ).unSqueezeAspect &&
                                !calculateComparisonFilm(
                                  comparisonStates[index],
                                  index
                                ).isInsufficient && (
                                  <>
                                    <div
                                      className="absolute top-0 bottom-0 left-0 bg-black bg-opacity-60"
                                      style={{
                                        width: `${
                                          ((1 -
                                            calculateComparisonFilm(
                                              comparisonStates[index],
                                              index
                                            ).cropPercentageOfUnsqueezed /
                                              100) /
                                            2) *
                                          100
                                        }%`,
                                      }}
                                    />
                                    <div
                                      className="absolute top-0 bottom-0 right-0 bg-black bg-opacity-60"
                                      style={{
                                        width: `${
                                          ((1 -
                                            calculateComparisonFilm(
                                              comparisonStates[index],
                                              index
                                            ).cropPercentageOfUnsqueezed /
                                              100) /
                                            2) *
                                          100
                                        }%`,
                                      }}
                                    />
                                  </>
                                )}
                              {calculateComparisonFilm(
                                comparisonStates[index],
                                index
                              ).desiredAspect !==
                                calculateComparisonFilm(
                                  comparisonStates[index],
                                  index
                                ).unSqueezeAspect &&
                                calculateComparisonFilm(
                                  comparisonStates[index],
                                  index
                                ).isInsufficient && (
                                  <>
                                    <div
                                      className="absolute top-0 left-0 right-0 bg-black bg-opacity-60"
                                      style={{
                                        height: `${
                                          ((1 -
                                            calculateComparisonFilm(
                                              comparisonStates[index],
                                              index
                                            ).cropPercentageOfUnsqueezed /
                                              100) /
                                            2) *
                                          100
                                        }%`,
                                      }}
                                    />
                                    <div
                                      className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60"
                                      style={{
                                        height: `${
                                          ((1 -
                                            calculateComparisonFilm(
                                              comparisonStates[index],
                                              index
                                            ).cropPercentageOfUnsqueezed /
                                              100) /
                                            2) *
                                          100
                                        }%`,
                                      }}
                                    />
                                  </>
                                )}
                            </div>
                            <p className="text-slate-400 text-xs font-mono mt-3">
                              {
                                calculateComparisonFilm(
                                  comparisonStates[index],
                                  index
                                ).unSqueezeAspect
                              }
                              :1 | Coverage:{" "}
                              {
                                calculateComparisonFilm(
                                  comparisonStates[index],
                                  index
                                ).cropPercentageOfUnsqueezed
                              }
                              % | Desired:{" "}
                              {
                                calculateComparisonFilm(
                                  comparisonStates[index],
                                  index
                                ).desiredAspect
                              }
                              :1
                            </p>
                          </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4 mt-4">
                          <div className="bg-blue-500 bg-opacity-40 rounded border p-2 lg:p-6">
                            <div className="text-gray-300 text-xs lg:text-sm font-semibold lg:font-bold mb-2">
                              UNSQUEEZED ASPECT
                            </div>
                            <div className="text-lg lg:text-4xl font-bold lg:font-black text-white">
                              {
                                calculateComparisonFilm(
                                  comparisonStates[index],
                                  index
                                ).unSqueezeAspect
                              }
                              :1
                            </div>
                          </div>
                          <div className="bg-purple-500 bg-opacity-40 rounded border p-2 lg:p-6">
                            <div className="text-gray-300 text-xs lg:text-sm font-semibold lg:font-bold mb-2">
                              DESIRED ASPECT
                            </div>
                            <div className="text-lg lg:text-4xl font-bold lg:font-black text-white">
                              {
                                calculateComparisonFilm(
                                  comparisonStates[index],
                                  index
                                ).desiredAspect
                              }
                              :1
                            </div>
                          </div>
                          <div className="bg-red-500 bg-opacity-40 rounded border p-2 lg:p-6">
                            <div className="text-gray-300 text-xs lg:text-sm font-semibold lg:font-bold mb-2">
                              CROP NEEDED
                            </div>
                            <div className="text-lg lg:text-4xl font-bold lg:font-black text-white">
                              {calculateComparisonFilm(
                                comparisonStates[index],
                                index
                              ).isInsufficient
                                ? "N/A"
                                : (
                                    100 -
                                    calculateComparisonFilm(
                                      comparisonStates[index],
                                      index
                                    ).cropPercentageOfUnsqueezed
                                  ).toFixed(1) + "%"}
                            </div>
                            <div className="text-white text-xs mt-2">
                              {calculateComparisonFilm(
                                comparisonStates[index],
                                index
                              ).isInsufficient
                                ? ""
                                : "of unsqueezed"}
                            </div>
                          </div>
                          <div
                            className={`rounded border p-2 lg:p-6 ${
                              calculateComparisonFilm(
                                comparisonStates[index],
                                index
                              ).isInsufficient
                                ? "bg-red-500 bg-opacity-40"
                                : "bg-green-500 bg-opacity-40"
                            }`}
                          >
                            <div className="text-gray-300 text-xs lg:text-sm font-semibold lg:font-bold mb-2">
                              {calculateComparisonFilm(
                                comparisonStates[index],
                                index
                              ).isInsufficient
                                ? "INSUFFICIENT"
                                : "IMAGE SIZE"}
                            </div>
                            <div className="text-lg lg:text-4xl font-bold lg:font-black text-white">
                              {calculateComparisonFilm(
                                comparisonStates[index],
                                index
                              ).isInsufficient
                                ? "✗"
                                : (
                                    100 +
                                    (100 -
                                      calculateComparisonFilm(
                                        comparisonStates[index],
                                        index
                                      ).cropPercentageOfUnsqueezed)
                                  ).toFixed(1) + "%"}
                            </div>
                            <div className="text-white text-xs mt-2">
                              {calculateComparisonFilm(
                                comparisonStates[index],
                                index
                              ).isInsufficient
                                ? "needs different parameters"
                                : ""}
                            </div>
                          </div>
                        </div>

                        {/* Export Buttons */}
                        <div className="flex justify-center gap-3 mt-8">
                          <button
                            onClick={generateShareLink}
                            className="px-4 py-2 rounded font-bold transition-all border bg-blue-500 bg-opacity-20 text-blue-300 border-blue-500 border-opacity-50 hover:bg-opacity-30 flex items-center justify-center gap-2 text-sm"
                          >
                            <span>🔗</span>
                            SHARE
                          </button>
                          <button
                            onClick={downloadScreenshot}
                            className="hidden px-4 py-2 rounded font-bold transition-all border bg-green-500 bg-opacity-20 text-green-300 border-green-500 border-opacity-50 hover:bg-opacity-30 flex items-center justify-center gap-2 text-sm"
                          >
                            <span>📸</span>
                            SCREENSHOT
                          </button>
                          <button
                            onClick={downloadPDF}
                            className="hidden px-4 py-2 rounded font-bold transition-all border bg-purple-500 bg-opacity-20 text-purple-300 border-purple-500 border-opacity-50 hover:bg-opacity-30 flex items-center justify-center gap-2 text-sm"
                          >
                            <span>📄</span>
                            PDF
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ))}

          {/* ADD BUTTON - only at bottom of last comparison if less than 3 */}
          {comparisonTabs.length < 1 && (
            <div className="flex justify-center pt-12">
              <button
                onClick={() => setComparisonTabs([...comparisonTabs, {}])}
                className="px-8 py-3 rounded font-bold transition-all border bg-white bg-opacity-10 text-white border-white border-opacity-20 hover:bg-opacity-20 flex items-center justify-center gap-2"
              >
                <span className="text-xl">+</span>
                {formatType === "digital" ? "ADD CAMERA" : "ADD FORMAT"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
