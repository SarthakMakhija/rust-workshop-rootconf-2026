import React, { forwardRef } from 'react';
import Page from '../../Page';
import CodeBlock from '../../CodeBlock';

export const Section9Cover = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <div className="page cover-page" data-density="hard" ref={ref}>
      <div className="page-content">
        <div className="cover-subtitle">Rust India Conference 2026</div>
        <div className="cover-decoration" />
        <h1 className="cover-title">STAGE 9</h1>
        <div className="cover-decoration" />
        <div className="cover-subtitle">Shared Ownership</div>
        <div className="cover-subtitle" style={{ marginTop: '2rem', fontStyle: 'italic' }}>
          Scaling to Multiple Threads.
        </div>
      </div>
      <div className="page-number">{props.number}</div>
    </div>
  );
});

export const Stage9Roadmap = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">Stage 9 Roadmap</h2>
      <div className="content-block">
        <ul style={{ paddingLeft: '1.5rem', lineHeight: '2.2' }}>
          <li><strong>Beyond Scope</strong>: Why thread::scope isn't always portable.</li>
          <li><strong>The Ownership Wall</strong>: The paradox of shared stack data.</li>
          <li><strong>Arc&lt;Cache&gt;</strong>: Distributing ownership across spawned threads.</li>
          <li><strong>Send & Sync traits</strong>: Markers for safety in multithreading.</li>
          <li><strong>Verification</strong>: Scaling across thread boundaries.</li>
        </ul>
      </div>
    </Page>
  );
});

export const BeyondScope = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">Beyond the Scope</h2>
      <div className="content-block">
        Until now, we've used <code>std::thread::scope</code> to test our cache. This was a helpful "cheat code" because:
        <ul style={{ marginTop: '1rem', paddingLeft: '1.2rem' }}>
          <li>It allowed threads to <strong>borrow</strong> from the stack.</li>
          <li>It guaranteed threads would finish before the scope ended.</li>
        </ul>
      </div>
      <div className="content-block">
        In real applications (web servers, databases), threads often need to be <strong>spawned</strong> and move independently. This changes everything.
      </div>
      <div className="explanation-box" style={{ background: 'var(--accent-light)' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '0.4rem' }}>The Shift</h3>
        We are moving from <strong>borrowing</strong> (temporary access) to <strong>ownership</strong> (permanent responsibility).
      </div>
    </Page>
  );
});

export const TheOwnershipWall = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">The Ownership Wall</h2>
      <div className="content-block">
        Let's try to share our cache using the standard <code>std::thread::spawn</code>. What happens?
      </div>
      <div className="code-snippet">
        <CodeBlock code={`fn main() {
    let mut cache = Cache::new();
    
    // Thread 1 takes ownership of 'cache'
    std::thread::spawn(move || {
        cache.put("k1", "v1");
    });

    // ERROR: 'cache' was moved into the 
    // previous thread! It's gone.
    std::thread::spawn(move || {
        cache.get("k1");
    });
}`} />
      </div>
      <div className="content-block">
        <div className="error-text" style={{ color: '#ff8e8e', fontStyle: 'italic', fontSize: '0.9rem' }}>
          // COMPILATION ERROR:
        // value used here after move
        // 'cache' moved into closure in previous spawn
        </div>
      </div>
      <div className="content-block" style={{ fontSize: '0.9rem' }}>
        Rust is protecting us. Because a spawned thread could live <strong>longer</strong> than the <code>main</code> function, it cannot hold a reference to anything on <code>main</code>'s stack.
      </div>
    </Page>
  );
});

export const FoundationOfConcurrency = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">Foundations of Ownership</h2>
      <div className="content-block">
        In Rust, <strong>Ownership is the foundation of Concurrency.</strong>
      </div>
      <div className="content-block">
        To allow a thread to access data safely, it must either:
        <ul style={{ marginTop: '0.5rem', paddingLeft: '1.2rem' }}>
          <li><strong>Own</strong> the data (e.g., via <code>move</code>).</li>
          <li>Hold a reference to data that is <strong>guaranteed to live forever</strong> (<code>'static</code>).</li>
        </ul>
      </div>
      <div className="explanation-box" style={{ borderLeft: '4px solid var(--accent-color)' }}>
        If multiple threads need to own the <strong>same</strong> cache, we have a logical paradox. How can one thing have multiple owners?
      </div>
      <div className="content-block" style={{ marginTop: '1.5rem' }}>
        This is where <code>Arc</code> returns,not for the values <i>inside</i> the cache, but for the <strong>Cache itself</strong>.
      </div>
    </Page>
  );
});

export const SharedCacheArc = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">Shared Ownership: Arc&lt;Cache&gt;</h2>
      <div className="content-block">
        To make our cache truly "production-grade", we refactor it to be returned inside an <strong>Arc</strong>.
      </div>
      <div className="code-snippet">
        <CodeBlock code={`impl<K, V> Cache<K, V> {
    pub fn new() -> Arc<Self> {
        Arc::new(Self {
            data: RwLock::new(HashMap::new()),
        })
    }
}`} />
      </div>
      <div className="content-block" style={{ fontSize: '0.9rem' }}>
        Now, every time a thread needs access to the cache, we simply <code>Arc::clone(&cache)</code>.
        <br /><br />
        We aren't cloning the <strong>data</strong>; we are cloning the <strong>handle</strong> to the cache. The internal <code>RwLock</code> still handles the actual concurrency.
      </div>
    </Page>
  );
});

export const SendAndSync = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">Send + Sync + Cache</h2>
      <div className="content-block">
        Why is <code>Arc&lt;Cache&gt;</code> allowed to cross-thread boundaries? It relies on two marker traits:
      </div>
      <div className="explanation-box">
        <strong>Send</strong>: You can move the ownership of this type to another thread.
        <br /><br />
        <strong>Sync</strong>: You can share a reference to this type (<code>&T</code>) between threads safely.
      </div>
      <div className="content-block">
        Because <code>Cache</code> uses an <code>RwLock</code>, it is <strong>Sync</strong>. This tells the compiler: "It is safe for multiple threads to hold a reference to this structure simultaneously."
      </div>
    </Page>
  );
});

export const FinalVerification = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">Multi-threaded Verification</h2>
      <div className="content-block">
        With <code>Arc</code>, we can finally scale to any number of spawned threads:
      </div>
      <div className="code-snippet">
        <CodeBlock code={`#[test]
fn test_shared_access() {
    let mut cache = Cache::new();
    cache.put(String::from("hello"), String::from("world"));

    let cache_clone = cache.clone();
    let handle1 = std::thread::spawn(move || {
        cache_clone.put(String::from("k1"), String::from("v1"));
    });

    let handle2 = std::thread::spawn(move || {
        cache.put(String::from("k2"), String::from("v2"));
    });

    handle1.join().unwrap();
    handle2.join().unwrap();

    assert_eq!(*cache.get("k1").unwrap(), "v1");
    assert_eq!(*cache.get("k2").unwrap(), "v2");
}`} style={{ fontSize: '0.8rem' }} />
      </div>
    </Page>
  );
});


