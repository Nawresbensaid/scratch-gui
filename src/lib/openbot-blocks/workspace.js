/**
 * workspace.js — version simplifiée pour scratch-gui
 * On garde seulement filterLabels() et filterModels()
 * Supprime toutes les dépendances Google Drive / Firebase / API
 */

// Labels des objets détectables par l'IA OpenBot
const Labels = [
    "person", "bicycle", "car", "motorcycle", "airplane", "bus", "train",
    "truck", "boat", "traffic light", "fire hydrant", "stop sign",
    "parking meter", "bench", "bird", "cat", "dog", "horse", "sheep",
    "cow", "elephant", "bear", "zebra", "giraffe", "backpack", "umbrella",
    "handbag", "tie", "suitcase", "frisbee", "skis", "snowboard",
    "sports ball", "kite", "baseball bat", "baseball glove", "skateboard",
    "surfboard", "tennis racket", "bottle", "wine glass", "cup", "fork",
    "knife", "spoon", "bowl", "banana", "apple", "sandwich", "orange",
    "broccoli", "carrot", "hot dog", "pizza", "donut", "cake", "chair",
    "couch", "potted plant", "bed", "dining table", "toilet", "tv",
    "laptop", "mouse", "remote", "keyboard", "cell phone", "microwave",
    "oven", "toaster", "sink", "refrigerator", "book", "clock", "vase",
    "scissors", "teddy bear", "hair drier", "toothbrush"
];

// Modèles IA disponibles par défaut
const defaultModels = [
    { name: "MobileNetV1-300", type: "DETECTOR", pathType: "ASSET" },
    { name: "MobileNetV3-320", type: "DETECTOR", pathType: "ASSET" },
    { name: "CIL-Mobile-Cmd", type: "CMDNAV", pathType: "ASSET" },
    { name: "PilotNet-Goal", type: "GOALNAV", pathType: "ASSET" },
    { name: "PilotNet-Cmd", type: "AUTOPILOT", pathType: "ASSET" },
];

/**
 * Retourne la liste des labels pour les blocs IA
 * @returns {[string, string][]}
 */
export function filterLabels() {
    return Labels.map((item) => [item, item]);
}

/**
 * Retourne la liste des modèles filtrés par type
 * @param {string[]} modelType - types à inclure ex: ["DETECTOR"]
 * @param {string} assetType  - type d'asset ex: "DETECTOR"
 * @returns {[string, string][] | null}
 */
export function filterModels(modelType, assetType) {
    const data = defaultModels.filter(obj =>
        modelType.includes(obj.type) && obj.pathType === "ASSET" && obj.type === assetType
    );
    if (!data || data.length === 0) return null;
    return data.map(item => [item.name, item.name]);
}