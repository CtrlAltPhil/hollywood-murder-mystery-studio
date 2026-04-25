// Asset preloader utility
// Preloads images into the browser cache using native Image objects

export function preloadImages(urls: string[]): Promise<void> {
  return Promise.all(
    urls.map(
      (url) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve(); // Don't block on failed loads
          img.src = url;
        })
    )
  ).then(() => undefined);
}

// Import all game assets for the manifest
import breakroomBg from "@/assets/backgrounds/breakroom.jpg";
import hallwayBg from "@/assets/backgrounds/hallway.png";
import hallwayKitchenBg from "@/assets/backgrounds/hallway-kitchen.jpg";
import kitchenBg from "@/assets/backgrounds/kitchen.png";
import productionRoomBg from "@/assets/Production_Room-2.png";
import ladyRoomBg from "@/assets/backgrounds/lady-fantastique-room.png";
import losCabosRoomBg from "@/assets/backgrounds/los-cabos-room.png";
import studyBg from "@/assets/backgrounds/study.png";
import backyardBg from "@/assets/backgrounds/backyard.png";
import gardenPathBg from "@/assets/backgrounds/garden-path.png";
import shedInteriorBg from "@/assets/backgrounds/shed-interior.png";
import dukeRoomBg from "@/assets/backgrounds/duke-extreme-room.png";
import parkingLotBg from "@/assets/backgrounds/parking-lot.png";

import carlImg from "@/assets/characters/carl.png";
import elFuegoImg from "@/assets/characters/el-fuego.png";
import elFuegoImg2 from "@/assets/characters/el-fuego-2.png";
import ladyImg from "@/assets/characters/lady.png";
import losCabosImg from "@/assets/characters/los-cabos.png";
import losCabosDeadImg from "@/assets/characters/los-cabos-dead.png";
import chefAllegroImg from "@/assets/characters/chef-allegro.png";
import chefAllegroBlinkImg from "@/assets/characters/chef-allegro-blink.png";
import sousChefSallyImg from "@/assets/characters/sous-chef-sally.png";
import sousChefSallyAngryImg from "@/assets/characters/sous-chef-sally-angry.png";
import losCabos2Img from "@/assets/characters/los-cabos-2.png";
import mrCowardlyImg from "@/assets/characters/mr-cowardly.png";
import mrCowardlyScaredImg from "@/assets/characters/mr-cowardly-scared.png";
import lukeAdamsImg from "@/assets/characters/luke-adams.png";
import inheritanceAgreementImg from "@/assets/props/inheritance-agreement.png";

import tableImg from "@/assets/props/table.png";
import wineGlassesImg from "@/assets/props/wine-glasses.png";
import daggerImg from "@/assets/props/dagger.png";
import charcuterieImg from "@/assets/charcuterie_board.png";
import waterfall1 from "@/assets/props/waterfall1.png";
import waterfall2 from "@/assets/props/waterfall2.png";
import waterfall3 from "@/assets/props/waterfall3.png";
import waterfall4 from "@/assets/props/waterfall4.png";

import eboxFront from "@/assets/Electrical_Box_Front.png";
import eboxOpen from "@/assets/Electrical_Box_Open.png";
import eboxKey from "@/assets/Electrical_Box_Key.png";
import moneyBag from "@/assets/money_bag.png";
import backyardKeyImg from "@/assets/props/backyard-key.png";
import wireCuttersImg from "@/assets/props/wire-cutters.png";
import handkerchiefImg from "@/assets/props/monogrammed-handkerchief.png";
import tornPhotoImg from "@/assets/props/torn-photograph.png";

// Scene-grouped manifest
export const assetManifest: Record<string, string[]> = {
  breakroom: [
    breakroomBg, carlImg, elFuegoImg, elFuegoImg2, ladyImg,
    losCabosDeadImg, tableImg, wineGlassesImg, daggerImg, charcuterieImg,
  ],
  hallway: [hallwayBg, mrCowardlyImg, mrCowardlyScaredImg],
  "hallway-kitchen": [hallwayKitchenBg],
  kitchen: [kitchenBg, chefAllegroImg, chefAllegroBlinkImg, sousChefSallyImg, sousChefSallyAngryImg],
  "production-room": [productionRoomBg, eboxFront, eboxOpen],
  "lady-fantastique-room": [ladyRoomBg, ladyImg],
  "los-cabos-room": [losCabosRoomBg, losCabos2Img],
  study: [studyBg, inheritanceAgreementImg],
  backyard: [backyardBg, waterfall1, waterfall2, waterfall3, waterfall4, eboxKey, backyardKeyImg],
  "garden-path": [gardenPathBg],
  "shed-interior": [shedInteriorBg, wireCuttersImg],
  "duke-extreme-room": [dukeRoomBg, moneyBag],
  "parking-lot": [parkingLotBg, handkerchiefImg, tornPhotoImg],
};

// Get all assets as a flat array
export function getAllAssets(): string[] {
  return Object.values(assetManifest).flat();
}

// Get assets for a specific room
export function getRoomAssets(roomId: string): string[] {
  return assetManifest[roomId] || [];
}
