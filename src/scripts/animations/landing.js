import { gsap } from 'gsap';
import debounce from 'lodash/debounce';
import { vhToPx } from './helpers';

export default class LandingAnimation {
  constructor() {
    this.fullpageNode = document.querySelector('.fullpage');

    // Query all of the nodes that will be animated. This is done at the start so that
    // the query will only be done once.
    this.body = document.documentElement;
    this.shapesNode = document.querySelector('.shapes--landing');
    this.activeScrollbarNode = document.querySelector('.overlay__active');
    this.revealNodes = [...this.fullpageNode.children].map((element) => element.querySelectorAll('.reveal--landing'));
    this.pageNumberLeftNode = document.querySelector(
      '.overlay__pageNumber--left',
    );
    this.pageNumberMiddleNode = document.querySelector(
      '.overlay__pageNumber--middle',
    );
    this.pageNumberRightNode = document.querySelector(
      '.overlay__pageNumber--right',
    );
    this.hitboxesNode = document.querySelector('.overlay__hitboxes');
    this.hitboxNodes = document.querySelectorAll('.overlay__hitbox');

    // Store the layering of the different projects
    this.spenmoDirection = [
      'spenmo5',
      'spenmo1',
      'spenmo2',
      'spenmo4',
      'spenmo3',
    ];
    this.tightropeDirection = [
      'tightrope5',
      'tightrope1',
      'tightrope2',
      'tightrope4',
      'tightrope3',
    ];
    this.diabDirection = ['diab3', 'diab1', 'diab4', 'diab5', 'diab2'];

    this.flashDirection = [
      'flash5',
      'flash6',
      'flash4',
      'flash3',
      'flash2',
      'flash1',
    ];

    // Set global default ease and default duration for the parallax effects
    this.defaultEase = 'power2.inOut';
    this.defaultDuration = 1;

    // Other necessary variables
    this.height = this.body.clientHeight;
    this.currentSlide = 0;
    this.timeline = null;
    this.currentScrollbar = 0;
    this.layer = [200, 50, -100, -400, -1200, -1700, -2200]; // Stores the amount of travel per layer
    this.slides = this.fullpageNode.children.length - 1;

    // Swipe Detection
    this.startX = null;
    this.startY = null;
    this.startTime = null;
    this.minDist = 150;
    this.maxPerpendicular = 100;
    this.allowedTime = 300;
  }

  /**
   * Animates each text element that will be revealed as it's containing slide is
   * animated into
   * @param {number} to - The index of the slide that is being animated to
   */
  revealAnimation(to) {
    if (this.revealNodes[to].length !== 0) {
      gsap.from(this.revealNodes[to], {
        y: 200,
        duration: 0.5,
        delay: 0.5,
        stagger: 0.075,
        ease: 'power2.out',
      });
    }
  }

  /**
   * Animates the scrollbar and the numbers that indicate the current slide
   * @param {number} to - The index of the slide that is being animated to
   * @param {boolean} isHover - Modifies the duration if the time the animation is being
   *                            called as a hover effect
   */
  scrollbarAnimation(to, isHover) {
    if (this.currentScrollbar === to) {
      return;
    }

    const duration = isHover ? 0.75 : this.defaultDuration;

    gsap
      .timeline()
      .to(
        this.activeScrollbarNode,
        {
          y: vhToPx((32 / 9) * to),
          ease: this.defaultEase,
          duration,
        },
        '<',
      )
      // Animates the last numbers of the sidebar
      .to(
        this.pageNumberRightNode,
        {
          y: -17 * to,
          ease: this.defaultEase,
          duration,
        },
        '<',
      );

    // Moves the first and second characters so that FIN will be shown as the slide
    // number
    if (this.currentScrollbar === this.slides) {
      gsap
        .timeline()
        .to(
          this.pageNumberLeftNode,
          {
            y: 0,
            ease: this.defaultEase,
            duration,
          },
          '<',
        )
        .to(
          this.pageNumberMiddleNode,
          {
            y: 0,
            ease: this.defaultEase,
            duration,
          },
          '<',
        );
    } else if (to === this.slides) {
      gsap
        .timeline()
        .to(
          this.pageNumberLeftNode,
          {
            y: -17,
            ease: this.defaultEase,
            duration,
          },
          '<',
        )
        .to(
          this.pageNumberMiddleNode,
          {
            y: -17,
            ease: this.defaultEase,
            duration,
          },
          '<',
        );
    }

    this.currentScrollbar = to;
  }

  /**
   * Animates the shapes at the edge of the browser to move in a parallax effect
   * @param {number} to - The index of the slide that is being animated to
   */
  shapeAnimation(to) {
    gsap.to(this.shapesNode, {
      y: this.layer[6] * to,
      ease: this.defaultEase,
      duration: this.defaultDuration,
    });
  }

  /**
   * Animates the individual images found in the projects part
   * @param {string[]} nameArray - The names of the images to be animated, arranged from
   *                               the bottom layer, to the top
   * @param {number} to - The index of the slide that is being animated to
   * @param {boolean} isGoingDown - Indicates the direction of the current animation
   */
  imageAnimation(nameArray, to, isGoingDown, offset = 1) {
    // Animation type is changed depending if the current animation
    // is going in to the slide or out of the slide
    if (to) {
      if (isGoingDown) {
        nameArray.forEach((name, index) => {
          gsap.set(`.projects__image--${name}`, {
            y: 0,
          });
          gsap.from(`.projects__image--${name}`, {
            y: -this.layer[index + offset],
            ease: this.defaultEase,
            duration: this.defaultDuration,
          });
        });
      } else {
        nameArray.forEach((name, index) => {
          gsap.set(`.projects__image--${name}`, {
            y: this.layer[index + offset],
          });
          gsap.to(`.projects__image--${name}`, {
            y: 0,
            ease: this.defaultEase,
            duration: this.defaultDuration,
          });
        });
      }
    } else if (isGoingDown) {
      nameArray.forEach((name, index) => {
        gsap.set(`.projects__image--${name}`, {
          y: 0,
        });
        gsap.to(`.projects__image--${name}`, {
          y: this.layer[index + offset],
          ease: this.defaultEase,
          duration: this.defaultDuration,
        });
      });
    } else {
      nameArray.forEach((name, index) => {
        gsap.set(`.projects__image--${name}`, {
          y: 0,
        });
        gsap.to(`.projects__image--${name}`, {
          y: -this.layer[index + offset],
          ease: this.defaultEase,
          duration: this.defaultDuration,
        });
      });
    }
  }

  /**
   * Calls the correct animations when leaving or entering specific slides
   * @param {number} from - The index of the slide that is being animated from
   * @param {number} to - The index of the slide that is being animated to
   */
  parallaxAnimation(from, to) {
    const down = from - to < 0;

    switch (from) {
      case 0:
        gsap.to('.hero__holder', {
          y: this.layer[3],
          ease: this.defaultEase,
          duration: this.defaultDuration,
        });
        break;
      case 2:
        this.imageAnimation(this.flashDirection, false, down, 0);
        break;

      case 3:
        this.imageAnimation(this.spenmoDirection, false, down);
        break;
      case 4:
        this.imageAnimation(this.tightropeDirection, false, down);
        break;
      case 5:
        this.imageAnimation(this.diabDirection, false, down);
        break;
      default:
        break;
    }

    switch (to) {
      case 0:
        gsap.to('.hero__holder', {
          y: 0,
          ease: this.defaultEase,
          duration: this.defaultDuration,
        });
        break;
      case 2:
        this.imageAnimation(this.flashDirection, true, down, 0);
        break;
      case 3:
        this.imageAnimation(this.spenmoDirection, true, down);
        break;
      case 4:
        this.imageAnimation(this.tightropeDirection, true, down);
        break;
      case 5:
        this.imageAnimation(this.diabDirection, true, down);
        break;

      default:
        break;
    }
  }

  /**
   * Runs the whole animation when moving from one slide to another
   * @param {number} from - The index of the slide that is being animated from
   * @param {number} to - The index of the slide that is being animated to
   */
  changeSlide(from, to) {
    if (this.timeline && this.timeline.isActive()) {
      return;
    }

    const slideTimeline = gsap.timeline().to(this.fullpageNode, {
      y: -this.height * to,
      ease: this.defaultEase,
      duration: this.defaultDuration,
    });
    this.parallaxAnimation(from, to);
    this.scrollbarAnimation(to);
    this.shapeAnimation(to);
    if (from < to) {
      this.revealAnimation(to);
    }
    this.timeline = slideTimeline;
  }

  /* eslint-disable class-methods-use-this */
  /**
   * Returns the direction based on the events given
   * @param {number} from - The index of the slide that is being animated from
   * @param {number} to - The index of the slide that is being animated to
   * @returns {string} - One of 'up', 'down', 'home', 'end'
   */
  getDirection(type, event) {
    switch (type) {
      case 'wheel':
        if (event.deltaY > 0) {
          return 'down';
        }
        return 'up';

      case 'keydown':
        switch (event.code) {
          case 'KeyJ':
          case 'ArrowDown':
          case 'PageDown':
            return 'down';

          case 'KeyK':
          case 'ArrowUp':
          case 'PageUp':
            return 'up';

          case 'Home':
            return 'home';

          case 'End':
            return 'end';

          default:
            return 'null';
        }

      case 'touch':
        return event;

      default:
        throw new Error(
          `Expected one of event types: wheel, keydown. Got ${type} instead.`,
        );
    }
  }
  /* eslint-enable class-methods-use-this */

  /**
   * Changes the slide based on the hitbox being clicked
   * @param {string} to - The slide number that was clicked
   */
  hitboxClick(to) {
    if (this.currentSlide !== to) {
      this.changeSlide(this.currentSlide, (this.currentSlide = to));
    }
  }

  /**
   * Moves the active scrollbar to the hovered hitbox
   * @param {string} to - The hitbox that is being hovered
   */
  hitboxEnter(to) {
    this.scrollbarAnimation(to, true);
  }

  /**
   * Returns the hitbox to its normal position if the mouse leaves the area
   */
  hitboxLeave() {
    this.scrollbarAnimation(this.currentSlide, true);
  }

  /**
   * Resets the scrollbar when going into the landing page
   */
  resetScrollbar() {
    gsap.set(this.pageNumberLeftNode, { y: 0 });
    gsap.set(this.pageNumberMiddleNode, { y: 0 });
    gsap.set(this.pageNumberRightNode, { y: 0 });
    gsap.set(this.activeScrollbarNode, { y: 0 });
  }

  /**
   * Handles when resizing the page
   */
  fullpageResize() {
    if (this.height !== this.body.clientHeight) {
      this.height = this.body.clientHeight;
      this.changeSlide(this.currentSlide, this.currentSlide);
    }
  }

  /**
   * Called whenever an event that indicates a scroll is fired
   * @param {string} type - The type of the event that called the function
   * @param {Object} event - The event object that was returned from the listener
   */
  fullpageScroll(type, event) {
    // Built-in throttle function that does not run when an critical animation is still running
    if (this.timeline && this.timeline.isActive()) {
      return;
    }

    switch (this.getDirection(type, event)) {
      case 'down':
        // Does not allow moving down if the next slide does not exist
        if (this.currentSlide < this.slides) {
          this.changeSlide(this.currentSlide, (this.currentSlide += 1));
        }
        break;
      case 'up':
        // Does not allow moving up if the current slide is at 0
        if (this.currentSlide > 0) {
          this.changeSlide(this.currentSlide, (this.currentSlide -= 1));
        }
        break;
      case 'home':
        this.changeSlide(this.currentSlide, (this.currentSlide = 0));
        break;
      case 'end':
        this.changeSlide(this.currentSlide, (this.currentSlide = this.slides));
        break;
      default:
        throw new Error('Expected one of directions: up, down, home, end.');
    }
  }

  /**
   * Stores the initial touch event
   * @param {Object} event - The event object that was returned from the listener
   */
  handleTouchStart(event) {
    const { pageX: startX, pageY: startY } = event.changedTouches[0];
    this.startX = startX;
    this.startY = startY;
    this.startTime = new Date().getTime();
    event.preventDefault();
  }

  /**
   * Handles ending the touch event and calculates if the direction is up or down
   * @param {Object} event - The event object that was returned from the listener
   */
  handleTouchEnd(event) {
    const { pageX: endX, pageY: endY } = event.changedTouches[0];
    const distX = endX - this.startX;
    const distY = endY - this.startY;
    const absDistX = Math.abs(distX);
    const absDistY = Math.abs(distY);
    const elapsedTime = new Date().getTime() - this.startTime;
    if (
      elapsedTime <= this.allowedTime
      && absDistY >= this.minDist
      && absDistX <= this.maxPerpendicular
    ) {
      this.fullpageScroll('touch', distY > 0 ? 'up' : 'down');
    }
    event.preventDefault();
  }

  /**
   * Starts all the event listeners and sets necessary gsap styles
   */
  load() {
    gsap.set(this.shapesNode, {
      bottom: this.layer[6] * this.slides,
    });

    this.resetScrollbar();
    this.fullpageNode.addEventListener('wheel', (event) => this.fullpageScroll('wheel', event));
    document.addEventListener('keydown', (event) => this.fullpageScroll('keydown', event));

    this.fullpageNode.addEventListener('touchstart', (event) => this.handleTouchStart(event));
    this.fullpageNode.addEventListener('touchend', (event) => this.handleTouchEnd(event));
    this.fullpageNode.addEventListener('touchend', (event) => this.handleTouchEnd(event));

    this.hitboxNodes.forEach((node, index) => {
      node.addEventListener('click', () => this.hitboxClick(index));
      node.addEventListener('mouseenter', () => this.hitboxEnter(index));
    });
    this.hitboxesNode.addEventListener('mouseleave', () => this.hitboxLeave());
    window.addEventListener(
      'resize',
      debounce(() => this.fullpageResize(), 200),
    );
  }
}
