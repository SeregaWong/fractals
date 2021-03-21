
export interface ComponentFractalProps {
    level: number;
}

export interface ComponentFractal {
    readonly boneElement: JSX.Element;
    createPattern(): JSX.Element;
}

