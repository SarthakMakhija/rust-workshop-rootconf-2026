import React, { forwardRef } from 'react';
import Page from '../../Page';
import CodeBlock from '../../CodeBlock';

export const Section13Cover = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <div className="page cover-page" data-density="hard" ref={ref}>
      <div className="page-content">
        <div className="cover-subtitle">Rust India Conference 2026</div>
        <div className="cover-decoration" />
        <h1 className="cover-title">STAGE 13</h1>
        <div className="cover-decoration" />
        <div className="cover-subtitle">The Type-State Pattern</div>
        <div className="cover-subtitle" style={{ marginTop: '2rem', fontStyle: 'italic' }}>
          Encoding State into Types.
        </div>
      </div>
      <div className="page-number">{props.number}</div>
    </div>
  );
});

export const Stage13Roadmap = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">Stage 13 Roadmap</h2>
      <div className="content-block">
        <ul style={{ paddingLeft: '1.5rem', lineHeight: '2.2' }}>
          <li><strong>The Shutdown Problem</strong>: Managing object lifecycle.</li>
          <li><strong>The Runtime Tax</strong>: Why boolean flags are suboptimal.</li>
          <li><strong>Ownership as Termination</strong>: Leveraging <code>self</code>.</li>
          <li><strong>Type-State Pattern</strong>: Formal state encoding.</li>
          <li><strong>Limits of Type-State</strong>: Why clones break static state.</li>
          <li><strong>Handle-Body Pattern</strong>: Decoupling Lifecycle from Data.</li>
          <li><strong>Graceful Shutdown</strong>: Coordinating thread exit.</li>
        </ul>
      </div>
    </Page>
  );
});

export const ShutdownIntro = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">The Shutdown Problem</h2>
      <div className="content-block">
        In sophisticated systems, objects have a lifecycle. A <code>Cache</code> might need to be explicitly <strong>shut down</strong> to:
        <ul style={{ marginTop: '1rem', paddingLeft: '1.2rem' }}>
          <li>Flush remaining data to disk.</li>
          <li>Stop background cleanup threads.</li>
          <li>Release OS handles or sockets.</li>
        </ul>
      </div>
      <div className="content-block">
        But how do we ensure that no one tries to use the cache <strong>after</strong> it has been shut down?
      </div>
    </Page>
  );
});

export const NaiveApproach = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">The Runtime Check Tax</h2>
      <div className="content-block">
        One way to handle shutdown is using a flag and <code>&self</code>. This is the <strong>naive</strong> approach:
      </div>
      <div className="code-snippet">
        <CodeBlock code={`struct Cache {
    is_shutdown: bool,
    data: RwLock<HashMap<...>>,
}

impl Cache {
    fn put(&self, k: K, v: V) {
        if self.is_shutdown { 
            panic!("Cache is closed!"); 
        }
    }
    
    fn shutdown(&mut self) {
        self.is_shutdown = true;
    }
}`} />
      </div>
      <div className="explanation-box" style={{ borderLeft: '4px solid #ff8e8e' }}>
        <strong>The Problem:</strong> Every single call to <code>put</code> or <code>get</code> now pays an "Execution Tax" to check the flag, and we risk runtime panics.
      </div>
    </Page>
  );
});

export const OwnershipTermination = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">Ownership as Termination</h2>
      <div className="content-block">
        A more "Rustacean" approach is to take <strong>ownership</strong> of the cache during shutdown:
      </div>
      <div className="code-snippet">
        <CodeBlock code={`impl Cache {
    // Note: 'self' instead of '&self'
    fn shutdown(self) {
        // The cache is consumed here.
        // It will be dropped at the end 
        // of this function.
    }
}`} />
      </div>
      <div className="content-block">
        By taking <code>self</code>, we leverage Rust's move semantics. Once <code>shutdown</code> is called, the original variable name is no longer valid.
      </div>
      <div className="explanation-box">
        This creates a <strong>Safe API</strong>: The compiler literally won't let you call <code>cache.put()</code> after <code>cache.shutdown()</code> because the object (cache) no longer exists!
      </div>
    </Page>
  );
});

export const TypeStateConcept = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">The Type-State Pattern</h2>
      <div className="content-block">
        What if we want to handle states more formally? We can encode the <strong>State</strong> directly into the <strong>Type</strong>.
      </div>
      <div className="code-snippet" style={{ fontSize: '0.85rem' }}>
        <CodeBlock code={`struct Active;
struct Shutdown;

struct Cache<S> {
    data: RwLock<HashMap<...>>,
    _state: PhantomData<S>, 
}

impl Cache<Active> {
    fn put(&self, ...) { /* ... */ }
    
    fn shutdown(self) -> Cache<Shutdown> {
        Cache { data: self.data, _state: PhantomData }
    }
}`} />
      </div>
      <div className="content-block" style={{ fontSize: '0.9rem' }}>
        The <code>PhantomData</code> marker is essential because the generic parameter <code>S</code> is not used in any of the struct's fields. It tells the compiler: "Forget that I'm not using <code>S</code>; pretend I am, so I can keep this type safety."
      </div>
      <div className="code-snippet" style={{ marginTop: '1rem' }}>
        <CodeBlock code={`impl Cache<Shutdown> {
    // No methods like 'put' or 'get' are defined here.
    // Consequently, they are NOT available for use.
}`} />
      </div>
    </Page>
  );
});

export const CompilerAsGuard = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">The Compiler as Guard</h2>
      <div className="content-block">
        Now, notice what happens when we try to misuse the API. We only define <code>put</code> and <code>get</code> inside the <code>impl Cache&lt;Active&gt;</code> block, and <strong><code>shutdown</code> itself takes <code>self</code></strong> to consume the active cache.
      </div>
      <div className="code-snippet">
        <CodeBlock code={`let cache = Cache::<Active>::new();
let closed_cache = cache.shutdown();

// ERROR: no method named 'put' found 
// ERROR: for struct 'Cache<Shutdown>'
closed_cache.put("key", "value");`} />
      </div>
      <div className="content-block">
        <div className="error-text" style={{ color: '#ff8e8e', fontStyle: 'italic', fontSize: '0.9rem' }}>
          // COMPILATION ERROR:
        // The 'put' method is only available 
        // when the Cache is in the 'Active' state.
        </div>
      </div>
      <div className="explanation-box" style={{ marginTop: '1.5rem' }}>
        We have successfully turned a <strong>Logic Bug</strong> into a <strong>Compiler Error</strong>. This is the essence of a Safe API in Rust.
      </div>
    </Page>
  );
});

export const TypeStateLimitations = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">The Limits of Type-State</h2>
      <div className="content-block">
        Type-States are exceptional for <strong>Sequential Ownership</strong>, but they hit a wall when we introduce <strong>Concurrency</strong> and <strong>Clones</strong> (via <code>Arc</code>).
      </div>
      <div className="explanation-box" style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
        <h3 style={{ fontSize: '1rem', color: '#dc2626' }}>The Clone Problem</h3>
        <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
          If you clone a <code>Cache&lt;Active&gt;</code>, you have multiple objects that statically believe they are "Active".
        </p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
          If one handle shuts down, the other handles don't magically "transform" into <code>Cache&lt;Shutdown&gt;</code> at compile-time. The compiler cannot reconcile these separate ownership trees.
        </p>
      </div>
      <div className="content-block" style={{ marginTop: '1rem', fontStyle: 'italic', fontSize: '0.9rem' }}>
        To coordinate a shared background thread, we need a <b>Hybrid Solution</b>: a Runtime Signal that all clones can see.
      </div>
    </Page>
  );
});

export const HandleBodyPattern = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">The Handle-Body Pattern</h2>
      <div className="content-block">
        To build a production-grade cache that supports graceful shutdown, we must decouple <strong>Lifecycle Management</strong> from <strong>Data Access</strong>.
      </div>
      <div className="explanation-box" style={{ background: 'var(--accent-light)', borderLeft: '4px solid var(--accent-color)' }}>
        <h3 style={{ fontSize: '1rem', color: 'var(--accent-color)' }}>The Separation of Concerns</h3>
        <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
          <strong>The Handle (Cache)</strong>: A lightweight wrapper that users hold. It manages the background thread's lifecycle.
        </p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
          <strong>The Body (CacheInner)</strong>: The heavy, shared data structures (Shards, Stats) sitting behind an <code>Arc</code>.
        </p>
      </div>
      <div className="content-block" style={{ marginTop: '1.5rem', fontSize: '0.9rem' }}>
        This allows us to distinguish between the <b>Master Handle</b> (created once, owns the thread) and <b>Worker Handles</b> (cloned, shared across threads).
      </div>
    </Page>
  );
});

export const HandleBodyImplementation = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">Implementing the Pattern</h2>
      <div className="code-snippet">
        <CodeBlock code={`pub struct Cache<K, V>
where
    K: Hash + Eq + Clone + Send + Sync + 'static,
    V: Send + Sync + 'static,
{
    inner: Arc<CacheInner<K, V>>,
    cleaner: Option<JoinHandle<()>>,
}

struct CacheInner<K, V>
where
    K: Hash + Eq + Clone + Send + Sync + 'static,
    V: Send + Sync + 'static,
{
    shards: Vec<Shard<K, V>>,
    num_shards: usize,
    shutting_down: AtomicBool,
}

impl<K, V> Clone for Cache<K, V>
where
    K: Hash + Eq + Clone + Send + Sync + 'static,
    V: Send + Sync + 'static,
{
    fn clone(&self) -> Self {
        // Workers don't get the cleaner handle!
        Cache {
            inner: self.inner.clone(),
            cleaner: None,
        }
    }
}`} style={{ fontSize: '0.75rem' }} />
      </div>
      <div className="content-block" style={{ fontSize: '0.85rem', marginTop: '1rem' }}>
        Notice the <code>impl Clone</code>: clones only copy the <code>Arc</code>. This means only one handle (the Master) ever possesses the <code>JoinHandle</code> for the background thread.
      </div>
    </Page>
  );
});

export const ImplementingShutdown = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">Graceful Shutdown</h2>
      <div className="content-block">
        We use <strong>Ownership</strong> (taking <code>self</code>) combined with <strong>Atomic Signaling</strong> to shut down precisely.
      </div>
      <div className="code-snippet">
        <CodeBlock code={`impl<K, V> Cache<K, V>
where
    K: Hash + Eq + Clone + Send + Sync + 'static,
    V: Send + Sync + 'static,
{
    pub fn shutdown(mut self) {
        // 1. Signal shutdown to the cleaner thread
        self.inner.mark_shutting_down();

        // 2. Wait for the thread to exit gracefully
        if let Some(handle) = self.cleaner.take() {
            handle.join().unwrap();
        }
    }
}

impl<K, V> CacheInner<K, V>
where
    K: Hash + Eq + Clone + Send + Sync + 'static,
    V: Send + Sync + 'static,
{
    fn mark_shutting_down(&self) {
        self.shutting_down.store(true, Ordering::Release);
    }
}`} style={{ fontSize: '0.75rem' }} />
      </div>
      <div className="content-block" style={{ fontSize: '0.85rem', marginTop: '1rem' }}>
        By consuming <code>self</code>, we ensure the caller cannot use the handle ever again. The atomic flag signals the cleaner thread to break its loop.
      </div>
    </Page>
  );
});

export const CleanerExitLogic = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">Cooperative Cleaner Exit</h2>
      <div className="content-block">
        The cleaner thread now checks the flag on every iteration.
      </div>
      <div className="code-snippet">
        <CodeBlock code={`fn spawn_cleaner(inner: Arc<CacheInner<K, V>>) -> JoinHandle<()>
where
    K: Hash + Eq + Clone + Send + Sync + 'static,
    V: Send + Sync + 'static,
{
    thread::spawn(move || {
        let mut shard_index = 0;
        loop {
            // 🔑 The Cooperative Check
            if inner.shutting_down.load(Ordering::Acquire) {
                return;
            }

            let shard = &inner.shards[shard_index];
            shard.cleanup();

            shard_index = (shard_index + 1) % inner.shards.len();
            thread::sleep(Duration::from_millis(500));
        }
    })
}`} style={{ fontSize: '0.75rem' }} />
      </div>
      <div className="explanation-box" style={{ background: 'var(--accent-light)', marginTop: '1rem' }}>
        <strong>Acquire/Release</strong> ensures that the moment <code>shutdown</code> stores <code>true</code>, the cleaner thread sees it on the next loop iteration, even on a different CPU core.
      </div>
    </Page>
  );
});

export const ShutdownVerification = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">Verification</h2>
      <div className="content-block">
        We can verify that after shutdown, the cache becomes inaccessible to everyone.
      </div>
      <div className="code-snippet">
        <CodeBlock code={`#[test]
fn get_nothing_after_shutdown() {
    let cache = Cache::new(8);
    let cache_clone = cache.clone();

    cache.put("key".to_string(), "val".to_string(), Duration::from_secs(1));
    
    // MASTER shuts down, cache variable is not accessible anymore.
    cache.shutdown();
    
    // WORKER handle now sees NOTHING
    assert!(cache_clone.get("key").is_none());
}`} style={{ fontSize: '0.8rem' }} />
      </div>
    </Page>
  );
});


