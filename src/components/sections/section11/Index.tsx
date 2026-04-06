import React, { forwardRef } from 'react';
import Page from '../../Page';
import CodeBlock from '../../CodeBlock';

export const Section11Cover = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <div className="page cover-page" data-density="hard" ref={ref}>
      <div className="page-content">
        <div className="cover-subtitle">Rust India Conference 2026</div>
        <div className="cover-decoration" />
        <h1 className="cover-title">STAGE 11</h1>
        <div className="cover-decoration" />
        <div className="cover-subtitle">TTL & Background Tasks</div>
        <div className="cover-subtitle" style={{ marginTop: '2rem', fontStyle: 'italic' }}>
          Time-To-Live & Lock Contention.
        </div>
      </div>
      <div className="page-number">{props.number}</div>
    </div>
  );
});

export const Stage11Roadmap = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">Stage 11 Roadmap</h2>
      <div className="content-block">
        <ul style={{ paddingLeft: '1.5rem', lineHeight: '2.0' }}>
          <li><strong>Stale Data</strong>: The need for Time-To-Live.</li>
          <li><strong>Metadata Layer</strong>: Introducing the <code>Entry</code> struct.</li>
          <li><strong>Lock Scoping</strong>: Minimizing write-lock duration.</li>
          <li><strong>Lazy Expiration</strong>: Ensuring correctness in <code>get</code>.</li>
          <li><strong>Zero-Copy Ref</strong>: Adapting pointers for Entry wrappers.</li>
        </ul >
      </div>
    </Page>
  );
});

export const TheStaleDataProblem = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">The Need for Expiry</h2>
      <div className="content-block">
        Until now, our entries stay in memory until the application terminates. This poses two major risks:
      </div>
      <div className="explanation-box" style={{ marginTop: '1rem' }}>
        <ul style={{ paddingLeft: '1.2rem', lineHeight: '1.8' }}>
          <li><strong>Memory Bloat</strong>: Without eviction, the <code>HashMap</code> will eventually consume all available RAM.</li>
          <li><strong>Stale Consistency</strong>: Cached data may no longer reflect the ground truth of the system.</li>
        </ul>
      </div>
      <div className="content-block" style={{ marginTop: '1rem' }}>
        We solve this by wrapping every value in a <strong>Metadata Layer</strong>.
      </div>
    </Page>
  );
});

export const TheShardAbstraction = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">The Shard & Entry</h2>
      <div className="content-block">
        Each entry now tracks its own expiration. The <strong>Shard</strong> manages both the data and its time-based lifecycle.
      </div>
      <div className="code-snippet">
        <CodeBlock code={`struct Entry<V> {
    value: V,
    expires_at: Instant, // 🔑 The Metadata
}

struct Shard<K, V> {
    data: RwLock<HashMap<K, Entry<V>>>,
    ttl_list: RwLock<Vec<(K, Instant)>>,
}

impl<K, V> Shard<K, V> {
    fn new() -> Self {
        Self {
            data: RwLock::new(HashMap::new()),
            ttl_list: RwLock::new(Vec::new()),
        }
    }
}`} style={{ fontSize: '0.75rem' }} />
      </div>
    </Page>
  );
});

export const ShardPutCode = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">Shard::put - Scoping</h2>
      <div className="content-block" style={{ fontSize: '0.8rem' }}>
        Implementing <code>put</code> inside <code>Shard</code>: we must update both the KV store and the TTL list. We use <strong>restricted scopes</strong> to minimize lock contention.
      </div>
      <div className="code-snippet">
        <CodeBlock code={`fn put(&self, key: K, value: V, ttl: Duration) {
    let expiry = Instant::now() + ttl;

    { // SCOPE A: KV Store Update
        let mut guard = self.data.write().unwrap();
        guard.insert(key.clone(), Entry { value, expires_at: expiry });
    } // 🔑 Lock released immediately!

    { // SCOPE B: TTL Tracking
        let mut guard = self.ttl_list.write().unwrap();
        guard.push((key, expiry));
    }
}`} style={{ fontSize: '0.72rem' }} />
      </div>
      <div className="explanation-box" style={{ marginTop: '1rem', fontSize: '0.75rem' }}>
        <strong>Why <code>key.clone()</code>?</strong><br/>
        The key is stored in two places: the <code>HashMap</code> (for access) and the <code>Vec</code> (for background cleanup). Since we hold two separate locks, we must clone the key to ensure consistent ownership in both.
      </div>
    </Page>
  );
});

export const ShardGetLazy = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">Shard::get - Lazy Expiry</h2>
      <div className="content-block">
        Implementing <code>get</code> inside <code>Shard</code>: correctness matters more than performance. We check for expiry <strong>immediately</strong> during lookup.
      </div>
      <div className="code-snippet">
        <CodeBlock code={`fn get<Q>(&self, key: &Q) -> Option<Ref<'_, K, V>>
where Q: ?Sized + Hash + Eq, K: Borrow<Q>
{
    let guard = self.data.read().unwrap();
    let entry = guard.get(key)?;

    // 🔑 Lazy Expiration:
    if Instant::now() > entry.expires_at {
        return None; 
    }

    let ptr = &entry.value as *const V;
    Some(Ref { guard, value: ptr })
}`} style={{ fontSize: '0.75rem' }} />
      </div>
      <div className="explanation-box" style={{ marginTop: '1rem' }}>
        This <strong>Lazy Expiration</strong> ensures that even if a background thread hasn't cleaned up yet, the user never sees stale data.
      </div>
    </Page>
  );
});

export const ZeroCopyRefTTL = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">The Zero-Copy Reference</h2>
      <div className="content-block">
        Our <code>Ref</code> wrapper must now account for the <code>Entry&lt;V&gt;</code> indirection while maintaining safety.
      </div>
      <div className="code-snippet">
        <CodeBlock code={`struct Ref<'a, K, V> {
    guard: RwLockReadGuard<'a, HashMap<K, Entry<V>>>,
    value: *const V,
}

impl<'a, K, V> Deref for Ref<'a, K, V> {
    type Target = V;

    fn deref(&self) -> &Self::Target {
        unsafe { &*self.value } // 🔑 Pointers to inner Entry values
    }
}`} style={{ fontSize: '0.75rem' }} />
      </div>
      <div className="explanation-box" style={{ marginTop: '1rem' }}>
        Despite the extra <code>Entry</code> struct, our <code>Ref</code> still provides <strong>Zero-Copy</strong> access by pointing directly to the value stored in the shard's memory.
      </div>
    </Page>
  );
});

export const CacheRefactorCode = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">Cache-Level Shuffling</h2>
      <div className="content-block">
        The top-level <code>Cache</code> remains simple, delegating its expiry logic to the shards.
      </div>
      <div className="code-snippet">
        <CodeBlock code={`impl<K, V> Cache<K, V> where K: Eq + Hash + Clone {
    fn put(&self, key: K, value: V, ttl: Duration) {
        let index = self.shard_index(&key);
        self.shards[index].put(key, value, ttl);
    }

    fn get<Q>(&self, key: &Q) -> Option<Ref<'_, K, V>>
    where
        K: Borrow<Q>,
        Q: Hash + Eq + ?Sized,
    {
        let index = self.shard_index(key);
        self.shards[index].get(key)
    }
}`} style={{ fontSize: '0.75rem' }} />
      </div>
    </Page>
  );
});

export const ContentionManagement = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">Lock Contention Analysis</h2>
      <div className="content-block">
        Why go through the effort of separate locks?
      </div>
      <div className="explanation-box" style={{ background: 'rgba(56, 189, 248, 0.05)', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
        <h3 style={{ fontSize: '1rem', color: 'var(--accent-color)' }}>Parallelism of Cleaners</h3>
        We haven't built the <strong>Background Cleaner</strong> yet. But when we do, it will scan the <code>ttl_list</code> independently. By having separate locks, the cleaner can find expired keys without blocking active readers from fetching valid data.
      </div>
      <div className="content-block" style={{ marginTop: '1.5rem', fontStyle: 'italic', opacity: 0.8 }}>
        This separation is the secret to building high-throughput caches under heavy load.
      </div>
    </Page>
  );
});

export const ShardCleanupCode = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">The Cleanup Phase</h2>
      <div className="content-block" style={{ fontSize: '0.8rem' }}>
        We must clean up expired keys in <strong>two distinct phases</strong> to minimize lock contention and prevent deadlocks. 
        <br/><br/>
        First, we require a <strong><code>write()</code> lock</strong> on the <code>ttl_list</code> because <code>retain()</code> modifies the vector in-place by removing the expired elements.
      </div>
      <div className="code-snippet">
        <CodeBlock code={`fn cleanup(&self) {
    let now = Instant::now();

    // Phase 1: collect expired keys
    let expired_keys: Vec<K> = {
        let mut ttl = self.ttl_list.write().unwrap();
        let mut expired = Vec::new();
        ttl.retain(|(key, expiry)| {
            if *expiry <= now {
                expired.push(key.clone());
                false
            } else { true }
        });
        expired
    }; // 🔑 TTL lock released!

    // Phase 2: delete from KV store
    if !expired_keys.is_empty() {
        let mut data = self.data.write().unwrap();
        for key in expired_keys { data.remove(&key); }
    }
}`} style={{ fontSize: '0.72rem' }} />
      </div>
    </Page>
  );
});

export const BackgroundCleanerAssignment = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">Assignment: Background Worker</h2>
      <div className="content-block">
        <strong>Task:</strong> Implement the background cleaner thread.
      </div>
      <div className="explanation-box" style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
        <ol style={{ paddingLeft: '1.2rem', lineHeight: '1.8' }}>
          <li>Spawn a background thread when the cache is created.</li>
          <li>The thread should periodically:
             <ul style={{ listStyleType: 'circle', paddingLeft: '1.2rem' }}>
               <li>Sleep for a fixed duration (e.g., 1 second).</li>
               <li>Select <strong>ONE</strong> shard to clean.</li>
               <li>Call <code>cleanup()</code> on that shard.</li>
             </ul>
          </li>
          <li><strong>Do NOT</strong> clean all shards at once. Spread the cleanup work across shards over time.</li>
          <li>Use a simple strategy to pick the shard (e.g., round-robin using a counter).</li>
          <li>Store the thread handle inside the <code>Cache</code> struct.</li>
        </ol>
      </div>
    </Page>
  );
});
export const BackgroundCleanerImpl = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">The Cleaner Thread</h2>
      <div className="content-block" style={{ fontSize: '0.8rem' }}>
        Here is a basic implementation of the background cleaner using standard library threads:
      </div>
      <div className="code-snippet">
        <CodeBlock code={`fn spawn_cleaner(shards: Arc<Vec<Shard<K, V>>>) -> JoinHandle<()> {
    let handle = thread::spawn(move || {
        let mut index = 0;
        loop {
            let shard = shards.get(index).unwrap();
            shard.cleanup();

            index = (index+1) % shards.len();
            thread::sleep(Duration::from_secs(1));
        }
    });

    handle
}`} style={{ fontSize: '0.75rem' }} />
      </div>
    </Page>
  );
});

export const NonCooperativeCleaner = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">Non-Cooperative Execution</h2>
      <div className="explanation-box" style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
        <h3 style={{ fontSize: '1rem', color: '#dc2626' }}>The Infinite Loop</h3>
        This implementation is considered <strong>non-cooperative</strong> because it contains an infinite <code>loop</code> that never yields to shutdown requests.
      </div>
      <div className="content-block" style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
        <ul style={{ paddingLeft: '1.2rem', lineHeight: '1.8' }}>
          <li><strong>Blocking Sleep</strong>: <code>thread::sleep</code> halts the thread completely. We cannot wake it early to shut down.</li>
          <li><strong>Resource Leak</strong>: When the <code>Cache</code> drops, this thread continues running aimlessly forever, leaking memory and CPU cycles.</li>
        </ul>
      </div>
      <div className="content-block" style={{ marginTop: '1.5rem', fontWeight: 'bold' }}>
        What can be done?
      </div>
      <div className="content-block" style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
        We need a signaling mechanism (like a channel, an <code>AtomicBool</code> flag, or an Async runtime) to tell the thread to exit gracefully. We will solve this later with <strong>Type-States</strong>!
      </div>
    </Page>
  );
});
