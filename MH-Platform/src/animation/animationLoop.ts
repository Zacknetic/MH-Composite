import { AnimationStepKey, AnimationStepKeys, BaseController, IAnimationBlueprint, IAnimationColorStep, IAnimationSequenceRange, IAnimationSequenceStep } from "..";
import { calculateSequenceSteps, recursiveArrayToInt } from "./animationUtils";

type ActiveLoopValue = {
    currentStepIndex: number;
    animationSteps: IAnimationColorStep[];
    previousLoopEndStep: IAnimationColorStep;
    offsetDurationMS: number;
};

export class AnimationLoop {
    readonly name: string;
    readonly priority: number;
    readonly syncSequenceTimings: boolean;
    readonly syncSequenceColor: boolean;
    private lightOffsetDurationMS: number;
    readonly blueprintAnimationSequences: IAnimationSequenceRange[];
    readonly isSingularAnimationLoop: boolean;
    private currentAnimationOffsetDurationMS: number;
    private activeLoops: Map<AnimationStepKeys, ActiveLoopValue>;
    private STEP_INTERVAL_MS: number;
    associatedLightCount: number;
    public isActive: boolean;

    constructor(animationBlueprint: IAnimationBlueprint, lightIDs: Array<BaseController['id']>, STEP_INTERVAL_MS: number) {
        this.name = animationBlueprint.name;
        this.priority = animationBlueprint.priority;
        this.syncSequenceTimings = animationBlueprint.syncSequenceTimings;
        this.syncSequenceColor = animationBlueprint.syncSequenceColor;
        this.lightOffsetDurationMS = animationBlueprint.lightOffsetDurationMS;
        this.blueprintAnimationSequences = animationBlueprint.animationSequences;
        this.isSingularAnimationLoop = this.syncSequenceTimings && this.syncSequenceColor;
        this.STEP_INTERVAL_MS = STEP_INTERVAL_MS;
        this.associatedLightCount = 0;
        this.initialize(lightIDs);
        this.isActive = false;
    }

    private initialize(lightIDs: Array<BaseController['id']>) {
        this.currentAnimationOffsetDurationMS = 0;
        this.activeLoops = new Map();
        lightIDs.forEach(lightID => this.addLightToAnimationLoop(lightID));
        this.isActive = false;
    }

    public getAnimationStep(lightID: BaseController['id']): IAnimationColorStep {
        const animationID: AnimationStepKeys = this.isSingularAnimationLoop ? AnimationStepKey.ALL : lightID;
        const activeAnimation = this.activeLoops.get(animationID);
        const offsetIndex = this.calculateOffsetIndex(activeAnimation);

        return activeAnimation.animationSteps[offsetIndex];
    }

    private calculateOffsetIndex(activeAnimation: ActiveLoopValue): number {
        let offsetIndex = activeAnimation.currentStepIndex + (activeAnimation.offsetDurationMS / this.STEP_INTERVAL_MS);
        if (offsetIndex > activeAnimation.animationSteps.length) {
            offsetIndex = offsetIndex % activeAnimation.animationSteps.length;
        }
        return offsetIndex;
    }

    public addLightToAnimationLoop(lightID: BaseController['id'] | AnimationStepKey) {
        if (this.activeLoops.has(lightID)) return;

        this.associatedLightCount++;
        const animationID: AnimationStepKeys = this.isSingularAnimationLoop ? AnimationStepKey.ALL : lightID;
        this.initializeAnimationID(animationID);
    }

    public removeLightFromAnimationLoop(lightID: BaseController['id']) {
        if (!this.activeLoops.has(lightID)) return;

        if (this.associatedLightCount > 0) this.associatedLightCount--;
        this.activeLoops.delete(lightID);
        
    }

    public tickAllActiveLoops() {
        // if (this.associatedLightCount === 0) return false;
        this.activeLoops.forEach((_, key) => this.tickAnimation(key));
    }

    private tickAnimation(animationID: AnimationStepKeys) {
        if (this.associatedLightCount === 0) return;

        const activeAnimation = this.activeLoops.get(animationID);
        activeAnimation.currentStepIndex++;
        if (activeAnimation.currentStepIndex < 0 || activeAnimation.currentStepIndex >= activeAnimation.animationSteps.length) {
            this.generateAnimationSteps(animationID);
        }
    }

    private generateAnimationSteps(animationID: AnimationStepKeys): void {
        const activeAnimation = this.activeLoops.get(animationID);
        activeAnimation.currentStepIndex = 0;
        let previousSequenceEndStep: IAnimationColorStep = activeAnimation.previousLoopEndStep || { red: 0, green: 0, blue: 0, warmWhite: 0, coldWhite: 0 };

        const animationSteps: IAnimationColorStep[] = this.blueprintAnimationSequences.reduce((acc, sequence) => {
            if (Math.random() < sequence.skipChance) return acc;

            const flatSequence = recursiveArrayToInt<IAnimationSequenceStep>(sequence);
            flatSequence.startColor = flatSequence.startColor || previousSequenceEndStep;
            const steps = calculateSequenceSteps(flatSequence, this.STEP_INTERVAL_MS);

            previousSequenceEndStep = steps[steps.length - 1];
            return [...acc, ...steps];
        }, []);

        activeAnimation.animationSteps = animationSteps;
        activeAnimation.previousLoopEndStep = previousSequenceEndStep;
    }

    private initializeAnimationID(animationID: AnimationStepKeys) {
        if (!this.activeLoops.has(animationID)) {
            this.activeLoops.set(animationID, {
                currentStepIndex: -2,
                animationSteps: [],
                previousLoopEndStep: null,
                offsetDurationMS: this.currentAnimationOffsetDurationMS,
            });
            this.currentAnimationOffsetDurationMS += this.lightOffsetDurationMS;
        }
    }
}
