import React, { forwardRef } from 'react';
import Page from '../../Page';
import CodeBlock from '../../CodeBlock';

export const Section10Cover = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <div className="page cover-page" data-density="hard" ref={ref}>
      <div className="page-content">
        <div className="cover-subtitle">Rust India Conference 2026</div>
        <div className="cover-decoration" />
        <h1 className="cover-title">STAGE 10</h1>
        <div className="cover-decoration" />
        <div className="cover-subtitle">Scaling Connectivity</div>
        <div className="cover-subtitle" style={{ marginTop: '2rem', fontStyle: 'italic' }}>
          Sharding & Partitioning of Locks.
        </div>
      </div>
      <div className="page-number">{props.number}</div>
    </div>
  );
});

export const Stage10Roadmap = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">Stage 10 Roadmap</h2>
      <div className="content-block">
        <ul style={{ paddingLeft: '1.5rem', lineHeight: '2.2' }}>
          <li><strong>The Global Lock</strong>: Identifying the scaling limit.</li>
          <li><strong>Sharding Design</strong>: Spreading the load horizontally.</li>
          <li><strong>Hashing & Routing</strong>: Consistent shard selection.</li>
          <li><strong>Rust Implementation</strong>: Building the sharded API.</li>
          <li><strong>The Hashing Tax</strong>: Balancing overhead vs concurrency.</li>
          <li><strong>Verification</strong>: Confirming thread-safe access.</li>
        </ul>
      </div>
    </Page>
  );
});

export const LockContentionIntro = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">The Global Lock Problem</h2>
      <div className="content-block">
        In our current design, the entire HashMap is wrapped in a <strong>single RwLock</strong>. This creates a bottleneck:
      </div>
      <div className="explanation-box" style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
        <h3 style={{ color: '#dc2626', fontSize: '1rem' }}>The Contention Point</h3>
        Even if two threads want to update completely unrelated keys (e.g., "key1" and "key99"), they must <strong>compete for the same lock</strong>.
      </div>
      <div className="content-block" style={{ marginTop: '1.5rem' }}>
        As the number of threads increases, threads spend more time waiting for the lock than actually doing work. This is <strong>Lock Contention</strong>.
      </div>
    </Page>
  );
});

export const ShardingDesign = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">Horizontal Scaling: Sharding</h2>
      <div className="content-block">
        Instead of one big lock, we break our data into <strong>N independent shards</strong>, each with its own lock.
      </div>
      
      {/* Sharding Visualization */}
      <div className="explanation-box" style={{ 
        marginTop: '1.5rem', 
        padding: '1.5rem', 
        background: 'var(--bg-card)', 
        border: '1px solid var(--border-color)',
        borderRadius: '12px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ 
              flex: 1, 
              padding: '10px', 
              border: '2px solid var(--accent-color)', 
              borderRadius: '8px',
              textAlign: 'center',
              background: 'var(--accent-light)'
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>Shard {i}</div>
              <div style={{ fontSize: '0.6rem', opacity: 0.7 }}>[RwLock]</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.8rem' }}>
          <strong>The Result</strong>: Up to 4 threads can now write simultaneously, provided they hit different shards!
        </div>
      </div>

      <div className="content-block" style={{ marginTop: '1.5rem' }}>
        This is how production-grade concurrent maps like <code>DashMap</code> achieve near-linear scaling.
      </div>
    </Page>
  );
});

export const TheShardedStruct = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">The Sharded Structure</h2>
      <div className="content-block">
        Our new <code>Cache</code> stores a <code>Vec</code> of locks, where each lock guards its own HashMap.
      </div>
      <div className="code-snippet">
        <CodeBlock code={`struct Cache<K, V> 
where K: Eq + Hash 
{
    // A vector of independent locks
    shards: Vec<RwLock<HashMap<K, V>>>,
    num_shards: usize,
}`} />
      </div>
      <div className="code-snippet" style={{ marginTop: '1rem' }}>
        <CodeBlock code={`impl<K, V> Cache<K, V> {
    fn new(shards: usize) -> Arc<Self> {
        let shards_vec = (0..shards)
            .map(|_| RwLock::new(HashMap::new()))
            .collect();
            
        Arc::new(Self { shards: shards_vec, num_shards: shards })
    }
}`} style={{ fontSize: '0.8rem' }} />
      </div>
    </Page>
  );
});

export const HashingAndIndexing = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">Consistent Routing</h2>
      <div className="content-block">
        To find the correct shard, we must consistently map a key to an index between <code>0</code> and <code>n-1</code>.
      </div>
      <div className="code-snippet">
        <CodeBlock code={`fn shard_index<Q>(&self, key: &Q) -> usize 
where Q: ?Sized + Hash 
{
    let mut hasher = DefaultHasher::new();
    key.hash(&mut hasher);
    
    // Map the hash to our shard count
    (hasher.finish() as usize) % self.num_shards
}`} />
      </div>
      <div className="explanation-box" style={{ marginTop: '1.2rem', fontSize: '0.85rem' }}>
        <strong>The Hashing Tax</strong>: We now pay for a hash calculation on <i>every</i> access. In production (e.g., <code>DashMap</code>), faster hashers like <code>AHash</code> or <code>FxHash</code> are preferred to minimize this <strong>fixed overhead</strong> (the "startup cost" of the hashing algorithm).
        <br /><br />
        <strong>Note on Traits</strong>: Notice that for the <code>shard_index</code>, the type <code>Q</code> only needs to implement <code>Hash</code>. It does not require <code>Eq</code> because we are only routing to a shard, not comparing keys yet.
      </div>
      <div className="explanation-box" style={{ marginTop: '0.8rem', background: 'var(--accent-light)', fontSize: '0.85rem' }}>
        <strong>Optimization Tip: Power of 2</strong>: In high-performance designs, the number of shards is typically a <strong>Power of 2</strong> (e.g., 16, 32, 64). This allows the compiler to replace the expensive modulo operator (<code>%</code>) with a much faster bitwise AND (<code>& (num_shards - 1)</code>).
      </div>
    </Page>
  );
});

export const ShardedImplementation = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">Putting it Together</h2>
      <div className="content-block">
        The <code>put</code> operation now only acquires the lock for the specific shard it needs.
      </div>
      <div className="code-snippet">
        <CodeBlock code={`fn put(&self, key: K, value: V) {
    let idx = self.shard_index(&key);
    
    // Only this shard is locked! 
    // Others remain available.
    let mut shard = self.shards[idx].write().unwrap();
    shard.insert(key, value);
}`} />
      </div>
      <div className="content-block" style={{ marginTop: '1.5rem' }}>
        Notice that <code>self</code> is shared (via Arc). Multiple threads can call <code>put</code> simultaneously, and as long as their keys hash to different shards, they will <strong>never block each other</strong>.
      </div>
    </Page>
  );
});

export const ShardedAccess = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-left">
      <h2 className="section-title">Zero-Copy Sharded Get</h2>
      <div className="content-block">
        We can combine sharding with our <code>Ref</code> pattern from Stage 8 for maximum performance.
      </div>
      <div className="code-snippet">
        <CodeBlock code={`fn get<Q>(&self, key: &Q) -> Option<Ref<'_, K, V>>
where Q: ?Sized + Hash + Eq, K: Borrow<Q>
{
    let idx = self.shard_index(key);
    let guard = self.shards[idx].read().unwrap();

    let value = guard.get(key)?;
    let ptr = value as *const V;

    // Return the safe Ref wrapper
    Some(Ref { guard, value: ptr })
}`} style={{ fontSize: '0.8rem' }} />
      </div>
      <div className="content-block" style={{ marginTop: '1.5rem', fontSize: '0.9rem' }}>
        The caller holds a lock on <strong>only one shard</strong>, allowing readers to proceed on all other shards without interference.
      </div>
    </Page>
  );
});

export const ShardedVerification = forwardRef<HTMLDivElement, { number: number }>((props, ref) => {
  return (
    <Page number={props.number} ref={ref} className="page-right">
      <h2 className="section-title">Verification</h2>
      <div className="content-block">
        We can verify that threads hit different shards and operate in parallel:
      </div>
      <div className="code-snippet">
        <CodeBlock code={`#[test]
fn test_sharded_concurrency() {
    // 16 independent shards -> 16 independent locks
    let cache = Cache::new(16); 
    
    thread::scope(|s| {
        s.spawn(|| cache.put("a", 1));
        s.spawn(|| cache.put("b", 2));
        s.spawn(|| cache.put("c", 3));
    });
    
    assert_eq!(*cache.get("a").unwrap(), 1);
}`} style={{ fontSize: '0.8rem' }} />
      </div>
      <div className="content-block" style={{ marginTop: '1.5rem' }}>
        This design is the foundation of high-performance concurrent systems.
      </div>
    </Page>
  );
});
