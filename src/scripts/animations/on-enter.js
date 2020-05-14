import lottie from 'lottie-web';
import { gsap } from 'gsap';
import spenmoAnimData from './lottie-files/spenmo.json';
import diabAnimData from './lottie-files/diab.json';
import tightropeAnimData from './lottie-files/tightrope.json';
import flashAnimData from './lottie-files/flash.json';

export default class OnEnterAnimation {
  constructor(page, numberOfImages) {
    this.page = page;
    this.numberOfImages = numberOfImages;

    this.h1Node = null;
    this.labelNode = null;
    this.lineNode = null;
    this.images = [];

    this.lottieNode = null;
    this.lottieAnimation = null;

    this.mainTimeline = null;
    this.lineLoopTimeline = null;

    this.origin = [
      {
        x: 0,
        y: -200,
      },
      {
        x: -600,
        y: -200,
      },
      {
        x: 600,
        y: -200,
      },
      {
        x: -800,
        y: -200,
      },
    ];

    this.animData = null;
    switch (page) {
      case 'spenmo':
        this.animData = spenmoAnimData;
        break;
      case 'diab':
        this.animData = diabAnimData;
        break;
      case 'tightrope':
        this.animData = tightropeAnimData;
        break;

      case 'flash':
      default:
        this.animData = flashAnimData;
        break;
    }
  }

  querySelectors() {
    this.h1Node = document.querySelector(`.onEnter__h1--${this.page}`);
    this.labelNode = document.querySelector(`.onEnter__label--${this.page}`);
    this.lineNode = document.querySelector(`.onEnter__line--${this.page}`);
    for (let i = 1; i <= this.numberOfImages; i += 1) {
      this.images.push(
        document.querySelector(`.onEnter__image--${this.page}${i}`),
      );
    }

    this.overlayNode = document.querySelector('.overlay');

    this.lottieNode = document.querySelector(`.lottie__hero--${this.page}`);
  }

  generateWriteOnAnimation() {
    this.lottieAnimation = lottie.loadAnimation({
      container: this.lottieNode,
      animationData: this.animData,
      renderer: 'svg',
      autoplay: false,
    });

    this.lottieAnimation.setSpeed(1.5);
  }

  generateOnEnterAnimation() {
    this.timeline = gsap
      .timeline({
        paused: true,
        defaults: {
          duration: 0.4,
          ease: 'power3.out',
        },
      })
      .fromTo(this.h1Node, { opacity: 0, y: -200 }, { opacity: 1, y: 0 })
      .fromTo(
        this.labelNode,
        { opacity: 0, y: -200 },
        { opacity: 1, y: 0 },
        '<.15',
      )
      .add(this.imageAnimation(), '<.15')
      .from(this.overlayNode, { delay: 0.5, duration: 0.75, opacity: 0 })
      .set(document.body, { overflowY: 'scroll' }, '<');
  }

  generateLineLoopAnimation() {
    this.lineLoopTimeline = gsap
      .timeline({
        paused: true,
        repeat: -1,
        delay: 0.5,
        defaults: {
          duration: 1.5,
          ease: 'power2.out',
        },
      })
      .fromTo(
        this.lineNode,
        { clipPath: 'inset(0 -2px 100%)' },
        {
          clipPath: 'inset(0 -2px 0%)',
        },
      )
      .to(this.lineNode, { clipPath: 'inset(100% -2px 0%)' });
  }

  imageAnimation() {
    const timeline = gsap.timeline({
      defaults: {
        duration: 0.4,
        ease: 'back.inOut(0.5)',
      },
      onComplete: () => this.lineLoopTimeline.play(),
    });

    this.images.forEach((image, index) => {
      timeline.fromTo(
        image,
        {
          scale: 3,
          opacity: 0,
          ...this.origin[index],
        },
        {
          y: 0,
          x: 0,
          scale: 1,
          opacity: 1,
        },
        '<.15',
      );
    });

    return timeline;
  }

  load() {
    gsap.set(document.body, { overflowY: 'hidden' });
    this.querySelectors();

    this.generateWriteOnAnimation();
    this.generateLineLoopAnimation();
    this.generateOnEnterAnimation();
    this.lottieAnimation.addEventListener('complete', () => this.timeline.play());
  }

  play() {
    setTimeout(() => this.lottieAnimation.play(), 250);
  }
}