import React, { forwardRef } from 'react';

export const Section11Cover = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <div className="page cover-page placeholder-page" data-density="hard" ref={ref}>
      <div className="page-content">
        <div className="cover-subtitle">RootConf 2026</div>
        <div className="cover-decoration" />
        <h1 className="cover-title">STAGE 11</h1>
        <div className="cover-decoration" />
        <div className="cover-subtitle">Coming Soon</div>
        <div className="placeholder-text" style={{ marginTop: '4rem', opacity: 0.6, fontSize: '0.9rem' }}>
          Async Rust: Bridging the Gap.
        </div>
      </div>
      <div className="page-number">{props.number}</div>
    </div>
  );
});
