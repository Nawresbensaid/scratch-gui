/**
 * BlocklyEditor.jsx
 * Composant React qui remplace <Blocks> de Scratch par Blockly pur
 * Utilise les vrais blocs OpenBot depuis open-code
 */

import React, { useEffect, useRef } from 'react';
import * as Blockly from 'blockly';
import 'blockly/blocks';
// Exposer Blockly globalement pour que customblocks.js utilise la même instance
if (typeof window !== 'undefined') window.Blockly = Blockly;

// ── Couleurs officielles OpenBot ──
const CM = '#d56235', CS = '#ca3143', CN = '#49a2a5',
    CSN = '#709662', CL = '#687c9e', CB = '#bf778b',
    CA = '#458ff7', CC = '#4860b7';

// ── Définir les blocs OpenBot (depuis customblocks.js officiel) ──
const defineBlocks = () => {
    // Utiliser window.Blockly pour s'assurer d'une seule instance
    const B = window.Blockly || Blockly;
    if (B.Blocks['start']) return; // déjà défini

    B.Blocks['start'] = { init() { this.jsonInit({ message0: '▶ start %1', args0: [{ type: 'input_statement', name: 'start_blocks' }], colour: CC }); } };
    B.Blocks['forever'] = { init() { this.jsonInit({ message0: '🔁 forever %1', args0: [{ type: 'input_statement', name: 'forever_loop_blocks' }], colour: CC }); } };
    B.Blocks['wait'] = { init() { this.jsonInit({ message0: '⏱ wait for %1 ms', args0: [{ type: 'field_number', name: 'time', value: 3000, min: 0 }], previousStatement: null, nextStatement: null, colour: CC }); } };
    B.Blocks['display_string'] = { init() { this.jsonInit({ message0: '💬 display string %1', args0: [{ type: 'field_input', name: 'text', text: 'Hello' }], previousStatement: null, nextStatement: null, colour: CC }); } };
    B.Blocks['display_sensors'] = { init() { this.jsonInit({ message0: '📊 display sensor data', previousStatement: null, nextStatement: null, colour: CC }); } };

    B.Blocks['forwardBackward'] = { init() { this.jsonInit({ message0: '🚗 move %1 at speed %2', args0: [{ type: 'field_dropdown', name: 'direction_type', options: [['forward', 'moveForward'], ['backward', 'moveBackward']] }, { type: 'field_number', name: 'slider', value: 192, min: 0, max: 255 }], previousStatement: null, nextStatement: null, colour: CM }); } };
    B.Blocks['leftRight'] = { init() { this.jsonInit({ message0: '↔️ move %1 at speed %2', args0: [{ type: 'field_dropdown', name: 'direction_type', options: [['left', 'moveLeft'], ['right', 'moveRight']] }, { type: 'field_number', name: 'slider', value: 192, min: 0, max: 255 }], previousStatement: null, nextStatement: null, colour: CM }); } };
    B.Blocks['setMotors'] = { init() { this.jsonInit({ message0: '⚙️ left at %1 and right at %2', args0: [{ type: 'field_number', name: 'left_distance', value: 192, min: -255, max: 255 }, { type: 'field_number', name: 'right_distance', value: 192, min: -255, max: 255 }], previousStatement: null, nextStatement: null, colour: CM }); } };
    B.Blocks['movementStop'] = { init() { this.jsonInit({ message0: '🛑 stop car immediately', previousStatement: null, nextStatement: null, colour: CS }); } };

    B.Blocks['sonarReading'] = { init() { this.jsonInit({ message0: '📡 sonar reading', output: 'Number', colour: CN }); } };
    B.Blocks['speedReading'] = { init() { this.jsonInit({ message0: '💨 speed reading', output: 'Number', colour: CN }); } };
    B.Blocks['voltageDivider'] = { init() { this.jsonInit({ message0: '🔋 voltage divider', output: 'Number', colour: CN }); } };
    B.Blocks['gyroscopeReading'] = { init() { this.jsonInit({ message0: '🌀 gyroscope %1', args0: [{ type: 'field_dropdown', name: 'axis', options: [['x', 'x'], ['y', 'y'], ['z', 'z']] }], output: 'Number', colour: CN }); } };
    B.Blocks['accelerationReading'] = { init() { this.jsonInit({ message0: '📈 acceleration %1', args0: [{ type: 'field_dropdown', name: 'axis', options: [['x', 'x'], ['y', 'y'], ['z', 'z']] }], output: 'Number', colour: CN }); } };
    B.Blocks['magneticReading'] = { init() { this.jsonInit({ message0: '🧲 magnetic %1', args0: [{ type: 'field_dropdown', name: 'axis', options: [['x', 'x'], ['y', 'y'], ['z', 'z']] }], output: 'Number', colour: CN }); } };
    B.Blocks['wheelOdometer'] = { init() { this.jsonInit({ message0: '🛞 wheel odometry %1', args0: [{ type: 'field_dropdown', name: 'wheel_sensors', options: [['Front', 'frontWheelReading'], ['Back', 'backWheelReading']] }], output: 'Number', colour: CN }); } };

    B.Blocks['inputSound'] = { init() { this.jsonInit({ message0: '🔊 play sound %1', args0: [{ type: 'field_input', name: 'text', text: 'move straight' }], previousStatement: null, nextStatement: null, colour: CSN }); } };
    B.Blocks['soundType'] = { init() { this.jsonInit({ message0: '🔉 play %1 speed', args0: [{ type: 'field_dropdown', name: 'type', options: [['slow', 'slow'], ['medium', 'medium'], ['fast', 'fast']] }], previousStatement: null, nextStatement: null, colour: CSN }); } };
    B.Blocks['soundMode'] = { init() { this.jsonInit({ message0: '🔈 play %1 mode', args0: [{ type: 'field_dropdown', name: 'mode_type', options: [['dual drive', 'dual drive'], ['joystick', 'joystick'], ['gamepad', 'gamepad']] }], previousStatement: null, nextStatement: null, colour: CSN }); } };

    B.Blocks['speedControl'] = { init() { this.jsonInit({ message0: '🏎️ speed limit %1', args0: [{ type: 'field_dropdown', name: 'type', options: [['slow', "'slow'"], ['medium', "'medium'"], ['fast', "'fast'"]] }], previousStatement: null, nextStatement: null, colour: CB }); } };
    B.Blocks['driveModeControls'] = { init() { this.jsonInit({ message0: '🕹️ drive mode %1', args0: [{ type: 'field_dropdown', name: 'controller', options: [['dual drive', "'dualDrive'"], ['joystick', "'joystick'"], ['game', "'game'"]] }], previousStatement: null, nextStatement: null, colour: CB }); } };

    B.Blocks['brightness'] = { init() { this.jsonInit({ message0: '💡 LED brightness %1', args0: [{ type: 'field_number', name: 'slider', value: 50, min: 0, max: 100 }], previousStatement: null, nextStatement: null, colour: CL }); } };
    B.Blocks['ledOnOff'] = { init() { this.jsonInit({ message0: '💡 LED %1', args0: [{ type: 'field_dropdown', name: 'TOGGLE_STATE', options: [['ON', 'on'], ['OFF', 'off']] }], previousStatement: null, nextStatement: null, colour: CL }); } };
    B.Blocks['indicators'] = { init() { this.jsonInit({ message0: '🔦 %1 indicator %2', args0: [{ type: 'field_dropdown', name: 'side', options: [['left', 'left'], ['right', 'right']] }, { type: 'field_dropdown', name: 'TOGGLE_STATE', options: [['ON', 'on'], ['OFF', 'off']] }], previousStatement: null, nextStatement: null, colour: CL }); } };

    B.Blocks['objectTracking'] = { init() { this.jsonInit({ message0: '🧍 follow %1', args0: [{ type: 'field_dropdown', name: 'class', options: [['person', 'person'], ['car', 'car'], ['dog', 'dog'], ['cat', 'cat'], ['bicycle', 'bicycle']] }], previousStatement: null, nextStatement: null, colour: CA }); } };
    B.Blocks['autopilot'] = { init() { this.jsonInit({ message0: '🧠 enable autopilot', previousStatement: null, nextStatement: null, colour: CA }); } };
    B.Blocks['navigateForwardAndLeft'] = { init() { this.jsonInit({ message0: '🗺️ navigate forward %1 cm left %2 cm', args0: [{ type: 'field_number', name: 'forward', value: 0 }, { type: 'field_number', name: 'left', value: 0 }], previousStatement: null, nextStatement: null, colour: CA }); } };
    B.Blocks['disableAI'] = { init() { this.jsonInit({ message0: '⛔ disable AI', previousStatement: null, nextStatement: null, colour: CS }); } };

    console.log('[BlocklyEditor] Blocs définis ✅');
};

// ── Toolbox complète ──
const TOOLBOX = {
    kind: 'categoryToolbox',
    contents: [
        // ── OpenBot ──
        {
            kind: 'category', name: '🤖 Control', colour: CC,
            contents: [
                { kind: 'block', type: 'start' },
                { kind: 'block', type: 'forever' },
                { kind: 'block', type: 'wait', fields: { time: 3000 } },
                { kind: 'block', type: 'display_string', fields: { text: 'Hello' } },
                { kind: 'block', type: 'display_sensors' },
            ]
        },
        {
            kind: 'category', name: '🚗 Movement', colour: CM,
            contents: [
                { kind: 'block', type: 'forwardBackward', fields: { direction_type: 'moveForward', slider: 192 } },
                { kind: 'block', type: 'leftRight', fields: { direction_type: 'moveLeft', slider: 192 } },
                { kind: 'block', type: 'setMotors', fields: { left_distance: 192, right_distance: 192 } },
                { kind: 'block', type: 'movementStop' },
            ]
        },
        {
            kind: 'category', name: '📡 Sensors', colour: CN,
            contents: [
                { kind: 'block', type: 'sonarReading' },
                { kind: 'block', type: 'speedReading' },
                { kind: 'block', type: 'voltageDivider' },
                { kind: 'block', type: 'gyroscopeReading' },
                { kind: 'block', type: 'accelerationReading' },
                { kind: 'block', type: 'magneticReading' },
                { kind: 'block', type: 'wheelOdometer' },
            ]
        },
        {
            kind: 'category', name: '🔊 Sound', colour: CSN,
            contents: [
                { kind: 'block', type: 'inputSound', fields: { text: 'move straight' } },
                { kind: 'block', type: 'soundType' },
                { kind: 'block', type: 'soundMode' },
            ]
        },
        {
            kind: 'category', name: '💡 LED', colour: CL,
            contents: [
                { kind: 'block', type: 'brightness', fields: { slider: 50 } },
                { kind: 'block', type: 'ledOnOff' },
                { kind: 'block', type: 'indicators' },
            ]
        },
        {
            kind: 'category', name: '🏎️ Speed', colour: CB,
            contents: [
                { kind: 'block', type: 'speedControl' },
                { kind: 'block', type: 'driveModeControls' },
            ]
        },
        {
            kind: 'category', name: '🧠 AI', colour: CA,
            contents: [
                { kind: 'block', type: 'objectTracking' },
                { kind: 'block', type: 'autopilot' },
                { kind: 'block', type: 'navigateForwardAndLeft' },
                { kind: 'block', type: 'disableAI' },
            ]
        },
        { kind: 'sep' },
        // ── Blockly Standard ──
        {
            kind: 'category', name: '🔁 Loops', colour: '#5ba55b',
            contents: [
                {
                    kind: 'block', type: 'controls_repeat_ext',
                    inputs: { TIMES: { shadow: { type: 'math_number', fields: { NUM: 10 } } } }
                },
                { kind: 'block', type: 'controls_whileUntil' },
                {
                    kind: 'block', type: 'controls_for',
                    inputs: {
                        FROM: { shadow: { type: 'math_number', fields: { NUM: 1 } } },
                        TO: { shadow: { type: 'math_number', fields: { NUM: 10 } } },
                        BY: { shadow: { type: 'math_number', fields: { NUM: 1 } } },
                    }
                },
                { kind: 'block', type: 'controls_forEach' },
                { kind: 'block', type: 'controls_flow_statements' },
            ]
        },
        {
            kind: 'category', name: '❓ Logic', colour: '#5b80a5',
            contents: [
                { kind: 'block', type: 'controls_if' },
                { kind: 'block', type: 'controls_ifelse' },
                { kind: 'block', type: 'logic_compare' },
                { kind: 'block', type: 'logic_operation' },
                { kind: 'block', type: 'logic_negate' },
                { kind: 'block', type: 'logic_boolean' },
                { kind: 'block', type: 'logic_null' },
                { kind: 'block', type: 'logic_ternary' },
            ]
        },
        {
            kind: 'category', name: '🔢 Math', colour: '#5b67a5',
            contents: [
                { kind: 'block', type: 'math_number', fields: { NUM: 0 } },
                {
                    kind: 'block', type: 'math_arithmetic',
                    inputs: {
                        A: { shadow: { type: 'math_number', fields: { NUM: 1 } } },
                        B: { shadow: { type: 'math_number', fields: { NUM: 1 } } },
                    }
                },
                {
                    kind: 'block', type: 'math_single',
                    inputs: { NUM: { shadow: { type: 'math_number', fields: { NUM: 9 } } } }
                },
                {
                    kind: 'block', type: 'math_trig',
                    inputs: { NUM: { shadow: { type: 'math_number', fields: { NUM: 45 } } } }
                },
                { kind: 'block', type: 'math_constant' },
                {
                    kind: 'block', type: 'math_number_property',
                    inputs: { NUMBER_TO_CHECK: { shadow: { type: 'math_number', fields: { NUM: 0 } } } }
                },
                {
                    kind: 'block', type: 'math_round',
                    inputs: { NUM: { shadow: { type: 'math_number', fields: { NUM: 3.1 } } } }
                },
                {
                    kind: 'block', type: 'math_random_int',
                    inputs: {
                        FROM: { shadow: { type: 'math_number', fields: { NUM: 1 } } },
                        TO: { shadow: { type: 'math_number', fields: { NUM: 100 } } },
                    }
                },
                {
                    kind: 'block', type: 'math_constrain',
                    inputs: {
                        VALUE: { shadow: { type: 'math_number', fields: { NUM: 50 } } },
                        LOW: { shadow: { type: 'math_number', fields: { NUM: 1 } } },
                        HIGH: { shadow: { type: 'math_number', fields: { NUM: 100 } } },
                    }
                },
            ]
        },
        {
            kind: 'category', name: '📝 Text', colour: '#5ba58c',
            contents: [
                { kind: 'block', type: 'text', fields: { TEXT: '' } },
                { kind: 'block', type: 'text_join' },
                {
                    kind: 'block', type: 'text_append',
                    inputs: { TEXT: { shadow: { type: 'text', fields: { TEXT: '' } } } }
                },
                {
                    kind: 'block', type: 'text_length',
                    inputs: { VALUE: { shadow: { type: 'text', fields: { TEXT: 'abc' } } } }
                },
                {
                    kind: 'block', type: 'text_isEmpty',
                    inputs: { VALUE: { shadow: { type: 'text', fields: { TEXT: '' } } } }
                },
                {
                    kind: 'block', type: 'text_indexOf',
                    inputs: {
                        VALUE: { shadow: { type: 'text', fields: { TEXT: 'abc' } } },
                        FIND: { shadow: { type: 'text', fields: { TEXT: 'b' } } },
                    }
                },
                {
                    kind: 'block', type: 'text_charAt',
                    inputs: { VALUE: { shadow: { type: 'text', fields: { TEXT: 'abc' } } } }
                },
                {
                    kind: 'block', type: 'text_getSubstring',
                    inputs: { STRING: { shadow: { type: 'text', fields: { TEXT: 'abc' } } } }
                },
                {
                    kind: 'block', type: 'text_changeCase',
                    inputs: { TEXT: { shadow: { type: 'text', fields: { TEXT: 'abc' } } } }
                },
                {
                    kind: 'block', type: 'text_trim',
                    inputs: { TEXT: { shadow: { type: 'text', fields: { TEXT: 'abc' } } } }
                },
                {
                    kind: 'block', type: 'text_print',
                    inputs: { TEXT: { shadow: { type: 'text', fields: { TEXT: 'abc' } } } }
                },
            ]
        },
        {
            kind: 'category', name: '📋 Lists', colour: '#745ba5',
            contents: [
                { kind: 'block', type: 'lists_create_empty' },
                { kind: 'block', type: 'lists_create_with' },
                {
                    kind: 'block', type: 'lists_repeat',
                    inputs: { NUM: { shadow: { type: 'math_number', fields: { NUM: 5 } } } }
                },
                { kind: 'block', type: 'lists_length' },
                { kind: 'block', type: 'lists_isEmpty' },
                { kind: 'block', type: 'lists_indexOf' },
                { kind: 'block', type: 'lists_getIndex' },
                { kind: 'block', type: 'lists_setIndex' },
            ]
        },
        {
            kind: 'category', name: '📦 Variables', colour: '#a55b80',
            custom: 'VARIABLE',
        },
        {
            kind: 'category', name: '⚙️ Functions', colour: '#9a5ba5',
            custom: 'PROCEDURE',
        },
    ]
};

// ── Convertir blocs → Python ──
const blocksToPython = (workspace) => {
    const lines = ['# Code Python généré depuis les blocs OpenBot', ''];
    const topBlocks = workspace.getTopBlocks(true);
    if (!topBlocks.length) return null;

    const blockToCode = (block, indent) => {
        if (!block) return '';
        const pad = '    '.repeat(indent);
        const NL = '\n';
        let code = '';

        const f = (name) => {
            const field = block.getField(name);
            return field ? field.getValue() : '0';
        };

        const sub = (name) => {
            const subBlock = block.getInputTargetBlock(name);
            if (!subBlock) return `${pad}    pass`;
            return blockToCode(subBlock, indent + 1);
        };

        switch (block.type) {
            case 'start':
                code = `def programme_principal():${NL}${sub('start_blocks')}`;
                break;
            case 'forever':
                code = `${pad}while True:${NL}${sub('forever_loop_blocks')}`;
                break;
            case 'wait':
                code = `${pad}robot.wait(ms=${f('time')})`;
                break;
            case 'display_string':
                code = `${pad}robot.display("${f('text')}")`;
                break;
            case 'display_sensors':
                code = `${pad}robot.display_sensors()`;
                break;
            case 'forwardBackward':
                code = f('direction_type') === 'moveForward'
                    ? `${pad}robot.move_forward(speed=${f('slider')})`
                    : `${pad}robot.move_backward(speed=${f('slider')})`;
                break;
            case 'leftRight':
                code = f('direction_type') === 'moveLeft'
                    ? `${pad}robot.turn_left(speed=${f('slider')})`
                    : `${pad}robot.turn_right(speed=${f('slider')})`;
                break;
            case 'setMotors':
                code = `${pad}robot.set_motors(left=${f('left_distance')}, right=${f('right_distance')})`;
                break;
            case 'movementStop':
                code = `${pad}robot.stop()`;
                break;
            case 'sonarReading': code = `${pad}robot.sonar()`; break;
            case 'speedReading': code = `${pad}robot.speed()`; break;
            case 'voltageDivider': code = `${pad}robot.voltage()`; break;
            case 'gyroscopeReading': code = `${pad}robot.gyroscope("${f('axis')}")`; break;
            case 'accelerationReading': code = `${pad}robot.acceleration("${f('axis')}")`; break;
            case 'magneticReading': code = `${pad}robot.magnetic("${f('axis')}")`; break;
            case 'wheelOdometer': code = `${pad}robot.wheel_odometry("${f('wheel_sensors')}")`; break;
            case 'inputSound': code = `${pad}robot.play_sound(text="${f('text')}")`; break;
            case 'soundType': code = `${pad}robot.play_sound(speed="${f('type')}")`; break;
            case 'soundMode': code = `${pad}robot.play_sound(mode="${f('mode_type')}")`; break;
            case 'speedControl': code = `${pad}robot.set_speed("${f('type')}")`; break;
            case 'driveModeControls': code = `${pad}robot.set_drive_mode("${f('controller')}")`; break;
            case 'brightness': code = `${pad}robot.set_brightness(${f('slider')})`; break;
            case 'ledOnOff': code = `${pad}robot.led("${f('TOGGLE_STATE')}")`; break;
            case 'indicators': code = `${pad}robot.indicator(side="${f('side')}", state="${f('TOGGLE_STATE')}")`; break;
            case 'objectTracking': code = `${pad}robot.follow("${f('class')}")`; break;
            case 'autopilot': code = `${pad}robot.autopilot()`; break;
            case 'navigateForwardAndLeft': code = `${pad}robot.navigate(forward=${f('forward')}, left=${f('left')})`; break;
            case 'disableAI': code = `${pad}robot.disable_ai()`; break;
            // ── Loops ──
            case 'controls_repeat_ext': {
                const times = blockToCode(block.getInputTargetBlock('TIMES'), 0) || field('TIMES') || '10';
                const body = block.getInputTargetBlock('DO') ? blockToCode(block.getInputTargetBlock('DO'), indent + 1) : `${'    '.repeat(indent + 1)}pass`;
                code = `${pad}for _ in range(${times.trim()}):\n${body}`;
                break;
            }
            case 'controls_whileUntil': {
                const cond = block.getInputTargetBlock('BOOL') ? blockToCode(block.getInputTargetBlock('BOOL'), 0).trim() : 'True';
                const body = block.getInputTargetBlock('DO') ? blockToCode(block.getInputTargetBlock('DO'), indent + 1) : `${'    '.repeat(indent + 1)}pass`;
                const mode = f('MODE') === 'UNTIL' ? `not (${cond})` : cond;
                code = `${pad}while ${mode}:\n${body}`;
                break;
            }
            case 'controls_for': {
                const varName = f('VAR') || 'i';
                const from_ = block.getInputTargetBlock('FROM') ? blockToCode(block.getInputTargetBlock('FROM'), 0).trim() : '1';
                const to_ = block.getInputTargetBlock('TO') ? blockToCode(block.getInputTargetBlock('TO'), 0).trim() : '10';
                const by_ = block.getInputTargetBlock('BY') ? blockToCode(block.getInputTargetBlock('BY'), 0).trim() : '1';
                const body = block.getInputTargetBlock('DO') ? blockToCode(block.getInputTargetBlock('DO'), indent + 1) : `${'    '.repeat(indent + 1)}pass`;
                code = `${pad}for ${varName} in range(${from_}, ${to_}, ${by_}):\n${body}`;
                break;
            }
            case 'controls_flow_statements':
                code = f('FLOW') === 'BREAK' ? `${pad}break` : `${pad}continue`;
                break;
            // ── Logic ──
            case 'controls_if': {
                const cond = block.getInputTargetBlock('IF0') ? blockToCode(block.getInputTargetBlock('IF0'), 0).trim() : 'True';
                const body = block.getInputTargetBlock('DO0') ? blockToCode(block.getInputTargetBlock('DO0'), indent + 1) : `${'    '.repeat(indent + 1)}pass`;
                const elseBody = block.getInputTargetBlock('ELSE') ? `\n${pad}else:\n${blockToCode(block.getInputTargetBlock('ELSE'), indent + 1)}` : '';
                code = `${pad}if ${cond}:\n${body}${elseBody}`;
                break;
            }
            case 'logic_compare': {
                const A = block.getInputTargetBlock('A') ? blockToCode(block.getInputTargetBlock('A'), 0).trim() : '0';
                const B_ = block.getInputTargetBlock('B') ? blockToCode(block.getInputTargetBlock('B'), 0).trim() : '0';
                const ops = { EQ: '==', NEQ: '!=', LT: '<', LTE: '<=', GT: '>', GTE: '>=' };
                code = `${A} ${ops[f('OP')] || '=='} ${B_}`;
                break;
            }
            case 'logic_operation': {
                const A = block.getInputTargetBlock('A') ? blockToCode(block.getInputTargetBlock('A'), 0).trim() : 'True';
                const B_ = block.getInputTargetBlock('B') ? blockToCode(block.getInputTargetBlock('B'), 0).trim() : 'True';
                code = `${A} ${f('OP') === 'AND' ? 'and' : 'or'} ${B_}`;
                break;
            }
            case 'logic_negate': {
                const val = block.getInputTargetBlock('BOOL') ? blockToCode(block.getInputTargetBlock('BOOL'), 0).trim() : 'True';
                code = `not ${val}`;
                break;
            }
            case 'logic_boolean': code = f('BOOL') === 'TRUE' ? 'True' : 'False'; break;
            case 'logic_null': code = 'None'; break;
            // ── Math ──
            case 'math_number': code = f('NUM'); break;
            case 'math_arithmetic': {
                const A = block.getInputTargetBlock('A') ? blockToCode(block.getInputTargetBlock('A'), 0).trim() : '0';
                const B_ = block.getInputTargetBlock('B') ? blockToCode(block.getInputTargetBlock('B'), 0).trim() : '0';
                const ops = { ADD: '+', MINUS: '-', MULTIPLY: '*', DIVIDE: '/', POWER: '**' };
                code = `(${A} ${ops[f('OP')] || '+'} ${B_})`;
                break;
            }
            case 'math_random_int': {
                const from_ = block.getInputTargetBlock('FROM') ? blockToCode(block.getInputTargetBlock('FROM'), 0).trim() : '1';
                const to_ = block.getInputTargetBlock('TO') ? blockToCode(block.getInputTargetBlock('TO'), 0).trim() : '100';
                code = `random.randint(${from_}, ${to_})`;
                break;
            }
            // ── Text ──
            case 'text': code = `"${f('TEXT')}"`; break;
            case 'text_print': {
                const val = block.getInputTargetBlock('TEXT') ? blockToCode(block.getInputTargetBlock('TEXT'), 0).trim() : '""';
                code = `${pad}print(${val})`;
                break;
            }
            case 'text_join': {
                const items = [];
                let i = 0;
                while (block.getInputTargetBlock('ADD' + i)) {
                    items.push(blockToCode(block.getInputTargetBlock('ADD' + i), 0).trim());
                    i++;
                }
                code = `str(${items.join(') + str(')})`;
                break;
            }
            // ── Variables ──
            case 'variables_get': code = f('VAR') || 'variable'; break;
            case 'variables_set': {
                const varName = f('VAR') || 'variable';
                const val = block.getInputTargetBlock('VALUE') ? blockToCode(block.getInputTargetBlock('VALUE'), 0).trim() : '0';
                code = `${pad}${varName} = ${val}`;
                break;
            }
            case 'math_change': {
                const varName = f('VAR') || 'variable';
                const delta = block.getInputTargetBlock('DELTA') ? blockToCode(block.getInputTargetBlock('DELTA'), 0).trim() : '1';
                code = `${pad}${varName} += ${delta}`;
                break;
            }
            // ── Functions ──
            case 'procedures_defnoreturn': {
                const name = f('NAME') || 'my_function';
                const body = block.getInputTargetBlock('STACK') ? blockToCode(block.getInputTargetBlock('STACK'), indent + 1) : `${'    '.repeat(indent + 1)}pass`;
                code = `${pad}def ${name}():\n${body}`;
                break;
            }
            case 'procedures_callnoreturn': {
                const name = f('NAME') || 'my_function';
                code = `${pad}${name}()`;
                break;
            }
            default: code = `${pad}# [${block.type}]`;
        }

        // Bloc suivant
        const next = block.getNextBlock();
        if (next) {
            const nextCode = blockToCode(next, indent);
            if (nextCode) code = code + NL + nextCode;
        }
        return code;
    };

    for (const block of topBlocks) {
        const code = blockToCode(block, 0);
        if (code && code.trim()) {
            lines.push(code);
            lines.push('');
        }
    }

    lines.push('# Lancer');
    lines.push('if __name__ == "__main__":');
    lines.push('    programme_principal()');
    return lines.join('\n');
};

// ── Composant React ──
const BlocklyEditor = ({ onCodeChange }) => {
    const containerRef = useRef(null);
    const workspaceRef = useRef(null);

    useEffect(() => {
        // IMPORTANT: définir les blocs AVANT inject
        try {
            defineBlocks();
        } catch (e) {
            console.warn('[BlocklyEditor] defineBlocks error:', e);
        }

        if (!containerRef.current || workspaceRef.current) return;

        // Petit délai pour s'assurer que les blocs sont bien enregistrés
        const init = () => {
            // Injecter Blockly
            const workspace = Blockly.inject(containerRef.current, {
                toolbox: TOOLBOX,
                theme: {
                    base: Blockly.Themes.Classic,
                    componentStyles: {
                        workspaceBackgroundColour: 'rgba(3,7,20,0.0)',
                        toolboxBackgroundColour: 'rgba(4,8,24,0.97)',
                        toolboxForegroundColour: '#c8ddf0',
                        flyoutBackgroundColour: 'rgba(3,7,20,0.96)',
                        flyoutForegroundColour: '#c8ddf0',
                        flyoutOpacity: 0.97,
                        scrollbarColour: 'rgba(80,150,230,0.3)',
                        scrollbarOpacity: 0.7,
                    },
                    fontStyle: { family: 'monospace', size: 11 },
                    categoryStyleMap: {
                        controle: { colour: '#4860b7' },
                        mouvement: { colour: '#d56235' },
                        capteurs: { colour: '#49a2a5' },
                    },
                },
                grid: {
                    spacing: 20,
                    length: 2,
                    colour: 'rgba(108,190,255,0.06)',
                    snap: true,
                },
                move: { scrollbars: true, drag: true, wheel: true },
                zoom: { controls: true, wheel: true, startScale: 0.9 },
                trashcan: true,
                renderer: 'zelos',
            });

            workspaceRef.current = workspace;

            // Écouter les changements → générer Python
            workspace.addChangeListener((event) => {
                if (event.type === Blockly.Events.FINISHED_LOADING) return;
                const code = blocksToPython(workspace);
                if (code && onCodeChange) onCodeChange(code);
            });
        }; // fin init()

        // Délai court pour laisser le DOM se stabiliser
        const timer = setTimeout(init, 50);

        return () => {
            clearTimeout(timer);
            if (workspaceRef.current) {
                workspaceRef.current.dispose();
                workspaceRef.current = null;
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                width: '100%',
                height: '100%',
                position: 'relative',
            }}
        />
    );
};

export default BlocklyEditor;