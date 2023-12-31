import type { PlatformAccessory } from 'homebridge';
import { BaseController, IDeviceState, IDeviceCommand, IColorCCT, IDeviceInformation, IDeviceMetaData, IProtoDevice, IAnimationBlueprint } from 'magichome-platform';
import { HomebridgeMagichomeDynamicPlatformAccessory } from '../platformAccessory';

// import { Switch } from '../accessories/Switch';
// import { DimmerStrip } from '../accessories/DimmerStrip';
// import { RGBStrip } from '../accessories/RGBStrip';
// import { GRBStrip } from '../accessories/GRBStrip';
// import { RGBWBulb } from '../accessories/RGBWBulb';
// import { RGBWWBulb } from '../accessories/RGBWWBulb';
// import { RGBWStrip } from '../accessories/RGBWStrip';
// import { RGBWWStrip } from '../accessories/RGBWWStrip';
// import { CCTStrip } from '../accessories/CCTStrip';


// export const homekitInterface = {
// 	// 'Power Socket': Switch,
// 	// 'Dimmer': DimmerStrip,
// 	// 'GRB Strip': GRBStrip,
// 	// 'RGB Strip': RGBStrip,
// 	'RGBW Non-Simultaneous': RGBWBulb,
// 	'RGBWW Non-Simultaneous': RGBWWBulb,
// 	'RGBW Simultaneous': RGBWStrip,
// 	'RGBWW Simultaneous': RGBWWStrip,
// 	// 'CCT Strip': CCTStrip,
// };

export interface MagicHomeAccessory extends PlatformAccessory {
	context: IAccessoryContext;
}

export interface AnimationAccessory extends PlatformAccessory {
	context: IAnimationContext;
}

export interface IAnimationContext {
    activeAccessoryList: any;
	animationBlueprint: IAnimationBlueprint;
	displayName?: string;
}

export interface IAccessoryContext {
	displayName?: string;
	deviceMetaData: IDeviceMetaData;
	assignedAnimations: string[]
	protoDevice: IProtoDevice;
	latestUpdate: number;
}

export interface IAccessoryState {
	isOn: boolean,
	HSV: IColorHSV,
	TB: IColorTB
}

export interface IAnimationState {
	isOn: boolean,
}

export interface IPartialAccessoryCommand {
	isOn?: boolean,
	HSV?: IPartialColorHSV,
	TB?: IPartialColorTB,
	colorTemperature?: number,
	isPowerCommand?: boolean,
}

export interface IAccessoryCommand {
	isOn: boolean,
	HSV: IColorHSV,
	TB: IColorTB
	isPowerCommand: boolean,
}

export interface IColorHSV {
	hue: number;
	saturation: number;
	value: number;
}

export interface IColorTB {
	temperature: number;
	brightness: number;
}

export interface IPartialColorTB {
	temperature?: number;
	brightness?: number;
}

export interface IPartialColorHSV {
	hue?: number;
	saturation?: number;
	value?: number;
}


export interface IConfigOptions {
	logLevel: number,
	colorWhiteInterfaceMode: string,
	colorOffSaturationLevel: number,
	colorWhiteSimultaniousSaturationLevel?: number,
}

/*----------------------[DEFAULT VALIUES]----------------------*/

export const COLOR_COMMAND_MODES = {
	CCT: 'CCT',
	HSV: 'HSV',
};
export const DEFAULT_ANIMATION_STATE = {
	isOn: false,
};
export const DEFAULT_ACCESSORY_STATE: IAccessoryState = {
	isOn: true,
	HSV: {
		hue: 0,
		saturation: 0,
		value: 100,
	},
	TB: {
		temperature: 140,
		brightness: 100
	}
};

export const DEFAULT_ACCESSORY_COMMAND: IAccessoryCommand = {
	isOn: false,
	isPowerCommand: false,
	HSV: {
		hue: 0,
		saturation: 0,
		value: 0,
	},
	TB: {
		temperature: 140,
		brightness: 0
	}
};