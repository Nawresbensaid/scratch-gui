/**
 * OpenBot Blocks — Point d'entrée
 * Import ce fichier dans gui.jsx pour charger tous les blocs
 */
import './customblocks.js';

export const OPENBOT_BLOCK_NAMES = [
    // Contrôle
    'start', 'forever', 'wait', 'display_string', 'display_sensors',
    // Mouvement
    'forwardBackward', 'leftRight', 'setMotors', 'movementStop',
    // Capteurs
    'sonarReading', 'speedReading', 'voltageDivider',
    'gyroscopeReading', 'accelerationReading', 'magneticReading', 'wheelOdometer',
    // Son
    'inputSound', 'soundType', 'soundMode',
    // Vitesse / Mode
    'speedControl', 'driveModeControls',
    // LED
    'brightness', 'ledOnOff', 'indicators',
    // IA
    'objectTracking', 'autopilot', 'navigateForwardAndLeft', 'disableAI'
];

export const OPENBOT_TOOLBOX_CATEGORIES = `
<category name="🤖 Contrôle" colour="#4860b7" secondaryColour="#3a4f9e">
  <block type="start"></block>
  <block type="forever"></block>
  <block type="wait"><field name="time">3000</field></block>
  <block type="display_string"><field name="text">Hello</field></block>
  <block type="display_sensors"></block>
</category>
<category name="🚗 Mouvement" colour="#d56235" secondaryColour="#b84e1f">
  <block type="forwardBackward"><field name="direction_type">moveForward</field><field name="slider">192</field></block>
  <block type="leftRight"><field name="direction_type">moveLeft</field><field name="slider">192</field></block>
  <block type="setMotors"><field name="left_distance">192</field><field name="right_distance">192</field></block>
  <block type="movementStop"></block>
</category>
<category name="📡 Capteurs" colour="#49a2a5" secondaryColour="#3a8c8e">
  <block type="sonarReading"></block>
  <block type="speedReading"></block>
  <block type="voltageDivider"></block>
  <block type="gyroscopeReading"></block>
  <block type="accelerationReading"></block>
  <block type="magneticReading"></block>
  <block type="wheelOdometer"></block>
</category>
<category name="🔊 Son" colour="#709662" secondaryColour="#5a7a4e">
  <block type="inputSound"><field name="text">move straight</field></block>
  <block type="soundType"></block>
  <block type="soundMode"></block>
</category>
<category name="💡 LED" colour="#687c9e" secondaryColour="#546680">
  <block type="brightness"><field name="slider">50</field></block>
  <block type="ledOnOff"></block>
  <block type="indicators"></block>
</category>
<category name="🏎️ Vitesse" colour="#bf778b" secondaryColour="#a06070">
  <block type="speedControl"></block>
  <block type="driveModeControls"></block>
</category>
<category name="🧠 IA" colour="#458ff7" secondaryColour="#3070d0">
  <block type="objectTracking"></block>
  <block type="autopilot"></block>
  <block type="navigateForwardAndLeft"></block>
  <block type="disableAI"></block>
</category>`;