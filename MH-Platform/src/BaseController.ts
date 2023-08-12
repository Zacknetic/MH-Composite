import { IProtoDevice, ICompleteDevice, COMMAND_TYPE, ICommandOptions, IDeviceCommand, IDeviceState, IDeviceMetaData, DeviceInterface, COLOR_MASKS, ICompleteResponse, DEFAULT_COMMAND, DEFAULT_COMMAND_OPTIONS, mergeDeep } from 'magichome-core';

import { clamp, waitForMe } from './utils/miscUtils'
import { IDeviceInformation, IDeviceAPI, IAnimationColorStep } from './utils/types';
import { IAnimationLoop } from '.';
import { adjustCommandToAPI, getAPI } from './utils/platformUtils';
import { overwriteDeep } from 'magichome-core/dist/utils/miscUtils';


const { WHITE, COLOR, BOTH } = COLOR_MASKS;
const { POWER_COMMAND, COLOR_COMMAND, ANIMATION_FRAME, QUERY_COMMAND } = COMMAND_TYPE;

export class BaseController {
  protected deviceInterface: DeviceInterface;

  protected deviceWriteStatus;
  protected devicePowerCommand;

  protected completeDevice: ICompleteDevice;
  protected deviceState: IDeviceState;
  protected lastOutboundState: IDeviceState;
  protected deviceMetaData: IDeviceMetaData;
  protected protoDevice: IProtoDevice;
  protected deviceAPI: IDeviceAPI;
  protected latestUpdateTime: number
  public manuallyControlled: boolean = false;
  public id: string;
  first: boolean = true;
  initalized: boolean;
  protected animationList: string[] = [];
  //=================================================
  // Start Constructor //
  constructor(completeDevice: ICompleteDevice) {
    this.completeDevice = completeDevice;
    this.deviceInterface = completeDevice.deviceInterface;
    this.protoDevice = completeDevice.completeDeviceInfo.protoDevice;
    this.deviceMetaData = completeDevice.completeDeviceInfo.deviceMetaData;
    this.latestUpdateTime = completeDevice.completeDeviceInfo.latestUpdate;
    this.deviceState = completeDevice.completeResponse.deviceState;
    this.deviceAPI = getAPI(this.deviceMetaData);
    this.id = this.protoDevice.uniqueId;

  };
  //=================================================
  // End Constructor //
  public async setOn(value: boolean) {
    mergeDeep(this.lastOutboundState, { isOn: value })
    try {
      await this.fetchStateRGB(500);
    } catch (e) {
      console.log("setOn ERROR: ", e);
    }

    if (value === this.deviceState.isOn) return;
    const deviceCommand: IDeviceCommand = mergeDeep({}, { isOn: value }, DEFAULT_COMMAND)
    const commandOptions = mergeDeep({}, { isEightByteProtocol: this.deviceAPI.isEightByteProtocol, commandType: POWER_COMMAND }, DEFAULT_COMMAND_OPTIONS)
    this.deviceInterface.sendCommand(deviceCommand, commandOptions).catch(e => { console.log("setOn ERROR: ", e) });
  }

  public getAnimationList() {
    return this.animationList;
  }

  public hasAnimation(animationName: string) {
    return this.animationList.includes(animationName);
  }

  public appendAnimationList(animationName: string | string[]) {
    if (Array.isArray(animationName)) {
      animationName.forEach((name) => {
        if (!this.animationList.includes(name)) {
          this.animationList.push(name);
        }
      })
    } else if (!this.animationList.includes(animationName)) {
      this.animationList.push(animationName);
    }
  }

  public removeAnimationFromList(animationName: string | string[]) {
    if (Array.isArray(animationName)) {
      animationName.forEach((name) => {
        const index = this.animationList.indexOf(name);
        if (index > -1) {
          this.animationList.splice(index, 1);
        }
      })
    } else {
      const index = this.animationList.indexOf(animationName);
      if (index > -1) {
        this.animationList.splice(index, 1);
      }
    }
  }

  // public async setHSV(hue: number, saturation: number, value: number) {
  //   mergeDeep(this.lastOutboundState, { hue, saturation, value })
  //   try {
  //     await this.fetchStateRGB(500);
  //   } catch (e) {
  //     console.log("setHSV ERROR: ", e);
  //   }

  //   const deviceCommand: IDeviceCommand = mergeDeep({}, { hue, saturation, value }, DEFAULT_COMMAND)
  //   const commandOptions = mergeDeep({}, { isEightByteProtocol: this.deviceAPI.isEightByteProtocol, commandType: COLOR_COMMAND }, DEFAULT_COMMAND_OPTIONS)
  //   this.deviceInterface.sendCommand(deviceCommand, commandOptions).catch(e => { console.log("setHSV ERROR: ", e) });
  // }


  public async setAllValues(deviceCommand: IDeviceCommand, commandOptions?: ICommandOptions) {
    mergeDeep(this.lastOutboundState, deviceCommand);
    commandOptions = mergeDeep({}, commandOptions, { colorAssist: true, isEightByteProtocol: this.deviceAPI.isEightByteProtocol, timeoutMS: 50, bufferMS: 50, commandType: COLOR_COMMAND, maxRetries: 0 })
    mergeDeep(commandOptions, DEFAULT_COMMAND_OPTIONS)
    try {
      return await this.writeCommand(deviceCommand, commandOptions);
    }
    catch (e) {
      console.log("setAllValues ERROR: ", e)
    }
  }

  private async writeCommand(deviceCommand: IDeviceCommand, commandOptions: ICommandOptions) {
    const newDeviceCommand = adjustCommandToAPI(deviceCommand, commandOptions, this.deviceAPI);
    // this.precheckPowerState(deviceCommand, commandOptions);

    try {
      const { deviceState } = await this.deviceInterface.sendCommand(newDeviceCommand, commandOptions) as ICompleteResponse;
      return deviceState;
    }
    catch (e) {
      // console.log("writeCommand ERROR: ", e)
    }
  }

  public setLightColor(color: IAnimationColorStep) {
    const COLOR = {
      red: 0,
      green: 0,
      blue: 0,
      warmWhite: 0,
      coldWhite: 0
    }
    for (const colorKey in color) {
      COLOR[colorKey] = color[colorKey];
    }
    const deviceCommand: IDeviceCommand = { isOn: true, RGB: { red: COLOR.red, green: COLOR.green, blue: COLOR.blue }, CCT: { warmWhite: COLOR.warmWhite, coldWhite: COLOR.coldWhite } }
    const commandOptions: ICommandOptions = { waitForResponse: false, maxRetries: 0, remainingRetries: 0, commandType: COMMAND_TYPE.COLOR_COMMAND, timeoutMS: 50, isEightByteProtocol: this.getCachedDeviceInformation().deviceAPI.isEightByteProtocol, colorAssist: true }
    // console.log(this.controller.getCachedDeviceInformation().protoDevice.uniqueId);
    this.setAllValues(deviceCommand, commandOptions);
  };

  private precheckPowerState(deviceCommand: IDeviceCommand, commandOptions: ICommandOptions) {
    if (this.first && this.deviceAPI.needsPowerCommand && !this.deviceState.isOn && deviceCommand.isOn) {
      this.deviceInterface.sendCommand({ isOn: true, RGB: null, CCT: null }, { commandType: POWER_COMMAND, waitForResponse: false, maxRetries: 0, timeoutMS: 50 }).then(res => res).catch(e => {
        // throw e
        console.log("precheckPowerState Error: ", e)
      });
      this.first = false;
      this.overwriteLocalState({ isOn: true } as IDeviceState)
    }
  }

  public async fetchStateRGB(timeout: number = 500): Promise<IDeviceState> {
    let scans = 0, completeResponse: ICompleteResponse;
    do {
      try {
        completeResponse = await this.deviceInterface.queryState(timeout)

      } catch (e) {
        // console.log("fetchState ERROR: ", e)
      }
      scans++;
    } while (completeResponse?.deviceState == null && scans < 5)
    if (typeof completeResponse == 'undefined') throw 'no response given';

    this.overwriteLocalState(completeResponse.deviceState);
    return completeResponse.deviceState;
  }

  // public async fetchStateHSV(timeout: number = 500): Promise<IDeviceState> {
  //   let scans = 0, completeResponse: ICompleteResponse;
  //   do {
  //     try {
  //       completeResponse = await this.deviceInterface.queryState(timeout)

  //     } catch (e) {
  //       console.log("fetchState ERROR: ", e)
  //     }
  //     scans++;
  //   }
  //   while (completeResponse?.deviceState == null && scans < 5)
  //   if (typeof completeResponse == 'undefined') throw 'no response given';
  // }

  private overwriteLocalState(deviceState: IDeviceState): void {

    try {
      overwriteDeep(this.deviceState, deviceState);
      overwriteDeep(this.lastOutboundState, deviceState);
    } catch (error) {
      console.log("MH PLATFORM ERROR: ", error)
    }
  }

  // public cacheCurrentLightState() {
  //   this.LEDStateTemporary = this.deviceState.LEDState;
  // }

  // public async restoreCachedLightState(_commandOptions?: ICommandOptions): Promise<ICommandResponse> {
  //   this.deviceState.LEDState = this.LEDStateTemporary;
  //   const deviceCommand: IDeviceCommand = this.deviceState.LEDState;
  //   return await this.processCommand(deviceCommand, _commandOptions)
  // }

  public getCachedDeviceInformation(): IDeviceInformation {
    return { deviceAPI: this.deviceAPI, protoDevice: this.protoDevice, deviceState: this.deviceState, deviceMetaData: this.deviceMetaData };
  }

  public getLastOutboundState(): IDeviceState {
    if (!this.initalized) {
      this.lastOutboundState = mergeDeep({}, this.deviceState);
      this.initalized = true;
    }
    return this.lastOutboundState;
  }

  public getDeviceState(): IDeviceState {
    return this.deviceState;
  }
}

