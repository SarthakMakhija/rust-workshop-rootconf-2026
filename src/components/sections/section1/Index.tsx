import React, { forwardRef } from 'react';
import Page from '../../Page';
import CodeBlock from '../../CodeBlock';

export const WorkshopCover = forwardRef<HTMLDivElement, {}>((props, ref) => {
  return (
    <div className="page cover-page" data-density="hard" ref={ref}>
      <div className="page-content">
        <div className="cover-subtitle">Rust India Conference 2026</div>
        <div className="cover-decoration" />
        <h1 className="cover-title">RUST WORKSHOP</h1>
        <div className="cover-subtitle" style={{ marginTop: '1rem', color: 'var(--accent-color)', letterSpacing: '2px', fontWeight: 'bold' }}>
          Build a concurrent <br /> cache in Rust
        </div>
        <div className="cover-decoration" />
        <div className="cover-subtitle" style={{ marginTop: '2rem', fontStyle: 'italic' }}>
          From Allocation to Zero-Cost Abstractions.
        </div>
        <div style={{ position: 'absolute', bottom: '0rem', right: '1rem', textAlign: 'right' }}>
          <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '3px', opacity: 0.5, marginBottom: '0.3rem' }}>
            by
          </div>
          <div style={{ fontSize: '1.1rem', letterSpacing: '2px', fontWeight: '500', opacity: 0.9 }}>
            Sarthak Makhija
          </div>
        </div>
      </div>
    </div>
  );
});

export const Stage1Cover = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <div className="page cover-page" data-density="hard" ref={ref}>
      <div className="page-content">
        <div className="cover-subtitle">Workshop Track</div>
        <div className="cover-decoration" />
        <h1 className="cover-title">STAGE 1</h1>
        <div className="cover-decoration" />
        <div className="cover-subtitle">In-Memory Caching</div>
        <div className="cover-subtitle" style={{ marginTop: '2rem', fontStyle: 'italic' }}>
          Building the foundation of memory safety.
        </div>
      </div>
      <div className="page-number">{props.number}</div>
    </div>
  );
});

export const Intro = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">Getting Started</h2>
      <div className="content-block">
        Welcome to the Rust India Conference 2026, Build a concurrent cache in Rust workshop. Today, we delve into the core of Rust's efficiency and safety by building an in-memory cache.
      </div>
      <div className="content-block">
        Over the next few modules, we'll journey from a simple implementation to a highly optimized cache that leverages Rust's unique memory model.
      </div>
    </Page>
  );
});

export const Stage1Roadmap = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">Stage 1 Roadmap</h2>
      <div className="content-block">
        <ul style={{ paddingLeft: '1.5rem', lineHeight: '2.2' }}>
          <li><strong>Basic Cache implementation</strong>: Our starting point.</li>
          <li><strong>Get & Put Operations</strong>: Defining the API.</li>
          <li><strong>References</strong>: Shared (&T) vs Mutable (&mut T).</li>
          <li><strong>Struct Types</strong>: Physical layout.</li>
          <li><strong>Method Receivers</strong>: <code>&self</code> vs <code>&mut self</code>.</li>
          <li><strong>String</strong>: Direct look at memory architecture.</li>
          <li><strong>Ownership</strong>: Automatic cleanup and constraints.</li>
          <li><strong>Ownership Hierarchy</strong>: Nested owners.</li>
          <li><strong>The Allocation Problem</strong>: Finding our first bottleneck.</li>
          <li><strong>String vs &str vs str</strong>: Mastering Rust text.</li>
          <li><strong>Optimized Cache</strong>: Reaching Zero-Allocation.</li>
        </ul>
      </div>
    </Page>
  );
});

export const BasicCache = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">Basic Cache</h2>
      <div className="content-block">
        Our journey begins with a simple <span className="keyword">key-value cache</span>. In Rust, we need to be explicit about ownership.
      </div>
      <div className="content-block">
        For our first iteration, we will use <span className="keyword">String</span> for both keys and values.
      </div>
      <div className="code-snippet">
        <CodeBlock code={`use std::collections::HashMap;

struct Cache {
    data: HashMap<String, String>,
}`} />
      </div>
      <div className="content-block">
        This approach is straightforward but involves heap allocations for every operation.
      </div>
    </Page>
  );
});

export const Operations = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">Get & Put Operations</h2>
      <div className="content-block">
        To interact with our cache, we need two fundamental operations. Let's look at the signatures carefully:
      </div>
      <div className="code-snippet">
        <CodeBlock code={`impl Cache {
    fn new() -> Self {
        Cache { data: HashMap::new() }
    }

    fn put(&mut self, key: String, value: String) {
        self.data.insert(key, value);
    }

    fn get(&self, key: &String) -> Option<&String> {
        self.data.get(key)
    }
}`} style={{ fontSize: '0.8rem' }} />
      </div>
      <div className="content-block">
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>The 'get' Signature Deep Dive:</h3>
        <ul style={{ paddingLeft: '1.2rem', fontSize: '0.9rem' }}>
          <li><strong>Input (&String)</strong>: We take a reference to a String. We don't want to "own" the search key; we just want to look at it.</li>
          <li><strong>Output (Option{"<"}&String{">"})</strong>:
            <ul style={{ paddingLeft: '1rem', marginTop: '0.5rem' }}>
              <li>Why <code>Option</code>? The key might NOT exist in the map.</li>
              <li>Why <code>&String</code>? We are returning a <b>pointer</b> to the data already stored inside the HashMap. We don't want to copy the data!</li>
            </ul>
          </li>
        </ul>
      </div>
    </Page>
  );
});

export const References = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">What is a Reference?</h2>
      <div className="content-block">
        In Rust, a <span className="keyword">Reference</span> is a safe pointer. It allows you to "borrow" a value without taking ownership.
      </div>

      <div className="content-block">
        <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>1. Shared Reference (&T)</h3>
        Read-only access. You can have <b>infinitely many</b> shared references to the same data at once.
      </div>

      <div className="content-block">
        <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>2. Mutable Reference (&mut T)</h3>
        Read-Write access. You can have <b>exactly one</b> mutable reference, and no other references (shared or mutable) can exist at the same time.
      </div>

      <div className="code-snippet">
        <CodeBlock code={`let x = 5;
let r1 = &x;     // r1 is a Shared Reference
let r2 = &x;     // Another shared reference (OK)

let mut y = 10;
let r3 = &mut y; // r3 is a Mutable Reference`} />
      </div>

      <div className="content-block" style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
        <p style={{ fontSize: '0.9rem' }}>
          <strong>Physical Reality:</strong> On a 64-bit system, both <code>r1</code> and <code>r3</code> are <b>8 bytes</b> in size.
          They are just memory addresses (pointers) but with rigorous compile-time checks.
        </p>
      </div>

      <div className="audience-question" style={{ marginTop: '1rem' }}>
        <strong>Why?</strong>
        <p style={{ fontSize: '0.8rem' }}>Explicit pointers prevent "Aliasing + Mutation," the root cause of most memory bugs.</p>
      </div>
    </Page>
  );
});

export const StructTypes = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">Classic, Tuple, & Unit Structs</h2>
      <div className="content-block">
        Rust provides three ways to define physical structure:
      </div>
      <div className="content-block">
        <h3 style={{ fontSize: '1rem', marginBottom: '0.4rem' }}>1. Classic Structs</h3>
        Named fields for clarity. This is what we used for our <code>Cache</code>.
        <pre className="code-inline" style={{ marginTop: '0.2rem' }}>
          {`struct User { name: String, age: u8 }`}
        </pre>
      </div>
      <div className="content-block">
        <h3 style={{ fontSize: '1rem', marginBottom: '0.4rem' }}>2. Tuple Structs</h3>
        Unnamed fields, accessed by index. Useful for simple wrappers (NewTypes).
        <pre className="code-inline" style={{ marginTop: '0.2rem' }}>
          {`struct Color(i32, i32, i32);
let white = Color(255, 255, 255);`}
        </pre>
      </div>
      <div className="content-block">
        <h3 style={{ fontSize: '1rem', marginBottom: '0.4rem' }}>3. Unit Structs</h3>
        Zero-sized types. Used as markers or for trait implementations.
        <pre className="code-inline" style={{ marginTop: '0.2rem' }}>
          {`struct AlwaysTrue;`}
        </pre>
      </div>
    </Page>
  );
});

export const MethodReceivers = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">Method Receivers</h2>
      <div className="content-block">
        In Rust, methods use special <span className="keyword">self</span> parameters to define access:
      </div>
      <div className="content-block">
        <h3 style={{ marginBottom: '0.5rem' }}>&self (Immutable Borrow)</h3>
        <p style={{ marginBottom: '0.6rem' }}>
          This is an <b>explicit borrow</b>. Physically, it is a pointer (8 bytes) to the instance stored elsewhere.
        </p>
        <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: '0.8rem', borderRadius: '4px', fontSize: '0.85rem', borderLeft: '3px solid var(--accent-color)' }}>
          <strong>Contrast with Java:</strong> In Java, "everything is a reference" and references are passed by copy (the handle is copied).
          In Rust, <code>&self</code> makes it explicit: the method does <b>not own</b> the data; it is merely looking at it through a temporary pointer provided by the owner.
        </div>
      </div>
      <div className="content-block">
        <h3 style={{ marginBottom: '0.5rem' }}>&mut self (Mutable Borrow)</h3>
        Used for writing/modifying data. Ensures <span className="keyword">exclusive access</span>, no one else can read or write while this is happening.
      </div>
      <div className="content-block" style={{ fontStyle: 'italic', borderLeft: '2px solid #ccc', paddingLeft: '1rem' }}>
        "Rust enforces safety by ensuring you never have data races: either many readers OR one writer."
      </div>
    </Page>
  );
});

export const StringLayout = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">String Memory Layout</h2>
      <div className="content-block">
        Before we optimize, we must understand how a <span className="keyword">String</span> actually lives in memory. It is a "Handle" pointing to a "Buffer".
      </div>

      <div className="memory-viz">
        <div className="viz-row">
          <div className="viz-label">Stack</div>
          <div className="viz-handle">
            <div className="viz-cell">
              <span className="cell-type">ptr</span>
              <span className="cell-val ptr-value">0x1234...</span>
            </div>
            <div className="viz-cell">
              <span className="cell-type">cap</span>
              <span className="cell-val">4</span>
            </div>
            <div className="viz-cell">
              <span className="cell-type">len</span>
              <span className="cell-val">4</span>
            </div>
          </div>
        </div>

        <div className="viz-arrow">↴</div>

        <div className="viz-row">
          <div className="viz-label">Heap</div>
          <div className="viz-buffer">
            <div className="buffer-cell">R</div>
            <div className="buffer-cell">U</div>
            <div className="buffer-cell">S</div>
            <div className="buffer-cell">T</div>
          </div>
        </div>

        <div className="viz-note">
          The Handle (Stack) is fixed-size (24 bytes). The Buffer (Heap) can grow or shrink dynamically.
        </div>
      </div>
    </Page>
  );
});

export const OwnershipDetails = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">Ownership & Structs</h2>
      <div className="content-block">
        When a struct contains a <span className="keyword">String</span>, we say the struct <span className="keyword">owns</span> that string. This has deep implications:
      </div>
      <div className="content-block">
        <h3 style={{ marginBottom: '0.5rem' }}>1. Automatic Cleanup (Drop)</h3>
        When the struct instance goes out of scope, Rust automatically cleans up the heap memory used by the String. This is triggered by the <span className="keyword">Drop</span> trait.
      </div>
      <div className="content-block">
        <h3 style={{ marginBottom: '0.5rem' }}>2. Borrowing Constraints</h3>
        A method using <span className="keyword">&self</span> cannot return an owned <span className="keyword">String</span> from within itself unless the method explicitly clones it.
      </div>
      <div className="content-block">
        <h3 style={{ marginBottom: '0.5rem' }}>3. Value Return</h3>
        However, a method that takes <span className="keyword">self</span> (not &self) can return the owned String because it consumes the struct itself!
      </div>
    </Page>
  );
});

export const OwnershipHierarchy = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">The Ownership Hierarchy</h2>
      <div className="content-block" style={{ fontSize: '0.9rem' }}>
        Ownership forms a tree. When you store a <code>String</code> inside a struct, and that struct inside a <code>Vec</code>, you are building a recursive chain of handles. In this example, <code>my_company</code> contains <b>2 employees</b>.
      </div>

      <div className="code-snippet">
        <CodeBlock code={`struct Company { employees: Vec<Employee> }
struct Employee { name: String }

let my_company = Company::new();`} style={{ fontSize: '0.8rem' }} />
      </div>

      {/* Complex Memory Diagram */}
      <div className="memory-viz-container" style={{ 
        marginTop: '1rem', 
        padding: '1.5rem', 
        background: 'var(--bg-card)', 
        borderRadius: '12px',
        fontSize: '0.75rem',
        fontFamily: "'JetBrains Mono', monospace"
      }}>
        
        {/* Stack Level */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ color: 'var(--accent-color)', fontWeight: 'bold', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Stack</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ border: '2px solid var(--accent-color)', borderRadius: '6px', overflow: 'hidden', background: 'white' }}>
              <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '4px 10px', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>my_company (Vec Handle)</div>
              <div style={{ display: 'flex' }}>
                <div style={{ padding: '6px 10px', borderRight: '1px solid #eee' }}><div style={{ opacity: 0.5, fontSize: '0.6rem' }}>ptr</div>0x88...10</div>
                <div style={{ padding: '6px 10px', borderRight: '1px solid #eee' }}><div style={{ opacity: 0.5, fontSize: '0.6rem' }}>cap</div>2</div>
                <div style={{ padding: '6px 10px' }}><div style={{ opacity: 0.5, fontSize: '0.6rem' }}>len</div>2</div>
              </div>
            </div>
            <div style={{ color: 'var(--accent-color)', fontSize: '1.5rem' }}>❯❯ owning ❯❯</div>
          </div>
        </div>

        {/* Heap Level 1 - The Vec Buffer */}
        <div style={{ marginBottom: '2rem', paddingLeft: '2rem' }}>
          <div style={{ color: 'var(--accent-color)', fontWeight: 'bold', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Heap (Level 1: The Vec Buffer)</div>
          <div style={{ display: 'flex', gap: '0px', border: '1px dashed #ccc', padding: '10px', width: 'fit-content', borderRadius: '8px' }}>
            
            {/* Employee 1 */}
            <div style={{ border: '2px solid #475569', borderRadius: '4px', overflow: 'hidden', background: 'white', position: 'relative' }}>
              <div style={{ background: '#f1f5f9', padding: '4px 8px', borderBottom: '1px solid #eee', fontWeight: 'bold', textAlign: 'center' }}>Employee [0]</div>
              <div style={{ padding: '8px' }}>
                <div style={{ border: '1px solid #94a3b8', borderRadius: '3px' }}>
                   <div style={{ fontSize: '0.6rem', textAlign: 'center', background: '#f8fafc', color: '#64748b' }}>String Handle (24 bytes)</div>
                   <div style={{ display: 'flex', background: '#fff' }}>
                      <div style={{ padding: '4px 6px', borderRight: '1px solid #eee', color: '#2563eb' }}>ptr <span style={{ fontSize: '0.8rem' }}>↘</span></div>
                      <div style={{ padding: '4px 6px', borderRight: '1px solid #eee' }}>cap: 8</div>
                      <div style={{ padding: '4px 6px' }}>len: 7</div>
                   </div>
                </div>
              </div>
            </div>

            <div style={{ width: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>|</div>

            {/* Employee 2 */}
            <div style={{ border: '1px solid #cbd5e1', borderRadius: '4px', overflow: 'hidden', background: 'white', opacity: 0.7 }}>
              <div style={{ background: '#f8fafc', padding: '4px 8px', borderBottom: '1px solid #eee', textAlign: 'center' }}>Employee [1]</div>
              <div style={{ padding: '8px' }}>
                 <div style={{ display: 'flex', border: '1px solid #e2e8f0', borderRadius: '3px' }}>
                    <div style={{ padding: '4px 6px', borderRight: '1px solid #eee' }}>ptr</div>
                    <div style={{ padding: '4px 6px', borderRight: '1px solid #eee' }}>cap</div>
                    <div style={{ padding: '4px 6px' }}>len</div>
                 </div>
              </div>
            </div>

          </div>
        </div>

        {/* Heap Level 2 - String Data */}
        <div style={{ paddingLeft: '6rem' }}>
          <div style={{ color: 'var(--accent-color)', fontWeight: 'bold', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Heap (Level 2: The Character Buffer)</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
             <div style={{ display: 'flex', border: '2px solid #2563eb', borderRadius: '4px', background: 'white', overflow: 'hidden' }}>
                {['S', 'a', 'r', 't', 'h', 'a', 'k'].map((char, i) => (
                  <div key={i} style={{ padding: '6px 10px', borderRight: i === 6 ? 'none' : '1px solid #eee', color: '#2563eb', fontWeight: 'bold' }}>{char}</div>
                ))}
             </div>
             <div style={{ color: '#2563eb', fontStyle: 'italic', fontSize: '0.7rem' }}>← Pointed to by Employee[0].name.ptr</div>
          </div>
        </div>

      </div>

      <div className="audience-question" style={{ marginTop: '1.5rem' }}>
        <strong>The Recursion of Destruction:</strong>
        <p style={{ fontSize: '0.8rem', marginTop: '0.4rem' }}>
          When <code>my_company</code> goes out of scope, it doesn't just "free memory." It starts a chain reaction: <br/>
          1. <code>Company</code> drops ❯ 2. <code>Vec</code> buffer is freed ❯ 3. <b>Each</b> <code>Employee</code> is dropped ❯ 4. <b>Each</b> <code>String</code> buffer is freed.
        </p>
      </div>
    </Page>
  );
});

export const AllocationProblem = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">The Allocation Problem</h2>
      <div className="content-block">
        Now look back at our <span className="keyword">get(&String)</span> signature. Because it expects a reference to a full String object, the caller is forced to allocate!
      </div>
      <div className="code-snippet">
        <CodeBlock code={`#[test]
fn test_get_allocation() {
    let mut cache = Cache::new();
    cache.put("key".to_string(), "val".to_string());
    
    // THE WASTE:
    // To search, we are forced to create a full String.
    // Heap allocation just to check a key!
    
    let key = String::from("key");
    let result = cache.get(&key);
}`} style={{ fontSize: '0.8rem' }} />
      </div>
      <div className="content-block">
        Every lookup involves an expensive visit to the OS for heap memory. In a fast cache, this is unacceptable.
      </div>
    </Page>
  );
});

export const StringTypes = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">String, str, and &str</h2>
      <div className="content-block" style={{ fontSize: '0.9rem' }}>
        To solve the allocation problem, we must understand the three faces of text in Rust:
      </div>

      <div className="string-comparer">
        <div className="type-info">
          <div className="type-header">String</div>
          <div className="type-desc">Owned, mutable, heap-allocated buffer. Use when you need to grow or modify text.</div>
          <div className="type-layout-viz">
            <span className="layout-box">Stack: handle</span> → <span className="layout-box heap">Heap: data</span>
          </div>
        </div>

        <div className="type-info">
          <div className="type-header">&str (String Slice)</div>
          <div className="type-desc">
            A "fat pointer" to UTF-8 text owned by someone else.
            <br />
            <strong>Where is the data?</strong> If it's a literal like <code>"key"</code>, the text lies in the <strong>Read-Only Data Segment</strong> of your compiled binary. The <code>&str</code> simply points to that fixed location!
          </div>
          <div className="type-layout-viz">
            <span className="layout-box ptr">Stack: [ptr, len]</span> → <span className="layout-box ptr">Binary (Static Mem)</span>
          </div>
        </div>

        <div className="type-info">
          <div className="type-header">str</div>
          <div className="type-desc">The raw "unsized" bytes. Almost always used behind a reference (&str) because its size is unknown at compile time.</div>
        </div>
      </div>
    </Page>
  );
});

export const OptimizedCache = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">Zero-Allocation Get</h2>
      <div className="content-block">
        By changing <span className="keyword">&String</span> to <span className="keyword">&str</span>, we allow the caller to pass string literals directly!
      </div>
      <div className="code-snippet">
        <CodeBlock code={`impl Cache {
    // ... insert remains the same ...

    // OPTIMIZED:
    fn get(&self, key: &str) -> Option<&String> {
        self.data.get(key)
    }
}

#[test]
fn test_zero_allocation_lookup() {
    let mut cache = Cache::new();
    cache.put("key".to_string(), "val".to_string());

    // EXPLICIT TYPE:
    let key: &str = "key"; 
    
    // ZERO HEAP ALLOCATION!
    let result = cache.get(key);
    assert!(result.is_some());
}`} style={{ fontSize: '0.8rem' }} />
      </div>
      <div className="audience-question">
        <strong>💡 Audience Question:</strong>
        <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', fontStyle: 'italic' }}>
          Our HashMap is defined as <code>HashMap{"<"}String, String{">"}</code>. It stores owned <code>String</code> keys.
          How is it possible that we can pass a <code>&str</code> to <code>.get()</code> and it still finds the match?
          Keep this question in mind...
        </p>
      </div>
    </Page>
  );
});
