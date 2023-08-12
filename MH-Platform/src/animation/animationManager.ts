import { BaseController, IAnimationBlueprint, IAnimationColorStep } from "..";
import { AnimationLoop } from "./animationLoop";

type LightMapValue = { id: BaseController['id'], controller: BaseController };

export class AnimationManager {
    private static instance: AnimationManager | null = null;

    private lightMap: Map<BaseController['id'], LightMapValue>;
    private animationLoops: AnimationLoop[];
    private animationBlueprints: IAnimationBlueprint[];
    private startTime: number;
    private STEP_INTERVAL_MS: number;
    private numActiveAnimations: number;
    private ticksActive: boolean;

    private constructor(controllers: BaseController[], animationBlueprints: IAnimationBlueprint[], STEP_INTERVAL_MS: number = 20) {
        this.lightMap = new Map();
        controllers.forEach((controller) => this.lightMap.set(controller.id, { id: controller.id, controller }));
        this.STEP_INTERVAL_MS = STEP_INTERVAL_MS;
        this.animationLoops = [];
        this.animationBlueprints = animationBlueprints.sort((a, b) => a.priority - b.priority);
        this.animationBlueprints.forEach(animationBlueprint => this.generateAnimationLoopFromBlueprint(animationBlueprint));
        this.numActiveAnimations = 0;
    }

    public static getInstance(controllers?: BaseController[], animationBlueprints?: IAnimationBlueprint[], STEP_INTERVAL_MS: number = 20): AnimationManager {
        if (this.instance === null) {
            this.instance = new AnimationManager(controllers, animationBlueprints, STEP_INTERVAL_MS);
        }

        return this.instance;
    }

    public isAnimationLoopActiveByName(animationName: string): boolean {
        const animation = this.animationLoops.find(animation => animation.name === animationName);
        if (!animation) return false;
        return animation.isActive;
    }

    public activateAnimationLoopByName(animationName: string | string[]) {
        if (Array.isArray(animationName)) {
            animationName.forEach(animation => this.activateAnimationLoopByName(animation));
            return;
        }
        const animation = this.animationLoops.find(animation => animation.name === animationName);
        if (!animation) return;
        animation.isActive = true;
        this.numActiveAnimations++;
        if (!this.ticksActive) {
            this.startTicks();
        }
    }

    public deactivateAnimationLoopByName(animationName: string | string[]) {
        if (Array.isArray(animationName)) {
            animationName.forEach(animation => this.deactivateAnimationLoopByName(animation));
            return;
        }
        const animation = this.animationLoops.find(animation => animation.name === animationName);
        if (!animation) return;
        animation.isActive = false;
        this.numActiveAnimations--;
        if (this.numActiveAnimations <= 0) {
            this.stopTicks();
        }
    }

    private generateAnimationLoopFromBlueprint(animationBlueprint: IAnimationBlueprint) {
        const assignedLightsIds = Array.from(this.lightMap.values())
            .filter(light => light.controller.getAnimationList().includes(animationBlueprint.name))
            .map(light => light.id);

        const animation = new AnimationLoop(animationBlueprint, assignedLightsIds, this.STEP_INTERVAL_MS);
        this.animationLoops.push(animation);
        return animation;
    }

    public addLightToAnimationLoop(controller: BaseController, animationBlueprint: IAnimationBlueprint | IAnimationBlueprint[]) {
        if (Array.isArray(animationBlueprint)) {
            animationBlueprint.forEach(animation => this.addLightToAnimationLoop(controller, animation));
            return;
        }

        let animation = this.animationLoops.find(animation => animation.name === animationBlueprint.name);
        console.log(animation);
        if (!animation) {
            animation = this.generateAnimationLoopFromBlueprint(animationBlueprint);
        }
        animation.addLightToAnimationLoop(controller.id);
        controller.appendAnimationList(animationBlueprint.name);
        this.lightMap.set(controller.id, { id: controller.id, controller });
    }

    public removeLightFromAnimationLoop(controller: BaseController, animationBlueprint: IAnimationBlueprint | IAnimationBlueprint[]) {
        if (Array.isArray(animationBlueprint)) {
            animationBlueprint.forEach(animation => this.removeLightFromAnimationLoop(controller, animation));
            return;
        }

        const animation = this.animationLoops.find(animation => animation.name === animationBlueprint.name);
        if (!animation) return;
        animation.removeLightFromAnimationLoop(controller.id);
        controller.removeAnimationFromList(animationBlueprint.name);
        this.lightMap.delete(controller.id);
    }

    private startTicks() {
        this.ticksActive = true;
        this.startTime = this.getCurrentTime();
        this.tickAnimations();
    }

    private stopTicks() {
        this.ticksActive = false;
    }

    private tickAnimations() {
        if (!this.ticksActive) return;


        this.animationLoops.forEach(animation => {
            if (!animation.isActive) return;
            animation.tickAllActiveLoops()
        });

        this.tickLights();

        const currentTime = this.getCurrentTime();
        const elapsedTime = currentTime - this.startTime;
        this.startTime = currentTime;

        const timeoutDuration = elapsedTime >= this.STEP_INTERVAL_MS ? this.STEP_INTERVAL_MS : this.STEP_INTERVAL_MS - elapsedTime;
        setTimeout(this.tickAnimations.bind(this), timeoutDuration);
    }

    private tickLights() {
        this.lightMap.forEach((light) => {
            if (light.controller.manuallyControlled) return;

            const nextAnimation = this.getNextAnimation(light);
            const currentStep = nextAnimation ? nextAnimation.getAnimationStep(light.id) : this.getDefaultStep();
            light.controller.setLightColor(this.roundStepValues(currentStep));
        });
    }

    private getCurrentTime(): number {
        const hrtime = process.hrtime();
        return hrtime[0] * 1000 + hrtime[1] / 1e6;
    }

    private getNextAnimation(light: LightMapValue): AnimationLoop | undefined {
        return this.animationLoops.find(animation => light.controller.hasAnimation(animation.name) && this.isValidAnimationStep(animation, light.id));
    }

    private isValidAnimationStep(animation: AnimationLoop, lightId: BaseController['id']): boolean {
        const step = animation.getAnimationStep(lightId);
        return step !== undefined && Math.max(...Object.values(step)) > 0;
    }

    private getDefaultStep(): IAnimationColorStep {
        return { red: 0, green: 0, blue: 0, warmWhite: 0, coldWhite: 0 };
    }

    private roundStepValues(step: IAnimationColorStep): IAnimationColorStep {
        const roundedStep = { ...step };
        for (const key in roundedStep) {
            roundedStep[key] = Math.ceil(roundedStep[key]);
        }
        return roundedStep;
    }
}

