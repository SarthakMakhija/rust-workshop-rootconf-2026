import React, { forwardRef } from 'react';
import Page from '../../Page';
import CodeBlock from '../../CodeBlock';

export const Section14Cover = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <div className="page cover-page" data-density="hard" ref={ref}>
      <div className="page-content">
        <div className="cover-subtitle">RootConf 2026</div>
        <div className="cover-decoration" />
        <h1 className="cover-title">STAGE 14</h1>
        <div className="cover-decoration" />
        <div className="cover-subtitle">The Final Polish</div>
        <div className="cover-subtitle" style={{ marginTop: '2rem', fontStyle: 'italic' }}>
          Builders, Integration Tests, and the End.
        </div>
      </div>
      <div className="page-number">{props.number}</div>
    </div>
  );
});

export const Stage14Roadmap = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">Stage 14 Roadmap</h2>
      <div className="content-block">
        <ul style={{ paddingLeft: '1.5rem', lineHeight: '2.0' }}>
          <li><strong>The Configuration API</strong>: Designing an ergonomic Cache interface.</li>
          <li><strong>The Builder Pattern</strong>: Supplying defaults flexibly.</li>
          <li><strong>Black Box Verification</strong>: The <code>tests/</code> ecosystem.</li>
          <li><strong>End-to-End Testing</strong>: Stress testing the system externally.</li>
          <li><strong>The Reality Check</strong>: Is this production ready?</li>
        </ul>
      </div>
    </Page>
  );
});

export const TheBuilderPattern = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">The Builder Pattern</h2>
      <div className="content-block" style={{ fontSize: '0.85rem' }}>
        As our <code>Cache</code> architecture grows, requiring clients to provide heavily detailed arguments manually like: <code>Cache::new(16, Duration::from_secs(120), ...)</code> becomes extremely brittle.
      </div>
      <div className="explanation-box" style={{ background: 'rgba(56, 189, 248, 0.05)', marginTop: '1rem' }}>
        <h3 style={{ fontSize: '0.9rem', color: 'var(--accent-color)' }}>Ergonomic Instantiation</h3>
        To solve constructor bloat, we introduce the <strong>Builder Pattern</strong>. This allows users to chain optional configuration methods that progressively assemble the object, falling back to sensible defaults when configuration is omitted.
      </div>
      <div className="content-block" style={{ marginTop: '1.5rem', textAlign: 'center', fontStyle: 'italic', fontSize: '0.9rem' }}>
        Our Cache defaults will be: <strong>16 Shards</strong> and a <strong>2-minute TTL</strong>.
      </div>
    </Page>
  );
});

export const CacheBuilderImpl = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">Implementing CacheBuilder</h2>
      <div className="code-snippet" style={{ marginTop: '0.5rem' }}>
        <CodeBlock code={`pub struct CacheBuilder {
    shards: usize,
    default_ttl: Duration,
}

impl Default for CacheBuilder {
    fn default() -> Self {
        Self { shards: 16, default_ttl: Duration::from_secs(120) }
    }
}

impl CacheBuilder {
    pub fn new() -> Self { Self::default() }

    pub fn shards(mut self, n: usize) -> Self {
        self.shards = n;
        self
    }

    pub fn default_ttl(mut self, ttl: Duration) -> Self {
        self.default_ttl = ttl;
        self
    }

    pub fn build<K, V>(self) -> Arc<Cache<K, V>>
    where K: Hash + Eq + Clone + Send + Sync + 'static,
          V: Send + Sync + 'static {
        Cache::new(self.shards, self.default_ttl)
    }
}`} style={{ fontSize: '0.7rem' }} />
      </div>
      <div className="explanation-box" style={{ background: '#fffbeb', borderLeft: '4px solid #f59e0b', marginTop: '1rem' }}>
        <h3 style={{ fontSize: '0.85rem', color: '#92400e' }}>Concurrency Constraints</h3>
        <p style={{ marginTop: '0.5rem', fontSize: '0.7rem' }}>
          Our <code>build</code> method returns an <strong><code>Arc</code></strong> (Atomic Reference Counted pointer) because the cache must be safely shared across multiple threads.
        </p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.7rem' }}>
          The trait bounds <strong><code>Send + Sync + 'static</code></strong> ensure that the keys and values can safely transition between and be accessed by multiple threads simultaneously.
        </p>
      </div>
    </Page>
  );
});

export const IntegrationTestingIntro = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">Integration Testing</h2>
      <div className="content-block" style={{ fontSize: '0.85rem' }}>
        Until now, our test blocks (<code>#[cfg(test)]</code>) have lived alongside our source code. These are <strong>Unit Tests</strong>, capable of peering into private struct fields.
      </div>
      <div className="explanation-box" style={{ background: '#eef2ff', marginTop: '1rem' }}>
        <h3 style={{ fontSize: '0.9rem', color: '#4f46e5' }}>The <code>tests/</code> Directory</h3>
        <p style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
          To prove our cache can be used by external consumers, we create a specialized <code>tests/</code> folder in the project root. Tests living here are compiled entirely separately.
        </p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', fontWeight: 'bold' }}>
          This enforces "Black Box Testing". You can ONLY interact with the cache via its public API!
        </p>
      </div>
      <div className="explanation-box" style={{ background: 'rgba(56, 189, 248, 0.05)', marginTop: '1rem' }}>
        <h3 style={{ fontSize: '0.9rem', color: 'var(--accent-color)' }}>Public Visibility</h3>
        <p style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
          For an integration test to access your code, not only must the item (like <code>CacheBuilder</code>) be <code>pub</code>, but every module in the path leading to it must also be <code>pub</code>.
        </p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', fontStyle: 'italic' }}>
          Example: <code>pub mod cache;</code> in <code>lib.rs</code> makes the module reachable from the outside.
        </p>
      </div>
    </Page>
  );
});

export const CacheIntegrationTest = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">E2E Verification</h2>
      <div className="content-block" style={{ fontSize: '0.85rem' }}>
        Let's construct an integration test utilizing our brand new public Builder API. Look how clean the client instantiation is!
      </div>
      <div className="explanation-box" style={{ background: '#f8fafc', borderLeft: '4px solid #cbd5e1', marginTop: '1rem', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '0.85rem', color: '#475569' }}>Understanding the Import</h3>
        <code style={{ fontSize: '0.75rem', display: 'block', margin: '0.5rem 0' }}>use cached::cache::CacheBuilder;</code>
        <ul style={{ paddingLeft: '1.2rem', fontSize: '0.75rem', lineHeight: '1.6' }}>
          <li><strong><code>cached</code></strong>: The crate name defined in your <code>Cargo.toml</code>.</li>
          <li><strong><code>cache</code></strong>: The <code>pub mod</code> exposed by your library.</li>
          <li><strong><code>CacheBuilder</code></strong>: The <code>pub struct</code> we are importing to use.</li>
        </ul >
      </div>
      <div className="code-snippet">
        <CodeBlock code={`use cached::cache::CacheBuilder;
use std::time::Duration;
use std::thread;

#[test]
fn test_cache_end_to_end() {
    // 🛠️ Ergonomic Builder initialization
    let cache = CacheBuilder::new()
        .shards(4)
        .default_ttl(Duration::from_millis(50))
        .build();

    cache.put(String::from("rootconf"), String::from("workshop"));
    assert!(cache.get(&String::from("rootconf")).is_some());

    // ⏳ Trigger expiration
    thread::sleep(Duration::from_millis(100));
    assert!(cache.get(&String::from("rootconf")).is_none());
}`} style={{ fontSize: '0.70rem' }} />
      </div>
    </Page>
  );
});

export const WorkshopConclusion = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">Workshop Complete!</h2>
      <div className="content-block" style={{ fontSize: '0.85rem' }}>
        You've survived the borrow checker and successfully constructed a sharded, TTL-aware concurrent architecture operating atop MESI-optimized hardware protocols! Outstanding work!
      </div>
      <div className="explanation-box" style={{ background: 'var(--accent-light)', border: '1px solid var(--accent-color)', marginTop: '2rem' }}>
        <div style={{ textAlign: 'center', fontSize: '1.2rem', marginBottom: '0.5rem' }}>⚠️ <strong>NOTE</strong> ⚠️</div>
        <p style={{ textAlign: 'center', fontSize: '0.85rem', fontWeight: 'bold' }}>
          This Cache is NOT Production Grade... yet!
        </p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', lineHeight: '1.5' }}>
          While the current implementation is thread-safe and logically sound, an industrial-grade cache requires further engineering to handle proactive memory bounding and sophisticated eviction policies.
        </p>
      </div>
      <div className="content-block" style={{ textAlign: 'center', marginTop: '2rem', fontStyle: 'italic' }}>
        Good luck out there, Rustaceans. 🦀
      </div>
      <div style={{ marginTop: '2.5rem', textAlign: 'center', borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '1.5rem', opacity: 0.7, fontSize: '0.8rem' }}>
        <em>By Sarthak Makhija</em><br />
        <span style={{ fontSize: '0.7rem' }}>Special thanks to <strong>Antigravity</strong> for technical partnership.</span>
      </div>
    </Page>
  );
});
