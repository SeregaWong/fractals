import React from 'react';
import './App.css';
import {KochSnowflake} from './ComponentFractal/KochSnowflake';
import {SierpinskiTriangle} from './ComponentFractal/SierpinskiTriangle';
import {ScreenItem} from './ScreenItem';
import {Simplex} from './Simplex';
import {Tabs} from './Tabs';

class App extends React.Component {

  private static instance?: App;

  constructor(props: {}) {
    if (App.instance) return App.instance;
    super(props);
    App.instance = this;
  }

  render() {

    let simplex: Simplex | null = null;

    return (
      <div className="App">

        <Tabs items={[{
          title: 'Koch snowflake',
          el: <ScreenItem><KochSnowflake level={300}/></ScreenItem>
        }, {
          title: 'Sierpinski triangle',
          el: <ScreenItem><SierpinskiTriangle level={600}/></ScreenItem>,
        }, {
          title: 'Sierpinski simplex',
          el: <ScreenItem><Simplex ref={(s) => simplex = s}/></ScreenItem>,
          onShow() { if (simplex) simplex.start(); },
          onHide() { if (simplex) simplex.stop(); },
        }]}/>
      </div>
    );
  }
}

export default App;
