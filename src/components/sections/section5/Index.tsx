import React, { forwardRef } from 'react';
import Page from '../../Page';
import CodeBlock from '../../CodeBlock';

export const Section5Cover = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <div className="page cover-page" data-density="hard" ref={ref}>
      <div className="page-content">
        <div className="cover-subtitle">RootConf 2026</div>
        <div className="cover-decoration" />
        <h1 className="cover-title">STAGE 5</h1>
        <div className="cover-decoration" />
        <div className="cover-subtitle">Interior Mutability</div>
        <div className="cover-subtitle" style={{ marginTop: '2rem', fontStyle: 'italic' }}>
          Moving borrow rules to runtime.
        </div>
      </div>
      <div className="page-number">{props.number}</div>
    </div>
  );
});

export const Stage5Roadmap = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">Stage 5 Roadmap</h2>
      <div className="content-block">
        <ul style={{ paddingLeft: '1.5rem', lineHeight: '2.0' }}>
          <li><strong>The Entry Struct</strong>: Wrapping values in RefCell.</li>
          <li><strong>RefCell Methods</strong>: Mutating through immutable references.</li>
          <li><strong>Cache Integration</strong>: Storing Entries natively.</li>
          <li><strong>Runtime Borrow Problem</strong>: The Dual Mutation Client.</li>
          <li><strong>Runtime Panic</strong>: Triggering BorrowMutError.</li>
        </ul>
      </div>
    </Page>
  );
});

export const TheEntryStruct = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">The Entry Struct</h2>
      <div className="content-block" style={{ fontSize: '0.85rem' }}>
        What if we want to allow mutation but we only possess a shared reference (<code>&self</code>)? Enter <strong>Interior Mutability</strong>.
      </div>
      <div className="code-snippet">
        <CodeBlock code={`use std::cell::RefCell;

#[derive(Debug)]
struct Entry<V> {
    value: RefCell<V>,
}`} style={{ fontSize: '0.85rem' }} />
      </div>
      <div className="explanation-box" style={{ marginTop: '1rem', background: 'rgba(56, 189, 248, 0.05)' }}>
        <h3 style={{ fontSize: '0.9rem', color: 'var(--accent-color)' }}>RefCell & Debug</h3>
        <ul style={{ paddingLeft: '1rem', lineHeight: '1.6', fontSize: '0.75rem', marginTop: '0.5rem' }}>
          <li>
            <strong><code>RefCell{"<V>"}</code></strong>: Maintains a dynamic tracker (a "Borrow Flag") at runtime. It counts how many active readers or writers exist!
          </li>
          <li style={{ marginTop: '0.5rem' }}>
            <strong><code>#[derive(Debug)]</code></strong>: Instructs the compiler to auto-generate code to safely print the contents of <code>Entry</code> and its `RefCell` internals when using <code>{"{:?}"}</code>.
          </li>
        </ul>
      </div>
    </Page>
  );
});

export const RefCellMethods = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">Yielding References</h2>
      <div className="content-block" style={{ fontSize: '0.85rem' }}>
        We implement explicit methods to fetch the inner value out of the <code>RefCell</code>.
      </div>
      <div className="code-snippet">
        <CodeBlock code={`impl<V> Entry<V> {
    fn get(&self) -> std::cell::Ref<'_, V> {
        self.value.borrow()
    }

    // 🚩 Mind-bending: &mut returned from &self
    fn get_mut(&self) -> std::cell::RefMut<'_, V> {
        self.value.borrow_mut()
    }
}`} style={{ fontSize: '0.8rem' }} />
      </div>
      <div className="content-block" style={{ marginTop: '1rem', fontSize: '0.8rem' }}>
        Notice what happened? Both methods take <strong><code>&self</code> (immutable reference)</strong>! The <code>RefCell</code> allows us to dynamically extract a mutable handle (<code>RefMut</code>) without needing a statically mutable owner!
      </div>
      <div className="explanation-box" style={{ marginTop: '0.8rem', background: '#eef2ff' }}>
        <h3 style={{ fontSize: '0.9rem', color: '#4f46e5' }}>The Anonymous Lifetime ('_)</h3>
        <div style={{ fontSize: '0.75rem', marginTop: '0.3rem' }}>
          We use exactly <code>{`'_`}</code> returning <code>{`std::cell::Ref<'_ , V>`}</code>. This tells the compiler the returned guard is tied exclusively to the scope of <code>&self</code>. Don't worry—we'll cover lifetimes extensively in a later stage!
        </div>
      </div>
    </Page>
  );
});

export const CacheIntegration = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">Cache Integration</h2>
      <div className="content-block" style={{ fontSize: '0.85rem' }}>
        We plug the <code>Entry</code> struct directly into the cache. 
      </div>
      <div className="code-snippet">
        <CodeBlock code={`impl<K, V> Cache<K, V> where K: Eq + Hash {
    fn put(&mut self, k: K, v: V) {
        // Wrap 'v' inside the Entry & RefCell
        self.data.insert(k, Entry { 
            value: RefCell::new(v) 
        });
    }

    // Return the Entry wrapper itself
    fn get<Q: ?Sized>(&self, k: &Q) -> Option<&Entry<V>>
    where
        Q: Hash + Eq,
        K: Borrow<Q>,
    {
        self.data.get(k)
    }
}`} style={{ fontSize: '0.75rem' }} />
      </div>
      <div className="content-block" style={{ fontWeight: 'bold', fontSize: '0.85rem', marginTop: '0.5rem' }}>
        Notice: The Cache no longer has a <code>get_mut</code> method.
      </div>
    </Page>
  );
});

export const RuntimeBorrowProblem = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">The Runtime Test</h2>
      <div className="content-block" style={{ fontSize: '0.85rem' }}>
        Let's try identical client logic: grabbing the same entry twice and asking for two mutable borrows. Because `Cache::get` takes `&self`, the compiler is completely happy!
      </div>
      <div className="code-snippet">
        <CodeBlock code={`fn main() {
    let mut cache = Cache::new();
    cache.put(String::from("hello"), String::from("world"));

    let entry1 = cache.get("hello").unwrap();
    let entry2 = cache.get("hello").unwrap();

    let writer1 = entry1.get_mut();
    // What happens here?
    let writer2 = entry2.get_mut(); 

    println!("entry1: {:?}, entry2: {:?}", writer1, writer2);
}`} style={{ fontSize: '0.75rem' }} />
      </div>
      <div className="content-block" style={{ fontSize: '0.85rem' }}>
        The code <strong>compiles successfully</strong>. But does it run successfully?
      </div>
    </Page>
  );
});

export const RuntimePanicError = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">BorrowMutError</h2>
      <div className="content-block" style={{ fontSize: '0.85rem' }}>
        When executed, the program instantly crashes.
      </div>
      <div className="code-snippet">
        <CodeBlock code={`thread 'main' panicked at src/main.rs:66:20:
already borrowed: BorrowMutError`} className="error-text" style={{ fontSize: '0.8rem' }} />
      </div>
      <div className="explanation-box" style={{ marginTop: '1rem', background: '#eef2ff' }}>
        <h3 style={{ fontSize: '0.9rem', color: '#4f46e5' }}>Compile-time vs Runtime</h3>
        <div style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
          <code>RefCell</code> uses an internal integer to track active borrows. 
          When <code>entry1.get_mut()</code> runs, it flips the flag to <b>-1 (Writer Active)</b>.
        </div>
        <div style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
          When <code>entry2.get_mut()</code> attempts to flip the flag *again*, the `RefCell` detects the violation and instantly <strong>Panics</strong> to preserve memory safety.
        </div>
      </div>
      <div className="content-block" style={{ marginTop: '1rem', fontStyle: 'italic', fontSize: '0.8rem', textAlign: 'center' }}>
        Safety is guaranteed, but now we pay with program crashes instead of compiler errors.
      </div>
    </Page>
  );
});
