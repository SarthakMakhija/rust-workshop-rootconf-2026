import React, { forwardRef } from 'react';
import Page from '../../Page';
import CodeBlock from '../../CodeBlock';

export const Section4Cover = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <div className="page cover-page" data-density="hard" ref={ref}>
      <div className="page-content">
        <div className="cover-subtitle">RootConf 2026</div>
        <div className="cover-decoration" />
        <h1 className="cover-title">STAGE 4</h1>
        <div className="cover-decoration" />
        <div className="cover-subtitle">Mutable References & Scope</div>
        <div className="cover-subtitle" style={{ marginTop: '2rem', fontStyle: 'italic' }}>
          Aliasing XOR Mutation
        </div>
      </div>
      <div className="page-number">{props.number}</div>
    </div>
  );
});

export const Stage4Roadmap = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">Stage 4 Roadmap</h2>
      <div className="content-block">
        <ul style={{ paddingLeft: '1.5rem', lineHeight: '2.0' }}>
          <li><strong>Introduce get_mut</strong>: Mutating cached data.</li>
          <li><strong>Mutable Reference Scope</strong>: Rust's exact timeline for borrows.</li>
          <li><strong>Multiple get_mut calls</strong>: Breaking the compiler.</li>
          <li><strong>The Two Paths</strong>: Exploring type-safe APIs vs. Interior Mutability.</li>
        </ul>
      </div>
    </Page>
  );
});

export const IntroduceGetMut = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">Introducing get_mut</h2>
      <div className="content-block" style={{ fontSize: '0.85rem' }}>
        What if we want to modify a value <em>after</em> it has been cached? We can expose a mutable reference!
      </div>
      <div className="code-snippet">
        <CodeBlock code={`struct Cache<K, V> where K: Eq + Hash {
    data: HashMap<K, V>,
}

impl<K, V> Cache<K, V> where K: Eq + Hash {
    fn new() -> Self {
        Self { data: HashMap::new() }
    }

    fn put(&mut self, k: K, v: V) {
        self.data.insert(k, v);
    }

    // 🔑 Returns a mutable reference
    fn get_mut<Q: ?Sized>(&mut self, k: &Q) -> Option<&mut V>
    where
        Q: Hash + Eq,
        K: Borrow<Q>,
    {
        self.data.get_mut(k)
    }
}`} style={{ fontSize: '0.8rem' }} />
      </div>
    </Page>
  );
});

export const MutableScopeProblem = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">The Multiple get_mut Problem</h2>
      <div className="content-block" style={{ fontSize: '0.85rem' }}>
        In languages like Java or C#, you often hold multiple references to the same object and modify them freely. Let's try that in Rust:
      </div>
      <div className="code-snippet">
        <CodeBlock code={`fn main() {
    let mut cache = Cache::new();
    cache.put(String::from("hello"), String::from("world"));

    // 🚩 Get FIRST mutable reference
    let v1 = cache.get_mut("hello").unwrap();
    
    // 🚩 Get SECOND mutable reference
    let v2 = cache.get_mut("hello").unwrap();

    // Try to use BOTH
    println!("{:?}", v1);
    println!("{:?}", v2);
}`} style={{ fontSize: '0.8rem' }} />
      </div>
    </Page>
  );
});

export const AliasMutationError = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">Compiler Refusal (E0499)</h2>
      <div className="content-block" style={{ fontSize: '0.8rem' }}>
        Rust strictly enforces <strong>Aliasing XOR Mutation</strong>. You can have many readers OR one writer. Not both. Not multiple writers.
      </div>
      <div className="code-snippet">
        <CodeBlock code={`error[E0499]: cannot borrow \`cache\` as mutable more than once at a time
  --> src/main.rs:34:14
   |
33 |     let v1 = cache.get_mut("hello").unwrap();
   |              ------ first mutable borrow occurs here
34 |     let v2 = cache.get_mut("hello").unwrap();
   |              ^^^^^^ second mutable borrow occurs here
35 |
36 |     println!("{:?}", v1);
   |                      -- first borrow later used here`} className="error-text" style={{ fontSize: '0.75rem' }} />
      </div>
      <div className="explanation-box" style={{ marginTop: '1rem', fontSize: '0.8rem' }}>
        Because <code>v1</code> scope lives down to line 36, trying to borrow mutably again at line 34 crashes the compilation.
      </div>
    </Page>
  );
});

export const TheUpdateMethod = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">The Update Pattern</h2>
      <div className="content-block" style={{ fontSize: '0.85rem' }}>
        Instead of handing out mutable references directly, we can accept a closure (a lambda function) that safely performs the update within the cache's boundary.
      </div>
      <div className="explanation-box" style={{ marginTop: '1rem' }}>
        <h3 style={{ fontSize: '1rem', color: 'var(--accent-color)' }}>Why Closures?</h3>
        A closure <code>|v| ...</code> allows us to inject custom logic into the <code>Cache</code>. The cache extracts the mutable reference internally, yields it to our lambda exactly once, and finishes. We never leak multiple references to the client!
      </div>
    </Page>
  );
});

export const UpdateImplCode = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">Implementing update</h2>
      <div className="content-block">
        Here's how we build the type-safe lambda API using <code>FnOnce</code> bounds.
      </div>
      <div className="code-snippet">
        <CodeBlock code={`impl<K, V> Cache<K, V> where K: Eq + Hash {
    // 🔑 F takes a mutable reference to V
    pub fn update<Q, F>(&mut self, k: &Q, f: F) 
    where
        Q: ?Sized + Hash + Eq,
        K: Borrow<Q>,
        F: FnOnce(&mut V),
    {
        if let Some(v) = self.data.get_mut(k) {
            // Apply the closure to the value
            f(v);
        }
    }
}`} style={{ fontSize: '0.75rem' }} />
      </div>
      <div className="content-block" style={{ fontStyle: 'italic', fontSize: '0.8rem' }}>
        Because <code>update</code> demands <code>&mut self</code>, the client must still prove exclusive access, avoiding the aliasing conflict implicitly.
      </div>
    </Page>
  );
});

export const UpdateTests = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">Testing the Lambda</h2>
      <div className="content-block">
        The client code is now elegant and immune to sprawling multiple borrows.
      </div>
      <div className="code-snippet">
        <CodeBlock code={`#[test]
fn test_cache_update() {
    let mut cache = Cache::new();
    cache.put(1, String::from("Hello"));
    
    // 🔥 Inline update safely!
    cache.update(&1, |val| *val = String::from("Rustacean"));
    
    assert_eq!(
        cache.get(&1), 
        Some(&String::from("Rustacean"))
    );
}`} style={{ fontSize: '0.8rem' }} />
      </div>
    </Page>
  );
});

export const MultipleUpdatesScope = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">Constraining the Scope</h2>
      <div className="content-block" style={{ fontSize: '0.85rem' }}>
        Why does this solve our E0499 multiple borrow error? Look what happens when we do it twice:
      </div>
      <div className="code-snippet">
        <CodeBlock code={`fn main() {
    let mut cache = Cache::new();
    cache.put(1, String::from("hello"));

    // 1st mutable borrow begins AND ENDS here
    cache.update(&1, |val| *val = String::from("mars"));
    
    // 2nd mutable borrow can safely occur!
    cache.update(&1, |val| *val = String::from("jupiter"));
}`} style={{ fontSize: '0.75rem' }} />
      </div>
      <div className="content-block" style={{ fontSize: '0.85rem', marginTop: '1rem' }}>
        The mutable reference <code>&mut V</code> is yielded <strong>exclusively inside the lambda block</strong>. The moment the lambda finishes executing, the reference is dropped. By <em>constraining the scope</em> automatically, we prevent the lifetimes from stretching and overlapping!
      </div>
    </Page>
  );
});

export const ClosureTraits = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">The Closure Traits</h2>
      <div className="content-block" style={{ fontSize: '0.85rem' }}>
        We used <code>F: FnOnce(&mut V)</code> bounds. Rust has three built-in traits for closures based on how they interact with their captured environment:
      </div>
      <div className="explanation-box" style={{ marginTop: '0.5rem', background: 'rgba(56, 189, 248, 0.05)' }}>
        <ul style={{ paddingLeft: '1rem', lineHeight: '1.6', fontSize: '0.75rem' }}>
          <li>
            <strong style={{ color: 'var(--accent-color)' }}>FnOnce</strong>: Consumes the variables it captures. Can only be called <em>once</em>. This is what we used, as we only update the cache entry exactly one time.
          </li>
          <li style={{ marginTop: '0.5rem' }}>
            <strong style={{ color: '#f59e0b' }}>FnMut</strong>: Modifies the captured environment (requires <code>&mut</code> to captures). Can be called multiple times sequentially.
          </li>
          <li style={{ marginTop: '0.5rem' }}>
            <strong style={{ color: '#10b981' }}>Fn</strong>: Only borrows captures immutably (requires <code>&</code>). Can be called multiple times, even concurrently!
          </li>
        </ul>
      </div>
    </Page>
  );
});

export const InteriorMutabilityPath = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">Option 2: Interior Mutability</h2>
      <div className="content-block" style={{ fontSize: '0.85rem' }}>
        What if we don't want <code>update</code> or <code>put</code> to strictly demand <code>&mut self</code>? What if we want to mutate data through a shared reference (<code>&self</code>)?
      </div>
      <div className="explanation-box" style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', marginTop: '1rem' }}>
        <h3 style={{ fontSize: '1rem', color: '#10b981' }}>The Cache Entry Pattern</h3>
        We can bypass compile-time mutability rules by transitioning to <strong>Runtime Borrow Checking</strong>. We will design a dedicated <code>Entry</code> struct leveraging <code>RefCell</code>.
      </div>
    </Page>
  );
});
