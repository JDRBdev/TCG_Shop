// utils/getRarityColor.ts
export function getRarityColor(rarity: "common" | "rare" | "epic" | "legendary"): string {
  switch (rarity) {
    case "common":
      return "border-gray-300 text-gray-800 bg-gray-100";
    case "rare":
      return "border-blue-300 text-blue-800 bg-blue-100";
    case "epic":
      return "border-purple-300 text-purple-800 bg-purple-100";
    case "legendary":
      return "border-yellow-300 text-yellow-800 bg-yellow-100";
    default:
      return "border-gray-300 text-gray-800 bg-gray-100";
  }
}
