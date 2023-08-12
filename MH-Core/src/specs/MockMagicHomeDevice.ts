import { IMockCommandSettings, IMockDeviceSettings, IMockLEDState } from "../types";
import * as types from '../types';

const {
    DEVICE_COMMAND_BYTES: { COMMAND_POWER_OFF, COMMAND_POWER_ON, COMMAND_QUERY_STATE },
    COMMAND_TYPE: { POWER_COMMAND, COLOR_COMMAND, ANIMATION_FRAME, QUERY_COMMAND },
    DEFAULT_COMMAND: defaultCommand
} = types;

const needsPowerCommand = false;
export class MockMagicHomeDevice {

    protected mockLEDState: IMockLEDState
    protected mockDeviceSettings: IMockDeviceSettings
    constructor() {
        
        this.mockLEDState = defaultCommand;
        this.mockDeviceSettings =  { deviceState: this.mockLEDState, controllerFirmwareVersion: 4, controllerHardwareVersion: 4, responseTimeMS: 500};
    }

    // # sample message for 9-byte LEDENET transmit protocol (w/ checksum at end)
    // #  0  1  2  3  4  5  6  7  8
    // # 31 bc c1 ff 00 00 f0 0f ac 
    // #  |  |  |  |  |  |  |  |  |
    // #  |  |  |  |  |  |  |  |  checksum (actual checksum is 3AC but we truncate all but the last 2 digits)
    // #  |  |  |  |  |  |  |  terminator
    // #  |  |  |  |  |  |  write mode (f0 colors, 0f whites, 00 colors & whites)
    // #  |  |  |  |  |  cold white
    // #  |  |  |  |  warm white
    // #  |  |  |  blue
    // #  |  |  green
    // #  |  red
    // #  persistence (31 for true / 41 for false) determines if color is retained after power loss
    // #
    /*****************************Mock Functions*************** */
    private parseColorCommand(data: Buffer) {
        let colorCommand = {
            persistance: data.readUInt8(0),
            RGB: {
                red: data.readUInt8(1),
                green: data.readUInt8(2),
                blue: data.readUInt8(3),
            },
            CCT: {
                warmWhite: data.readUInt8(4),
                coldWhite: data.readUInt8(5),
            },
            colorMask: data.readUInt8(5),
            terminator: data.readUInt8(6),
            checksum: data.readUInt8(7),
        }
        return colorCommand;
    }

    // # sample message for 14-byte LEDENET receive protocol
    // # 0  1  2  3  4  5  6  7  8  9 10 11 12 13
    // #81 35 23 61 01 1c 00 00 00 00 03 ff 0f 68>
    // # |  |  |  |  |  |  |  |  |	|  |  |  |  |
    // # |  |  |  |  |  |  |  |  |	|  |  |  |
    // # |  |  |  |  |  |  |  |  |	|  |  |
    // # |  |  |  |  |  |  |  |  |	|  |  cold white value
    // # |  |  |  |  |  |  |  |  |	|   firmware version
    // # |  |  |  |  |  |  |  |  |  warm white value
    // # |  |  |  |  |  |  |  |  blue
    // # |  |  |  |  |  |  |  green
    // # |  |  |  |  |  |  red
    // # |  |  |  |  |  
    // # |  |  |  |  
    // # |  |  |  ??? pattern ???
    // # |  |  power (23 on : 24 off)
    // # |  hardware version
    // # header

    public async mockSendDeviceCommand(data, mockCommandSettings: IMockCommandSettings) {
        const isPowerCommand = data.readUInt8(0) == 0x71 ? true : false;
        const isQueryCommand = data.readUInt8(0) == 0x81 ? true : false;
        let ret;
        if (isPowerCommand) {
            this.mockLEDState.isOn = data.readUInt8(1) == 0x23 ? true : false;
            ret = [data.readUInt8(1)];
        } else if (isQueryCommand) {
            ret =  await this.mockGetDeviceState(data)
        } else {
            if(!needsPowerCommand){
                this.mockLEDState.isOn = true;
            }
            const colorCommand = this.parseColorCommand(data);
            this.mockLEDState.RGB = colorCommand.RGB;
            this.mockLEDState.CCT = colorCommand.CCT;
            ret = [data.readUInt8(0)]
        }
        ret = Buffer.from(ret);
        return ret
    }
    
    private async mockGetDeviceState(mockCommandSettings?: IMockCommandSettings) {
        const { deviceState: { isOn, RGB: { red, green, blue }, CCT: { warmWhite, coldWhite } }, controllerFirmwareVersion, controllerHardwareVersion, responseTimeMS } = this.mockDeviceSettings;
        const onState = isOn ? 0x23 : 0x24;
        const returnData = [0x81, controllerHardwareVersion, onState, 0x00, 0x00, 0x00, red, green, blue, warmWhite, controllerFirmwareVersion, coldWhite, 0x0F, 0x68];
        sleep(responseTimeMS ?? 100);
        return returnData;
    }
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}