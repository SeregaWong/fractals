import React from 'react';
import './index.css';

interface TabsProps {
    items: TabsItem[];
}

interface TabsState {
    selected: TabsItem;
}

interface TabsItem {
    title: string;
    el: JSX.Element;
    onShow?: () => void;
    onHide?: () => void;
}

export class Tabs extends React.Component<TabsProps, TabsState> {

    private items: Array<TabsItem & { wasSelectedOnce: boolean; }>;

    constructor(props: TabsProps) {
        super(props);
        const [first]: Tabs['items'] = this.items = this.props.items.map((el) => ({...el, wasSelectedOnce: false}));
        this.state = {selected: first};
        first.wasSelectedOnce = true;
    }

    render() {
        const {items, state: {selected}} = this;

        if (!items.length) throw new Error('have no items');

        return (<>
            <div
                className={'Tabs-options'}
            >
                {items.map((item, i) => {
                    let className = 'Tabs-option';
                    const isSelected = selected === item;

                    if (isSelected) {
                        className += ' Tabs-option-selected';
                    }

                    return (
                        <div
                            key={i}
                            className={className}
                            onClick={() => {
                                if (!isSelected) {
                                    item.wasSelectedOnce = true;
                                    if (item.onShow) item.onShow();
                                    if (selected.onHide) selected.onHide();
                                    this.setState({selected: item});
                                }
                            }}
                        >
                            {item.title}
                        </div>
                    );
                })}
            </div>
            {items.map((item, i) => {
                const style: React.HTMLAttributes<HTMLDivElement>['style'] = {};

                if (item !== selected) {
                    style.display = 'none';
                }

                return <div key={i} style={style}>{item.wasSelectedOnce && item.el}</div>;
            })}
        </>);
    }

}
