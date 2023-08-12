import { IProtoDevice, IDeviceState, IDeviceMetaData } from 'magichome-core';
export { COMMAND_TYPE } from 'magichome-core'
import { BaseController } from '../BaseController';
import { InterpolationType } from '../animation/animationUtils';

/*----------------------[Constants]----------------------*/


export const DefaultDevice = {
    ipAddress: '',
    uniqueId: '',
    modelNumber: 'unknown',
}


/*----------------------[Device State]--------- -------------*/

/**
 * DeviceAPI
 */
export interface IDeviceAPI {
    byteOrder: any;
    description: string;
    hasColor: boolean;
    hasCCT: boolean;
    hasBrightness: boolean;
    isEightByteProtocol: boolean;
    needsPowerCommand?: boolean;
    simultaneousCCT: boolean;
}

export interface IDeviceInformation {
    deviceAPI: IDeviceAPI;
    protoDevice: IProtoDevice;
    deviceState: IDeviceState;
    deviceMetaData: IDeviceMetaData
}

export interface IControllerInformation {
    displayName: string;
    lastSeenDate: number;
}

export interface IAnimationLoop {
    name: string,
    pattern: IAnimationFrame[],
    accessoryOffsetMS: number,
}

export interface IAnimationFrame {
    colorStart?: IAnimationCommand,
    colorTarget: IAnimationCommand,
    transitionTimeMS: number | number[],
    durationAtTargetMS?: number | number[];
    chancePercent: number;
    reSyncMs?: number | number[];
}

export interface IAnimationColorRange {
    red: number | number[];
    green: number | number[];
    blue: number | number[];
    warmWhite: number | number[];
    coldWhite: number | number[];
}

export interface IAnimationColorStep {
    red: number;
    green: number;
    blue: number;
    warmWhite: number;
    coldWhite: number;
}

export interface IAnimationSequenceRange {
    startColor?: IAnimationColorRange;
    targetColor: IAnimationColorRange;
    transitionDurationMS: number | number[];
    durationAtTargetMS: number | number[];
    reverseTransitionDurationMS?: number | number[];
    interpolationType: InterpolationType;
    skipChance: number;
}

export interface IAnimationSequenceStep {
    startColor?: IAnimationColorStep;
    targetColor: IAnimationColorStep;
    transitionDurationMS: number;
    durationAtTargetMS: number;
    reverseTransitionDurationMS?: number;
    interpolationType: InterpolationType;
    skipChance: number;
}

export enum AnimationStepKey { ALL = "all" }
export type AnimationStepKeys = AnimationStepKey | BaseController["id"];

export interface IAnimationBlueprint {
    readonly name: string;
    readonly priority: number;
    readonly syncSequenceTimings: boolean;
    readonly syncSequenceColor: boolean;
    readonly lightOffsetDurationMS: number;
    readonly animationSequences: IAnimationSequenceRange[];
}

export type IFailedDeviceProps = IProtoDevice & {
    latestScanTimestamp: number;
}
/*----------------------[Device Commands]----------------------*/

export interface IAnimationCommand {
    RGB?: IAnimationRGB;
    CCT?: IAnimationCCT;
    colorMask?: number;
}

export interface IAnimationRGB {
    red: number | number[]
    green: number | number[];
    blue: number | number[];
}

export interface IAnimationCCT {
    warmWhite: number | number[]
    coldWhite: number | number[];
}