import React, { forwardRef } from 'react';
import Page from '../../Page';
import CodeBlock from '../../CodeBlock';

export const Section13Cover = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <div className="page cover-page" data-density="hard" ref={ref}>
      <div className="page-content">
        <div className="cover-subtitle">RootConf 2026</div>
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
          <li><strong>Zero-Cost Safety</strong>: Compile-time proofs of correctness.</li>
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
      <div className="explanation-box" style={{ background: 'var(--accent-light)' }}>
        The goal is to move the "Is this shutdown?" check from <strong>runtime</strong> (expensive) to <strong>compile-time</strong> (free).
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

export const Section13Summary = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">Zero-Cost Safety Recap</h2>
      <div className="content-block">
        The Type-State pattern is one of Rust's most powerful architectural tools:
      </div>
      <div className="content-block">
        <ul style={{ paddingLeft: '1.2rem', lineHeight: '2' }}>
          <li>🚀 <strong>Zero Runtime Cost</strong>: States are erased after compilation.</li>
          <li>🛡️ <strong>Infinite Safety</strong>: Formal proof that certain methods can't be called out of order.</li>
          <li>📖 <strong>Self-Documenting</strong>: The API tells you exactly how it can be used.</li>
        </ul>
      </div>
      <div className="content-block" style={{ marginTop: '2rem' }}>
        You now have the tools to build <strong>Sound Foundations</strong> in Rust.
      </div>
    </Page>
  );
});
