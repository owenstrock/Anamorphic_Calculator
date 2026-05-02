import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';

const cameraList = [
  { id: 'arri-265', name: 'ARRI Alexa 265', lensCircles: ['65mm', 'full-frame'], isCrop: { 'full-frame': true }, format: 'digital' },
  { id: 'arri-alexa-35', name: 'ARRI Alexa 35', lensCircles: ['super-35'], format: 'digital' },
  { id: 'arri-alexa-mini', name: 'ARRI Alexa Mini/SXT', lensCircles: ['super-35', 'super-16'], isCrop: { 'super-16': true }, format: 'digital' },
  { id: 'arri-alexa-mini-lf', name: 'ARRI Alexa LF/Mini LF', lensCircles: ['full-frame', 'super-35'], isCrop: { 'super-35': true }, format: 'digital' },
  { id: 'bmd-ursa-mini-pro-46k', name: 'Blackmagic URSA Mini Pro 4.6K', lensCircles: ['super-35'], format: 'digital' },
  { id: 'bmd-pocket-6k', name: 'Blackmagic Pocket 6K/6K Pro/6K G2', lensCircles: ['super-35', 'super-16'], isCrop: { 'super-16': true }, format: 'digital' },
  { id: 'bmd-pyxis-6k', name: 'Blackmagic PYXIS 6K', lensCircles: ['full-frame', 'super-35', 'super-16'], isCrop: { 'super-35': true, 'super-16': true }, format: 'digital' },
  { id: 'bmd-pyxis-12k', name: 'Blackmagic PYXIS 12K', lensCircles: ['full-frame', 'super-35'], isCrop: { 'super-35': true }, format: 'digital' },
  { id: 'bmd-ursa-cine-12k', name: 'Blackmagic URSA Cine 12K', lensCircles: ['full-frame', 'super-35'], isCrop: { 'super-35': true }, format: 'digital' },
  { id: 'bmd-ursa-cine-17k', name: 'Blackmagic URSA Cine 17K', lensCircles: ['65mm', 'full-frame'], isCrop: { 'full-frame': true }, format: 'digital' },
  { id: 'bmd-ursa-mini-pro-12k', name: 'Blackmagic URSA Mini Pro 12K', lensCircles: ['super-35'], format: 'digital' },
  { id: 'canon-c70', name: 'Canon EOS C70', lensCircles: ['super-35', 'super-16'], isCrop: { 'super-16': true }, format: 'digital' },
  { id: 'canon-c300-iii', name: 'Canon EOS C300 Mark III', lensCircles: ['super-35', 'super-16'], isCrop: { 'super-16': true }, format: 'digital' },
  { id: 'canon-c500-ii', name: 'Canon EOS C500 Mark II', lensCircles: ['full-frame', 'super-35', 'super-16'], isCrop: { 'super-35': true, 'super-16': true }, format: 'digital' },
  { id: 'canon-c700', name: 'Canon EOS C700 FF', lensCircles: ['full-frame', 'super-35', 'super-16'], isCrop: { 'super-35': true, 'super-16': true }, format: 'digital' },
  { id: 'canon-r5c', name: 'Canon EOS R5 C', lensCircles: ['full-frame', 'super-35', 'super-16'], isCrop: { 'super-35': true, 'super-16': true }, format: 'digital' },
  { id: 'canon-r5-ii', name: 'Canon EOS R5 Mark II', lensCircles: ['full-frame', 'super-35', 'super-16'], isCrop: { 'super-35': true, 'super-16': true }, format: 'digital' },
  { id: 'dji-ronin-4d-8k', name: 'DJI Ronin 4D (X9-8K)', lensCircles: ['full-frame', 'super-35'], isCrop: { 'super-35': true }, format: 'digital' },
  { id: 'dji-ronin-4d-6k', name: 'DJI Ronin 4D (X9-6K)', lensCircles: ['full-frame'], format: 'digital' },
  { id: 'fujifilm-eterna', name: 'Fujifilm GFX ETERNA', lensCircles: ['65mm', 'full-frame', 'super-35'], isCrop: { 'full-frame': true, 'super-35': true }, format: 'digital' },
  { id: 'fujifilm-gfx', name: 'Fujifilm GFX 100', lensCircles: ['65mm', 'full-frame', 'super-35'], isCrop: { 'super-35': true }, format: 'digital' },
  { id: 'nikon-z8-z9', name: 'Nikon Z8/Z9', lensCircles: ['full-frame', 'super-35'], isCrop: { 'super-35': true }, format: 'digital' },
  { id: 'nikon-zr', name: 'Nikon ZR', lensCircles: ['full-frame', 'super-35'], isCrop: { 'super-35': true }, format: 'digital' },
  { id: 'panasonic-s1h', name: 'Panasonic LUMIX S1H', lensCircles: ['full-frame', 'super-35'], isCrop: { 'super-35': true }, format: 'digital' },
  { id: 'red-gemini', name: 'RED Gemini 5K', lensCircles: ['super-35', 'super-16'], isCrop: { 'super-16': true }, format: 'digital' },
  { id: 'red-komodo-x', name: 'RED Komodo 6K/X', lensCircles: ['super-35', 'super-16'], isCrop: { 'super-16': true }, format: 'digital' },
  { id: 'red-monstro', name: 'RED Monstro 8K', lensCircles: ['full-frame', 'super-35', 'super-16'], isCrop: { 'super-35': true, 'super-16': true }, format: 'digital' },
  { id: 'red-vraptor', name: 'RED V-RAPTOR 8K VV', lensCircles: ['full-frame', 'super-35', 'super-16'], isCrop: { 'super-35': true, 'super-16': true }, format: 'digital' },
  { id: 'sony-burano', name: 'Sony Burano', lensCircles: ['full-frame', 'super-35'], isCrop: { 'super-35': true }, format: 'digital' },
  { id: 'sony-fx3', name: 'Sony FX3', lensCircles: ['full-frame'], format: 'digital' },
  { id: 'sony-fx6', name: 'Sony FX6', lensCircles: ['full-frame'], format: 'digital' },
  { id: 'sony-fx9', name: 'Sony FX9', lensCircles: ['full-frame', 'super-35'], isCrop: { 'super-35': true }, format: 'digital' },
  { id: 'sony-venice', name: 'Sony Venice', lensCircles: ['full-frame', 'super-35'], isCrop: { 'super-35': true }, format: 'digital' },
  { id: 'sony-venice-2', name: 'Sony Venice 2', lensCircles: ['full-frame', 'super-35'], isCrop: { 'super-35': true }, format: 'digital' },
];

const filmFormats = [
  { id: 'super-16mm', name: 'Super 16mm (12.52×7.41mm)', negativeWidth: 12.52, negativeHeight: 7.41, squeeze: 2.0, projectedAspectRatio: 2.39 },
  { id: 'super-35-2perf', name: 'Super 35mm 2-perf (24.9×9.35mm)', negativeWidth: 24.9, negativeHeight: 9.35, squeeze: 2.0, projectedAspectRatio: 2.39, hidden: true },
  { id: 'super-35-3perf', name: 'Super 35mm 3-perf (24.9×13.9mm)', negativeWidth: 24.9, negativeHeight: 13.9, squeeze: 2.0, projectedAspectRatio: 2.39, hidden: true },
  { id: 'super-35-4perf', name: '35mm (20.96×17.53mm)', negativeWidth: 20.96, negativeHeight: 17.53, squeeze: 2.0, projectedAspectRatio: 2.39 },
  { id: 'super-35-full', name: 'Super 35mm (24.84×18.67mm)', negativeWidth: 24.84, negativeHeight: 18.67, squeeze: 2.0, projectedAspectRatio: 2.39 },
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
  { value: '1.33', label: '1.33:1', divisor: 'Standard' },
  { value: '1.37', label: '1.37:1', divisor: 'Academy' },
  { value: '1.43', label: '1.43:1', divisor: 'IMAX' },
  { value: '1.78', label: '1.78:1', divisor: 'HD' },
  { value: '1.85', label: '1.85:1', divisor: 'Widescreen' },
  { value: '1.9', label: '1.9:1', divisor: 'DCI' },
  { value: '2.0', label: '2.0:1', divisor: 'Univisium' },
  { value: '2.35', label: '2.35:1', divisor: 'Vintage' },
  { value: '2.39', label: '2.39:1', divisor: 'Modern' },
  { value: '2.76', label: '2.76:1', divisor: 'Ultra' },
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
  'arri-alexa-35-46k-og': 'super-35',
  'arri-alexa-35-46k-169': 'super-35',
  'arri-alexa-35-4k-169': 'super-35',
  'arri-alexa-35-4k-uhd': 'super-35',
  'arri-alexa-35-4k-21': 'super-35',
  'arri-alexa-35-38k-169': 'super-35',
  'arri-alexa-35-38k-239': 'super-35',
  'arri-alexa-35-33k-65': 'super-35',
  'arri-alexa-35-3k-11': 'super-35',
  'arri-alexa-35-2k-s16': 'super-16',
  'arri-alexa-35-hd-s16': 'super-16',
  'arri-mini-46k-og': 'super-35',
  'arri-mini-46k-169': 'super-35',
  'arri-mini-4k-169': 'super-35',
  'arri-mini-4k-uhd': 'super-35',
  'arri-mini-38k-169': 'super-35',
  'arri-mini-38k-239': 'super-35',
  'arri-mini-33k-65': 'super-35',
  'arri-mini-3k-11': 'super-35',
  'arri-mini-2k-s16': 'super-16',
  'arri-mini-hd-s16': 'super-16',
  'arri-lf-og': 'full-frame',
  'arri-lf-43k-169': 'full-frame',
  'arri-lf-43k-uhd': 'full-frame',
  'arri-lf-239': 'full-frame',
  'arri-lf-s35-46k-og': 'super-35',
  'arri-lf-s35-4k': 'super-35',
  'arri-lf-s35-38k': 'super-35',
  'arri-lf-s35-33k': 'super-35',
  'arri-lf-s35-2k-s16': 'super-16',
  'arri-265-6k5-65mm': '65mm',
  'arri-265-5k1-65mm-crop': '65mm',
  'arri-265-4k5-lf-og': 'full-frame',
  'arri-265-vertical-6k5-65mm': '65mm',
  'sony-burano-86k-169': 'full-frame',
  'sony-burano-86k-179': 'full-frame',
  'sony-burano-ffc-179': 'full-frame',
  'sony-burano-ffc-169': 'full-frame',
  'sony-burano-ffc-uhd': 'full-frame',
  'sony-burano-ffc-dci': 'full-frame',
  'sony-burano-s35-179': 'super-35',
  'sony-burano-s35-169': 'super-35',
  'sony-burano-s35c-4k': 'super-35',
  'sony-burano-hd': 'full-frame',
  'red-monstro-8k-17-9': 'full-frame',
  'red-monstro-8k-2-1': 'full-frame',
  'red-monstro-8k-241': 'full-frame',
  'red-monstro-8k-16-9': 'full-frame',
  'red-monstro-8k-3-2': 'full-frame',
  'red-monstro-7k-17-9': 'full-frame',
  'red-monstro-7k-16-9': 'full-frame',
  'red-monstro-6k-17-9': 'super-35',
  'red-monstro-6k-2-1': 'super-35',
  'red-monstro-6k-241': 'super-35',
  'red-monstro-6k-16-9': 'super-35',
  'red-monstro-6k-3-2': 'super-35',
  'red-monstro-5k-17-9': 'super-35',
  'red-monstro-5k-16-9': 'super-35',
  'red-monstro-4k-17-9': 'super-35',
  'red-monstro-4k-16-9': 'super-35',
  'red-monstro-3k-17-9': 'super-16',
  'red-monstro-3k-16-9': 'super-16',
  'red-monstro-2k-17-9': 'super-16',
  'red-monstro-2k-16-9': 'super-16',
  'sony-fx3-4k-dci': 'full-frame',
  'sony-fx3-4k-uhd': 'full-frame',
  'sony-fx3-hd': 'full-frame',
  'sony-fx6-4k-dci': 'full-frame',
  'sony-fx6-4k-uhd': 'full-frame',
  'sony-fx6-hd': 'full-frame',
  'sony-fx9-4k-dci-ff': 'full-frame',
  'sony-fx9-uhd-ff': 'full-frame',
  'sony-fx9-4k-dci-s35': 'super-35',
  'sony-fx9-uhd-s35': 'super-35',
  'sony-fx9-hd': 'full-frame',
  'red-komodo-6k-17-9': 'super-35',
  'red-komodo-6k-241': 'super-35',
  'red-komodo-6k-16-9': 'super-35',
  'red-komodo-5k-17-9': 'super-35',
  'red-komodo-4k-17-9': 'super-35',
  'red-komodo-4k-16-9': 'super-35',
  'red-komodo-2k-17-9': 'super-16',
  'red-gemini-5k-fh': 'super-35',
  'red-gemini-5k-17-9': 'super-35',
  'red-gemini-5k-241': 'super-35',
  'red-gemini-4k-17-9': 'super-35',
  'red-gemini-4k-16-9': 'super-35',
  'red-gemini-3k-17-9': 'super-16',
  'red-gemini-2k-17-9': 'super-16',
  'red-gemini-2k-16-9': 'super-16',
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

  'red-vraptor-8k-17-9': 'full-frame',
  'red-vraptor-8k-2-1': 'full-frame',
  'red-vraptor-8k-241': 'full-frame',
  'red-vraptor-8k-16-9': 'full-frame',
  'red-vraptor-7k-17-9': 'full-frame',
  'red-vraptor-6k-17-9': 'super-35',
  'red-vraptor-6k-2-1': 'super-35',
  'red-vraptor-6k-16-9': 'super-35',
  'red-vraptor-5k-17-9': 'super-35',
  'red-vraptor-5k-16-9': 'super-35',
  'red-vraptor-4k-17-9': 'super-35',
  'red-vraptor-4k-16-9': 'super-35',
  'red-vraptor-3k-17-9': 'super-16',
  'red-vraptor-3k-16-9': 'super-16',
  'red-vraptor-2k-17-9': 'super-16',
  'red-vraptor-2k-16-9': 'super-16',
  'dji-4d8k-8k-179': 'full-frame',
  'dji-4d8k-8k-239': 'full-frame',
  'dji-4d8k-55k-s35': 'super-35',
  'dji-4d8k-4k-179': 'full-frame',
  'dji-4d8k-4k-169': 'full-frame',
  'dji-4d8k-hd': 'full-frame',
  'dji-4d6k-6k-179': 'full-frame',
  'dji-4d6k-4k-179': 'full-frame',
  'dji-4d6k-4k-169': 'full-frame',
  'dji-4d6k-hd': 'full-frame',
  'nikon-z89-8k-uhd': 'full-frame',
  'nikon-z89-4k-uhd-os': 'full-frame',
  'nikon-z89-4k-uhd': 'full-frame',
  'nikon-z89-4k-s35': 'super-35',
  'nikon-z89-hd': 'full-frame',
  'nikon-zr-6k': 'full-frame',
  'nikon-zr-4k-ff': 'full-frame',
  'nikon-zr-4k-s35': 'super-35',
  'nikon-zr-hd': 'full-frame',
  'pana-s1h-6k-32': 'full-frame',
  'pana-s1h-59k-169': 'full-frame',
  'pana-s1h-c4k-ff': 'full-frame',
  'pana-s1h-4k-ff': 'full-frame',
  'pana-s1h-c4k-s35': 'super-35',
  'pana-s1h-4k-s35': 'super-35',
  'pana-s1h-hd': 'full-frame',
  'canon-c70-4k-dci': 'super-35',
  'canon-c70-4k-uhd': 'super-35',
  'canon-c70-2k-s35': 'super-35',
  'canon-c70-hd': 'super-35',
  'canon-c70-2k-s16': 'super-16',
  'canon-c70-hd-s16': 'super-16',
  'canon-c300iii-4k-dci': 'super-35',
  'canon-c300iii-4k-uhd': 'super-35',
  'canon-c300iii-2k-s35': 'super-35',
  'canon-c300iii-2k-s16': 'super-16',
  'canon-c500ii-59k-ff': 'full-frame',
  'canon-c500ii-4k-dci-ff': 'full-frame',
  'canon-c500ii-4k-uhd-ff': 'full-frame',
  'canon-c500ii-43-ana': 'full-frame',
  'canon-c500ii-65-ana': 'full-frame',
  'canon-c500ii-4k-dci-s35': 'super-35',
  'canon-c500ii-4k-uhd-s35': 'super-35',
  'canon-c500ii-2k-s16': 'super-16',
  'canon-c700-59k-ff': 'full-frame',
  'canon-c700-4k-dci-ff': 'full-frame',
  'canon-c700-4k-uhd-ff': 'full-frame',
  'canon-c700-43-ana': 'full-frame',
  'canon-c700-65-ana': 'full-frame',
  'canon-c700-4k-dci-s35': 'super-35',
  'canon-c700-4k-uhd-s35': 'super-35',
  'canon-c700-2k-s16': 'super-16',
  'canon-r5c-8k-dci': 'full-frame',
  'canon-r5c-8k-uhd': 'full-frame',
  'canon-r5c-4k-dci-ff': 'full-frame',
  'canon-r5c-4k-uhd-ff': 'full-frame',
  'canon-r5c-4k-s35': 'super-35',
  'canon-r5c-hd': 'full-frame',
  'canon-r5ii-8k-dci': 'full-frame',
  'canon-r5ii-8k-uhd': 'full-frame',
  'canon-r5ii-4k-dci-ff': 'full-frame',
  'canon-r5ii-4k-uhd-ff': 'full-frame',
  'canon-r5ii-4k-s35': 'super-35',
  'canon-r5ii-hd': 'full-frame',
  'bmd-p6k-6k': 'super-35',
  'bmd-p6k-57k': 'super-35',
  'bmd-p6k-28k': 'super-16',
  'bmd-p6k-hd': 'super-16',
  'bmd-ump46k-46k': 'super-35',
  'bmd-ump46k-4k-dci': 'super-35',
  'bmd-ump46k-4k-uhd': 'super-35',
  'bmd-ump46k-hd': 'super-35',
  'bmd-pyxis6k-6k-32': 'full-frame',
  'bmd-pyxis6k-6k-169': 'full-frame',
  'bmd-pyxis6k-4k-dci': 'super-35',
  'bmd-pyxis6k-4k-uhd': 'super-35',
  'bmd-pyxis6k-s16': 'super-16',
  'bmd-pyxis12k-12k-32': 'full-frame',
  'bmd-pyxis12k-8k-169': 'full-frame',
  'bmd-pyxis12k-4k-dci': 'full-frame',
  'bmd-pyxis12k-4k-uhd': 'full-frame',
  'bmd-pyxis12k-9k-s35': 'super-35',
  'bmd-ump12k-12k-16-9': 'super-35',
  'bmd-ump12k-12k-dci': 'super-35',
  'bmd-ump12k-8k-16-9': 'super-35',
  'bmd-ump12k-8k-dci': 'super-35',
  'bmd-uc12k-12k-32': 'full-frame',
  'bmd-uc12k-8k-169': 'full-frame',
  'bmd-uc12k-4k-dci': 'full-frame',
  'bmd-uc12k-4k-uhd': 'full-frame',
  'bmd-uc12k-9k-s35': 'super-35',
  'bmd-uc17k-17k-65': '65mm',
  'bmd-uc17k-8k-ff': 'full-frame',
  'bmd-uc17k-4k-dci': 'full-frame',
  'bmd-uc17k-4k-uhd': 'full-frame',
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
    'sony-burano-86k-169':   { name: 'Sony BURANO - 8.6K 16:9 FF (8632x4856)', width: 35.9, height: 20.2, pixels: '8632 x 4856', aspectRatio: '16:9' },
    'sony-burano-86k-179':   { name: 'Sony BURANO - 8.6K 17:9 FF (8632x4552)', width: 35.9, height: 18.9, pixels: '8632 x 4552', aspectRatio: '17:9' },
    'sony-burano-ffc-179':   { name: 'Sony BURANO - FFc 6K 17:9 (6052x3192)', width: 33.6, height: 17.7, pixels: '6052 x 3192', aspectRatio: '17:9' },
    'sony-burano-ffc-169':   { name: 'Sony BURANO - FFc 6K 16:9 (6052x3404)', width: 33.6, height: 18.9, pixels: '6052 x 3404', aspectRatio: '16:9' },
    'sony-burano-ffc-uhd':   { name: 'Sony BURANO - FFc 4K UHD (3840x2160)', width: 33.6, height: 18.9, pixels: '3840 x 2160', aspectRatio: '16:9' },
    'sony-burano-ffc-dci':   { name: 'Sony BURANO - FFc 4K DCI (4096x2160)', width: 33.57, height: 17.7, pixels: '4096 x 2160', aspectRatio: '17:9' },
    'sony-burano-s35-179':   { name: 'Sony BURANO - S35 5.8K 17:9 (5760x3036)', width: 24.0, height: 12.6, pixels: '5760 x 3036', aspectRatio: '17:9' },
    'sony-burano-s35-169':   { name: 'Sony BURANO - S35 5.8K 16:9 (5760x3240)', width: 24.0, height: 13.5, pixels: '5760 x 3240', aspectRatio: '16:9' },
    'sony-burano-s35c-4k':   { name: 'Sony BURANO - S35c 4K 17:9 (4096x2160)', width: 17.0, height: 9.0, pixels: '4096 x 2160', aspectRatio: '17:9' },
    'sony-burano-hd':        { name: 'Sony BURANO - HD FFc (1920x1080)', width: 33.6, height: 18.9, pixels: '1920 x 1080', aspectRatio: '16:9' },
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
    'sony-fx9-4k-dci-ff':  { name: 'Sony FX9 - 4K DCI FF (4096x2160)', width: 35.7, height: 18.8, pixels: '4096 x 2160', aspectRatio: '17:9' },
    'sony-fx9-uhd-ff':     { name: 'Sony FX9 - UHD FF (3840x2160)', width: 33.4, height: 18.8, pixels: '3840 x 2160', aspectRatio: '16:9' },
    'sony-fx9-4k-dci-s35': { name: 'Sony FX9 - 4K DCI S35 Crop (4096x2160)', width: 24.0, height: 13.5, pixels: '4096 x 2160', aspectRatio: '17:9' },
    'sony-fx9-uhd-s35':    { name: 'Sony FX9 - UHD S35 Crop (3840x2160)', width: 22.5, height: 13.5, pixels: '3840 x 2160', aspectRatio: '16:9' },
    'sony-fx9-hd':         { name: 'Sony FX9 - HD FF (1920x1080)', width: 33.4, height: 18.8, pixels: '1920 x 1080', aspectRatio: '16:9' },
  },
  'arri-alexa-35': {
    'arri-alexa-35-46k-og':   { name: 'ARRI Alexa 35 - 4.6K Open Gate (4608x3164)', width: 27.99, height: 19.22, pixels: '4608 x 3164', aspectRatio: '3:2' },
    'arri-alexa-35-46k-169':  { name: 'ARRI Alexa 35 - 4.6K 16:9 (4608x2592)', width: 27.99, height: 15.75, pixels: '4608 x 2592', aspectRatio: '16:9' },
    'arri-alexa-35-4k-169':   { name: 'ARRI Alexa 35 - 4K 16:9 (4096x2304)', width: 24.88, height: 14.00, pixels: '4096 x 2304', aspectRatio: '16:9' },
    'arri-alexa-35-4k-uhd':   { name: 'ARRI Alexa 35 - UHD 16:9 (3840x2160)', width: 24.88, height: 14.00, pixels: '3840 x 2160', aspectRatio: '16:9' },
    'arri-alexa-35-4k-21':    { name: 'ARRI Alexa 35 - 4K 2:1 (4096x2048)', width: 24.88, height: 12.42, pixels: '4096 x 2048', aspectRatio: '2:1' },
    'arri-alexa-35-38k-169':  { name: 'ARRI Alexa 35 - 3.8K 16:9 (3840x2160)', width: 23.33, height: 13.12, pixels: '3840 x 2160', aspectRatio: '16:9' },
    'arri-alexa-35-38k-239':  { name: 'ARRI Alexa 35 - 3.8K 2.39:1 (3840x1608)', width: 23.33, height: 9.77, pixels: '3840 x 1608', aspectRatio: '2.39:1' },
    'arri-alexa-35-33k-65':   { name: 'ARRI Alexa 35 - 3.3K 6:5 Ana (3328x2790)', width: 20.22, height: 16.95, pixels: '3328 x 2790', aspectRatio: '6:5' },
    'arri-alexa-35-3k-11':    { name: 'ARRI Alexa 35 - 3K 1:1 (3072x3072)', width: 18.66, height: 18.66, pixels: '3072 x 3072', aspectRatio: '1:1' },
    'arri-alexa-35-2k-s16':   { name: 'ARRI Alexa 35 - 2K S16 (2048x1152)', width: 12.44, height: 7.00, pixels: '2048 x 1152', aspectRatio: '16:9' },
    'arri-alexa-35-hd-s16':   { name: 'ARRI Alexa 35 - HD S16 (1920x1080)', width: 11.66, height: 6.56, pixels: '1920 x 1080', aspectRatio: '16:9' },
  },
  'arri-alexa-mini': {
    'arri-mini-46k-og':   { name: 'ARRI Alexa Mini/SXT - 4.6K Open Gate (4608x3164)', width: 27.99, height: 19.22, pixels: '4608 x 3164', aspectRatio: '3:2' },
    'arri-mini-46k-169':  { name: 'ARRI Alexa Mini/SXT - 4.6K 16:9 (4608x2592)', width: 27.99, height: 15.75, pixels: '4608 x 2592', aspectRatio: '16:9' },
    'arri-mini-4k-169':   { name: 'ARRI Alexa Mini/SXT - 4K 16:9 (4096x2304)', width: 24.88, height: 14.00, pixels: '4096 x 2304', aspectRatio: '16:9' },
    'arri-mini-4k-uhd':   { name: 'ARRI Alexa Mini/SXT - UHD 16:9 (3840x2160)', width: 24.88, height: 14.00, pixels: '3840 x 2160', aspectRatio: '16:9' },
    'arri-mini-38k-169':  { name: 'ARRI Alexa Mini/SXT - 3.8K 16:9 (3840x2160)', width: 23.33, height: 13.12, pixels: '3840 x 2160', aspectRatio: '16:9' },
    'arri-mini-38k-239':  { name: 'ARRI Alexa Mini/SXT - 3.8K 2.39:1 (3840x1608)', width: 23.33, height: 9.77, pixels: '3840 x 1608', aspectRatio: '2.39:1' },
    'arri-mini-33k-65':   { name: 'ARRI Alexa Mini/SXT - 3.3K 6:5 Ana (3328x2790)', width: 20.22, height: 16.95, pixels: '3328 x 2790', aspectRatio: '6:5' },
    'arri-mini-3k-11':    { name: 'ARRI Alexa Mini/SXT - 3K 1:1 (3072x3072)', width: 18.66, height: 18.66, pixels: '3072 x 3072', aspectRatio: '1:1' },
    'arri-mini-2k-s16':   { name: 'ARRI Alexa Mini/SXT - 2K S16 (2048x1152)', width: 12.44, height: 7.00, pixels: '2048 x 1152', aspectRatio: '16:9' },
    'arri-mini-hd-s16':   { name: 'ARRI Alexa Mini/SXT - HD S16 (1920x1080)', width: 11.66, height: 6.56, pixels: '1920 x 1080', aspectRatio: '16:9' },
  },
  'arri-alexa-mini-lf': {
    'arri-lf-og':       { name: 'ARRI Alexa LF/Mini LF - Open Gate (4448x3096)', width: 36.70, height: 25.54, pixels: '4448 x 3096', aspectRatio: '3:2' },
    'arri-lf-43k-169':  { name: 'ARRI Alexa LF/Mini LF - 4.3K 16:9 (4320x2430)', width: 35.64, height: 20.05, pixels: '4320 x 2430', aspectRatio: '16:9' },
    'arri-lf-43k-uhd':  { name: 'ARRI Alexa LF/Mini LF - UHD 16:9 (3840x2160)', width: 35.64, height: 20.05, pixels: '3840 x 2160', aspectRatio: '16:9' },
    'arri-lf-239':      { name: 'ARRI Alexa LF/Mini LF - 4.5K 2.39:1 (4448x1856)', width: 36.70, height: 15.31, pixels: '4448 x 1856', aspectRatio: '2.39:1' },
    'arri-lf-s35-46k-og': { name: 'ARRI Alexa LF/Mini LF - S35 4.6K OG (4608x3164)', width: 27.99, height: 19.22, pixels: '4608 x 3164', aspectRatio: '3:2' },
    'arri-lf-s35-4k':   { name: 'ARRI Alexa LF/Mini LF - S35 4K 16:9 (4096x2304)', width: 24.88, height: 14.00, pixels: '4096 x 2304', aspectRatio: '16:9' },
    'arri-lf-s35-38k':  { name: 'ARRI Alexa LF/Mini LF - S35 3.8K 16:9 (3840x2160)', width: 23.33, height: 13.12, pixels: '3840 x 2160', aspectRatio: '16:9' },
    'arri-lf-s35-33k':  { name: 'ARRI Alexa LF/Mini LF - S35 3.3K 6:5 (3328x2790)', width: 20.22, height: 16.95, pixels: '3328 x 2790', aspectRatio: '6:5' },
    'arri-lf-s35-2k-s16': { name: 'ARRI Alexa LF/Mini LF - S35 2K S16 (2048x1152)', width: 12.44, height: 7.00, pixels: '2048 x 1152', aspectRatio: '16:9' },
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
    'red-komodo-6k-17-9': { name: 'RED Komodo 6K/X - 6K 17:9 (6144x3240)', width: 27.03, height: 14.25, pixels: '6144 x 3240', aspectRatio: '17:9' },
    'red-komodo-6k-241': { name: 'RED Komodo 6K/X - 6K 2.4:1 (6144x2592)', width: 27.03, height: 11.4, pixels: '6144 x 2592', aspectRatio: '2.4:1' },
    'red-komodo-6k-16-9': { name: 'RED Komodo 6K/X - 5760 16:9 (5760x3240)', width: 25.34, height: 14.25, pixels: '5760 x 3240', aspectRatio: '16:9' },
    'red-komodo-5k-17-9': { name: 'RED Komodo 6K/X - 5K 17:9 (5120x2700)', width: 22.52, height: 11.88, pixels: '5120 x 2700', aspectRatio: '17:9' },
    'red-komodo-4k-17-9': { name: 'RED Komodo 6K/X - 4K 17:9 (4096x2160)', width: 18.02, height: 9.5, pixels: '4096 x 2160', aspectRatio: '17:9' },
    'red-komodo-4k-16-9': { name: 'RED Komodo 6K/X - 4K 16:9 (3840x2160)', width: 16.89, height: 9.5, pixels: '3840 x 2160', aspectRatio: '16:9' },
    'red-komodo-2k-17-9': { name: 'RED Komodo 6K/X - 2K 17:9 (2048x1080)', width: 9.01, height: 4.75, pixels: '2048 x 1080', aspectRatio: '17:9' },
  },
  'dji-ronin-4d-8k': {
    'dji-4d8k-8k-179': { name: 'DJI Ronin 4D (X9-8K) - 8K 17:9 FF (8192x4320)', width: 36.0, height: 19.0, pixels: '8192 x 4320', aspectRatio: '17:9' },
    'dji-4d8k-8k-239': { name: 'DJI Ronin 4D (X9-8K) - 8K 2.39:1 FF (8192x3432)', width: 36.0, height: 15.1, pixels: '8192 x 3432', aspectRatio: '2.39:1' },
    'dji-4d8k-55k-s35': { name: 'DJI Ronin 4D (X9-8K) - 5.5K S35 Crop (5568x2952)', width: 24.5, height: 13.0, pixels: '5568 x 2952', aspectRatio: '17:9' },
    'dji-4d8k-4k-179':  { name: 'DJI Ronin 4D (X9-8K) - 4K DCI FF (4096x2160)', width: 36.0, height: 19.0, pixels: '4096 x 2160', aspectRatio: '17:9' },
    'dji-4d8k-4k-169':  { name: 'DJI Ronin 4D (X9-8K) - 4K UHD FF (3840x2160)', width: 33.8, height: 19.0, pixels: '3840 x 2160', aspectRatio: '16:9' },
    'dji-4d8k-hd':      { name: 'DJI Ronin 4D (X9-8K) - HD (1920x1080)', width: 33.8, height: 19.0, pixels: '1920 x 1080', aspectRatio: '16:9' },
  },
  'dji-ronin-4d-6k': {
    'dji-4d6k-6k-179': { name: 'DJI Ronin 4D (X9-6K) - 6K 17:9 FF (6008x3168)', width: 36.0, height: 19.0, pixels: '6008 x 3168', aspectRatio: '17:9' },
    'dji-4d6k-4k-179': { name: 'DJI Ronin 4D (X9-6K) - 4K DCI FF (4096x2160)', width: 36.0, height: 19.0, pixels: '4096 x 2160', aspectRatio: '17:9' },
    'dji-4d6k-4k-169': { name: 'DJI Ronin 4D (X9-6K) - 4K UHD FF (3840x2160)', width: 33.8, height: 19.0, pixels: '3840 x 2160', aspectRatio: '16:9' },
    'dji-4d6k-hd':     { name: 'DJI Ronin 4D (X9-6K) - HD (1920x1080)', width: 33.8, height: 19.0, pixels: '1920 x 1080', aspectRatio: '16:9' },
  },
  'nikon-z8-z9': {
    'nikon-z89-8k-uhd':    { name: 'Nikon Z8/Z9 - 8K UHD FF (7680x4320)', width: 35.9, height: 20.2, pixels: '7680 x 4320', aspectRatio: '16:9' },
    'nikon-z89-4k-uhd-os': { name: 'Nikon Z8/Z9 - 4K UHD Oversampled FF (3840x2160)', width: 35.9, height: 20.2, pixels: '3840 x 2160', aspectRatio: '16:9' },
    'nikon-z89-4k-uhd':    { name: 'Nikon Z8/Z9 - 4K UHD 120p FF (3840x2160)', width: 35.9, height: 20.2, pixels: '3840 x 2160', aspectRatio: '16:9' },
    'nikon-z89-4k-s35':    { name: 'Nikon Z8/Z9 - 4K UHD DX/S35 Crop (3840x2160)', width: 23.5, height: 13.2, pixels: '3840 x 2160', aspectRatio: '16:9' },
    'nikon-z89-hd':        { name: 'Nikon Z8/Z9 - HD FF (1920x1080)', width: 35.9, height: 20.2, pixels: '1920 x 1080', aspectRatio: '16:9' },
  },
  'nikon-zr': {
    'nikon-zr-6k':      { name: 'Nikon ZR - 6K RAW FF (6048x3402)', width: 35.9, height: 20.2, pixels: '6048 x 3402', aspectRatio: '16:9' },
    'nikon-zr-4k-ff':   { name: 'Nikon ZR - 4K UHD FF (3840x2160)', width: 35.9, height: 20.2, pixels: '3840 x 2160', aspectRatio: '16:9' },
    'nikon-zr-4k-s35':  { name: 'Nikon ZR - 4K UHD DX/S35 Crop (3840x2160)', width: 24.0, height: 13.5, pixels: '3840 x 2160', aspectRatio: '16:9' },
    'nikon-zr-hd':      { name: 'Nikon ZR - HD FF (1920x1080)', width: 35.9, height: 20.2, pixels: '1920 x 1080', aspectRatio: '16:9' },
  },
  'panasonic-s1h': {
    'pana-s1h-6k-32':   { name: 'Panasonic S1H - 6K 3:2 Open Gate (5952x3968)', width: 35.6, height: 23.8, pixels: '5952 x 3968', aspectRatio: '3:2' },
    'pana-s1h-59k-169': { name: 'Panasonic S1H - 5.9K 16:9 FF (5888x3312)', width: 35.22, height: 19.81, pixels: '5888 x 3312', aspectRatio: '16:9' },
    'pana-s1h-c4k-ff':  { name: 'Panasonic S1H - C4K FF (4096x2160)', width: 35.22, height: 19.81, pixels: '4096 x 2160', aspectRatio: '17:9' },
    'pana-s1h-4k-ff':   { name: 'Panasonic S1H - 4K UHD FF (3840x2160)', width: 35.22, height: 19.81, pixels: '3840 x 2160', aspectRatio: '16:9' },
    'pana-s1h-c4k-s35': { name: 'Panasonic S1H - C4K S35 Crop (4096x2160)', width: 24.5, height: 12.92, pixels: '4096 x 2160', aspectRatio: '17:9' },
    'pana-s1h-4k-s35':  { name: 'Panasonic S1H - 4K S35 Crop (3840x2160)', width: 22.97, height: 12.92, pixels: '3840 x 2160', aspectRatio: '16:9' },
    'pana-s1h-hd':      { name: 'Panasonic S1H - HD FF (1920x1080)', width: 35.22, height: 19.81, pixels: '1920 x 1080', aspectRatio: '16:9' },
  },
  'red-gemini': {
    'red-gemini-5k-fh': { name: 'RED Gemini 5K - 5.1K 1.7:1 (5120x3000)', width: 30.72, height: 18.0, pixels: '5120 x 3000', aspectRatio: '1.7:1' },
    'red-gemini-5k-17-9': { name: 'RED Gemini 5K - 5.1K 17:9 (5120x2700)', width: 30.72, height: 16.2, pixels: '5120 x 2700', aspectRatio: '17:9' },
    'red-gemini-5k-241': { name: 'RED Gemini 5K - 5.1K 2.4:1 (5120x2160)', width: 30.72, height: 12.96, pixels: '5120 x 2160', aspectRatio: '2.4:1' },
    'red-gemini-4k-17-9': { name: 'RED Gemini 5K - 4.1K 17:9 (4096x2160)', width: 24.58, height: 12.96, pixels: '4096 x 2160', aspectRatio: '17:9' },
    'red-gemini-4k-16-9': { name: 'RED Gemini 5K - 3.8K 16:9 (3840x2160)', width: 23.04, height: 12.96, pixels: '3840 x 2160', aspectRatio: '16:9' },
    'red-gemini-3k-17-9': { name: 'RED Gemini 5K - 3.1K 17:9 (3072x1620)', width: 18.43, height: 9.72, pixels: '3072 x 1620', aspectRatio: '17:9' },
    'red-gemini-2k-17-9': { name: 'RED Gemini 5K - 2.0K 17:9 (2048x1080)', width: 12.29, height: 6.48, pixels: '2048 x 1080', aspectRatio: '17:9' },
    'red-gemini-2k-16-9': { name: 'RED Gemini 5K - 1.9K 16:9 (1920x1080)', width: 11.52, height: 6.48, pixels: '1920 x 1080', aspectRatio: '16:9' },
  },
  'red-vraptor': {
    'red-vraptor-8k-17-9': { name: 'V-RAPTOR - 8K 17:9 (8192x4320)', width: 40.96, height: 21.6, pixels: '8192 x 4320', aspectRatio: '17:9' },
    'red-vraptor-8k-2-1': { name: 'V-RAPTOR - 8K 2:1 (8192x4096)', width: 40.96, height: 20.48, pixels: '8192 x 4096', aspectRatio: '2:1' },
    'red-vraptor-8k-241': { name: 'V-RAPTOR - 8K 2.4:1 (8192x3456)', width: 40.96, height: 17.28, pixels: '8192 x 3456', aspectRatio: '2.4:1' },
    'red-vraptor-8k-16-9': { name: 'V-RAPTOR - 7K 16:9 (7680x4320)', width: 38.4, height: 21.6, pixels: '7680 x 4320', aspectRatio: '16:9' },
    'red-vraptor-7k-17-9': { name: 'V-RAPTOR - 7K 17:9 (7168x3780)', width: 35.84, height: 18.9, pixels: '7168 x 3780', aspectRatio: '17:9' },
    'red-vraptor-6k-17-9': { name: 'V-RAPTOR - 6K 17:9 (6144x3240)', width: 30.72, height: 16.2, pixels: '6144 x 3240', aspectRatio: '17:9' },
    'red-vraptor-6k-2-1': { name: 'V-RAPTOR - 6K 2:1 (6144x3072)', width: 30.72, height: 15.36, pixels: '6144 x 3072', aspectRatio: '2:1' },
    'red-vraptor-6k-16-9': { name: 'V-RAPTOR - 5K 16:9 (5760x3240)', width: 28.8, height: 16.2, pixels: '5760 x 3240', aspectRatio: '16:9' },
    'red-vraptor-5k-17-9': { name: 'V-RAPTOR - 5K 17:9 (5120x2700)', width: 25.6, height: 13.5, pixels: '5120 x 2700', aspectRatio: '17:9' },
    'red-vraptor-5k-16-9': { name: 'V-RAPTOR - 4K 16:9 (4800x2700)', width: 24.0, height: 13.5, pixels: '4800 x 2700', aspectRatio: '16:9' },
    'red-vraptor-4k-17-9': { name: 'V-RAPTOR - 4K 17:9 (4096x2160)', width: 20.48, height: 10.8, pixels: '4096 x 2160', aspectRatio: '17:9' },
    'red-vraptor-4k-16-9': { name: 'V-RAPTOR - 3K S16 16:9 (3840x2160)', width: 19.2, height: 10.8, pixels: '3840 x 2160', aspectRatio: '16:9' },
    'red-vraptor-3k-17-9': { name: 'V-RAPTOR - 3K S16 17:9 (3072x1620)', width: 15.36, height: 8.1, pixels: '3072 x 1620', aspectRatio: '17:9' },
    'red-vraptor-3k-16-9': { name: 'V-RAPTOR - 2K S16 16:9 (2880x1620)', width: 14.4, height: 8.1, pixels: '2880 x 1620', aspectRatio: '16:9' },
    'red-vraptor-2k-17-9': { name: 'V-RAPTOR - 2K S16 17:9 (2048x1080)', width: 10.24, height: 5.4, pixels: '2048 x 1080', aspectRatio: '17:9' },
    'red-vraptor-2k-16-9': { name: 'V-RAPTOR - 2K S16 16:9 (1920x1080)', width: 9.6, height: 5.4, pixels: '1920 x 1080', aspectRatio: '16:9' },
  },
  'red-monstro': {
    'red-monstro-8k-17-9': { name: 'RED Monstro 8K - 8K 17:9 (8192x4320)', width: 40.96, height: 21.6, pixels: '8192 x 4320', aspectRatio: '17:9' },
    'red-monstro-8k-2-1': { name: 'RED Monstro 8K - 8K 2:1 (8192x4096)', width: 40.96, height: 20.48, pixels: '8192 x 4096', aspectRatio: '2:1' },
    'red-monstro-8k-241': { name: 'RED Monstro 8K - 8K 2.4:1 (8192x3456)', width: 40.96, height: 17.28, pixels: '8192 x 3456', aspectRatio: '2.4:1' },
    'red-monstro-8k-16-9': { name: 'RED Monstro 8K - 7K 16:9 (7680x4320)', width: 38.4, height: 21.6, pixels: '7680 x 4320', aspectRatio: '16:9' },
    'red-monstro-8k-3-2': { name: 'RED Monstro 8K - 6K 3:2 (6480x4320)', width: 32.4, height: 21.6, pixels: '6480 x 4320', aspectRatio: '3:2' },
    'red-monstro-7k-17-9': { name: 'RED Monstro 8K - 7K 17:9 (7168x3780)', width: 35.84, height: 18.9, pixels: '7168 x 3780', aspectRatio: '17:9' },
    'red-monstro-7k-16-9': { name: 'RED Monstro 8K - 6K 16:9 (6720x3780)', width: 33.6, height: 18.9, pixels: '6720 x 3780', aspectRatio: '16:9' },
    'red-monstro-6k-17-9': { name: 'RED Monstro 8K - 6K 17:9 (6144x3240)', width: 30.72, height: 16.2, pixels: '6144 x 3240', aspectRatio: '17:9' },
    'red-monstro-6k-2-1': { name: 'RED Monstro 8K - 6K 2:1 (6144x3072)', width: 30.72, height: 15.36, pixels: '6144 x 3072', aspectRatio: '2:1' },
    'red-monstro-6k-241': { name: 'RED Monstro 8K - 6K 2.4:1 (6144x2592)', width: 30.72, height: 12.96, pixels: '6144 x 2592', aspectRatio: '2.4:1' },
    'red-monstro-6k-16-9': { name: 'RED Monstro 8K - 5K 16:9 (5760x3240)', width: 28.8, height: 16.2, pixels: '5760 x 3240', aspectRatio: '16:9' },
    'red-monstro-6k-3-2': { name: 'RED Monstro 8K - 4K 3:2 (4860x3240)', width: 24.3, height: 16.2, pixels: '4860 x 3240', aspectRatio: '3:2' },
    'red-monstro-5k-17-9': { name: 'RED Monstro 8K - 5K 17:9 (5120x2700)', width: 25.6, height: 13.5, pixels: '5120 x 2700', aspectRatio: '17:9' },
    'red-monstro-5k-16-9': { name: 'RED Monstro 8K - 4K 16:9 (4800x2700)', width: 24.0, height: 13.5, pixels: '4800 x 2700', aspectRatio: '16:9' },
    'red-monstro-4k-17-9': { name: 'RED Monstro 8K - 4K 17:9 (4096x2160)', width: 20.48, height: 10.8, pixels: '4096 x 2160', aspectRatio: '17:9' },
    'red-monstro-4k-16-9': { name: 'RED Monstro 8K - 3K 16:9 (3840x2160)', width: 19.2, height: 10.8, pixels: '3840 x 2160', aspectRatio: '16:9' },
    'red-monstro-3k-17-9': { name: 'RED Monstro 8K - 3K 17:9 (3072x1620)', width: 15.36, height: 8.1, pixels: '3072 x 1620', aspectRatio: '17:9' },
    'red-monstro-3k-16-9': { name: 'RED Monstro 8K - 2K 16:9 (2880x1620)', width: 14.4, height: 8.1, pixels: '2880 x 1620', aspectRatio: '16:9' },
    'red-monstro-2k-17-9': { name: 'RED Monstro 8K - 2K 17:9 (2048x1080)', width: 10.24, height: 5.4, pixels: '2048 x 1080', aspectRatio: '17:9' },
    'red-monstro-2k-16-9': { name: 'RED Monstro 8K - 2K 16:9 (1920x1080)', width: 9.6, height: 5.4, pixels: '1920 x 1080', aspectRatio: '16:9' },
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
  'canon-c70': {
    'canon-c70-4k-dci':  { name: 'Canon C70/C300III - S35 4K DCI (4096x2160)', width: 26.2, height: 13.8, pixels: '4096 x 2160', aspectRatio: '17:9' },
    'canon-c70-4k-uhd':  { name: 'Canon C70/C300III - S35 4K UHD (3840x2160)', width: 24.6, height: 13.8, pixels: '3840 x 2160', aspectRatio: '16:9' },
    'canon-c70-2k-s35':  { name: 'Canon C70/C300III - S35 2K (2048x1080)', width: 26.2, height: 13.8, pixels: '2048 x 1080', aspectRatio: '17:9' },
    'canon-c70-hd':      { name: 'Canon C70/C300III - S35 HD (1920x1080)', width: 24.6, height: 13.8, pixels: '1920 x 1080', aspectRatio: '16:9' },
    'canon-c70-2k-s16':  { name: 'Canon C70/C300III - S16 2K Crop (2048x1080)', width: 12.32, height: 8.21, pixels: '2048 x 1080', aspectRatio: '17:9' },
    'canon-c70-hd-s16':  { name: 'Canon C70/C300III - S16 HD Crop (1920x1080)', width: 11.26, height: 8.21, pixels: '1920 x 1080', aspectRatio: '16:9' },
  },
  'canon-c300-iii': {
    'canon-c300iii-4k-dci': { name: 'Canon C300 Mark III - S35 4K DCI (4096x2160)', width: 26.2, height: 13.8, pixels: '4096 x 2160', aspectRatio: '17:9' },
    'canon-c300iii-4k-uhd': { name: 'Canon C300 Mark III - S35 4K UHD (3840x2160)', width: 24.6, height: 13.8, pixels: '3840 x 2160', aspectRatio: '16:9' },
    'canon-c300iii-2k-s35': { name: 'Canon C300 Mark III - S35 2K (2048x1080)', width: 26.2, height: 13.8, pixels: '2048 x 1080', aspectRatio: '17:9' },
    'canon-c300iii-2k-s16': { name: 'Canon C300 Mark III - S16 Crop (2048x1080)', width: 12.32, height: 8.21, pixels: '2048 x 1080', aspectRatio: '17:9' },
  },
  'canon-c500-ii': {
    'canon-c500ii-59k-ff':   { name: 'Canon C500 II - 5.9K FF (5952x3140)', width: 38.1, height: 20.1, pixels: '5952 x 3140', aspectRatio: '17:9' },
    'canon-c500ii-4k-dci-ff': { name: 'Canon C500 II - 4K DCI FF (4096x2160)', width: 38.1, height: 20.1, pixels: '4096 x 2160', aspectRatio: '17:9' },
    'canon-c500ii-4k-uhd-ff': { name: 'Canon C500 II - 4K UHD FF (3840x2160)', width: 35.7, height: 20.1, pixels: '3840 x 2160', aspectRatio: '16:9' },
    'canon-c500ii-43-ana':   { name: 'Canon C500 II - 4:3 Ana (4192x3140)', width: 26.8, height: 20.1, pixels: '4192 x 3140', aspectRatio: '4:3' },
    'canon-c500ii-65-ana':   { name: 'Canon C500 II - 6:5 Ana (3768x3140)', width: 24.1, height: 20.1, pixels: '3768 x 3140', aspectRatio: '6:5' },
    'canon-c500ii-4k-dci-s35': { name: 'Canon C500 II - 4K DCI S35 Crop (4096x2160)', width: 26.2, height: 13.8, pixels: '4096 x 2160', aspectRatio: '17:9' },
    'canon-c500ii-4k-uhd-s35': { name: 'Canon C500 II - 4K UHD S35 Crop (3840x2160)', width: 24.6, height: 13.8, pixels: '3840 x 2160', aspectRatio: '16:9' },
    'canon-c500ii-2k-s16':   { name: 'Canon C500 II - S16 Crop 2K (2048x1080)', width: 12.32, height: 8.21, pixels: '2048 x 1080', aspectRatio: '17:9' },
  },
  'canon-c700': {
    'canon-c700-59k-ff':   { name: 'Canon C700 FF - 5.9K FF (5952x3140)', width: 38.1, height: 20.1, pixels: '5952 x 3140', aspectRatio: '17:9' },
    'canon-c700-4k-dci-ff': { name: 'Canon C700 FF - 4K DCI FF (4096x2160)', width: 38.1, height: 20.1, pixels: '4096 x 2160', aspectRatio: '17:9' },
    'canon-c700-4k-uhd-ff': { name: 'Canon C700 FF - 4K UHD FF (3840x2160)', width: 35.7, height: 20.1, pixels: '3840 x 2160', aspectRatio: '16:9' },
    'canon-c700-43-ana':   { name: 'Canon C700 FF - 4:3 Ana (4192x3140)', width: 26.8, height: 20.1, pixels: '4192 x 3140', aspectRatio: '4:3' },
    'canon-c700-65-ana':   { name: 'Canon C700 FF - 6:5 Ana (3768x3140)', width: 24.1, height: 20.1, pixels: '3768 x 3140', aspectRatio: '6:5' },
    'canon-c700-4k-dci-s35': { name: 'Canon C700 FF - 4K DCI S35 Crop (4096x2160)', width: 26.2, height: 13.8, pixels: '4096 x 2160', aspectRatio: '17:9' },
    'canon-c700-4k-uhd-s35': { name: 'Canon C700 FF - 4K UHD S35 Crop (3840x2160)', width: 24.6, height: 13.8, pixels: '3840 x 2160', aspectRatio: '16:9' },
    'canon-c700-2k-s16':   { name: 'Canon C700 FF - S16 Crop 2K (2048x1080)', width: 12.32, height: 8.21, pixels: '2048 x 1080', aspectRatio: '17:9' },
  },
  'canon-r5c': {
    'canon-r5c-8k-dci':  { name: 'Canon EOS R5 C - 8K DCI FF (8192x4320)', width: 36.0, height: 19.0, pixels: '8192 x 4320', aspectRatio: '17:9' },
    'canon-r5c-8k-uhd':  { name: 'Canon EOS R5 C - 8K UHD FF (7680x4320)', width: 33.8, height: 19.0, pixels: '7680 x 4320', aspectRatio: '16:9' },
    'canon-r5c-4k-dci-ff': { name: 'Canon EOS R5 C - 4K DCI FF (4096x2160)', width: 36.0, height: 19.0, pixels: '4096 x 2160', aspectRatio: '17:9' },
    'canon-r5c-4k-uhd-ff': { name: 'Canon EOS R5 C - 4K UHD FF (3840x2160)', width: 33.8, height: 19.0, pixels: '3840 x 2160', aspectRatio: '16:9' },
    'canon-r5c-4k-s35':  { name: 'Canon EOS R5 C - 4K S35 Crop (4096x2160)', width: 24.0, height: 12.7, pixels: '4096 x 2160', aspectRatio: '17:9' },
    'canon-r5c-hd':      { name: 'Canon EOS R5 C - HD FF (1920x1080)', width: 33.8, height: 19.0, pixels: '1920 x 1080', aspectRatio: '16:9' },
  },
  'canon-r5-ii': {
    'canon-r5ii-8k-dci':  { name: 'Canon EOS R5 II - 8K DCI FF (8192x4320)', width: 36.0, height: 19.0, pixels: '8192 x 4320', aspectRatio: '17:9' },
    'canon-r5ii-8k-uhd':  { name: 'Canon EOS R5 II - 8K UHD FF (7680x4320)', width: 33.8, height: 19.0, pixels: '7680 x 4320', aspectRatio: '16:9' },
    'canon-r5ii-4k-dci-ff': { name: 'Canon EOS R5 II - 4K DCI FF (4096x2160)', width: 36.0, height: 19.0, pixels: '4096 x 2160', aspectRatio: '17:9' },
    'canon-r5ii-4k-uhd-ff': { name: 'Canon EOS R5 II - 4K UHD FF (3840x2160)', width: 33.8, height: 19.0, pixels: '3840 x 2160', aspectRatio: '16:9' },
    'canon-r5ii-4k-s35':  { name: 'Canon EOS R5 II - 4K S35 Crop (4096x2160)', width: 24.0, height: 12.7, pixels: '4096 x 2160', aspectRatio: '17:9' },
    'canon-r5ii-hd':      { name: 'Canon EOS R5 II - HD FF (1920x1080)', width: 33.8, height: 19.0, pixels: '1920 x 1080', aspectRatio: '16:9' },
  },
  'bmd-pocket-6k': {
    'bmd-p6k-6k':   { name: 'Blackmagic Pocket 6K - 6K S35 (6144x3456)', width: 23.1, height: 12.99, pixels: '6144 x 3456', aspectRatio: '16:9' },
    'bmd-p6k-57k':  { name: 'Blackmagic Pocket 6K - 5.7K (5744x3024)', width: 21.6, height: 11.37, pixels: '5744 x 3024', aspectRatio: '17:9' },
    'bmd-p6k-28k':  { name: 'Blackmagic Pocket 6K - 2.8K S16 (2880x1512)', width: 10.83, height: 5.68, pixels: '2880 x 1512', aspectRatio: '17:9' },
    'bmd-p6k-hd':   { name: 'Blackmagic Pocket 6K - HD S16 (1920x1080)', width: 7.22, height: 4.06, pixels: '1920 x 1080', aspectRatio: '16:9' },
  },
  'bmd-ursa-mini-pro-46k': {
    'bmd-ump46k-46k':    { name: 'BMD URSA Mini Pro 4.6K - 4.6K Full (4608x2592)', width: 25.34, height: 14.25, pixels: '4608 x 2592', aspectRatio: '16:9' },
    'bmd-ump46k-4k-dci': { name: 'BMD URSA Mini Pro 4.6K - 4K DCI (4096x2304)', width: 22.52, height: 12.67, pixels: '4096 x 2304', aspectRatio: '16:9' },
    'bmd-ump46k-4k-uhd': { name: 'BMD URSA Mini Pro 4.6K - 4K UHD (3840x2160)', width: 21.12, height: 11.88, pixels: '3840 x 2160', aspectRatio: '16:9' },
    'bmd-ump46k-hd':     { name: 'BMD URSA Mini Pro 4.6K - HD (1920x1080)', width: 10.56, height: 5.94, pixels: '1920 x 1080', aspectRatio: '16:9' },
  },
  'bmd-pyxis-6k': {
    'bmd-pyxis6k-6k-32':   { name: 'BMD PYXIS 6K - 6K 3:2 Open Gate (6048x4032)', width: 36.0, height: 24.0, pixels: '6048 x 4032', aspectRatio: '3:2' },
    'bmd-pyxis6k-6k-169':  { name: 'BMD PYXIS 6K - 6K 16:9 FF (6048x3402)', width: 36.0, height: 20.25, pixels: '6048 x 3402', aspectRatio: '16:9' },
    'bmd-pyxis6k-4k-dci':  { name: 'BMD PYXIS 6K - 4K DCI S35 (4096x2160)', width: 24.38, height: 12.86, pixels: '4096 x 2160', aspectRatio: '17:9' },
    'bmd-pyxis6k-4k-uhd':  { name: 'BMD PYXIS 6K - 4K UHD S35 (3840x2160)', width: 22.86, height: 12.86, pixels: '3840 x 2160', aspectRatio: '16:9' },
    'bmd-pyxis6k-s16':     { name: 'BMD PYXIS 6K - S16 (2112x1184)', width: 12.57, height: 7.05, pixels: '2112 x 1184', aspectRatio: '16:9' },
  },
  'bmd-pyxis-12k': {
    'bmd-pyxis12k-12k-32': { name: 'BMD PYXIS 12K - 12K 3:2 Open Gate (12288x8040)', width: 35.64, height: 23.32, pixels: '12288 x 8040', aspectRatio: '3:2' },
    'bmd-pyxis12k-8k-169': { name: 'BMD PYXIS 12K - 8K 16:9 FF (8192x4608)', width: 35.64, height: 20.0, pixels: '8192 x 4608', aspectRatio: '16:9' },
    'bmd-pyxis12k-4k-dci': { name: 'BMD PYXIS 12K - 4K DCI FF (4096x2160)', width: 35.64, height: 18.77, pixels: '4096 x 2160', aspectRatio: '17:9' },
    'bmd-pyxis12k-4k-uhd': { name: 'BMD PYXIS 12K - 4K UHD FF (3840x2160)', width: 35.64, height: 20.0, pixels: '3840 x 2160', aspectRatio: '16:9' },
    'bmd-pyxis12k-9k-s35': { name: 'BMD PYXIS 12K - 9K S35 Window (9216x5184)', width: 26.73, height: 15.04, pixels: '9216 x 5184', aspectRatio: '16:9' },
  },
  'bmd-ursa-mini-pro-12k': {
    'bmd-ump12k-12k-dci':  { name: 'URSA Mini Pro 12K - 12K DCI 17:9 (12288x6480)', width: 25.34, height: 13.36, pixels: '12288 x 6480', aspectRatio: '17:9' },
    'bmd-ump12k-12k-16-9': { name: 'URSA Mini Pro 12K - 12K 16:9 (11520x6480)', width: 23.76, height: 13.36, pixels: '11520 x 6480', aspectRatio: '16:9' },
    'bmd-ump12k-12k-241':  { name: 'URSA Mini Pro 12K - 12K 2.4:1 (12288x5112)', width: 25.34, height: 10.54, pixels: '12288 x 5112', aspectRatio: '2.4:1' },
    'bmd-ump12k-12k-6-5':  { name: 'URSA Mini Pro 12K - 12K 6:5 Anamorphic (7680x6408)', width: 15.84, height: 13.21, pixels: '7680 x 6408', aspectRatio: '6:5' },
    'bmd-ump12k-8k-dci':   { name: 'URSA Mini Pro 12K - 8K DCI 17:9 (8192x4320)', width: 16.89, height: 8.91, pixels: '8192 x 4320', aspectRatio: '17:9' },
    'bmd-ump12k-8k-16-9':  { name: 'URSA Mini Pro 12K - 8K 16:9 (7680x4320)', width: 15.84, height: 8.91, pixels: '7680 x 4320', aspectRatio: '16:9' },
    'bmd-ump12k-8k-241':   { name: 'URSA Mini Pro 12K - 8K 2.4:1 (8192x3408)', width: 16.89, height: 7.03, pixels: '8192 x 3408', aspectRatio: '2.4:1' },
    'bmd-ump12k-8k-6-5':   { name: 'URSA Mini Pro 12K - 8K 6:5 Anamorphic (5120x4272)', width: 10.56, height: 8.81, pixels: '5120 x 4272', aspectRatio: '6:5' },
  },
  'bmd-ursa-cine-12k': {
    'bmd-uc12k-12k-32': { name: 'BMD URSA Cine 12K - 12K 3:2 Open Gate (12288x8040)', width: 35.64, height: 23.32, pixels: '12288 x 8040', aspectRatio: '3:2' },
    'bmd-uc12k-8k-169': { name: 'BMD URSA Cine 12K - 8K 16:9 FF (8192x4608)', width: 35.64, height: 20.0, pixels: '8192 x 4608', aspectRatio: '16:9' },
    'bmd-uc12k-4k-dci': { name: 'BMD URSA Cine 12K - 4K DCI FF (4096x2160)', width: 35.64, height: 18.77, pixels: '4096 x 2160', aspectRatio: '17:9' },
    'bmd-uc12k-4k-uhd': { name: 'BMD URSA Cine 12K - 4K UHD FF (3840x2160)', width: 35.64, height: 20.0, pixels: '3840 x 2160', aspectRatio: '16:9' },
    'bmd-uc12k-9k-s35': { name: 'BMD URSA Cine 12K - 9K S35 Window (9216x5184)', width: 26.73, height: 15.04, pixels: '9216 x 5184', aspectRatio: '16:9' },
  },
  'bmd-ursa-cine-17k': {
    'bmd-uc17k-17k-65':   { name: 'BMD URSA Cine 17K - 17K 65mm Open Gate (17520x8040)', width: 50.808, height: 23.32, pixels: '17520 x 8040', aspectRatio: '65mm' },
    'bmd-uc17k-8k-ff':    { name: 'BMD URSA Cine 17K - 8K FF (8192x4320)', width: 35.64, height: 18.77, pixels: '8192 x 4320', aspectRatio: '17:9' },
    'bmd-uc17k-4k-dci':   { name: 'BMD URSA Cine 17K - 4K DCI FF (4096x2160)', width: 35.64, height: 18.77, pixels: '4096 x 2160', aspectRatio: '17:9' },
    'bmd-uc17k-4k-uhd':   { name: 'BMD URSA Cine 17K - 4K UHD FF (3840x2160)', width: 35.64, height: 20.0, pixels: '3840 x 2160', aspectRatio: '16:9' },
  },
};

function ParametersPanel(props) {
  const { state, setState, cameras = [], sensors = {}, isComparison = false, formatType = 'digital', filmFormats = [], onDuplicate, accentColor = null, collapseAll = false } = props;
  const [localCustomPixelWidth, setLocalCustomPixelWidth] = React.useState(() => state.customPixelWidth || '');
  const [localCustomPixelHeight, setLocalCustomPixelHeight] = React.useState(() => state.customPixelHeight || '');
  const [localCustomAnamorphic, setLocalCustomAnamorphic] = React.useState(() => formatType === 'film' ? (state.customFilmAnamorphic || '') : (state.customAnamorphicRatio || ''));
  const [localCustomAspectRatio, setLocalCustomAspectRatio] = React.useState(() => formatType === 'film' ? (state.customFilmAspectRatio || '') : (state.customOutputAspectRatio || ''));

  React.useEffect(() => {
    setLocalCustomAnamorphic(formatType === 'film' ? (state.customFilmAnamorphic || '') : (state.customAnamorphicRatio || ''));
    setLocalCustomAspectRatio(formatType === 'film' ? (state.customFilmAspectRatio || '') : (state.customOutputAspectRatio || ''));
  }, [formatType, state.customFilmAnamorphic, state.customAnamorphicRatio, state.customFilmAspectRatio, state.customOutputAspectRatio]);

  const [collapsed, setCollapsed] = React.useState(false);

  React.useEffect(() => {
    if (collapseAll) setCollapsed(true);
    else setCollapsed(false);
  }, [collapseAll]);
  
  const defaultsChecked = isComparison ? (
    formatType === 'digital' 
      ? (state.lensCircle === 'super-35' && state.camera === 'arri-alexa-35' && state.sensorFormat === 'arri-alexa-35-46k-og' && state.anamorphicRatio === '1.5' && state.desiredAspectRatio === '2.39' && !state.useCustomAnamorphic && !state.useCustomAspectRatio)
      : (state.filmFormat === 'super-35-4perf' && state.filmAnamorphicRatio === '2' && state.filmDesiredAspectRatio === '2.39' && !state.useCustomFilmAnamorphic && !state.useCustomFilmAspectRatio)
  ) : false;

  React.useEffect(() => {
    const timer = setTimeout(() => {
      const updates = {};
      if (localCustomPixelWidth !== (state.customPixelWidth || '')) {
        updates.customPixelWidth = localCustomPixelWidth;
      }
      if (localCustomPixelHeight !== (state.customPixelHeight || '')) {
        updates.customPixelHeight = localCustomPixelHeight;
      }
      if (Object.keys(updates).length > 0) {
        setState(updates);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [localCustomPixelWidth, localCustomPixelHeight, setState, state.customPixelWidth, state.customPixelHeight]);

  return (
  <div className={`border rounded-lg p-3 md:p-4 pb-3${isComparison ? '' : ' sticky top-4'}`} style={ accentColor ? { backgroundColor: accentColor.bg, borderColor: accentColor.border } : { backgroundColor: '#e5e7eb', borderColor: 'rgba(0,0,0,0.15)' }}>
  <div className="mb-1 md:mb-2">
    <button 
      onClick={() => { if (collapseAll) { props.onUncollapse && props.onUncollapse(); } else { setCollapsed(!collapsed); } }}
      className="flex items-center gap-2 text-black text-base font-bold tracking-wider hover:opacity-70 transition-opacity"
    >
      <ChevronDown className={`w-4 h-4 transition-transform ${collapsed ? '-rotate-90' : ''}`} />
      PARAMETERS
    </button>
    {collapsed && (() => {
      if (formatType === 'digital') {
        const camObj = cameras.find(c => c.id === state.camera);
        const camName = state.bypassCamera ? 'Custom' : (camObj?.name || '—');
        const fmtObj = state.useCustomPixels ? `${state.customPixelWidth}×${state.customPixelHeight}px` : (sensors[state.sensorFormat]?.pixels || '—');
        const squeeze = state.useCustomAnamorphic ? `${state.customAnamorphicRatio}x` : (state.anamorphicRatio ? `${state.anamorphicRatio}x` : '—');
        const ar = state.useCustomAspectRatio ? `${state.customOutputAspectRatio}:1` : (state.desiredAspectRatio ? `${state.desiredAspectRatio}:1` : '—');
        return (
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
            <span className="text-xs font-mono text-black text-opacity-50">{camName}</span>
            <span className="text-xs font-mono text-black text-opacity-40">{fmtObj}</span>
            <span className="text-xs font-mono text-black text-opacity-60 font-bold">{squeeze}</span>
            <span className="text-xs font-mono text-black text-opacity-50">→ {ar}</span>
          </div>
        );
      } else {
        const squeeze = state.useCustomFilmAnamorphic ? `${state.customFilmAnamorphic}x` : (state.filmAnamorphicRatio ? `${state.filmAnamorphicRatio}x` : '—');
        const ar = state.useCustomFilmAspectRatio ? `${state.customFilmAspectRatio}:1` : (state.filmDesiredAspectRatio ? `${state.filmDesiredAspectRatio}:1` : '—');
        const fmt = state.filmFormat ? state.filmFormat.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : '—';
        return (
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
            <span className="text-xs font-mono text-black text-opacity-50">{fmt}</span>
            <span className="text-xs font-mono text-black text-opacity-60 font-bold">{squeeze}</span>
            <span className="text-xs font-mono text-black text-opacity-50">→ {ar}</span>
          </div>
        );
      }
    })()}
    {isComparison && (
      <div className="flex items-center gap-2 mt-2 flex-wrap">
        <label className="flex items-center gap-1 cursor-pointer">
          <input
            type="checkbox"
            checked={defaultsChecked}
            onChange={(e) => {
              if (e.target.checked) {
                if (formatType === 'digital') {
                  setState({
                    ...state,
                    lensCircle: 'super-35',
                    bypassLens: false,
                    camera: 'arri-alexa-35',
                    bypassCamera: false,
                    sensorFormat: 'arri-alexa-35-46k-og',
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
        {onDuplicate && (
          <button
            onClick={onDuplicate}
            className="text-black text-opacity-60 font-bold text-xs px-2 py-1 rounded border border-black border-opacity-15 hover:bg-white transition-all"
          >
            ⧉ DUPLICATE PREVIOUS
          </button>
        )}
      </div>
    )}
  </div>

  <div style={{ display: collapsed ? 'none' : 'block' }}>

  {formatType === 'digital' && (
  <div className="mb-3 md:mb-4">
    <label className="block text-black text-opacity-60 text-sm font-bold mb-1 md:mb-2 tracking-widest">LENS IMAGE CIRCLE</label>
    <div className="grid grid-cols-4 gap-2 mb-3">
      <button
        onClick={() => setState({ ...state, lensCircle: 'super-16', bypassLens: false })}
        className={`py-1.5 md:py-2 rounded font-bold transition-all border text-xs md:text-sm text-center leading-tight ${
          state.lensCircle === 'super-16'
            ? 'bg-slate-400 text-black border-slate-400'
            : 'bg-white text-black border-black border-opacity-20 hover:bg-opacity-20'
        }`}
      >
        S16
      </button>
      <button
        onClick={() => setState({ ...state, lensCircle: 'super-35', bypassLens: false })}
        className={`py-1.5 md:py-2 rounded font-bold transition-all border text-xs md:text-sm text-center leading-tight ${
          state.lensCircle === 'super-35'
            ? 'bg-slate-400 text-black border-slate-400'
            : 'bg-white text-black border-black border-opacity-20 hover:bg-opacity-20'
        }`}
      >
        S35
      </button>
      <button
        onClick={() => setState({ ...state, lensCircle: 'full-frame', bypassLens: false })}
        className={`py-1.5 md:py-2 rounded font-bold transition-all border text-xs md:text-sm text-center leading-tight ${
          state.lensCircle === 'full-frame'
            ? 'bg-slate-400 text-black border-slate-400'
            : 'bg-white text-black border-black border-opacity-20 hover:bg-opacity-20'
        }`}
      >
        FF
      </button>
      <button
        onClick={() => setState({ ...state, lensCircle: '65mm', bypassLens: false })}
        className={`py-1.5 md:py-2 rounded font-bold transition-all border text-xs md:text-sm text-center leading-tight ${
          state.lensCircle === '65mm'
            ? 'bg-slate-400 text-black border-slate-400'
            : 'bg-white text-black border-black border-opacity-20 hover:bg-opacity-20'
        }`}
      >
        65MM
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

  <div className="mb-3 md:mb-4">
    <label className="block text-black text-opacity-60 text-sm font-bold mb-1 md:mb-2 tracking-widest">{formatType === 'film' ? 'CAMERA NEGATIVE' : 'CAMERA'}</label>
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
        className="w-full bg-gray-100 border border-black border-opacity-15 text-black pl-4 pr-10 py-2 rounded appearance-none focus:outline-none focus:border-slate-400 transition-all cursor-pointer font-mono text-sm"
      >
        <option value="">{formatType === 'film' ? '-- Please Select Format --' : '-- Please Select Camera --'}</option>
        {(formatType === 'film' ? filmFormats.filter(f => !f.hidden) : cameras).map((item) => (
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
  <div className="mb-3 md:mb-4">
    <label className="block text-black text-opacity-60 text-sm font-bold mb-1 md:mb-2 tracking-widest">SENSOR FORMAT</label>
    <div className="relative mb-3">
      <select
        value={state.sensorFormat}
        onChange={(e) => setState({ ...state, sensorFormat: e.target.value, useCustomPixels: false })}
        className="w-full bg-gray-100 border border-black border-opacity-15 text-black pl-4 pr-10 py-2 rounded appearance-none focus:outline-none focus:border-slate-400 transition-all cursor-pointer font-mono text-sm"
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

    <div className="mb-3 bg-gray-100 border border-black border-opacity-15 rounded-lg overflow-hidden">
      <label className={`flex items-center gap-3 text-black text-sm font-bold cursor-pointer px-3 py-2${state.useCustomPixels ? ' mb-0' : ''}`}>
        <input
          type="checkbox"
          checked={state.useCustomPixels}
          onChange={(e) => setState({ ...state, useCustomPixels: e.target.checked, sensorFormat: '' })}
          className="w-5 h-5 cursor-pointer"
        />
        <span className="text-black text-opacity-60">CUSTOM RESOLUTION</span>
      </label>
      <div className="grid grid-cols-2 gap-2 px-3 pb-3" style={{ display: state.useCustomPixels ? 'grid' : 'none' }}>
        <input
          type="number"
          value={localCustomPixelWidth}
          onChange={(e) => setLocalCustomPixelWidth(e.target.value)}
          placeholder="Width (px)"
          className="w-full bg-white border border-slate-400 border-opacity-40 text-black px-3 py-2 rounded focus:outline-none focus:border-slate-400 transition-all font-mono text-sm"
        />
        <input
          type="number"
          value={localCustomPixelHeight}
          onChange={(e) => setLocalCustomPixelHeight(e.target.value)}
          placeholder="Height (px)"
          className="w-full bg-white border border-slate-400 border-opacity-40 text-black px-3 py-2 rounded focus:outline-none focus:border-slate-400 transition-all font-mono text-sm"
        />
      </div>
    </div>
  </div>
  )}

  <div className="mb-3 md:mb-4">
    <label className="block text-black text-opacity-60 text-sm font-bold mb-1 md:mb-2 tracking-widest">SQUEEZE RATIO</label>
    <div className={`grid gap-2 mb-3 ${formatType === 'digital' ? 'grid-cols-5' : 'grid-cols-4'}`}>
      {(formatType === 'film' ? filmAnamorphicOptions : anamorphicOptions).map((opt) => (
        <button
          key={opt.value}
          disabled={(formatType === 'film' && state.useCustomFilmAnamorphic) || (formatType === 'digital' && state.useCustomAnamorphic)}
          onClick={() => {
            if (formatType === 'film') {
              setState({ ...state, filmAnamorphicRatio: opt.value, useCustomFilmAnamorphic: false });
            } else {
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

    <div className="bg-gray-100 border border-black border-opacity-15 rounded-lg overflow-hidden">
      <label className="flex items-center gap-3 text-black text-sm font-bold cursor-pointer px-3 py-2">
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
      <div className="px-3 pb-3" style={{ display: (formatType === 'film' ? state.useCustomFilmAnamorphic : state.useCustomAnamorphic) ? 'block' : 'none' }}>
        <input
          type="number"
          step="0.1"
          value={localCustomAnamorphic}
          onChange={(e) => {
            setLocalCustomAnamorphic(e.target.value);
            if (formatType === 'film') {
              setState({ ...state, customFilmAnamorphic: e.target.value });
            } else {
              setState({ ...state, customAnamorphicRatio: e.target.value });
            }
          }}
          placeholder="e.g., 2.0"
          className="w-full bg-white border border-slate-400 border-opacity-40 text-black px-4 py-2 rounded focus:outline-none focus:border-slate-400 transition-all font-mono text-sm"
        />
      </div>
    </div>
    {formatType === 'digital' && (
      <label className="flex items-center gap-3 text-black text-sm font-bold mt-3 cursor-pointer">
        <input
          type="checkbox"
          checked={state.verticalSqueeze || false}
          onChange={(e) => setState({ ...state, verticalSqueeze: e.target.checked })}
          className="w-5 h-5 cursor-pointer"
        />
        <span className="text-black text-opacity-60">VERTICAL SQUEEZE</span>
      </label>
    )}
  </div>

  <div className="mb-0">
    <label className="block text-black text-opacity-60 text-sm font-bold mb-1 md:mb-2 tracking-widest">OUTPUT ASPECT RATIO</label>
    <div className="grid grid-cols-5 gap-2 mb-3">
      {aspectRatioOptions.map((opt) => (
        <button
          key={opt.value}
          disabled={(formatType === 'film' && state.useCustomFilmAspectRatio) || (formatType === 'digital' && state.useCustomAspectRatio)}
          onClick={() => {
            if (formatType === 'film') {
              setState({ ...state, filmDesiredAspectRatio: opt.value, useCustomFilmAspectRatio: false });
            } else {
              setState({ ...state, desiredAspectRatio: opt.value, useCustomAspectRatio: false, useCustomPixels: state.useCustomPixels });
            }
          }}
          className={`py-2 px-1 rounded text-xs font-bold transition-all border overflow-hidden ${
            (formatType === 'film' && state.useCustomFilmAspectRatio) || (formatType === 'digital' && state.useCustomAspectRatio)
              ? 'bg-white text-gray-400 border-gray-600 opacity-50 cursor-not-allowed'
              : (formatType === 'film' ? state.filmDesiredAspectRatio : state.desiredAspectRatio) === opt.value
              ? 'bg-slate-400 text-black border-slate-400'
              : 'bg-white text-black border-black border-opacity-20 hover:bg-opacity-20'
          }`}
        >
          <div className="text-center leading-snug break-all">
            <div>{opt.label}</div>
            <div style={{fontSize: '0.65rem'}} className="opacity-60 mt-0.5">{opt.divisor}</div>
          </div>
        </button>
      ))}
    </div>

    <div className="bg-gray-100 border border-black border-opacity-15 rounded-lg overflow-hidden">
      <label className="flex items-center gap-3 text-black text-sm font-bold cursor-pointer px-3 py-2">
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
      <div className="px-3 pb-3" style={{ display: (formatType === 'film' ? state.useCustomFilmAspectRatio : state.useCustomAspectRatio) ? 'block' : 'none' }}>
        <input
          type="number"
          step="0.01"
          value={localCustomAspectRatio}
          onChange={(e) => {
            setLocalCustomAspectRatio(e.target.value);
            if (formatType === 'film') {
              setState({ ...state, customFilmAspectRatio: e.target.value });
            } else {
              setState({ ...state, customOutputAspectRatio: e.target.value });
            }
          }}
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

export default function AnamorphicCalculator() {
  const [formatType, setFormatType] = useState('digital'); // 'digital' or 'film'

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
  const [verticalSqueeze, setVerticalSqueeze] = useState(false);
  const [selectedFilmFormat, setSelectedFilmFormat] = useState('');
  const [filmAnamorphicRatio, setFilmAnamorphicRatio] = useState('');
  const [filmDesiredAspectRatio, setFilmDesiredAspectRatio] = useState('');
  const [useCustomFilmAnamorphic, setUseCustomFilmAnamorphic] = useState(false);
  const [customFilmAnamorphic, setCustomFilmAnamorphic] = useState('');
  const [useCustomFilmAspectRatio, setUseCustomFilmAspectRatio] = useState(false);
  const [customFilmAspectRatio, setCustomFilmAspectRatio] = useState('');

  const [comparisonTabsDigital, setComparisonTabsDigital] = useState([]);
  const [comparisonStatesDigital, setComparisonStatesDigital] = useState([{}, {}, {}]);
  const [comparisonTabsFilm, setComparisonTabsFilm] = useState([]);
  const [comparisonStatesFilm, setComparisonStatesFilm] = useState([{}, {}, {}]);
  
  const [showDefaults, setShowDefaults] = useState(false);
  const [collapseAll, setCollapseAll] = useState(false);
  const openAll = () => {
    setCollapseAll(false);
    setShowDataBoxes(true);
    setComparisonStates(prev => prev.map(s => s ? { ...s, showDataBoxes: true } : s));
  };
  const [showDataBoxes, setShowDataBoxes] = useState(true);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);
  
  const comparisonTabs = formatType === 'digital' ? comparisonTabsDigital : comparisonTabsFilm;
  const setComparisonTabs = formatType === 'digital' ? setComparisonTabsDigital : setComparisonTabsFilm;
  const comparisonStates = formatType === 'digital' ? comparisonStatesDigital : comparisonStatesFilm;
  const setComparisonStates = formatType === 'digital' ? setComparisonStatesDigital : setComparisonStatesFilm;

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
      if (params.get('verticalSqueeze') === '1') setVerticalSqueeze(true);
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

  useEffect(() => {
    if (showDefaults) {
      // Check if current state differs from digital defaults
      if (formatType === 'digital') {
        const isDefaultDigital = 
          lensImageCircle === 'super-35' &&
          selectedCamera === 'arri-alexa-35' &&
          sensorFormat === 'arri-alexa-35-46k-og' &&
          anamorphicRatio === '1.5' &&
          desiredAspectRatio === '2.39' &&
          !useCustomAnamorphic &&
          !useCustomAspectRatio;
        
        if (!isDefaultDigital) {
          setShowDefaults(false);
        }
      } else {
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

  const computeDigitalResult = React.useCallback((camera, sensorFmt, anamRatio, desiredRatio, customPixels, custPW, custPH) => {
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
    // Keep as float for accurate AR calculations
    const desqueezedHeightFloat = usedPixelHeight / squeeze;
    let desqueezedHeight = desqueezedHeightFloat;
    let boundedWidth = usedPixelWidth;
    
    // Digital sensor bounding: desqueezed output cannot exceed original sensor dimensions
    if (desqueezedHeight > usedPixelHeight) {
      const scale = usedPixelHeight / desqueezedHeight;
      boundedWidth = Math.round(usedPixelWidth * scale);
      desqueezedHeight = usedPixelHeight;
    }
    
    const desqueezedAspectRatio = (sensorWidth * squeeze) / sensorHeight;
    // Use float values for AR calculation to avoid drift
    const desqueezedAR = boundedWidth / desqueezedHeight;

    let desqueezedCroppedHeight = desqueezedHeight;
    let desqueezedCroppedWidth = boundedWidth;
    let cropPixelsNeeded = 0;
    let cropPercentage = 0;

    if (desiredAR > desqueezedAR) {
      desqueezedCroppedHeight = boundedWidth / desiredAR; // Keep float
      cropPixelsNeeded = desqueezedHeight - desqueezedCroppedHeight;
      cropPercentage = (cropPixelsNeeded / desqueezedHeight) * 100;
    } else if (desiredAR < desqueezedAR) {
      desqueezedCroppedWidth = Math.round(desqueezedHeight * desiredAR);
      cropPixelsNeeded = boundedWidth - desqueezedCroppedWidth;
      cropPercentage = (cropPixelsNeeded / boundedWidth) * 100;
    }

    const coverage = 100 - cropPercentage;
    let croppedPixelHeight = desqueezedHeight;
    let croppedPixelWidth = boundedWidth;

    if (desiredAR > desqueezedAR) {
      croppedPixelHeight = desqueezedCroppedHeight;
    } else if (desiredAR < desqueezedAR) {
      croppedPixelWidth = desqueezedCroppedWidth;
    }

    const netflixCompliance = calculateNetflixCompliance(squeeze, desiredAR, pixelWidth, pixelHeight);

    return {
      pixelWidth: Math.round(pixelWidth),
      pixelHeight: Math.round(pixelHeight),
      usedPixelWidth: Math.round(boundedWidth),
      usedPixelHeight: Math.round(usedPixelHeight),
      desqueezedHeight: Math.round(desqueezedHeight), // Round for display only
      desqueezedAR,
      desqueezedCroppedHeight: Math.round(desqueezedCroppedHeight), // Round for display
      desqueezedCroppedWidth,
      croppedPixelWidth: Math.round(croppedPixelWidth),
      croppedPixelHeight: Math.round(croppedPixelHeight),
      cropPixelsNeeded: Math.round(cropPixelsNeeded),
      naturalAspectRatio: desqueezedAspectRatio.toFixed(2),
      coverage: coverage.toFixed(1),
      cropPercentage: cropPercentage.toFixed(1),
      anamorphic: squeeze,
      aspectRatio: desiredAR,
      netflixCompliance,
    };
  }, []);

  // Netflix Minimum Capture Resolution Checker
  const NETFLIX_UHD_AREA = 8294400; // 3840 × 2160

  const calculateNetflixCompliance = (squeeze, outputAR, sensorPixelWidth, sensorPixelHeight) => {
    if (!squeeze || !outputAR || !sensorPixelWidth || !sensorPixelHeight) {
      return { compliant: null, minRequired: null };
    }

    const s = parseFloat(squeeze);
    const r = parseFloat(outputAR);
    const w = parseInt(sensorPixelWidth);
    const h = parseInt(sensorPixelHeight);

    // Netflix only publishes minimums up to 2.40:1
    if (r > 2.40) {
      return { compliant: null, minRequired: null, unpublished: true };
    }

    // Netflix minimum capture formula:
    // H_min = ⌈√(UHD_AREA × S / R)⌉  — minimum capture height for UHD-equivalent pixel area
    // W_min = ⌈(R / S) × H_min⌉       — minimum capture width preserving squeezed AR
    // Based on Netflix constraint: captured_W × captured_H ≥ 3840 × 2160
    const minHeight = Math.ceil(Math.sqrt((NETFLIX_UHD_AREA * s) / r));
    const minWidth = Math.ceil((r / s) * minHeight);

    return {
      compliant: w >= minWidth && h >= minHeight,
      minRequired: `${minWidth} × ${minHeight}`,
      minHeight,
      minWidth,
      unpublished: false
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
    let squeeze = useCustomAnamorphic ? customAnamorphicRatio : anamorphicRatio;
    if (verticalSqueeze) {
      const sq = parseFloat(squeeze) || 1;
      squeeze = String(1 / sq);
    }
    const desired = useCustomAspectRatio ? customOutputAspectRatio : desiredAspectRatio;
    return computeDigitalResult(selectedCamera, sensorFormat, squeeze, desired, useCustomPixels, customPixelWidth, customPixelHeight);
  }, [selectedCamera, sensorFormat, anamorphicRatio, desiredAspectRatio, useCustomPixels, customPixelWidth, customPixelHeight, useCustomAnamorphic, useCustomAspectRatio, customAnamorphicRatio, customOutputAspectRatio, verticalSqueeze, bypassCameraSelection, computeDigitalResult]);

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
  }, [selectedFilmFormat, filmAnamorphicRatio, filmDesiredAspectRatio, useCustomFilmAnamorphic, useCustomFilmAspectRatio, customFilmAnamorphic, customFilmAspectRatio]);

  // COMPARISON CALCULATIONS - DIGITAL

  const filteredCameraList = cameraList.filter(camera => {
    if (camera.format !== formatType) return false;
    if (bypassCameraSelection) return true;
    if (!lensImageCircle) return true;
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

  const generateShareLink = () => {
    const params = new URLSearchParams();
    
    if (formatType === 'digital') {
    params.append('format', 'digital');
    params.append('camera', selectedCamera);
      params.append('sensorFormat', sensorFormat);
      params.append('anamorphic', useCustomAnamorphic ? customAnamorphicRatio : anamorphicRatio);
      params.append('aspect', useCustomAspectRatio ? customOutputAspectRatio : desiredAspectRatio);
      if (verticalSqueeze) params.append('verticalSqueeze', '1');
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

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 md:px-8 py-2">
        <div className="mb-1 md:mb-2 py-2 md:py-3">
          <div className="flex items-stretch justify-center gap-8 md:gap-16 overflow-hidden">
            {/* Left lens - mirrored */}
            <div className="flex flex-shrink-0 opacity-85 self-stretch items-stretch overflow-hidden" style={{transform: 'scaleX(-1)', paddingTop: '2px', paddingBottom: '2px'}}>
              <svg width="220" height="100%" viewBox="0 0 220 100" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Gray front group - 2 elements */}
                <path d="M8 20 Q16 50 8 80" fill="#9ca3af"/>
                <path d="M16 20 Q8 50 16 80" fill="#b8bec7"/>
                <path d="M22 24 Q30 50 22 76" fill="#9ca3af"/>
                {/* Blue anamorphic block */}
                <rect x="36" y="20" width="14" height="60" rx="1" fill="#2563eb"/>
                <rect x="52" y="24" width="8" height="52" rx="1" fill="#3b82f6"/>
                {/* Gray mid group */}
                <path d="M68 26 Q76 50 68 74" fill="#9ca3af"/>
                <path d="M76 26 Q68 50 76 74" fill="#b8bec7"/>
                {/* Green anamorphic crescent - signature element */}
                <path d="M90 28 Q104 38 108 50 Q104 62 90 72 Q100 62 102 50 Q100 38 90 28Z" fill="#16a34a"/>
                <path d="M102 32 Q112 40 114 50 Q112 60 102 68 Q110 60 112 50 Q110 40 102 32Z" fill="#22c55e"/>
                {/* Gray rear group */}
                <path d="M124 28 Q132 50 124 72" fill="#9ca3af"/>
                <path d="M132 28 Q124 50 132 72" fill="#b8bec7"/>
                <path d="M140 30 Q148 50 140 70" fill="#6b7280"/>
                {/* Final blue element */}
                <rect x="154" y="30" width="12" height="40" rx="1" fill="#2563eb"/>
                {/* Rear gray elements */}
                <path d="M174 34 Q181 50 174 66" fill="#b8bec7"/>
                <path d="M181 36 Q188 50 181 64" fill="#9ca3af"/>
                <path d="M192 38 Q199 50 192 62" fill="#b8bec7"/>
              </svg>
            </div>
            {/* Center: title + divider + buttons */}
            <div className="text-center flex-shrink-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light tracking-tight mb-1 md:mb-2 text-black" style={{ fontWeight: 300, letterSpacing: '-1px' }}>
                ANAMORPHIC LENS CALCULATOR
              </h1>
              <div className="w-12 h-px bg-black bg-opacity-30 mx-auto mb-3"></div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setFormatType('digital')}
                  className={`px-6 py-1.5 rounded text-sm font-bold transition-all border ${
                    formatType === 'digital'
                      ? 'bg-slate-400 text-gray-900 border-slate-400'
                      : 'bg-white text-black border-black border-opacity-20 hover:border-opacity-40'
                  }`}
                >
                  DIGITAL
                </button>
                <button
                  onClick={() => setFormatType('film')}
                  className={`px-6 py-1.5 rounded text-sm font-bold transition-all border ${
                    formatType === 'film'
                      ? 'bg-slate-400 text-gray-900 border-slate-400'
                      : 'bg-white text-black border-black border-opacity-20 hover:border-opacity-40'
                  }`}
                >
                  FILM
                </button>
              </div>
            </div>
            {/* Right lens */}
            <div className="flex flex-shrink-0 opacity-85 self-stretch items-stretch overflow-hidden" style={{paddingTop: '2px', paddingBottom: '2px'}}>
              <svg width="220" height="100%" viewBox="0 0 220 100" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Gray front group - 2 elements */}
                <path d="M8 20 Q16 50 8 80" fill="#9ca3af"/>
                <path d="M16 20 Q8 50 16 80" fill="#b8bec7"/>
                <path d="M22 24 Q30 50 22 76" fill="#9ca3af"/>
                {/* Blue anamorphic block */}
                <rect x="36" y="20" width="14" height="60" rx="1" fill="#2563eb"/>
                <rect x="52" y="24" width="8" height="52" rx="1" fill="#3b82f6"/>
                {/* Gray mid group */}
                <path d="M68 26 Q76 50 68 74" fill="#9ca3af"/>
                <path d="M76 26 Q68 50 76 74" fill="#b8bec7"/>
                {/* Green anamorphic crescent - signature element */}
                <path d="M90 28 Q104 38 108 50 Q104 62 90 72 Q100 62 102 50 Q100 38 90 28Z" fill="#16a34a"/>
                <path d="M102 32 Q112 40 114 50 Q112 60 102 68 Q110 60 112 50 Q110 40 102 32Z" fill="#22c55e"/>
                {/* Gray rear group */}
                <path d="M124 28 Q132 50 124 72" fill="#9ca3af"/>
                <path d="M132 28 Q124 50 132 72" fill="#b8bec7"/>
                <path d="M140 30 Q148 50 140 70" fill="#6b7280"/>
                {/* Final blue element */}
                <rect x="154" y="30" width="12" height="40" rx="1" fill="#2563eb"/>
                {/* Rear gray elements */}
                <path d="M174 34 Q181 50 174 66" fill="#b8bec7"/>
                <path d="M181 36 Q188 50 181 64" fill="#9ca3af"/>
                <path d="M192 38 Q199 50 192 62" fill="#b8bec7"/>
              </svg>
            </div>
          </div>
        </div>
        {/* DEFAULTS */}
        <div className="mt-1 mb-2 md:mb-4 flex justify-center gap-2 items-center flex-wrap">

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
                    setLensImageCircle('super-35');
                    setSelectedCamera('arri-alexa-35');
                    setSensorFormat('arri-alexa-35-46k-og');
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
          <button
            onClick={() => collapseAll ? openAll() : setCollapseAll(true)}
            className={`font-bold text-xs px-2 py-1 rounded border transition-all ${collapseAll ? 'bg-slate-400 text-black border-slate-400' : 'text-black text-opacity-60 border-black border-opacity-15 hover:bg-black hover:bg-opacity-5'}`}
          >
            ↑ COLLAPSE ALL
          </button>
        </div>

        {/* MAIN CALCULATOR GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1 self-start">
            <ParametersPanel
              state={{
                lensCircle: lensImageCircle, bypassLens: bypassLensCircle, camera: selectedCamera, filmFormat: selectedFilmFormat, bypassCamera: bypassCameraSelection, sensorFormat, useCustomPixels, customPixelWidth, customPixelHeight, anamorphicRatio, useCustomAnamorphic, customAnamorphicRatio, desiredAspectRatio, useCustomAspectRatio, customOutputAspectRatio, verticalSqueeze, filmAnamorphicRatio, useCustomFilmAnamorphic, customFilmAnamorphic, filmDesiredAspectRatio, useCustomFilmAspectRatio, customFilmAspectRatio,
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
                if (newState.verticalSqueeze !== undefined) setVerticalSqueeze(newState.verticalSqueeze);
                if (newState.filmAnamorphicRatio !== undefined) setFilmAnamorphicRatio(newState.filmAnamorphicRatio);
                if (newState.useCustomFilmAnamorphic !== undefined) setUseCustomFilmAnamorphic(newState.useCustomFilmAnamorphic);
                if (newState.customFilmAnamorphic !== undefined) setCustomFilmAnamorphic(newState.customFilmAnamorphic);
                if (newState.filmDesiredAspectRatio !== undefined) setFilmDesiredAspectRatio(newState.filmDesiredAspectRatio);
                if (newState.useCustomFilmAspectRatio !== undefined) setUseCustomFilmAspectRatio(newState.useCustomFilmAspectRatio);
                if (newState.customFilmAspectRatio !== undefined) setCustomFilmAspectRatio(newState.customFilmAspectRatio);
              }, [])}
              formatType={formatType} filmFormats={filmFormats} cameras={filteredCameraList} sensors={currentSensors} collapseAll={collapseAll} onUncollapse={() => openAll()}
            />
          </div>
          <div className="lg:col-span-2">
            {formatType === 'digital' ? (
              (!selectedCamera && !bypassCameraSelection) || (!useCustomPixels && !sensorFormat) || (!anamorphicRatio && !useCustomAnamorphic) || (!desiredAspectRatio && !useCustomAspectRatio) || (useCustomAnamorphic && !customAnamorphicRatio) || (useCustomAspectRatio && !customOutputAspectRatio) ? (
                <div className="bg-gray-100 border border-black border-opacity-15 rounded-lg p-8 text-center"><p className="text-black text-lg opacity-60">Select all parameters above to view calculations</p></div>
              ) : calculateDigital ? (
                <div data-export-visualizer className="bg-gray-200 border border-black border-opacity-15 rounded-lg p-6">
                  <h3 className="text-black text-base font-bold mb-3 tracking-wider">DESQUEEZED OUTPUT</h3>
                  <div className="flex justify-center items-center mb-4">
                    {(() => {
                      const ar = calculateDigital.desqueezedAR || 2.0;
                      return (
                        <div style={{ aspectRatio: `${ar} / 1`, maxWidth: '500px', width: '100%' }}>
                          <div className="bg-slate-400 border-2 border-blue-600 relative w-full h-full">
                            <div className="absolute border-2 border-green-400" style={{ left: `${Math.max(0, Math.min(100, ((calculateDigital.usedPixelWidth - calculateDigital.croppedPixelWidth) / calculateDigital.usedPixelWidth / 2) * 100))}%`, top: `${Math.max(0, Math.min(100, ((calculateDigital.desqueezedHeight - calculateDigital.croppedPixelHeight) / calculateDigital.desqueezedHeight / 2) * 100))}%`, width: `${Math.max(0, Math.min(100, (calculateDigital.croppedPixelWidth / calculateDigital.usedPixelWidth) * 100))}%`, height: `${Math.max(0, Math.min(100, (calculateDigital.croppedPixelHeight / calculateDigital.desqueezedHeight) * 100))}%`, boxSizing: 'border-box' }} />
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                  <div className="pt-4 border-t border-black border-opacity-10">
                    <p className="text-black text-opacity-60 text-xs font-bold mb-2">LEGEND</p>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="flex items-center gap-2"><div className="w-3 h-3 border-2 border-blue-600 bg-slate-400"></div><span className="text-black text-opacity-60 font-bold">Desqueezed: {calculateDigital.usedPixelWidth}×{calculateDigital.desqueezedHeight}</span></div>
                      <div className="flex items-center gap-2"><div className="w-3 h-3 border-2 border-green-400 bg-slate-400"></div><span className="text-black text-opacity-60">Cropped: {calculateDigital.croppedPixelWidth}×{calculateDigital.croppedPixelHeight}</span></div>
                    </div>
                  </div>
                  <div className="mt-3 md:mt-6">
                    <button
                      onClick={() => { if (collapseAll) { openAll(); } else { setShowDataBoxes(v => !v); } }}
                      className="flex items-center gap-2 text-black text-opacity-50 text-xs font-bold tracking-widest mb-2 hover:text-opacity-80 transition-all"
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform ${(!collapseAll && showDataBoxes) ? '' : '-rotate-90'}`} />
                      <span>DATA</span>
                    </button>
                    {!collapseAll && showDataBoxes && (
                      <>
                        <div className="grid grid-cols-2 gap-2 md:gap-4">
                          <div className="bg-green-100 border border-green-400 rounded-lg p-2 md:p-4 overflow-hidden"><div className="text-black text-xs sm:text-sm font-bold tracking-widest mb-2">UNSQUEEZED</div><div className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold break-all text-black">{calculateDigital.naturalAspectRatio}:1</div></div>
                          <div className="bg-blue-100 border border-blue-400 rounded-lg p-2 md:p-4 overflow-hidden"><div className="text-black text-xs sm:text-sm font-bold tracking-widest mb-2">DESIRED</div><div className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold break-all text-black">{calculateDigital.aspectRatio}:1</div></div>
                          <div className={`rounded-lg p-2 md:p-4 lg:p-6 ${parseFloat(calculateDigital.cropPercentage) > 0 ? 'bg-emerald-200 border border-emerald-500' : 'bg-green-100 border border-green-400'}`}><div className="text-black text-xs sm:text-sm font-bold tracking-widest mb-2">CROP NEEDED</div><div className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold break-all text-black">{calculateDigital.cropPixelsNeeded}</div><div className="text-black text-xs mt-2">pixels</div></div>
                          <div className="bg-indigo-200 border border-indigo-500 rounded-lg p-2 md:p-4 overflow-hidden"><div className="text-black text-xs sm:text-sm font-bold tracking-widest mb-2">UTILIZATION</div><div className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold break-all text-black">{calculateDigital.coverage}%</div></div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mt-2 md:mt-4">
                          <div className="bg-gray-100 border border-black border-opacity-15 rounded-lg p-2 md:p-4 overflow-hidden"><div className="text-black text-xs sm:text-sm font-bold tracking-widest mb-2">CROP TOP</div><div className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold break-all text-black">{calculateDigital.desqueezedHeight > calculateDigital.desqueezedCroppedHeight ? Math.round((calculateDigital.desqueezedHeight - calculateDigital.desqueezedCroppedHeight) / 2) : 0}</div><div className="text-black text-xs mt-2">pixels</div></div>
                          <div className="bg-gray-100 border border-black border-opacity-15 rounded-lg p-2 md:p-4 overflow-hidden"><div className="text-black text-xs sm:text-sm font-bold tracking-widest mb-2">CROP BOTTOM</div><div className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold break-all text-black">{calculateDigital.desqueezedHeight > calculateDigital.desqueezedCroppedHeight ? Math.round((calculateDigital.desqueezedHeight - calculateDigital.desqueezedCroppedHeight) / 2) : 0}</div><div className="text-black text-xs mt-2">pixels</div></div>
                          <div className="bg-gray-100 border border-black border-opacity-15 rounded-lg p-2 md:p-4 overflow-hidden"><div className="text-black text-xs sm:text-sm font-bold tracking-widest mb-2">CROP LEFT</div><div className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold break-all text-black">{calculateDigital.croppedPixelWidth < calculateDigital.usedPixelWidth ? Math.round((calculateDigital.usedPixelWidth - calculateDigital.croppedPixelWidth) / 2) : 0}</div><div className="text-black text-xs mt-2">pixels</div></div>
                          <div className="bg-gray-100 border border-black border-opacity-15 rounded-lg p-2 md:p-4 overflow-hidden"><div className="text-black text-xs sm:text-sm font-bold tracking-widest mb-2">CROP RIGHT</div><div className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold break-all text-black">{calculateDigital.croppedPixelWidth < calculateDigital.usedPixelWidth ? Math.round((calculateDigital.usedPixelWidth - calculateDigital.croppedPixelWidth) / 2) : 0}</div><div className="text-black text-xs mt-2">pixels</div></div>
                        </div>
                        {calculateDigital?.netflixCompliance && (
                          <div className="mt-3">
                            {calculateDigital.netflixCompliance.unpublished ? (
                              <div className="flex items-center justify-between gap-2">
                                <div>
                                  <p className="text-black text-opacity-40 text-xs font-bold tracking-widest">CURRENT CAPTURE</p>
                                  <p className="font-mono text-sm font-bold text-black mt-0.5">{calculateDigital.pixelWidth}×{calculateDigital.pixelHeight}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-black text-opacity-40 text-xs font-bold tracking-widest">NETFLIX MIN CAPTURE</p>
                                  <p className="text-sm font-bold text-black text-opacity-40 mt-0.5 italic">unpublished</p>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between gap-2">
                                <div>
                                  <p className="text-black text-opacity-40 text-xs font-bold tracking-widest">CURRENT CAPTURE</p>
                                  <p className="font-mono text-sm font-bold text-black mt-0.5">{calculateDigital.pixelWidth}×{calculateDigital.pixelHeight}</p>
                                </div>
                                <div className={calculateDigital.netflixCompliance.compliant ? "text-2xl font-bold text-green-600 flex-shrink-0" : "text-2xl font-bold text-red-500 flex-shrink-0"}>
                                  {calculateDigital.netflixCompliance.compliant ? "✓" : "✗"}
                                </div>
                                <div className="text-right">
                                  <p className="text-black text-opacity-40 text-xs font-bold tracking-widest">NETFLIX MIN CAPTURE</p>
                                  <p className="font-mono text-sm font-bold text-black mt-0.5">~{calculateDigital.netflixCompliance.minWidth}×{calculateDigital.netflixCompliance.minHeight}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
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
                  <div className="grid grid-cols-3 gap-1 md:gap-2 mb-3 md:mb-6">
                    <div className="bg-white bg-opacity-5 p-2 rounded border border-black border-opacity-10 overflow-hidden"><p className="text-black text-opacity-60 text-xs font-bold mb-1">NEGATIVE</p><p className="text-black font-mono text-xs break-all">{calculateFilm.negativeWidth}×{calculateFilm.negativeHeight}mm</p></div>
                    <div className="bg-white bg-opacity-5 p-2 rounded border border-black border-opacity-10 overflow-hidden"><p className="text-black text-opacity-60 text-xs font-bold mb-1">SQUEEZE</p><p className="text-black font-mono text-xs break-all">{calculateFilm.squeeze}x</p></div>
                    <div className="bg-white bg-opacity-5 p-2 rounded border border-black border-opacity-10 overflow-hidden"><p className="text-black text-opacity-60 text-xs font-bold mb-1">ASPECT</p><p className="text-black font-mono text-xs break-all">{calculateFilm.negativeAspect}:1</p></div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-2 md:gap-4 mb-4 md:mb-6">
                    {/* Negative */}
                    <div className="flex flex-col items-center flex-shrink-0">
                      <p className="text-black text-opacity-60 text-xs font-bold mb-1">Negative</p>
                      <div className="border-2 border-amber-400 bg-gray-300" style={{ width: '48px', height: `${(calculateFilm.negativeHeight / calculateFilm.negativeWidth) * 48}px` }} />
                      <p className="text-black text-opacity-50 text-xs font-mono mt-1 text-center">{calculateFilm.negativeWidth}×{calculateFilm.negativeHeight}</p>
                    </div>
                    {/* Arrow */}
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="h-1 w-6 md:w-8 bg-gradient-to-r from-amber-400 to-emerald-400"></div>
                      <p className="text-emerald-600 font-bold text-xs mt-0.5">{calculateFilm.squeeze}x</p>
                    </div>
                    {/* Unsqueezed + output */}
                    <div className="flex flex-col items-center w-full flex-1 min-w-0">
                      <p className="text-black text-opacity-60 text-xs font-bold mb-1">Unsqueezed Output</p>
                      <div className="border-2 border-blue-600 bg-slate-400 relative w-full" style={{ aspectRatio: `${calculateFilm.unSqueezeAspect} / 1` }}>
                        {calculateFilm.desiredAspect !== calculateFilm.unSqueezeAspect && (<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-green-400 bg-slate-400" style={{ width: calculateFilm.isInsufficient ? '100%' : `${calculateFilm.cropPercentageOfUnsqueezed}%`, height: calculateFilm.isInsufficient ? `${calculateFilm.cropPercentageOfUnsqueezed}%` : '100%' }} />)}
                        {calculateFilm.desiredAspect !== calculateFilm.unSqueezeAspect && !calculateFilm.isInsufficient && (<><div className="absolute top-0 bottom-0 left-0 bg-slate-400" style={{ width: `${((1 - (calculateFilm.cropPercentageOfUnsqueezed / 100)) / 2) * 100}%` }} /><div className="absolute top-0 bottom-0 right-0 bg-slate-400" style={{ width: `${((1 - (calculateFilm.cropPercentageOfUnsqueezed / 100)) / 2) * 100}%` }} /></>)}
                        {calculateFilm.desiredAspect !== calculateFilm.unSqueezeAspect && calculateFilm.isInsufficient && (<><div className="absolute top-0 left-0 right-0 bg-slate-400" style={{ height: `${((1 - (calculateFilm.cropPercentageOfUnsqueezed / 100)) / 2) * 100}%` }} /><div className="absolute bottom-0 left-0 right-0 bg-slate-400" style={{ height: `${((1 - (calculateFilm.cropPercentageOfUnsqueezed / 100)) / 2) * 100}%` }} /></>)}
                      </div>
                      <p className="text-black text-opacity-50 text-xs font-mono mt-1">{calculateFilm.unSqueezeAspect}:1 → {calculateFilm.outputNegativeWidth}×{calculateFilm.outputNegativeHeight}mm</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-black border-opacity-10 mb-3 md:mb-4">
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                      <div className="flex items-center gap-1.5"><div className="w-3 h-3 border-2 border-amber-400 bg-slate-400 flex-shrink-0"></div><span className="text-black text-opacity-60">Squeezed Negative</span></div>
                      <div className="flex items-center gap-1.5"><div className="w-3 h-3 border-2 border-blue-600 bg-slate-400 flex-shrink-0"></div><span className="text-black text-opacity-60">Unsqueezed</span></div>
                      <div className="flex items-center gap-1.5"><div className="w-3 h-3 border-2 border-green-400 bg-slate-400 flex-shrink-0"></div><span className="text-black text-opacity-60">Desired Output</span></div>
                    </div>
                  </div>
                  <div className="mt-3 md:mt-6">
                    <button
                      onClick={() => { if (collapseAll) { openAll(); } else { setShowDataBoxes(v => !v); } }}
                      className="flex items-center gap-2 text-black text-opacity-50 text-xs font-bold tracking-widest mb-2 hover:text-opacity-80 transition-all"
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform ${(!collapseAll && showDataBoxes) ? '' : '-rotate-90'}`} />
                      <span>DATA</span>
                      {(!collapseAll && showDataBoxes) ? null : calculateFilm.isInsufficient ? (
                        <span className="ml-1 px-1.5 py-0.5 rounded text-xs font-bold bg-red-500 text-white tracking-normal">INSUFFICIENT</span>
                      ) : null}
                    </button>
                    {!collapseAll && showDataBoxes && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                    <div className="bg-green-100 border border-green-400 rounded-lg p-2 md:p-4 overflow-hidden"><div className="text-black text-xs sm:text-sm font-bold tracking-widest mb-2">UNSQUEEZED</div><div className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold break-all text-black">{calculateFilm.unSqueezeAspect}:1</div></div>
                    <div className="bg-blue-100 border border-blue-400 rounded-lg p-2 md:p-4 overflow-hidden"><div className="text-black text-xs sm:text-sm font-bold tracking-widest mb-2">DESIRED</div><div className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold break-all text-black">{calculateFilm.desiredAspect}:1</div></div>
                    <div className="bg-emerald-200 border border-emerald-500 rounded-lg p-2 md:p-4 overflow-hidden"><div className="text-black text-xs sm:text-sm font-bold tracking-widest mb-2">CROP NEEDED</div><div className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold break-all text-black">{calculateFilm.isInsufficient ? 'N/A' : (100 - calculateFilm.cropPercentageOfUnsqueezed).toFixed(1) + '%'}</div><div className="text-black text-xs mt-2">{calculateFilm.isInsufficient ? '' : 'of unsqueezed'}</div></div>
                    <div className={`rounded-lg p-2 md:p-4 overflow-hidden ${calculateFilm.isInsufficient ? 'bg-gradient-to-br from-red-500 to-red-700' : 'bg-indigo-200 border border-indigo-500'}`}><div className="text-black text-xs sm:text-sm font-bold tracking-widest mb-2">{calculateFilm.isInsufficient ? 'INSUFFICIENT' : 'IMAGE SIZE'}</div><div className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold break-all text-black">{calculateFilm.isInsufficient ? '✗' : (100 + (100 - calculateFilm.cropPercentageOfUnsqueezed)).toFixed(1) + '%'}</div><div className="text-black text-xs mt-2">{calculateFilm.isInsufficient ? 'needs different parameters' : ''}</div></div>
                  </div>
                    )}
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
          const compColors = [
            { bg: '#e7effe', border: '#a0b8f5' },   // index 0 — pale blue
            { bg: '#e7fcea', border: '#a0f5aa' },   // index 1 — pale green
            { bg: '#fefce7', border: '#f5e6a0' },   // index 2 — pale yellow
          ];
          const compColor = compColors[tabIndex] || compColors[0];
          const compState = comparisonStates[tabIndex] || {};
          if (formatType === 'digital') {
            const compCamera = compState.camera || '';
            const compSensors = compCamera && sensorsByCamera[compCamera] ? sensorsByCamera[compCamera] : {};
            const compLensCircle = compState.lensCircle || '';
            const compFilteredCameras = cameraList.filter(c => { if (c.format !== 'digital') return false; if (compState.bypassLens || compState.bypassCamera) return true; if (!compLensCircle) return true; return c.lensCircles.includes(compLensCircle); }).map(c => { if (c.isCrop && c.isCrop[compLensCircle]) return { ...c, displayName: `${c.name} (crop)` }; if (compLensCircle && c.lensCircles.length > 1 && c.lensCircles[0] !== compLensCircle && !c.isCrop) return { ...c, displayName: `${c.name} (crop)` }; return { ...c, displayName: c.name }; });
            const compCalcResult = (() => { let cCam = compState.camera||'', cSF = compState.sensorFormat||'', cAR = compState.useCustomAnamorphic ? compState.customAnamorphicRatio : (compState.anamorphicRatio||''), cDAR = compState.useCustomAspectRatio ? compState.customOutputAspectRatio : (compState.desiredAspectRatio||''), cCP = compState.useCustomPixels||false, cBypass = compState.bypassCamera||false; if ((!cCam&&!cBypass)||(!cCP&&!cSF)||!cAR||!cDAR) return null; if (compState.verticalSqueeze) { const sq = parseFloat(cAR)||1; cAR = String(1/sq); } return computeDigitalResult(cCam, cSF, cAR, cDAR, cCP, compState.customPixelWidth, compState.customPixelHeight); })();
            return (
              <div key={`comp-d-${tabIndex}`} className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-black text-lg font-bold tracking-wider">CAMERA {tabIndex + 2}</h3>
                  <button onClick={() => { setComparisonTabs(comparisonTabs.filter(t => t !== tabIndex)); const ns=[...comparisonStates]; ns[tabIndex]={}; setComparisonStates(ns); }} className="px-3 py-1 rounded text-sm font-bold transition-all border bg-white text-red-600 border-red-300 hover:bg-red-50">✕ REMOVE</button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-1">
                    <ParametersPanel state={{ lensCircle:compState.lensCircle||'', bypassLens:compState.bypassLens||false, camera:compState.camera||'', bypassCamera:compState.bypassCamera||false, sensorFormat:compState.sensorFormat||'', useCustomPixels:compState.useCustomPixels||false, customPixelWidth:compState.customPixelWidth||'', customPixelHeight:compState.customPixelHeight||'', anamorphicRatio:compState.anamorphicRatio||'', useCustomAnamorphic:compState.useCustomAnamorphic||false, customAnamorphicRatio:compState.customAnamorphicRatio||'', desiredAspectRatio:compState.desiredAspectRatio||'', useCustomAspectRatio:compState.useCustomAspectRatio||false, customOutputAspectRatio:compState.customOutputAspectRatio||'', verticalSqueeze:compState.verticalSqueeze||false, filmAnamorphicRatio:'', useCustomFilmAnamorphic:false, customFilmAnamorphic:'', filmDesiredAspectRatio:'', useCustomFilmAspectRatio:false, customFilmAspectRatio:'' }} setState={(ns) => { const nss=[...comparisonStates]; nss[tabIndex]={...nss[tabIndex]}; if(ns.lensCircle!==undefined)nss[tabIndex].lensCircle=ns.lensCircle; if(ns.bypassLens!==undefined)nss[tabIndex].bypassLens=ns.bypassLens; if(ns.camera!==undefined&&ns.camera!==nss[tabIndex].camera){nss[tabIndex].camera=ns.camera;nss[tabIndex].sensorFormat='';}else if(ns.camera!==undefined){nss[tabIndex].camera=ns.camera;} if(ns.bypassCamera!==undefined)nss[tabIndex].bypassCamera=ns.bypassCamera; if(ns.sensorFormat!==undefined)nss[tabIndex].sensorFormat=ns.sensorFormat; if(ns.useCustomPixels!==undefined)nss[tabIndex].useCustomPixels=ns.useCustomPixels; if(ns.customPixelWidth!==undefined)nss[tabIndex].customPixelWidth=ns.customPixelWidth; if(ns.customPixelHeight!==undefined)nss[tabIndex].customPixelHeight=ns.customPixelHeight; if(ns.anamorphicRatio!==undefined)nss[tabIndex].anamorphicRatio=ns.anamorphicRatio; if(ns.useCustomAnamorphic!==undefined)nss[tabIndex].useCustomAnamorphic=ns.useCustomAnamorphic; if(ns.customAnamorphicRatio!==undefined)nss[tabIndex].customAnamorphicRatio=ns.customAnamorphicRatio; if(ns.desiredAspectRatio!==undefined)nss[tabIndex].desiredAspectRatio=ns.desiredAspectRatio; if(ns.useCustomAspectRatio!==undefined)nss[tabIndex].useCustomAspectRatio=ns.useCustomAspectRatio; if(ns.customOutputAspectRatio!==undefined)nss[tabIndex].customOutputAspectRatio=ns.customOutputAspectRatio; if(ns.verticalSqueeze!==undefined)nss[tabIndex].verticalSqueeze=ns.verticalSqueeze; setComparisonStates(nss); }} isComparison={true} formatType="digital" cameras={compFilteredCameras} sensors={compSensors} accentColor={compColor} collapseAll={collapseAll} onUncollapse={() => openAll()} onDuplicate={() => { const prevIndex = comparisonTabs.indexOf(tabIndex) - 1; const prevState = prevIndex < 0 ? { lensCircle: lensImageCircle, bypassLens: bypassLensCircle, camera: selectedCamera, bypassCamera: bypassCameraSelection, sensorFormat, useCustomPixels, customPixelWidth, customPixelHeight, anamorphicRatio, useCustomAnamorphic, customAnamorphicRatio, desiredAspectRatio, useCustomAspectRatio, customOutputAspectRatio, verticalSqueeze } : comparisonStates[comparisonTabs[prevIndex]] || {}; const nss=[...comparisonStates]; nss[tabIndex]={...prevState, showDataBoxes: comparisonStates[tabIndex]?.showDataBoxes}; setComparisonStates(nss); }} />
                  </div>
                  <div className="lg:col-span-2">
                    {compCalcResult ? (
                      <div className="border rounded-lg p-6" style={{ backgroundColor: compColor.bg, borderColor: compColor.border }}>
                        <h3 className="text-black text-base font-bold mb-3 tracking-wider">DESQUEEZED OUTPUT</h3>
                        <div className="flex justify-center items-center mb-4">
                          {(() => {
                            const ar = compCalcResult.desqueezedAR || 2.0;
                            return (
                              <div style={{ aspectRatio: `${ar} / 1`, maxWidth: '500px', width: '100%' }}>
                                <div className="bg-slate-400 border-2 border-blue-600 relative w-full h-full">
                                  <div className="absolute border-2 border-green-400" style={{ left: `${Math.max(0, Math.min(100, ((compCalcResult.usedPixelWidth - compCalcResult.croppedPixelWidth) / compCalcResult.usedPixelWidth / 2) * 100))}%`, top: `${Math.max(0, Math.min(100, ((compCalcResult.desqueezedHeight - compCalcResult.croppedPixelHeight) / compCalcResult.desqueezedHeight / 2) * 100))}%`, width: `${Math.max(0, Math.min(100, (compCalcResult.croppedPixelWidth / compCalcResult.usedPixelWidth) * 100))}%`, height: `${Math.max(0, Math.min(100, (compCalcResult.croppedPixelHeight / compCalcResult.desqueezedHeight) * 100))}%`, boxSizing: 'border-box' }} />
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                        <div className="pt-4 border-t border-black border-opacity-10">
                          <p className="text-black text-opacity-60 text-xs font-bold mb-2">LEGEND</p>
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="flex items-center gap-2"><div className="w-3 h-3 border-2 border-blue-600 bg-slate-400"></div><span className="text-black text-opacity-60 font-bold">Desqueezed: {compCalcResult.usedPixelWidth}×{compCalcResult.desqueezedHeight}</span></div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 border-2 border-green-400 bg-slate-400"></div><span className="text-black text-opacity-60">Cropped: {compCalcResult.croppedPixelWidth}×{compCalcResult.croppedPixelHeight}</span></div>
                          </div>
                        </div>
                        <div className="mt-3 md:mt-6">
                          <button
                            onClick={() => { if (collapseAll) { openAll(); } else { const nss=[...comparisonStates]; nss[tabIndex]={...nss[tabIndex], showDataBoxes: !(nss[tabIndex].showDataBoxes !== false)}; setComparisonStates(nss); } }}
                            className="flex items-center gap-2 text-black text-opacity-50 text-xs font-bold tracking-widest mb-2 hover:text-opacity-80 transition-all"
                          >
                            <ChevronDown className={`w-4 h-4 transition-transform ${(collapseAll || compState.showDataBoxes === false) ? '-rotate-90' : ''}`} />
                            <span>DATA</span>
                          </button>
                          {!collapseAll && compState.showDataBoxes !== false && (
                            <>
                              <div className="grid grid-cols-2 gap-2 md:gap-4">
                                <div className="bg-green-100 border border-green-400 rounded-lg p-2 md:p-4 overflow-hidden"><div className="text-black text-xs sm:text-sm font-bold tracking-widest mb-2">UNSQUEEZED</div><div className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold break-all text-black">{compCalcResult.naturalAspectRatio}:1</div></div>
                                <div className="bg-blue-100 border border-blue-400 rounded-lg p-2 md:p-4 overflow-hidden"><div className="text-black text-xs sm:text-sm font-bold tracking-widest mb-2">DESIRED</div><div className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold break-all text-black">{compCalcResult.aspectRatio}:1</div></div>
                                <div className={`rounded-lg p-2 md:p-4 lg:p-6 ${parseFloat(compCalcResult.cropPercentage) > 0 ? 'bg-emerald-200 border border-emerald-500' : 'bg-green-100 border border-green-400'}`}><div className="text-black text-xs sm:text-sm font-bold tracking-widest mb-2">CROP NEEDED</div><div className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold break-all text-black">{compCalcResult.cropPixelsNeeded}</div><div className="text-black text-xs mt-2">pixels</div></div>
                                <div className="bg-indigo-200 border border-indigo-500 rounded-lg p-2 md:p-4 overflow-hidden"><div className="text-black text-xs sm:text-sm font-bold tracking-widest mb-2">UTILIZATION</div><div className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold break-all text-black">{compCalcResult.coverage}%</div></div>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mt-2 md:mt-4">
                                <div className="bg-gray-100 border border-black border-opacity-15 rounded-lg p-2 md:p-4 overflow-hidden"><div className="text-black text-xs sm:text-sm font-bold tracking-widest mb-2">CROP TOP</div><div className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold break-all text-black">{compCalcResult.desqueezedHeight > compCalcResult.desqueezedCroppedHeight ? Math.round((compCalcResult.desqueezedHeight - compCalcResult.desqueezedCroppedHeight) / 2) : 0}</div><div className="text-black text-xs mt-2">pixels</div></div>
                                <div className="bg-gray-100 border border-black border-opacity-15 rounded-lg p-2 md:p-4 overflow-hidden"><div className="text-black text-xs sm:text-sm font-bold tracking-widest mb-2">CROP BOTTOM</div><div className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold break-all text-black">{compCalcResult.desqueezedHeight > compCalcResult.desqueezedCroppedHeight ? Math.round((compCalcResult.desqueezedHeight - compCalcResult.desqueezedCroppedHeight) / 2) : 0}</div><div className="text-black text-xs mt-2">pixels</div></div>
                                <div className="bg-gray-100 border border-black border-opacity-15 rounded-lg p-2 md:p-4 overflow-hidden"><div className="text-black text-xs sm:text-sm font-bold tracking-widest mb-2">CROP LEFT</div><div className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold break-all text-black">{compCalcResult.croppedPixelWidth < compCalcResult.usedPixelWidth ? Math.round((compCalcResult.usedPixelWidth - compCalcResult.croppedPixelWidth) / 2) : 0}</div><div className="text-black text-xs mt-2">pixels</div></div>
                                <div className="bg-gray-100 border border-black border-opacity-15 rounded-lg p-2 md:p-4 overflow-hidden"><div className="text-black text-xs sm:text-sm font-bold tracking-widest mb-2">CROP RIGHT</div><div className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold break-all text-black">{compCalcResult.croppedPixelWidth < compCalcResult.usedPixelWidth ? Math.round((compCalcResult.usedPixelWidth - compCalcResult.croppedPixelWidth) / 2) : 0}</div><div className="text-black text-xs mt-2">pixels</div></div>
                              </div>
                              {compCalcResult?.netflixCompliance && (
                                <div className="mt-3">
                                  {compCalcResult.netflixCompliance.unpublished ? (
                                    <div className="flex items-center justify-between gap-2">
                                      <div>
                                        <p className="text-black text-opacity-40 text-xs font-bold tracking-widest">CURRENT CAPTURE</p>
                                        <p className="font-mono text-sm font-bold text-black mt-0.5">{compCalcResult.pixelWidth}×{compCalcResult.pixelHeight}</p>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-black text-opacity-40 text-xs font-bold tracking-widest">NETFLIX MIN CAPTURE</p>
                                        <p className="text-sm font-bold text-black text-opacity-40 mt-0.5 italic">unpublished</p>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-between gap-2">
                                      <div>
                                        <p className="text-black text-opacity-40 text-xs font-bold tracking-widest">CURRENT CAPTURE</p>
                                        <p className="font-mono text-sm font-bold text-black mt-0.5">{compCalcResult.pixelWidth}×{compCalcResult.pixelHeight}</p>
                                      </div>
                                      <div className={compCalcResult.netflixCompliance.compliant ? "text-2xl font-bold text-green-600 flex-shrink-0" : "text-2xl font-bold text-red-500 flex-shrink-0"}>
                                        {compCalcResult.netflixCompliance.compliant ? "✓" : "✗"}
                                      </div>
                                      <div className="text-right">
                                        <p className="text-black text-opacity-40 text-xs font-bold tracking-widest">NETFLIX MIN CAPTURE</p>
                                        <p className="font-mono text-sm font-bold text-black mt-0.5">~{compCalcResult.netflixCompliance.minWidth}×{compCalcResult.netflixCompliance.minHeight}</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                        <div className="flex justify-center gap-3 mt-8"><button onClick={() => generateComparisonShareLink(tabIndex)} className="px-4 py-2 rounded font-semibold transition-all border bg-white text-black border-black border-opacity-20 hover:border-opacity-40 flex items-center justify-center gap-2 text-sm"><span>🔗</span> SHARE</button></div>
                      </div>
                    ) : (
                      <div className="border rounded-lg p-8 text-center" style={{ backgroundColor: compColor.bg, borderColor: compColor.border }}><p className="text-black text-lg opacity-60">Select all parameters to view calculations</p></div>
                    )}
                  </div>
                </div>
              </div>
            );
          } else {
            const compFilmResult = (() => { const cFF=compState.filmFormat||'', cAR=compState.useCustomFilmAnamorphic?compState.customFilmAnamorphic:(compState.filmAnamorphicRatio||''), cDAR=compState.useCustomFilmAspectRatio?compState.customFilmAspectRatio:(compState.filmDesiredAspectRatio||''); if(!cFF||!cAR||!cDAR)return null; const fmt=filmFormats.find(f=>f.id===cFF); if(!fmt)return null; const sq=parseFloat(cAR)||2,da=parseFloat(cDAR)||2.39,nW=fmt.negativeWidth,nH=fmt.negativeHeight,nA=nW/nH,uW=nW*sq,uA=uW/nH; let cp,usW,usH,ins=false; if(uA>=da){usH=nH;usW=da*usH;cp=(usW/uW)*100;}else{ins=true;usW=uW;usH=usW/da;cp=(usH/nH)*100;} return{negativeWidth:nW,negativeHeight:nH,negativeAspect:parseFloat(nA.toFixed(3)),squeeze:sq,unSqueezeAspect:parseFloat(uA.toFixed(3)),desiredAspect:da,outputNegativeWidth:parseFloat((usW/sq).toFixed(2)),outputNegativeHeight:parseFloat(usH.toFixed(2)),cropPercentageOfUnsqueezed:parseFloat(cp.toFixed(1)),isInsufficient:ins}; })();
            return (
              <div key={`comp-f-${tabIndex}`} className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-black text-lg font-bold tracking-wider">CAMERA {tabIndex + 2}</h3>
                  <button onClick={() => { setComparisonTabs(comparisonTabs.filter(t=>t!==tabIndex)); const ns=[...comparisonStates]; ns[tabIndex]={}; setComparisonStates(ns); }} className="px-3 py-1 rounded text-sm font-bold transition-all border bg-white text-red-600 border-red-300 hover:bg-red-50">✕ REMOVE</button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-1">
                    <ParametersPanel state={{ lensCircle:'', bypassLens:false, camera:'', filmFormat:compState.filmFormat||'', bypassCamera:false, sensorFormat:'', useCustomPixels:false, customPixelWidth:'', customPixelHeight:'', anamorphicRatio:'', useCustomAnamorphic:false, customAnamorphicRatio:'', desiredAspectRatio:'', useCustomAspectRatio:false, customOutputAspectRatio:'', filmAnamorphicRatio:compState.filmAnamorphicRatio||'', useCustomFilmAnamorphic:compState.useCustomFilmAnamorphic||false, customFilmAnamorphic:compState.customFilmAnamorphic||'', filmDesiredAspectRatio:compState.filmDesiredAspectRatio||'', useCustomFilmAspectRatio:compState.useCustomFilmAspectRatio||false, customFilmAspectRatio:compState.customFilmAspectRatio||'' }} setState={(ns) => { const nss=[...comparisonStates]; nss[tabIndex]={...nss[tabIndex]}; if(ns.filmFormat!==undefined)nss[tabIndex].filmFormat=ns.filmFormat; if(ns.filmAnamorphicRatio!==undefined)nss[tabIndex].filmAnamorphicRatio=ns.filmAnamorphicRatio; if(ns.useCustomFilmAnamorphic!==undefined)nss[tabIndex].useCustomFilmAnamorphic=ns.useCustomFilmAnamorphic; if(ns.customFilmAnamorphic!==undefined)nss[tabIndex].customFilmAnamorphic=ns.customFilmAnamorphic; if(ns.filmDesiredAspectRatio!==undefined)nss[tabIndex].filmDesiredAspectRatio=ns.filmDesiredAspectRatio; if(ns.useCustomFilmAspectRatio!==undefined)nss[tabIndex].useCustomFilmAspectRatio=ns.useCustomFilmAspectRatio; if(ns.customFilmAspectRatio!==undefined)nss[tabIndex].customFilmAspectRatio=ns.customFilmAspectRatio; setComparisonStates(nss); }} isComparison={true} formatType="film" filmFormats={filmFormats} cameras={[]} sensors={{}} accentColor={compColor} collapseAll={collapseAll} onUncollapse={() => openAll()} onDuplicate={() => { const prevIndex = comparisonTabs.indexOf(tabIndex) - 1; const prevState = prevIndex < 0 ? { filmFormat: selectedFilmFormat, filmAnamorphicRatio, useCustomFilmAnamorphic, customFilmAnamorphic, filmDesiredAspectRatio, useCustomFilmAspectRatio, customFilmAspectRatio } : comparisonStates[comparisonTabs[prevIndex]] || {}; const nss=[...comparisonStates]; nss[tabIndex]={...prevState, showDataBoxes: comparisonStates[tabIndex]?.showDataBoxes}; setComparisonStates(nss); }} />
                  </div>
                  <div className="lg:col-span-2">
                    {compFilmResult ? (
                      <div className="border rounded-lg p-4 md:p-6" style={{ backgroundColor: compColor.bg, borderColor: compColor.border }}>
                        <h4 className="text-black text-base font-bold mb-4 tracking-wider">NEGATIVE VISUALIZATION</h4>
                        <div className="grid grid-cols-3 gap-1 md:gap-2 mb-3 md:mb-6">
                          <div className="bg-white bg-opacity-5 p-2 rounded border border-black border-opacity-10"><p className="text-black text-opacity-60 text-xs font-bold mb-1">NEGATIVE</p><p className="text-black font-mono text-xs">{compFilmResult.negativeWidth}×{compFilmResult.negativeHeight}mm</p></div>
                          <div className="bg-white bg-opacity-5 p-2 rounded border border-black border-opacity-10"><p className="text-black text-opacity-60 text-xs font-bold mb-1">SQUEEZE</p><p className="text-black font-mono text-xs">{compFilmResult.squeeze}x</p></div>
                          <div className="bg-white bg-opacity-5 p-2 rounded border border-black border-opacity-10"><p className="text-black text-opacity-60 text-xs font-bold mb-1">ASPECT</p><p className="text-black font-mono text-xs">{compFilmResult.negativeAspect}:1</p></div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-2 md:gap-4 mb-4 md:mb-6">
                          {/* Negative */}
                          <div className="flex flex-col items-center flex-shrink-0">
                            <p className="text-black text-opacity-60 text-xs font-bold mb-1">Negative</p>
                            <div className="border-2 border-amber-400 bg-gray-300" style={{ width:'48px', height:`${(compFilmResult.negativeHeight/compFilmResult.negativeWidth)*48}px` }} />
                            <p className="text-black text-opacity-50 text-xs font-mono mt-1 text-center">{compFilmResult.negativeWidth}×{compFilmResult.negativeHeight}</p>
                          </div>
                          {/* Arrow */}
                          <div className="flex flex-col items-center flex-shrink-0">
                            <div className="h-1 w-6 md:w-8 bg-gradient-to-r from-amber-400 to-emerald-400"></div>
                            <p className="text-emerald-600 font-bold text-xs mt-0.5">{compFilmResult.squeeze}x</p>
                          </div>
                          {/* Unsqueezed + output */}
                          <div className="flex flex-col items-center w-full flex-1 min-w-0">
                            <p className="text-black text-opacity-60 text-xs font-bold mb-1">Unsqueezed Output</p>
                            <div className="border-2 border-blue-600 bg-slate-400 relative w-full" style={{ aspectRatio:`${compFilmResult.unSqueezeAspect} / 1` }}>
                              {compFilmResult.desiredAspect !== compFilmResult.unSqueezeAspect && (<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-green-400 bg-slate-400" style={{ width:compFilmResult.isInsufficient?'100%':`${compFilmResult.cropPercentageOfUnsqueezed}%`, height:compFilmResult.isInsufficient?`${compFilmResult.cropPercentageOfUnsqueezed}%`:'100%' }} />)}
                              {compFilmResult.desiredAspect !== compFilmResult.unSqueezeAspect && !compFilmResult.isInsufficient && (<><div className="absolute top-0 bottom-0 left-0 bg-slate-400" style={{ width:`${((1-(compFilmResult.cropPercentageOfUnsqueezed/100))/2)*100}%` }} /><div className="absolute top-0 bottom-0 right-0 bg-slate-400" style={{ width:`${((1-(compFilmResult.cropPercentageOfUnsqueezed/100))/2)*100}%` }} /></>)}
                              {compFilmResult.desiredAspect !== compFilmResult.unSqueezeAspect && compFilmResult.isInsufficient && (<><div className="absolute top-0 left-0 right-0 bg-slate-400" style={{ height:`${((1-(compFilmResult.cropPercentageOfUnsqueezed/100))/2)*100}%` }} /><div className="absolute bottom-0 left-0 right-0 bg-slate-400" style={{ height:`${((1-(compFilmResult.cropPercentageOfUnsqueezed/100))/2)*100}%` }} /></>)}
                            </div>
                            <p className="text-black text-opacity-50 text-xs font-mono mt-1">{compFilmResult.unSqueezeAspect}:1 → {compFilmResult.outputNegativeWidth}×{compFilmResult.outputNegativeHeight}mm</p>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-black border-opacity-10 mb-3 md:mb-4">
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                            <div className="flex items-center gap-1.5"><div className="w-3 h-3 border-2 border-amber-400 bg-slate-400 flex-shrink-0"></div><span className="text-black text-opacity-60">Squeezed Negative</span></div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 border-2 border-blue-600 bg-slate-400 flex-shrink-0"></div><span className="text-black text-opacity-60">Unsqueezed</span></div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 border-2 border-green-400 bg-slate-400 flex-shrink-0"></div><span className="text-black text-opacity-60">Desired Output</span></div>
                          </div>
                        </div>
                        <div className="mt-3 md:mt-4">
                          <button
                            onClick={() => { if (collapseAll) { openAll(); } else { const nss=[...comparisonStates]; nss[tabIndex]={...nss[tabIndex], showDataBoxes: !(nss[tabIndex].showDataBoxes !== false)}; setComparisonStates(nss); } }}
                            className="flex items-center gap-2 text-black text-opacity-50 text-xs font-bold tracking-widest mb-2 hover:text-opacity-80 transition-all"
                          >
                            <ChevronDown className={`w-4 h-4 transition-transform ${(collapseAll || compState.showDataBoxes === false) ? '-rotate-90' : ''}`} />
                            <span>DATA</span>
                            {(collapseAll || compState.showDataBoxes === false) && compFilmResult.isInsufficient ? (
                              <span className="ml-1 px-1.5 py-0.5 rounded text-xs font-bold bg-red-500 text-white tracking-normal">INSUFFICIENT</span>
                            ) : null}
                          </button>
                          {!collapseAll && compState.showDataBoxes !== false && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                          <div className="bg-green-100 border border-green-400 rounded-lg p-2 md:p-3 overflow-hidden"><div className="text-black text-xs font-bold tracking-widest mb-1">UNSQUEEZED</div><div className="text-sm sm:text-base md:text-lg font-bold text-black">{compFilmResult.unSqueezeAspect}:1</div></div>
                          <div className="bg-blue-100 border border-blue-400 rounded-lg p-2 md:p-3 overflow-hidden"><div className="text-black text-xs font-bold tracking-widest mb-1">DESIRED</div><div className="text-sm sm:text-base md:text-lg font-bold text-black">{compFilmResult.desiredAspect}:1</div></div>
                          <div className="bg-emerald-200 border border-emerald-500 rounded-lg p-2 md:p-3 overflow-hidden"><div className="text-black text-xs font-bold tracking-widest mb-1">CROP</div><div className="text-sm sm:text-base md:text-lg font-bold text-black">{compFilmResult.isInsufficient ? 'N/A' : (100-compFilmResult.cropPercentageOfUnsqueezed).toFixed(1)+'%'}</div></div>
                          <div className={`rounded-lg p-2 md:p-3 ${compFilmResult.isInsufficient ? 'bg-gradient-to-br from-red-500 to-red-700' : 'bg-indigo-200 border border-indigo-500'}`}><div className="text-black text-xs font-bold tracking-widest mb-1">{compFilmResult.isInsufficient?'INSUFFICIENT':'COVERAGE'}</div><div className="text-sm sm:text-base md:text-lg font-bold text-black">{compFilmResult.isInsufficient?'✗':compFilmResult.cropPercentageOfUnsqueezed+'%'}</div></div>
                        </div>
                          )}
                        </div>
                        <div className="flex justify-center gap-3 mt-4"><button onClick={() => generateComparisonShareLink(tabIndex)} className="px-3 py-1.5 rounded font-semibold transition-all border bg-white text-black border-black border-opacity-20 hover:border-opacity-40 flex items-center justify-center gap-2 text-xs"><span>🔗</span> SHARE</button></div>
                      </div>
                    ) : (
                      <div className="border rounded-lg p-8 text-center" style={{ backgroundColor: compColor.bg, borderColor: compColor.border }}><p className="text-black text-lg opacity-60">Select all parameters to view calculations</p></div>
                    )}
                  </div>
                </div>
              </div>
            );
          }
        })}

        {/* ADD CAMERA button */}
        {comparisonTabs.length < 3 && (calculateDigital || calculateFilm) && (
          <div className="flex justify-center mt-8 mb-4">
            <button onClick={() => { const ni=comparisonTabs.length; setComparisonTabs([...comparisonTabs,ni]); const ns=[...comparisonStates]; ns[ni]={}; setComparisonStates(ns); }} className="px-6 py-2 rounded font-bold transition-all border bg-white text-black border-black border-opacity-20 hover:border-opacity-40 flex items-center justify-center gap-2 text-sm">+ ADD CAMERA</button>
          </div>
        )}

        {/* SUGGESTION BOX */}
        <div className="mt-16 mb-10">
          <div className="bg-gray-200 border border-black border-opacity-10 rounded-lg p-4 md:p-5">
            <h4 className="text-black text-xs font-bold tracking-wider mb-3 opacity-40">FEEDBACK</h4>
            {feedbackSent ? (
              <p className="text-black text-sm py-2 text-center opacity-50">Thank you for your feedback!</p>
            ) : (
              <div className="flex flex-col md:flex-row gap-2 md:items-start">
                <textarea
                  rows={2}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Have a suggestion, found a bug, or want a feature? Let me know..."
                  className="flex-1 bg-white border border-black border-opacity-15 text-black px-3 py-2 rounded focus:outline-none focus:border-slate-400 transition-all text-sm resize-none opacity-60 focus:opacity-100"
                />
                <input
                  type="email"
                  value={feedbackEmail}
                  onChange={(e) => setFeedbackEmail(e.target.value)}
                  placeholder="Email (optional)"
                  className="md:w-48 bg-white border border-black border-opacity-15 text-black px-3 py-2 rounded focus:outline-none focus:border-slate-400 transition-all text-sm opacity-60 focus:opacity-100"
                />
                <button
                  onClick={async () => {
                    if (!feedbackText.trim()) return;
                    try {
                      await fetch('https://formspree.io/f/xvzwreyg', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          email: feedbackEmail || 'not provided',
                          message: feedbackText,
                        }),
                      });
                      setFeedbackSent(true);
                    } catch (e) {
                      alert('Could not send feedback. Please try again.');
                    }
                  }}
                  className="px-4 py-2 rounded text-sm font-bold transition-all border bg-white text-black border-black border-opacity-20 hover:border-opacity-40 whitespace-nowrap opacity-60 hover:opacity-100"
                >
                  SEND
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
