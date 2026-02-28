/**
 * images.js — version simplifiée pour scratch-gui
 * On garde seulement les icônes utilisées dans customblocks.js
 * Les autres images OpenBot ne sont pas nécessaires
 */

// Icônes utilisées dans les blocs driveModeControls et controllerMode
// Encodées en base64 SVG pour éviter les dépendances sur des fichiers PNG externes

const gameIcon = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'><rect x='2' y='6' width='20' height='12' rx='3' fill='%23555'/><circle cx='8' cy='12' r='2' fill='white'/><rect x='14' y='10' width='2' height='4' fill='white'/><rect x='13' y='11' width='4' height='2' fill='white'/></svg>`;

const joystickIcon = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'><circle cx='12' cy='18' r='4' fill='%23555'/><rect x='11' y='4' width='2' height='10' fill='%23555'/><circle cx='12' cy='4' r='3' fill='%23888'/></svg>`;

const dualDriveIcon = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'><rect x='2' y='8' width='6' height='8' rx='1' fill='%23555'/><rect x='16' y='8' width='6' height='8' rx='1' fill='%23555'/><path d='M8 12 L16 12' stroke='white' stroke-width='1.5'/></svg>`;

const gamepadIcon = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><rect x='3' y='7' width='18' height='10' rx='4' fill='%23555'/><rect x='6' y='11' width='4' height='2' fill='white'/><rect x='7' y='10' width='2' height='4' fill='white'/><circle cx='16' cy='11' r='1.2' fill='white'/><circle cx='14' cy='13' r='1.2' fill='white'/></svg>`;

const phoneIcon = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><rect x='7' y='2' width='10' height='20' rx='2' fill='%23555'/><circle cx='12' cy='19' r='1' fill='white'/><rect x='9' y='4' width='6' height='1' rx='0.5' fill='white'/></svg>`;

export const Images = {
    gameIcon,
    joystickIcon,
    dualDriveIcon,
    gamepadIcon,
    phoneIcon,
};