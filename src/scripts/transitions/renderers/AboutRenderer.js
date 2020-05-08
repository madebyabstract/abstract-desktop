import ScrollRenderer from './ScrollRenderer';
import { lottie } from '../../animations';

/* eslint-disable class-methods-use-this */
export default class AboutRenderer extends ScrollRenderer {
  onEnterCompleted() {
    lottie.about();
  }
}
