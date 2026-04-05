import React, { useRef, useState, useCallback, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { 
  WorkshopCover,
  Stage1Cover, 
  Intro, 
  Stage1Roadmap,
  BasicCache, 
  Operations, 
  StructsReferences,
  MethodReceivers,
  StringLayout,
  OwnershipDetails,
  AllocationProblem,
  StringTypes,
  OptimizedCache
} from './sections/section1/Index';
import {
  Section2Cover,
  Section2Intro,
  Section2Roadmap,
  PrimitiveObsession,
  NewTypePattern,
  DerivingTraits,
  TypeSafeCache,
  SafetyVerification
} from './sections/section2/Index';
import {
  Section3Cover,
  Section3Intro,
  IntroducingGenerics,
  TraitBounds,
  GenericSyntax,
  TheBorrowTrait,
  GenericCacheImpl,
  GenericTests
} from './sections/section3/Index';
import { 
  Section4Cover,
  Stage4Roadmap,
  IntroduceGetMut,
  MutableScopeProblem,
  AliasMutationError,
  TheUpdateMethod,
  UpdateImplCode,
  UpdateTests,
  MultipleUpdatesScope,
  ClosureTraits,
  InteriorMutabilityPath
} from './sections/section4/Index';
import { 
  Section5Cover,
  Stage5Roadmap,
  TheEntryStruct,
  RefCellMethods,
  CacheIntegration,
  RuntimeBorrowProblem,
  RuntimePanicError
} from './sections/section5/Index';
import {
  Section6Cover,
  Section6Intro,
  ConcurrencyIntro,
  CompilationError,
  ThreadSafeWrapper,
  RAIIGuards,
  InnerLockingDrop,
  TheDerefTrait,
  TheUnwrapMystery,
  TheBrokenGet,
  OwnershipShift,
  SafeCacheImpl,
  ThreadSafeTests
} from './sections/section6/Index';
import {
  Section7Cover,
  Section7Intro,
  TheCloningTax,
  IntroducingArc,
  ArcMechanics,
  ArcInsideCache,
  ArcDeref,
  FinalArcImplementation,
  ArcTests
} from './sections/section7/Index';
import {
  Section8Cover,
  Stage8Roadmap,
  Section8Intro,
  CustomRefPattern,
  LifetimeAnchor,
  ThePointerTrick,
  UnsafeDeref,
  LockTradeoff,
  ZeroCopyTests,
  Section8Summary
} from './sections/section8/Index';
import {
  Section9Cover,
  Stage9Roadmap,
  BeyondScope,
  TheOwnershipWall,
  FoundationOfConcurrency,
  SharedCacheArc,
  SendAndSync,
  FinalVerification
} from './sections/section9/Index';
import {
  Section10Cover,
  Stage10Roadmap,
  LockContentionIntro,
  ShardingDesign,
  TheShardedStruct,
  HashingAndIndexing,
  ShardedImplementation,
  ShardedAccess,
  ShardedVerification
} from './sections/section10/Index';
import {
  Section11Cover,
  Stage11Roadmap,
  TheStaleDataProblem,
  TheShardAbstraction,
  ShardPutCode,
  ShardGetLazy,
  ZeroCopyRefTTL,
  CacheRefactorCode,
  ContentionManagement,
  ShardCleanupCode,
  BackgroundCleanerAssignment,
  BackgroundCleanerImpl,
  NonCooperativeCleaner
} from './sections/section11/Index';
import { 
  Section12Cover,
  Stage12Roadmap,
  TheMetricsProblem,
  LockBasedDesign,
  AtomicsIntro,
  MemoryHierarchy,
  InstructionOptimization,
  MemoryModelHappensBefore,
  MemoryOrderingRelaxed,
  MemoryOrderingAcqRel,
  MemoryOrderingSeqCst,
  MESIProtocol,
  ConcurrentStatsDesign,
  FalseSharingBad,
  OptimizedConcurrentStats
} from './sections/section12/Index';
import {
  Section13Cover,
  Stage13Roadmap,
  ShutdownIntro,
  NaiveApproach,
  OwnershipTermination,
  TypeStateConcept,
  CompilerAsGuard,
  Section13Summary
} from './sections/section13/Index';

const Book: React.FC = () => {
  const bookRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const onPage = useCallback((e: any) => {
    setCurrentPage(e.data);
  }, []);

  const nextPrevPage = useCallback((direction: 'next' | 'prev') => {
    if (bookRef.current) {
      if (direction === 'next') {
        bookRef.current.pageFlip().flipNext();
      } else {
        bookRef.current.pageFlip().flipPrev();
      }
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        nextPrevPage('next');
      } else if (e.key === 'ArrowLeft') {
        nextPrevPage('prev');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextPrevPage]);

  return (
    <div className="book-container">
      {/* @ts-ignore */}
      <HTMLFlipBook
        width={800}
        height={850}
        size="stretch"
        minWidth={315}
        maxWidth={2500}
        minHeight={400}
        maxHeight={2500}
        maxShadowOpacity={0.5}
        showCover={true}
        mobileScrollSupport={true}
        onFlip={onPage}
        className="flip-book"
        ref={bookRef}
      >
        {/* Overall Cover */}
        <WorkshopCover />

        {/* Section 1 */}
        <Stage1Cover number={1} />
        <Intro number={2} />
        <Stage1Roadmap number={3} />
        <BasicCache number={4} />
        <Operations number={5} />
        <StructsReferences number={6} />
        <MethodReceivers number={7} />
        <StringLayout number={8} />
        <OwnershipDetails number={9} />
        <AllocationProblem number={10} />
        <StringTypes number={11} />
        <OptimizedCache number={12} />

        {/* Section 2 */}
        <Section2Cover number={13} />
        <Section2Intro number={14} />
        <Section2Roadmap number={15} />
        <PrimitiveObsession number={16} />
        <NewTypePattern number={17} />
        <DerivingTraits number={18} />
        <TypeSafeCache number={19} />
        <SafetyVerification number={20} />

        {/* Section 3 */}
        <Section3Cover number={21} />
        <Section3Intro number={22} />
        <IntroducingGenerics number={23} />
        <TraitBounds number={24} />
        <GenericSyntax number={25} />
        <TheBorrowTrait number={26} />
        <GenericCacheImpl number={27} />
        <GenericTests number={28} />

        {/* Stage 4 */}
        <Section4Cover number={29} />
        <Stage4Roadmap number={30} />
        <IntroduceGetMut number={31} />
        <MutableScopeProblem number={32} />
        <AliasMutationError number={33} />
        <TheUpdateMethod number={34} />
        <UpdateImplCode number={35} />
        <UpdateTests number={36} />
        <MultipleUpdatesScope number={37} />
        <ClosureTraits number={38} />
        <InteriorMutabilityPath number={39} />

        {/* Stage 5 */}
        <Section5Cover number={40} />
        <Stage5Roadmap number={41} />
        <TheEntryStruct number={42} />
        <RefCellMethods number={43} />
        <CacheIntegration number={44} />
        <RuntimeBorrowProblem number={45} />
        <RuntimePanicError number={46} />

        {/* Stage 6 */}
        <Section6Cover number={47} />
        <Section6Intro number={48} />
        <ConcurrencyIntro number={49} />
        <CompilationError number={50} />
        <ThreadSafeWrapper number={51} />
        <RAIIGuards number={52} />
        <InnerLockingDrop number={53} />
        <TheDerefTrait number={54} />
        <TheUnwrapMystery number={55} />
        <TheBrokenGet number={56} />
        <OwnershipShift number={57} />
        <SafeCacheImpl number={58} />
        <ThreadSafeTests number={59} />

        {/* Stage 7 */}
        <Section7Cover number={60} />
        <Section7Intro number={61} />
        <TheCloningTax number={62} />
        <IntroducingArc number={63} />
        <ArcMechanics number={64} />
        <ArcInsideCache number={65} />
        <ArcDeref number={66} />
        <FinalArcImplementation number={67} />
        <ArcTests number={68} />

        {/* Stage 8 */}
        <Section8Cover number={69} />
        <Stage8Roadmap number={70} />
        <Section8Intro number={71} />
        <CustomRefPattern number={72} />
        <LifetimeAnchor number={73} />
        <ThePointerTrick number={74} />
        <UnsafeDeref number={75} />
        <LockTradeoff number={76} />
        <ZeroCopyTests number={77} />
        <Section8Summary number={78} />

        {/* Stage 9 */}
        <Section9Cover number={79} />
        <Stage9Roadmap number={80} />
        <BeyondScope number={81} />
        <TheOwnershipWall number={82} />
        <FoundationOfConcurrency number={83} />
        <SharedCacheArc number={84} />
        <SendAndSync number={85} />
        <FinalVerification number={86} />

        {/* Stage 10 */}
        <Section10Cover number={87} />
        <Stage10Roadmap number={88} />
        <LockContentionIntro number={89} />
        <ShardingDesign number={90} />
        <TheShardedStruct number={91} />
        <HashingAndIndexing number={92} />
        <ShardedImplementation number={93} />
        <ShardedAccess number={94} />
        <ShardedVerification number={95} />

        {/* Stage 11 */}
        <Section11Cover number={96} />
        <Stage11Roadmap number={97} />
        <TheStaleDataProblem number={98} />
        <TheShardAbstraction number={99} />
        <ShardPutCode number={100} />
        <ShardGetLazy number={101} />
        <ZeroCopyRefTTL number={102} />
        <CacheRefactorCode number={103} />
        <ContentionManagement number={104} />
        <ShardCleanupCode number={105} />
        <BackgroundCleanerAssignment number={106} />
        <BackgroundCleanerImpl number={107} />
        <NonCooperativeCleaner number={108} />

        {/* Stage 12 */}
        <Section12Cover number={109} />
        <Stage12Roadmap number={110} />
        <TheMetricsProblem number={111} />
        <LockBasedDesign number={112} />
        <AtomicsIntro number={113} />
        <MemoryHierarchy number={114} />
        <InstructionOptimization number={115} />
        <MemoryModelHappensBefore number={116} />
        <MemoryOrderingRelaxed number={117} />
        <MemoryOrderingAcqRel number={118} />
        <MemoryOrderingSeqCst number={119} />
        <ConcurrentStatsDesign number={120} />
        <MESIProtocol number={121} />
        <FalseSharingBad number={122} />
        <OptimizedConcurrentStats number={123} />

        {/* Stage 13 */}
        <Section13Cover number={124} />
        <Stage13Roadmap number={125} />
        <ShutdownIntro number={126} />
        <NaiveApproach number={127} />
        <OwnershipTermination number={128} />
        <TypeStateConcept number={129} />
        <CompilerAsGuard number={130} />
        <Section13Summary number={131} />
      </HTMLFlipBook>

      <div className="controls">
        <button onClick={() => nextPrevPage('prev')}>Previous Page</button>
        <button onClick={() => nextPrevPage('next')}>Next Page</button>
      </div>
    </div>
  );
};

export default Book;
