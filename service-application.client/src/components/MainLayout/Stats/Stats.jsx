import React, { useEffect, useRef, useState } from "react";

const Counter = ({ end }) => {
  const [count, setCount] = useState(0);
  const ref = useRef();
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const duration = 1000;
          const stepTime = 16;
          const increment = end / (duration / stepTime);

          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, stepTime);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return <span ref={ref}>{count}</span>;
};

const StatsSection = () => {
  return (
    <section id="stats" className="stats section light-background">
      <div className="container">
        <div className="row gy-4 text-center">

          <div className="col-lg-3 col-md-6">
            <div className="stats-item">
              <Counter end={232} />
              <p>Clients</p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="stats-item">
              <Counter end={521} />
              <p>Projects</p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="stats-item">
              <Counter end={1453} />
              <p>Hours Of Support</p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="stats-item">
              <Counter end={32} />
              <p>Workers</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default StatsSection;
