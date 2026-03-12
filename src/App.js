import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';

export default function AnamorphicCalculator() {
  // Format type selector
  const [formatType, setFormatType] = useState('digital'); // 'digital' or 'film'

  // DIGITAL STATE
  const [selectedCamera, setSelectedCamera] = useState('');
  const [lensImageCircle, setLensImageCircle] = useState('');
  const [bypassLensCircle, setBypassLensCircle] = useState(false);
  const [bypassCameraSelection, setBypassCameraSelection] = useState(false);
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

  // FILM STATE
  const [selectedFilmFormat, setSelectedFilmFormat] = useState('');
  const [filmAnamorphicRatio, setFilmAnamorphicRatio] = useState('');
  const [filmDesiredAspectRatio, setFilmDesiredAspectRatio] = useState('');
  const [useCustomFilmAnamorphic, setUseCustomFilmAnamorphic] = useState(false);
  const [customFilmAnamorphic, setCustomFilmAnamorphic] = useState('');
  const [useCustomFilmAspectRatio, setUseCustomFilmAspectRatio] = useState(false);
  const [customFilmAspectRatio, setCustomFilmAspectRatio] = useState('');

  // Comparison state
  const [comparisonTabsDigital, setComparisonTabsDigital] = useState([]);
  const [comparisonStatesDigital, setComparisonStatesDigital] = useState([{}, {}, {}]);
  const [comparisonTabsFilm, setComparisonTabsFilm] = useState([]);
  const [comparisonStatesFilm, setComparisonStatesFilm] = useState([{}, {}, {}]);
  
  // UI State
  const [showDefaults, setShowDefaults] = useState(false);
  
  // Use format-specific comparison state
  const comparisonTabs = formatType === 'digital' ? comparisonTabsDigital : comparisonTabsFilm;
  const setComparisonTabs = formatType === 'digital' ? setComparisonTabsDigital : setComparisonTabsFilm;
  const comparisonStates = formatType === 'digital' ? comparisonStatesDigital : comparisonStatesFilm;
  const setComparisonStates = formatType === 'digital' ? setComparisonStatesDigital : setComparisonStatesFilm;

  // Custom value sync is handled inside ParametersPanel via debounced useEffect

  // Load parameters from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const format = params.get('format');
    
    if (format === 'digital') {
      setFormatType('digital');
      const camera = params.get('camera');
      const sensorFormat = params.get('sensorFormat');
      const anamorphic = params.get('anamorphic');
      const aspect = params.get('aspect');
      
      if (camera) setSelectedCamera(camera);
      if (sensorFormat) setSensorFormat(sensorFormat);
      if (anamorphic) setAnamorphicRatio(anamorphic);
      if (aspect) setDesiredAspectRatio(aspect);
    } else if (format === 'film') {
      setFormatType('film');
      const filmFormat = params.get('filmFormat');
      const anamorphic = params.get('anamorphic');
      const aspect = params.get('aspect');
      
      if (filmFormat) setSelectedFilmFormat(filmFormat);
      if (anamorphic) setFilmAnamorphicRatio(anamorphic);
      if (aspect) setFilmDesiredAspectRatio(aspect);
    }
  }, []); // Run only once on mount

  // Auto-uncheck defaults when any default variable changes
  useEffect(() => {
    if (showDefaults) {
      // Check if current state differs from digital defaults
      if (formatType === 'digital') {
        const isDefaultDigital = 
          lensImageCircle === 'full-frame' &&
          selectedCamera === 'sony-venice' &&
          sensorFormat === 'sony-venice-6k-3-2' &&
          anamorphicRatio === '1.5' &&
          desiredAspectRatio === '2.39' &&
          !useCustomAnamorphic &&
          !useCustomAspectRatio;
        
        if (!isDefaultDigital) {
          setShowDefaults(false);
        }
      } else {
        // Check if current state differs from film defaults
        const isDefaultFilm = 
          selectedFilmFormat === 'super-35-4perf' &&
          filmAnamorphicRatio === '2' &&
          filmDesiredAspectRatio === '2.39' &&
          !useCustomFilmAnamorphic &&
          !useCustomFilmAspectRatio;
        
        if (!isDefaultFilm) {
          setShowDefaults(false);
        }
      }
    }
  }, [formatType, lensImageCircle, selectedCamera, sensorFormat, anamorphicRatio, desiredAspectRatio, useCustomAnamorphic, useCustomAspectRatio, selectedFilmFormat, filmAnamorphicRatio, filmDesiredAspectRatio, useCustomFilmAnamorphic, useCustomFilmAspectRatio, showDefaults]);

  // ============================================
  // DATA STRUCTURES
  // ============================================

  const cameraList = [
    { id: 'arri-alexa-35', name: 'ARRI Alexa 35', lensCircles: ['super-35'], format: 'digital' },
    { id: 'arri-alexa-mini', name: 'ARRI Alexa Mini', lensCircles: ['super-16'], isCrop: { 'super-16': true }, format: 'digital' },
    { id: 'arri-alexa-mini-lf', name: 'ARRI Alexa Mini LF', lensCircles: ['full-frame', 'super-35'], isCrop: { 'super-35': true }, format: 'digital' },
    { id: 'arri-265', name: 'ARRI Alexa 265', lensCircles: ['65mm', 'full-frame'], isCrop: { 'full-frame': true }, format: 'digital' },
    { id: 'sony-burano', name: 'Sony Burano', lensCircles: ['full-frame', 'super-35'], isCrop: { 'super-35': true }, format: 'digital' },
    { id: 'sony-fx3', name: 'Sony FX3', lensCircles: ['full-frame'], format: 'digital' },
    { id: 'sony-fx6', name: 'Sony FX6', lensCircles: ['full-frame'], format: 'digital' },
    { id: 'sony-fx9', name: 'Sony FX9', lensCircles: ['full-frame'], format: 'digital' },
    { id: 'sony-venice', name: 'Sony Venice', lensCircles: ['full-frame', 'super-35'], isCrop: { 'super-35': true }, format: 'digital' },
    { id: 'sony-venice-2', name: 'Sony Venice 2', lensCircles: ['full-frame', 'super-35'], isCrop: { 'super-35': true }, format: 'digital' },
    { id: 'red-komodo-x', name: 'RED Komodo-X', lensCircles: ['super-35'], format: 'digital' },
    { id: 'red-gemini', name: 'RED Gemini 5K', lensCircles: ['super-35'], format: 'digital' },
    { id: 'red-monstro', name: 'RED Monstro 8K', lensCircles: ['full-frame', 'super-35'], isCrop: { 'super-35': true }, format: 'digital' },
    { id: 'fujifilm-eterna', name: 'Fujifilm GFX ETERNA', lensCircles: ['65mm', 'full-frame', 'super-35'], isCrop: { 'full-frame': true, 'super-35': true }, format: 'digital' },
    { id: 'fujifilm-gfx', name: 'Fujifilm GFX 100', lensCircles: ['65mm', 'full-frame', 'super-35'], isCrop: { 'super-35': true }, format: 'digital' },
  ];

  const filmFormats = [
    { id: 'super-16mm', name: 'Super 16mm (12.52×7.41mm)', negativeWidth: 12.52, negativeHeight: 7.41, squeeze: 2.0, projectedAspectRatio: 2.39 },
    { id: 'super-35-2perf', name: 'Super 35mm 2-perf (24.9×9.35mm)', negativeWidth: 24.9, negativeHeight: 9.35, squeeze: 2.0, projectedAspectRatio: 2.39 },
    { id: 'super-35-3perf', name: 'Super 35mm 3-perf (24.9×13.9mm)', negativeWidth: 24.9, negativeHeight: 13.9, squeeze: 2.0, projectedAspectRatio: 2.39 },
    { id: 'super-35-4perf', name: 'Super 35mm 4-perf (24.9×18.7mm)', negativeWidth: 24.9, negativeHeight: 18.7, squeeze: 2.0, projectedAspectRatio: 2.39 },
    { id: '65mm', name: '65mm (52.63×23.01mm)', negativeWidth: 52.63, negativeHeight: 23.01, squeeze: 1.25, projectedAspectRatio: 2.76 },
  ];

  const anamorphicOptions = [
    { value: '1.3', label: '1.3x' },
    { value: '1.5', label: '1.5x' },
    { value: '1.6', label: '1.6x' },
    { value: '1.8', label: '1.8x' },
    { value: '2', label: '2.0x' },
  ];

  const filmAnamorphicOptions = [
    { value: '1.25', label: '1.25x' },
    { value: '1.3', label: '1.3x' },
    { value: '1.5', label: '1.5x' },
    { value: '2', label: '2.0x' },
  ];

  const aspectRatioOptions = [
    { value: '1.37', label: '1.37:1', divisor: '(4:3)' },
    { value: '1.78', label: '1.78:1', divisor: '(16:9)' },
    { value: '1.85', label: '1.85:1', divisor: '(US)' },
    { value: '1.9', label: '1.9:1', divisor: '(17:9)' },
    { value: '2.0', label: '2.0:1', divisor: '(2:1)' },
    { value: '2.35', label: '2.35:1', divisor: '(Vintage)' },
    { value: '2.39', label: '2.39:1', divisor: '(Modern)' },
    { value: '2.76', label: '2.76:1', divisor: '(Ultra)' },
  ];

  const sensorImageCircle = {
    'sony-venice-2-8k': 'full-frame',
    'sony-venice-2-8k-17-9': 'full-frame',
    'sony-venice-2-8k2-17-9': 'full-frame',
    'sony-venice-2-8k1-16-9': 'full-frame',
    'sony-venice-2-7k-16-9': 'full-frame',
    'sony-venice-2-8k2-239': 'full-frame',
    'sony-venice-2-5k8-6-5': 'super-35',
    'sony-venice-2-5k8-4-3': 'super-35',
    'sony-venice-2-5k8-17-9': 'super-35',
    'sony-venice-2-5k4-16-9': 'super-35',
    'sony-venice-2-5k5-239': 'super-35',
    'sony-venice-6k-3-2': 'full-frame',
    'sony-venice-6k-185': 'full-frame',
    'sony-venice-6k-17-9': 'full-frame',
    'sony-venice-6k-239': 'full-frame',
    'sony-venice-5k7-16-9': 'full-frame',
    'sony-venice-4k-6-5': 'super-35',
    'sony-venice-4k-4-3': 'super-35',
    'sony-venice-4k-17-9': 'super-35',
    'sony-venice-4k-239': 'super-35',
    'sony-venice-3k8-16-9': 'super-35',
    'arri-alexa-35-4k6-og': 'super-35',
    'arri-alexa-35-4k6-16-9': 'super-35',
    'arri-alexa-35-4k-16-9': 'super-35',
    'arri-alexa-35-4k-2-1': 'super-35',
    'arri-alexa-35-3k3-6-5': 'super-35',
    'arri-alexa-35-3k-1-1': 'super-35',
    'arri-mini-4k-og': 'super-35',
    'arri-mini-4k-16-9': 'super-35',
    'arri-mini-4k-239': 'super-35',
    'arri-mini-s16-2k-og': 'super-16',
    'arri-mini-s16-2k-16-9': 'super-16',
    'arri-mini-s16-2k-239': 'super-16',
    'arri-mini-lf-4k5-og-3-2': 'full-frame',
    'arri-mini-lf-4k5-239': 'full-frame',
    'arri-mini-lf-4k3-16-9-a': 'full-frame',
    'arri-mini-lf-4k3-16-9-b': 'full-frame',
    'arri-mini-lf-3k8-16-9-a': 'full-frame',
    'arri-mini-lf-3k8-16-9-b': 'full-frame',
    'arri-mini-lf-2k88-16-9': 'full-frame',
    'arri-mini-lf-2k2-16-9-a': 'full-frame',
    'arri-mini-lf-2k2-16-9-b': 'full-frame',
    'arri-mini-lf-2k2-16-9-c': 'full-frame',
    'arri-mini-lf-2k-16-9-a': 'full-frame',
    'arri-mini-lf-2k-16-9-b': 'full-frame',
    'arri-mini-lf-2k-16-9-c': 'full-frame',
    'arri-mini-lf-s35-3k4-3-2': 'super-35',
    'arri-mini-lf-s35-3k2-16-9': 'super-35',
    'arri-mini-lf-s35-3k2-4-3': 'super-35',
    'arri-mini-lf-s35-2k8-16-9': 'super-35',
    'arri-265-6k5-65mm': '65mm',
    'arri-265-5k1-65mm-crop': '65mm',
    'arri-265-4k5-lf-og': 'full-frame',
    'arri-265-vertical-6k5-65mm': '65mm',
    'sony-burano-8k6-16-9': 'full-frame',
    'sony-burano-8k6-17-9-a': 'full-frame',
    'sony-burano-8k6-17-9-b': 'full-frame',
    'sony-burano-8k-16-9': 'full-frame',
    'sony-burano-6k-17-9-a': 'full-frame',
    'sony-burano-6k-16-9': 'full-frame',
    'sony-burano-6k-17-9-dci': 'full-frame',
    'sony-burano-6k-16-9-dci': 'full-frame',
    'sony-burano-6k-16-9-hd': 'full-frame',
    'sony-burano-s35-5k8-17-9': 'super-35',
    'sony-burano-s35-5k8-16-9': 'super-35',
    'sony-burano-s35-4k-17-9': 'super-35',
    'sony-burano-s35-4k-16-9': 'super-35',
    'sony-burano-s35-4k-16-9-hd': 'super-35',
    'sony-burano-s35c-4k-17-9': 'super-35',
    'red-monstro-8k-3-2': 'full-frame',
    'red-monstro-8k-16-9': 'full-frame',
    'red-monstro-8k-239': 'full-frame',
    'red-monstro-6k-3-2': 'super-35',
    'red-monstro-6k-16-9': 'super-35',
    'sony-fx3-4k-dci': 'full-frame',
    'sony-fx3-4k-uhd': 'full-frame',
    'sony-fx3-hd': 'full-frame',
    'sony-fx6-4k-dci': 'full-frame',
    'sony-fx6-4k-uhd': 'full-frame',
    'sony-fx6-hd': 'full-frame',
    'sony-fx9-4k-dci': 'full-frame',
    'sony-fx9-4k-uhd': 'full-frame',
    'sony-fx9-hd': 'full-frame',
    'red-komodo-6k-3-2': 'super-35',
    'red-komodo-6k-16-9': 'super-35',
    'red-komodo-6k-239': 'super-35',
    'red-komodo-s35-4k-3-2': 'super-35',
    'red-komodo-s35-4k-16-9': 'super-35',
    'red-komodo-s35-4k-239': 'super-35',
    'red-gemini-5k-3-2': 'super-35',
    'red-gemini-5k-16-9': 'super-35',
    'red-gemini-5k-239': 'super-35',
    'red-gemini-4k-3-2': 'super-35',
    'red-gemini-4k-16-9': 'super-35',
    'red-gemini-4k-239': 'super-35',
    'fujifilm-eterna-gf-4k-og': '65mm',
    'fujifilm-eterna-gf-4k-dci': '65mm',
    'fujifilm-eterna-premista-4k-dci': '65mm',
    'fujifilm-eterna-35mm-4k-dci': 'full-frame',
    'fujifilm-eterna-8k-dci': 'full-frame',
    'fujifilm-eterna-s35-4k-dci': 'super-35',
    'fujifilm-gfx-8k-og': '65mm',
    'fujifilm-gfx-6k-16-9': '65mm',
    'fujifilm-gfx-5k8-235': '65mm',
    'fujifilm-gfx-5k4-17-9': '65mm',
    'fujifilm-gfx-4k8-3-2': '65mm',
    'fujifilm-gfx-4k8-16-9': '65mm',
    'fujifilm-gfx-dci4k-17-9': 'full-frame',
    'fujifilm-gfx-4k-16-9': 'full-frame',
    'fujifilm-gfx-8k-17-9': 'super-35',
    'fujifilm-gfx-4k6-138': 'full-frame',
    'fujifilm-gfx-8k-276': 'full-frame',

    'arri-alexa-35-4k6-og': 'super-35',
    'arri-alexa-35-4k6-16-9': 'super-35',
    'arri-alexa-35-4k-16-9': 'super-35',
    'arri-alexa-35-4k-2-1': 'super-35',
    'arri-alexa-35-3k3-6-5': 'super-35',
    'arri-alexa-35-3k-1-1': 'super-35',
    'arri-mini-4k-og': 'super-16',
    'arri-mini-4k-16-9': 'super-16',
    'arri-mini-4k-239': 'super-16',
    'arri-mini-s16-2k-og': 'super-16',
    'arri-mini-s16-2k-16-9': 'super-16',
    'arri-mini-s16-2k-239': 'super-16',
  };

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
      'sony-burano-8k6-16-9': { name: 'Sony Burano - 8.6K 16:9 Full Frame (8632×4856)', lensCircle: 'full-frame', width: 35.9, height: 20.2, pixels: '8632 x 4856', aspectRatio: '16:9' },
      'sony-burano-8k6-17-9-a': { name: 'Sony Burano - 8.6K 17:9 Full Frame (8632×4552)', lensCircle: 'full-frame', width: 35.9, height: 18.9, pixels: '8632 x 4552', aspectRatio: '17:9' },
      'sony-burano-8k6-17-9-b': { name: 'Sony Burano - 8.6K 17:9 Full Frame (8192×4320)', lensCircle: 'full-frame', width: 35.9, height: 18.9, pixels: '8192 x 4320', aspectRatio: '17:9' },
      'sony-burano-8k-16-9': { name: 'Sony Burano - 8.6K 16:9 Full Frame (7680×4320)', lensCircle: 'full-frame', width: 35.9, height: 20.2, pixels: '7680 x 4320', aspectRatio: '16:9' },
      'sony-burano-6k-17-9-a': { name: 'Sony Burano - 6K 17:9 Full Frame (6052×3192)', lensCircle: 'full-frame', width: 33.6, height: 17.7, pixels: '6052 x 3192', aspectRatio: '17:9' },
      'sony-burano-6k-16-9': { name: 'Sony Burano - 6K 16:9 Full Frame (6052×3404)', lensCircle: 'full-frame', width: 33.6, height: 18.9, pixels: '6052 x 3404', aspectRatio: '16:9' },
      'sony-burano-6k-17-9-dci': { name: 'Sony Burano - 6K 17:9 DCI (4096×2160)', width: 33.57, height: 17.7, pixels: '4096 x 2160', aspectRatio: '17:9' },
      'sony-burano-6k-16-9-dci': { name: 'Sony Burano - 6K 16:9 DCI (3840×2160)', width: 33.6, height: 18.9, pixels: '3840 x 2160', aspectRatio: '16:9' },
      'sony-burano-6k-16-9-hd': { name: 'Sony Burano - 6K 16:9 HD (1920×1080)', width: 33.6, height: 18.9, pixels: '1920 x 1080', aspectRatio: '16:9' },
      'sony-burano-s35-5k8-17-9': { name: 'Sony Burano - 5.8K 17:9 Super 35 (5760×3036)', lensCircle: 'super-35', width: 24.0, height: 12.6, pixels: '5760 x 3036', aspectRatio: '17:9' },
      'sony-burano-s35-5k8-16-9': { name: 'Sony Burano - 5.8K 16:9 Super 35 (5760×3240)', lensCircle: 'super-35', width: 24.0, height: 13.5, pixels: '5760 x 3240', aspectRatio: '16:9' },
      'sony-burano-s35-4k-17-9': { name: 'Sony Burano - 4K 17:9 Super 35 (4096×2160)', lensCircle: 'super-35', width: 24.0, height: 12.6, pixels: '4096 x 2160', aspectRatio: '17:9' },
      'sony-burano-s35-4k-16-9': { name: 'Sony Burano - 4K 16:9 Super 35 (3840×2160)', lensCircle: 'super-35', width: 24.0, height: 13.5, pixels: '3840 x 2160', aspectRatio: '16:9' },
      'sony-burano-s35-4k-16-9-hd': { name: 'Sony Burano - 4K 16:9 Super 35 HD (1920×1080)', lensCircle: 'super-35', width: 24.0, height: 13.5, pixels: '1920 x 1080', aspectRatio: '16:9' },
      'sony-burano-s35c-4k-17-9': { name: 'Sony Burano - 4K 17:9 Super 35c (4096×2160)', lensCircle: 'super-35', width: 17.0, height: 9.0, pixels: '4096 x 2160', aspectRatio: '17:9' },
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
    'arri-alexa-mini': {
      'arri-mini-4k-og': { name: 'ARRI Alexa Mini - 4K 3:2 (3840x2560)', width: 23.76, height: 15.84, pixels: '3840 x 2560', aspectRatio: '3:2' },
      'arri-mini-4k-16-9': { name: 'ARRI Alexa Mini - 4K 16:9 (3840x2160)', width: 23.76, height: 15.84, pixels: '3840 x 2160', aspectRatio: '16:9' },
      'arri-mini-4k-239': { name: 'ARRI Alexa Mini - 4K 2.39:1 (3840x1608)', width: 23.76, height: 9.96, pixels: '3840 x 1608', aspectRatio: '2.39:1' },
      'arri-mini-s16-2k-og': { name: 'ARRI Alexa Mini - Super 16 2K 3:2 (1920x1280)', width: 11.88, height: 7.92, pixels: '1920 x 1280', aspectRatio: '3:2' },
      'arri-mini-s16-2k-16-9': { name: 'ARRI Alexa Mini - Super 16 2K 16:9 (1920x1080)', width: 11.88, height: 7.92, pixels: '1920 x 1080', aspectRatio: '16:9' },
      'arri-mini-s16-2k-239': { name: 'ARRI Alexa Mini - Super 16 2K 2.39:1 (1920x804)', width: 11.88, height: 4.98, pixels: '1920 x 804', aspectRatio: '2.39:1' },
    },
    'arri-alexa-mini-lf': {
      'arri-mini-lf-4k5-og-3-2': { name: 'ARRI Alexa Mini LF - 4.5K LF 3:2 Open Gate (4448x3096)', width: 36.70, height: 25.54, pixels: '4448 x 3096', aspectRatio: '3:2' },
      'arri-mini-lf-4k5-239': { name: 'ARRI Alexa Mini LF - 4.5K LF 2.39:1 (4448x1856)', width: 36.70, height: 15.38, pixels: '4448 x 1856', aspectRatio: '2.39:1' },
      'arri-mini-lf-4k3-16-9-a': { name: 'ARRI Alexa Mini LF - 4.3K LF 16:9 4K (3840x2160)', width: 31.87, height: 17.91, pixels: '3840 x 2160', aspectRatio: '16:9' },
      'arri-mini-lf-4k3-16-9-b': { name: 'ARRI Alexa Mini LF - 4.3K LF 16:9 HD (1920x1080)', width: 31.87, height: 17.91, pixels: '1920 x 1080', aspectRatio: '16:9' },
      'arri-mini-lf-3k8-16-9-a': { name: 'ARRI Alexa Mini LF - 3.8K LF 16:9 4K (3840x2160)', width: 31.87, height: 17.91, pixels: '3840 x 2160', aspectRatio: '16:9' },
      'arri-mini-lf-3k8-16-9-b': { name: 'ARRI Alexa Mini LF - 3.8K LF 16:9 HD (1920x1080)', width: 31.87, height: 17.91, pixels: '1920 x 1080', aspectRatio: '16:9' },
      'arri-mini-lf-2k88-16-9': { name: 'ARRI Alexa Mini LF - 2.8K LF 16:9 (2880x1620)', width: 31.87, height: 17.91, pixels: '2880 x 1620', aspectRatio: '16:9' },
      'arri-mini-lf-2k2-16-9-a': { name: 'ARRI Alexa Mini LF - 2.2K LF 16:9 A (2048x1152)', width: 31.87, height: 17.91, pixels: '2048 x 1152', aspectRatio: '16:9' },
      'arri-mini-lf-2k2-16-9-b': { name: 'ARRI Alexa Mini LF - 2.2K LF 16:9 B (2048x1152)', width: 31.87, height: 17.91, pixels: '2048 x 1152', aspectRatio: '16:9' },
      'arri-mini-lf-2k2-16-9-c': { name: 'ARRI Alexa Mini LF - 2.2K LF 16:9 C (2048x1152)', width: 31.87, height: 17.91, pixels: '2048 x 1152', aspectRatio: '16:9' },
      'arri-mini-lf-2k-16-9-a': { name: 'ARRI Alexa Mini LF - 2K LF 16:9 A (1920x1080)', width: 31.87, height: 17.91, pixels: '1920 x 1080', aspectRatio: '16:9' },
      'arri-mini-lf-2k-16-9-b': { name: 'ARRI Alexa Mini LF - 2K LF 16:9 B (1920x1080)', width: 31.87, height: 17.91, pixels: '1920 x 1080', aspectRatio: '16:9' },
      'arri-mini-lf-2k-16-9-c': { name: 'ARRI Alexa Mini LF - 2K LF 16:9 C (1920x1080)', width: 31.87, height: 17.91, pixels: '1920 x 1080', aspectRatio: '16:9' },
      'arri-mini-lf-s35-3k4-3-2': { name: 'ARRI Alexa Mini LF - 3.4K S35 3:2 (3424x2202)', width: 24.0, height: 16.0, pixels: '3424 x 2202', aspectRatio: '3:2' },
      'arri-mini-lf-s35-3k2-16-9': { name: 'ARRI Alexa Mini LF - 3.2K S35 16:9 (3200x1800)', width: 24.0, height: 13.5, pixels: '3200 x 1800', aspectRatio: '16:9' },
      'arri-mini-lf-s35-3k2-4-3': { name: 'ARRI Alexa Mini LF - 3.2K S35 4:3 (2880x2160)', width: 24.0, height: 18.0, pixels: '2880 x 2160', aspectRatio: '4:3' },
      'arri-mini-lf-s35-2k8-16-9': { name: 'ARRI Alexa Mini LF - 2.8K S35 16:9 (2880x1620)', width: 24.0, height: 13.5, pixels: '2880 x 1620', aspectRatio: '16:9' },
    },
    'arri-265': {
      'arri-265-6k5-65mm': { name: 'ARRI Alexa 265 - 6.5K 65mm (6560x3100)', width: 54.0, height: 25.5, pixels: '6560 x 3100', aspectRatio: '2.12:1', lensCircle: '65mm' },
      'arri-265-5k1-65mm-crop': { name: 'ARRI Alexa 265 - 5.1K 65mm (5120x2400)', width: 42.0, height: 19.7, pixels: '5120 x 2400', aspectRatio: '2.13:1', lensCircle: '65mm' },
      'arri-265-4k5-lf-og': { name: 'ARRI Alexa 265 (crop) - 4.5K LF OG (4560x2160)', width: 36.0, height: 17.0, pixels: '4560 x 2160', aspectRatio: '2.11:1', lensCircle: 'full-frame' },
    },
    'arri-265-vertical': {
      'arri-265-vertical-6k5-65mm': { name: 'ARRI Alexa 265 (Vertical) - 6.5K 65mm (3100x6560)', width: 25.5, height: 54.0, pixels: '3100 x 6560', aspectRatio: '0.472:1', lensCircle: '65mm' },
    },
    'red-komodo-x': {
      'red-komodo-6k-3-2': { name: 'RED Komodo-X - 6K 3:2 (6144x4096)', width: 25.4, height: 16.9, pixels: '6144 x 4096', aspectRatio: '3:2' },
      'red-komodo-6k-16-9': { name: 'RED Komodo-X - 6K 16:9 (6144x3456)', width: 25.4, height: 14.3, pixels: '6144 x 3456', aspectRatio: '16:9' },
      'red-komodo-6k-239': { name: 'RED Komodo-X - 6K 2.39:1 (6144x2572)', width: 25.4, height: 10.7, pixels: '6144 x 2572', aspectRatio: '2.39:1' },
      'red-komodo-s35-4k-3-2': { name: 'RED Komodo-X - 4K 3:2 Super 35 (4096x2731)', width: 24.0, height: 16.0, pixels: '4096 x 2731', aspectRatio: '3:2' },
      'red-komodo-s35-4k-16-9': { name: 'RED Komodo-X - 4K 16:9 Super 35 (4096x2304)', width: 24.0, height: 13.5, pixels: '4096 x 2304', aspectRatio: '16:9' },
      'red-komodo-s35-4k-239': { name: 'RED Komodo-X - 4K 2.39:1 Super 35 (4096x1716)', width: 24.0, height: 9.0, pixels: '4096 x 1716', aspectRatio: '2.39:1' },
    },
    'red-gemini': {
      'red-gemini-5k-3-2': { name: 'RED Gemini 5K - 5K 3:2 (5120x3413)', width: 26.8, height: 17.9, pixels: '5120 x 3413', aspectRatio: '3:2' },
      'red-gemini-5k-16-9': { name: 'RED Gemini 5K - 5K 16:9 (5120x2880)', width: 26.8, height: 15.1, pixels: '5120 x 2880', aspectRatio: '16:9' },
      'red-gemini-5k-239': { name: 'RED Gemini 5K - 5K 2.39:1 (5120x2143)', width: 26.8, height: 11.3, pixels: '5120 x 2143', aspectRatio: '2.39:1' },
      'red-gemini-4k-3-2': { name: 'RED Gemini 5K - 4K 3:2 (4096x2731)', width: 24.0, height: 16.0, pixels: '4096 x 2731', aspectRatio: '3:2' },
      'red-gemini-4k-16-9': { name: 'RED Gemini 5K - 4K 16:9 (4096x2304)', width: 24.0, height: 13.5, pixels: '4096 x 2304', aspectRatio: '16:9' },
      'red-gemini-4k-239': { name: 'RED Gemini 5K - 4K 2.39:1 (4096x1716)', width: 24.0, height: 9.0, pixels: '4096 x 1716', aspectRatio: '2.39:1' },
    },
    'red-monstro': {
      'red-monstro-8k-3-2': { name: 'RED Monstro 8K - 8K 3:2 (8192x5464)', width: 32.0, height: 21.3, pixels: '8192 x 5464', aspectRatio: '3:2' },
      'red-monstro-8k-16-9': { name: 'RED Monstro 8K - 8K 16:9 (8192x4608)', width: 32.0, height: 18.0, pixels: '8192 x 4608', aspectRatio: '16:9' },
      'red-monstro-8k-239': { name: 'RED Monstro 8K - 8K 2.39:1 (8192x3431)', width: 32.0, height: 13.5, pixels: '8192 x 3431', aspectRatio: '2.39:1' },
      'red-monstro-6k-3-2': { name: 'RED Monstro 8K - 6K 3:2 (6144x4096)', width: 25.4, height: 16.9, pixels: '6144 x 4096', aspectRatio: '3:2' },
      'red-monstro-6k-16-9': { name: 'RED Monstro 8K - 6K 16:9 (6144x3456)', width: 25.4, height: 14.3, pixels: '6144 x 3456', aspectRatio: '16:9' },
      'red-monstro-6k-239': { name: 'RED Monstro 8K - 6K 2.39:1 (6144x2572)', width: 25.4, height: 10.7, pixels: '6144 x 2572', aspectRatio: '2.39:1' },
    },
    'fujifilm-eterna': {
      'fujifilm-eterna-gf-4k-og': { name: 'Fujifilm GFX ETERNA - GF 4K Open Gate (3840x2880)', width: 43.6, height: 32.7, pixels: '3840 x 2880', aspectRatio: '4:3' },
      'fujifilm-eterna-gf-4k-dci': { name: 'Fujifilm GFX ETERNA - GF 4K DCI (4096x2160)', width: 43.6, height: 23.0, pixels: '4096 x 2160', aspectRatio: '17:9' },
      'fujifilm-eterna-premista-4k-dci': { name: 'Fujifilm GFX ETERNA - Premista 4K DCI (4096x2160)', width: 40.3, height: 21.2, pixels: '4096 x 2160', aspectRatio: '17:9' },
      'fujifilm-eterna-35mm-4k-dci': { name: 'Fujifilm GFX ETERNA - 35mm DCI 4K (4096x2160)', width: 35.9, height: 23.9, pixels: '4096 x 2160', aspectRatio: '17:9' },
      'fujifilm-eterna-8k-dci': { name: 'Fujifilm GFX ETERNA - 8K DCI (8129x4320)', width: 30.8, height: 16.2, pixels: '8129 x 4320', aspectRatio: '17:9' },
      'fujifilm-eterna-s35-4k-dci': { name: 'Fujifilm GFX ETERNA - Super 35 4K DCI (4096x2160)', width: 24.0, height: 12.7, pixels: '4096 x 2160', aspectRatio: '17:9' },
    },
    'fujifilm-gfx': {
      'fujifilm-gfx-5k8-235': { name: 'Fujifilm GFX 100 - GF 5.8K (2.35:1) (5824x2476)', width: 43.8, height: 18.6, pixels: '5824 x 2476', aspectRatio: '2.35:1' },
      'fujifilm-gfx-5k4-17-9': { name: 'Fujifilm GFX 100 - GF 5.4K (17:9) (5440x2868)', width: 43.8, height: 23.0, pixels: '5440 x 2868', aspectRatio: '17:9' },
      'fujifilm-gfx-4k8-3-2': { name: 'Fujifilm GFX 100 - Premista 4.8K (3:2) (4776x3184)', width: 43.8, height: 29.2, pixels: '4776 x 3184', aspectRatio: '3:2' },
      'fujifilm-gfx-4k8-16-9': { name: 'Fujifilm GFX 100 - Premista 4.8K (16:9) (4776x2688)', width: 43.8, height: 24.6, pixels: '4776 x 2688', aspectRatio: '16:9' },
      'fujifilm-gfx-dci4k-17-9': { name: 'Fujifilm GFX 100 - 35mm DCI 4K (17:9) (4096x2160)', width: 43.8, height: 23.1, pixels: '4096 x 2160', aspectRatio: '17:9' },
      'fujifilm-gfx-4k-16-9': { name: 'Fujifilm GFX 100 - 35mm UHD 4K (16:9) (3840x2160)', width: 43.8, height: 24.6, pixels: '3840 x 2160', aspectRatio: '16:9' },
      'fujifilm-gfx-4k6-138': { name: 'Fujifilm GFX 100 - 35mm Anamorphic 4.6K (1.38:1) (4664x3380)', width: 43.8, height: 31.8, pixels: '4664 x 3380', aspectRatio: '1.38:1' },
      'fujifilm-gfx-8k-276': { name: 'Fujifilm GFX 100 - 35mm Anamorphic 8K (2.76:1) (8192x2968)', width: 43.8, height: 15.9, pixels: '8192 x 2968', aspectRatio: '2.76:1' },
      'fujifilm-gfx-8k-17-9': { name: 'Fujifilm GFX 100 - Super 35 8K (17:9) (8192x4320)', width: 43.8, height: 23.1, pixels: '8192 x 4320', aspectRatio: '17:9' },

    },
  };

  // ============================================
  // CALCULATION FUNCTIONS
  // ============================================

  // Shared digital calculation - used by both main and comparison tabs
  const computeDigitalResult = (camera, sensorFmt, anamRatio, desiredRatio, customPixels, custPW, custPH) => {
    const sensor = customPixels ? null : sensorsByCamera[camera]?.[sensorFmt];
    if (!customPixels && !sensor) return null;

    const squeeze = parseFloat(anamRatio) || 1;
    const desiredAR = parseFloat(desiredRatio) || 2.39;

    let pixelWidth, pixelHeight, sensorWidth, sensorHeight;
    if (customPixels) {
      pixelWidth = parseFloat(custPW) || 0;
      pixelHeight = parseFloat(custPH) || 0;
      if (pixelWidth <= 0 || pixelHeight <= 0) return null;
      sensorWidth = 36;
      sensorHeight = 24;
    } else {
      const pixelParts = sensor.pixels.split(' x ');
      pixelWidth = parseFloat(pixelParts[0]);
      pixelHeight = parseFloat(pixelParts[1]);
      sensorWidth = sensor.width;
      sensorHeight = sensor.height;
    }

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
      desqueezedCroppedHeight = Math.round(usedPixelWidth / desiredAR);
      cropPixelsNeeded = desqueezedHeight - desqueezedCroppedHeight;
      cropPercentage = (cropPixelsNeeded / desqueezedHeight) * 100;
    } else if (desiredAR < desqueezedAR) {
      desqueezedCroppedWidth = Math.round(desqueezedHeight * desiredAR);
      cropPixelsNeeded = usedPixelWidth - desqueezedCroppedWidth;
      cropPercentage = (cropPixelsNeeded / usedPixelWidth) * 100;
    }

    const coverage = 100 - cropPercentage;
    let croppedPixelHeight = desqueezedHeight;
    let croppedPixelWidth = usedPixelWidth;

    if (desiredAR > desqueezedAR) {
      croppedPixelHeight = desqueezedCroppedHeight;
    } else if (desiredAR < desqueezedAR) {
      croppedPixelWidth = desqueezedCroppedWidth;
    }

    return {
      pixelWidth: Math.round(pixelWidth),
      pixelHeight: Math.round(pixelHeight),
      usedPixelWidth: Math.round(usedPixelWidth),
      usedPixelHeight: Math.round(usedPixelHeight),
      desqueezedHeight: Math.round(usedPixelHeight / squeeze),
      desqueezedCroppedHeight,
      desqueezedCroppedWidth,
      croppedPixelWidth,
      croppedPixelHeight,
      cropPixelsNeeded: Math.round(cropPixelsNeeded),
      naturalAspectRatio: desqueezedAspectRatio.toFixed(2),
      coverage: coverage.toFixed(1),
      cropPercentage: cropPercentage.toFixed(1),
      anamorphic: squeeze,
      aspectRatio: desiredAR,
    };
  };

  // DIGITAL CALCULATIONS (main)
  const calculateDigital = useMemo(() => {
    const needsSensorFormat = !useCustomPixels && !sensorFormat;
    if ((!selectedCamera && !bypassCameraSelection) || needsSensorFormat || (!anamorphicRatio && !useCustomAnamorphic) || (!desiredAspectRatio && !useCustomAspectRatio)) {
      return null;
    }
    if (!useCustomPixels) {
      const sensor = sensorsByCamera[selectedCamera]?.[sensorFormat];
      if (!sensor) return null;
    }
    const squeeze = useCustomAnamorphic ? customAnamorphicRatio : anamorphicRatio;
    const desired = useCustomAspectRatio ? customOutputAspectRatio : desiredAspectRatio;
    return computeDigitalResult(selectedCamera, sensorFormat, squeeze, desired, useCustomPixels, customPixelWidth, customPixelHeight);
  }, [selectedCamera, sensorFormat, anamorphicRatio, desiredAspectRatio, useCustomPixels, customPixelWidth, customPixelHeight, useCustomAnamorphic, useCustomAspectRatio, customAnamorphicRatio, customOutputAspectRatio]);

  // FILM CALCULATIONS
  const calculateFilm = useMemo(() => {
    if (!selectedFilmFormat || (!filmAnamorphicRatio && !useCustomFilmAnamorphic) || (!filmDesiredAspectRatio && !useCustomFilmAspectRatio)) {
      return null;
    }

    const filmFormat = filmFormats.find(f => f.id === selectedFilmFormat);
    if (!filmFormat) return null;

    const squeeze = useCustomFilmAnamorphic ? parseFloat(customFilmAnamorphic) : parseFloat(filmAnamorphicRatio);
    const desiredAspect = useCustomFilmAspectRatio ? parseFloat(customFilmAspectRatio) : parseFloat(filmDesiredAspectRatio);

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

    // Convert unsqueezed dimensions back to actual negative dimensions (divide by squeeze)
    const outputNegativeWidth = usedWidth / squeeze;
    const outputNegativeHeight = usedHeight;

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
      usedHeight: parseFloat(usedHeight.toFixed(2)),
      outputNegativeWidth: parseFloat(outputNegativeWidth.toFixed(2)),
      outputNegativeHeight: parseFloat(outputNegativeHeight.toFixed(2)),
      cropPercentageOfUnsqueezed: parseFloat(cropPercentageOfUnsqueezed.toFixed(1)),
      isInsufficient,
      formatName: filmFormat.name,
      projectedAspectRatio: filmFormat.projectedAspectRatio,
    };
  }, [selectedFilmFormat, filmAnamorphicRatio, filmDesiredAspectRatio, useCustomFilmAnamorphic, useCustomFilmAspectRatio, filmFormats]);

  // COMPARISON CALCULATIONS - DIGITAL
  const calculateComparisonDigital = (compState, index) => {
    // Use comparison state if set, otherwise fall back to main state
    const compCamera = compState?.camera || selectedCamera;
    const compSensorFormat = compState?.sensorFormat || sensorFormat;
    const compAnamorphicRatio = compState?.anamorphicRatio || anamorphicRatio || (useCustomAnamorphic ? customAnamorphicRatio : null);
    const compDesiredAspectRatio = compState?.desiredAspectRatio || desiredAspectRatio || (useCustomAspectRatio ? customOutputAspectRatio : null);
    const compUseCustomPixels = compState?.useCustomPixels !== undefined ? compState.useCustomPixels : useCustomPixels;
    const compCustomPixelWidth = compState?.customPixelWidth || customPixelWidth;
    const compCustomPixelHeight = compState?.customPixelHeight || customPixelHeight;
    const compUseCustomAnamorphic = compState?.useCustomAnamorphic !== undefined ? compState.useCustomAnamorphic : useCustomAnamorphic;
    const compCustomAnamorphicRatio = compState?.customAnamorphicRatio || customAnamorphicRatio;
    const compUseCustomAspectRatio = compState?.useCustomAspectRatio !== undefined ? compState.useCustomAspectRatio : useCustomAspectRatio;
    const compCustomOutputAspectRatio = compState?.customOutputAspectRatio || customOutputAspectRatio;

    if (!compCamera || !compSensorFormat || (!compAnamorphicRatio && !compUseCustomAnamorphic) || (!compDesiredAspectRatio && !compUseCustomAspectRatio)) {
      return null;
    }

    const sensor = sensorsByCamera[compCamera]?.[compSensorFormat];
    if (!sensor) return null;

    const squeeze = parseFloat(compUseCustomAnamorphic ? compCustomAnamorphicRatio : compAnamorphicRatio) || 1;
    const desiredAR = parseFloat(compUseCustomAspectRatio ? compCustomOutputAspectRatio : compDesiredAspectRatio) || 2.39;

    let pixelWidth, pixelHeight;
    if (compUseCustomPixels) {
      pixelWidth = parseFloat(compCustomPixelWidth) || 0;
      pixelHeight = parseFloat(compCustomPixelHeight) || 0;
    } else {
      const pixelParts = sensor.pixels.split(' x ');
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
        croppedPercentage = ((usedPixelHeight - croppedPixelHeight) / usedPixelHeight * 100);
      } else {
        croppedPixelWidth = (desiredAR * usedPixelHeight) / squeeze;
        croppedPercentage = ((usedPixelWidth - croppedPixelWidth) / usedPixelWidth * 100);
      }
    } else if (desiredAR > desqueezedAspectRatio) {
      let testCroppedWidth = (desiredAR * usedPixelHeight) / squeeze;
      if (testCroppedWidth <= usedPixelWidth) {
        croppedPixelWidth = testCroppedWidth;
        croppedPercentage = ((usedPixelWidth - croppedPixelWidth) / usedPixelWidth * 100);
      } else {
        croppedPixelHeight = (usedPixelWidth * squeeze) / desiredAR;
        croppedPercentage = ((usedPixelHeight - croppedPixelHeight) / usedPixelHeight * 100);
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
    const compFilmAnamorphicRatio = compState?.filmAnamorphicRatio || filmAnamorphicRatio || (useCustomFilmAnamorphic ? customFilmAnamorphic : null);
    const compFilmDesiredAspectRatio = compState?.filmDesiredAspectRatio || filmDesiredAspectRatio || (useCustomFilmAspectRatio ? customFilmAspectRatio : null);
    const compUseCustomFilmAnamorphic = compState?.useCustomFilmAnamorphic !== undefined ? compState.useCustomFilmAnamorphic : useCustomFilmAnamorphic;
    const compCustomFilmAnamorphic = compState?.customFilmAnamorphic || customFilmAnamorphic;
    const compUseCustomFilmAspectRatio = compState?.useCustomFilmAspectRatio !== undefined ? compState.useCustomFilmAspectRatio : useCustomFilmAspectRatio;
    const compCustomFilmAspectRatio = compState?.customFilmAspectRatio || customFilmAspectRatio;

    if (!compFilmFormat || (!compFilmAnamorphicRatio && !compUseCustomFilmAnamorphic) || (!compFilmDesiredAspectRatio && !compUseCustomFilmAspectRatio)) {
      return null;
    }

    const format = filmFormats.find(f => f.id === compFilmFormat);
    if (!format) return null;

    const squeeze = parseFloat(compUseCustomFilmAnamorphic ? compCustomFilmAnamorphic : compFilmAnamorphicRatio) || 2.0;
    const desiredAspect = parseFloat(compUseCustomFilmAspectRatio ? compCustomFilmAspectRatio : compFilmDesiredAspectRatio) || 2.39;

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

    // Convert unsqueezed dimensions back to actual negative dimensions (divide by squeeze)
    const outputNegativeWidth = usedWidth / squeeze;
    const outputNegativeHeight = usedHeight;

    return {
      negativeWidth,
      negativeHeight,
      negativeArea,
      negativeAspect: parseFloat(negativeAspect.toFixed(3)),
      squeeze,
      unSqueezeWidth: parseFloat(unSqueezeWidth.toFixed(2)),
      unSqueezeAspect: parseFloat(unSqueezeAspect.toFixed(3)),
      desiredAspect,
      outputNegativeWidth: parseFloat(outputNegativeWidth.toFixed(2)),
      outputNegativeHeight: parseFloat(outputNegativeHeight.toFixed(2)),
      cropPercentageOfUnsqueezed: parseFloat(cropPercentageOfUnsqueezed.toFixed(1)),
      isInsufficient,
    };
  };

  // ============================================
  // UI - FILTER LOGIC
  // ============================================

  const filteredCameraList = cameraList.filter(camera => {
    if (camera.format !== formatType) return false;
    if (bypassCameraSelection) return true;
    if (!lensImageCircle) return true;
    if (lensImageCircle === 'super-16') {
      return camera.id === 'arri-alexa-mini';
    }
    return camera.lensCircles.includes(lensImageCircle);
  }).map(camera => {
    // Add (crop) label if this camera is marked as crop for this lens circle
    if (camera.isCrop && camera.isCrop[lensImageCircle]) {
      return { ...camera, displayName: `${camera.name} (crop)` };
    }
    // Also check if showing in non-primary lens circle (first one in array)
    if (lensImageCircle && camera.lensCircles.length > 1 && camera.lensCircles[0] !== lensImageCircle && !camera.isCrop) {
      return { ...camera, displayName: `${camera.name} (crop)` };
    }
    return { ...camera, displayName: camera.name };
  });

  const currentSensors = selectedCamera && sensorsByCamera[selectedCamera] ? sensorsByCamera[selectedCamera] : {};

  // ============================================
  // PARAMETERS PANEL COMPONENT
  // ============================================

  function ParametersPanel(props) {
    const { state, setState, cameras = [], sensors = {}, isComparison = false, formatType = 'digital', filmFormats = [] } = props;
    // Local state for custom inputs - initialized from parent state if available, otherwise empty
    const [localCustomPixelWidth, setLocalCustomPixelWidth] = React.useState(() => state.customPixelWidth || '');
    const [localCustomPixelHeight, setLocalCustomPixelHeight] = React.useState(() => state.customPixelHeight || '');
    const [localCustomAnamorphic, setLocalCustomAnamorphic] = React.useState(() => state.customAnamorphicRatio || state.customFilmAnamorphic || '');
    const [localCustomAspectRatio, setLocalCustomAspectRatio] = React.useState(() => state.customOutputAspectRatio || state.customFilmAspectRatio || '');

    const [collapsed, setCollapsed] = React.useState(false);
    
    // Derive defaults checked from actual state values
    const defaultsChecked = isComparison ? (
      formatType === 'digital' 
        ? (state.lensCircle === 'full-frame' && state.camera === 'sony-venice' && state.sensorFormat === 'sony-venice-6k-3-2' && state.anamorphicRatio === '1.5' && state.desiredAspectRatio === '2.39' && !state.useCustomAnamorphic && !state.useCustomAspectRatio)
        : (state.filmFormat === 'super-35-4perf' && state.filmAnamorphicRatio === '2' && state.filmDesiredAspectRatio === '2.39' && !state.useCustomFilmAnamorphic && !state.useCustomFilmAspectRatio)
    ) : false;

    // Auto-sync local custom values to parent state after 500ms debounce
    // Only sends the specific changed fields — never spreads the full display state
    React.useEffect(() => {
      const timer = setTimeout(() => {
        const updates = {};
        if (formatType === 'digital') {
          if (localCustomPixelWidth !== (state.customPixelWidth || '')) {
            updates.customPixelWidth = localCustomPixelWidth;
          }
          if (localCustomPixelHeight !== (state.customPixelHeight || '')) {
            updates.customPixelHeight = localCustomPixelHeight;
          }
          if (localCustomAnamorphic !== (state.customAnamorphicRatio || '')) {
            updates.customAnamorphicRatio = localCustomAnamorphic;
          }
          if (localCustomAspectRatio !== (state.customOutputAspectRatio || '')) {
            updates.customOutputAspectRatio = localCustomAspectRatio;
          }
        } else {
          if (localCustomAnamorphic !== (state.customFilmAnamorphic || '')) {
            updates.customFilmAnamorphic = localCustomAnamorphic;
          }
          if (localCustomAspectRatio !== (state.customFilmAspectRatio || '')) {
            updates.customFilmAspectRatio = localCustomAspectRatio;
          }
        }
        if (Object.keys(updates).length > 0) {
          setState(updates);
        }
      }, 2000);
      return () => clearTimeout(timer);
    }, [localCustomPixelWidth, localCustomPixelHeight, localCustomAnamorphic, localCustomAspectRatio]);

    return (
    <div className={`bg-gray-200 border border-black border-opacity-15 rounded-lg p-6${isComparison ? '' : ' sticky top-4'}`}>
    <div className="flex justify-between items-center mb-2">
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center gap-2 text-black text-lg font-bold tracking-wider hover:opacity-70 transition-opacity"
      >
        <ChevronDown className={`w-5 h-5 transition-transform ${collapsed ? '-rotate-90' : ''}`} />
        PARAMETERS
      </button>
      {isComparison && (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={defaultsChecked}
            onChange={(e) => {
              if (e.target.checked) {
                if (formatType === 'digital') {
                  setState({
                    ...state,
                    lensCircle: 'full-frame',
                    bypassLens: false,
                    camera: 'sony-venice',
                    bypassCamera: false,
                    sensorFormat: 'sony-venice-6k-3-2',
                    useCustomPixels: false,
                    anamorphicRatio: '1.5',
                    useCustomAnamorphic: false,
                    desiredAspectRatio: '2.39',
                    useCustomAspectRatio: false,
                  });
                } else {
                  setState({
                    ...state,
                    filmFormat: 'super-35-4perf',
                    filmAnamorphicRatio: '2',
                    useCustomFilmAnamorphic: false,
                    filmDesiredAspectRatio: '2.39',
                    useCustomFilmAspectRatio: false,
                  });
                }
              } else {
                if (formatType === 'digital') {
                  setState({
                    lensCircle: '',
                    bypassLens: false,
                    camera: '',
                    bypassCamera: false,
                    sensorFormat: '',
                    useCustomPixels: false,
                    customPixelWidth: '',
                    customPixelHeight: '',
                    anamorphicRatio: '',
                    useCustomAnamorphic: false,
                    customAnamorphicRatio: '',
                    desiredAspectRatio: '',
                    useCustomAspectRatio: false,
                    customOutputAspectRatio: '',
                  });
                } else {
                  setState({
                    filmFormat: '',
                    filmAnamorphicRatio: '',
                    useCustomFilmAnamorphic: false,
                    customFilmAnamorphic: '',
                    filmDesiredAspectRatio: '',
                    useCustomFilmAspectRatio: false,
                    customFilmAspectRatio: '',
                  });
                }
              }
            }}
            className="w-4 h-4 cursor-pointer"
          />
          <span className="text-black text-opacity-60 font-bold text-xs">DEFAULTS</span>
        </label>
      )}
    </div>

    <div style={{ display: collapsed ? 'none' : 'block' }}>

    {formatType === 'digital' && (
    <div className="mb-6">
      <label className="block text-black text-opacity-60 text-sm font-bold mb-3 tracking-widest">LENS IMAGE CIRCLE</label>
      <div className="grid grid-cols-4 gap-2 mb-3">
        <button
          onClick={() => setState({ ...state, lensCircle: 'super-16', bypassLens: false })}
          className={`py-3 rounded font-bold transition-all border text-sm ${
            state.lensCircle === 'super-16'
              ? 'bg-slate-400 text-black border-slate-400'
              : 'bg-white text-black border-black border-opacity-20 hover:bg-opacity-20'
          }`}
        >
          Super 16
        </button>
        <button
          onClick={() => setState({ ...state, lensCircle: 'super-35', bypassLens: false })}
          className={`py-3 rounded font-bold transition-all border text-sm ${
            state.lensCircle === 'super-35'
              ? 'bg-slate-400 text-black border-slate-400'
              : 'bg-white text-black border-black border-opacity-20 hover:bg-opacity-20'
          }`}
        >
          Super 35
        </button>
        <button
          onClick={() => setState({ ...state, lensCircle: 'full-frame', bypassLens: false })}
          className={`py-3 rounded font-bold transition-all border text-sm ${
            state.lensCircle === 'full-frame'
              ? 'bg-slate-400 text-black border-slate-400'
              : 'bg-white text-black border-black border-opacity-20 hover:bg-opacity-20'
          }`}
        >
          Full Frame
        </button>
        <button
          onClick={() => setState({ ...state, lensCircle: '65mm', bypassLens: false })}
          className={`py-3 rounded font-bold transition-all border text-sm ${
            state.lensCircle === '65mm'
              ? 'bg-slate-400 text-black border-slate-400'
              : 'bg-white text-black border-black border-opacity-20 hover:bg-opacity-20'
          }`}
        >
          65mm
        </button>
      </div>
      <button
        onClick={() => setState({ ...state, bypassLens: !state.bypassLens, lensCircle: !state.bypassLens ? '' : state.lensCircle })}
        className={`w-full py-2 rounded text-sm font-bold transition-all border ${
          state.bypassLens
            ? 'bg-slate-400 text-black border-slate-400'
            : 'bg-white text-black border-black border-opacity-20 hover:bg-opacity-20'
        }`}
      >
        {state.bypassLens ? '✓ BYPASS SELECTION' : 'BYPASS SELECTION'}
      </button>
    </div>
    )}

    <div className="mb-6">
      <label className="block text-black text-opacity-60 text-sm font-bold mb-3 tracking-widest">{formatType === 'film' ? 'CAMERA NEGATIVE' : 'CAMERA'}</label>
      <div className="relative mb-3">
        <select
          value={formatType === 'film' ? (state.filmFormat || '') : (state.camera || '')}
          onChange={(e) => {
            if (formatType === 'film') {
              setState({ ...state, filmFormat: e.target.value, sensorFormat: '' });
            } else {
              setState({ ...state, camera: e.target.value, sensorFormat: '', bypassCamera: false });
            }
          }}
          className="w-full bg-gray-100 border border-black border-opacity-15 text-black px-4 py-3 rounded appearance-none focus:outline-none focus:border-slate-400 transition-all cursor-pointer font-mono text-sm"
        >
          <option value="">{formatType === 'film' ? '-- Please Select Format --' : '-- Please Select Camera --'}</option>
          {(formatType === 'film' ? filmFormats : cameras).map((item) => (
            <option key={item.id} value={item.id} className="bg-white text-black">
              {item.displayName || item.name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black text-opacity-60 pointer-events-none" />
      </div>
      {formatType === 'digital' && (
        <button
          onClick={() => setState({ ...state, bypassCamera: !state.bypassCamera, camera: !state.bypassCamera ? '' : state.camera })}
          className={`w-full py-2 rounded text-sm font-bold transition-all border ${
            state.bypassCamera
              ? 'bg-slate-400 text-black border-slate-400'
              : 'bg-white text-black border-black border-opacity-20 hover:bg-opacity-20'
          }`}
        >
          {state.bypassCamera ? '✓ BYPASS SELECTION' : 'BYPASS SELECTION'}
        </button>
      )}
    </div>

    {formatType === 'digital' && (
    <div className="mb-6">
      <label className="block text-black text-opacity-60 text-sm font-bold mb-3 tracking-widest">SENSOR FORMAT</label>
      <div className="relative mb-3">
        <select
          value={state.sensorFormat}
          onChange={(e) => setState({ ...state, sensorFormat: e.target.value, useCustomPixels: false })}
          className="w-full bg-gray-100 border border-black border-opacity-15 text-black px-4 py-3 rounded appearance-none focus:outline-none focus:border-slate-400 transition-all cursor-pointer font-mono text-sm"
        >
          <option value="">-- Please Select Sensor Format --</option>
          {Object.entries(sensors).map(([key, sensor]) => {
            const sensorCircle = sensorImageCircle[key];
            const isDisabled = state.lensCircle && sensorCircle && sensorCircle !== state.lensCircle && sensorCircle !== 'both';
            return (
              <option 
                key={key} 
                value={key} 
                disabled={isDisabled}
                className={isDisabled ? "bg-white text-gray-400" : "bg-white text-black"}
                style={{ opacity: isDisabled ? 0.5 : 1 }}
              >
                {isDisabled ? '✗ ' : ''}{sensor.name} | {sensor.aspectRatio}
              </option>
            );
          })}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black text-opacity-60 pointer-events-none" />
      </div>

      <div className="mb-8 bg-gray-100 border border-black border-opacity-15 rounded-lg p-2 md:p-4">
        <label className="flex items-center gap-3 text-black text-sm font-bold mb-3 cursor-pointer">
          <input
            type="checkbox"
            checked={state.useCustomPixels}
            onChange={(e) => setState({ ...state, useCustomPixels: e.target.checked, sensorFormat: '' })}
            className="w-5 h-5 cursor-pointer"
          />
          <span className="text-black text-opacity-60">CUSTOM RESOLUTION</span>
        </label>
        <div className="space-y-3" style={{ display: state.useCustomPixels ? 'block' : 'none' }}>
          <input
            type="number"
            value={localCustomPixelWidth}
            onChange={(e) => setLocalCustomPixelWidth(e.target.value)}
            placeholder="Width (px)"
            className="w-full bg-white border border-slate-400 border-opacity-40 text-black px-4 py-2 rounded focus:outline-none focus:border-slate-400 transition-all font-mono text-sm"
          />
          <input
            type="number"
            value={localCustomPixelHeight}
            onChange={(e) => setLocalCustomPixelHeight(e.target.value)}
            placeholder="Height (px)"
            className="w-full bg-white border border-slate-400 border-opacity-40 text-black px-4 py-2 rounded focus:outline-none focus:border-slate-400 transition-all font-mono text-sm"
          />
        </div>
      </div>
    </div>
    )}

    <div className="mb-6">
      <label className="block text-black text-opacity-60 text-sm font-bold mb-3 tracking-widest">SQUEEZE RATIO</label>
      {formatType === 'digital' && !state.sensorFormat && !state.useCustomPixels && <p className="text-black text-xs opacity-60 mb-3">Select a sensor format first</p>}
      {formatType === 'film' && !state.filmFormat && <p className="text-black text-xs opacity-60 mb-3">Select a film format first</p>}
      <div className={`grid gap-2 mb-3 ${formatType === 'digital' ? 'grid-cols-5' : 'grid-cols-4'}`}>
        {(formatType === 'film' ? filmAnamorphicOptions : anamorphicOptions).map((opt) => (
          <button
            key={opt.value}
            disabled={(formatType === 'film' && state.useCustomFilmAnamorphic) || (formatType === 'digital' && state.useCustomAnamorphic)}
            onClick={() => {
              if (formatType === 'film') {
                setState({ ...state, filmAnamorphicRatio: opt.value, useCustomFilmAnamorphic: false });
              } else {
                // Explicitly preserve custom resolution state and uncheck custom anamorphic
                setState({ ...state, anamorphicRatio: opt.value, useCustomAnamorphic: false, useCustomPixels: state.useCustomPixels });
              }
            }}
            className={`py-2 rounded text-sm font-bold transition-all border ${
              (formatType === 'film' && state.useCustomFilmAnamorphic) || (formatType === 'digital' && state.useCustomAnamorphic)
                ? 'bg-white text-gray-400 border-gray-600 opacity-50 cursor-not-allowed'
                : (formatType === 'film' ? state.filmAnamorphicRatio : state.anamorphicRatio) === opt.value
                ? 'bg-slate-400 text-black border-slate-400'
                : 'bg-white text-black border-black border-opacity-20 hover:bg-opacity-20'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="bg-gray-100 border border-black border-opacity-15 rounded-lg p-2 md:p-4">
        <label className="flex items-center gap-3 text-black text-sm font-bold mb-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formatType === 'film' ? state.useCustomFilmAnamorphic : state.useCustomAnamorphic}
            onChange={(e) => {
              if (formatType === 'film') {
                setState({ ...state, useCustomFilmAnamorphic: e.target.checked });
              } else {
                setState({ ...state, useCustomAnamorphic: e.target.checked });
              }
            }}
            className="w-5 h-5 cursor-pointer"
          />
          <span className="text-black text-opacity-60">CUSTOM RATIO</span>
        </label>
        <div style={{ display: (formatType === 'film' ? state.useCustomFilmAnamorphic : state.useCustomAnamorphic) ? 'block' : 'none' }}>
          <input
            type="number"
            step="0.1"
            value={localCustomAnamorphic}
            onChange={(e) => setLocalCustomAnamorphic(e.target.value)}
            placeholder="e.g., 2.0"
            className="w-full bg-white border border-slate-400 border-opacity-40 text-black px-4 py-2 rounded focus:outline-none focus:border-slate-400 transition-all font-mono text-sm"
          />
        </div>
      </div>
    </div>

    <div className="mb-6">
      <label className="block text-black text-opacity-60 text-sm font-bold mb-3 tracking-widest">OUTPUT ASPECT RATIO</label>
      <div className="grid grid-cols-4 gap-2 mb-3">
        {aspectRatioOptions.map((opt) => (
          <button
            key={opt.value}
            disabled={(formatType === 'film' && state.useCustomFilmAspectRatio) || (formatType === 'digital' && state.useCustomAspectRatio)}
            onClick={() => {
              if (formatType === 'film') {
                setState({ ...state, filmDesiredAspectRatio: opt.value, useCustomFilmAspectRatio: false });
              } else {
                // Explicitly preserve custom resolution state
                setState({ ...state, desiredAspectRatio: opt.value, useCustomAspectRatio: false, useCustomPixels: state.useCustomPixels });
              }
            }}
            className={`py-1.5 px-2 rounded text-xs font-bold transition-all border ${
              (formatType === 'film' && state.useCustomFilmAspectRatio) || (formatType === 'digital' && state.useCustomAspectRatio)
                ? 'bg-white text-gray-400 border-gray-600 opacity-50 cursor-not-allowed'
                : (formatType === 'film' ? state.filmDesiredAspectRatio : state.desiredAspectRatio) === opt.value
                ? 'bg-slate-400 text-black border-slate-400'
                : 'bg-white text-black border-black border-opacity-20 hover:bg-opacity-20'
            }`}
          >
            <div className="text-center leading-tight">
              <div>{opt.label}</div>
              <div className="text-xs opacity-75">{opt.divisor}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="bg-gray-100 border border-black border-opacity-15 rounded-lg p-2 md:p-4">
        <label className="flex items-center gap-3 text-black text-sm font-bold mb-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formatType === 'film' ? state.useCustomFilmAspectRatio : state.useCustomAspectRatio}
            onChange={(e) => {
              if (formatType === 'film') {
                setState({ ...state, useCustomFilmAspectRatio: e.target.checked });
              } else {
                setState({ ...state, useCustomAspectRatio: e.target.checked });
              }
            }}
            className="w-5 h-5 cursor-pointer"
          />
          <span className="text-black text-opacity-60">CUSTOM RATIO</span>
        </label>
        <div style={{ display: (formatType === 'film' ? state.useCustomFilmAspectRatio : state.useCustomAspectRatio) ? 'block' : 'none' }}>
          <input
            type="number"
            step="0.01"
            value={localCustomAspectRatio}
            onChange={(e) => setLocalCustomAspectRatio(e.target.value)}
            placeholder="e.g., 2.39"
            className="w-full bg-white border border-slate-400 border-opacity-40 text-black px-4 py-2 rounded focus:outline-none focus:border-slate-400 transition-all font-mono text-sm"
          />
        </div>
      </div>

    </div>
    </div>
    </div>
    );
  }

  // ============================================
  // EXPORT FUNCTIONS
  // ============================================

  const generateShareLink = () => {
    const params = new URLSearchParams();
    
    if (formatType === 'digital') {
    params.append('format', 'digital');
    params.append('camera', selectedCamera);
      params.append('sensorFormat', sensorFormat);
      params.append('anamorphic', useCustomAnamorphic ? customAnamorphicRatio : anamorphicRatio);
      params.append('aspect', useCustomAspectRatio ? customOutputAspectRatio : desiredAspectRatio);
    } else {
      params.append('format', 'film');
      params.append('filmFormat', selectedFilmFormat);
      params.append('anamorphic', useCustomFilmAnamorphic ? customFilmAnamorphic : filmAnamorphicRatio);
      params.append('aspect', useCustomFilmAspectRatio ? customFilmAspectRatio : filmDesiredAspectRatio);
    }
    
    const baseUrl = 'https://owenstrock.com/calc';
    const shareUrl = `${baseUrl}?${params.toString()}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('Share link copied to clipboard!');
    }).catch(() => {
      prompt('Share this link:', shareUrl);
    });
  };

  const generateComparisonShareLink = (index) => {
    const state = comparisonStates[index];
    const params = new URLSearchParams();
    
    if (formatType === 'digital') {
      params.append('format', 'digital');
      params.append('camera', state.camera || '');
      params.append('sensorFormat', state.sensorFormat || '');
      params.append('anamorphic', state.anamorphicRatio || '');
      params.append('aspect', state.desiredAspectRatio || '');
    } else {
      params.append('format', 'film');
      params.append('filmFormat', state.filmFormat || '');
      params.append('anamorphic', state.filmAnamorphicRatio || '');
      params.append('aspect', state.filmDesiredAspectRatio || '');
    }
    
    const baseUrl = 'https://owenstrock.com/calc';
    const shareUrl = `${baseUrl}?${params.toString()}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('Share link copied to clipboard!');
    }).catch(() => {
      prompt('Share this link:', shareUrl);
    });
  };

  const downloadScreenshot = async () => {
    try {
      const html2canvas = (await import('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js')).default;
      const visualizerElement = document.querySelector('[data-export-visualizer]');
      
      if (!visualizerElement) {
        alert('Visualizer not found');
        return;
      }
      
      const canvas = await html2canvas(visualizerElement, {
        backgroundColor: '#0f0f14',
        scale: 2,
      });
      
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `anamorphic-${formatType}-${new Date().toISOString().split('T')[0]}.png`;
      link.click();
    } catch (error) {
      console.error('Screenshot error:', error);
      alert('Could not generate screenshot');
    }
  };

  const downloadPDF = async () => {
    try {
      const jsPDF = (await import('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')).jsPDF;
      const html2canvas = (await import('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js')).default;
      
      const visualizerElement = document.querySelector('[data-export-visualizer]');
      if (!visualizerElement) {
        alert('Visualizer not found');
        return;
      }

      const canvas = await html2canvas(visualizerElement, {
        backgroundColor: '#0f0f14',
        scale: 2,
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 10, 20, imgWidth, imgHeight);
      
      // Add metadata
      let yPosition = imgHeight + 40;
      pdf.setFontSize(12);
      pdf.text('ANAMORPHIC CALCULATOR EXPORT', 10, yPosition);
      
      yPosition += 10;
      pdf.setFontSize(10);
      
      if (formatType === 'digital') {
        const camera = cameraList.find(c => c.id === selectedCamera);
        const sensor = sensorsByCamera[selectedCamera]?.[sensorFormat];
        pdf.text(`Camera: ${camera?.name || 'N/A'}`, 10, yPosition);
        yPosition += 7;
        pdf.text(`Sensor: ${sensor?.name || 'N/A'}`, 10, yPosition);
        yPosition += 7;
        pdf.text(`Squeeze Ratio: ${useCustomAnamorphic ? customAnamorphicRatio : anamorphicRatio}x`, 10, yPosition);
        yPosition += 7;
        pdf.text(`Desired Aspect: ${useCustomAspectRatio ? customOutputAspectRatio : desiredAspectRatio}:1`, 10, yPosition);
        yPosition += 7;
        if (calculateDigital) {
          pdf.text(`Natural Aspect: ${calculateDigital.naturalAspectRatio}:1`, 10, yPosition);
          yPosition += 7;
          pdf.text(`Coverage: ${calculateDigital.coverage}%`, 10, yPosition);
        }
      } else {
        const format = filmFormats.find(f => f.id === selectedFilmFormat);
        pdf.text(`Film Format: ${format?.name || 'N/A'}`, 10, yPosition);
        yPosition += 7;
        pdf.text(`Squeeze Ratio: ${useCustomFilmAnamorphic ? customFilmAnamorphic : filmAnamorphicRatio}x`, 10, yPosition);
        yPosition += 7;
        pdf.text(`Desired Aspect: ${useCustomFilmAspectRatio ? customFilmAspectRatio : filmDesiredAspectRatio}:1`, 10, yPosition);
        yPosition += 7;
        if (calculateFilm) {
          pdf.text(`Negative Aspect: ${calculateFilm.negativeAspect}:1`, 10, yPosition);
          yPosition += 7;
          pdf.text(`Coverage: ${calculateFilm.cropPercentageOfUnsqueezed}%`, 10, yPosition);
        }
      }
      
      yPosition += 10;
      pdf.setFontSize(8);
      pdf.text(`Exported: ${new Date().toLocaleString()}`, 10, yPosition);
      
      pdf.save(`anamorphic-${formatType}-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('PDF error:', error);
      alert('Could not generate PDF');
    }
  };

  // ============================================
  // MAIN RETURN / LAYOUT
  // ============================================

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      
      

      
      <div className="max-w-6xl mx-auto px-3 sm:px-6 md:px-8 py-4">
        <div className="mb-3 py-6">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight mb-4 text-black" style={{ fontWeight: 300, letterSpacing: '-1px' }}>
              ANAMORPHIC LENS CALCULATOR
            </h1>
            <div className="w-16 h-px bg-black bg-opacity-30 mx-auto mb-4"></div>
          </div>
        </div>

        {/* FORMAT TYPE SELECTOR + DEFAULTS */}
        <div className="mt-2 mb-6 flex justify-center gap-2 items-center flex-wrap">
          <div className="flex gap-4">
            <button
              onClick={() => setFormatType('digital')}
              className={`px-8 py-2 rounded font-bold transition-all border ${
                formatType === 'digital'
                  ? 'bg-slate-400 text-gray-900 border-slate-400'
                  : 'bg-white text-black border-black border-opacity-20 hover:border-opacity-40'
              }`}
            >
              DIGITAL
            </button>
            <button
              onClick={() => setFormatType('film')}
              className={`px-8 py-2 rounded font-bold transition-all border ${
                formatType === 'film'
                  ? 'bg-slate-400 text-gray-900 border-slate-400'
                  : 'bg-white text-black border-black border-opacity-20 hover:border-opacity-40'
              }`}
            >
              FILM
            </button>
          </div>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              key={formatType}
              type="checkbox"
              checked={showDefaults}
              onChange={(e) => {
                setShowDefaults(e.target.checked);
                if (e.target.checked) {
                  if (formatType === 'digital') {
                    // Digital defaults
                    setBypassLensCircle(false);
                    setBypassCameraSelection(false);
                    setLensImageCircle('full-frame');
                    setSelectedCamera('sony-venice');
                    setSensorFormat('sony-venice-6k-3-2');
                    setUseCustomPixels(false);
                    setAnamorphicRatio('1.5');
                    setDesiredAspectRatio('2.39');
                    setUseCustomAnamorphic(false);
                    setUseCustomAspectRatio(false);
                  } else {
                    // Film defaults
                    setSelectedFilmFormat('super-35-4perf');
                    setFilmAnamorphicRatio('2');
                    setFilmDesiredAspectRatio('2.39');
                    setUseCustomFilmAnamorphic(false);
                    setUseCustomFilmAspectRatio(false);
                  }
                } else {
                  // Clear all to base state
                  setBypassLensCircle(false);
                  setBypassCameraSelection(false);
                  setLensImageCircle('');
                  setSelectedCamera('');
                  setSensorFormat('');
                  setAnamorphicRatio('');
                  setDesiredAspectRatio('');
                  setUseCustomPixels(false);
                  setCustomPixelWidth('');
                  setCustomPixelHeight('');
                  setUseCustomAnamorphic(false);
                  setCustomAnamorphicRatio('');
                  setUseCustomAspectRatio(false);
                  setCustomOutputAspectRatio('');
                  setSelectedFilmFormat('');
                  setFilmAnamorphicRatio('');
                  setFilmDesiredAspectRatio('');
                  setUseCustomFilmAnamorphic(false);
                  setCustomFilmAnamorphic('');
                  setUseCustomFilmAspectRatio(false);
                  setCustomFilmAspectRatio('');
                }
              }}
              className="w-4 h-4 cursor-pointer"
            />
            <span className="text-black text-opacity-60 font-bold text-xs">DEFAULTS</span>
          </label>
        </div>




        {/* MAIN CALCULATOR GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ParametersPanel
              state={{
                lensCircle: lensImageCircle, bypassLens: bypassLensCircle, camera: selectedCamera, filmFormat: selectedFilmFormat, bypassCamera: bypassCameraSelection, sensorFormat, useCustomPixels, customPixelWidth, customPixelHeight, anamorphicRatio, useCustomAnamorphic, customAnamorphicRatio, desiredAspectRatio, useCustomAspectRatio, customOutputAspectRatio, filmAnamorphicRatio, useCustomFilmAnamorphic, customFilmAnamorphic, filmDesiredAspectRatio, useCustomFilmAspectRatio, customFilmAspectRatio,
              }}
              setState={useCallback((newState) => {
                if (newState.lensCircle !== undefined) setLensImageCircle(newState.lensCircle);
                if (newState.bypassLens !== undefined) setBypassLensCircle(newState.bypassLens);
                if (newState.camera !== undefined) setSelectedCamera(newState.camera);
                if (newState.filmFormat !== undefined) setSelectedFilmFormat(newState.filmFormat);
                if (newState.bypassCamera !== undefined) setBypassCameraSelection(newState.bypassCamera);
                if (newState.sensorFormat !== undefined) setSensorFormat(newState.sensorFormat);
                if (newState.useCustomPixels !== undefined) setUseCustomPixels(newState.useCustomPixels);
                if (newState.customPixelWidth !== undefined) setCustomPixelWidth(newState.customPixelWidth);
                if (newState.customPixelHeight !== undefined) setCustomPixelHeight(newState.customPixelHeight);
                if (newState.anamorphicRatio !== undefined) setAnamorphicRatio(newState.anamorphicRatio);
                if (newState.useCustomAnamorphic !== undefined) setUseCustomAnamorphic(newState.useCustomAnamorphic);
                if (newState.customAnamorphicRatio !== undefined) setCustomAnamorphicRatio(newState.customAnamorphicRatio);
                if (newState.desiredAspectRatio !== undefined) setDesiredAspectRatio(newState.desiredAspectRatio);
                if (newState.useCustomAspectRatio !== undefined) setUseCustomAspectRatio(newState.useCustomAspectRatio);
                if (newState.customOutputAspectRatio !== undefined) setCustomOutputAspectRatio(newState.customOutputAspectRatio);
                if (newState.filmAnamorphicRatio !== undefined) setFilmAnamorphicRatio(newState.filmAnamorphicRatio);
                if (newState.useCustomFilmAnamorphic !== undefined) setUseCustomFilmAnamorphic(newState.useCustomFilmAnamorphic);
                if (newState.customFilmAnamorphic !== undefined) setCustomFilmAnamorphic(newState.customFilmAnamorphic);
                if (newState.filmDesiredAspectRatio !== undefined) setFilmDesiredAspectRatio(newState.filmDesiredAspectRatio);
                if (newState.useCustomFilmAspectRatio !== undefined) setUseCustomFilmAspectRatio(newState.useCustomFilmAspectRatio);
                if (newState.customFilmAspectRatio !== undefined) setCustomFilmAspectRatio(newState.customFilmAspectRatio);
              }, [])}
              formatType={formatType} filmFormats={filmFormats} cameras={filteredCameraList} sensors={currentSensors}
            />
          </div>
          <div className="lg:col-span-2">
            {formatType === 'digital' ? (
              (!selectedCamera && !bypassCameraSelection) || (!useCustomPixels && !sensorFormat) || (!anamorphicRatio && !useCustomAnamorphic) || (!desiredAspectRatio && !useCustomAspectRatio) || (useCustomAnamorphic && !customAnamorphicRatio) || (useCustomAspectRatio && !customOutputAspectRatio) ? (
                <div className="bg-gray-100 border border-black border-opacity-15 rounded-lg p-8 text-center"><p className="text-black text-lg opacity-60">Select all parameters above to view calculations</p></div>
              ) : calculateDigital ? (
                <div data-export-visualizer className="bg-gray-200 border border-black border-opacity-15 rounded-lg p-6">
                  <h3 className="text-black text-lg font-bold mb-6 tracking-wider">DESQUEEZED OUTPUT</h3>
                  <div className="flex justify-center items-center mb-8">
                    <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
                      <div className="bg-slate-400 border-2 border-blue-600 relative" style={{ aspectRatio: (calculateDigital.usedPixelWidth * calculateDigital.anamorphic) / calculateDigital.usedPixelHeight || 2.0 }}>
                        <div className="absolute border-2 border-green-400" style={{ left: `${Math.max(0, Math.min(100, ((calculateDigital.usedPixelWidth - calculateDigital.croppedPixelWidth) / calculateDigital.usedPixelWidth / 2) * 100))}%`, top: `${Math.max(0, Math.min(100, ((calculateDigital.desqueezedHeight - calculateDigital.croppedPixelHeight) / calculateDigital.desqueezedHeight / 2) * 100))}%`, width: `${Math.max(0, Math.min(100, (calculateDigital.croppedPixelWidth / calculateDigital.usedPixelWidth) * 100))}%`, height: `${Math.max(0, Math.min(100, (calculateDigital.croppedPixelHeight / calculateDigital.desqueezedHeight) * 100))}%`, boxSizing: 'border-box' }} />
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-black border-opacity-10">
                    <p className="text-black text-opacity-60 text-xs font-bold mb-2">LEGEND</p>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="flex items-center gap-2"><div className="w-3 h-3 border-2 border-blue-600 bg-slate-400"></div><span className="text-black text-opacity-60 font-bold">Desqueezed: {calculateDigital.usedPixelWidth}×{calculateDigital.desqueezedHeight}</span></div>
                      <div className="flex items-center gap-2"><div className="w-3 h-3 border-2 border-green-400 bg-slate-400"></div><span className="text-black text-opacity-60">Cropped: {calculateDigital.croppedPixelWidth}×{calculateDigital.croppedPixelHeight}</span></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-green-100 border border-green-400 rounded-lg p-2 md:p-4"><div className="text-black text-xs sm:text-sm font-bold tracking-widest mb-2">UNSQUEEZED ASPECT</div><div className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold break-words text-black">{calculateDigital.naturalAspectRatio}:1</div></div>
                    <div className="bg-blue-100 border border-blue-400 rounded-lg p-2 md:p-4"><div className="text-black text-xs sm:text-sm font-bold tracking-widest mb-2">DESIRED OUTPUT</div><div className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold break-words text-black">{calculateDigital.aspectRatio}:1</div></div>
                    <div className={`rounded-lg p-2 md:p-4 lg:p-6 ${parseFloat(calculateDigital.cropPercentage) > 0 ? 'bg-emerald-200 border border-emerald-500' : 'bg-green-100 border border-green-400'}`}><div className="text-black text-xs sm:text-sm font-bold tracking-widest mb-2">CROP NEEDED</div><div className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold break-words text-black">{calculateDigital.cropPixelsNeeded}</div><div className="text-black text-xs mt-2">pixels</div></div>
                    <div className="bg-indigo-200 border border-indigo-500 rounded-lg p-2 md:p-4"><div className="text-black text-xs sm:text-sm font-bold tracking-widest mb-2">OUTPUT UTILIZATION</div><div className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold break-words text-black">{calculateDigital.coverage}%</div></div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="bg-gray-100 border border-black border-opacity-15 rounded-lg p-2 md:p-4"><div className="text-black text-xs sm:text-sm font-bold tracking-widest mb-2">CROP TOP</div><div className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold break-words text-black">{calculateDigital.desqueezedHeight > calculateDigital.desqueezedCroppedHeight ? Math.round((calculateDigital.desqueezedHeight - calculateDigital.desqueezedCroppedHeight) / 2) : 0}</div><div className="text-black text-xs mt-2">pixels</div></div>
                    <div className="bg-gray-100 border border-black border-opacity-15 rounded-lg p-2 md:p-4"><div className="text-black text-xs sm:text-sm font-bold tracking-widest mb-2">CROP BOTTOM</div><div className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold break-words text-black">{calculateDigital.desqueezedHeight > calculateDigital.desqueezedCroppedHeight ? Math.round((calculateDigital.desqueezedHeight - calculateDigital.desqueezedCroppedHeight) / 2) : 0}</div><div className="text-black text-xs mt-2">pixels</div></div>
                    <div className="bg-gray-100 border border-black border-opacity-15 rounded-lg p-2 md:p-4"><div className="text-black text-xs sm:text-sm font-bold tracking-widest mb-2">CROP LEFT</div><div className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold break-words text-black">{calculateDigital.croppedPixelWidth < calculateDigital.usedPixelWidth ? Math.round((calculateDigital.usedPixelWidth - calculateDigital.croppedPixelWidth) / 2) : 0}</div><div className="text-black text-xs mt-2">pixels</div></div>
                    <div className="bg-gray-100 border border-black border-opacity-15 rounded-lg p-2 md:p-4"><div className="text-black text-xs sm:text-sm font-bold tracking-widest mb-2">CROP RIGHT</div><div className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold break-words text-black">{calculateDigital.croppedPixelWidth < calculateDigital.usedPixelWidth ? Math.round((calculateDigital.usedPixelWidth - calculateDigital.croppedPixelWidth) / 2) : 0}</div><div className="text-black text-xs mt-2">pixels</div></div>
                  </div>
                  <div className="flex justify-center gap-3 mt-8">
                    <button onClick={generateShareLink} className="px-4 py-2 rounded font-semibold transition-all border bg-white text-black border-black border-opacity-20 hover:border-opacity-40 flex items-center justify-center gap-2 text-sm"><span>🔗</span> SHARE</button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-100 border border-black border-opacity-15 rounded-lg p-8 text-center"><p className="text-black text-lg opacity-60">Select all parameters above to view calculations</p></div>
              )
            ) : (
              !selectedFilmFormat || (!filmAnamorphicRatio && !useCustomFilmAnamorphic) || (!filmDesiredAspectRatio && !useCustomFilmAspectRatio) ? (
                <div className="bg-gray-100 border border-black border-opacity-15 rounded-lg p-8 text-center"><p className="text-black text-lg opacity-60">Select all parameters above to view calculations</p></div>
              ) : calculateFilm ? (
                <div data-export-visualizer className="bg-gray-100 border border-black border-opacity-15 rounded-lg p-8">
                  <h3 className="text-black text-xl font-bold mb-4">NEGATIVE VISUALIZATION</h3>
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    <div className="bg-white bg-opacity-5 p-2 rounded border border-black border-opacity-10"><p className="text-black text-opacity-60 text-xs font-bold mb-1">NEGATIVE DIMENSIONS</p><p className="text-black font-mono text-xs">{calculateFilm.negativeWidth}×{calculateFilm.negativeHeight}mm</p></div>
                    <div className="bg-white bg-opacity-5 p-2 rounded border border-black border-opacity-10"><p className="text-black text-opacity-60 text-xs font-bold mb-1">SQUEEZE</p><p className="text-black font-mono text-xs">{calculateFilm.squeeze}x</p></div>
                    <div className="bg-white bg-opacity-5 p-2 rounded border border-black border-opacity-10"><p className="text-black text-opacity-60 text-xs font-bold mb-1">NEGATIVE ASPECT</p><p className="text-black font-mono text-xs">{calculateFilm.negativeAspect}:1</p></div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-8 items-stretch mb-6">
                    <div className="flex flex-col items-center justify-between gap-1">
                      <div className="flex flex-col items-center"><p className="text-black text-opacity-60 text-xs font-bold mb-1">Negative</p><div className="border-2 border-amber-400 bg-gray-300" style={{ width: '80px', height: `${(calculateFilm.negativeHeight / calculateFilm.negativeWidth) * 80}px` }} /><p className="text-black text-opacity-50 text-xs font-mono mt-1">{calculateFilm.negativeWidth}×{calculateFilm.negativeHeight}mm</p></div>
                      <div className="flex flex-col items-center gap-0 flex-shrink-0"><div className="h-6 w-1 bg-gradient-to-b from-amber-400 to-emerald-400"></div><p className="text-emerald-400 font-bold text-xs">{calculateFilm.squeeze}x</p><div className="w-1.5 h-1.5 border-b border-r border-emerald-400 transform rotate-45"></div></div>
                      <div className="flex flex-col items-center"><p className="text-black text-opacity-60 text-xs font-bold mb-1">Unsqueezed</p><div className="border-2 border-blue-600 bg-gray-300" style={{ width: '160px', height: `${(1 / calculateFilm.unSqueezeAspect) * 160}px` }} /><p className="text-black text-opacity-50 text-xs font-mono mt-1">{calculateFilm.unSqueezeAspect}:1</p></div>
                    </div>
                    <div className="flex flex-col items-center flex-1 md:flex-[1.5]">
                      <p className="text-black text-opacity-60 text-sm font-bold mb-4">YOUR OUTPUT (with desired crop)</p>
                      <div className="border-2 border-blue-600 bg-slate-400 relative w-full" style={{ maxWidth: '100%', aspectRatio: `${calculateFilm.unSqueezeAspect} / 1` }}>
                        {calculateFilm.desiredAspect !== calculateFilm.unSqueezeAspect && (<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-green-400 bg-slate-400" style={{ width: calculateFilm.isInsufficient ? '100%' : `${calculateFilm.cropPercentageOfUnsqueezed}%`, height: calculateFilm.isInsufficient ? `${calculateFilm.cropPercentageOfUnsqueezed}%` : '100%' }} />)}
                        {calculateFilm.desiredAspect !== calculateFilm.unSqueezeAspect && !calculateFilm.isInsufficient && (<><div className="absolute top-0 bottom-0 left-0 bg-slate-400" style={{ width: `${((1 - (calculateFilm.cropPercentageOfUnsqueezed / 100)) / 2) * 100}%` }} /><div className="absolute top-0 bottom-0 right-0 bg-slate-400" style={{ width: `${((1 - (calculateFilm.cropPercentageOfUnsqueezed / 100)) / 2) * 100}%` }} /></>)}
                        {calculateFilm.desiredAspect !== calculateFilm.unSqueezeAspect && calculateFilm.isInsufficient && (<><div className="absolute top-0 left-0 right-0 bg-slate-400" style={{ height: `${((1 - (calculateFilm.cropPercentageOfUnsqueezed / 100)) / 2) * 100}%` }} /><div className="absolute bottom-0 left-0 right-0 bg-slate-400" style={{ height: `${((1 - (calculateFilm.cropPercentageOfUnsqueezed / 100)) / 2) * 100}%` }} /></>)}
                      </div>
                      <p className="text-black text-opacity-50 text-xs font-mono mt-3">{calculateFilm.unSqueezeAspect}:1 | Coverage: {calculateFilm.cropPercentageOfUnsqueezed}% | Desired: {calculateFilm.desiredAspect}:1</p>
                      <p className="text-black text-opacity-60 text-xs font-mono mt-2">Output on negative: {calculateFilm.outputNegativeWidth}×{calculateFilm.outputNegativeHeight}mm</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-black border-opacity-10 mb-6">
                    <p className="text-black text-opacity-60 text-xs font-bold mb-2">LEGEND</p>
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div className="flex items-center gap-2"><div className="w-3 h-3 border-2 border-amber-400 bg-slate-400"></div><span className="text-black text-opacity-60">Squeezed Negative</span></div>
                      <div className="flex items-center gap-2"><div className="w-3 h-3 border-2 border-blue-600 bg-slate-400"></div><span className="text-black text-opacity-60">Unsqueezed Image</span></div>
                      <div className="flex items-center gap-2"><div className="w-3 h-3 border-2 border-green-400 bg-slate-400"></div><span className="text-black text-opacity-60">Desired Output</span></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="bg-green-100 border border-green-400 rounded-lg p-2 md:p-4"><div className="text-black text-xs sm:text-sm font-bold tracking-widest mb-2">UNSQUEEZED ASPECT</div><div className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold break-words text-black">{calculateFilm.unSqueezeAspect}:1</div></div>
                    <div className="bg-blue-100 border border-blue-400 rounded-lg p-2 md:p-4"><div className="text-black text-xs sm:text-sm font-bold tracking-widest mb-2">DESIRED ASPECT</div><div className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold break-words text-black">{calculateFilm.desiredAspect}:1</div></div>
                    <div className="bg-emerald-200 border border-emerald-500 rounded-lg p-2 md:p-4"><div className="text-black text-xs sm:text-sm font-bold tracking-widest mb-2">CROP NEEDED</div><div className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold break-words text-black">{calculateFilm.isInsufficient ? 'N/A' : (100 - calculateFilm.cropPercentageOfUnsqueezed).toFixed(1) + '%'}</div><div className="text-black text-xs mt-2">{calculateFilm.isInsufficient ? '' : 'of unsqueezed'}</div></div>
                    <div className={`rounded-lg p-2 md:p-4 lg:p-6 ${calculateFilm.isInsufficient ? 'bg-gradient-to-br from-red-500 to-red-700' : 'bg-indigo-200 border border-indigo-500'}`}><div className="text-black text-xs sm:text-sm font-bold tracking-widest mb-2">{calculateFilm.isInsufficient ? 'INSUFFICIENT' : 'IMAGE SIZE'}</div><div className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold break-words text-black">{calculateFilm.isInsufficient ? '✗' : (100 + (100 - calculateFilm.cropPercentageOfUnsqueezed)).toFixed(1) + '%'}</div><div className="text-black text-xs mt-2">{calculateFilm.isInsufficient ? 'needs different parameters' : ''}</div></div>
                  </div>
                  <div className="flex justify-center gap-3 mt-8">
                    <button onClick={generateShareLink} className="px-4 py-2 rounded font-semibold transition-all border bg-white text-black border-black border-opacity-20 hover:border-opacity-40 flex items-center justify-center gap-2 text-sm"><span>🔗</span> SHARE</button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-100 border border-black border-opacity-15 rounded-lg p-8 text-center"><p className="text-black text-lg opacity-60">Select all parameters above to view calculations</p></div>
              )
            )}
          </div>
        </div>

        {/* COMPARISON TABS - outside main grid, full width */}
        {comparisonTabs.map((tabIndex) => {
          const compState = comparisonStates[tabIndex] || {};
          if (formatType === 'digital') {
            const compCamera = compState.camera || '';
            const compSensors = compCamera && sensorsByCamera[compCamera] ? sensorsByCamera[compCamera] : {};
            const compLensCircle = compState.lensCircle || '';
            const compFilteredCameras = cameraList.filter(c => { if (c.format !== 'digital') return false; if (compState.bypassLens || compState.bypassCamera) return true; if (!compLensCircle) return true; if (compLensCircle === 'super-16') return c.id === 'arri-alexa-mini'; return c.lensCircles.includes(compLensCircle); }).map(c => { if (c.isCrop && c.isCrop[compLensCircle]) return { ...c, displayName: `${c.name} (crop)` }; if (compLensCircle && c.lensCircles.length > 1 && c.lensCircles[0] !== compLensCircle && !c.isCrop) return { ...c, displayName: `${c.name} (crop)` }; return { ...c, displayName: c.name }; });
            const compCalcResult = (() => { const cCam = compState.camera||'', cSF = compState.sensorFormat||'', cAR = compState.useCustomAnamorphic ? compState.customAnamorphicRatio : (compState.anamorphicRatio||''), cDAR = compState.useCustomAspectRatio ? compState.customOutputAspectRatio : (compState.desiredAspectRatio||''), cCP = compState.useCustomPixels||false, cBypass = compState.bypassCamera||false; if ((!cCam&&!cBypass)||(!cCP&&!cSF)||!cAR||!cDAR) return null; return computeDigitalResult(cCam, cSF, cAR, cDAR, cCP, compState.customPixelWidth, compState.customPixelHeight); })();
            return (
              <div key={`comp-d-${tabIndex}`} className="mt-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-black text-lg font-bold tracking-wider">CAMERA {tabIndex + 2}</h3>
                  <button onClick={() => { setComparisonTabs(comparisonTabs.filter(t => t !== tabIndex)); const ns=[...comparisonStates]; ns[tabIndex]={}; setComparisonStates(ns); }} className="px-3 py-1 rounded text-sm font-bold transition-all border bg-white text-red-600 border-red-300 hover:bg-red-50">✕ REMOVE</button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <ParametersPanel state={{ lensCircle:compState.lensCircle||'', bypassLens:compState.bypassLens||false, camera:compState.camera||'', bypassCamera:compState.bypassCamera||false, sensorFormat:compState.sensorFormat||'', useCustomPixels:compState.useCustomPixels||false, customPixelWidth:compState.customPixelWidth||'', customPixelHeight:compState.customPixelHeight||'', anamorphicRatio:compState.anamorphicRatio||'', useCustomAnamorphic:compState.useCustomAnamorphic||false, customAnamorphicRatio:compState.customAnamorphicRatio||'', desiredAspectRatio:compState.desiredAspectRatio||'', useCustomAspectRatio:compState.useCustomAspectRatio||false, customOutputAspectRatio:compState.customOutputAspectRatio||'', filmAnamorphicRatio:'', useCustomFilmAnamorphic:false, customFilmAnamorphic:'', filmDesiredAspectRatio:'', useCustomFilmAspectRatio:false, customFilmAspectRatio:'' }} setState={(ns) => { const nss=[...comparisonStates]; nss[tabIndex]={...nss[tabIndex]}; if(ns.lensCircle!==undefined)nss[tabIndex].lensCircle=ns.lensCircle; if(ns.bypassLens!==undefined)nss[tabIndex].bypassLens=ns.bypassLens; if(ns.camera!==undefined&&ns.camera!==nss[tabIndex].camera){nss[tabIndex].camera=ns.camera;nss[tabIndex].sensorFormat='';}else if(ns.camera!==undefined){nss[tabIndex].camera=ns.camera;} if(ns.bypassCamera!==undefined)nss[tabIndex].bypassCamera=ns.bypassCamera; if(ns.sensorFormat!==undefined)nss[tabIndex].sensorFormat=ns.sensorFormat; if(ns.useCustomPixels!==undefined)nss[tabIndex].useCustomPixels=ns.useCustomPixels; if(ns.customPixelWidth!==undefined)nss[tabIndex].customPixelWidth=ns.customPixelWidth; if(ns.customPixelHeight!==undefined)nss[tabIndex].customPixelHeight=ns.customPixelHeight; if(ns.anamorphicRatio!==undefined)nss[tabIndex].anamorphicRatio=ns.anamorphicRatio; if(ns.useCustomAnamorphic!==undefined)nss[tabIndex].useCustomAnamorphic=ns.useCustomAnamorphic; if(ns.customAnamorphicRatio!==undefined)nss[tabIndex].customAnamorphicRatio=ns.customAnamorphicRatio; if(ns.desiredAspectRatio!==undefined)nss[tabIndex].desiredAspectRatio=ns.desiredAspectRatio; if(ns.useCustomAspectRatio!==undefined)nss[tabIndex].useCustomAspectRatio=ns.useCustomAspectRatio; if(ns.customOutputAspectRatio!==undefined)nss[tabIndex].customOutputAspectRatio=ns.customOutputAspectRatio; setComparisonStates(nss); }} isComparison={true} formatType="digital" cameras={compFilteredCameras} sensors={compSensors} />
                  </div>
                  <div className="lg:col-span-2">
                    {compCalcResult ? (
                      <div className="bg-gray-200 border border-black border-opacity-15 rounded-lg p-6">
                        <h3 className="text-black text-lg font-bold mb-6 tracking-wider">DESQUEEZED OUTPUT</h3>
                        <div className="flex justify-center items-center mb-8">
                          <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
                            <div className="bg-slate-400 border-2 border-blue-600 relative" style={{ aspectRatio: (compCalcResult.usedPixelWidth * compCalcResult.anamorphic) / compCalcResult.usedPixelHeight || 2.0 }}>
                              <div className="absolute border-2 border-green-400" style={{ left: `${Math.max(0, Math.min(100, ((compCalcResult.usedPixelWidth - compCalcResult.croppedPixelWidth) / compCalcResult.usedPixelWidth / 2) * 100))}%`, top: `${Math.max(0, Math.min(100, ((compCalcResult.desqueezedHeight - compCalcResult.croppedPixelHeight) / compCalcResult.desqueezedHeight / 2) * 100))}%`, width: `${Math.max(0, Math.min(100, (compCalcResult.croppedPixelWidth / compCalcResult.usedPixelWidth) * 100))}%`, height: `${Math.max(0, Math.min(100, (compCalcResult.croppedPixelHeight / compCalcResult.desqueezedHeight) * 100))}%`, boxSizing: 'border-box' }} />
                            </div>
                          </div>
                        </div>
                        <div className="pt-4 border-t border-black border-opacity-10">
                          <p className="text-black text-opacity-60 text-xs font-bold mb-2">LEGEND</p>
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="flex items-center gap-2"><div className="w-3 h-3 border-2 border-blue-600 bg-slate-400"></div><span className="text-black text-opacity-60 font-bold">Desqueezed: {compCalcResult.usedPixelWidth}×{compCalcResult.desqueezedHeight}</span></div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 border-2 border-green-400 bg-slate-400"></div><span className="text-black text-opacity-60">Cropped: {compCalcResult.croppedPixelWidth}×{compCalcResult.croppedPixelHeight}</span></div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-6">
                          <div className="bg-green-100 border border-green-400 rounded-lg p-2 md:p-4"><div className="text-black text-xs sm:text-sm font-bold tracking-widest mb-2">UNSQUEEZED ASPECT</div><div className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold break-words text-black">{compCalcResult.naturalAspectRatio}:1</div></div>
                          <div className="bg-blue-100 border border-blue-400 rounded-lg p-2 md:p-4"><div className="text-black text-xs sm:text-sm font-bold tracking-widest mb-2">DESIRED OUTPUT</div><div className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold break-words text-black">{compCalcResult.aspectRatio}:1</div></div>
                          <div className={`rounded-lg p-2 md:p-4 lg:p-6 ${parseFloat(compCalcResult.cropPercentage) > 0 ? 'bg-emerald-200 border border-emerald-500' : 'bg-green-100 border border-green-400'}`}><div className="text-black text-xs sm:text-sm font-bold tracking-widest mb-2">CROP NEEDED</div><div className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold break-words text-black">{compCalcResult.cropPixelsNeeded}</div><div className="text-black text-xs mt-2">pixels</div></div>
                          <div className="bg-indigo-200 border border-indigo-500 rounded-lg p-2 md:p-4"><div className="text-black text-xs sm:text-sm font-bold tracking-widest mb-2">OUTPUT UTILIZATION</div><div className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold break-words text-black">{compCalcResult.coverage}%</div></div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                          <div className="bg-gray-100 border border-black border-opacity-15 rounded-lg p-2 md:p-4"><div className="text-black text-xs sm:text-sm font-bold tracking-widest mb-2">CROP TOP</div><div className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold break-words text-black">{compCalcResult.desqueezedHeight > compCalcResult.desqueezedCroppedHeight ? Math.round((compCalcResult.desqueezedHeight - compCalcResult.desqueezedCroppedHeight) / 2) : 0}</div><div className="text-black text-xs mt-2">pixels</div></div>
                          <div className="bg-gray-100 border border-black border-opacity-15 rounded-lg p-2 md:p-4"><div className="text-black text-xs sm:text-sm font-bold tracking-widest mb-2">CROP BOTTOM</div><div className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold break-words text-black">{compCalcResult.desqueezedHeight > compCalcResult.desqueezedCroppedHeight ? Math.round((compCalcResult.desqueezedHeight - compCalcResult.desqueezedCroppedHeight) / 2) : 0}</div><div className="text-black text-xs mt-2">pixels</div></div>
                          <div className="bg-gray-100 border border-black border-opacity-15 rounded-lg p-2 md:p-4"><div className="text-black text-xs sm:text-sm font-bold tracking-widest mb-2">CROP LEFT</div><div className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold break-words text-black">{compCalcResult.croppedPixelWidth < compCalcResult.usedPixelWidth ? Math.round((compCalcResult.usedPixelWidth - compCalcResult.croppedPixelWidth) / 2) : 0}</div><div className="text-black text-xs mt-2">pixels</div></div>
                          <div className="bg-gray-100 border border-black border-opacity-15 rounded-lg p-2 md:p-4"><div className="text-black text-xs sm:text-sm font-bold tracking-widest mb-2">CROP RIGHT</div><div className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold break-words text-black">{compCalcResult.croppedPixelWidth < compCalcResult.usedPixelWidth ? Math.round((compCalcResult.usedPixelWidth - compCalcResult.croppedPixelWidth) / 2) : 0}</div><div className="text-black text-xs mt-2">pixels</div></div>
                        </div>
                        <div className="flex justify-center gap-3 mt-8"><button onClick={() => generateComparisonShareLink(tabIndex)} className="px-4 py-2 rounded font-semibold transition-all border bg-white text-black border-black border-opacity-20 hover:border-opacity-40 flex items-center justify-center gap-2 text-sm"><span>🔗</span> SHARE</button></div>
                      </div>
                    ) : (
                      <div className="bg-gray-100 border border-black border-opacity-15 rounded-lg p-8 text-center"><p className="text-black text-lg opacity-60">Select all parameters to view calculations</p></div>
                    )}
                  </div>
                </div>
              </div>
            );
          } else {
            const compFilmResult = (() => { const cFF=compState.filmFormat||'', cAR=compState.useCustomFilmAnamorphic?compState.customFilmAnamorphic:(compState.filmAnamorphicRatio||''), cDAR=compState.useCustomFilmAspectRatio?compState.customFilmAspectRatio:(compState.filmDesiredAspectRatio||''); if(!cFF||!cAR||!cDAR)return null; const fmt=filmFormats.find(f=>f.id===cFF); if(!fmt)return null; const sq=parseFloat(cAR)||2,da=parseFloat(cDAR)||2.39,nW=fmt.negativeWidth,nH=fmt.negativeHeight,nA=nW/nH,uW=nW*sq,uA=uW/nH; let cp,usW,usH,ins=false; if(uA>=da){usH=nH;usW=da*usH;cp=(usW/uW)*100;}else{ins=true;usW=uW;usH=usW/da;cp=(usH/nH)*100;} return{negativeWidth:nW,negativeHeight:nH,negativeAspect:parseFloat(nA.toFixed(3)),squeeze:sq,unSqueezeAspect:parseFloat(uA.toFixed(3)),desiredAspect:da,outputNegativeWidth:parseFloat((usW/sq).toFixed(2)),outputNegativeHeight:parseFloat(usH.toFixed(2)),cropPercentageOfUnsqueezed:parseFloat(cp.toFixed(1)),isInsufficient:ins}; })();
            return (
              <div key={`comp-f-${tabIndex}`} className="mt-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-black text-lg font-bold tracking-wider">CAMERA {tabIndex + 2}</h3>
                  <button onClick={() => { setComparisonTabs(comparisonTabs.filter(t=>t!==tabIndex)); const ns=[...comparisonStates]; ns[tabIndex]={}; setComparisonStates(ns); }} className="px-3 py-1 rounded text-sm font-bold transition-all border bg-white text-red-600 border-red-300 hover:bg-red-50">✕ REMOVE</button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <ParametersPanel state={{ lensCircle:'', bypassLens:false, camera:'', filmFormat:compState.filmFormat||'', bypassCamera:false, sensorFormat:'', useCustomPixels:false, customPixelWidth:'', customPixelHeight:'', anamorphicRatio:'', useCustomAnamorphic:false, customAnamorphicRatio:'', desiredAspectRatio:'', useCustomAspectRatio:false, customOutputAspectRatio:'', filmAnamorphicRatio:compState.filmAnamorphicRatio||'', useCustomFilmAnamorphic:compState.useCustomFilmAnamorphic||false, customFilmAnamorphic:compState.customFilmAnamorphic||'', filmDesiredAspectRatio:compState.filmDesiredAspectRatio||'', useCustomFilmAspectRatio:compState.useCustomFilmAspectRatio||false, customFilmAspectRatio:compState.customFilmAspectRatio||'' }} setState={(ns) => { const nss=[...comparisonStates]; nss[tabIndex]={...nss[tabIndex]}; if(ns.filmFormat!==undefined)nss[tabIndex].filmFormat=ns.filmFormat; if(ns.filmAnamorphicRatio!==undefined)nss[tabIndex].filmAnamorphicRatio=ns.filmAnamorphicRatio; if(ns.useCustomFilmAnamorphic!==undefined)nss[tabIndex].useCustomFilmAnamorphic=ns.useCustomFilmAnamorphic; if(ns.customFilmAnamorphic!==undefined)nss[tabIndex].customFilmAnamorphic=ns.customFilmAnamorphic; if(ns.filmDesiredAspectRatio!==undefined)nss[tabIndex].filmDesiredAspectRatio=ns.filmDesiredAspectRatio; if(ns.useCustomFilmAspectRatio!==undefined)nss[tabIndex].useCustomFilmAspectRatio=ns.useCustomFilmAspectRatio; if(ns.customFilmAspectRatio!==undefined)nss[tabIndex].customFilmAspectRatio=ns.customFilmAspectRatio; setComparisonStates(nss); }} isComparison={true} formatType="film" filmFormats={filmFormats} cameras={[]} sensors={{}} />
                  </div>
                  <div className="lg:col-span-2">
                    {compFilmResult ? (
                      <div className="bg-gray-100 border border-black border-opacity-15 rounded-lg p-4 md:p-6">
                        <h4 className="text-black text-base font-bold mb-4 tracking-wider">NEGATIVE VISUALIZATION</h4>
                        <div className="grid grid-cols-3 gap-2 mb-6">
                          <div className="bg-white bg-opacity-5 p-2 rounded border border-black border-opacity-10"><p className="text-black text-opacity-60 text-xs font-bold mb-1">NEGATIVE</p><p className="text-black font-mono text-xs">{compFilmResult.negativeWidth}×{compFilmResult.negativeHeight}mm</p></div>
                          <div className="bg-white bg-opacity-5 p-2 rounded border border-black border-opacity-10"><p className="text-black text-opacity-60 text-xs font-bold mb-1">SQUEEZE</p><p className="text-black font-mono text-xs">{compFilmResult.squeeze}x</p></div>
                          <div className="bg-white bg-opacity-5 p-2 rounded border border-black border-opacity-10"><p className="text-black text-opacity-60 text-xs font-bold mb-1">ASPECT</p><p className="text-black font-mono text-xs">{compFilmResult.negativeAspect}:1</p></div>
                        </div>
                        <div className="flex flex-col md:flex-row gap-8 items-stretch mb-6">
                          <div className="flex flex-col items-center justify-between gap-1">
                            <div className="flex flex-col items-center"><p className="text-black text-opacity-60 text-xs font-bold mb-1">Negative</p><div className="border-2 border-amber-400 bg-gray-300" style={{ width:'80px', height:`${(compFilmResult.negativeHeight/compFilmResult.negativeWidth)*80}px` }} /><p className="text-black text-opacity-50 text-xs font-mono mt-1">{compFilmResult.negativeWidth}×{compFilmResult.negativeHeight}mm</p></div>
                            <div className="flex flex-col items-center gap-0 flex-shrink-0"><div className="h-6 w-1 bg-gradient-to-b from-amber-400 to-emerald-400"></div><p className="text-emerald-400 font-bold text-xs">{compFilmResult.squeeze}x</p><div className="w-1.5 h-1.5 border-b border-r border-emerald-400 transform rotate-45"></div></div>
                            <div className="flex flex-col items-center"><p className="text-black text-opacity-60 text-xs font-bold mb-1">Unsqueezed</p><div className="border-2 border-blue-600 bg-gray-300" style={{ width:'160px', height:`${(1/compFilmResult.unSqueezeAspect)*160}px` }} /><p className="text-black text-opacity-50 text-xs font-mono mt-1">{compFilmResult.unSqueezeAspect}:1</p></div>
                          </div>
                          <div className="flex flex-col items-center flex-1 md:flex-[1.5]">
                            <p className="text-black text-opacity-60 text-sm font-bold mb-4">YOUR OUTPUT (with desired crop)</p>
                            <div className="border-2 border-blue-600 bg-slate-400 relative w-full" style={{ maxWidth:'100%', aspectRatio:`${compFilmResult.unSqueezeAspect} / 1` }}>
                              {compFilmResult.desiredAspect !== compFilmResult.unSqueezeAspect && (<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-green-400 bg-slate-400" style={{ width:compFilmResult.isInsufficient?'100%':`${compFilmResult.cropPercentageOfUnsqueezed}%`, height:compFilmResult.isInsufficient?`${compFilmResult.cropPercentageOfUnsqueezed}%`:'100%' }} />)}
                              {compFilmResult.desiredAspect !== compFilmResult.unSqueezeAspect && !compFilmResult.isInsufficient && (<><div className="absolute top-0 bottom-0 left-0 bg-slate-400" style={{ width:`${((1-(compFilmResult.cropPercentageOfUnsqueezed/100))/2)*100}%` }} /><div className="absolute top-0 bottom-0 right-0 bg-slate-400" style={{ width:`${((1-(compFilmResult.cropPercentageOfUnsqueezed/100))/2)*100}%` }} /></>)}
                              {compFilmResult.desiredAspect !== compFilmResult.unSqueezeAspect && compFilmResult.isInsufficient && (<><div className="absolute top-0 left-0 right-0 bg-slate-400" style={{ height:`${((1-(compFilmResult.cropPercentageOfUnsqueezed/100))/2)*100}%` }} /><div className="absolute bottom-0 left-0 right-0 bg-slate-400" style={{ height:`${((1-(compFilmResult.cropPercentageOfUnsqueezed/100))/2)*100}%` }} /></>)}
                            </div>
                            <p className="text-black text-opacity-50 text-xs font-mono mt-3">{compFilmResult.unSqueezeAspect}:1 | Coverage: {compFilmResult.cropPercentageOfUnsqueezed}% | Desired: {compFilmResult.desiredAspect}:1</p>
                            <p className="text-black text-opacity-60 text-xs font-mono mt-2">Output on negative: {compFilmResult.outputNegativeWidth}×{compFilmResult.outputNegativeHeight}mm</p>
                          </div>
                        </div>
                        <div className="pt-4 border-t border-black border-opacity-10 mb-6">
                          <p className="text-black text-opacity-60 text-xs font-bold mb-2">LEGEND</p>
                          <div className="grid grid-cols-3 gap-3 text-xs">
                            <div className="flex items-center gap-2"><div className="w-3 h-3 border-2 border-amber-400 bg-slate-400"></div><span className="text-black text-opacity-60">Squeezed Negative</span></div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 border-2 border-blue-600 bg-slate-400"></div><span className="text-black text-opacity-60">Unsqueezed Image</span></div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 border-2 border-green-400 bg-slate-400"></div><span className="text-black text-opacity-60">Desired Output</span></div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="bg-green-100 border border-green-400 rounded-lg p-2 md:p-3"><div className="text-black text-xs font-bold tracking-widest mb-1">UNSQUEEZED</div><div className="text-sm sm:text-base md:text-lg font-bold text-black">{compFilmResult.unSqueezeAspect}:1</div></div>
                          <div className="bg-blue-100 border border-blue-400 rounded-lg p-2 md:p-3"><div className="text-black text-xs font-bold tracking-widest mb-1">DESIRED</div><div className="text-sm sm:text-base md:text-lg font-bold text-black">{compFilmResult.desiredAspect}:1</div></div>
                          <div className="bg-emerald-200 border border-emerald-500 rounded-lg p-2 md:p-3"><div className="text-black text-xs font-bold tracking-widest mb-1">CROP</div><div className="text-sm sm:text-base md:text-lg font-bold text-black">{compFilmResult.isInsufficient ? 'N/A' : (100-compFilmResult.cropPercentageOfUnsqueezed).toFixed(1)+'%'}</div></div>
                          <div className={`rounded-lg p-2 md:p-3 ${compFilmResult.isInsufficient ? 'bg-gradient-to-br from-red-500 to-red-700' : 'bg-indigo-200 border border-indigo-500'}`}><div className="text-black text-xs font-bold tracking-widest mb-1">{compFilmResult.isInsufficient?'INSUFFICIENT':'COVERAGE'}</div><div className="text-sm sm:text-base md:text-lg font-bold text-black">{compFilmResult.isInsufficient?'✗':compFilmResult.cropPercentageOfUnsqueezed+'%'}</div></div>
                        </div>
                        <div className="flex justify-center gap-3 mt-4"><button onClick={() => generateComparisonShareLink(tabIndex)} className="px-3 py-1.5 rounded font-semibold transition-all border bg-white text-black border-black border-opacity-20 hover:border-opacity-40 flex items-center justify-center gap-2 text-xs"><span>🔗</span> SHARE</button></div>
                      </div>
                    ) : (
                      <div className="bg-gray-100 border border-black border-opacity-15 rounded-lg p-8 text-center"><p className="text-black text-lg opacity-60">Select all parameters to view calculations</p></div>
                    )}
                  </div>
                </div>
              </div>
            );
          }
        })}

        {/* ADD CAMERA button */}
        {comparisonTabs.length < 3 && (calculateDigital || calculateFilm) && (
          <div className="flex justify-center mt-8 mb-8">
            <button onClick={() => { const ni=comparisonTabs.length; setComparisonTabs([...comparisonTabs,ni]); const ns=[...comparisonStates]; ns[ni]={}; setComparisonStates(ns); }} className="px-6 py-2 rounded font-bold transition-all border bg-white text-black border-black border-opacity-20 hover:border-opacity-40 flex items-center justify-center gap-2 text-sm">+ ADD CAMERA</button>
          </div>
        )}
      </div>
    </div>
  );
}
