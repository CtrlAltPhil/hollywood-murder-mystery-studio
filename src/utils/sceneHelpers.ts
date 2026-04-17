import { Verb } from "@/types/game";

// Shared hotspot type used by all scenes
export interface SimpleHotspot {
  id: string;
  name: string;
  position: { x: number; y: number };
  width: number;
  height: number;
  interactions: Record<string, string | (() => string | void)>;
}

// Cursor class mapping based on selected verb
export function getCursorClass(verb: Verb | null): string {
  if (!verb) return "cursor-default";

  const cursorMap: Record<Verb, string> = {
    look: "cursor-look",
    pickup: "cursor-pickup",
    use: "cursor-use",
    open: "cursor-open",
    close: "cursor-close",
    talk: "cursor-talk",
    push: "cursor-push",
    pull: "cursor-pull",
  };

  return cursorMap[verb] || "cursor-default";
}

// Shared hotspot click handler for navigation and fallthrough
export function handleSceneHotspotClick(
  hotspot: SimpleHotspot,
  verb: Verb | null,
  onChangeRoom: (roomId: string) => void,
  onHotspotClick: (hotspot: SimpleHotspot) => void,
) {
  if (verb) {
    const interaction = hotspot.interactions[verb];
    if (typeof interaction === "string" && interaction.startsWith("__NAVIGATE__")) {
      onChangeRoom(interaction.replace("__NAVIGATE__", ""));
      return;
    }
  }
  // Default: doors auto-open when no verb selected
  if (!verb && hotspot.interactions.open) {
    const openInteraction = hotspot.interactions.open;
    if (typeof openInteraction === "string") {
      if (openInteraction.startsWith("__NAVIGATE__")) {
        onChangeRoom(openInteraction.replace("__NAVIGATE__", ""));
        return;
      }
      // Blocked door (or other open-with-message): forward as if 'open' verb was selected
      onHotspotClick({ ...hotspot, __defaultVerb: "open" } as SimpleHotspot);
      return;
    }
    if (typeof openInteraction === "function") {
      onHotspotClick({ ...hotspot, __defaultVerb: "open" } as SimpleHotspot);
      return;
    }
  }
  onHotspotClick(hotspot);
}
