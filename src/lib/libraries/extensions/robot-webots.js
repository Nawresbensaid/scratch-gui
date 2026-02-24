class RobotWebotsExtension {
    getInfo() {
        return {
            id: 'robotWebots',
            name: 'Robot Webots',
            blocks: [
                {
                    opcode: 'avancer',
                    blockType: 'command',
                    text: 'Avancer de [DISTANCE] cm',
                    arguments: {
                        DISTANCE: {
                            type: 'number',
                            defaultValue: 50
                        }
                    }
                },
                {
                    opcode: 'tourner',
                    blockType: 'command',
                    text: 'Tourner de [ANGLE] degrés',
                    arguments: {
                        ANGLE: {
                            type: 'number',
                            defaultValue: 90
                        }
                    }
                },
                {
                    opcode: 'arreter',
                    blockType: 'command',
                    text: 'Arrêter le robot'
                }
            ]
        };
    }

    avancer({ DISTANCE }) {
        fetch(`http://localhost:3000/avancer?distance=${DISTANCE}`);
    }

    tourner({ ANGLE }) {
        fetch(`http://localhost:3000/tourner?angle=${ANGLE}`);
    }

    arreter() {
        fetch(`http://localhost:3000/arreter`);
    }
}