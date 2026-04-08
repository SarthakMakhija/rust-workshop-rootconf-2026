import React, { forwardRef } from 'react';
import Page from '../Page';

export const TOCLeft = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">Table of Contents</h2>
      <div className="content-block">
        <ul className="toc-list">
          <li className="toc-item">
            <span className="toc-stage">Stage 1</span>
            <span className="toc-title">Foundations: In-Memory Caching</span>
          </li>
          <li className="toc-item">
            <span className="toc-stage">Stage 2</span>
            <span className="toc-title">Primitive Obsession & Type Safety</span>
          </li>
          <li className="toc-item">
            <span className="toc-stage">Stage 3</span>
            <span className="toc-title">Generic Abstractions</span>
          </li>
          <li className="toc-item">
            <span className="toc-stage">Stage 4</span>
            <span className="toc-title">Mutation vs Aliasing</span>
          </li>
          <li className="toc-item">
            <span className="toc-stage">Stage 5</span>
            <span className="toc-title">Interior Mutability (RefCell)</span>
          </li>
          <li className="toc-item">
            <span className="toc-stage">Stage 6</span>
            <span className="toc-title">Fearless Concurrency (Mutex & RwLock)</span>
          </li>
          <li className="toc-item">
            <span className="toc-stage">Stage 7</span>
            <span className="toc-title">Reference Counting (Arc)</span>
          </li>
        </ul>
      </div>
    </Page>
  );
});

export const TOCRight = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title" style={{ visibility: 'hidden' }}>Table of Contents</h2>
      <div className="content-block">
        <ul className="toc-list">
          <li className="toc-item">
            <span className="toc-stage">Stage 8</span>
            <span className="toc-title">Advanced Memory: Zero-Copy References</span>
          </li>
          <li className="toc-item">
            <span className="toc-stage">Stage 9</span>
            <span className="toc-title">Foundation of Concurrency</span>
          </li>
          <li className="toc-item">
            <span className="toc-stage">Stage 10</span>
            <span className="toc-title">Scale and Sharding</span>
          </li>
          <li className="toc-item">
            <span className="toc-stage">Stage 11</span>
            <span className="toc-title">Real-World Latency & Cache Expiration</span>
          </li>
          <li className="toc-item">
            <span className="toc-stage">Stage 12</span>
            <span className="toc-title">Atomic Mechanics & MESI Optimization</span>
          </li>
          <li className="toc-item">
            <span className="toc-stage">Stage 13</span>
            <span className="toc-title">Graceful Termination & Type-States</span>
          </li>
          <li className="toc-item">
            <span className="toc-stage">Stage 14</span>
            <span className="toc-title">Final Integration & Production Readiness</span>
          </li>
        </ul>
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
          <a 
            href="https://github.com/SarthakMakhija/rust-workshop-labs" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              color: 'var(--accent-color)',
              textDecoration: 'none',
              fontSize: '0.8rem',
              opacity: 0.6,
              letterSpacing: '0.05em'
            }}
          >
            github.com/SarthakMakhija/rust-workshop-labs
          </a>
        </div>
      </div>
    </Page>
  );
});
