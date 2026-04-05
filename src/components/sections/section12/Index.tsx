import React, { forwardRef } from 'react';
import Page from '../../Page';
import CodeBlock from '../../CodeBlock';

export const Section12Cover = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <div className="page cover-page" data-density="hard" ref={ref}>
      <div className="page-content">
        <div className="cover-subtitle">Rust India Conference 2026</div>
        <div className="cover-decoration" />
        <h1 className="cover-title">STAGE 12</h1>
        <div className="cover-decoration" />
        <div className="cover-subtitle">Hardware-Level Concurrency</div>
        <div className="cover-subtitle" style={{ marginTop: '2rem', fontStyle: 'italic' }}>
          Concurrent Stats & Atomics.
        </div>
      </div>
      <div className="page-number">{props.number}</div>
    </div>
  );
});

export const Stage12Roadmap = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">Stage 12 Roadmap</h2>
      <div className="content-block">
        <ul style={{ paddingLeft: '1.5rem', lineHeight: '2.0' }}>
          <li><strong>The Metrics Problem</strong>: Measuring Hits & Misses.</li>
          <li><strong>Lock-Based Design</strong>: Why locks are overkill for stats.</li>
          <li><strong>Atomics</strong>: The Hardware's Uninterruptible Promise.</li>
          <li><strong>Memory Hierarchy</strong>: Data flow from RAM to L1 caches.</li>
          <li><strong>Modification Order (MO)</strong>: Total Variable History.</li>
          <li><strong>Acquire & Release</strong>: Memory Barriers.</li>
          <li><strong>Hardware Coherence</strong>: The MESI Protocol.</li>
          <li><strong>The Storm</strong>: Cache Line Ping-Pong.</li>
          <li><strong>Resolution</strong>: Optimizing with Padding.</li>
        </ul >
      </div>
    </Page>
  );
});

export const TheMetricsProblem = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">The Metrics Problem</h2>
      <div className="content-block">
        A production cache must track its performance. We need to collect:
      </div>
      <div className="content-block">
        <ul style={{ paddingLeft: '1.2rem', lineHeight: '2.2' }}>
          <li><strong>HITS</strong>: Found in cache.</li>
          <li><strong>MISSES</strong>: Not found (expensive backend call).</li>
          <li><strong>PUTS</strong>: Number of additions.</li>
          <li><strong>GETS</strong>: Total search attempts.</li>
        </ul>
      </div>
      <div className="explanation-box" style={{ marginTop: '1.5rem' }}>
        <strong>Goal</strong>: Calculate the <strong>Hit Ratio</strong>. If it's too low, we know our eviction policy or sharding strategy is failing.
      </div>
    </Page>
  );
});

export const LockBasedDesign = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">The Naive Approach: Locks</h2>
      <div className="content-block">
        The simplest way to update stats across threads is to use a <code>Mutex</code> or <code>RwLock</code>.
      </div>
      <div className="code-snippet">
        <CodeBlock code={`struct CacheStats {
    hits: RwLock<usize>,
    misses: RwLock<usize>,
}

impl CacheStats {
    fn increment_hits(&self) {
        let mut guard = self.hits.write().unwrap();
        *guard += 1; // (1) CRITICAL SECTION
    }
}`} style={{ fontSize: '0.8rem' }} />
      </div>
      <div className="explanation-box" style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
        <h3 style={{ color: '#dc2626', fontSize: '1rem' }}>The Lock Tax</h3>
        To execute (1), the OS must <strong>deschedule your thread</strong> and wait for a context switch if the lock is held. This costs thousands of CPU cycles for a simple integer increment.
      </div>
    </Page>
  );
});

export const AtomicsIntro = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">Atomics: Hardware Logic</h2>
      <div className="content-block">
        <strong>Atomics</strong> ensure that any operation on a variable is <strong>indivisible</strong> at the hardware level.
      </div>
      <div className="explanation-box" style={{ background: 'var(--accent-light)' }}>
        <h3 style={{ fontSize: '1rem', color: 'var(--accent-color)' }}>The Uninterruptible Promise</h3>
        No other thread can see an atomic value in a partially-updated state. The processor executes these instructions atomically without needing to trap into the OS kernel.
      </div>
      <div className="content-block" style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
        This avoids context switches and allows for lock-free, high-performance synchronization.
      </div>
    </Page>
  );
});

export const MemoryHierarchy = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">The Memory Hierarchy</h2>
      <div className="content-block" style={{ fontSize: '0.85rem' }}>
        Data doesn't jump to registers instantly. It flows from Main RAM through a hierarchy of caches:
      </div>
      <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
          <div style={{ border: '2px solid #ccc', padding: '5px 40px', borderRadius: '4px', background: '#eee' }}><strong>Main RAM (~100ns)</strong></div>
          <div style={{ fontSize: '1rem' }}>↑↓</div>
          <div style={{ border: '2px solid var(--accent-color)', opacity: 0.6, padding: '5px 20px', borderRadius: '4px' }}>L3 Cache (~12ns)</div>
          <div style={{ fontSize: '1rem' }}>↑↓</div>
          <div style={{ border: '2px solid var(--accent-color)', opacity: 0.8, padding: '5px 20px', borderRadius: '4px' }}>L2 Cache (~4ns)</div>
          <div style={{ fontSize: '1rem' }}>↑↓</div>
          <div style={{ border: '2px solid var(--accent-color)', padding: '5px 20px', borderRadius: '4px' }}>L1 Cache (~1ns)</div>
        </div>
        <div style={{ textAlign: 'center', fontWeight: 'bold', marginTop: '0.5rem' }}>CPU Core</div>
      </div>
      <div className="content-block" style={{ fontSize: '0.85rem', marginTop: '1rem' }}>
        The 100x "Latency Gap" between L1 and RAM is why <strong>Cache Coherence</strong> and <strong>Memory Ordering</strong> are critical for performance.
      </div>
    </Page>
  );
});

export const InstructionOptimization = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">Optimization & Reordering</h2>
      <div className="content-block" style={{ fontSize: '0.85rem' }}>
        To maximize speed, CPUs and compilers <strong>reorder instructions</strong>. Consider this function:
      </div>
      <div className="code-snippet">
        <CodeBlock code={`fn f(a: &mut i32, b: &mut i32) {
    *a += 1;
    *b += 1;
    *a += 1;
}`} style={{ fontSize: '0.8rem' }} />
      </div>
      <div className="content-block" style={{ fontSize: '0.85rem', marginTop: '1rem' }}>
        The compiler will almost certainly coalesce the increments into:
      </div>
      <div className="code-snippet">
        <CodeBlock code={`fn f(a: &mut i32, b: &mut i32) {
    *a += 2;
    *b += 1;
}`} style={{ fontSize: '0.8rem' }} />
      </div>
      <div className="content-block" style={{ fontSize: '0.85rem', marginTop: '1rem' }}>
        Crucially, another thread might see <code>*a</code> updated <i>before</i> or <i>after</i> <code>*b</code>.
      </div>
    </Page>
  );
});

export const MemoryModelHappensBefore = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">Happens-Before Relationships</h2>
      <div className="content-block" style={{ fontSize: '0.85rem' }}>
        Rust's memory model abstracts away hardware complexity by defining a <strong>Happens-Before Relationship</strong>.
      </div>
      <div className="explanation-box" style={{ marginTop: '1.2rem' }}>
        <h3 style={{ fontSize: '1rem', color: 'var(--accent-color)' }}>Sequential Ordering</h3>
        Everything that happens within the same thread happens in order. If a thread executes <code>f(); g();</code>, then <code>f()</code> <strong>happens-before</strong> <code>g()</code>.
      </div>
      <div className="content-block" style={{ marginTop: '1.5rem', fontSize: '0.85rem' }}>
        To coordinate <i>across</i> cores, we use <strong>Memory Ordering</strong> to build cross-thread relationships.
      </div>
    </Page>
  );
});

export const MemoryOrderingRelaxed = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">Relaxed & Modification Order</h2>
      <div className="content-block" style={{ fontSize: '0.85rem' }}>
        <code>Relaxed</code> ordering guarantees a <strong>Modification Order (MO)</strong>,a strict history of values for a variable.
      </div>
      <div className="code-snippet">
        <CodeBlock code={`static X: AtomicI32 = AtomicI32::new(0);

fn thread_a() {
    X.fetch_add(5, Relaxed);  // (A)
    X.fetch_add(10, Relaxed); // (B)
}

fn thread_b() {
    let val_1 = X.load(Relaxed); // sees 5
    let val_2 = X.load(Relaxed); // sees 15
}`} style={{ fontSize: '0.75rem' }} />
      </div>
      <div className="explanation-box" style={{ fontSize: '0.75rem', background: '#eef2ff' }}>
        At any moment, <strong>Thread A might see 5 while Thread B simultaneously sees 15</strong>. They agree on history, but not necessarily the present state.
      </div>
      <div className="content-block" style={{ marginTop: '0.5rem', fontSize: '0.82rem' }}>
        <strong>Rule</strong>: Once a value is seen, a thread can only see later values in the MO. It can <strong>never go backwards in time</strong>.
      </div>
    </Page>
  );
});

export const MemoryOrderingAcqRel = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">The Acquire & Release Sync</h2>
      <div className="content-block" style={{ fontSize: '0.85rem' }}>
        <strong>Release</strong> ordering pairs with <strong>Acquire</strong> to form a memory barrier across hardware boundaries.
      </div>
      <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
        <div className="explanation-box" style={{ flex: 1, fontSize: '0.75rem' }}>
          <strong>Store (Release)</strong>:<br />
          Pushes previous changes out from L1 caches.
        </div>
        <div className="explanation-box" style={{ flex: 1, fontSize: '0.75rem' }}>
          <strong>Load (Acquire)</strong>:<br />
          Pulls latest changes in from shared caches.
        </div>
      </div>
      <div className="code-snippet" style={{ marginTop: '1rem' }}>
        <CodeBlock code={`// Thread A (Writer)
data.store(42, Relaxed); // (1) Memory write
locked.store(UNLOCKED, Release); // (2) Sync Point

// Thread B (Reader)
if locked.load(Acquire) == UNLOCKED { // (3) Sync Point
    // (1) is now guaranteed visible:
    assert_eq!(data.load(Relaxed), 42); 
}`} style={{ fontSize: '0.7rem' }} />
      </div>
      <div className="content-block" style={{ fontSize: '0.8rem' }}>
        The barrier at (2) ensures that (1) is finished and globally visible before (3) can succeed.
      </div>
    </Page>
  );
});

export const MemoryOrderingSeqCst = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">Sequential Consistency</h2>
      <div className="content-block" style={{ fontSize: '0.85rem' }}>
        <code>SeqCst</code> implies a <strong>Single Total Modification Order</strong> across ALL variables in the system tagged this way.
      </div>
      <div className="explanation-box" style={{ background: 'var(--accent-light)' }}>
        It ensures a global sequence of events that <strong>all threads agree on</strong>. This is the safest but most expensive ordering as it forces universal consensus across every CPU core.
      </div>
      <div className="content-block" style={{ marginTop: '1.2rem', fontSize: '0.8rem' }}>
        Use it when you need a total, global order of operations across multiple atomics.
      </div>
    </Page>
  );
});

export const ConcurrentStatsDesign = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">Implementing the Stats</h2>
      <div className="content-block">
        We'll use an array of <code>AtomicUsize</code> to store our metrics.
      </div>
      <div className="code-snippet">
        <CodeBlock code={`enum StatsType { HITS=0, MISSES=1, PUTS=2, GETS=3 }

struct ConcurrentStatsCounter {
    entries: [AtomicUsize; 4], // Each is 8 bytes
}

impl ConcurrentStatsCounter {
    fn add(&self, stats_type: StatsType, count: usize) {
        self.entries[stats_type as usize]
            .fetch_add(count, Ordering::Relaxed);
    }
}`} style={{ fontSize: '0.8rem' }} />
      </div>
      <div className="content-block" style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
        Wait! Under high concurrency, this code becomes a bottleneck. To understand why, we must look at how <strong>Cores maintain data consistency</strong>.
      </div>
    </Page>
  );
});

export const MESIProtocol = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">The MESI Protocol</h2>
      <div className="content-block" style={{ fontSize: '0.85rem' }}>
        Hardware maintains cache coherence using four states for every 64-byte <strong>Cache Line</strong>:
      </div>
      <div className="explanation-box" style={{ marginTop: '0.5rem', fontSize: '0.78rem' }}>
        <ul style={{ paddingLeft: '1rem', lineHeight: '1.6' }}>
          <li><strong>Modified (M)</strong>: Local core has UPDATED the value. The line is dirty and mismatched with RAM.</li>
          <li><strong>Exclusive (E)</strong>: Matches RAM; this core is the ONLY owner.</li>
          <li><strong>Shared (S)</strong>: Multiple cores have read-only copies.</li>
          <li><strong>Invalid (I)</strong>: Data is stale; another core has modified it.</li>
        </ul>
      </div>
      <div className="explanation-box" style={{ background: 'var(--accent-light)', marginTop: '1rem' }}>
        <h3 style={{ fontSize: '0.9rem', color: 'var(--accent-color)' }}>The Core Update Rule</h3>
        When a core <strong>updates</strong> a value, it moves the line into the <strong>Modified (M)</strong> state. If other cores held the line in <strong>S</strong>, they are forced into the <strong>Invalid (I)</strong> state.
      </div>
    </Page>
  );
});

const InvalidationStormTimeline = () => {
  const lineStyle: React.CSSProperties = {
    display: 'flex',
    border: '2px solid var(--border-color)',
    borderRadius: '4px',
    height: '24px',
    background: 'white',
    width: '100%',
    position: 'relative',
    overflow: 'hidden'
  };

  const slotStyle = (label: string, active = false): React.CSSProperties => ({
    flex: 1,
    borderRight: '1px solid #ddd',
    fontSize: '0.55rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    background: active ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
    color: active ? 'var(--accent-color)' : 'inherit'
  });

  return (
    <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
      {/* PHASE 1: Sync */}
      <div style={{ borderLeft: '2px solid #ddd', paddingLeft: '1rem' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--accent-color)', marginBottom: '0.5rem' }}>PHASE 1: Synchronized (Shared)</div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.6rem', opacity: 0.7, marginBottom: '2px' }}>Core 1 L1 (State: S)</div>
            <div style={lineStyle}>
              {['H', 'M', 'P', 'G'].map(l => <div key={l} style={slotStyle(l)}>{l}</div>)}
              <div style={{ flex: 4, background: '#f5f5f5' }}></div>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.6rem', opacity: 0.7, marginBottom: '2px' }}>Core 2 L1 (State: S)</div>
            <div style={lineStyle}>
              {['H', 'M', 'P', 'G'].map(l => <div key={l} style={slotStyle(l)}>{l}</div>)}
              <div style={{ flex: 4, background: '#f5f5f5' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* PHASE 2: The Collision */}
      <div style={{ borderLeft: '2px solid var(--accent-color)', paddingLeft: '1rem', position: 'relative', marginTop: '1rem' }}>
        <div style={{ position: 'absolute', left: '-15px', top: '10px', fontSize: '1.5rem' }}>⚡</div>
        <div style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--accent-color)', marginBottom: '0.5rem' }}>PHASE 2: Thread A updates 'Hits'</div>

        {/* Thread Action Callout */}
        <div style={{ position: 'absolute', top: '-40px', left: '20px', padding: '4px 8px', background: 'var(--accent-color)', color: 'white', fontSize: '0.55rem', borderRadius: '4px', fontWeight: 'bold' }}>
          Thread A: <code>fetch_add(Hits)</code>
          <div style={{ position: 'absolute', bottom: '-5px', left: '20px', width: '2px', height: '15px', background: 'var(--accent-color)' }}></div>
        </div>

        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.6rem', fontWeight: 'bold', color: 'var(--accent-color)', marginBottom: '2px' }}>Core 1 L1 (State: M)</div>
            <div style={{ ...lineStyle, borderColor: 'var(--accent-color)', boxShadow: '0 0 5px rgba(56, 189, 248, 0.3)' }}>
              {['H', 'M', 'P', 'G'].map(l => <div key={l} style={slotStyle(l, l === 'H')}>{l}</div>)}
              <div style={{ flex: 4, background: '#f5f5f5' }}></div>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.6rem', fontWeight: 'bold', color: '#ef4444', marginBottom: '2px' }}>Core 2 L1 (State: I)</div>
            <div style={{ ...lineStyle, borderColor: '#ef4444', background: '#fff5f5' }}>
              {['H', 'M', 'P', 'G'].map(l => <div key={l} style={{ ...slotStyle(l), opacity: 0.3 }}>{l}</div>)}
              <div style={{ flex: 4, background: '#ffebeb' }}></div>
            </div>
          </div>
        </div>
        <div style={{ fontSize: '0.6rem', marginTop: '5px', fontStyle: 'italic', opacity: 0.8 }}>
          Internal Bus: "Invalidate Broadcast" sent. Core 2's entire copy is trashed.
        </div>
      </div>

      {/* PHASE 3: The Storm */}
      <div style={{ borderLeft: '2px dotted #ef4444', paddingLeft: '1rem', opacity: 0.9 }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#ef4444', marginBottom: '0.5rem' }}>PHASE 3: Thread B needs 'Misses'</div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{ flex: 1, textAlign: 'center', fontSize: '0.6rem', padding: '10px', border: '1px solid #ef4444', borderRadius: '4px' }}>
            Core 2 stalls. It must re-fetch the line from Core 1 (L1 → L3 → L1).
          </div>
          <div style={{ flex: 1, fontSize: '0.65rem', fontStyle: 'italic' }}>
            Coherence traffic flood as the line "ping-pongs" ownership across the bus.
          </div>
        </div>
        <div style={{ marginTop: '10px', fontSize: '0.55rem', opacity: 0.6 }}>
          <b>Notation Index:</b> [H]=Hits, [M]=Misses, [P]=Puts, [G]=Gets. All occupy 8 bytes within a single 64B cache line.
        </div>
      </div>
    </div>
  );
};

export const FalseSharingBad = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">The Invalidation Storm</h2>
      <div className="content-block" style={{ fontSize: '0.8rem' }}>
        Cores own data in <b>64-byte chunks</b> (called a <b>cache-line</b>). While 64 bytes is the most common size, it is not universal. Because our counters share a single line, updating one causes hardware collisions for others.
      </div>

      <InvalidationStormTimeline />

      <div className="content-block" style={{ marginTop: '0.8rem', fontSize: '0.8rem', fontStyle: 'italic' }}>
        Threads on different cores spend all their time fighting for <b>exclusive ownership</b> of the cache line instead of incrementing values.
      </div>
    </Page>
  );
});

export const OptimizedConcurrentStats = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">The Fix: Cache Padding</h2>
      <div className="content-block" style={{ fontSize: '0.8rem' }}>
        We isolate each counter onto its own cache line and use <b>Acquire/Release</b> to synchronize metrics across hardware boundaries.
      </div>
      <div className="code-snippet">
        <CodeBlock code={`#[repr(transparent)]
struct Counter(CachePadded<AtomicUsize>);

struct ConcurrentStatsCounter {
    entries: [Counter; 4],
}

impl ConcurrentStatsCounter {
    fn new() -> Self {
        Self { entries: [const { Counter(CachePadded::new(AtomicUsize::new(0))) }; 4] }
    }

    pub(crate) fn hits(&self) -> usize { self.get(StatsType::HITS) }
    pub(crate) fn misses(&self) -> usize { self.get(StatsType::MISSES) }

    pub(crate) fn hit_ratio(&self) -> f64 {
        let (h, m) = (self.hits(), self.misses());
        if h == 0 || m == 0 { return 0.0; }
        (h as f64) / (h + m) as f64
    }

    fn add(&self, stats_type: StatsType, count: usize) {
        // (1) AcqRel: Push updates to other cores
        self.entries[stats_type as usize].0.fetch_add(count, Ordering::AcqRel);
    }

    fn get(&self, stats_type: StatsType) -> usize {
        // (2) Acquire: Pull updates from other cores
        self.entries[stats_type as usize].0.load(Ordering::Acquire)
    }
}`} style={{ fontSize: '0.64rem' }} />
      </div>
      <div className="explanation-box" style={{ marginTop: '0.8rem', fontSize: '0.78rem' }}>
        <h3 style={{ fontSize: '0.9rem', color: 'var(--accent-color)' }}>Zero-Cost Layout</h3>
        <code>#[repr(transparent)]</code> ensures <code>Counter</code> has the exact same layout as <code>CachePadded</code>. We use <b>AcqRel</b> at (1) and <b>Acquire</b> at (2) to form a <b>Happens-Before Relationship</b>, ensuring the thread reading the <code>hit_ratio</code> sees consistent data.
      </div>
    </Page>
  );
});
