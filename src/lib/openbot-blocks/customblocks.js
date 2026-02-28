/**
 * OpenBot Blocks — adapté depuis open-code officiel
 * Blockly → ScratchBlocks
 */

// Compatibilité : ScratchBlocks ou window.Blockly
const B = (typeof ScratchBlocks !== 'undefined' ? ScratchBlocks : window.Blockly);

const CM = '#d56235', CS = '#ca3143', CN = '#49a2a5',
    CSN = '#709662', CL = '#687c9e', CB = '#bf778b',
    CA = '#458ff7', CC = '#4860b7';

// ── Contrôle ──
B.Blocks['start'] = {
    init() {
        this.jsonInit({
            message0: '▶ start %1',
            args0: [{ type: 'input_statement', name: 'start_blocks' }],
            colour: CC
        });
    }
};

B.Blocks['forever'] = {
    init() {
        this.jsonInit({
            message0: '🔁 forever %1',
            args0: [{ type: 'input_statement', name: 'forever_loop_blocks' }],
            colour: CC
        });
    }
};

B.Blocks['wait'] = {
    init() {
        this.jsonInit({
            message0: '⏱ wait for %1 ms',
            args0: [{ type: 'field_number', name: 'time', value: 3000, min: 0 }],
            previousStatement: null, nextStatement: null, colour: CC
        });
    }
};

B.Blocks['display_string'] = {
    init() {
        this.jsonInit({
            message0: '💬 display string %1',
            args0: [{ type: 'field_input', name: 'text', text: 'Hello' }],
            previousStatement: null, nextStatement: null, colour: CC
        });
    }
};

B.Blocks['display_sensors'] = {
    init() {
        this.jsonInit({
            message0: '📊 display sensor data',
            previousStatement: null, nextStatement: null, colour: CC
        });
    }
};

// ── Mouvement ──
B.Blocks['forwardBackward'] = {
    init() {
        this.jsonInit({
            message0: '🚗 move %1 at speed %2',
            args0: [
                { type: 'field_dropdown', name: 'direction_type', options: [['forward', 'moveForward'], ['backward', 'moveBackward']] },
                { type: 'field_number', name: 'slider', value: 192, min: 0, max: 255 }
            ],
            previousStatement: null, nextStatement: null, colour: CM
        });
    }
};

B.Blocks['leftRight'] = {
    init() {
        this.jsonInit({
            message0: '↔️ move %1 at speed %2',
            args0: [
                { type: 'field_dropdown', name: 'direction_type', options: [['left', 'moveLeft'], ['right', 'moveRight']] },
                { type: 'field_number', name: 'slider', value: 192, min: 0, max: 255 }
            ],
            previousStatement: null, nextStatement: null, colour: CM
        });
    }
};

B.Blocks['setMotors'] = {
    init() {
        this.jsonInit({
            message0: '⚙️ left at %1 and right at %2',
            args0: [
                { type: 'field_number', name: 'left_distance', value: 192, min: -255, max: 255 },
                { type: 'field_number', name: 'right_distance', value: 192, min: -255, max: 255 }
            ],
            previousStatement: null, nextStatement: null, colour: CM
        });
    }
};

B.Blocks['movementStop'] = {
    init() {
        this.jsonInit({
            message0: '🛑 stop car immediately',
            previousStatement: null, nextStatement: null, colour: CS
        });
    }
};

// ── Capteurs ──
B.Blocks['sonarReading'] = {
    init() {
        this.jsonInit({
            message0: '📡 sonar reading', output: 'Number', colour: CN
        });
    }
};

B.Blocks['speedReading'] = {
    init() {
        this.jsonInit({
            message0: '💨 speed reading', output: 'Number', colour: CN
        });
    }
};

B.Blocks['voltageDivider'] = {
    init() {
        this.jsonInit({
            message0: '🔋 voltage divider reading', output: 'Number', colour: CN
        });
    }
};

B.Blocks['gyroscopeReading'] = {
    init() {
        this.jsonInit({
            message0: '🌀 gyroscope reading %1',
            args0: [{ type: 'field_dropdown', name: 'axis', options: [['x axis', 'x'], ['y axis', 'y'], ['z axis', 'z']] }],
            output: 'Number', colour: CN
        });
    }
};

B.Blocks['accelerationReading'] = {
    init() {
        this.jsonInit({
            message0: '📈 acceleration reading %1',
            args0: [{ type: 'field_dropdown', name: 'axis', options: [['x axis', 'x'], ['y axis', 'y'], ['z axis', 'z']] }],
            output: 'Number', colour: CN
        });
    }
};

B.Blocks['magneticReading'] = {
    init() {
        this.jsonInit({
            message0: '🧲 magnetic reading %1',
            args0: [{ type: 'field_dropdown', name: 'axis', options: [['x axis', 'x'], ['y axis', 'y'], ['z axis', 'z']] }],
            output: 'Number', colour: CN
        });
    }
};

B.Blocks['wheelOdometer'] = {
    init() {
        this.jsonInit({
            message0: '🛞 wheel odometry %1',
            args0: [{ type: 'field_dropdown', name: 'wheel_sensors', options: [['Front', 'frontWheelReading'], ['Back', 'backWheelReading']] }],
            output: 'Number', colour: CN
        });
    }
};

// ── Son ──
B.Blocks['inputSound'] = {
    init() {
        this.jsonInit({
            message0: '🔊 play sound %1',
            args0: [{ type: 'field_input', name: 'text', text: 'move straight' }],
            previousStatement: null, nextStatement: null, colour: CSN
        });
    }
};

B.Blocks['soundType'] = {
    init() {
        this.jsonInit({
            message0: '🔉 play sound %1 speed',
            args0: [{ type: 'field_dropdown', name: 'type', options: [['slow', 'slow'], ['medium', 'medium'], ['fast', 'fast']] }],
            previousStatement: null, nextStatement: null, colour: CSN
        });
    }
};

B.Blocks['soundMode'] = {
    init() {
        this.jsonInit({
            message0: '🔈 play sound %1 mode',
            args0: [{ type: 'field_dropdown', name: 'mode_type', options: [['dual drive', 'dual drive'], ['joystick', 'joystick control'], ['gamepad', 'gamepad']] }],
            previousStatement: null, nextStatement: null, colour: CSN
        });
    }
};

// ── Vitesse / Mode ──
B.Blocks['speedControl'] = {
    init() {
        this.jsonInit({
            message0: '🏎️ set speed limit to %1',
            args0: [{ type: 'field_dropdown', name: 'type', options: [['slow', "'slow'"], ['medium', "'medium'"], ['fast', "'fast'"]] }],
            previousStatement: null, nextStatement: null, colour: CB
        });
    }
};

B.Blocks['driveModeControls'] = {
    init() {
        this.jsonInit({
            message0: '🕹️ switch drive mode to %1',
            args0: [{ type: 'field_dropdown', name: 'controller', options: [['dual drive', "'dualDrive'"], ['joystick', "'joystick'"], ['game', "'game'"]] }],
            previousStatement: null, nextStatement: null, colour: CB
        });
    }
};

// ── LED ──
B.Blocks['brightness'] = {
    init() {
        this.jsonInit({
            message0: '💡 set LED brightness %1',
            args0: [{ type: 'field_number', name: 'slider', value: 50, min: 0, max: 100 }],
            previousStatement: null, nextStatement: null, colour: CL
        });
    }
};

B.Blocks['ledOnOff'] = {
    init() {
        this.jsonInit({
            message0: '💡 turn LED brightness %1',
            args0: [{ type: 'field_dropdown', name: 'TOGGLE_STATE', options: [['ON', 'on'], ['OFF', 'off']] }],
            previousStatement: null, nextStatement: null, colour: CL
        });
    }
};

B.Blocks['indicators'] = {
    init() {
        this.jsonInit({
            message0: '🔦 turn %1 indicator %2',
            args0: [
                { type: 'field_dropdown', name: 'side', options: [['left', 'left'], ['right', 'right']] },
                { type: 'field_dropdown', name: 'TOGGLE_STATE', options: [['ON', 'on'], ['OFF', 'off']] }
            ],
            previousStatement: null, nextStatement: null, colour: CL
        });
    }
};

// ── IA ──
B.Blocks['objectTracking'] = {
    init() {
        this.jsonInit({
            message0: '🧍 follow a %1',
            args0: [{ type: 'field_dropdown', name: 'class', options: [['person', 'person'], ['car', 'car'], ['dog', 'dog'], ['cat', 'cat'], ['bicycle', 'bicycle']] }],
            previousStatement: null, nextStatement: null, colour: CA
        });
    }
};

B.Blocks['autopilot'] = {
    init() {
        this.jsonInit({
            message0: '🧠 enable autopilot',
            previousStatement: null, nextStatement: null, colour: CA
        });
    }
};

B.Blocks['navigateForwardAndLeft'] = {
    init() {
        this.jsonInit({
            message0: '🗺️ move forward %1 cm and left %2 cm',
            args0: [
                { type: 'field_number', name: 'forward', value: 0 },
                { type: 'field_number', name: 'left', value: 0 }
            ],
            previousStatement: null, nextStatement: null, colour: CA
        });
    }
};

B.Blocks['disableAI'] = {
    init() {
        this.jsonInit({
            message0: '⛔ disable AI',
            previousStatement: null, nextStatement: null, colour: CS
        });
    }
};

console.log('[OpenBot] customblocks.js chargé ✅');