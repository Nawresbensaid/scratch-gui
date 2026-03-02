import React, { useEffect, useRef } from 'react';
import * as Blockly from 'blockly';
import 'blockly/blocks';
if (typeof window !== 'undefined') window.Blockly = Blockly;

const CM = '#d56235', CS = '#ca3143', CN = '#49a2a5',
    CSN = '#709662', CL = '#687c9e', CB = '#bf778b',
    CA = '#458ff7', CC = '#4860b7';

const defineBlocks = () => {
    const B = window.Blockly || Blockly;
    if (B.Blocks['start']) return;

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
};

const TOOLBOX = {
    kind: 'categoryToolbox',
    contents: [
        {
            kind: 'category', name: '🤖 Control', colour: CC, contents: [
                { kind: 'block', type: 'start' },
                { kind: 'block', type: 'forever' },
                { kind: 'block', type: 'wait' },
                { kind: 'block', type: 'display_string' },
                { kind: 'block', type: 'display_sensors' },
            ]
        },
        {
            kind: 'category', name: '🚗 Movement', colour: CM, contents: [
                { kind: 'block', type: 'forwardBackward' },
                { kind: 'block', type: 'leftRight' },
                { kind: 'block', type: 'setMotors' },
                { kind: 'block', type: 'movementStop' },
            ]
        },
        {
            kind: 'category', name: '📡 Sensors', colour: CN, contents: [
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
            kind: 'category', name: '🔊 Sound', colour: CSN, contents: [
                { kind: 'block', type: 'inputSound' },
                { kind: 'block', type: 'soundType' },
                { kind: 'block', type: 'soundMode' },
            ]
        },
        {
            kind: 'category', name: '💡 LED', colour: CL, contents: [
                { kind: 'block', type: 'brightness' },
                { kind: 'block', type: 'ledOnOff' },
                { kind: 'block', type: 'indicators' },
            ]
        },
        {
            kind: 'category', name: '🏎️ Speed', colour: CB, contents: [
                { kind: 'block', type: 'speedControl' },
                { kind: 'block', type: 'driveModeControls' },
            ]
        },
        {
            kind: 'category', name: '🧠 AI', colour: CA, contents: [
                { kind: 'block', type: 'objectTracking' },
                { kind: 'block', type: 'autopilot' },
                { kind: 'block', type: 'navigateForwardAndLeft' },
                { kind: 'block', type: 'disableAI' },
            ]
        },
    ]
};

const blocksToPython = (workspace) => {
    const lines = ['# Code Python généré depuis les blocs OpenBot', ''];
    const topBlocks = workspace.getTopBlocks(true);
    if (!topBlocks.length) return null;
    const NL = '\n';

    const blockToCode = (block, indent) => {
        if (!block) return '';
        const pad = '    '.repeat(indent);
        let code = '';
        const f = (name) => { const field = block.getField(name); return field ? field.getValue() : '0'; };
        const sub = (name) => { const b = block.getInputTargetBlock(name); return b ? blockToCode(b, indent + 1) : pad + '    pass'; };

        switch (block.type) {
            case 'start': code = `def programme_principal():${NL}${sub('start_blocks')}`; break;
            case 'forever': code = `${pad}while True:${NL}${sub('forever_loop_blocks')}`; break;
            case 'wait': code = `${pad}robot.wait(ms=${f('time')})`; break;
            case 'display_string': code = `${pad}robot.display("${f('text')}")`; break;
            case 'display_sensors': code = `${pad}robot.display_sensors()`; break;
            case 'forwardBackward': code = f('direction_type') === 'moveForward' ? `${pad}robot.move_forward(speed=${f('slider')})` : `${pad}robot.move_backward(speed=${f('slider')})`; break;
            case 'leftRight': code = f('direction_type') === 'moveLeft' ? `${pad}robot.turn_left(speed=${f('slider')})` : `${pad}robot.turn_right(speed=${f('slider')})`; break;
            case 'setMotors': code = `${pad}robot.set_motors(left=${f('left_distance')}, right=${f('right_distance')})`; break;
            case 'movementStop': code = `${pad}robot.stop()`; break;
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
            default: code = `${pad}# [${block.type}]`;
        }

        const next = block.getNextBlock();
        if (next) { const nc = blockToCode(next, indent); if (nc) code = code + NL + nc; }
        return code;
    };

    for (const block of topBlocks) {
        const code = blockToCode(block, 0);
        if (code && code.trim()) { lines.push(code); lines.push(''); }
    }
    lines.push('if __name__ == "__main__":');
    lines.push('    programme_principal()');
    return lines.join('\n');
};

const BlocklyEditor = ({ onCodeChange }) => {
    const containerRef = useRef(null);
    const workspaceRef = useRef(null);

    useEffect(() => {
        try { defineBlocks(); } catch (e) { console.warn('[BlocklyEditor] defineBlocks error:', e); }
        if (!containerRef.current || workspaceRef.current) return;

        const init = () => {
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
                },
                grid: { spacing: 20, length: 2, colour: 'rgba(108,190,255,0.06)', snap: true },
                move: { scrollbars: true, drag: true, wheel: true },
                zoom: { controls: true, wheel: true, startScale: 0.9 },
                trashcan: true,
                renderer: 'zelos',
            });

            workspaceRef.current = workspace;

            workspace.addChangeListener((event) => {
                if (event.type === Blockly.Events.FINISHED_LOADING) return;
                const code = blocksToPython(workspace);
                if (code && onCodeChange) onCodeChange(code);
            });
        };

        const timer = setTimeout(init, 50);
        return () => {
            clearTimeout(timer);
            if (workspaceRef.current) { workspaceRef.current.dispose(); workspaceRef.current = null; }
        };
    }, []);

    return <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }} />;
};

export default BlocklyEditor;