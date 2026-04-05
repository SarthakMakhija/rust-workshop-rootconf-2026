import React, { forwardRef } from 'react';
import Page from '../../Page';
import CodeBlock from '../../CodeBlock';

export const Section6Cover = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <div className="page cover-page" data-density="hard" ref={ref}>
      <div className="page-content">
        <div className="cover-subtitle">Rust India Conference 2026</div>
        <div className="cover-decoration" />
        <h1 className="cover-title">STAGE 6</h1>
        <div className="cover-decoration" />
        <div className="cover-subtitle">Concurrency & Thread Safety</div>
        <div className="cover-subtitle" style={{ marginTop: '2rem', fontStyle: 'italic' }}>
          Protecting shared data in a multi-threaded world.
        </div>
      </div>
      <div className="page-number">{props.number}</div>
    </div>
  );
});

export const Section6Intro = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">Stage 6 Roadmap</h2>
      <div className="content-block">
        Our cache is now generic and type-safe, but it's not **Thread Safe**. If two threads try to modify it at once, we'll get a compilation error.
      </div>
      <div className="content-block">
        <ol style={{ paddingLeft: '1.25rem', lineHeight: '1.8' }}>
          <li><strong>Internal Mutability</strong>: Introducing <code>RwLock</code>.</li>
          <li><strong>RAII Guards</strong>: Automatic locking and unlocking.</li>
          <li><strong>The Deref Magic</strong>: How guards behave like data.</li>
          <li><strong>The Broken Get</strong>: Why references fail in a locked world.</li>
          <li><strong>Ownership Shift</strong>: Solving it with <code>Clone</code>.</li>
        </ol>
      </div>
    </Page>
  );
});

export const ConcurrencyIntro = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">The Concurrency Challenge</h2>
      <div className="content-block">
        Until now, our <code>Cache</code> assumed a single thread of execution. But in modern systems, we want multiple threads to read and write data simultaneously.
      </div>
      <div className="content-block">
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>The Problem:</h3>
        If two threads attempt to modify the <code>HashMap</code> at the same time, we encounter <strong>Data Races</strong>. Rust's borrow checker prevents this at compile-time.
      </div>
      <div className="content-block" style={{ textAlign: 'center', margin: '1rem 0', fontWeight: 'bold', color: 'var(--error-color)' }}>
        "Either MANY readers OR ONE writer."
      </div>
      <div className="content-block">
        To bridge this gap, we need <strong>Synchronization Primitives</strong>.
      </div>
    </Page>
  );
});

export const CompilationError = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">Sharing is Hard</h2>
      <div className="content-block">
        Why can't we just share a <code>&mut Cache</code> across threads using a modern scoped thread API?
      </div>
      <div className="code-snippet">
        <CodeBlock code={`thread::scope(|s| {
    s.spawn(|| cache.put(1, "A".to_string()));
    s.spawn(|| cache.put(2, "B".to_string())); // ERROR!
});

error[E0499]: cannot borrow 'cache' as mutable more than once`} className="error-text" style={{ fontSize: '0.75rem' }} />
      </div>
      <div className="content-block">
        The compiler enforces the <strong>Shared XOR Mutable</strong> rule. This is the heart of Rust's safety:
      </div>
      <div className="content-block">
        <ul style={{ paddingLeft: '1.2rem', lineHeight: '1.8' }}>
          <li><strong>Shared References (&T)</strong>: Many readers allowed.</li>
          <li><strong>Mutable Reference (&mut T)</strong>: Exactly one writer allowed.</li>
        </ul>
        <p className="error-text" style={{ marginTop: '0.5rem', textAlign: 'center' }}>
          BUT NEVER BOTH AT THE SAME TIME.
        </p>
      </div>
      <div className="content-block">
        Because <code>put()</code> requires <code>&mut self</code>, it's impossible to share a bare <code>HashMap</code> across threads for mutation. We need a way to turn a <b>Shared</b> reference into a <b>Mutable</b> one safely.
      </div>
    </Page>
  );
});

export const ThreadSafeWrapper = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">Interior Mutability</h2>
      <div className="content-block">
        To allow multiple threads to access our cache, we wrap our HashMap in a "Synchronization Primitive". Let's use an <span className="keyword">RwLock</span> (Read-Write Lock).
      </div>
      <div className="code-snippet">
        <CodeBlock code={`use std::sync::RwLock;

struct Cache<K, V> {
    data: RwLock<HashMap<K, V>>,
}`} />
      </div>
      <div className="content-block">
        An <code>RwLock</code> allows <b>many readers</b> OR <b>one writer</b> at a time. It successfully turns shared access into exclusive access when needed.
      </div>
    </Page>
  );
});

export const RAIIGuards = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">RAII & Lock Guards</h2>
      <div className="content-block">
        In Rust, you don't manually call <code>unlock()</code>. Instead, when you call <code>.write()</code>, it returns a <b>Guard</b>.
      </div>
      <div className="code-snippet">
        <CodeBlock code={`fn put(&self, key: K, value: V) {
    // Acquire the write lock
    let mut guard = self.data.write().unwrap();
    
    // Access the data through the guard
    guard.insert(key, value);
    
    // Guard goes out of scope -> Lock is released!
}`} style={{ fontSize: '0.8rem' }} />
      </div>
      <div className="content-block">
        The lock's lifetime is tied to the <b>Guard Object</b>. When the guard is dropped, the lock is automatically released.
      </div>
    </Page>
  );
});

export const InnerLockingDrop = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">How Unlocking Works</h2>
      <div className="content-block">
        Let's look at the actual definition of a <code>Guard</code> in the Rust Standard Library:
      </div>
      <div className="code-snippet">
        <CodeBlock code={`pub struct RwLockWriteGuard<'a, T: ?Sized + 'a> {
    lock: &'a RwLock<T>,
}

impl<T: ?Sized> Drop for RwLockWriteGuard<'_, T> {
    fn drop(&mut self) {
        unsafe {
            // This is the actual MAGIC of RAII
            self.lock.inner.write_unlock();
        }
    }
}`} style={{ fontSize: '0.75rem' }} />
      </div>
      <div className="content-block" style={{ fontSize: '0.9rem' }}>
        The Guard holds an <b>explicit borrow</b> (<code>&'a RwLock{"<"}T{">"}</code>) of the original lock. 
        Because it is a borrow, Rust's borrow checker ensures that the <b>Guard can NEVER outlive the Lock</b>.
      </div>
      <div className="content-block" style={{ fontSize: '0.9rem', backgroundColor: 'rgba(239, 68, 68, 0.05)', padding: '0.8rem', borderRadius: '4px', borderLeft: '3px solid var(--error-color)' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '0.4rem' }}>What if the Guard outlived the Lock?</h3>
        If this were possible, the Guard's <code>drop()</code> method would attempt to unlock a <b>dropped/garbage</b> memory location. 
        This would be a classic "Use-After-Free" crash. Rust prevents this entirely at <b>compile-time</b>.
      </div>
    </Page>
  );
});

export const TheDerefTrait = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">The Deref Magic</h2>
      <div className="content-block">
        Wait! <code>guard</code> is an <code>RwLockReadGuard</code>, not a <code>HashMap</code>. How did we call <code>.get()</code> on it?
      </div>
      <div className="content-block">
        The secret is the <span className="keyword">Deref</span> trait. It allows smart pointers (and Guards) to behave like the data they wrap.
      </div>
      <div className="code-snippet">
        <CodeBlock code={`pub struct RwLockReadGuard<'a, T: ?Sized + 'a> {
    data: NonNull<T>,
}

impl<T: ?Sized> Deref for RwLockReadGuard<'_, T> {
    type Target = T;

    fn deref(&self) -> &T {
        unsafe { self.data.as_ref() }
    }
}`} style={{ fontSize: '0.75rem' }} />
      </div>
      <div className="content-block" style={{ fontSize: '0.9rem' }}>
        When we use the <code>guard</code>, Rust sees that it doesn't have the method we're calling. It then checks if the guard implements <b>Deref</b>. 
        If it does, it implicitly calls <code>.deref()</code>, which returns a <b>reference to the underlying data</b>.
      </div>
      <div className="content-block" style={{ fontStyle: 'italic', borderLeft: '2px solid #ccc', paddingLeft: '1rem', fontSize: '0.9rem' }}>
        This "Deref Coercion" is what makes Rust's smart pointers feel so ergonomic while maintaining absolute safety.
      </div>
    </Page>
  );
});

export const TheUnwrapMystery = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">Why unwrap()?</h2>
      <div className="content-block">
        If a thread holding the lock **panics**, the lock becomes "Poisoned". Rust prevents other threads from accessing potentially inconsistent data.
      </div>
      <div className="code-snippet">
        <CodeBlock code={`// .write() returns Result<Guard, PoisonError>
let guard = self.data.write().unwrap();`} style={{ fontSize: '0.85rem' }} />
      </div>
      <div className="content-block">
        By calling <code>.unwrap()</code>, we say: "If the lock is poisoned, just panic my thread too, because the system is in an invalid state."
      </div>
    </Page>
  );
});

export const TheBrokenGet = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">The Broken 'Get'</h2>
      <div className="content-block">
        Our previous <code>get</code> returned <code>Option{"<"}&V{">"}</code>. But with a Lock, the compiler sees a fatal flaw:
      </div>
      <div className="code-snippet">
        <CodeBlock code={`fn get(&self, key: &K) -> Option<&V> {
    // 1. Acquire the Read Lock
    let guard = self.data.read().unwrap();
    
    // 2. Point into the locked data
    guard.get(key) 
} // 3. Guard is dropped -> Lock is RELEASED!`} style={{ fontSize: '0.75rem' }} />
      </div>
      <div className="content-block">
        <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>The Lifetime Paradox</h3>
        <p style={{ fontSize: '0.85rem' }}>
          The <code>&V</code> we return is a reference <b>protected by the lock state</b> held by the Guard.
        </p>
        <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
          If we return that reference after dropping the <code>Guard</code>, we are essentially accessing data that is no longer protected by the lock.
        </p>
        <p className="error-text" style={{ fontSize: '0.85rem', marginTop: '0.3rem', fontStyle: 'italic' }}>
          Wait! Another thread could now get a Write Lock and mutate the map while we are still holding that "dangling" reference!
        </p>
      </div>
    </Page>
  );
});

export const OwnershipShift = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">Ownership to the Rescue</h2>
      <div className="content-block">
        To solve the lifetime paradox, we must return an <b>owned value</b>. This means we must **Clone** the data out of the cache before the guard is dropped.
      </div>
      <div className="code-snippet">
        <CodeBlock code={`impl<K, V> Cache<K, V> 
where K: Hash + Eq, V: Clone 
{
    fn get(&self, key: &K) -> Option<V> {
        let guard = self.data.read().unwrap();
        // Clone the value out BEFORE the guard is dropped
        guard.get(key).cloned() 
    }
}`} style={{ fontSize: '0.75rem' }} />
      </div>
      <div className="content-block">
        We've traded performance (cloning) for absolute memory safety and thread-safe access.
      </div>
    </Page>
  );
});

export const SafeCacheImpl = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">Final Implementation</h2>
      <div className="content-block">
        Breaking the implementation into explicit steps shows exactly how the data moves:
      </div>
      <div className="code-snippet">
        <CodeBlock code={`fn get(&self, key: &K) -> Option<V> {
    // 1. Acquire the guard
    let guard = self.data.read().unwrap();
    
    // 2. Lookup the reference
    let reference_to_val: Option<&V> = guard.get(key);
    
    // 3. Clone the reference to an owned V
    let owned_val: Option<V> = reference_to_val.cloned();
    
    // 4. Return the owned V (guard drops here)
    owned_val
}`} style={{ fontSize: '0.75rem' }} />
      </div>
    </Page>
  );
});

export const ThreadSafeTests = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">Thread-Safe Verification</h2>
      <div className="content-block">
        For now, let's verify it still works in a single thread with our new cloning API:
      </div>
      <div className="code-snippet">
        <CodeBlock code={`#[test]
fn test_thread_safe_api() {
    let cache = Cache::new();
    cache.put(1, "ThreadSafe".to_string());
    
    // This now returns an OWNED String
    let val: Option<String> = cache.get(&1);
    
    assert_eq!(val, Some("ThreadSafe".to_string()));
}`} style={{ fontSize: '0.8rem' }} />
      </div>
      <div className="content-block" style={{ marginTop: '1rem', color: 'var(--success-color)' }}>
        We are now ready for the real challenge: **Multi-threaded Access!**
      </div>
    </Page>
  );
});
