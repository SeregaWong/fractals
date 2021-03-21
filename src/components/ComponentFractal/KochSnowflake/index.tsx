import React from "react";
import {ComponentFractal, ComponentFractalProps} from "../type";
import './style.css';

export class KochSnowflake extends React.Component<ComponentFractalProps> implements ComponentFractal  {

    public get boneElement(): JSX.Element {
        const {level} = this.props;

        if (level < 10) {
            const size = level / 3;

            return (<div className="Koch-base-part-container" style={{
                width: size * 3,
                height: size * KochSnowflake.hK
            }}>
                <div className="Koch-base-part Koch-base-part1"></div>
                <div className="Koch-base-part Koch-base-part2"></div>
                <div className="Koch-base-part Koch-base-part3"></div>
                <div className="Koch-base-part Koch-base-part4"></div>
            </div>);
        } else {
            return (<KochSnowflake level={level / 3}/>)
        }
    }

    private static hK = Math.sqrt(3) / 2;

    public createPattern() {
        const {boneElement, props: {level}} = this;

        return (<div className="Koch-container" style={{
            width: level * 3,
            height: level * KochSnowflake.hK,
        }}>
            <div className="Koch-element Koch-element1">{boneElement}</div>
            <div className="Koch-element Koch-element2">{boneElement}</div>
            <div className="Koch-element Koch-element3">{boneElement}</div>
            <div className="Koch-element Koch-element4">{boneElement}</div>
        </div>);
    }

    public render() {
        // return this.boneElement;
        return this.createPattern();
    }
}
