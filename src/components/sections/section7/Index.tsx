import React, { forwardRef } from 'react';
import Page from '../../Page';
import CodeBlock from '../../CodeBlock';

export const Section7Cover = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <div className="page cover-page" data-density="hard" ref={ref}>
      <div className="page-content">
        <div className="cover-subtitle">Rust India Conference 2026</div>
        <div className="cover-decoration" />
        <h1 className="cover-title">STAGE 7</h1>
        <div className="cover-decoration" />
        <div className="cover-subtitle">The Performance Tax</div>
        <div className="cover-subtitle" style={{ marginTop: '2rem', fontStyle: 'italic' }}>
          Optimizing with Atomic Reference Counting (Arc).
        </div>
      </div>
      <div className="page-number">{props.number}</div>
    </div>
  );
});

export const Section7Intro = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">Stage 7 Roadmap</h2>
      <div className="content-block">
        In Stage 6, we achieved thread safety by cloning the data. But what if the values are large (like images or long text)? Cloning becomes a **Performance Tax**.
      </div>
      <div className="content-block">
        <ol style={{ paddingLeft: '1.5rem', lineHeight: '2.2' }}>
          <li><strong>The Cloning Tax</strong>: Revisiting our trade-off.</li>
          <li><strong>Introducing Arc</strong>: Atomic Reference Counting.</li>
          <li><strong>Shared Ownership</strong>: How it works on the heap.</li>
          <li><strong>Zero-Cost Returns</strong>: Cloning the pointer, not the data.</li>
          <li><strong>The Deref Link</strong>: Using Arc seamlessly.</li>
        </ol>
      </div>
    </Page>
  );
});

export const TheCloningTax = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">The Cloning Tax</h2>
      <div className="content-block">
        Our Stage 6 <code>get</code> solved the "Broken Get" problem by using <code>.cloned()</code>. While simple, it has a hidden cost:
      </div>
      <div className="code-snippet">
        <CodeBlock code={`// Stage 6 Implementation
fn get<Q>(&self, key: &Q) -> Option<V>
where
    K: Borrow<Q>,
    Q: Hash + Eq + ?Sized,
{
    self.data.read().unwrap().get(key).cloned() // <- COPIES ALL DATA
}`} style={{ fontSize: '0.8rem' }} />
      </div>
      <div className="content-block">
        If <code>V</code> is an 8MB image, every lookup copies 8MB of memory. This is unsustainable for a high-performance system. Can we share the ownership instead of copying?
      </div>
    </Page>
  );
});

export const IntroducingArc = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">Introducing Arc</h2>
      <div className="content-block">
        To share ownership across threads, we use <span className="keyword">Arc</span> (Atomic Reference Counted).
      </div>
      <div className="content-block">
        An <code>Arc</code> is a smart pointer that wraps your data and keeps track of how many people are using it.
      </div>
      <div className="code-snippet">
        <CodeBlock code={`use std::sync::Arc;

let shared_data = Arc::new("Big Data".to_string());
let thread_handle = Arc::clone(&shared_data); // Cheap!`} style={{ fontSize: '0.85rem' }} />
      </div>
      <div className="content-block">
        When the last <code>Arc</code> handle is dropped, Rust automatically cleans up the data.
      </div>
    </Page>
  );
});

export const ArcMechanics = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">How Arc Works</h2>
      <div className="content-block">
        Internally, <code>Arc</code> is a pointer to an <code>ArcInner</code> struct on the heap, which stores both the reference counts and your data.
      </div>
      <div className="code-snippet">
        <CodeBlock code={`pub struct Arc<T: ?Sized> {
    ptr: NonNull<ArcInner<T>>,
}

struct ArcInner<T: ?Sized> {
    strong: atomic::AtomicUsize, // The "Strong" count
    weak: atomic::AtomicUsize,   // For weak pointers
    data: T,                     // Your data!
}`} style={{ fontSize: '0.8rem' }} />
      </div>
      <div className="content-block" style={{ fontSize: '0.9rem' }}>
        When you clone an <code>Arc</code>, Rust doesn't touch your data. It just increments the <code>strong</code> counter using an atomic operation:
      </div>
      <div className="code-snippet">
        <CodeBlock code={`impl<T: ?Sized> Clone for Arc<T> {
    fn clone(&self) -> Arc<T> {
        // Atomic increment: safe across threads!
        self.inner().strong.fetch_add(1, Relaxed);
        unsafe { Self::from_inner(self.ptr) }
    }
}`} style={{ fontSize: '0.8rem' }} />
      </div>
    </Page>
  );
});

export const ArcInsideCache = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">Storing Arc in Cache</h2>
      <div className="content-block">
        Let's modify our <code>Cache</code> to store values wrapped in <code>Arc</code>.
      </div>
      <div className="code-snippet">
        <CodeBlock code={`struct Cache<K, V> {
    // HashMap now holds Arc-wrapped values
    data: RwLock<HashMap<K, Arc<V>>>,
}`} style={{ fontSize: '0.85rem' }} />
      </div>
      <div className="content-block">
        Even though we store <code>Arc{"<"}V{">"}</code>, we can keep the <code>put</code> signature simple. We wrap the incoming value into an <code>Arc</code> internally.
      </div>
    </Page>
  );
});

export const ArcDeref = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">Using Arc Data</h2>
      <div className="content-block">
        Just like the <code>Guard</code> we learned in Stage 6, <code>Arc</code> implements the <span className="keyword">Deref</span> trait.
      </div>
      <div className="content-block">
        This means you can call methods of the underlying type <code>V</code> directly on an <code>Arc{"<"}V{">"}</code>.
      </div>
      <div className="code-snippet">
        <CodeBlock code={`let arc_str: Arc<String> = Arc::new("Hello".to_string());

// You can use String methods directly:
let len = arc_str.len(); 

// Instead of:
// let len = (*arc_str).len();`} style={{ fontSize: '0.85rem' }} />
      </div>
    </Page>
  );
});

export const FinalArcImplementation = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">The Arc Implementation</h2>
      <div className="code-snippet">
        <CodeBlock code={`use std::sync::{Arc, RwLock};

impl<K, V> Cache<K, V> where K: Hash + Eq {
    fn put(&self, key: K, value: V) {
        // 1. Wrap value in Arc (Heap allocation)
        let shared_val = Arc::new(value);
        
        // 2. Store Arc in the map
        self.data.write().unwrap().insert(key, shared_val);
    }

    fn get<Q>(&self, key: &Q) -> Option<Arc<V>>
    where
        K: Borrow<Q>,
        Q: Hash + Eq + ?Sized,
    {
        // 3. Clone the Arc Handle (not the data!)
        // This is a call to Arc::clone()
        self.data.read().unwrap().get(key).cloned()
    }
}`} style={{ fontSize: '0.8rem' }} />
      </div>
      <div className="content-block">
        The <code>get</code> method now returns a clone of the <b>Arc Handle</b>. This lookup is now O(1) in both time and memory!
      </div>
    </Page>
  );
});

export const ArcTests = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">Optimized Verification</h2>
      <div className="content-block">
        Let's verify that we no longer need the <code>Clone</code> bound on <code>V</code>:
      </div>
      <div className="code-snippet">
        <CodeBlock code={`#[test]
fn test_arc_cache() {
    let cache = Cache::new();
    cache.put("ID_1", "HeavyData".to_string());
    
    // Returns Option<Arc<String>>
    let val = cache.get(&"ID_1").unwrap();
    
    // val behaves like a String thanks to Deref
    assert_eq!(&*val, "HeavyData");
}`} style={{ fontSize: '0.8rem' }} />
      </div>
      <div className="content-block" style={{ marginTop: '1rem', fontStyle: 'italic', color: 'var(--success-color)' }}>
        We've successfully moved from "Safe but Slow" to "Safe and Fast".
      </div>
    </Page>
  );
});
