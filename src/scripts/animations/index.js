import MenuAnimation from './menu';

// Load global animation
const menu = new MenuAnimation();
menu.load();

// Export per page animation
export { default as ScrollAnimation } from './scroll';
export { default as LandingAnimation } from './landing';
export { default as DaysAnimation } from './days';
export { menu };
