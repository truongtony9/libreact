import {Component, cloneElement} from 'react';
import {h} from '../util';
import renderProp from '../util/renderProp';

export interface IExitSensorProps {
  children?: React.ReactElement<any>;
  time?: number;
}

export interface IExitSensorState {

}

export class ExitSensor extends Component<IExitSensorProps, IExitSensorState> {
  static defaultProps = {
    time: 200
  };

  element: React.ReactElement<any>;
  nextElement: React.ReactElement<any>;
  exitInFlight: boolean = false;
  exitFinish: boolean = false;
  timeout;

  state: IExitSensorState = {

  };

  componentWillUnmount () {
    clearTimeout(this.timeout);
  }

  transition = () => {
    this.exitFinish = true;
    this.forceUpdate();
  };

  render () {
    if (this.exitFinish) {
      this.exitFinish = false;
      this.exitInFlight = false;
      this.element = this.nextElement;

      return this.element;
    }

    const element = this.props.children;

    if (this.exitInFlight) {
      this.nextElement = element;

      return this.element;
    }

    if (!this.element) {
      this.element = element;

      return element;
    }

    if (!element || (this.element.key !== element.key)) {
      this.exitInFlight = true;
      this.nextElement = element;

      this.timeout = setTimeout(this.transition, this.props.time);

      return cloneElement(this.element, {
        exiting: true
      });
    }

    if (this.exitInFlight) {
      return this.element;
    }

    return element;
  }
}
