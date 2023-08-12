import { DeviceInterface } from "./DeviceInterface";
import { mergeDeep } from "./specs/miscUtils";

export interface IProtoDevice {
    readonly ipAddress: string;
    readonly uniqueId: string;
    readonly modelNumber: string;
}

export interface ICompleteDeviceInfo {
    protoDevice: IProtoDevice;
    deviceMetaData: IDeviceMetaData;
    latestUpdate: number;
}

export interface ICompleteDevice {
    completeDeviceInfo: ICompleteDeviceInfo;
    completeResponse: ICompleteResponse;
    deviceInterface: DeviceInterface;
}

/**
 * @field timeoutMS?: number
 * @field bufferMS?: number
 * @field commandType?: string
 * @field isEightByteProtocol?: boolean
 * @field maxRetries: number
 * @field remainingRetries: number
 */
export interface ICommandOptions {
    readonly timeoutMS: number;
    readonly bufferMS?: number;
    colorAssist?: boolean
    readonly commandType: string;
    readonly isEightByteProtocol?: boolean;
    readonly waitForResponse: boolean;
    maxRetries: number;
    remainingRetries?: number;
}

export interface IDeviceCommand {
    isOn: boolean;
    RGB: IColorRGB;
    CCT: IColorCCT;
    colorMask?: number;
}

export interface IIncompleteCommand {
    readonly isOn?: boolean;
    readonly RGB?: IColorRGB;
    readonly CCT?: IColorCCT;
    readonly colorMask?: number;
}

export interface IColorRGB {
    red: number;
    green: number;
    blue: number;
}

export interface IColorCCT {
    warmWhite: number;
    coldWhite: number;
}

export interface IDeviceState {
    isOn: boolean;
    RGB: IColorRGB;
    CCT: IColorCCT;
}


export interface IDeviceMetaData {
    readonly controllerHardwareVersion: number;
    readonly controllerFirmwareVersion: number;
    readonly rawData: Buffer;
}



export interface ICompleteResponse {
    responseCode: number;
    deviceCommand?: IDeviceCommand;
    commandOptions?: ICommandOptions;
    deviceState: IDeviceState;
    deviceMetaData: IDeviceMetaData;
    responseMsg?: any;
}

export interface ITransportResponse {
    responseCode: number,
    responseMsg: Buffer;
}

export interface IQueueOptions {
    timeout?: number;
    autoStart?: boolean;
    interval?: number
}

/*******************************CONSTANTS****************** */

export const EVENT_NUMBER = new Map([
    [-9, 'incorrect buffer length'],
    [-8, 'device unresponsive'],
    [-7, 'socket reported error'],
    [-6, 'command/query timed out'],
    [-5, 'duplicate power command'],
    [-4, 'incorrect device state, insufficient retries'],
    [-3, 'incorrect device state, no retries requested'],
    [-2, 'socket closed before resolving'],
    [-1, 'unknown failure'],
    [0, 'unnecessary query command, query already queued'],
    [1, 'device responded with valid state'],
    [2, 'read state timeout not requested'],
    [3, 'write confirmation not requested']
]);

export const DEVICE_COMMAND_BYTES = {
    COMMAND_POWER_ON: [0x71, 0x23, 0x0f],
    COMMAND_POWER_OFF: [0x71, 0x24, 0x0f],
    COMMAND_QUERY_STATE: [0x81, 0x8a, 0x8b]
}

export const COMMAND_TYPE = {
    POWER_COMMAND: 'powerCommand',
    COLOR_COMMAND: 'colorCommand',
    ANIMATION_FRAME: 'animationFrame',
    QUERY_COMMAND: 'queryCommand',
}


/*******************************DEFAULT VALUES****************** */

export const COLOR_MASKS = {
    WHITE: 0x0F,
    COLOR: 0xF0,
    BOTH: 0xFF,
}

export const DEFAULT_RGB: IColorRGB = {
    red: 0,
    green: 0,
    blue: 0,
}

export const DEFAULT_CCT: IColorCCT = {
    warmWhite: 0,
    coldWhite: 0,
}

export const DEVICE_STATE_DEFAULTS = {
    isOn: false,
    RGB: mergeDeep({}, DEFAULT_RGB),
    CCT: mergeDeep({}, DEFAULT_CCT)
}

export const DEFAULT_COMMAND: IDeviceCommand = {
    isOn: true,
    RGB: mergeDeep({}, DEFAULT_RGB),
    CCT: mergeDeep({}, DEFAULT_CCT),
}

export const DEFAULT_DEVICE_METADATA: IDeviceMetaData = {
    controllerFirmwareVersion: null,
    controllerHardwareVersion: null,
    rawData: null,
}

export const DEFAULT_COMPLETE_RESPONSE: ICompleteResponse = {
    responseCode: 0,
    deviceState: null,
    deviceMetaData: null
}

export const DEFAULT_COMMAND_OPTIONS: ICommandOptions = {
    timeoutMS: 50,
    bufferMS: 50,
    colorAssist: false,
    commandType: COMMAND_TYPE.COLOR_COMMAND,
    waitForResponse: true,
    maxRetries: 5,
    remainingRetries: 5,
}

/*******************************Helper Types****************** */
// type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
//     ? Acc[number]
//     : Enumerate<N, [...Acc, Acc['length']]>

// type PrependNextNum<A extends Array<unknown>> = A['length'] extends infer T ? ((t: T, ...a: A) => void) extends ((...x: infer X) => void) ? X : never : never;

// type EnumerateInternal<A extends Array<unknown>, N extends number> = { 0: A, 1: EnumerateInternal<PrependNextNum<A>, N> }[N extends A['length'] ? 0 : 1];

// export type Enumerate<N extends number> = EnumerateInternal<[], N> extends (infer E)[] ? E : never;

// // export type Range<FROM extends number, TO extends number> = Exclude<Enumerate<TO>, Enumerate<FROM>>;


// export type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;


/*******************************MOCK SETTINGS****************** */

export interface IMockDeviceSettings {
    deviceState: IDeviceState;
    controllerHardwareVersion: number;
    controllerFirmwareVersion: number;
    responseTimeMS: number;
}

export interface IMockCommandSettings {
    responseTimeMS: number;
    numFailures: number;
}


export interface IMockLEDState {
    isOn: boolean;
    RGB: IColorRGB;
    CCT: IColorCCT;
}
