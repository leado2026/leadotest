import fs from "node:fs/promises";
import path from "node:path";
import { getLanguageByCode, localizedPath, normalizeBasePath, siteLanguages } from "../src/config/languages.mjs";
import { renderLanguageSwitcher } from "../src/components/LanguageSwitcher.mjs";

const root = process.cwd();
const siteUrl = "https://www.leadoauto.com";
const phone = "+86 18682355968";
const whatsapp = "8618682355968";
const email = "sales@leadoauto.com";

const nav = [
  ["Products", "/products/"],
  ["Applications", "/applications/"],
  ["Resources", "/resources/"],
  ["About", "/about/"],
  ["Contact", "/contact/"],
];

const localizedHomeContent = {
  en: {
    title: "Truck LED Lighting Manufacturer for Wholesale Importers | LEADO",
    description: "LEADO is a truck LED lighting manufacturer from Shenzhen, China, serving US wholesale importers with marker lights, glass watermelon lights, tail lights and cab marker lights.",
    heroTitle: "Truck LED Lighting Manufacturer for Wholesale Importers",
    heroText: "LEADO helps importers, dealers and distributors build profitable truck lighting lines with marker lights, glass watermelon lights, tail lights, cab marker lights and dual color auxiliary products.",
  },
  es: {
    title: "Fabricante de Luces LED para Camiones al por Mayor | LEADO",
    description: "LEADO fabrica luces LED para camiones en Shenzhen, China, para importadores mayoristas de marker lights, glass watermelon lights, tail lights y cab marker lights.",
    heroTitle: "Fabricante de Luces LED para Camiones para Importadores Mayoristas",
    heroText: "LEADO ayuda a importadores, distribuidores y dealers a crear líneas rentables de iluminación para camiones con marker lights, glass watermelon lights, tail lights, cab marker lights y productos dual color.",
  },
  pt: {
    title: "Fabricante de Luz LED para Caminhão no Atacado | LEADO",
    description: "A LEADO fabrica luz LED para caminhões em Shenzhen, China, atendendo importadores atacadistas com marker lights, glass watermelon lights, tail lights e cab marker lights.",
    heroTitle: "Fabricante de Luz LED para Caminhão para Importadores Atacadistas",
    heroText: "A LEADO ajuda importadores, distribuidores e revendedores a montar linhas lucrativas de iluminação para caminhões com marker lights, glass watermelon lights, tail lights, cab marker lights e produtos dual color.",
  },
  fr: {
    title: "Fabricant de Feux LED pour Camions en Gros | LEADO",
    description: "LEADO est un fabricant de feux LED pour camions basé à Shenzhen, en Chine, pour importateurs grossistes de marker lights, glass watermelon lights, tail lights et cab marker lights.",
    heroTitle: "Fabricant de Feux LED pour Camions pour Importateurs Grossistes",
    heroText: "LEADO aide les importateurs, revendeurs et distributeurs à développer des gammes rentables d'éclairage pour camions avec marker lights, glass watermelon lights, tail lights, cab marker lights et produits dual color.",
  },
  ru: {
    title: "Производитель LED Фар для Грузовиков Оптом | LEADO",
    description: "LEADO производит LED освещение для грузовиков в Шэньчжэне, Китай, для оптовых импортеров: marker lights, glass watermelon lights, tail lights и cab marker lights.",
    heroTitle: "Производитель LED Освещения для Грузовиков для Оптовых Импортеров",
    heroText: "LEADO помогает импортерам, дилерам и дистрибьюторам развивать прибыльные линейки освещения для грузовиков: marker lights, glass watermelon lights, tail lights, cab marker lights и dual color products.",
  },
  de: {
    title: "Hersteller für LED LKW Beleuchtung im Großhandel | LEADO",
    description: "LEADO ist ein Hersteller für LED LKW Beleuchtung aus Shenzhen, China, für Großhandelsimporteure von marker lights, glass watermelon lights, tail lights und cab marker lights.",
    heroTitle: "Hersteller für LED LKW Beleuchtung für Großhandelsimporteure",
    heroText: "LEADO unterstützt Importeure, Händler und Distributoren beim Aufbau profitabler Truck-Lighting-Sortimente mit marker lights, glass watermelon lights, tail lights, cab marker lights und dual color Produkten.",
  },
};

const categories = [
  {
    slug: "truck-marker-lights",
    title: "Truck Marker Lights",
    keyword: "truck marker light manufacturer",
    description: "Wholesale 3/4 inch, 2 inch, oval, strobe, smoked lens and chrome bezel LED marker lights for semi trucks, trailers and custom builds.",
    image: "/assets/images/dual-color-banner.jpg",
    tags: ["3/4 inch", "2 inch round", "Oval", "Strobe", "Smoked lens", "Chrome bezel"],
    products: ["m500101", "m500112", "m500110", "m500136", "m500144"],
  },
  {
    slug: "glass-watermelon-lights",
    title: "Glass Watermelon Lights",
    keyword: "glass watermelon light manufacturer",
    description: "G2 and G3 glass watermelon lights with 1156, 1157 and H11 LED bulb options, built for strong beam pattern and premium truck decoration.",
    image: "/assets/images/dual-color-banner.jpg",
    tags: ["G2 glass lens", "G3 high power", "1156 / 1157", "Dual color", "Auxiliary color"],
    products: ["m500205", "m500206", "m500208", "m500207"],
  },
  {
    slug: "truck-tail-lights",
    title: "Truck Tail Lights",
    keyword: "truck tail light supplier",
    description: "4 inch round, 6 inch oval, dual color, strobe and trailer tail lights for wholesale truck lighting programs.",
    image: "/assets/images/hero-trucks.jpg",
    tags: ["4 inch round", "6 inch oval", "Dual color", "Strobe", "PL3 plug", "18AWG wiring"],
    products: ["m500301", "m500304", "m500315", "m500322", "m500341", "m500354"],
  },
  {
    slug: "truck-cab-marker-lights",
    title: "Truck Cab Marker Lights",
    keyword: "truck cab marker lights wholesale",
    description: "Cab marker light sets for Ford, GMC, SUV, trailer and heavy truck applications, including smoked, clear and amber lens options.",
    image: "/assets/images/technology-banner.jpg",
    tags: ["IP67", "5 lamp set", "Ford / GMC", "Smoked lens", "Clear lens", "Wire harness"],
    products: ["m500402", "m500403", "m500406", "m500408", "m500410"],
  },
  {
    slug: "dual-color-truck-lights",
    title: "Dual Color Truck Lights",
    keyword: "dual color truck lights wholesale",
    description: "Two colors in one light for road-to-show truck lighting: marker to auxiliary, turn to auxiliary and custom red, amber, white, blue, green or purple options.",
    image: "/assets/images/hero-trucks.jpg",
    tags: ["Two colors in one light", "Auxiliary", "Road to show", "Marker to auxiliary", "Turn to auxiliary"],
    products: ["m500201", "m500203", "m500206", "m500304", "m500338"],
  },
];

const products = [
  {
    id: "m500101",
    slug: "3-4-inch-led-marker-light-m500101",
    title: "3/4 Inch LED Marker Light",
    model: "M500101",
    category: "truck-marker-lights",
    summary: "Compact 3/4 inch marker light for wholesale programs, available in white, amber, blue, red, green and purple.",
    image: "/assets/images/dual-color-banner.jpg",
    specs: {
      "Input voltage": "12V, 24V",
      "Light color": "White, Amber, Blue, Red, Green, Purple",
      "LED power": "5W",
      "LED type": "3 pcs SMD2835",
      "Material": "ABS + Rubber",
      "Wiring": "2 wires",
      "Wholesale note": "Promotion price item for volume orders",
    },
  },
  {
    id: "m500112",
    slug: "2-inch-round-marker-light-m500112",
    title: "2 Inch Round Marker Light",
    model: "M500112",
    category: "truck-marker-lights",
    summary: "Round 2 inch LED marker light for trailer and semi truck side marker applications.",
    image: "/assets/images/dual-color-banner.jpg",
    specs: {
      "Input voltage": "12V, 24V",
      "Light color": "White, Amber, Red",
      "Power": "6W",
      "LED type": "7 pcs SMD2835",
      "Material": "ABS + Rubber",
      "Diameter": "2 inch without rubber ring",
    },
  },
  {
    id: "m500110",
    slug: "mini-oval-marker-light-m500110",
    title: "Mini Oval Marker Light",
    model: "M500110",
    category: "truck-marker-lights",
    summary: "Mini oval marker light with chrome bezel for clean truck body installation.",
    image: "/assets/images/technology-banner.jpg",
    specs: {
      "Input voltage": "12V",
      "Light color": "White, Amber, Red, Blue, Green",
      "Power": "5W",
      "LED type": "3 pcs SMD2835",
      "Material": "ABS + PC",
      "Size": "3 inch x 2 inch x 0.7 inch",
      "Feature": "Chrome bezel",
    },
  },
  {
    id: "m500136",
    slug: "strobe-3-4-inch-marker-light-m500136",
    title: "Strobe 3/4 Inch Marker Light",
    model: "M500136",
    category: "truck-marker-lights",
    summary: "3/4 inch strobe marker light with stainless steel chrome bezel and multi-color options.",
    image: "/assets/images/dual-color-banner.jpg",
    specs: {
      "Input voltage": "12V, 24V",
      "Light color": "White, Amber, Blue, Red, Green, Purple",
      "Power": "5W",
      "LED type": "3 pcs SMD2835",
      "Material": "ABS + Rubber",
      "Wiring": "3 wires",
      "Feature": "Strobe function with chrome bezel",
    },
  },
  {
    id: "m500144",
    slug: "kenworth-t660-led-side-marker-m500144",
    title: "Kenworth T660 LED Side Marker",
    model: "M500144",
    category: "truck-marker-lights",
    summary: "Direct replacement amber side marker for Kenworth T660 with original plug design.",
    image: "/assets/images/technology-banner.jpg",
    specs: {
      "Input voltage": "12V",
      "Light color": "Amber",
      "Lens color": "Clear, Smoked",
      "Power": "5W",
      "LED type": "36 pcs diodes",
      "Feature": "Original plug, direct replacement",
    },
  },
  {
    id: "m500205",
    slug: "g2-glass-watermelon-light-m500205",
    title: "G2 Glass Watermelon Light",
    model: "M500205",
    category: "glass-watermelon-lights",
    summary: "G2 glass lens watermelon light with 1156 LED bulb, stainless steel body and strong amber/red beam pattern.",
    image: "/assets/images/dual-color-banner.jpg",
    specs: {
      "Input voltage": "12-24VDC",
      "Light color": "Amber, Red, White",
      "Lens color": "Amber, Red, Clear",
      "Real power": "20W",
      "LED type": "1156 LED bulb",
      "Material": "Glass + Stainless Steel",
      "Size": "3.4 inch x 2.7 inch",
    },
  },
  {
    id: "m500206",
    slug: "g2-dual-color-glass-watermelon-light-m500206",
    title: "G2 Dual Color Glass Watermelon Light",
    model: "M500206",
    category: "glass-watermelon-lights",
    summary: "Dual color G2 glass watermelon light with clear lens for auxiliary color truck lighting builds.",
    image: "/assets/images/hero-trucks.jpg",
    specs: {
      "Input voltage": "12-24VDC",
      "Light color": "Amber/White, Amber/Blue, Amber/Red, Amber/Green, Amber/Purple, Red/White, Red/Blue, Red/Green, Red/Purple",
      "Real power": "20W",
      "LED type": "1157 LED bulb",
      "Material": "Glass + Stainless Steel",
      "Wiring": "2 wires",
      "Feature": "Dual color design, perfect beam pattern",
    },
  },
  {
    id: "m500208",
    slug: "g3-high-power-glass-watermelon-light-m500208",
    title: "G3 High Power Glass Watermelon Light",
    model: "M500208",
    category: "glass-watermelon-lights",
    summary: "High power G3 glass watermelon light with H11 LED bulb for stronger beam output.",
    image: "/assets/images/dual-color-banner.jpg",
    specs: {
      "Input voltage": "12-24VDC",
      "Light color": "Amber, Red, White",
      "Lens color": "Amber, Red, Clear",
      "Real power": "25W",
      "LED type": "H11 LED bulb",
      "Material": "Glass + Stainless Steel",
      "Feature": "Higher brightness and strong beam pattern",
    },
  },
  {
    id: "m500207",
    slug: "dual-color-1157-light-bulb-m500207",
    title: "Dual Color 1157 Light Bulb",
    model: "M500207",
    category: "glass-watermelon-lights",
    summary: "Special 1157 dual color LED bulb designed for glass watermelon light upgrades.",
    image: "/assets/images/technology-banner.jpg",
    specs: {
      "Input voltage": "12V-24V",
      "Base": "1157",
      "Power": "20W",
      "LED type": "15 pcs SMD3030",
      "Material": "Aluminum body",
      "Feature": "Perfect beam pattern for glass watermelon light",
    },
  },
  {
    id: "m500301",
    slug: "4-inch-round-tail-light-m500301",
    title: "4 Inch Round Tail Light",
    model: "M500301",
    category: "truck-tail-lights",
    summary: "Wide-voltage 4 inch round tail light with rubber mounting and 18AWG wiring.",
    image: "/assets/images/hero-trucks.jpg",
    specs: {
      "Input voltage": "12V, 24V, 10-30V",
      "Light color": "White, Amber, Blue, Red, Green",
      "Power": "10W",
      "LED type": "16 pcs SMD",
      "Material": "Plastic and rubber",
      "Wiring": "3 wires, quality 18AWG",
    },
  },
  {
    id: "m500304",
    slug: "4-inch-round-dual-color-tail-light-m500304",
    title: "4 Inch Round Dual Color Tail Light",
    model: "M500304",
    category: "truck-tail-lights",
    summary: "Dual color 4 inch round tail light for stop, turn, tail and auxiliary lighting programs.",
    image: "/assets/images/dual-color-banner.jpg",
    specs: {
      "Input voltage": "12V, 24V, 10-30V",
      "Light color": "White/Red, Amber/Red",
      "Power": "10W",
      "LED type": "16 pcs SMD",
      "Material": "Plastic and rubber",
      "Wiring": "4 wires",
      "Feature": "Dual color, 18AWG wiring",
    },
  },
  {
    id: "m500315",
    slug: "6-inch-oval-tail-light-m500315",
    title: "6 Inch Oval Tail Light",
    model: "M500315",
    category: "truck-tail-lights",
    summary: "6 inch oval tail light with arrow shape design for trailer and truck applications.",
    image: "/assets/images/hero-trucks.jpg",
    specs: {
      "Input voltage": "12V",
      "Light color": "White, Red, Yellow",
      "Power": "10W",
      "LED type": "25 pcs diodes",
      "Material": "Plastic and rubber",
      "Wiring": "3 wires",
    },
  },
  {
    id: "m500322",
    slug: "6-inch-oval-strobe-tail-light-m500322",
    title: "6 Inch Oval Strobe Tail Light",
    model: "M500322",
    category: "truck-tail-lights",
    summary: "6 inch oval tail light with high/low brightness and strobe function.",
    image: "/assets/images/technology-banner.jpg",
    specs: {
      "Input voltage": "12V-24V",
      "Light color": "White, Red, Yellow",
      "Power": "10W",
      "LED type": "10 pcs SMD",
      "Wiring": "4 wires",
      "Feature": "High/low brightness and strobe function",
    },
  },
  {
    id: "m500341",
    slug: "fender-marker-light-m500341",
    title: "Fender Marker Light",
    model: "M500341",
    category: "truck-tail-lights",
    summary: "Red and amber double face fender marker light with waterproof design.",
    image: "/assets/images/hero-trucks.jpg",
    specs: {
      "Input voltage": "12V",
      "Light color": "Red and Amber",
      "Power": "10W",
      "LED type": "14 pcs diodes",
      "Material": "ABS + PC",
      "Feature": "Double face design, waterproof",
    },
  },
  {
    id: "m500354",
    slug: "trailer-light-boxes-housing-kit-m500354",
    title: "Trailer Light Boxes Housing Kit",
    model: "M500354",
    category: "truck-tail-lights",
    summary: "Trailer light box housing kit with mounting bracket and PL3 / 2-prong plug support.",
    image: "/assets/images/technology-banner.jpg",
    specs: {
      "Input voltage": "12V",
      "Light color": "White, Red, Yellow",
      "Power": "15W",
      "Material": "Plastic and rubber",
      "Plug": "Standard PL3 plug, 2 prong plug",
      "Unit": "Pair",
    },
  },
  {
    id: "m500402",
    slug: "ip67-cab-marker-light-set-m500402",
    title: "IP67 Cab Marker Light Set",
    model: "M500402",
    category: "truck-cab-marker-lights",
    summary: "5-lamp amber cab marker light set with wire harness for Ford, GMC, SUV and trailer applications.",
    image: "/assets/images/technology-banner.jpg",
    specs: {
      "Input voltage": "12V DC",
      "Light color": "Amber",
      "Lens color": "Amber",
      "Power": "25W",
      "LED type": "12 pcs SMD",
      "Waterproof": "IP67",
      "Application": "Ford 150, GMC, SUV, Trailer",
    },
  },
  {
    id: "m500403",
    slug: "smoked-cab-marker-light-set-m500403",
    title: "Smoked Cab Marker Light Set",
    model: "M500403",
    category: "truck-cab-marker-lights",
    summary: "Cab marker light set with smoked or clear lens options and IP67 waterproof rating.",
    image: "/assets/images/hero-trucks.jpg",
    specs: {
      "Input voltage": "12V DC",
      "Light color": "Amber",
      "Lens color": "Smoked, Clear",
      "Power": "25W",
      "LED type": "12 pcs SMD",
      "Waterproof": "IP67",
      "Set": "5 lamps and wire harness",
    },
  },
  {
    id: "m500406",
    slug: "classic-led-cab-marker-light-m500406",
    title: "Classic LED Cab Marker Light",
    model: "M500406",
    category: "truck-cab-marker-lights",
    summary: "Classic LED cab marker light available in white, amber, red and blue lens colors.",
    image: "/assets/images/technology-banner.jpg",
    specs: {
      "Input voltage": "12V, 24V",
      "Light color": "White, Amber, Red, Blue",
      "Power": "15W",
      "LED type": "24 pcs SMD",
      "Material": "ABS + PC",
      "Feature": "Classic item, good quality",
    },
  },
  {
    id: "m500408",
    slug: "clear-smoked-cab-marker-light-m500408",
    title: "Clear / Smoked Cab Marker Light",
    model: "M500408",
    category: "truck-cab-marker-lights",
    summary: "Large cab marker light with clear or smoked lens options for heavy truck applications.",
    image: "/assets/images/technology-banner.jpg",
    specs: {
      "Input voltage": "12V, 24V",
      "Light color": "White, Amber",
      "Lens color": "Clear, Smoked",
      "Power": "15W",
      "LED type": "17 pcs SMD",
      "Material": "ABS + PC",
      "Size": "10.63 inch x 3.88 inch x 2.6 inch",
    },
  },
  {
    id: "m500410",
    slug: "large-f2-chip-cab-marker-light-m500410",
    title: "Large F2 Chip Cab Marker Light",
    model: "M500410",
    category: "truck-cab-marker-lights",
    summary: "Large cab marker light with 17 pcs F2 chips and clear or smoked lens options.",
    image: "/assets/images/hero-trucks.jpg",
    specs: {
      "Input voltage": "12V, 24V",
      "Light color": "White, Amber",
      "Lens color": "Clear, Smoked",
      "Power": "15W",
      "LED type": "17 pcs F2 chip",
      "Size": "15.5 inch x 3.5 inch x 3.5 inch",
    },
  },
];

const resources = [
  {
    slug: "how-to-choose-truck-marker-lights-for-the-us-market",
    title: "How to Choose Truck Marker Lights for the US Market",
    description: "A wholesale buyer guide covering voltage, lens color, wiring, size, waterproofing and product mix for US truck marker light programs.",
    sections: [
      ["Start with the buyer channel", "For importers and distributors, the first question is not only brightness. The product mix must cover 3/4 inch, 2 inch round, oval, smoked lens, chrome bezel and strobe versions so customers can source common replacement and custom styles together."],
      ["Check voltage and wiring", "LEADO marker lights include 12V, 24V and 10-30V designs. For wholesale programs, wide voltage versions reduce SKU risk across trucks, trailers and aftermarket installations."],
      ["Plan color options carefully", "White, amber and red cover standard demand. Blue, green and purple are useful for show truck and auxiliary lighting customers, especially when paired with dual color designs."],
      ["Ask for inspection and packing details", "Each LEADO product is 100% inspected before shipment. For importers, stable wiring, lens consistency and carton protection matter as much as the lamp body itself."],
    ],
  },
  {
    slug: "glass-vs-plastic-watermelon-lights",
    title: "Glass vs Plastic Watermelon Lights",
    description: "Compare glass watermelon lights and plastic vintage-look marker lights for truck lighting import programs.",
    sections: [
      ["Glass lens positioning", "Glass watermelon lights are premium truck lighting products. LEADO G2 and G3 models use glass lens and stainless steel body for a stronger vintage look and beam pattern."],
      ["Plastic vintage-look options", "Plastic or poly lens versions can serve customers who want the watermelon style at a more competitive price point. They are useful for broad catalog coverage."],
      ["Dual color demand", "Dual color versions support amber/white, amber/blue, red/white and other auxiliary combinations. This matches the road-to-show trend in the US truck market."],
      ["Wholesale recommendation", "Use glass models as the hero products and plastic vintage-look lamps as supporting SKUs. This keeps the catalog attractive without making the program too narrow."],
    ],
  },
  {
    slug: "12v-vs-24v-truck-lights",
    title: "12V vs 24V Truck Lights",
    description: "A practical guide for importers comparing 12V, 24V and 10-30V LED truck lights.",
    sections: [
      ["Why voltage matters", "Truck lighting buyers often serve multiple vehicle types. A product that only supports one voltage may work for one channel but create inventory friction in another."],
      ["Where wide voltage helps", "10-30V products simplify sourcing for distributors because the same SKU can cover more truck and trailer applications."],
      ["What to confirm before ordering", "Confirm light color, wiring, plug type, lens color, installation hole distance and waterproof requirements before production. These details reduce return risk."],
      ["LEADO sourcing note", "LEADO offers 12V, 24V and 10-30V options across marker lights and tail lights, with OEM/ODM support for importer programs."],
    ],
  },
  {
    slug: "dot-compliant-truck-lights-what-importers-should-check",
    title: "DOT Compliant Truck Lights: What Importers Should Check",
    description: "A procurement checklist for truck lighting importers evaluating DOT-related product claims and market fit.",
    sections: [
      ["Do not rely on a slogan only", "Importers should ask suppliers to confirm the intended application, lens color, function and packaging statement for each lamp. Compliance claims must match how the product is actually used."],
      ["Match color to function", "Red, amber and white are the core colors for stop, turn, tail, marker and clearance lighting. Auxiliary colors should be positioned for show or off-road style applications where appropriate."],
      ["Keep technical records", "Maintain model number, voltage, material, wiring and inspection records. These details help your sales team answer buyer questions quickly."],
      ["Supplier communication", "LEADO can support product selection, OEM/ODM requests and catalog-based quote preparation for importers building a truck lighting line."],
    ],
  },
];

const landingPages = [
  {
    slug: "truck-marker-lights-wholesale",
    title: "Truck Marker Lights Wholesale",
    keyword: "truck marker lights wholesale",
    category: "truck-marker-lights",
    promise: "Build a fast-moving marker light program with 3/4 inch, 2 inch, oval, smoked lens, chrome bezel and strobe options.",
  },
  {
    slug: "glass-watermelon-lights-wholesale",
    title: "Glass Watermelon Lights Wholesale",
    keyword: "glass watermelon lights wholesale",
    category: "glass-watermelon-lights",
    promise: "Source G2 and G3 glass watermelon lights with single color and dual color auxiliary options for the US truck market.",
  },
  {
    slug: "dual-color-truck-lights",
    title: "Dual Color Truck Lights Wholesale",
    keyword: "dual color truck lights wholesale",
    category: "dual-color-truck-lights",
    promise: "Offer road-to-show truck lighting with two colors in one lamp, including amber, red, white, blue, green and purple auxiliary combinations.",
  },
];

const photoProducts = [
  {
    image: "/assets/images/products/product-01-mini-watermelon-amber.heic",
    title: "Mini Amber Watermelon Light",
    description: "Amber dome mini watermelon light with chrome mounting ring, threaded body and visible bullet plug wiring.",
    type: "Mini Watermelon Light",
  },
  {
    image: "/assets/images/products/product-02-mini-watermelon-wiring.heic",
    title: "Mini Watermelon Light with Plug Leads",
    description: "Compact mini watermelon light shown with red and black leads and bullet-style connectors for wiring reference.",
    type: "Mini Watermelon Light",
  },
  {
    image: "/assets/images/products/product-03-mini-watermelon-side.heic",
    title: "Side View Mini Watermelon Light",
    description: "Side-angle product photo showing the rounded lens, chrome trim and threaded mounting section.",
    type: "Mini Watermelon Light",
  },
  {
    image: "/assets/images/products/product-04-mini-watermelon-detail.heic",
    title: "Mini Watermelon Light Detail View",
    description: "Close product view for checking lens shape, metal trim and compact body appearance.",
    type: "Mini Watermelon Light",
  },
  {
    image: "/assets/images/products/product-05-mini-watermelon-mounted.heic",
    title: "Mini Watermelon Light Assembly",
    description: "Mini watermelon light assembly photographed on a clean white background for catalog and wholesale display.",
    type: "Mini Watermelon Light",
  },
  {
    image: "/assets/images/products/product-06-glass-watermelon-kit.heic",
    title: "Glass Watermelon Light Kit",
    description: "Glass watermelon light shown with amber lens, chrome base, LED bulb and connector parts.",
    type: "Glass Watermelon Light",
  },
  {
    image: "/assets/images/products/product-07-glass-watermelon-dome.heic",
    title: "Amber Glass Watermelon Dome",
    description: "Amber glass dome lens with chrome mounting base, photographed as a clean product detail view.",
    type: "Glass Watermelon Light",
  },
  {
    image: "/assets/images/products/product-08-glass-watermelon-bulb.heic",
    title: "Watermelon Light LED Bulb Detail",
    description: "LED bulb and wiring detail photo for the glass watermelon light assembly.",
    type: "Glass Watermelon Light",
  },
  {
    image: "/assets/images/products/product-09-glass-watermelon-lens.heic",
    title: "Glass Watermelon Light Lens Detail",
    description: "Close view of the watermelon-style lens and reflective chrome finish on a white background.",
    type: "Glass Watermelon Light",
  },
  {
    image: "/assets/images/products/product-10-glass-watermelon-side.heic",
    title: "Glass Watermelon Light Side View",
    description: "Side-angle view for checking the dome profile, base shape and wiring layout.",
    type: "Glass Watermelon Light",
  },
];

const supplierProducts = [
  {
    group: "Projector Lens",
    image: "/assets/images/supplier-products/projector-n76d4.jpg",
    title: "N76D4 3 Inch Bi-LED Projector",
    description: "Catalog page shows a 3 inch Bi-LED projector with dual silent fan heat dissipation and road beam comparison images.",
    specs: ["Power: 62W low beam / 73W high beam", "Luminous: 1600 lm low beam / 2000 lm high beam", "Color temperature: 6000K", "Life span: >30000 hrs", "Input voltage: DC 9-16V"],
  },
  {
    group: "Projector Lens",
    image: "/assets/images/supplier-products/projector-x6.jpg",
    title: "X6 Bi-LED Projector Lens",
    description: "Bi-LED projector lens shown with separate lens and projector body images plus beam chip information.",
    specs: ["High beam: CSP chip", "Low beam: CSP chip", "Power: 45W high beam / 36W low beam", "Life span: >30000 hrs", "Input voltage: DC 9-16V", "Color temp: 6000K"],
  },
  {
    group: "Projector Lens",
    image: "/assets/images/supplier-products/projector-x6-pro.jpg",
    title: "X6 Pro Bi-LED Projector Lens",
    description: "Projector lens set displayed with front lens and housing views for catalog comparison.",
    specs: ["High beam: CSP chip", "Low beam: CSP chip", "Power: 55W high beam / 45W low beam", "Life span: >30000 hrs", "Input voltage: DC 9-16V", "Color temp: 6000K"],
  },
  {
    group: "Projector Lens",
    image: "/assets/images/supplier-products/projector-h7-mini.jpg",
    title: "H7 Mini Bi-LED Projector Lens",
    description: "Compact Bi-LED projector lens displayed with lens assembly and high/low beam parameter table.",
    specs: ["High beam: CSP chip", "Low beam: CSP chip", "Power: 47W high beam / 56W low beam", "Life span: >30000 hrs", "Input voltage: DC 9-20V", "Color temp: 6000K"],
  },
  {
    group: "Projector Lens",
    image: "/assets/images/supplier-products/projector-x8-max.jpg",
    title: "X8 Max Bi-LED Projector Lens",
    description: "Bi-LED projector lens with catalog-listed OSRAM high beam chip and CSP low beam chip.",
    specs: ["High beam: OSRAM chip", "Low beam: CSP chip", "Power: 67W high beam / 57W low beam", "Life span: >30000 hrs", "Input voltage: DC 9-16V", "Color temp: 6000K"],
  },
  {
    group: "LED Headlight",
    image: "/assets/images/supplier-products/headlight-65w-d-series.jpg",
    title: "65W D Series LED Headlight Kit",
    description: "D series LED headlight kit shown with gold-tone lamp body, driver wiring and multiple base options.",
    specs: ["Power: 65W", "Color temp: 6000K", "Working temperature: -40~105°C", "Product life: >30000 hrs", "Luminous flux: 14000 LM", "Model: D1 / D3 / D2 / D4 / D8"],
  },
  {
    group: "LED Headlight",
    image: "/assets/images/supplier-products/headlight-mini.jpg",
    title: "Mini LED Headlight Kit",
    description: "Compact LED headlight kit displayed with silver lamp body and projector-style front element.",
    specs: ["Power: LB=50W, HB=55W", "Color temp: 7000K", "Working temperature: -20~85°C", "Chip: CSP 3570", "Input voltage: 9-36V", "Model: H4 / H7 / H11 / 9005 / 9006 / 9012"],
  },
  {
    group: "LED Headlight",
    image: "/assets/images/supplier-products/headlight-h4-mini.jpg",
    title: "H4 Mini LED Headlight Kit",
    description: "H4 mini LED headlight kit with compact heat sink body and visible LED light source.",
    specs: ["Power: LB=40W, HB=50W", "Color temp: 5500K-6500K", "Working temperature: -40~105°C", "Chip: CSP 3570", "Input voltage: 9-36V"],
  },
  {
    group: "LED Headlight",
    image: "/assets/images/supplier-products/headlight-55w-h5sx.jpg",
    title: "55W H5SX Series LED Headlight Kit",
    description: "H5SX series LED headlight kit with Bluetooth control notes and selectable 3000K, 4300K and 6000K color temperatures.",
    specs: ["Power: 55W", "Input voltage: 9-16V", "Product life: >30000 hr", "Environment temp: -40~105°C", "Color temp: 3000K / 4300K / 6000K", "Model: H4 / 9004 / 9007 / H13 / H1 / H3 / H7 / H8 / H9 / H11 / 880 / 9005 / 9006 / 9012"],
  },
  {
    group: "LED Headlight",
    image: "/assets/images/supplier-products/headlight-30w-e9x.jpg",
    title: "30W E9X Series LED Headlight Kit",
    description: "Tri-color E9X series LED headlight kit shown with 3000K, 4300K and 6000K color temperature options.",
    specs: ["Power: 30W", "Color temp: 3000K / 4300K / 6000K", "Environment temp: -40~105°C", "Product life: >30000 hr", "Input voltage: 9-16V", "Model: H4 / 9004 / 9007 / H13 / H1 / H3 / H7 / H8 / H9 / H11 / H16 / 9005 / 9006 / 5202 / 880 / 881"],
  },
];

const faqs = [
  ["Are you a manufacturer or trading company?", "LEADO is positioned as a source manufacturer and OEM/ODM solution provider for truck LED lighting and related vehicle LED products."],
  ["What is your main market?", "The first website stage focuses on North America, especially US wholesale importers, dealers, distributors and B2C sellers."],
  ["Can you support low MOQ?", "Yes. LEADO highlights low MOQ and fast delivery for importer and distributor programs. Exact MOQ depends on the product and customization request."],
  ["Can I download the catalog?", "Yes. The 2025 LEADO Truck LED Lighting catalog is available from the Request Catalog and Download sections."],
  ["Do you support OEM brand customers?", "Yes. LEADO has experience serving OEM brand customers worldwide and can discuss private label, product mix and packaging needs."],
];

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function url(pathname) {
  return `${siteUrl}${pathname}`;
}

function slugPath(slug) {
  return `/${slug}/`;
}

function header(currentLanguage = "en", currentPath = "/") {
  return `<header class="site-header">
  <div class="container nav">
    <a class="brand" href="${localizedPath(currentLanguage, "/")}"><img src="/assets/images/leado-logo.png" alt="LEADO Auto Lighting logo"></a>
    <nav class="nav-links" aria-label="Primary navigation">
      ${nav.map(([label, href]) => `<a href="${localizedPath(currentLanguage, href)}">${label}</a>`).join("")}
    </nav>
    <div class="nav-actions">
      <a class="btn btn-ghost" href="/assets/downloads/leado-truck-led-catalog-2025.pdf">Request Catalog</a>
      <a class="btn btn-primary" href="${localizedPath(currentLanguage, "/contact/")}">Get Wholesale Quote</a>
      ${renderLanguageSwitcher(currentLanguage, currentPath)}
    </div>
    <button class="mobile-toggle" data-mobile-toggle aria-label="Toggle navigation">☰</button>
  </div>
</header>`;
}

function footer() {
  return `<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div>
        <img src="/assets/images/leado-logo.png" alt="LEADO Auto Lighting" style="width:190px;height:auto">
        <p style="margin-top:18px">Truck LED lighting manufacturer for wholesale importers, distributors and OEM/ODM programs.</p>
      </div>
      <div>
        <h3>Products</h3>
        <div class="footer-links">
          ${categories.map((cat) => `<a href="/${cat.slug}/">${cat.title}</a>`).join("")}
        </div>
      </div>
      <div>
        <h3>Company</h3>
        <div class="footer-links">
          <a href="/about/">About LEADO</a>
          <a href="/applications/">Applications</a>
          <a href="/resources/">Resources</a>
          <a href="/contact/">Contact</a>
        </div>
      </div>
      <div>
        <h3>Contact</h3>
        <p>Roson Luo<br>${email}<br>WhatsApp: ${phone}<br>Shenzhen, Guangdong, China</p>
      </div>
    </div>
    <div class="copyright">© ${new Date().getFullYear()} Leado Technology (Shenzhen) Co., Ltd. All rights reserved.</div>
  </div>
</footer>
<a class="whatsapp-float" href="https://wa.me/${whatsapp}">Talk on WhatsApp</a>
<script src="/assets/js/i18n-resources.js"></script>
<script src="/assets/js/i18n-runtime.js"></script>
<script src="/assets/js/main.js"></script>`;
}

function schemaTag(schema) {
  return `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`;
}

function hreflangTags(basePath = "/") {
  return `${siteLanguages.map((language) => `  <link rel="alternate" hreflang="${language.hreflang}" href="${url(localizedPath(language.code, basePath))}">`).join("\n")}
  <link rel="alternate" hreflang="x-default" href="${url(localizedPath("en", basePath))}">`;
}

function layout({ title, description, canonical, body, schema = [], language = "en" }) {
  const currentLanguage = getLanguageByCode(language);
  const basePath = normalizeBasePath(canonical);
  const localizedCanonical = localizedPath(currentLanguage.code, basePath);
  return `<!doctype html>
<html lang="${currentLanguage.htmlLang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${url(localizedCanonical)}">
${hreflangTags(basePath)}
  <link rel="stylesheet" href="/assets/css/styles.css">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${url(localizedCanonical)}">
  <meta property="og:image" content="${siteUrl}/assets/images/hero-trucks.jpg">
  ${schema.map(schemaTag).join("\n")}
</head>
<body>
${header(currentLanguage.code, basePath)}
${body}
${footer()}
</body>
</html>`;
}

function inquiryForm() {
  return `<form class="form-panel" data-inquiry-form>
  <div class="form-grid">
    <div class="field"><label>Name</label><input name="Name" autocomplete="name" required></div>
    <div class="field"><label>Company</label><input name="Company" autocomplete="organization"></div>
    <div class="field"><label>Country</label><input name="Country" autocomplete="country-name" required></div>
    <div class="field"><label>Email / WhatsApp</label><input name="Email or WhatsApp" autocomplete="email" required></div>
    <div class="field"><label>Interested Products</label><input name="Interested Products" placeholder="Truck marker lights, glass watermelon lights..."></div>
    <div class="field"><label>Quantity</label><input name="Quantity" placeholder="200 pcs, 1000 pcs, container order..."></div>
    <div class="field full"><label>Target Market</label><input name="Target Market" placeholder="USA, Canada, South America, Europe..."></div>
    <div class="field full"><label>Message / Product Photo Link</label><textarea name="Message" placeholder="Tell us your target products, colors, voltage, lens, wiring, packing or upload link."></textarea></div>
  </div>
  <button class="btn btn-primary" type="submit" style="margin-top:16px">Get Wholesale Quote</button>
  <div class="form-note">Submitting opens your email app with the inquiry details addressed to ${email}.</div>
  <div class="success-message">Thank you. Our sales team will contact you soon.</div>
</form>`;
}

function productCard(product) {
  return `<article class="product-card">
    <img src="${product.image}" alt="${esc(product.title)} ${esc(product.model)} LED truck lighting product">
    <div class="body">
      <h3>${esc(product.title)}</h3>
      <p><strong>${product.model}</strong> · ${esc(product.summary)}</p>
      <a class="btn btn-outline" href="/products/${product.slug}/">View Details</a>
    </div>
  </article>`;
}

function categoryCard(cat) {
  return `<article class="category-card">
    <img src="${cat.image}" alt="${esc(cat.title)} for wholesale truck lighting importers">
    <div class="body">
      <h3>${esc(cat.title)}</h3>
      <p>${esc(cat.description)}</p>
      <div class="tag-list">${cat.tags.slice(0, 4).map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
      <p style="margin-top:18px"><a class="btn btn-outline" href="/${cat.slug}/">Explore Category</a></p>
    </div>
  </article>`;
}

function photoProductCard(item) {
  return `<article class="photo-product-card">
    <img src="${item.image}" alt="${esc(item.title)} on white background">
    <div>
      <div class="small-meta">${esc(item.type)}</div>
      <h3>${esc(item.title)}</h3>
      <p>${esc(item.description)}</p>
      <a class="btn btn-outline" href="/contact/">Request Quote</a>
    </div>
  </article>`;
}

function supplierProductCard(item) {
  return `<article class="supplier-product-card">
    <img src="${item.image}" alt="${esc(item.title)} catalog product image">
    <div class="supplier-product-body">
      <div class="small-meta">${esc(item.group)}</div>
      <h3>${esc(item.title)}</h3>
      <p>${esc(item.description)}</p>
      <ul>${item.specs.map((spec) => `<li>${esc(spec)}</li>`).join("")}</ul>
      <a class="btn btn-outline" href="/contact/">Request Quote</a>
    </div>
  </article>`;
}

function pageHero({ title, description, image = "/assets/images/hero-trucks.jpg", crumb = "" }) {
  return `<section class="page-hero" style="--hero-image:url('${image}')">
  <div class="container">
    <div class="breadcrumbs"><a href="/">Home</a>${crumb ? ` / ${crumb}` : ""}</div>
    <h1>${esc(title)}</h1>
    <p>${esc(description)}</p>
    <div class="hero-actions">
      <a class="btn btn-primary" href="/contact/">Get Wholesale Quote</a>
      <a class="btn btn-outline" href="/assets/downloads/leado-truck-led-catalog-2025.pdf">Request Catalog</a>
    </div>
  </div>
</section>`;
}

function homePage(language = "en") {
  const lang = getLanguageByCode(language);
  const content = localizedHomeContent[lang.code] || localizedHomeContent.en;
  const featured = products.filter((p) => ["m500101", "m500205", "m500304", "m500402"].includes(p.id));
  return layout({
    title: content.title,
    description: content.description,
    canonical: "/",
    language: lang.code,
    schema: [
      organizationSchema(),
      breadcrumbSchema([{ name: "Home", item: lang.path }]),
    ],
    body: `<main>
      <section class="hero" style="--hero-image:url('/assets/images/hero-trucks.jpg')">
        <div class="container hero-content">
          <h1>${esc(content.heroTitle)}</h1>
          <p>${esc(content.heroText)}</p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="/contact/">Get Wholesale Quote</a>
            <a class="btn btn-outline" href="/assets/downloads/leado-truck-led-catalog-2025.pdf">Request Catalog</a>
          </div>
          <div class="hero-strip">
            <div><strong>Since 2010</strong><span>15 years in vehicle LED lighting</span></div>
            <div><strong>100% inspected</strong><span>Strict QC before shipment</span></div>
            <div><strong>OEM / ODM</strong><span>Low MOQ and fast delivery support</span></div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="section-head">
            <h2>Hot Truck Lighting Categories</h2>
            <p>Start with the product lines most useful for US wholesale importers and B2C sellers.</p>
          </div>
          <div class="grid grid-3">${categories.slice(0, 5).map(categoryCard).join("")}</div>
        </div>
      </section>

      <section class="section section-gray">
        <div class="container split">
          <div>
            <h2>One Stop Truck LED Lighting Solution Provider</h2>
            <p>Leado Technology (Shenzhen) Co., Ltd. is a source manufacturer and OEM/ODM solution provider with 30,000+ m² factory space and a 40+ elite team.</p>
            <div class="feature-list">
              ${["60 OEM brand customers all over the world", "New products developed around market demand", "Air, sea, train and DDP shipping channels", "1 year warranty for product confidence"].map((f, i) => `<div class="feature-item"><div class="feature-icon">${i + 1}</div><div><h3>${f}</h3><p>Built for importers who need consistent product quality, practical pricing and dependable supply.</p></div></div>`).join("")}
            </div>
          </div>
          <div class="media-frame"><img src="/assets/images/technology-banner.jpg" alt="LEADO LED lighting technology and quality control"></div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="section-head">
            <h2>US Market Starter Products</h2>
            <p>Use these hero SKUs to test SEO demand, Google Ads traffic and wholesale inquiries before expanding the full 158-product catalog.</p>
          </div>
          <div class="grid grid-4">${featured.map(productCard).join("")}</div>
        </div>
      </section>

      <section class="section section-gray">
        <div class="container">
          <div class="founder-card">
            <img src="/assets/images/founder-roson-luo.jpg" alt="Roson Luo, LEADO contact for wholesale truck LED lighting">
            <div>
              <h2>Founder-led Quality Control</h2>
              <p>Wholesale truck lighting buyers need stable batches, clear communication and fast product decisions. Roson Luo leads LEADO's export communication with a focus on practical product selection, QC and long-term importer support.</p>
              <a class="btn btn-primary" href="/contact/">Talk to Roson Luo</a>
            </div>
          </div>
          <div class="stat-row" style="margin-top:28px">
            <div class="stat"><strong>30,000+ m²</strong><span>Factory area</span></div>
            <div class="stat"><strong>40+</strong><span>Team members</span></div>
            <div class="stat"><strong>60</strong><span>OEM brand customers</span></div>
            <div class="stat"><strong>Every batch</strong><span>100% inspection before shipment</span></div>
          </div>
        </div>
      </section>

      ${faqSection()}
      ${quoteBand()}
    </main>`,
  });
}

function categoryPage(cat, language = "en") {
  const list = products.filter((p) => cat.products.includes(p.id));
  return layout({
    title: `${cat.title} Wholesale | LEADO Truck LED Lighting Manufacturer`,
    description: cat.description,
    canonical: `/${cat.slug}/`,
    language,
    schema: [
      organizationSchema(),
      breadcrumbSchema([{ name: "Home", item: "/" }, { name: cat.title, item: `/${cat.slug}/` }]),
      collectionSchema(cat, list),
    ],
    body: `<main>
      ${pageHero({ title: cat.title, description: cat.description, image: cat.image, crumb: cat.title })}
      <section class="section">
        <div class="container split">
          <div>
            <h2>Built for ${cat.keyword}</h2>
            <p>LEADO supports importers with category planning, product mix selection, OEM/ODM discussion and wholesale quotation based on realistic market needs.</p>
            <div class="tag-list">${cat.tags.map((tag) => `<span class="tag tag-yellow">${esc(tag)}</span>`).join("")}</div>
          </div>
          <div class="media-frame"><img src="${cat.image}" alt="${esc(cat.title)} product range and application"></div>
        </div>
      </section>
      <section class="section section-gray">
        <div class="container">
          <div class="section-head"><h2>Recommended Products</h2><p>Starter SKUs for quote requests, sample orders and first-stage SEO product pages.</p></div>
          <div class="grid grid-3">${list.map(productCard).join("")}</div>
        </div>
      </section>
      <section class="section">
        <div class="container split">
          <div>
            <h2>Wholesale Buyer Notes</h2>
            <div class="feature-list">
              <div class="feature-item"><div class="feature-icon">V</div><div><h3>Voltage planning</h3><p>Choose from 12V, 24V and 10-30V products depending on market and vehicle applications.</p></div></div>
              <div class="feature-item"><div class="feature-icon">C</div><div><h3>Color and lens mix</h3><p>Plan red, amber and white core demand first, then add blue, green, purple, smoked lens or auxiliary color variants.</p></div></div>
              <div class="feature-item"><div class="feature-icon">Q</div><div><h3>Quote-ready details</h3><p>Share model, target quantity, preferred wiring, plug type, packing and target market for faster quotation.</p></div></div>
            </div>
          </div>
          ${inquiryForm()}
        </div>
      </section>
    </main>`,
  });
}

function productPage(product, language = "en") {
  const cat = categories.find((c) => c.slug === product.category);
  const specs = Object.entries(product.specs).map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join("");
  return layout({
    title: `${product.title} ${product.model} | LEADO Wholesale Truck LED Lighting`,
    description: product.summary,
    canonical: `/products/${product.slug}/`,
    language,
    schema: [
      organizationSchema(),
      breadcrumbSchema([{ name: "Home", item: "/" }, { name: "Products", item: "/products/" }, { name: product.title, item: `/products/${product.slug}/` }]),
      productSchema(product),
    ],
    body: `<main>
      ${pageHero({ title: `${product.title} ${product.model}`, description: product.summary, image: product.image, crumb: `<a href="/products/">Products</a> / ${esc(product.title)}` })}
      <section class="section">
        <div class="container split">
          <div class="media-frame"><img src="${product.image}" alt="${esc(product.title)} ${esc(product.model)} ${esc(cat.title)}"></div>
          <div>
            <h2>Wholesale Product Details</h2>
            <p>${esc(product.summary)} This page is designed for quote requests, sample discussions and product line planning.</p>
            <div class="tag-list">
              <span class="tag tag-yellow">${esc(product.model)}</span>
              <span class="tag">${esc(cat.title)}</span>
              <span class="tag">Request a quote</span>
            </div>
            <p style="margin-top:22px"><a class="btn btn-primary" href="/contact/">Get Wholesale Quote</a></p>
          </div>
        </div>
      </section>
      <section class="section section-gray">
        <div class="container">
          <div class="section-head"><h2>Specifications</h2><p>Confirm final parameters, packing and OEM/ODM options with LEADO before production.</p></div>
          <table class="spec-table">${specs}</table>
        </div>
      </section>
      ${faqSection("Product FAQ")}
      ${quoteBand()}
    </main>`,
  });
}

function productsPage(language = "en") {
  return layout({
    title: "Truck LED Lighting Products | LEADO",
    description: "Explore LEADO truck marker lights, glass watermelon lights, tail lights, cab marker lights and dual color auxiliary truck lights for wholesale importers.",
    canonical: "/products/",
    language,
    schema: [organizationSchema(), breadcrumbSchema([{ name: "Home", item: "/" }, { name: "Products", item: "/products/" }])],
    body: `<main>
      ${pageHero({ title: "Truck LED Lighting Products", description: "A focused starter catalog for importers, distributors and B2C sellers building truck lighting programs.", image: "/assets/images/hero-trucks.jpg", crumb: "Products" })}
      <section class="section"><div class="container"><div class="section-head"><h2>Projector Lens & LED Headlight Products</h2><p>Selected from supplier catalog pages. Parameters below are transcribed from visible catalog information and should be confirmed before quotation.</p></div><div class="supplier-product-grid">${supplierProducts.map(supplierProductCard).join("")}</div></div></section>
      <section class="section section-gray"><div class="container"><div class="section-head"><h2>Product Categories</h2><p>Begin with high-demand categories, then expand into the full LEADO catalog.</p></div><div class="grid grid-3">${categories.map(categoryCard).join("")}</div></div></section>
      <section class="section"><div class="container"><div class="section-head"><h2>Featured SKUs</h2><p>Starter products for SEO, ads and inquiry validation. Confirm final specifications before quotation.</p></div><div class="grid grid-4">${products.map(productCard).join("")}</div></div></section>
    </main>`,
  });
}

function applicationsPage(language = "en") {
  const apps = [
    ["Semi Truck Lighting", "Marker, cab marker, tail and dual color lighting for semi trucks and custom truck builds."],
    ["Trailer Lighting", "Tail lights, marker lights and trailer light box kits for replacement and wholesale programs."],
    ["Show Truck / Auxiliary Lighting", "Dual color and watermelon lights for road-to-show applications."],
    ["Off-road and Utility", "Wide-voltage, waterproof and strobe options for rugged vehicle lighting demand."],
  ];
  return layout({
    title: "Truck Lighting Applications | LEADO",
    description: "Applications for LEADO truck LED lighting: semi trucks, trailers, show truck auxiliary lighting and off-road utility vehicles.",
    canonical: "/applications/",
    language,
    schema: [organizationSchema(), breadcrumbSchema([{ name: "Home", item: "/" }, { name: "Applications", item: "/applications/" }])],
    body: `<main>${pageHero({ title: "Truck Lighting Applications", description: "Plan product pages and ad campaigns around the way buyers actually search: vehicle type, function, color, voltage and installation.", image: "/assets/images/hero-trucks.jpg", crumb: "Applications" })}
      <section class="section"><div class="container"><div class="grid grid-4">${apps.map(([title, text]) => `<article class="proof-card"><h3>${title}</h3><p>${text}</p><a class="btn btn-outline" href="/contact/">Discuss Product Mix</a></article>`).join("")}</div></div></section>
      ${quoteBand()}</main>`,
  });
}

function aboutPage(language = "en") {
  return layout({
    title: "About LEADO | Truck LED Lighting Manufacturer Since 2010",
    description: "Leado Technology (Shenzhen) Co., Ltd. is a source manufacturer and OEM/ODM solution provider for truck LED lighting with 15 years experience.",
    canonical: "/about/",
    language,
    schema: [organizationSchema(), breadcrumbSchema([{ name: "Home", item: "/" }, { name: "About", item: "/about/" }])],
    body: `<main>${pageHero({ title: "About LEADO", description: "A source manufacturer and OEM/ODM solution provider for vehicle and truck LED lighting since 2010.", image: "/assets/images/technology-banner.jpg", crumb: "About" })}
      <section class="section"><div class="container split"><div><h2>Practical Manufacturing Support for Importers</h2><p>LEADO focuses on one stop truck LED lighting solutions, including truck marker lights, glass watermelon lights, truck tail lights, cab marker lights and dual color auxiliary lights.</p><p>Our team observes market demand and develops new products to help customers stay ahead of local competitors.</p></div><div class="media-frame"><img src="/assets/images/founder-roson-luo.jpg" alt="Roson Luo from LEADO"></div></div></section>
      <section class="section section-gray"><div class="container split"><div><h2>Supplier Network & Product Development Standard</h2><p>For projector lenses and LED headlight kits, LEADO reviews supplier catalogues with attention to R&D capability, production consistency, quality systems, product testing and export-ready documentation.</p><p>The reviewed supplier profile emphasizes automotive intelligent lighting development, modern production facilities, automatic production processes, international quality management systems and long-term product innovation. LEADO uses this type of benchmark to select products for importer catalog expansion without overstating supplier certifications as LEADO-owned credentials.</p></div><div class="proof-card"><h3>What We Look For</h3><p>Clear product specifications, stable visual presentation, visible testing information, documented model coverage, and product lines that match wholesale importer demand.</p><div class="tag-list"><span class="tag tag-yellow">R&D capability</span><span class="tag tag-yellow">Quality systems</span><span class="tag tag-yellow">Model coverage</span><span class="tag tag-yellow">Export support</span></div></div></div></section>
      <section class="section section-gray"><div class="container"><div class="stat-row"><div class="stat"><strong>2010</strong><span>Founded</span></div><div class="stat"><strong>15 years</strong><span>R&D and manufacturing</span></div><div class="stat"><strong>30,000+ m²</strong><span>Factory area</span></div><div class="stat"><strong>100%</strong><span>Inspection before shipment</span></div></div></div></section>
      ${quoteBand()}</main>`,
  });
}

function contactPage(language = "en") {
  return layout({
    title: "Contact LEADO | Get Wholesale Truck Lighting Quote",
    description: "Contact Roson Luo and LEADO for wholesale truck LED lighting quotes, catalog requests, product photos and OEM/ODM discussions.",
    canonical: "/contact/",
    language,
    schema: [organizationSchema(), breadcrumbSchema([{ name: "Home", item: "/" }, { name: "Contact", item: "/contact/" }])],
    body: `<main>${pageHero({ title: "Get Wholesale Truck Lighting Quote", description: "Send your target products, quantity, country and WhatsApp. LEADO will reply with catalog support and quote details.", image: "/assets/images/hero-trucks.jpg", crumb: "Contact" })}
      <section class="section">
        <div class="container split">
          <div>
            <h2>Talk to Roson Luo</h2>
            <p>For truck marker lights, glass watermelon lights, tail lights, projector lenses and LED headlight products, send your target model, quantity, market and product photos. LEADO will help prepare a practical wholesale quote and catalog recommendation.</p>
            <div class="tag-list">
              <span class="tag tag-yellow">Wholesale quote</span>
              <span class="tag tag-yellow">Catalog support</span>
              <span class="tag tag-yellow">OEM / ODM discussion</span>
              <span class="tag tag-yellow">Product photo matching</span>
            </div>
            <div class="contact-card-grid" style="margin-top:28px">
              <div class="contact-info-card"><h3>Email</h3><p><a href="mailto:${email}">${email}</a></p><p>Best for catalog lists, product photos and quote files.</p></div>
              <div class="contact-info-card"><h3>WhatsApp</h3><p><a href="https://wa.me/${whatsapp}">${phone}</a></p><p>Best for quick model confirmation and sample discussion.</p></div>
              <div class="contact-info-card"><h3>Location</h3><p>HuiXin Building, Xueziwei Creative Park</p><p>Baoan Road, Shajing Subdistrict, Baoan District, Shenzhen, Guangdong, China 518103.</p></div>
            </div>
          </div>
          <div class="contact-trust-card">
            <img class="portrait" src="/assets/images/founder-roson-luo.jpg" alt="Roson Luo, LEADO wholesale truck lighting contact">
            <div class="brand-overlay">
              <img src="/assets/images/leado-logo.png" alt="LEADO Auto Lighting logo">
              <div><strong>LEADO Auto Lighting</strong><span>Founder-led communication for wholesale importers</span></div>
            </div>
          </div>
        </div>
      </section>

      <section class="section section-gray">
        <div class="container">
          <div class="section-head"><h2>What to Send for a Fast Quote</h2><p>Clear inquiry details help us return a more useful product recommendation and quotation.</p></div>
          <div class="contact-steps">
            <div class="contact-step"><strong>1</strong><h3>Target Product</h3><p>Send product photos, model links or category names such as marker light, watermelon light, projector lens or LED headlight.</p></div>
            <div class="contact-step"><strong>2</strong><h3>Quantity & Market</h3><p>Share your expected quantity, country and sales channel so we can recommend a realistic product mix.</p></div>
            <div class="contact-step"><strong>3</strong><h3>Technical Details</h3><p>Confirm voltage, color, lens, plug, wiring, packaging or OEM/ODM requirements when available.</p></div>
            <div class="contact-step"><strong>4</strong><h3>Quote Follow-up</h3><p>Our sales team will reply with catalog support, model suggestions and next-step quotation details.</p></div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container split">
          <div>
            <h2>Send Your Inquiry</h2>
            <p>Use the form for a structured request. If you already have a target product photo, paste a shared link in the message field or send it by WhatsApp after submitting.</p>
            ${inquiryForm()}
          </div>
          <div class="map-panel">
            <iframe title="OpenStreetMap location near HuiXin Building, Xueziwei Creative Park, Shenzhen" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.openstreetmap.org/export/embed.html?bbox=113.742%2C22.643%2C113.902%2C22.803&amp;layer=mapnik&amp;marker=22.723%2C113.822"></iframe>
            <div class="map-brand">
              <img src="/assets/images/leado-logo.png" alt="LEADO Auto Lighting logo">
              <span>Factory visit address</span>
            </div>
            <div class="address-card">
              <h3>Company Address</h3>
              <p>HuiXin Building, Xueziwei Creative Park,<br>Baoan Road, Shajing Subdistrict, Baoan District,<br>Shenzhen City, Guangdong, China. 518103</p>
              <p class="muted">For office or factory visits, please confirm the meeting time with LEADO before arrival.</p>
            </div>
            <div class="map-caption">
              <div><h3>OpenStreetMap</h3><p>Open the live map and search the full address for route planning.</p></div>
              <a class="btn btn-outline" href="https://www.openstreetmap.org/search?query=HuiXin%20Building%2C%20Xueziwei%20Creative%20Park%2C%20Baoan%20Road%2C%20Shajing%20Subdistrict%2C%20Baoan%20District%2C%20Shenzhen%2C%20Guangdong%2C%20China%20518103">Open Map</a>
            </div>
          </div>
        </div>
      </section>
    </main>`,
  });
}

function resourcesPage(language = "en") {
  return layout({
    title: "Truck Lighting Procurement Resources | LEADO",
    description: "Buyer guides for truck marker lights, glass watermelon lights, 12V/24V truck lights and DOT-related product checks.",
    canonical: "/resources/",
    language,
    schema: [organizationSchema(), breadcrumbSchema([{ name: "Home", item: "/" }, { name: "Resources", item: "/resources/" }])],
    body: `<main>${pageHero({ title: "Truck Lighting Procurement Resources", description: "Practical sourcing guides for importers, distributors and B2C sellers. Built for SEO, AI search answers and better inquiry quality.", image: "/assets/images/technology-banner.jpg", crumb: "Resources" })}
      <section class="section"><div class="container"><div class="grid grid-2">${resources.map((r) => `<article class="article-card"><div class="body"><h3>${esc(r.title)}</h3><p>${esc(r.description)}</p><a class="btn btn-outline" href="/resources/${r.slug}/">Read Guide</a></div></article>`).join("")}</div></div></section></main>`,
  });
}

function resourcePage(article, language = "en") {
  return layout({
    title: `${article.title} | LEADO Resources`,
    description: article.description,
    canonical: `/resources/${article.slug}/`,
    language,
    schema: [organizationSchema(), breadcrumbSchema([{ name: "Home", item: "/" }, { name: "Resources", item: "/resources/" }, { name: article.title, item: `/resources/${article.slug}/` }])],
    body: `<main>${pageHero({ title: article.title, description: article.description, image: "/assets/images/technology-banner.jpg", crumb: `<a href="/resources/">Resources</a> / ${esc(article.title)}` })}
      <section class="section"><div class="container article-body">${article.sections.map(([h, p]) => `<h2>${esc(h)}</h2><p>${esc(p)}</p>`).join("")}<h2>Need help building your product line?</h2><p>Send LEADO your target market, quantity and product photos. We can recommend a starter mix for marker lights, watermelon lights, tail lights and cab marker lights.</p><p><a class="btn btn-primary" href="/contact/">Get Wholesale Quote</a></p></div></section></main>`,
  });
}

function landingPage(lp, language = "en") {
  const cat = categories.find((c) => c.slug === lp.category);
  const list = products.filter((p) => cat.products.includes(p.id)).slice(0, 4);
  return layout({
    title: `${lp.title} | LEADO`,
    description: lp.promise,
    canonical: `/landing/${lp.slug}/`,
    language,
    schema: [organizationSchema(), breadcrumbSchema([{ name: "Home", item: "/" }, { name: lp.title, item: `/landing/${lp.slug}/` }]), collectionSchema(cat, list)],
    body: `<main>
      <section class="hero" style="--hero-image:url('${cat.image}')">
        <div class="container hero-content">
          <h1>${esc(lp.title)}</h1>
          <p>${esc(lp.promise)} Source from a manufacturer with low MOQ, fast delivery, OEM/ODM support and 100% inspection before shipment.</p>
          <div class="hero-actions"><a class="btn btn-primary" href="#quote">Get Wholesale Quote</a><a class="btn btn-outline" href="/assets/downloads/leado-truck-led-catalog-2025.pdf">Request Catalog</a></div>
          <div class="hero-strip"><div><strong>Ad-ready</strong><span>Built around ${esc(lp.keyword)}</span></div><div><strong>200 / 1000 pcs</strong><span>Quote volume examples from catalog</span></div><div><strong>WhatsApp</strong><span>Fast importer communication</span></div></div>
        </div>
      </section>
      <section class="section"><div class="container"><div class="section-head"><h2>Products for This Campaign</h2><p>Focused product set for one ad group and one buyer intent.</p></div><div class="grid grid-4">${list.map(productCard).join("")}</div></div></section>
      <section class="section section-gray" id="quote"><div class="container split"><div><h2>Send Your Target Product Photo</h2><p>Tell us your country, quantity, desired voltage, lens color, wiring and packaging. We will prepare a quote and catalog recommendation for your wholesale program.</p><div class="tag-list">${cat.tags.map((t) => `<span class="tag tag-yellow">${esc(t)}</span>`).join("")}</div></div>${inquiryForm()}</div></section>
    </main>`,
  });
}

function faqSection(title = "FAQ") {
  return `<section class="section faq">
    <div class="container">
      <div class="section-head"><h2>${title}</h2><p>Short answers for importers evaluating LEADO as a truck lighting supplier.</p></div>
      ${faqs.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}
    </div>
  </section>`;
}

function quoteBand() {
  return `<section class="quote-band">
    <div class="container">
      <div><h2>Ready to build your truck lighting line?</h2><p>Request the 2025 catalog, send target product photos or ask for a wholesale quote for your market.</p></div>
      <div class="hero-actions"><a class="btn btn-primary" href="/contact/">Get Wholesale Quote</a><a class="btn btn-outline" href="/assets/downloads/leado-truck-led-catalog-2025.pdf">Request Catalog</a></div>
    </div>
  </section>`;
}

function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Leado Technology (Shenzhen) Co., Ltd.",
    alternateName: "LEADO Auto Lighting",
    url: siteUrl,
    logo: `${siteUrl}/assets/images/leado-logo.png`,
    email,
    telephone: phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Shenzhen",
      addressRegion: "Guangdong",
      addressCountry: "CN",
    },
    foundingDate: "2010",
  };
}

function breadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: url(item.item),
    })),
  };
}

function collectionSchema(cat, list) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: cat.title,
    description: cat.description,
    url: url(`/${cat.slug}/`),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: list.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: url(`/products/${p.slug}/`),
        name: p.title,
      })),
    },
  };
}

function productSchema(product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.title} ${product.model}`,
    model: product.model,
    image: `${siteUrl}${product.image}`,
    description: product.summary,
    brand: { "@type": "Brand", name: "LEADO" },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: url(`/products/${product.slug}/`),
      priceSpecification: {
        "@type": "PriceSpecification",
        description: "Request a wholesale quote based on quantity, packing and OEM/ODM requirements.",
      },
    },
  };
}

async function writeFile(route, html) {
  const dir = path.join(root, route);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, "index.html"), html);
}

function localizedRouteDir(languageCode, basePath) {
  const pathname = localizedPath(languageCode, basePath);
  if (pathname === "/") return ".";
  return pathname.replace(/^\/|\/$/g, "");
}

function baseUrls() {
  return [
    "/",
    "/products/",
    "/applications/",
    "/about/",
    "/contact/",
    "/resources/",
    ...categories.map((c) => `/${c.slug}/`),
    ...products.map((p) => `/products/${p.slug}/`),
    ...resources.map((r) => `/resources/${r.slug}/`),
    ...landingPages.map((lp) => `/landing/${lp.slug}/`),
  ];
}

function localizedUrls() {
  return baseUrls().flatMap((basePath) => siteLanguages.map((language) => localizedPath(language.code, basePath)));
}

async function writeLanguageSite(language) {
  await writeFile(localizedRouteDir(language.code, "/"), homePage(language.code));
  await writeFile(localizedRouteDir(language.code, "/products/"), productsPage(language.code));
  await writeFile(localizedRouteDir(language.code, "/applications/"), applicationsPage(language.code));
  await writeFile(localizedRouteDir(language.code, "/about/"), aboutPage(language.code));
  await writeFile(localizedRouteDir(language.code, "/contact/"), contactPage(language.code));
  await writeFile(localizedRouteDir(language.code, "/resources/"), resourcesPage(language.code));

  for (const cat of categories) await writeFile(localizedRouteDir(language.code, `/${cat.slug}/`), categoryPage(cat, language.code));
  for (const p of products) await writeFile(localizedRouteDir(language.code, `/products/${p.slug}/`), productPage(p, language.code));
  for (const r of resources) await writeFile(localizedRouteDir(language.code, `/resources/${r.slug}/`), resourcePage(r, language.code));
  for (const lp of landingPages) await writeFile(localizedRouteDir(language.code, `/landing/${lp.slug}/`), landingPage(lp, language.code));
}

async function main() {
  for (const language of siteLanguages) await writeLanguageSite(language);

  const urls = localizedUrls();

  await fs.writeFile(path.join(root, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${url(u)}</loc></url>`).join("\n")}\n</urlset>\n`);
  await fs.writeFile(path.join(root, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`);
}

main();
