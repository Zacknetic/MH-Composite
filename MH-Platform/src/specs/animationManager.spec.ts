import { expect } from 'chai';
import sinon from 'sinon';
import { ControllerGenerator } from '../ControllerGenerator';
import { rainbow, raining, thunderStruck } from '../animation/animationLibrary';
import { BaseController } from '../BaseController';
import { ICompleteDevice } from '..';
import { AnimationManager } from '../animation/animationManager';
const controllerGenerator = new ControllerGenerator();

let onlineDevices;

async function generateControllers() {
    const completedDevices: ICompleteDevice[] = await controllerGenerator.discoverCompleteDevices().catch(e => { console.log(e) }) as ICompleteDevice[];
    const basecontrollers = controllerGenerator.generateControllers(completedDevices);

    onlineDevices = basecontrollers.filter((controller: BaseController) => {
        return controller.getCachedDeviceInformation().protoDevice.uniqueId == 'DC4F22CF7C31';
    });
}

describe('Test the AnimationManager class', function () {
    const animationBlueprints = [thunderStruck, rainbow];

    before(async () => {
        await generateControllers();

    });



    afterEach(done => {
        setTimeout(done, 100);
    });

    it('Should have online devices', function () {
        expect(onlineDevices.length).to.be.greaterThan(0);
    });


    it('Should create AnimationManager with the given lights and animationBlueprints', function () {
        const lights = onlineDevices;
        const animationManager = AnimationManager.getInstance(lights, animationBlueprints);
        expect(animationManager).to.be.instanceOf(AnimationManager);
    });

    it('Should start ticks for AnimationManager', function () {
        const lights = onlineDevices;
        const animationManager = AnimationManager.getInstance(lights, animationBlueprints);
        lights.forEach(light => {
            animationManager.addLightToAnimationLoop(light, animationBlueprints);
            animationBlueprints.forEach(animationBlueprint => {
                light.appendAnimationList(animationBlueprint.name);
            });
        });
        animationManager.activateAnimationLoopByName(['rainbow', 'thunderStruck']);

        setTimeout(() => {
            animationManager.deactivateAnimationLoopByName(['rainbow', 'thunderStruck']);
        }, 10000);
        // Add your custom logic to check if the ticks have started successfully
    });





    it('Should have lights with thunderStruck and rainbow animations', function () {
        onlineDevices.forEach(controller => {
            expect(controller.getAnimationList()).to.include.members(['thunderStruck', 'rainbow']);
        });
    });
});
