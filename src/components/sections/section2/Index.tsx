import React, { forwardRef } from 'react';
import Page from '../../Page';

export const Section2Cover = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <div className="page cover-page" data-density="hard" ref={ref}>
      <div className="page-content">
        <div className="cover-subtitle">RootConf 2026</div>
        <div className="cover-decoration" />
        <h1 className="cover-title">STAGE 2</h1>
        <div className="cover-decoration" />
        <div className="cover-subtitle">Domain Modeling & Safety</div>
        <div style={{ marginTop: '2rem', fontStyle: 'italic', color: '#666' }}>
          Preventing logical errors at compile time.
        </div>
      </div>
      <div className="page-number">{props.number}</div>
    </div>
  );
});

export const Section2Intro = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">Stage 2 Intro</h2>
      <div className="content-block">
        In the previous section, we started building a cache. However, it still has a significant flaw: **Primitive Obsession**.
      </div>
      <div className="content-block">
        We are using generic types (Strings) for everything. In this stage, we'll learn how to teach the compiler our domain rules so it can protect us from our own mistakes.
      </div>
    </Page>
  );
});

export const Section2Roadmap = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">Stage 2 Roadmap</h2>
      <div className="content-block">
        <ol style={{ paddingLeft: '1.5rem', lineHeight: '2.2' }}>
          <li><strong>Avoid mixing key/Value</strong> signatures.</li>
          <li><strong>Introduce NewType</strong> pattern for domain types.</li>
          <li><strong>Understanding Traits</strong> and Derivation.</li>
          <li><strong>Compile-time Safety</strong>: Ensure all tests pass only when types are used correctly.</li>
        </ol>
      </div>
    </Page>
  );
});

export const PrimitiveObsession = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">1. The Mixing Problem</h2>
      <div className="content-block">
        Consider our current <span className="keyword">put</span> signature:
      </div>
      <div className="code-snippet">
        <pre>
          {`fn put(&mut self, key: String, value: String)`}
        </pre>
      </div>
      <div className="content-block">
        Because both are <span className="keyword">String</span>, the compiler cannot stop you from accidentally swapping them:
      </div>
      <div className="code-snippet">
        <pre style={{ color: '#c62828' }}>
          {`// Logical Error: Swapped key and value
cache.put(value_string, key_string); `}
        </pre>
      </div>
      <div className="content-block">
        To the compiler, they are just the same type. This is a <strong>Runtime Error waiting to happen unless detected by unit-tests</strong>.
      </div>
      <div className="content-block">
        The idea is to make the types so distinct that the compiler cannot allow such mistakes.
      </div>
    </Page>
  );
});

export const NewTypePattern = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">2. Introduce NewType</h2>
      <div className="content-block">
        In Rust, we can create thin wrappers around types called the <span className="keyword">NewType Pattern</span>.
      </div>
      <div className="code-snippet">
        <pre>
          {`struct CacheKey(String);
struct CacheValue(String);`}
        </pre>
      </div>
      <div className="content-block">
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>Zero Cost at Runtime</h3>
        This isn't just a "box" around a string. During compilation, Rust **optimizes away** the wrapper. Physically, a <code>CacheKey</code> is identical to a <code>String</code> in memory, but logically, they are different types to the compiler.
      </div>
    </Page>
  );
});

export const DerivingTraits = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">3. Understanding Traits</h2>
      <div className="content-block" style={{ fontSize: '0.85rem' }}>
        A <span className="keyword">Trait</span> is a contract that defines what a type can do (similar to Interfaces). To use <code>CacheKey</code> in a HashMap, we need behavioral traits:
      </div>
      <div className="code-snippet">
        <pre style={{ fontSize: '0.8rem' }}>
          {`#[derive(PartialEq, Eq, Hash)]
struct CacheKey(String);`}
        </pre>
      </div>
      <div className="content-block">
        <h3 style={{ fontSize: '1rem', marginBottom: '0.3rem' }}>The 'Derive' Keyword</h3>
        Instead of writing the logic ourselves, <code>#[derive]</code> is a macro that tells the compiler: "Generate the implementation for these traits automatically."
      </div>
      <div className="content-block" style={{ fontSize: '0.85rem', background: 'rgba(0,0,0,0.03)', padding: '0.5rem' }}>
        <ul style={{ paddingLeft: '1.2rem' }}>
          <li><strong>PartialEq/Eq</strong>: Allows the HashMap to check if two keys are equal.</li>
          <li><strong>Hash</strong>: Allows the HashMap to calculate the "bucket" address where this key's value should be stored.</li>
        </ul>
      </div>
    </Page>
  );
});

export const TypeSafeCache = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">4. Refined Implementation</h2>
      <div className="content-block">
        Let's update our Cache to use these specific types:
      </div>
      <div className="code-snippet">
        <pre style={{ fontSize: '0.8rem' }}>
          {`struct Cache {
    data: HashMap<CacheKey, CacheValue>,
}

impl Cache {
    fn put(&mut self, key: CacheKey, value: CacheValue) {
        self.data.insert(key, value);
    }
}`}
        </pre>
      </div>
      <div className="content-block">
        Now, the signature is <strong>unambiguous</strong>. You cannot pass a value where a key is expected.
      </div>
    </Page>
  );
});

export const SafetyVerification = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">5. Safety Verification</h2>
      <div className="content-block">
        The true power of this pattern is felt during compilation:
      </div>
      <div className="code-snippet">
        <pre style={{ fontSize: '0.8rem' }}>
          {`#[test]
fn should_fail_to_swap() {
    let key = CacheKey("Sarthak".to_string());
    let val = CacheValue("Developer".to_string());
    
    // COMPILER ERROR!
    // Expected CacheKey, found CacheValue
    cache.put(val, key); 
}`}
        </pre>
      </div>
      <div className="content-block" style={{ fontStyle: 'italic', marginTop: '1.5rem', color: '#2e7d32' }}>
        <strong>"If it compiles, it works."</strong>
        <br />
        We have turned a logical error into a compiler error.
      </div>
    </Page>
  );
});


