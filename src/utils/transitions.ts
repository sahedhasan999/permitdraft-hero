
interface AnimationProps {
  opacity: number;
  x?: number;
  y?: number;
}

type TransitionDirection = 'up' | 'down' | 'left' | 'right' | 'fade';

interface TransitionOptions {
  delay?: number;
  duration?: number;
  distance?: number;
  ease?: string;
}

export const getTransitionProps = (
  direction: TransitionDirection = 'up',
  options: TransitionOptions = {}
) => {
  const {
    delay = 0,
    duration = 0.5,
    distance = 20,
    ease = 'ease-out',
  } = options;

  let initial: AnimationProps = { opacity: 0 };
  let animate: AnimationProps = { opacity: 1 };
  let transition = { duration, delay, ease };

  switch (direction) {
    case 'up':
      initial = { opacity: 0, y: distance };
      animate = { opacity: 1, y: 0 };
      break;
    case 'down':
      initial = { opacity: 0, y: -distance };
      animate = { opacity: 1, y: 0 };
      break;
    case 'left':
      initial = { opacity: 0, x: distance };
      animate = { opacity: 1, x: 0 };
      break;
    case 'right':
      initial = { opacity: 0, x: -distance };
      animate = { opacity: 1, x: 0 };
      break;
    case 'fade':
      initial = { opacity: 0 };
      animate = { opacity: 1 };
      break;
    default:
      initial = { opacity: 0, y: distance };
      animate = { opacity: 1, y: 0 };
  }

  return {
    initial,
    animate,
    transition,
  };
};

export const scrollParallax = (e: MouseEvent, element: HTMLElement, factor: number = 0.1) => {
  const x = (window.innerWidth - e.pageX * factor) / 100;
  const y = (window.innerHeight - e.pageY * factor) / 100;
  
  element.style.transform = `translateX(${x}px) translateY(${y}px)`;
};

export const animateOnScroll = () => {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-up');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const elements = document.querySelectorAll('.animate-on-scroll');
  elements.forEach((el) => observer.observe(el));

  return () => {
    elements.forEach((el) => observer.unobserve(el));
  };
};

export const smoothScrollTo = (targetId: string) => {
  const target = document.getElementById(targetId);
  if (target) {
    window.scrollTo({
      top: target.offsetTop,
      behavior: 'smooth',
    });
  }
};
