import React, { forwardRef } from 'react';
import Page from '../../Page';
import CodeBlock from '../../CodeBlock';

export const Section8Cover = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <div className="page cover-page" data-density="hard" ref={ref}>
      <div className="page-content">
        <div className="cover-subtitle">Rust India Conference 2026</div>
        <div className="cover-decoration" />
        <h1 className="cover-title">STAGE 8</h1>
        <div className="cover-decoration" />
        <div className="cover-subtitle">Beyond Cloning</div>
        <div className="cover-subtitle" style={{ marginTop: '2rem', fontStyle: 'italic' }}>
          Realizing the Zero-Allocation Goal.
        </div>
      </div>
      <div className="page-number">{props.number}</div>
    </div>
  );
});

export const Stage8Roadmap = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">Stage 8 Roadmap</h2>
      <div className="content-block">
        <ul style={{ paddingLeft: '1.5rem', lineHeight: '2.2' }}>
          <li><strong>The Cloning Tax</strong>: Why Arc isn't always the finish line.</li>
          <li><strong>Custom Ref Pattern</strong>: Bundling guards and pointers.</li>
          <li><strong>Lifetime Hierarchy</strong>: Understanding dependency chains.</li>
          <li><strong>The Pointer Trick</strong>: Mastering <code>*const V</code>.</li>
          <li><strong>Unsafe Deref</strong>: Bridging the gap with the <code>Deref</code> trait.</li>
          <li><strong>Verification</strong>: Proving Zero-Allocation access.</li>
        </ul>
      </div>
    </Page>
  );
});

export const Section8Intro = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">The Cloning Tax</h2>
      <div className="content-block">
        In the previous stage, we used <span className="keyword">Arc</span> to share ownership. While this was safe and relatively efficient, it still required:
        <ul style={{ marginTop: '1rem', paddingLeft: '1.2rem' }}>
          <li><strong>Atomic Increments</strong> on every access.</li>
          <li><strong>Cloning</strong> of handles.</li>
          <li><strong>Indirection</strong> through an additional pointer.</li>
        </ul>
      </div>
      <div className="content-block">
        For high-performance systems, we want <strong>Zero Allocation</strong>. We want to return a reference directly to the data sitting in the HashMap, without cloning anything.
      </div>
      <div className="explanation-box" style={{ background: 'var(--accent-light)' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '0.4rem' }}>The Goal</h3>
        Provide thread-safe, read-only access to internal data with 0% memory overhead, even under heavy concurrency.
      </div>
    </Page>
  );
});

export const CustomRefPattern = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">The Custom Ref Pattern</h2>
      <div className="content-block">
        To return a reference from a guarded structure, we must return the <strong>Guard</strong> itself. But a guard returns the whole HashMap, not a specific value.
      </div>
      <div className="code-snippet">
        <CodeBlock code={`struct Ref<'a, K, V>
where K: Eq + Hash,
{
    // The "Anchor": Keeps the lock alive
    guard: RwLockReadGuard<'a, HashMap<K, V>>,
    
    // The "Target": Points into the guarded data
    value: *const V,
}`} />
      </div>
      <div className="content-block">
        <h3 style={{ fontSize: '1rem', color: 'var(--accent-color)' }}>The Lifetime Hierarchy</h3>
        The lifetime <code className="keyword">'a</code> establishes a rigorous hierarchy:
        <ul style={{ marginTop: '0.5rem', paddingLeft: '1rem', fontSize: '0.9rem' }}>
          <li><strong>Ref</strong> cannot live longer than the <strong>Guard</strong>.</li>
          <li><strong>Guard</strong> cannot live longer than the <strong>Lock</strong> (Cache).</li>
        </ul>
      </div>
    </Page>
  );
});

export const LifetimeAnchor = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">The Lifetime Hierarchy</h2>
      <div className="content-block">
        Why can't <strong>Ref</strong> have the longest lifetime? Let's trace the dependencies:
      </div>
      
      {/* Vertical Lifetime Diagram */}
      <div className="explanation-box" style={{ 
        marginTop: '1.5rem', 
        padding: '2rem', 
        background: 'var(--bg-card)', 
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative'
      }}>
        <div style={{ width: '100%', position: 'relative', height: '40px', background: 'rgba(56, 189, 248, 0.1)', border: '1px dashed #38bdf8', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#0ea5e9' }}>Cache/Lock: The Source</span>
        </div>
        
        <div style={{ height: '15px', width: '2px', background: 'var(--border-color)' }} />
        
        <div style={{ width: '85%', position: 'relative', height: '40px', background: 'rgba(237, 137, 54, 0.1)', border: '1px solid #ed8936', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#ea580c' }}>Guard: 'G (Intermediate)</span>
        </div>
        
        <div style={{ height: '15px', width: '2px', background: 'var(--border-color)' }} />
        
        <div style={{ width: '70%', position: 'relative', height: '40px', background: 'var(--accent-light)', border: '1px solid var(--accent-color)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent-color)' }}>Ref: 'R (Target Access)</span>
        </div>

        <div style={{ marginTop: '1.5rem', textAlign: 'left', fontSize: '0.8rem', width: '100%' }}>
          <strong>The Reasoning:</strong>
          <ul style={{ paddingLeft: '1.2rem', marginTop: '0.5rem' }}>
            <li>If <code>'R</code> was longer than <code>'G</code>, you'd access data <i>after</i> the lock released.</li>
            <li>Since <code>Ref</code> owns the <code>Guard</code>, the compiler picks a lifetime that satisfies both: <code>'R &lt;= 'G</code>.</li>
            <li>This hierarchy is the <strong>only way</strong> to prevent a dangling pointer.</li>
          </ul>
        </div>
      </div>

      <div className="content-block" style={{ marginTop: '1.5rem', fontSize: '0.9rem' }}>
        <strong>Compiler Deduction</strong>: The compiler observes the dependency graph and "picks" the lifetimes that match the diagram because any other choice would allow a safety violation.
      </div>
    </Page>
  );
});

export const ThePointerTrick = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">The Pointer Trick & *const V</h2>
      <div className="content-block">
        Inside <span className="keyword">get</span>, we obtain a temporary reference. We must "capture" its address before it is returned:
      </div>
      <div className="code-snippet">
        <CodeBlock code={`let value = guard.get(key)?;
let ptr = value as *const V; 

// Return bundled struct
Some(Ref { guard, value: ptr })`} />
      </div>
      <div className="content-block" style={{ fontSize: '0.9rem' }}>
        <h3 style={{ fontSize: '1rem', color: 'var(--accent-color)' }}>What is the '?' operator?</h3>
        This is the **Question Mark Operator**. It performs an **Early Return** if the lookup fails.
        <ul style={{ marginTop: '0.5rem', paddingLeft: '1rem' }}>
          <li>If <code>guard.get()</code> returns <code>Some(V)</code>, the value is "unwrapped" into the <code>value</code> variable.</li>
          <li>If it returns <code>None</code>, the entire function <b>returns None immediately</b>.</li>
          <li>It replaces bulky <code>match</code> or <code>if let</code> blocks, keeping the logic flat and clean.</li>
        </ul>
      </div>
      <div className="content-block" style={{ fontSize: '0.9rem' }}>
        <h3 style={{ fontSize: '1rem', color: 'var(--accent-color)' }}>What is *const V?</h3>
        This is a **Constant Raw Pointer**. It is a memory address that we manually manage. 
        <ul style={{ marginTop: '0.5rem', paddingLeft: '1rem' }}>
          <li><strong>Type Erasure</strong>: Unlike <code>&V</code>, it has <strong>no lifetime tracking</strong>. It is "just a number" representing a memory address.</li>
          <li><strong>Why use it?</strong> Rust's borrow checker doesn't allow a struct to contain both a <code>Guard</code> and a <code>&Reference</code> to data inside that same guard (a Self-Referential Struct).</li>
          <li><strong>The Trick</strong>: By converting the reference to a raw pointer, we "hide" the dependency from the compiler, allowing us to bundle them together.</li>
        </ul>
      </div>
      <div className="content-block" style={{ fontStyle: 'italic', fontSize: '0.85rem', borderLeft: '2px solid #ccc', paddingLeft: '1rem' }}>
        "We use raw pointers to bypass the compiler's strictness, but we use the <b>struct's lifetime 'a</b> to ensure the pointer remains valid for the caller."
      </div>
    </Page>
  );
});

export const UnsafeDeref = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">What is Unsafe?</h2>
      <div className="content-block">
        When we implement <span className="keyword">Deref</span>, we use an <span className="keyword">unsafe</span> block. Let's be precise about what this means.
      </div>
      <div className="code-snippet">
        <CodeBlock code={`impl<'a, K, V> Deref for Ref<'a, K, V> {
    type Target = V;

    fn deref(&self) -> &Self::Target {
        // UNSAFE: We are dereferencing a raw pointer
        unsafe { &*self.value }
    }
}`} />
      </div>
      <div className="content-block" style={{ fontSize: '0.9rem' }}>
        <strong>The Risk:</strong> A raw pointer is just a memory address. The compiler **cannot verify** if that address still points to valid data. It's like navigating with a map that might be out of date.
        <br /><br />
        <strong>Our Promise:</strong> We make the block "safe" because the `guard` is stored alongside the pointer. This "pins" the data in place, preventing the map from becoming out of date.
      </div>
    </Page>
  );
});

export const LockTradeoff = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">The Concurrency Tax</h2>
      <div className="content-block">
        Every optimization has a cost. By using the <span className="keyword">Ref</span> pattern, we've traded memory for time:
      </div>
      <div className="explanation-box" style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
        <h3 style={{ color: '#dc2626', fontSize: '1rem' }}>Trade-off: Extended Locking</h3>
        In Stage 7, the lock was released <strong>immediately</strong> after the Arc was cloned.
        <br /><br />
        In Stage 8, the lock is held <strong>indefinitely</strong> until the caller drops the <code>Ref</code>.
      </div>
      <div className="content-block" style={{ fontSize: '0.9rem' }}>
        If a user holds a `Ref` and then performs a long-running operation, <strong>all writers are blocked</strong>. This pattern is best for high-frequency, short-lived reads.
      </div>
    </Page>
  );
});

export const ZeroCopyTests = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">Verification</h2>
      <div className="content-block">
        We can verify that multiple threads can hold references simultaneously without allocations:
      </div>
      <div className="code-snippet">
        <CodeBlock code={`#[test]
fn test_zero_copy_access() {
    let cache = Cache::new();
    cache.put("key".to_string(), "val".to_string());

    let r1 = cache.get("key").unwrap();
    let r2 = cache.get("key").unwrap();

    // Both point to same physical memory
    assert_eq!(*r1, "val");
    assert_eq!(*r2, "val");
    
    // Lock is held!
    assert!(cache.data.try_write().is_err());
}`} style={{ fontSize: '0.8rem' }} />
      </div>
    </Page>
  );
});

export const Section8Summary = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">Stage 8 Summary</h2>
      <div className="content-block">
        We have achieved the ultimate memory-efficient cache:
        <ul style={{ marginTop: '1rem', paddingLeft: '1.2rem', lineHeight: '1.8' }}>
          <li>✅ <strong>Zero Clones</strong>: Data is never copied.</li>
          <li>✅ <strong>Zero Arcs</strong>: No atomic reference counting.</li>
          <li>✅ <strong>Zero Allocation</strong> on read paths.</li>
        </ul>
      </div>
      <div className="content-block">
        This pattern is used in high-performance crates like <code>dashmap</code>. You now understand how to safely bridge the gap between guarded data and external references.
      </div>
    </Page>
  );
});
