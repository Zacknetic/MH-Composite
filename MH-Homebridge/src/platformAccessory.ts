import type {
  API,
  Service,
  PlatformConfig,
  CharacteristicValue,
  HAP,
  Logging,
} from "homebridge";

import { TBtoCCT, HSVtoRGB, RGBtoHSV, CCTtoTB } from "./misc/utils";
import {
  DEFAULT_ACCESSORY_STATE,
  IAccessoryCommand,
  IAccessoryState,
  IColorHSV,
  IColorTB,
  IConfigOptions,
  IPartialAccessoryCommand,
  MagicHomeAccessory,
} from "./misc/types";
import {
  BaseController,
  ICommandOptions,
  IDeviceCommand,
  IDeviceState,
  mergeDeep,
  overwriteDeep,
  COMMAND_TYPE,
  COLOR_MASKS,
} from "magichome-platform";

export class HomebridgeMagichomeDynamicPlatformAccessory {
  protected service: Service;
  protected readonly hap: HAP;

  protected adaptiveLightingService;
  protected newAccessoryCommand: IPartialAccessoryCommand = {};
  protected latestAccessoryCommand: IAccessoryCommand;
  protected debounceTimer: NodeJS.Timeout | null = null;

  public accessoryState: IAccessoryState;

  protected colorWhiteSimultaniousSaturationLevel;
  protected colorOffSaturationLevel;
  protected simultaniousDevicesColorWhite;

  protected recentlyControlled = false;
  protected currentlyAnimating = false;

  protected queue;
  protected lastValue: number;
  public uuid: string;
  lastHue: number;
  lastBrightness: number;
  waitingSendoff: boolean;
  resistOff: boolean;
  HSVTimeout: NodeJS.Timeout;
  processAccessoryCommandTimeout: NodeJS.Timeout;
  useBackupHSV: boolean;
  backupHSV: any;
  backupAccessoryState: any;
  protected skipNextAccessoryStatusUpdate: boolean = false;
  periodicScanTimeout: NodeJS.Timeout;
  CustomCharacteristics: any;
  UUID_CCT: string;

  //=================================================
  // Start Constructor //

  constructor(
    protected readonly api: API,
    protected readonly accessory: MagicHomeAccessory,
    public readonly config: PlatformConfig,
    protected readonly controller: BaseController,
    protected readonly hbLogger: Logging,
    protected readonly logs
  ) {
    this.UUID_CCT = "a9a59a9f-9b8f-45d7-84b6-eeb848a8d05a";
    this.setupMisc();
    this.accessoryState = mergeDeep({}, DEFAULT_ACCESSORY_STATE);
    this.logs = logs;
    this.controller = controller;
    this.hap = api.hap;
    this.api = api;
    this.config = config;
    this.initializeCharacteristics();
    this.fetchDeviceState(2);
    this.lastValue = this.accessoryState.HSV.value;
    this.uuid = this.accessory.UUID;
  }

  async setOn(value: CharacteristicValue) {
    this.accessoryState.isOn = value as boolean;
    const partialAccessoryCommand: IPartialAccessoryCommand = {
      isOn: value as boolean,
      isPowerCommand: true,
    };
    this.processAccessoryCommand(partialAccessoryCommand);
  }

  setHue(value: CharacteristicValue) {
    this.accessoryState.HSV.hue = value as number;
    this.scheduleAccessoryCommand();
  }

  async setSaturation(value: CharacteristicValue) {
    this.accessoryState.HSV.saturation = value as number;
    this.scheduleAccessoryCommand();
  }

  async setValue(value: CharacteristicValue) {
    this.accessoryState.HSV.value = value as number;
    this.scheduleAccessoryCommand();
  }

  setColorTemperature(value: CharacteristicValue) {
    this.accessoryState.TB.temperature = value as number;
    this.scheduleAccessoryCommand();
  }

  private scheduleAccessoryCommand() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.processAccessoryCommand(this.accessoryState);
    }, 100); // 100 milliseconds debounce time
  }

  setConfiguredName(value: CharacteristicValue) {
    const name: string = value.toString();
    this.logs.warn(`Renaming device to ${name}`);
    this.accessory.context.displayName = name;
    this.api.updatePlatformAccessories([this.accessory]);
  }

  identifyLight() {
    this.flashEffect();
  }

  getHue() {
    // return new Promise((resolve) => {
    //   setTimeout(async () => {
    const {
      HSV: { hue },
    } = this.accessoryState;
    //     resolve(hue);
    //   }, 50)
    // });
    return hue;
  }

  getSaturation() {
    // return new Promise((resolve) => {
    //   setTimeout(async () => {
    const {
      HSV: { saturation },
    } = this.accessoryState;
    //     resolve(saturation);
    //   }, 50)
    // });
    return saturation;
  }

  getValue() {
    // return new Promise((resolve) => {
    //   setTimeout(async () => {
    const {
      HSV: { value },
    } = this.accessoryState;
    //     resolve(value);
    //   }, 50)
    // });
    return value;
  }

  getOn() {
    // return new Promise((resolve) => {
    //   setTimeout(async () => {
    const { isOn } = this.accessoryState;
    // resolve(isOn);
    // }, 100)
    // });
    return isOn;
  }

  getColorTemperature() {
    const {
      TB: { temperature },
    } = this.deviceStateToAccessoryState(
      this.controller.getLastOutboundState()
    );
    this.fetchDeviceState(5);
    return temperature;
  }

  // logValue(valueType: string, value: any) {
  //   console.log(`${valueType} value: ${value}`);
  // }

  flashEffect() {
    //
  } //flashEffect

  //=================================================
  // End LightEffects //

  protected processAccessoryCommand(
    partialAccessoryCommand: IPartialAccessoryCommand
  ) {
    try {
      this.skipNextStatusUpdate();

      this.waitingSendoff = false;
      const sanitizedAcessoryCommand = this.completeAccessoryCommand(
        partialAccessoryCommand
      );
      if (partialAccessoryCommand.isPowerCommand) {
        this.controller.setOn(sanitizedAcessoryCommand.isOn);
      } else {
        const { deviceCommand, commandOptions } =
          this.accessoryCommandToDeviceCommand(sanitizedAcessoryCommand);
        this.sendCommand(
          deviceCommand,
          commandOptions,
          sanitizedAcessoryCommand
        );
      }
    } catch (error) {
      // console.log('processAccessoryCommand: ', error);
    }
  }

  protected async skipNextStatusUpdate() {
    if (this.skipNextAccessoryStatusUpdate) return;
    this.skipNextAccessoryStatusUpdate = true;

    await new Promise((resolve) => setTimeout(resolve, 1000));
    setTimeout(() => {
      this.skipNextAccessoryStatusUpdate = false;
    }, 550);
  }

  public setBackupAccessoryState() {
    this.backupAccessoryState = mergeDeep({}, this.accessoryState);
  }

  public restoreBackupAccessoryState() {
    if (this.backupAccessoryState) {
      this.processAccessoryCommand(this.backupAccessoryState);
      this.updateStateHomekitCharacteristic();
    }
  }

  protected completeAccessoryCommand(
    partialAccessoryCommand: IPartialAccessoryCommand
  ): IAccessoryCommand {
    // this.logs.debug(this.accessory.context.displayName, '\n Current State:', this.accessoryState, '\n Received Command', this.newAccessoryCommand);
    const sanitizedAcessoryCommand: IAccessoryCommand = mergeDeep(
      {},
      partialAccessoryCommand,
      this.accessoryState
    );
    if (
      partialAccessoryCommand.hasOwnProperty("isOn") &&
      !(
        partialAccessoryCommand.hasOwnProperty("HSV") ||
        partialAccessoryCommand.hasOwnProperty("brightness")
      )
    ) {
      sanitizedAcessoryCommand.isPowerCommand = true;
    }
    return sanitizedAcessoryCommand;
  }

  protected accessoryCommandToDeviceCommand(
    accessoryCommand: IAccessoryCommand
  ): { deviceCommand: IDeviceCommand; commandOptions: ICommandOptions } {
    let {
      isOn,
      HSV: { hue, saturation, value },
      TB,
    } = accessoryCommand;
    const { brightness } = TB;
    isOn = Math.max(brightness, value) > 0;

    const commandOptions: ICommandOptions = {
      colorAssist: true,
      commandType: COMMAND_TYPE.COLOR_COMMAND,
      waitForResponse: true,
      maxRetries: 5,
      timeoutMS: 50,
    };

    let red,
      green,
      blue,
      warmWhite,
      coldWhite,
      colorMask = null;
    colorMask = COLOR_MASKS.BOTH;

    if (saturation < 95) {
      ({ warmWhite, coldWhite } = TBtoCCT({
        temperature: hue + 140,
        brightness: value,
      }));
      ({ red, green, blue } = HSVtoRGB({
        hue,
        saturation: 100,
        value: this.lastValue,
      }));

      if (saturation < 5) {
        this.lastValue = value;
        (red = 0), (green = 0), (blue = 0);
        colorMask = COLOR_MASKS.WHITE;
      }
    } else {
      colorMask = COLOR_MASKS.COLOR;
      this.lastValue = value;
      ({ red, green, blue } = HSVtoRGB({ hue, saturation, value }));
      warmWhite = 0;
      coldWhite = 0;
    }

    const deviceCommand: IDeviceCommand = {
      isOn,
      RGB: { red, green, blue },
      colorMask,
      CCT: { warmWhite, coldWhite },
    };
    return { deviceCommand, commandOptions };
  }

  setBackupHSV(HSV) {
    this.backupHSV = HSV;
    this.useBackupHSV = true;
  }

  getBackupHSV(reset = false) {
    if (reset) this.useBackupHSV = false;
    return this.backupHSV;
  }

  protected sendCommand(
    deviceCommand: IDeviceCommand,
    commandOptions: ICommandOptions,
    accessoryCommand
  ) {
    this.logs.trace(
      `[Trace] [${this.accessory.context.displayName}] - Outgoing Command:`,
      deviceCommand
    );
    try {
      this.controller.setAllValues(deviceCommand, commandOptions);
    } catch (error) {
      // console.log("sendCommand ERROR: ", error);
    }
    this.logs.trace(
      `[Trace] [${this.accessory.context.displayName}] - After sending command, received response from device:`
    );
  }

  updateStateHomekitCharacteristic() {
    if (this.waitingSendoff) return;
    // console.log(deviceState)
    // const { isOn, HSV: { hue, saturation, value }, TB: { brightness, temperature } } = this.deviceStateToAccessoryState(deviceState);
    // console.log(isOn, hue, saturation, value, brightness, temperature)
    const {
      isOn,
      HSV: { hue, saturation, value },
      TB: { brightness, temperature },
    } = this.accessoryState;

    this.service.updateCharacteristic(this.hap.Characteristic.On, isOn);
    this.service.updateCharacteristic(
      this.hap.Characteristic.Saturation,
      saturation
    );
    this.service.updateCharacteristic(this.hap.Characteristic.Hue, hue);
    this.service.updateCharacteristic(
      this.hap.Characteristic.Brightness,
      value
    );
  }

  public async fetchDeviceState(
    attempts = 1,
    updateHomekit = false,
    restrictedToCharacteristics: string[] = []
  ) {
    let deviceState: IDeviceState;
    let accessoryState: IAccessoryState;
    try {
      deviceState = await this.controller.fetchStateRGB();
      accessoryState = this.deviceStateToAccessoryState(
        deviceState,
        restrictedToCharacteristics
      );
      overwriteDeep(this.accessoryState, accessoryState);
      // if (updateHomekit) {
      this.updateStateHomekitCharacteristic();
      // }
    } catch (error) {
      // console.log("fetchDeviceState ERROR: ", error);
      if (attempts > 0) {
        setTimeout(() => {
          this.fetchDeviceState(
            attempts - 1,
            updateHomekit,
            restrictedToCharacteristics
          );
        }, 500);
      } else {
        this.hbLogger.warn(
          `Failed to fetch and update state for ${this.accessory.context.displayName}: ${error}`
        );
      }
    }
    if (!deviceState) {
      this.hbLogger.warn(
        `Failed to fetch and update state for ${this.accessory.context.displayName}`
      );
    }
  }

  deviceStateToAccessoryState(
    deviceState: IDeviceState,
    restrictedToCharacteristics: string[] = []
  ): IAccessoryState {
    if (!deviceState) {
      // throw 'device state not provided';
    }
    const { RGB, CCT, isOn } = deviceState;
    const { red, green, blue } = RGB;
    const {
      deviceAPI: { hasBrightness, hasCCT, hasColor, simultaneousCCT },
    } = this.controller.getCachedDeviceInformation();

    let HSV: IColorHSV = RGBtoHSV(RGB);
    let TB: IColorTB = CCTtoTB(CCT);
    // if (!simultaneousCCT) {
    if (Math.max(red, green, blue) <= 0) {
      HSV = { hue: 5, saturation: 4, value: TB.brightness };
    }
    // }

    let accessoryState = {
      isOn: null,
      HSV: { hue: null, saturation: null, value: null },
      TB: { brightness: null, temperature: null },
    };

    if (
      restrictedToCharacteristics.includes("isOn") ||
      restrictedToCharacteristics.includes("Hue") ||
      restrictedToCharacteristics.includes("Value")
    ) {
      if (restrictedToCharacteristics.includes("isOn"))
        accessoryState.isOn = isOn;
      if (restrictedToCharacteristics.includes("Hue"))
        accessoryState.HSV.hue = HSV.hue;
      if (restrictedToCharacteristics.includes("Value"))
        accessoryState.HSV.value = HSV.value;
      mergeDeep(accessoryState, this.accessoryState);
    } else accessoryState = { HSV, TB, isOn };
    if (accessoryState.HSV.value < 1) {
      accessoryState.HSV.value = TB.brightness;
    }
    return accessoryState;
  }

  initializeCharacteristics() {
    const {
      deviceAPI: { hasBrightness, hasCCT, hasColor, simultaneousCCT },
    } = this.controller.getCachedDeviceInformation();

    this.addAccessoryInformationCharacteristic();

    this.logs.trace(
      `[Trace] [${this.accessory.context.displayName}] - Adding Lightbulb service to accessory.`
    );
    this.service =
      this.accessory.getService(this.hap.Service.Lightbulb) ??
      this.accessory.addService(this.hap.Service.Lightbulb);

    if (hasColor) {
      this.addHueCharacteristic();
      this.addSaturationCharacteristic();
    }

    if (hasBrightness) {
      this.addBrightnessCharacteristic();
    }

    if (simultaneousCCT) {
      this.addColorTemperatureCharacteristic();
    }

    if (!hasBrightness) {
      this.logs.trace(
        `[Trace] [${this.accessory.context.displayName}] - Adding Switch service to accessory.`
      ); //device is switch, register it as such
      this.service =
        this.accessory.getService(this.hap.Service.Switch) ??
        this.accessory.addService(this.hap.Service.Switch);
    }
    this.addOnCharacteristic();
    this.addConfiguredNameCharacteristic();
  }

  setupMisc() {
    // const localAccessoryOptions = new Map(Object.entries(this.config?.individualAccessoryOptions)).get(this.accessory.context.displayName?? "unknown");
    // const { colorOffSaturationLevel, colorWhiteSimultaniousSaturationLevel, logLevel } = Object.assign({}, this.config.globalAccessoryOptions, localAccessoryOptions);
    // this.colorWhiteSimultaniousSaturationLevel = colorWhiteSimultaniousSaturationLevel;
    // this.colorOffSaturationLevel = colorOffSaturationLevel;
    // this.logs = new Logs(this.hbLogger, logLevel ?? 3);
  }

  getController() {
    return this.controller;
  }

  addOnCharacteristic() {
    this.logs.trace(
      `[Trace] [${this.accessory.context.displayName}] - Adding On characteristic to service.`
    );
    this.service
      .getCharacteristic(this.hap.Characteristic.On)
      .onSet(this.setOn.bind(this));
    // .onGet(this.getOn.bind(this));
  }

  addHueCharacteristic() {
    this.logs.trace(
      `[Trace] [${this.accessory.context.displayName}] - Adding Hue characteristic to service.`
    );
    this.service
      .getCharacteristic(this.hap.Characteristic.Hue)
      .onSet(this.setHue.bind(this))
      .onGet(this.getHue.bind(this));
  }

  addSaturationCharacteristic() {
    this.logs.trace(
      `[Trace] [${this.accessory.context.displayName}] - Adding Saturation characteristic to service.`
    );
    this.service
      .getCharacteristic(this.hap.Characteristic.Saturation)
      .onSet(this.setSaturation.bind(this))
      .onGet(this.getSaturation.bind(this));
  }

  addBrightnessCharacteristic() {
    this.logs.trace(
      `[Trace] [${this.accessory.context.displayName}] - Adding Brightness characteristic to service.`
    );
    this.service
      .getCharacteristic(this.hap.Characteristic.Brightness)
      .onSet(this.setValue.bind(this))
      .onGet(this.getValue.bind(this));

    if (
      this.controller.getCachedDeviceInformation().deviceAPI.simultaneousCCT
    ) {
      // console.log('adding CCT');
      // this.service.getCharacteristic(CustomHomeKitTypes.CCT)
      //   // this.service2.getCharacteristic(this.hap.Characteristic.Brightness)
      //   .onSet(this.setHue2.bind(this));
      // .onGet(this.getHue2.bind(this));
      // this.service.getCharacteristic(this.CustomCharacteristics.CCT)
      //   // this.service2.getCharacteristic(this.hap.Characteristic.Brightness)
      //   .onSet(this.setBrightness2.bind(this))
      //   // .onGet(this.getBrightness2.bind(this));
    }
  }

  addColorTemperatureCharacteristic() {
    this.logs.trace(
      `[Trace] [${this.accessory.context.displayName}] - Adding Color Temperature characteristic to service.`
    );
    // this.service2.getCharacteristic(this.hap.Characteristic.ColorTemperature)
    //   // .onSet(this.setColorTemperature.bind(this))
    //   .onGet(this.getColorTemperature.bind(this));

    if (
      this.api.versionGreaterOrEqual &&
      this.api.versionGreaterOrEqual("1.3.0-beta.46")
    ) {
      this.logs.trace(
        `[Trace] [${this.accessory.context.displayName}] - Adding Adaptive Lighting service to accessory.`
      );
      // this.adaptiveLightingService = new this.api.hap.AdaptiveLightingController(this.service2);
      // this.accessory.configureController(this.adaptiveLightingService);
    }
  }

  addAccessoryInformationCharacteristic() {
    const {
      protoDevice: { uniqueId, modelNumber },
      deviceMetaData: { controllerFirmwareVersion, controllerHardwareVersion },
    } = this.controller.getCachedDeviceInformation();
    // set accessory information
    this.accessory
      .getService(this.hap.Service.AccessoryInformation)!
      .setCharacteristic(this.hap.Characteristic.Manufacturer, "MagicHome")
      // .setCharacteristic(this.hap.Characteristic.SerialNumber, uniqueId)
      // .setCharacteristic(this.hap.Characteristic.Model, modelNumber)
      // .setCharacteristic(this.hap.Characteristic.HardwareRevision, controllerHardwareVersion?.toString(16) ?? 'unknown')
      // .setCharacteristic(this.hap.Characteristic.FirmwareRevision, controllerFirmwareVersion?.toString(16) ?? 'unknown ')
      .getCharacteristic(this.hap.Characteristic.Identify)
      .removeAllListeners(this.hap.CharacteristicEventTypes.SET)
      .removeAllListeners(this.hap.CharacteristicEventTypes.GET)
      .on(this.hap.CharacteristicEventTypes.SET, this.identifyLight.bind(this)); // SET - bind to the 'Identify` method below

    this.accessory
      .getService(this.hap.Service.AccessoryInformation)!
      .addOptionalCharacteristic(this.hap.Characteristic.ConfiguredName);
  }

  addConfiguredNameCharacteristic() {
    if (
      !this.service.testCharacteristic(this.hap.Characteristic.ConfiguredName)
    ) {
      this.service
        .addCharacteristic(this.hap.Characteristic.ConfiguredName)
        .onSet(this.setConfiguredName.bind(this));
    } else {
      this.service
        .getCharacteristic(this.hap.Characteristic.ConfiguredName)
        .onSet(this.setConfiguredName.bind(this));
    }
    this.logs.trace(
      `[Trace] [${this.accessory.context.displayName}] - Adding Configured Name characteristic to service.`
    );
  }
} // ZackneticMagichomePlatformAccessory class

const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
