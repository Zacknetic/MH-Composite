
import { COLOR_MASKS, DEFAULT_COMMAND, discoverDevices, ICommandOptions, ICompleteDevice, IDeviceCommand, IDeviceMetaData, IProtoDevice } from "magichome-core";
import { deepEqual, isObject, mergeDeep, overwriteDeep } from "magichome-core/dist/utils/miscUtils";
import { BaseController } from "..";
import { deviceTypesMap, matchingFirmwareVersions } from "./deviceTypesMap";
import { clamp } from "./miscUtils";
import { IAnimationCommand, IDeviceAPI } from "./types";

export async function discoverProtoDevices(): Promise<IProtoDevice[] | null> {
    return new Promise(async (resolve, reject) => {
        let discoveredDevices: IProtoDevice[] = await discoverDevices(1000);
        for (let scans = 0; scans < 5; scans++) {

            if (discoveredDevices.length > 0) break;
            discoveredDevices = await discoverDevices(1000);
        }

        if (discoveredDevices.length > 0) {
            resolve(discoveredDevices);
        } else {
            reject('No devices found')
        }
    });
}

export function getAPI(deviceMetaData: IDeviceMetaData) {
    const { controllerFirmwareVersion, controllerHardwareVersion } = deviceMetaData;

    let adjustedProtocols;
    if (deviceTypesMap.has(controllerHardwareVersion)) {
        let deviceAPI: IDeviceAPI = deviceTypesMap.get(controllerHardwareVersion);
        if (matchingFirmwareVersions.has(controllerFirmwareVersion)) adjustedProtocols = matchingFirmwareVersions.get(controllerFirmwareVersion);
        // console.log(controllerFirmwareVersion, adjustedProtocols)

        overwriteDeep(deviceAPI, { needsPowerCommand: true });

        // console.log(controllerFirmwareVersion, deviceAPI)
        return deviceAPI;
    } else {
        // throw new Error("no matching API! WEIRD!");
    }

}

export function adjustCommandToAPI(deviceCommand: IDeviceCommand, commandOptions: ICommandOptions, deviceAPI: IDeviceAPI): IDeviceCommand {

    const { byteOrder, simultaneousCCT, hasBrightness, hasCCT, hasColor }: IDeviceAPI = deviceAPI;

    if (!hasColor || !commandOptions.colorAssist) {
        return deviceCommand;
    }

    const newDeviceCommand: IDeviceCommand = mergeDeep({}, deviceCommand,);

    isOn(newDeviceCommand);
    determineColorMask(newDeviceCommand, simultaneousCCT, hasCCT);
    adjustCCT(newDeviceCommand, deviceAPI);
    setRGBOrder(newDeviceCommand, byteOrder);
    return newDeviceCommand;
}

function determineColorMask(newDeviceCommand: IDeviceCommand, simultaneousCCT: boolean, hasCCT: boolean) {
    if (simultaneousCCT) newDeviceCommand.colorMask = COLOR_MASKS.BOTH;

    if (!hasCCT) newDeviceCommand.colorMask = COLOR_MASKS.COLOR;

    let { RGB: { red, green, blue }, CCT: { warmWhite, coldWhite }, colorMask } = newDeviceCommand;
    if (Math.max(red, green, blue) > 0 && Math.max(warmWhite, coldWhite) > 0) colorMask = COLOR_MASKS.BOTH;
    else if (!colorMask) colorMask = Math.max(red, green, blue) >= Math.max(warmWhite, coldWhite) ? COLOR_MASKS.COLOR : COLOR_MASKS.WHITE;
    newDeviceCommand.colorMask = colorMask;
}

function setRGBOrder(newDeviceCommand: IDeviceCommand, byteOrder: Array<string>): void {
    if (byteOrder.length < 3) return;
    const { RGB: { red, green, blue } } = newDeviceCommand;
    const colorList = [0, 0, 0];
    let i = 0;
    for (const byte of byteOrder) {
        if (i > colorList.length - 1) break;
        switch (byte) {
            case 'r':
                colorList[i] = red;
                break;
            case 'g':
                colorList[i] = green;
                break;
            case 'b':
                colorList[i] = blue;
                break;
            default:
                break;
        }
        i++;
    }

    overwriteDeep(newDeviceCommand, { RGB: { red: colorList[0], green: colorList[1], blue: colorList[2] } })
}

function adjustCCT(newDeviceCommand: IDeviceCommand, deviceAPI: IDeviceAPI) {
    const { byteOrder, simultaneousCCT, hasBrightness, hasCCT, hasColor }: IDeviceAPI = deviceAPI;
    const { RGB: { red, green, blue }, CCT: { warmWhite, coldWhite }, colorMask } = newDeviceCommand;
    const cwAdj = Math.round(coldWhite / 2), wwRedAdj = Math.round(warmWhite / 2), wwGreenAdj = Math.round(warmWhite / 6.8), wwBlueAdj = Math.round(warmWhite / 28.4);


    // handle non simultaneousCCT white 5 colors
    if (!simultaneousCCT && byteOrder.length == 5 && colorMask == COLOR_MASKS.WHITE) return;

    // handle simultaneousCCT white 4 colors
    if (byteOrder.length == 4 && simultaneousCCT && coldWhite > 0) {
        overwriteDeep(newDeviceCommand, { RGB: { red: clamp(red + cwAdj, 0, 255), green: clamp(green + cwAdj, 0, 255), blue: clamp(blue + cwAdj, 0, 255) }, CCT: { warmWhite: Math.max(coldWhite, warmWhite) }, colorMask: COLOR_MASKS.BOTH });
        return;
    }

    //handle non simultaneousCCT white 4 colors
    if (byteOrder.length == 4 && !simultaneousCCT && colorMask == COLOR_MASKS.WHITE) {
        overwriteDeep(newDeviceCommand, { CCT: { warmWhite: Math.max(warmWhite, coldWhite) } });
        return;
    }

    //handle non simultaneousCCT both 4 colors or 3 colors
    if (!simultaneousCCT && colorMask == COLOR_MASKS.BOTH) {
        overwriteDeep(newDeviceCommand, { RGB: { red: clamp(red + cwAdj + wwRedAdj, 0, 255), green: clamp(green + cwAdj + wwGreenAdj, 0, 255), blue: clamp(blue + cwAdj + wwBlueAdj, 0, 255) }, colorMask: COLOR_MASKS.COLOR });
    }
    
    //defaults to simultaneousCCT both 5 colors

}

function isOn(newDeviceCommand: IDeviceCommand) {
    const { RGB: { red, green, blue }, CCT: { warmWhite, coldWhite } } = newDeviceCommand;
    if (Math.max(red, green, blue, warmWhite, coldWhite) > 0)
        newDeviceCommand.isOn = true;
}

export function isCommandEqual(colorStart: IAnimationCommand, colorTarget: IAnimationCommand): boolean {
    try {
        // console.log("COMMAND: ", deviceCommand, "\nSTATE: ", deviceState)
        // console.log(deviceCommand.colorMask, " ", commandOptions.commandType)
        let isEqual = false;

        isEqual = deepEqual(colorStart, colorTarget, ['colorMask']);

        return isEqual;
    } catch (error) {
        // // throw Error(error);
    }
}

