import hero from "@/assets/img/hero.jpg";
import lifestyle from "@/assets/img/lifestyle.jpg";
import collection from "@/assets/img/collection.jpg";
import productSerum from "@/assets/img/product-serum.jpg";
import productCream from "@/assets/img/product-cream.jpg";
import productOil from "@/assets/img/product-oil.jpg";
import productCleanser from "@/assets/img/product-cleanser.jpg";
import productMist from "@/assets/img/product-mist.jpg";
import productButter from "@/assets/img/product-butter.jpg";
import productMask from "@/assets/img/product-mask.jpg";
import productBalm from "@/assets/img/product-balm.jpg";
import productBodyoil from "@/assets/img/product-bodyoil.jpg";
import ingredients from "@/assets/img/ingredients.jpg";
import botanicals from "@/assets/img/botanicals.jpg";
import application from "@/assets/img/application.jpg";
import philosophy from "@/assets/img/philosophy.jpg";
import wellness from "@/assets/img/wellness.jpg";
import ritualMorning from "@/assets/img/ritual-morning.jpg";
import ritualEvening from "@/assets/img/ritual-evening.jpg";
import texture from "@/assets/img/texture.jpg";
import journalTea from "@/assets/img/journal-tea.jpg";
import journalRose from "@/assets/img/journal-rose.jpg";
import journalGarden from "@/assets/img/journal-garden.jpg";
import journalStones from "@/assets/img/journal-stones.jpg";
import galleryJasmine from "@/assets/img/gallery-jasmine.jpg";

/**
 * Stored data references bundled photos by a stable key ("img:hero") so saved
 * admin data keeps working after rebuilds change hashed asset URLs.
 */
export const IMAGE_LIBRARY: Record<string, { src: string; label: string }> = {
  "img:hero": { src: hero, label: "Hero – botanical bottles" },
  "img:lifestyle": { src: lifestyle, label: "Lifestyle – cream in hands" },
  "img:collection": { src: collection, label: "Collection flat lay" },
  "img:product-serum": { src: productSerum, label: "Product – serum" },
  "img:product-cream": { src: productCream, label: "Product – cream" },
  "img:product-oil": { src: productOil, label: "Product – face oil" },
  "img:product-cleanser": { src: productCleanser, label: "Product – cleanser" },
  "img:product-mist": { src: productMist, label: "Product – mist" },
  "img:product-butter": { src: productButter, label: "Product – body butter" },
  "img:product-mask": { src: productMask, label: "Product – clay mask" },
  "img:product-balm": { src: productBalm, label: "Product – balm" },
  "img:product-bodyoil": { src: productBodyoil, label: "Product – body oil" },
  "img:ingredients": { src: ingredients, label: "Natural ingredients" },
  "img:botanicals": { src: botanicals, label: "Leaves & flowers" },
  "img:application": { src: application, label: "Skincare application" },
  "img:philosophy": { src: philosophy, label: "Philosophy – mortar & beaker" },
  "img:wellness": { src: wellness, label: "Wellness – bath" },
  "img:ritual-morning": { src: ritualMorning, label: "Morning ritual" },
  "img:ritual-evening": { src: ritualEvening, label: "Evening ritual" },
  "img:texture": { src: texture, label: "Textures" },
  "img:journal-tea": { src: journalTea, label: "Herbal tea & journal" },
  "img:journal-rose": { src: journalRose, label: "Rose petal bowl" },
  "img:journal-garden": { src: journalGarden, label: "Herb garden" },
  "img:journal-stones": { src: journalStones, label: "Stones & facial tools" },
  "img:gallery-jasmine": { src: galleryJasmine, label: "Jasmine & dropper" },
};

export function resolveImage(ref: string | undefined | null): string {
  if (!ref) return "";
  return IMAGE_LIBRARY[ref]?.src ?? ref;
}
