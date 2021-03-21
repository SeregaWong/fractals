import React from "react";

interface CanvasImageProps {
    width: number;
    height: number;
    buffer?: Uint8ClampedArray;
}

export class CanvasImage extends React.Component<CanvasImageProps> {

    private canvasCtx!: CanvasRenderingContext2D;

    public render() {
        this.updateImage();

        return (<canvas
            ref={(canvas => {
                if (!canvas) return;
                const ctx = canvas.getContext('2d');
                if (!ctx) return;

                const {props} = this;

                canvas.width = props.width;
                canvas.height = props.height;

                this.canvasCtx = ctx;
                this.updateImage();
            })}
        >
        </canvas>);
    }

    private updateImage() {
        const {props, canvasCtx} = this;

        if (!canvasCtx || !props.buffer) return;

        const idata = canvasCtx.createImageData(props.width, props.height);
        idata.data.set(props.buffer);
        canvasCtx.putImageData(idata, 0, 0);
    }
}
