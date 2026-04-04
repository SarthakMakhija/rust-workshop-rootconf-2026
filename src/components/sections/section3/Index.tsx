import React, { forwardRef } from 'react';
import Page from '../../Page';
import CodeBlock from '../../CodeBlock';

export const Section3Cover = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <div className="page cover-page" data-density="hard" ref={ref}>
      <div className="page-content">
        <div className="cover-subtitle">RootConf 2026</div>
        <div className="cover-decoration" />
        <h1 className="cover-title">STAGE 3</h1>
        <div className="cover-decoration" />
        <div className="cover-subtitle">Abstractions & Generics</div>
        <div className="cover-subtitle" style={{ marginTop: '2rem', fontStyle: 'italic' }}>
          Moving from Strings to Universal Types.
        </div>
      </div>
      <div className="page-number">{props.number}</div>
    </div>
  );
});

export const Section3Intro = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">Stage 3 Roadmap</h2>
      <div className="content-block">
        Our cache is now type-safe, but it only works for Strings. In this stage, we'll make it generic so it can store <strong>any</strong> type of data.
      </div>
      <div className="content-block">
        <ol style={{ paddingLeft: '1.5rem', lineHeight: '2.2' }}>
          <li><strong>Introduce Generics</strong>: Making our Cache type-agnostic.</li>
          <li><strong>Trait Bounds</strong>: Mastering the <code>Hash + Eq</code> requirements.</li>
          <li><strong>Syntax Evolution</strong>: Learning <code>where</code> clauses.</li>
          <li><strong>The Borrow Trait</strong>: Resolving the "mystery" of <code>&str</code> lookups.</li>
        </ol>
      </div>
    </Page>
  );
});

export const IntroducingGenerics = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">1. Introducing Generics</h2>
      <div className="content-block">
        Until now, our <code>Cache</code> was hardcoded. Let's make it flexible by using placeholders <span className="keyword">K</span> and <span className="keyword">V</span>.
      </div>
      <div className="code-snippet">
        <CodeBlock code={`struct Cache<K, V> {
    data: HashMap<K, V>,
}`} />
      </div>
      <div className="content-block">
        In Rust, generic parameters are replaced with concrete types (like <code>i32</code> or <code>String</code>) at compile-time—this process is called **Monomorphization**. Zero cost, again!
      </div>
    </Page>
  );
});

export const TraitBounds = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">2. Trait Bounds</h2>
      <div className="content-block">
        But wait! A <code>HashMap</code> cannot use *just any* type as a key. If we try to compile the previous snippet, Rust yells at us:
      </div>
      <div className="code-snippet">
        <CodeBlock code={`error[E0277]: the trait bound 'K: Eq' is not satisfied
error[E0277]: the trait bound 'K: Hash' is not satisfied
  --> src/main.rs:5:11
   |
 5 |     data: HashMap<K, V>,
   |           ^^^^^^^^^^^ the trait 'Hash' is not implemented for 'K'`} className="error-text" style={{ fontSize: '0.8rem' }} />
      </div>
      <div className="content-block">
        We must explicitly tell the compiler: "K can be any type, **provided it implements** Hash and Eq."
      </div>
    </Page>
  );
});

export const GenericSyntax = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">3. The Syntax of Bounds</h2>
      <div className="content-block">
        Rust offers two ways to define these constraints:
      </div>
      <div className="code-snippet">
        <CodeBlock code={`// 1. Inline Bounds (Concise for few constraints)
struct Cache<K: Hash + Eq, V> {
    data: HashMap<K, V>,
}

// 2. Where Clauses (Clearer for complex logic)
struct Cache<K, V> 
where 
    K: Hash + Eq
{
    data: HashMap<K, V>,
}`} style={{ fontSize: '0.8rem' }} />
      </div>
      <div className="content-block">
        As your traits grow (e.g., <code>K: Hash + Eq + Send + Sync</code>), <code>where</code> clauses become essential for readability.
      </div>
    </Page>
  );
});

export const TheBorrowTrait = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">4. The Borrow Mystery</h2>
      <div className="content-block">
        Remember the question from Stage 1: How does a <code>HashMap{"<"}String, V{">"}</code> allow a <code>&str</code> as a key for lookups?
      </div>
      <div className="content-block">
        The answer lies in the <span className="keyword">Borrow</span> trait. It allows a type to provide an immutable reference to another type.
      </div>
      <div className="code-snippet">
        <CodeBlock code={`impl Cache<K, V> 
where K: Hash + Eq
{
    fn get<Q>(&self, key: &Q) -> Option<&V> 
    where K: Borrow<Q>,      // K (String) can be borrowed as Q (str)
          Q: Hash + Eq + ?Sized
    {
        self.data.get(key)
    }
}`} style={{ fontSize: '0.8rem' }} />
      </div>
      <div className="content-block" style={{ fontStyle: 'italic', borderLeft: '2px solid #ccc', paddingLeft: '1rem', fontSize: '0.9rem' }}>
        This is why <code>&str</code> works for <code>String</code> keys! It prevents unnecessary allocations by allowing the caller to pass a borrowed version of the key.
      </div>
    </Page>
  );
});

export const GenericCacheImpl = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">5. Final Implementation</h2>
      <div className="content-block">
        Our fully generic, allocation-optimized cache looks like this:
      </div>
      <div className="code-snippet">
        <CodeBlock code={`use std::collections::HashMap;
use std::borrow::Borrow;
use std::hash::Hash;

struct Cache<K, V> {
    data: HashMap<K, V>,
}

impl<K, V> Cache<K, V> 
where K: Hash + Eq 
{
    fn put(&mut self, key: K, value: V) {
        self.data.insert(key, value);
    }

    fn get<Q>(&self, key: &Q) -> Option<&V>
    where 
        K: Borrow<Q>, 
        Q: Hash + Eq + ?Sized
    {
        self.data.get(key)
    }
}`} style={{ fontSize: '0.75rem' }} />
      </div>
      <div className="explanation-box">
        <strong>What is ?Sized?</strong>
        <p style={{ marginTop: '0.5rem' }}>
          By default, generic types must have a known size at compile time. 
          However, types like <code>str</code> are unsized. <code>?Sized</code> tells Rust: 
          "Q may or may not have a known size", allowing us to use <code>&str</code>.
        </p>
      </div>
    </Page>
  );
});

export const GenericTests = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">6. Comprehensive Testing</h2>
      <div className="content-block">
        One implementation, many types. Let's verify:
      </div>
      <div className="code-snippet">
        <CodeBlock code={`#[test]
fn test_complex_types() {
    // A cache for User IDs (i32) and Names (String)
    let mut cache = Cache::new();
    cache.put(1, "Sarthak".to_string());
    
    // Lookup using a reference to i32
    assert!(cache.get(&1).is_some());
}

#[test]
fn test_string_lookup() {
    let mut cache = Cache::new();
    cache.put("ID".to_string(), "100".to_string());

    // Lookup using &str (Zero-Allocation!)
    assert!(cache.get("ID").is_some());
}`} style={{ fontSize: '0.75rem' }} />
      </div>
      <div className="content-block" style={{ marginTop: '1rem', fontStyle: 'italic', color: 'var(--success-color)' }}>
        We have achieved the ultimate balance: <strong>Type Safety</strong> and <strong>Generality</strong>.
      </div>
    </Page>
  );
});
