import React from "react";
import {ComponentFractal, ComponentFractalProps} from "../type";
import './style.css';

export class SierpinskiTriangle extends React.Component<ComponentFractalProps> implements ComponentFractal  {

    public get boneElement(): JSX.Element {
        const {level} = this.props;

        if (level < 10) {
            return (
                <div className="triangle">
                    <div className="triangle-part triangle-part1"></div>
                    <div className="triangle-part triangle-part2"></div>
                    <div className="triangle-part triangle-part3"></div>
                </div>
            );
        } else {
            return (<SierpinskiTriangle level={level / 2}/>)
        }
    }

    private static hK = Math.sqrt(3) / 2;

    public createPattern() {
        const {boneElement, props: {level}} = this;

        return (
            <div className="Sierpinski-container" style={{
                width: level,
                height: level * SierpinskiTriangle.hK,
            }}>
                <div className="Sierpinski-element Sierpinski-element1">{boneElement}</div>
                <div className="Sierpinski-element Sierpinski-element2">{boneElement}</div>
                <div className="Sierpinski-element Sierpinski-element3">{boneElement}</div>
            </div>
        );
    }

    public render() {
        return this.createPattern();
    }
}
