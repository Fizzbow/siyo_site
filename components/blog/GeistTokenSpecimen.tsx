"use client";

import React from "react";

import CodeBlock from "./CodeBlock";

type ColorToken = {
  name: string;
  light: string;
  dark: string;
};

type TypeToken = {
  name: string;
  family: string;
  size: string;
  weight: string;
  lineHeight: string;
  letterSpacing?: string;
};

type ComponentToken = {
  name: string;
  values: Array<[string, string]>;
};

const semanticColors: ColorToken[] = [
  { name: "primary", light: "#171717", dark: "#ededed" },
  { name: "secondary", light: "#4d4d4d", dark: "#a0a0a0" },
  { name: "tertiary", light: "#006bff", dark: "#006efe" },
  { name: "neutral", light: "#f2f2f2", dark: "#1a1a1a" },
  { name: "background-100", light: "#ffffff", dark: "#000000" },
  { name: "background-200", light: "#fafafa", dark: "#000000" },
];

const grayColors: ColorToken[] = [
  { name: "gray-100", light: "#f2f2f2", dark: "#1a1a1a" },
  { name: "gray-200", light: "#ebebeb", dark: "#1f1f1f" },
  { name: "gray-300", light: "#e6e6e6", dark: "#292929" },
  { name: "gray-400", light: "#eaeaea", dark: "#2e2e2e" },
  { name: "gray-500", light: "#c9c9c9", dark: "#454545" },
  { name: "gray-600", light: "#a8a8a8", dark: "#878787" },
  { name: "gray-700", light: "#8f8f8f", dark: "#8f8f8f" },
  { name: "gray-800", light: "#7d7d7d", dark: "#7d7d7d" },
  { name: "gray-900", light: "#4d4d4d", dark: "#a0a0a0" },
  { name: "gray-1000", light: "#171717", dark: "#ededed" },
  { name: "gray-alpha-100", light: "#0000000d", dark: "#ffffff12" },
  { name: "gray-alpha-200", light: "#00000015", dark: "#ffffff17" },
  { name: "gray-alpha-300", light: "#0000001a", dark: "#ffffff21" },
  { name: "gray-alpha-400", light: "#00000014", dark: "#ffffff24" },
  { name: "gray-alpha-500", light: "#00000036", dark: "#ffffff3d" },
  { name: "gray-alpha-600", light: "#0000003d", dark: "#ffffff82" },
  { name: "gray-alpha-700", light: "#00000070", dark: "#ffffff8a" },
  { name: "gray-alpha-800", light: "#00000082", dark: "#ffffff78" },
  { name: "gray-alpha-900", light: "#000000b3", dark: "#ffffff9c" },
  { name: "gray-alpha-1000", light: "#000000e8", dark: "#ffffffeb" },
];

const accentColors: ColorToken[] = [
  { name: "blue-100", light: "#f0f7ff", dark: "#06193a" },
  { name: "blue-200", light: "#e9f4ff", dark: "#022248" },
  { name: "blue-300", light: "#dfefff", dark: "#002f62" },
  { name: "blue-400", light: "#cae7ff", dark: "#003674" },
  { name: "blue-500", light: "#94ccff", dark: "#00418b" },
  { name: "blue-600", light: "#48aeff", dark: "#0090ff" },
  { name: "blue-700", light: "#006bff", dark: "#006efe" },
  { name: "blue-800", light: "#0059ec", dark: "#005be7" },
  { name: "blue-900", light: "#005ff2", dark: "#47a8ff" },
  { name: "blue-1000", light: "#002359", dark: "#eaf6ff" },
  { name: "red-100", light: "#ffeeef", dark: "#330a11" },
  { name: "red-200", light: "#ffe8ea", dark: "#440d13" },
  { name: "red-300", light: "#ffe3e4", dark: "#5d0e17" },
  { name: "red-400", light: "#ffd7d6", dark: "#6f101b" },
  { name: "red-500", light: "#ffb1b3", dark: "#88151f" },
  { name: "red-600", light: "#ff676d", dark: "#f32e40" },
  { name: "red-700", light: "#fc0035", dark: "#f13242" },
  { name: "red-800", light: "#ea001d", dark: "#e2162a" },
  { name: "red-900", light: "#d8001b", dark: "#ff565f" },
  { name: "red-1000", light: "#47000c", dark: "#ffe9ed" },
  { name: "amber-100", light: "#fff6de", dark: "#2a1700" },
  { name: "amber-200", light: "#fff4cf", dark: "#361900" },
  { name: "amber-300", light: "#fff1c1", dark: "#502800" },
  { name: "amber-400", light: "#ffdc73", dark: "#5b3000" },
  { name: "amber-500", light: "#ffc543", dark: "#703e00" },
  { name: "amber-600", light: "#ffa600", dark: "#ed9a00" },
  { name: "amber-700", light: "#ffae00", dark: "#ffae00" },
  { name: "amber-800", light: "#ff9300", dark: "#ff9300" },
  { name: "amber-900", light: "#aa4d00", dark: "#ff9300" },
  { name: "amber-1000", light: "#561900", dark: "#fff3d5" },
  { name: "green-100", light: "#ecfdec", dark: "#002608" },
  { name: "green-200", light: "#e5fce7", dark: "#00320b" },
  { name: "green-300", light: "#d3fad1", dark: "#003a0e" },
  { name: "green-400", light: "#b9f5bc", dark: "#004615" },
  { name: "green-500", light: "#82eb8d", dark: "#006717" },
  { name: "green-600", light: "#4ce15e", dark: "#00952d" },
  { name: "green-700", light: "#28a948", dark: "#00ac3a" },
  { name: "green-800", light: "#279141", dark: "#009432" },
  { name: "green-900", light: "#107d32", dark: "#00ca50" },
  { name: "green-1000", light: "#003a00", dark: "#d8ffe4" },
  { name: "teal-100", light: "#defffb", dark: "#00231b" },
  { name: "teal-200", light: "#ddfef6", dark: "#002b22" },
  { name: "teal-300", light: "#ccf9f1", dark: "#003d34" },
  { name: "teal-400", light: "#b1f7ec", dark: "#004035" },
  { name: "teal-500", light: "#52f0db", dark: "#006354" },
  { name: "teal-600", light: "#00e3c4", dark: "#009e86" },
  { name: "teal-700", light: "#00ac96", dark: "#00aa95" },
  { name: "teal-800", light: "#00927f", dark: "#00927f" },
  { name: "teal-900", light: "#007f70", dark: "#00cfb7" },
  { name: "teal-1000", light: "#003f34", dark: "#cbfff5" },
  { name: "purple-100", light: "#faf0ff", dark: "#290c33" },
  { name: "purple-200", light: "#f9f0ff", dark: "#341142" },
  { name: "purple-300", light: "#f6e8ff", dark: "#47185e" },
  { name: "purple-400", light: "#f2d9ff", dark: "#541a76" },
  { name: "purple-500", light: "#dfa7ff", dark: "#642290" },
  { name: "purple-600", light: "#c979ff", dark: "#9440d5" },
  { name: "purple-700", light: "#a000f8", dark: "#9440d5" },
  { name: "purple-800", light: "#8500d1", dark: "#7d2bba" },
  { name: "purple-900", light: "#7d00cc", dark: "#c472fb" },
  { name: "purple-1000", light: "#2f004e", dark: "#fbecff" },
  { name: "pink-100", light: "#ffe8f6", dark: "#310d1e" },
  { name: "pink-200", light: "#ffe8f3", dark: "#420c25" },
  { name: "pink-300", light: "#ffdfeb", dark: "#571032" },
  { name: "pink-400", light: "#ffd3e1", dark: "#5d0c34" },
  { name: "pink-500", light: "#fdb3cc", dark: "#76063f" },
  { name: "pink-600", light: "#f97ea7", dark: "#ba0056" },
  { name: "pink-700", light: "#f22782", dark: "#f12b82" },
  { name: "pink-800", light: "#e4106e", dark: "#e7006d" },
  { name: "pink-900", light: "#c41562", dark: "#ff4d8d" },
  { name: "pink-1000", light: "#460523", dark: "#ffe9f4" },
];

const p3Colors: ColorToken[] = [
  { name: "blue-100-p3", light: "oklch(97.32% 0.0141 251.56)", dark: "oklch(22.17% 0.069 259.89)" },
  { name: "blue-200-p3", light: "oklch(96.29% 0.0195 250.59)", dark: "oklch(25.45% 0.0811 255.8)" },
  { name: "blue-300-p3", light: "oklch(94.58% 0.0293 249.84870859673202)", dark: "oklch(30.86% 0.1022 255.21)" },
  { name: "blue-400-p3", light: "oklch(91.58% 0.0473 245.11621922481282)", dark: "oklch(34.1% 0.121 254.74)" },
  { name: "blue-500-p3", light: "oklch(82.75% 0.0979 248.48)", dark: "oklch(38.5% 0.1403 254.4)" },
  { name: "blue-600-p3", light: "oklch(73.08% 0.1583 248.133320980386)", dark: "oklch(64.94% 0.1982 251.8131841760864)" },
  { name: "blue-700-p3", light: "oklch(57.61% 0.2508 258.23)", dark: "oklch(57.61% 0.2321 258.23)" },
  { name: "blue-800-p3", light: "oklch(51.51% 0.2399 257.85)", dark: "oklch(51.51% 0.2307 257.85)" },
  { name: "blue-900-p3", light: "oklch(53.18% 0.2399 256.9900584162342)", dark: "oklch(71.7% 0.1648 250.79360374054167)" },
  { name: "blue-1000-p3", light: "oklch(26.67% 0.1099 254.34)", dark: "oklch(96.75% 0.0179 242.4234217368056)" },
  { name: "red-100-p3", light: "oklch(96.5% 0.0223 13.09)", dark: "oklch(22.1% 0.0657 15.11)" },
  { name: "red-200-p3", light: "oklch(95.41% 0.0299 14.252646656611997)", dark: "oklch(25.93% 0.0834 19.02)" },
  { name: "red-300-p3", light: "oklch(94.33% 0.0369 15.011509923860523)", dark: "oklch(31.47% 0.1105 20.96)" },
  { name: "red-400-p3", light: "oklch(91.51% 0.0471 19.8)", dark: "oklch(35.27% 0.1273 21.23)" },
  { name: "red-500-p3", light: "oklch(84.47% 0.1018 17.71)", dark: "oklch(40.68% 0.1479 23.16)" },
  { name: "red-600-p3", light: "oklch(71.12% 0.1881 21.22)", dark: "oklch(62.56% 0.2277 23.03)" },
  { name: "red-700-p3", light: "oklch(62.56% 0.2524 23.03)", dark: "oklch(62.56% 0.2234 23.03)" },
  { name: "red-800-p3", light: "oklch(58.19% 0.2482 25.15)", dark: "oklch(58.01% 0.227 25.12)" },
  { name: "red-900-p3", light: "oklch(54.99% 0.232 25.29)", dark: "oklch(69.96% 0.2136 22.03)" },
  { name: "red-1000-p3", light: "oklch(24.8% 0.1041 18.86)", dark: "oklch(95.6% 0.0293 6.61)" },
  { name: "amber-100-p3", light: "oklch(97.48% 0.0331 85.79)", dark: "oklch(22.46% 0.0538 76.04)" },
  { name: "amber-200-p3", light: "oklch(96.81% 0.0495 90.24227879900472)", dark: "oklch(24.95% 0.0642 64.78)" },
  { name: "amber-300-p3", light: "oklch(95.93% 0.0636 90.52)", dark: "oklch(32.34% 0.0837 63.83)" },
  { name: "amber-400-p3", light: "oklch(91.02% 0.1322 88.25)", dark: "oklch(35.53% 0.0903 66.29707162673735)" },
  { name: "amber-500-p3", light: "oklch(86.55% 0.1583 79.63)", dark: "oklch(41.55% 0.1044 67.98)" },
  { name: "amber-600-p3", light: "oklch(80.25% 0.1953 73.59)", dark: "oklch(75.04% 0.1737 74.49)" },
  { name: "amber-700-p3", light: "oklch(81.87% 0.1969 76.46)", dark: "oklch(81.87% 0.1969 76.46)" },
  { name: "amber-800-p3", light: "oklch(77.21% 0.1991 64.28)", dark: "oklch(77.21% 0.1991 64.28)" },
  { name: "amber-900-p3", light: "oklch(52.79% 0.1496 54.65)", dark: "oklch(77.21% 0.1991 64.28)" },
  { name: "amber-1000-p3", light: "oklch(30.83% 0.099 45.48)", dark: "oklch(96.7% 0.0418 84.59)" },
  { name: "green-100-p3", light: "oklch(97.59% 0.0289 145.42)", dark: "oklch(23.09% 0.0716 149.68)" },
  { name: "green-200-p3", light: "oklch(96.92% 0.037 147.15)", dark: "oklch(27.12% 0.0895 150.09)" },
  { name: "green-300-p3", light: "oklch(94.6% 0.0674 144.23)", dark: "oklch(29.84% 0.096 149.25)" },
  { name: "green-400-p3", light: "oklch(91.49% 0.0976 146.24)", dark: "oklch(34.39% 0.1039 147.78)" },
  { name: "green-500-p3", light: "oklch(85.45% 0.1627 146.3)", dark: "oklch(44.19% 0.1484 147.2)" },
  { name: "green-600-p3", light: "oklch(80.25% 0.214 145.18)", dark: "oklch(58.11% 0.1815 146.55)" },
  { name: "green-700-p3", light: "oklch(64.58% 0.1746 147.27)", dark: "oklch(64.58% 0.199 147.27)" },
  { name: "green-800-p3", light: "oklch(57.81% 0.1507 147.5)", dark: "oklch(57.81% 0.1776 147.5)" },
  { name: "green-900-p3", light: "oklch(51.75% 0.1453 147.65)", dark: "oklch(73.1% 0.2158 148.29)" },
  { name: "green-1000-p3", light: "oklch(29.15% 0.1197 147.38)", dark: "oklch(96.76% 0.056 154.18)" },
  { name: "teal-100-p3", light: "oklch(97.72% 0.0359 186.7)", dark: "oklch(22.1% 0.0544 178.74)" },
  { name: "teal-200-p3", light: "oklch(97.06% 0.0347 180.66)", dark: "oklch(25.06% 0.062 178.76)" },
  { name: "teal-300-p3", light: "oklch(94.92% 0.0478 182.07)", dark: "oklch(31.5% 0.0767 180.99)" },
  { name: "teal-400-p3", light: "oklch(92.76% 0.0718 183.78)", dark: "oklch(32.43% 0.0763 180.13)" },
  { name: "teal-500-p3", light: "oklch(86.88% 0.1344 182.42)", dark: "oklch(43.35% 0.1055 180.97)" },
  { name: "teal-600-p3", light: "oklch(81.5% 0.161 178.96)", dark: "oklch(60.71% 0.1485 180.24)" },
  { name: "teal-700-p3", light: "oklch(64.92% 0.1572 181.95)", dark: "oklch(64.92% 0.1403 181.95)" },
  { name: "teal-800-p3", light: "oklch(57.53% 0.1392 181.66)", dark: "oklch(57.53% 0.1392 181.66)" },
  { name: "teal-900-p3", light: "oklch(52.08% 0.1251 182.93)", dark: "oklch(74.56% 0.1765 182.8)" },
  { name: "teal-1000-p3", light: "oklch(32.11% 0.0788 179.82)", dark: "oklch(96.46% 0.056 180.29)" },
  { name: "purple-100-p3", light: "oklch(96.65% 0.0244 312.1890119359961)", dark: "oklch(22.34% 0.0779 316.87)" },
  { name: "purple-200-p3", light: "oklch(96.73% 0.0228 309.8)", dark: "oklch(25.91% 0.0921 314.41)" },
  { name: "purple-300-p3", light: "oklch(94.85% 0.0364 310.15)", dark: "oklch(31.98% 0.1219 312.41)" },
  { name: "purple-400-p3", light: "oklch(91.77% 0.0614 312.82)", dark: "oklch(35.93% 0.1504 309.78)" },
  { name: "purple-500-p3", light: "oklch(81.26% 0.1409 310.8)", dark: "oklch(40.99% 0.1721 307.92)" },
  { name: "purple-600-p3", light: "oklch(72.07% 0.2083 308.19)", dark: "oklch(55.5% 0.2191 306.12)" },
  { name: "purple-700-p3", light: "oklch(55.5% 0.3008 306.12)", dark: "oklch(55.5% 0.2186 306.12)" },
  { name: "purple-800-p3", light: "oklch(48.58% 0.2638 305.73)", dark: "oklch(48.58% 0.2102 305.73)" },
  { name: "purple-900-p3", light: "oklch(47.18% 0.2579 304)", dark: "oklch(69.87% 0.2037 309.51)" },
  { name: "purple-1000-p3", light: "oklch(23.96% 0.13 305.66)", dark: "oklch(96.1% 0.0304 316.46)" },
  { name: "pink-100-p3", light: "oklch(95.69% 0.0359 344.6218910697224)", dark: "oklch(22.67% 0.0628 354.73)" },
  { name: "pink-200-p3", light: "oklch(95.71% 0.0321 353.14)", dark: "oklch(26.2% 0.0859 356.68)" },
  { name: "pink-300-p3", light: "oklch(93.83% 0.0451 356.29)", dark: "oklch(31.15% 0.1067 355.93)" },
  { name: "pink-400-p3", light: "oklch(91.12% 0.0573 358.82)", dark: "oklch(32.13% 0.1174 356.71)" },
  { name: "pink-500-p3", light: "oklch(84.28% 0.0915 356.99)", dark: "oklch(37.01% 0.1453 358.39)" },
  { name: "pink-600-p3", light: "oklch(74.33% 0.1547 0.24)", dark: "oklch(50.33% 0.2089 4.33)" },
  { name: "pink-700-p3", light: "oklch(63.52% 0.238 1.01)", dark: "oklch(63.52% 0.2346 1.01)" },
  { name: "pink-800-p3", light: "oklch(59.51% 0.2339 4.21)", dark: "oklch(59.51% 0.2429 4.21)" },
  { name: "pink-900-p3", light: "oklch(53.5% 0.2058 2.84)", dark: "oklch(69.36% 0.2223 3.91)" },
  { name: "pink-1000-p3", light: "oklch(26% 0.0977 359)", dark: "oklch(95.74% 0.0326 350.08)" },
];

const typographyTokens: TypeToken[] = [
  { name: "heading-72", family: "Geist Sans", size: "72px", weight: "600", lineHeight: "72px", letterSpacing: "-4.32px" },
  { name: "heading-64", family: "Geist Sans", size: "64px", weight: "600", lineHeight: "64px", letterSpacing: "-3.84px" },
  { name: "heading-56", family: "Geist Sans", size: "56px", weight: "600", lineHeight: "56px", letterSpacing: "-3.36px" },
  { name: "heading-48", family: "Geist Sans", size: "48px", weight: "600", lineHeight: "56px", letterSpacing: "-2.88px" },
  { name: "heading-40", family: "Geist Sans", size: "40px", weight: "600", lineHeight: "48px", letterSpacing: "-2.4px" },
  { name: "heading-32", family: "Geist Sans", size: "32px", weight: "600", lineHeight: "40px", letterSpacing: "-1.28px" },
  { name: "heading-24", family: "Geist Sans", size: "24px", weight: "600", lineHeight: "32px", letterSpacing: "-0.96px" },
  { name: "heading-20", family: "Geist Sans", size: "20px", weight: "600", lineHeight: "26px", letterSpacing: "-0.4px" },
  { name: "heading-16", family: "Geist Sans", size: "16px", weight: "600", lineHeight: "24px", letterSpacing: "-0.32px" },
  { name: "heading-14", family: "Geist Sans", size: "14px", weight: "600", lineHeight: "20px", letterSpacing: "-0.28px" },
  { name: "button-16", family: "Geist Sans", size: "16px", weight: "500", lineHeight: "20px" },
  { name: "button-14", family: "Geist Sans", size: "14px", weight: "500", lineHeight: "20px" },
  { name: "button-12", family: "Geist Sans", size: "12px", weight: "500", lineHeight: "16px" },
  { name: "label-20", family: "Geist Sans", size: "20px", weight: "400", lineHeight: "32px" },
  { name: "label-18", family: "Geist Sans", size: "18px", weight: "400", lineHeight: "20px" },
  { name: "label-16", family: "Geist Sans", size: "16px", weight: "400", lineHeight: "20px" },
  { name: "label-14", family: "Geist Sans", size: "14px", weight: "400", lineHeight: "20px" },
  { name: "label-14-mono", family: "Geist Mono", size: "14px", weight: "400", lineHeight: "20px" },
  { name: "label-13", family: "Geist Sans", size: "13px", weight: "400", lineHeight: "16px" },
  { name: "label-13-mono", family: "Geist Mono", size: "13px", weight: "400", lineHeight: "20px" },
  { name: "label-12", family: "Geist Sans", size: "12px", weight: "400", lineHeight: "16px" },
  { name: "label-12-mono", family: "Geist Mono", size: "12px", weight: "400", lineHeight: "16px" },
  { name: "copy-24", family: "Geist Sans", size: "24px", weight: "400", lineHeight: "36px" },
  { name: "copy-20", family: "Geist Sans", size: "20px", weight: "400", lineHeight: "36px" },
  { name: "copy-18", family: "Geist Sans", size: "18px", weight: "400", lineHeight: "28px" },
  { name: "copy-16", family: "Geist Sans", size: "16px", weight: "400", lineHeight: "24px" },
  { name: "copy-14", family: "Geist Sans", size: "14px", weight: "400", lineHeight: "20px" },
  { name: "copy-14-mono", family: "Geist Mono", size: "14px", weight: "400", lineHeight: "20px" },
  { name: "copy-13", family: "Geist Sans", size: "13px", weight: "400", lineHeight: "18px" },
  { name: "copy-13-mono", family: "Geist Mono", size: "13px", weight: "400", lineHeight: "18px" },
];

const spacingTokens = [
  ["1", "4px"],
  ["2", "8px"],
  ["3", "12px"],
  ["4", "16px"],
  ["6", "24px"],
  ["8", "32px"],
  ["10", "40px"],
  ["16", "64px"],
  ["24", "96px"],
  ["base", "4px"],
];

const roundedTokens = [
  ["sm", "6px"],
  ["md", "12px"],
  ["lg", "16px"],
  ["full", "9999px"],
];

const componentTokens: ComponentToken[] = [
  {
    name: "button-primary",
    values: [["backgroundColor", "{colors.primary}"], ["textColor", "{colors.background-100}"], ["typography", "{typography.button-14}"], ["rounded", "{rounded.sm}"], ["padding", "0 10px"], ["height", "40px"]],
  },
  {
    name: "button-secondary",
    values: [["backgroundColor", "{colors.background-100}"], ["textColor", "{colors.primary}"], ["typography", "{typography.button-14}"], ["rounded", "{rounded.sm}"], ["padding", "0 10px"], ["height", "40px"]],
  },
  {
    name: "button-tertiary",
    values: [["textColor", "{colors.primary}"], ["typography", "{typography.button-14}"], ["rounded", "{rounded.sm}"], ["padding", "0 10px"], ["height", "40px"]],
  },
  {
    name: "button-error",
    values: [["backgroundColor", "{colors.red-800}"], ["textColor", "#ffffff"], ["typography", "{typography.button-14}"], ["rounded", "{rounded.sm}"], ["padding", "0 10px"], ["height", "40px"]],
  },
  {
    name: "button-small",
    values: [["typography", "{typography.button-14}"], ["rounded", "{rounded.sm}"], ["padding", "0 6px"], ["height", "32px"]],
  },
  {
    name: "button-large",
    values: [["typography", "{typography.button-16}"], ["rounded", "{rounded.sm}"], ["padding", "0 14px"], ["height", "48px"]],
  },
  {
    name: "input",
    values: [["backgroundColor", "{colors.background-100}"], ["textColor", "{colors.primary}"], ["typography", "{typography.label-14}"], ["rounded", "{rounded.sm}"], ["padding", "0 12px"], ["height", "40px"]],
  },
  {
    name: "input-small",
    values: [["typography", "{typography.label-14}"], ["rounded", "{rounded.sm}"], ["padding", "0 12px"], ["height", "32px"]],
  },
  {
    name: "input-large",
    values: [["typography", "{typography.label-16}"], ["rounded", "{rounded.sm}"], ["padding", "0 12px"], ["height", "48px"]],
  },
];

const elevationTokens: ColorToken[] = [
  {
    name: "raised-card-shadow",
    light: "0 2px 2px rgba(0, 0, 0, 0.04)",
    dark: "0 1px 2px rgba(0, 0, 0, 0.16)",
  },
  {
    name: "popover-menu-shadow",
    light: "0 1px 1px rgba(0, 0, 0, 0.02), 0 4px 8px -4px rgba(0, 0, 0, 0.04), 0 16px 24px -8px rgba(0, 0, 0, 0.06)",
    dark: "0 1px 1px rgba(0, 0, 0, 0.02), 0 4px 8px -4px rgba(0, 0, 0, 0.04), 0 16px 24px -8px rgba(0, 0, 0, 0.06)",
  },
  {
    name: "modal-dialog-shadow",
    light: "0 1px 1px rgba(0, 0, 0, 0.02), 0 8px 16px -4px rgba(0, 0, 0, 0.04), 0 24px 32px -8px rgba(0, 0, 0, 0.06)",
    dark: "0 1px 1px rgba(0, 0, 0, 0.02), 0 8px 16px -4px rgba(0, 0, 0, 0.04), 0 24px 32px -8px rgba(0, 0, 0, 0.06)",
  },
  {
    name: "focus-ring",
    light: "0 0 0 2px #ffffff, 0 0 0 4px #006bff",
    dark: "0 0 0 2px #000000, 0 0 0 4px #47a8ff",
  },
];

function typographySample(token: TypeToken) {
  if (token.name.startsWith("button")) {
    return "Deploy Project";
  }
  if (token.name.includes("mono")) {
    return "build_123";
  }
  if (token.name.startsWith("label")) {
    return "Preview Deployment";
  }
  if (token.name.startsWith("copy")) {
    return "Readable interface copy";
  }
  return "Geist Heading";
}

function ComponentPreview({ name }: { name: string }) {
  const isInput = name.startsWith("input");
  const buttonText = {
    "button-primary": "Deploy Project",
    "button-secondary": "Preview",
    "button-tertiary": "Cancel",
    "button-error": "Delete Project",
    "button-small": "Add",
    "button-large": "Deploy Project",
  }[name];
  const inputText = name === "input-small" ? "project" : "my-project.vercel.app";

  if (isInput) {
    return (
      <input
        aria-label={name}
        className={`token-catalog__component-preview token-catalog__component-preview--${name}`}
        readOnly
        value={inputText}
      />
    );
  }

  return (
    <button
      className={`token-catalog__component-preview token-catalog__component-preview--${name}`}
      type="button"
    >
      {buttonText}
    </button>
  );
}

function cssPropertyName(tokenKey: string) {
  const propertyMap: Record<string, string> = {
    backgroundColor: "background-color",
    textColor: "color",
    typography: "font",
    rounded: "border-radius",
    padding: "padding",
    height: "height",
  };

  return propertyMap[tokenKey] ?? tokenKey.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

function cssTokenValue(value: string) {
  const tokenMatch = value.match(/^\{(.+)\}$/);

  if (!tokenMatch) {
    return value;
  }

  return `var(--${tokenMatch[1].replace(/\./g, "-")})`;
}

function componentCss(token: ComponentToken) {
  const declarations = token.values
    .map(([key, value]) => `  ${cssPropertyName(key)}: ${cssTokenValue(value)};`)
    .join("\n");

  return `.${token.name} {\n${declarations}\n}`;
}

function ElevationPreview({ token }: { token: ColorToken }) {
  return (
    <span
      className={`token-catalog__elevation-preview token-catalog__elevation-preview--${token.name}`}
      style={
        {
          "--elevation-light": token.light,
          "--elevation-dark": token.dark,
        } as React.CSSProperties
      }
    >
      <span className="token-catalog__elevation-surface" />
    </span>
  );
}

function currentThemeValue(token: ColorToken) {
  return (
    <>
      <span className="token-value-light">{token.light}</span>
      <span className="token-value-dark">{token.dark}</span>
    </>
  );
}

function tokenStep(token: ColorToken, title: string) {
  return token.name.replace(`${title}-`, "").replace("-p3", "");
}

function ColorScale({
  title,
  tokens,
  titleSlot,
}: {
  title: string;
  tokens: ColorToken[];
  titleSlot?: React.ReactNode;
}) {
  return (
    <div
      className={
        title === "semantic"
          ? "token-catalog__scale token-catalog__scale--semantic"
          : "token-catalog__scale"
      }
    >
      {titleSlot ?? <strong className="token-catalog__scale-title">{title}</strong>}
      <div className="token-catalog__scale-items">
        {tokens.map((token) => (
          <div
            className="token-catalog__scale-item"
            key={token.name}
            style={
              {
                "--token-light": token.light,
                "--token-dark": token.dark,
              } as React.CSSProperties
            }
          >
            <small title={tokenStep(token, title)}>{tokenStep(token, title)}</small>
            <span className="token-catalog__scale-swatch" />
            <code>{currentThemeValue(token)}</code>
          </div>
        ))}
      </div>
    </div>
  );
}

function ColorScales({
  groups,
}: {
  groups: Array<{ title: string; tokens: ColorToken[] }>;
}) {
  return (
    <div className="token-catalog__scales">
      {groups.map((group) => (
        <ColorScale
          key={group.title}
          title={group.title}
          tokens={group.tokens}
        />
      ))}
    </div>
  );
}

function SelectableColorScale({
  groups,
}: {
  groups: Array<{ title: string; tokens: ColorToken[] }>;
}) {
  const [selectedTitle, setSelectedTitle] = React.useState(groups[0]?.title ?? "");
  const selectedGroup =
    groups.find((group) => group.title === selectedTitle) ?? groups[0];

  if (!selectedGroup) {
    return null;
  }

  return (
    <ColorScale
      title={selectedGroup.title}
      tokens={selectedGroup.tokens}
      titleSlot={
        <label className="token-catalog__select-label" aria-label="color">
          <select
            className="token-catalog__select"
            value={selectedGroup.title}
            onChange={(event) => setSelectedTitle(event.target.value)}
          >
            {groups.map((group) => (
              <option key={group.title} value={group.title}>
                {group.title}
              </option>
            ))}
          </select>
        </label>
      }
    />
  );
}

const grayGroups = [
  { title: "gray", tokens: grayColors.filter((token) => !token.name.includes("alpha")) },
  { title: "gray-alpha", tokens: grayColors.filter((token) => token.name.includes("alpha")) },
];

const accentFamilies = ["blue", "red", "amber", "green", "teal", "purple", "pink"];

const accentGroups = accentFamilies.map((family) => ({
  title: family,
  tokens: accentColors.filter((token) => token.name.startsWith(`${family}-`)),
}));

const p3Groups = accentFamilies.map((family) => ({
  title: family,
  tokens: p3Colors.filter((token) => token.name.startsWith(`${family}-`)),
}));

function TokenShell({ children }: { children: React.ReactNode }) {
  return <div className="token-catalog">{children}</div>;
}

export function GeistTokenBlock({ type }: { type?: string }) {
  switch (type) {
    case "semantic":
      return (
        <TokenShell>
          <ColorScale title="semantic" tokens={semanticColors} />
        </TokenShell>
      );
    case "gray":
      return (
        <TokenShell>
          <ColorScales groups={grayGroups} />
        </TokenShell>
      );
    case "accent":
      return (
        <TokenShell>
          <SelectableColorScale groups={accentGroups} />
        </TokenShell>
      );
    case "p3":
      return (
        <TokenShell>
          <SelectableColorScale groups={p3Groups} />
        </TokenShell>
      );
    case "typography":
      return (
        <TokenShell>
          <div className="token-catalog__type-grid">
            {typographyTokens.map((token) => (
              <div
                className="token-catalog__type-card"
                key={token.name}
                style={
                  {
                    "--type-family": token.family.includes("Mono")
                      ? "var(--font-mono)"
                      : "var(--font-sans)",
                    "--type-size": token.size,
                    "--type-weight": token.weight,
                    "--type-line": token.lineHeight,
                    "--type-tracking": token.letterSpacing ?? "0",
                  } as React.CSSProperties
                }
              >
                <span className="token-catalog__type-sample">
                  {typographySample(token)}
                </span>
                <strong>{token.name}</strong>
                <div>
                  <code>{token.family}</code>
                  <code>{token.size}</code>
                  <code>{token.weight}</code>
                  <code>{token.lineHeight}</code>
                  <code>{token.letterSpacing ?? "0"}</code>
                </div>
              </div>
            ))}
          </div>
        </TokenShell>
      );
    case "spacing":
      return (
        <TokenShell>
          <div
            className="token-catalog__measure-grid"
            style={{ "--measure-count": spacingTokens.length } as React.CSSProperties}
          >
            {spacingTokens.map(([name, value]) => (
              <div
                className="token-catalog__measure-card"
                key={name}
                style={{ "--measure-size": value } as React.CSSProperties}
              >
                <span className="token-catalog__space-sample" />
                <strong>{name}</strong>
                <code>{value}</code>
              </div>
            ))}
          </div>
        </TokenShell>
      );
    case "rounded":
      return (
        <TokenShell>
          <div
            className="token-catalog__measure-grid"
            style={{ "--measure-count": roundedTokens.length } as React.CSSProperties}
          >
            {roundedTokens.map(([name, value]) => (
              <div
                className="token-catalog__measure-card"
                key={name}
                style={{ "--radius-size": value } as React.CSSProperties}
              >
                <span className="token-catalog__radius-sample" />
                <strong>{name}</strong>
                <code>{value}</code>
              </div>
            ))}
          </div>
        </TokenShell>
      );
    case "components":
      return (
        <TokenShell>
          <div className="token-catalog__component-grid">
            {componentTokens.map((token) => (
              <div className="token-catalog__component" key={token.name}>
                <strong>{token.name}</strong>
                <ComponentPreview name={token.name} />
                <CodeBlock
                  className="language-css"
                  containerClassName="token-catalog__component-code"
                  frameClassName="token-catalog__component-code-frame"
                  bodyClassName="token-catalog__component-code-body"
                >
                  {componentCss(token)}
                </CodeBlock>
              </div>
            ))}
          </div>
        </TokenShell>
      );
    case "elevation":
      return (
        <TokenShell>
          <div className="token-catalog__rows">
            {elevationTokens.map((token) => (
              <div className="token-catalog__row token-catalog__row--elevation" key={token.name}>
                <strong>{token.name}</strong>
                <ElevationPreview token={token} />
                <code>{currentThemeValue(token)}</code>
              </div>
            ))}
          </div>
        </TokenShell>
      );
    case "motion":
      return (
        <TokenShell>
          <div className="token-catalog__rows">
            <div className="token-catalog__row token-catalog__row--wide">
              <strong>easing</strong>
              <code>cubic-bezier(0.175, 0.885, 0.32, 1.1)</code>
            </div>
            <div className="token-catalog__row token-catalog__row--wide">
              <strong>timing</strong>
              <code>0ms / 150ms / 200ms / 300ms</code>
            </div>
          </div>
        </TokenShell>
      );
    case "voice":
      return (
        <TokenShell>
          <div className="token-catalog__rows">
            <div className="token-catalog__row token-catalog__row--wide">
              <strong>button copy</strong>
              <code>Deploy Project</code>
            </div>
            <div className="token-catalog__row token-catalog__row--wide">
              <strong>toast copy</strong>
              <code>Project deleted</code>
            </div>
          </div>
        </TokenShell>
      );
    case "rules":
      return (
        <TokenShell>
          <div className="token-catalog__rows">
            <div className="token-catalog__row token-catalog__row--wide">
              <strong>contrast</strong>
              <code>WCAG AA contrast (4.5:1 for body text)</code>
            </div>
            <div className="token-catalog__row token-catalog__row--wide">
              <strong>focus</strong>
              <code>:focus-visible</code>
            </div>
          </div>
        </TokenShell>
      );
    default:
      return null;
  }
}

export function GeistTokenSpecimen() {
  const blocks = [
    "meta",
    "semantic",
    "gray",
    "accent",
    "p3",
    "typography",
    "spacing",
    "rounded",
    "components",
    "elevation",
    "motion",
    "voice",
    "rules",
  ];

  return (
    <>
      {blocks.map((block) => (
        <GeistTokenBlock key={block} type={block} />
      ))}
    </>
  );
}
