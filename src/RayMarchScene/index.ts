import {Vector3} from '../threeJsMath/Vector3';
import {RayMarchRenderMode} from './type';
import {buildRaymarchScene} from './webGL';
const {max} = Math;

interface Action {
    setCameraPosition: Vector3;
    setCameraRotation: Vector3;
    setRenderMode: RayMarchRenderMode;
}

export class RayMarchScene {

    public get cameraPosition() { return this._cameraPosition; }
    public get cameraRotation() { return this._cameraRotation; }

    public get delay() { return this._delay; }
    public set delay(v: number) {
        if (Number.isInteger(v) && v > 0)
            this._delay = v;
    }

    private draw: Exclude<ReturnType<typeof buildRaymarchScene>, undefined>;

    private renderMode: RayMarchRenderMode = RayMarchRenderMode.DEMO;
    private lastUpdateStart: number = 0;
    private haveTask = false;

    private _delay = 15;

    constructor(
        convas: HTMLCanvasElement,
        private _cameraPosition: Vector3,
        private _cameraRotation = new Vector3(),
        cameraGate: number = .1,
        cameraDepth: number = 100,
    ) {
        const draw = buildRaymarchScene(convas, cameraGate, cameraDepth);
        if (!draw) throw new Error();

        this.draw = draw;

        this.update();
    }

    public sendAction(action: Partial<Action>) {

        if (!Object.keys(action).length) return;

        if (action.setCameraPosition) {
            this._cameraPosition = action.setCameraPosition;
        }
        if (action.setCameraRotation) {
            this._cameraRotation = action.setCameraRotation;
        }
        if (action.setRenderMode !== undefined) {
            this.renderMode = action.setRenderMode;
        }

        this.update();
    }

    private render() {
        this.draw(this._cameraPosition, this._cameraRotation, this.renderMode);
    }

    private async update() {
        const {_delay, lastUpdateStart} = this;
        const updateStart = Date.now();

        const timePast = updateStart - lastUpdateStart;

        if (timePast >= _delay) {
            this.render();

            this.lastUpdateStart = updateStart;
        } else {
            if (this.haveTask) return;
            this.haveTask = true;
            await sleep(max(_delay - timePast, 1));
            this.haveTask = false;
            this.update();
        }
    }

}

function sleep(t: number) { return new Promise(resolve => setTimeout(resolve, t)); }
