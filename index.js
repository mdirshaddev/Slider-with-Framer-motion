import React, { useState, useRef, useEffect } from 'react';
import { render } from 'react-dom';
import { motion, useMotionValue } from 'framer-motion';
import clamp from 'lodash/clamp';
import range from 'lodash/range';
import './style.css';

const Dots = ({ count, active }) => (
  <div className="dot-container">
    {range(count).map((i) => (
      <motion.div
        className="dot"
        initial={false}
        animate={{
          scale: active === i ? 1.5 : 1,
          opacity: active === i ? 1 : 0.5,
        }}
      />
    ))}
  </div>
);

const Slide = ({ color, ...rest }) => (
  <div style={{ backgroundColor: color }} className="slide" {...rest} />
);

const App = () => {
  const constraintsRef = useRef(null);
  const [active, setActive] = useState(0);
  const x = useMotionValue(0);
  const drag = useMotionValue(0);
  const [carouseWidth, setCarouselWidth] = useState(0);

  const slides = ['blue', 'green', 'orange', 'pink'].map((color) => (
    <Slide key={color} color={color} />
  ));

  const width =
    (constraintsRef.current && constraintsRef.current.offsetWidth) || 320;

  const dragEndHandler = (event, info) => {
    const offset = info.offset.x;
    if (Math.abs(offset) > 20) {
      const direction = offset < 0 ? 1 : -1;
      setActive((active) => clamp(active + direction, 0, slides.length - 1));
    }
  };

  useEffect(() => {
    setCarouselWidth(
      constraintsRef.current?.scrollWidth - constraintsRef.current?.offsetWidth
    );
  }, []);

  return (
    <>
      <div className="container" ref={constraintsRef}>
        <motion.div
          className="swipper"
          onDragEnd={dragEndHandler}
          dragConstraints={{ right: 0, left: -carouseWidth }}
          drag="x"
          className="slider"
          animate={{
            x: -1 * active * width,
          }}
        >
          {slides}
        </motion.div>

        <Dots count={slides.length} active={active} />
      </div>
      <div style={{ height: 700 }} />
    </>
  );
};

render(<App />, document.getElementById('root'));
