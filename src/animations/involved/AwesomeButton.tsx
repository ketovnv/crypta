import React from 'react';

function setCssEndEvent(
    element: HTMLElement,
    type: "animation" | "transition",
    {
      tolerance = 0,
      propertyName,
    }: { tolerance?: number; propertyName?: string } = {}
) {
  return new Promise((resolve) => {
    if (!element) {
      resolve(false);
      return;
    }
    let eventName: string = null;
    const capitalized = type.charAt(0).toUpperCase() + type.slice(1);
    let run = 0;
    function end(event: any) {
      const target = event.srcElement || event.target;
      if (target === element) {
        if (run >= tolerance) {
          if (propertyName && propertyName !== event.propertyName) {
            return;
          }
          element.removeEventListener(eventName, end);
          resolve(event);
        }
        run += 1;
      }
    }
    // @ts-ignore
    if (element.style[`Webkit${capitalized}`] !== undefined) {
      eventName = `webkit${capitalized}End`;
    }
    // @ts-ignore
    if (element.style?.["OTransition"] !== undefined) {
      eventName = `o${type}End`;
    }
    if (element.style[type] !== undefined) {
      eventName = `${type}end`;
    }
    // @ts-ignore
    if (element.clearCssEndEvent) {
      // @ts-ignore
      element.clearCssEndEvent();
    }
    // @ts-ignore
    element.clearCssEndEvent = function () {
      element.removeEventListener(eventName, end);
    };
    element.addEventListener(eventName, end);
  });
}


const POSITION_STATES = ['middle', 'left', 'right'];

export function serialize(obj: any, separator = '&') {
  return Object.entries(obj)
      .map(([key, val]) => `${key}=${val}`)
      .join(separator);
}

export function classToModules(className: any = [], cssModule: any) {
  if (!cssModule) {
    return className.join(' ').trim();
  }
  const ClassName = [];
  let i = className.length;
  // eslint-disable-next-line
  while (i--) {
    if (cssModule[className[i]]) {
      ClassName.push(cssModule[className[i]]);
    }
  }
  return ClassName.join(' ').trim();
}

export function getClassName(className = '', cssModule: any) {
  if (cssModule) {
    return cssModule[className] || className;
  }
  return className;
}

export function toggleMoveClasses({
                                    element,
                                    root,
                                    cssModule = null,
                                    state = null,
                                  }: any) {
  if (!element?.classList?.remove) {
    return false;
  }
  if (!state) {
    const states = [
      classToModules([`${root}--${POSITION_STATES[0]}`], cssModule),
      classToModules([`${root}--${POSITION_STATES[1]}`], cssModule),
      classToModules([`${root}--${POSITION_STATES[2]}`], cssModule),
    ];
    states.forEach((state) => {
      if (state) {
        element.classList.remove(state);
      }
    });
    return false;
  }

  const options = POSITION_STATES.filter((item) => item !== state);
  let i = options.length;
  // eslint-disable-next-line
  while (i--) {
    const cls = classToModules([`${root}--${options[i]}`], cssModule);
    if (cls) {
      element.classList.remove(cls);
    }
  }

  const cls = classToModules([`${root}--${state}`], cssModule);
  if (cls) {
    element.classList.add(cls);
  }

  return true;
}

export function createRippleEffect({ event, button, content, className }: any) {
  const bounds = button.getBoundingClientRect();
  const top = window.pageYOffset || document.documentElement.scrollTop || 0;
  const bubble = document.createElement('span');
  const size = bounds.width < 50 ? bounds.width * 3 : bounds.width * 2;

  let pageX, pageY;
  if (event.nativeEvent instanceof TouchEvent) {
    pageX = event.changedTouches[0].pageX;
    pageY = event.changedTouches[0].pageY;
  } else {
    pageX = event.pageX;
    pageY = event.pageY;
  }

  bubble.className = className;
  bubble.style.top = `-${size / 2 - (pageY - bounds.top - top)}px`;
  bubble.style.left = `-${size / 2 - (pageX - bounds.left)}px`;
  bubble.style.width = `${size}px`;
  bubble.style.height = `${size}px`;

  setCssEndEvent(bubble, 'animation').then(() => {
    window.requestAnimationFrame(() => {
      content.removeChild(bubble);
    });
  });
  window.requestAnimationFrame(() => {
    content.appendChild(bubble);
  });
}

const ROOT_ELEMENT = 'aws-btn';
const IS_WINDOW = typeof window !== 'undefined';
const IS_TOUCH =
  (IS_WINDOW && 'ontouchstart' in window) ||
  (IS_WINDOW && navigator.maxTouchPoints > 0);

const Anchor = React.forwardRef<HTMLAnchorElement>((props, ref) => (
  <a ref={ref} {...props} />
));
const Button = React.forwardRef<HTMLButtonElement>((props, ref) => (
  <button ref={ref} {...props} />
));

export type ButtonType = {
  active?: Boolean;
  after?: React.ReactNode;
  before?: React.ReactNode;
  between?: boolean;
  children?: React.ReactNode;
  className?: string;
  containerProps?: any;
  cssModule?: any;
  disabled?: Boolean;
  element?: React.ForwardRefExoticComponent<
    React.RefAttributes<HTMLAnchorElement | HTMLDivElement | HTMLButtonElement>
  >;
  extra?: React.ReactNode;
  href?: string;
  moveEvents?: Boolean;
  onMouseDown?: any;
  onMouseUp?: (event: React.MouseEvent | React.TouchEvent) => void;
  onPress?: any;
  onPressed?: any;
  onReleased?: (event: HTMLElement) => void;
  placeholder?: Boolean;
  ripple?: Boolean;
  rootElement?: string;
  size?: string;
  style?: any;
  type?: string;
  visible?: Boolean;
};

export const AwesomeButton = ({
  active = false,
  after = null,
  before = null,
  between = false,
  children = null,
  className = null,
  containerProps = {},
  cssModule = null,
  disabled = false,
  element = null,
  extra = null,
  href = null,
  moveEvents = true,
  onMouseDown = null,
  onMouseUp = null,
  onPress = null,
  onPressed = null,
  onReleased = null,
  placeholder = true,
  ripple = false,
  rootElement = ROOT_ELEMENT,
  size = null,
  style = {},
  type = 'primary',
  visible = true,
}: ButtonType) => {
  const [pressPosition, setPressPosition] = React.useState(null);
  const button = React.useRef(null);
  const content = React.useRef(null);
  const container = React.useRef(null);
  const child = React.useRef(null);
  const over = React.useRef(false);
  const pressed = React.useRef(0);
  const timer = React.useRef(null);
  const touchScreen = React.useRef(0);
  const RenderComponent: React.ForwardRefExoticComponent<
    React.RefAttributes<HTMLAnchorElement | HTMLDivElement | HTMLButtonElement>
  > = element || (href ? Anchor : Button);

  const extraProps = {
    href,
  };

  const isDisabled = React.useMemo(() => {
    if (placeholder === true && !children) {
      return true;
    }
    return disabled;
  }, [placeholder, children, disabled]);

  React.useEffect(() => {
    if (button?.current) {
      container.current = button.current.parentNode;
    }

    return () => {
      if (timer?.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);

  const getRootClassName = () =>
    React.useMemo(() => {
      const classList = [
        rootElement,
        type && `${rootElement}--${type}`,
        size && `${rootElement}--${size}`,
        visible && `${rootElement}--visible`,
        between && `${rootElement}--between`,
        (placeholder && !children && `${rootElement}--placeholder`) || null,
      ];

      if (isDisabled === true) {
        classList.push(`${rootElement}--disabled`);
      }
      if (pressPosition) {
        classList.push(pressPosition);
      }
      if (className) {
        classList.push(...className.split(' '));
      }
      if (cssModule && cssModule['aws-btn']) {
        return classToModules(classList, cssModule);
      }

      return classList.join(' ').trim().replace(/[\s]+/gi, ' ');
    }, [
      rootElement,
      type,
      size,
      visible,
      between,
      placeholder,
      children,
      isDisabled,
      pressPosition,
      className,
      cssModule,
    ]);

  const checkActive = () => {
    if (pressPosition !== null && active === false) {
      clearPress({ force: true });
    }
  };

  React.useEffect(checkActive, [active]);

  const clearPressCallback = () => {
    pressed.current = 0;
    onReleased && onReleased(container.current);
  };

  const clearPress = ({ force = false, leave = false }: any = {}) => {
    toggleMoveClasses({
      element: container.current,
      root: rootElement,
      cssModule,
    });

    // soft clear-press
    if (leave === true && pressed.current === 0) {
      return;
    }

    let nextPressPosition = active && !force ? `${rootElement}--active` : null;

    if (content?.current?.clearCssEvent) {
      content.current.clearCssEvent();
    }

    if (nextPressPosition === null && pressPosition?.match(/active/gim)) {
      setCssEndEvent(content.current, 'transition', {
        tolerance: 1,
      }).then(clearPressCallback);
    }

    setPressPosition(nextPressPosition);
  };

  const createRipple = (event: any) => {
    createRippleEffect({
      event,
      button: button.current,
      content: content.current,
      className: getClassName(`${rootElement}__bubble`, cssModule),
    });
  };

  const pressIn = (event: React.MouseEvent | React.TouchEvent) => {
    if (isDisabled === true || pressed.current === 2) {
      return;
    }
    pressed.current = 1;
    setCssEndEvent(content.current, 'transition', {
      tolerance: 1,
    }).then(() => onPressed && onPressed(event));
    setPressPosition(`${rootElement}--active`);
  };

  const pressOut = (event: React.MouseEvent | React.TouchEvent) => {
    if (isDisabled === true || pressed.current !== 1) {
      return;
    }

    if (timer.current) {
      clearTimeout(timer.current);
    }

    if (ripple === true) {
      createRipple(event);
    }

    if (IS_WINDOW && button.current) {
      const eventTrigger = new Event('btn-press');
      button.current.dispatchEvent(eventTrigger);
    }

    handleAction(event);

    if (active === true) {
      pressed.current = 2;
      return;
    }
    clearPress();
  };

  const handleAction = (event: any) => {
    const element = container.current;
    if (!element) {
      return;
    }
    onPress && onPress(event);
  };

  const getMoveEvents: any = () => {
    const events: any = {
      onClick: (event: React.MouseEvent) => {
        if (href && isDisabled) {
          event.preventDefault();
        }
      },
    };

    if (IS_TOUCH) {
      events.onTouchStart = (event: React.TouchEvent) => {
        onMouseDown && onMouseDown(event);
        touchScreen.current = event?.changedTouches?.[0]?.clientY;
        pressIn(event);
      };
      events.onTouchEnd = (event: React.TouchEvent) => {
        onMouseUp && onMouseUp(event);
        const diff =
          touchScreen.current && event?.changedTouches?.[0]?.clientY
            ? Math.abs(touchScreen.current - event.changedTouches[0].clientY)
            : 0;
        if (diff > button.current.offsetHeight) {
          clearPress({ force: true });
          return;
        }
        pressOut(event);
      };
      return events;
    }

    events.onMouseLeave = () => {
      over.current = false;
      if (active === true && pressed.current !== 2) {
        clearPress({ force: true });
        return;
      }
      // SOFT CLEAR PRESS;
      clearPress({ leave: true });
    };
    events.onMouseDown = (event: React.MouseEvent) => {
      onMouseDown && onMouseDown(event);
      if (event?.nativeEvent?.button !== 0) {
        return;
      }
      pressIn(event);
    };
    events.onMouseUp = (event: React.MouseEvent) => {
      onMouseUp && onMouseUp(event);
      if (isDisabled === true) {
        event.preventDefault();
        return;
      }
      pressOut(event);
    };

    if (moveEvents === true) {
      events.onMouseMove = (event: React.MouseEvent) => {
        if (isDisabled === true) {
          return;
        }
        over.current = true;
        const buttonElement = button.current;
        const { left } = buttonElement.getBoundingClientRect();
        const width = buttonElement.offsetWidth;
        const state =
          event.pageX < left + width * 0.3
            ? 'left'
            : event.pageX > left + width * 0.65
            ? 'right'
            : 'middle';

        toggleMoveClasses({
          element: container.current,
          root: rootElement,
          cssModule,
          state,
        });
      };
      return events;
    }

    events.onMouseEnter = () => {
      over.current = true;
      toggleMoveClasses({
        element: container.current,
        root: rootElement,
        cssModule,
        state: 'middle',
      });
    };

    return events;
  };

  return (
    <RenderComponent
      style={style}
      className={getRootClassName()}
      role="button"
      ref={container}
      {...containerProps}
      {...extraProps}
      {...getMoveEvents()}>
      <span
        ref={button}
        className={getClassName(`${rootElement}__wrapper`, cssModule)}>
        <span
          ref={content}
          className={getClassName(`${rootElement}__content`, cssModule)}>
          {before}
          <span ref={child}>{children}</span>
          {after}
        </span>
        {extra}
      </span>
    </RenderComponent>
  );
};
