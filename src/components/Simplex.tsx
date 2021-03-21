import React from "react";
import {RayMarchScene} from "../RayMarchScene";
import {RayMarchRenderMode} from "../RayMarchScene/type";
import {Vector3} from '../threeJsMath/Vector3';

export class Simplex extends React.Component {

    public width = 900;
    public height = 900;

    public get isAnimationPlaying() {
        return !!this.animate;
    }

    private scene?: RayMarchScene;
    private cameraPosition = new Vector3(0, 0, -2);
    private cameraRotation = new Vector3();

    private lastMouseMoveEvent?: React.MouseEvent<HTMLDivElement, MouseEvent>;
    private leftMouseDown = false;
    private rightMouseDown = false;
    private keysDown: {[key in string]: boolean} = {};

    private renderMode: RayMarchRenderMode = RayMarchRenderMode.DEMO;

    private loopIntervalId?: NodeJS.Timeout;

    private animate?: () => void;

    private static instance?: Simplex;

    constructor() {
        super({});
        if (Simplex.instance) return Simplex.instance;
        this.state = {};

        document.body.addEventListener('keydown', this.buildKeyDownEventHandler(true));
        document.body.addEventListener('keyup', this.buildKeyDownEventHandler());

        this.start();
        Simplex.instance = this;
    }

    public start() {
        if (!this.loopIntervalId) {
            if (!this.animate) {
                this.createAnimation();
            }

            this.loopIntervalId = setInterval(() => { this.loop(); }, 15);
        }
    }

    public stop() {
        if (this.loopIntervalId) {
            clearInterval(this.loopIntervalId);
            delete this.loopIntervalId;
        }
    }

    public render() {

        return (
        <div
            onContextMenu={(e) => e.preventDefault()}
            onMouseDown={(e) => {
                if (e.button === 0) {
                    this.leftMouseDown = true;
                }
                if (e.button === 2) {
                    this.rightMouseDown = true;
                }
            }}
            onMouseUp={(e) => {
                if (e.button === 0) {
                    this.leftMouseDown = false;
                }
                if (e.button === 2) {
                    this.rightMouseDown = false;
                }
            }}
            onMouseMove={(e) => {
                const {lastMouseMoveEvent} = this;
                if (lastMouseMoveEvent) {
                    const {cameraRotation, leftMouseDown, rightMouseDown} = this;

                    if (leftMouseDown || rightMouseDown) this.stopAnimation();

                    if (leftMouseDown) {
                        const kk = 700;
                        this.rotateCameraAroundCenter(- e.movementY / kk, e.movementX / kk);
                    } else if (rightMouseDown) {
                        const k = 700;
                        cameraRotation.x += e.movementY / k;
                        cameraRotation.y += e.movementX / k;
                        cameraRotation.z = 0;
                        this.renderMode = RayMarchRenderMode.FREE_FLY;
                        this.updateCamera();
                    }
                }

                this.lastMouseMoveEvent = e;
            }}
            onWheel={(e) => {
                const {cameraPosition} = this;

                cameraPosition
                    .setLength((e.deltaY / 1000 + 1) * cameraPosition.length());

                this.updateCamera();
            }}
        >
            <canvas
                width={this.width}
                height={this.height}
                ref={(canvas) => {
                    if (!canvas) return;
                    this.scene = new RayMarchScene(
                        canvas,
                        this.cameraPosition,
                        this.cameraRotation,
                    );
                }}
            />
        </div>
        );
    }

    private stopAnimation() {
        if (this.animate) {
            if (this.scene) this.scene.delay = 15;
            delete this.animate;
        }
    }

    private createAnimation() {
        if (this.scene) this.scene.delay = 1;

        this.renderMode = RayMarchRenderMode.DEMO;
        this.cameraPosition = new Vector3(0, 0.7348199607436225, -2.3677532068405616);
        this.rotateCameraAroundCenter(-.2, 0);

        const frames = 800;
        const framesPlusOne = frames + 1;
        let t = 0;
        this.animate = () => {


            if (t === framesPlusOne) t = 0;

            this.rotateCameraAroundCenter(
                Math.cos(Math.PI * t / frames) / 600,
                .01,
            );

            t++;
        };
    }


    private buildKeyDownEventHandler(setKey = false) {
        const {keysDown} = this;

        return function (e: KeyboardEvent) {
            if (/key[a-z]/i.test(e.code)) {
                const keyCode = e.code.slice(3).toLowerCase();
                keysDown[keyCode] = setKey;
            }
        };
    }

    private loop() {
        const {keysDown} = this;

        if (this.animate) this.animate();
        if (!Object.values(keysDown).includes(true)) return;

        const addPos = new Vector3();
        for (const key in keysDown) {
            if (keysDown[key]) {
                switch (key) {
                    case 'w': addPos.z += 1; break;
                    case 's': addPos.z -= 1; break;
                    case 'a': addPos.x -= 1; break;
                    case 'd': addPos.x += 1; break;
                    case 'q': addPos.y += 1; break;
                    case 'e': addPos.y -= 1; break;
                }
            }
        }
        if (!addPos.manhattanLength()) return;
        this.stopAnimation();
        this.renderMode = RayMarchRenderMode.FREE_FLY;

        const {cameraRotation} = this;

        addPos.setLength(.01);
        addPos.applyAxisAngle(Vector3.xBase, cameraRotation.x);
        addPos.applyAxisAngle(Vector3.yBase, cameraRotation.y);
        addPos.applyAxisAngle(Vector3.zBase, cameraRotation.z);

        this.cameraPosition.add(addPos);
        this.updateCamera();
    }


    private setRotationToCenter(updete = true) {
        const direction = new Vector3()
            .sub(this.cameraPosition)
            .normalize();

        const {cameraRotation} = this;

        const xS = direction.x >= 0, yS = direction.y > 0;

        if (xS) {
            direction.x *= -1;
            direction.z *= -1;
        }

        cameraRotation.y = (new Vector3(direction.x, 0, direction.z)).angleTo(Vector3.zBase);
        direction.applyAxisAngle(Vector3.yBase, cameraRotation.y);

        cameraRotation.x = direction.angleTo(Vector3.zBase);

        if (xS) {
            cameraRotation.y = Math.PI - cameraRotation.y;
        } else {
            cameraRotation.y *= -1;
        }
        if (yS) {
            cameraRotation.x *= -1;
        }

        if (updete)
            this.updateCamera();
    }

    private rotateCameraAroundCenter(x: number, y: number) {
        const {cameraPosition} = this;
        cameraPosition
            .applyAxisAngle(Vector3.yBase, y)
            .applyAxisAngle(
                new Vector3(cameraPosition.x, 0, cameraPosition.z)
                    .applyAxisAngle(Vector3.yBase, Math.PI / 2),
                x,
            );
        this.setRotationToCenter(false);
        this.updateCamera();
    }

    private updateCamera() {
        if (this.scene) {
            this.scene.sendAction({
                setCameraPosition: this.cameraPosition,
                setCameraRotation: this.cameraRotation,
                setRenderMode: this.renderMode,
            });
        }
    }
}
