import { IDeviceAPI, IFailedDeviceProps, } from './utils/types';
import { discoverDevices, completeDevices, ICommandOptions, ICompleteDevice, IProtoDevice, ICompleteDeviceInfo } from 'magichome-core';
import { BaseController } from './BaseController';
import { discoverProtoDevices } from './utils/platformUtils';
import { completeCustomDevices } from 'magichome-core/dist/DeviceDiscovery';

/**
 * 
 */
export class ControllerGenerator {
	public activeControllers: BaseController[] = [];
	public customControllers: BaseController[] = [];
	// public inactiveDeviceQueue: IFailedDeviceProps[] = [];
	constructor() { }

	/**
	 * class function discoverControllers
	 * 
	 * Scan the network for compatible MagicHome devices,
	 * @returns a map of <uniqueId, ControllerObject> pairs.
	 */
	public async discoverCompleteDevices(): Promise<ICompleteDevice[] | null> {
		const protoDevices: IProtoDevice[] = await discoverProtoDevices().catch(error => {
			// throw error;
		}) as IProtoDevice[];

		const completedDevices: ICompleteDevice[] = await completeDevices(protoDevices);
		return completedDevices;
	}

	public generateControllers(completeDevices: ICompleteDevice[]): BaseController[] {

		const activeControllers: BaseController[] = this.iterateDevices(completeDevices);
		this.activeControllers = activeControllers;
		return activeControllers;
	}

	public generateCustomControllers(ICompleteDevicesInfo: ICompleteDeviceInfo[]): BaseController[] {

		const completeDevices: ICompleteDevice[] = completeCustomDevices(ICompleteDevicesInfo);
		const customControllers: BaseController[] = this.iterateDevices(completeDevices);
		this.customControllers = customControllers;

		return customControllers;
	}

	private iterateDevices(completeDevices: ICompleteDevice[]): BaseController[] {
		const devices: BaseController[] = [];
		for (const completeDevice of completeDevices) {
			const deviceController: BaseController = new BaseController(completeDevice);
			devices.push(deviceController)
		}
		return devices;
	}

	// /**
	//  * class function getActiveDevices
	//  * 
	//  * Returns a map of <uniqueId, BaseController> pairs or;
	//  * If provided a valid uniqueId, returns a single BaseController
	//  * @param uniqueId (optional)
	//  * @returns 
	//  */
	// public getActiveDevice(uniqueId?: string): Map<string, BaseController> | BaseController {
	// 	if (uniqueId) {
	// 		return this.activeDevices[uniqueId];
	// 	} else {
	// 		return this.activeDevices;
	// 	}
	// }

	/** TODO
	 * change this to a base controller function
	 * check if the device exists, if not create it. If yes, just send a message using the direct command protocol. 
	 */
	/**
	 * class function sendDirectCommand
	 * 
	 * @param directCommand
	 * @param commandOptions (optional)
	 */

	// public async sendDirectCommand(directCommand: DirectCommand, commandOptions?: ICommandOptions) {

	// 	const customCompleteDevice: ICustomCompleteDevice = { protoDevice: directCommand }
	// 	const controller = this.createCustomControllers([customCompleteDevice])[0];

	// 	controller.activeDevice.setAllValues(directCommand, commandOptions);
	// }

}

