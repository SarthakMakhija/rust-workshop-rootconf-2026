import React, { useRef, useState, useCallback, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { 
  WorkshopCover,
  Stage1Cover, 
  Intro, 
  Stage1Roadmap,
  BasicCache, 
  Operations, 
  References,
  StructTypes,
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
  SafetyVerification,
  VerbosityProblem,
  ErgonomicConversions,
  ErgonomicAssertions
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
  TypeStateLimitations,
  HandleBodyPattern,
  HandleBodyImplementation,
  ImplementingShutdown,
  CleanerExitLogic,
  ShutdownVerification
} from './sections/section13/Index';
import { TOCLeft, TOCRight } from './sections/TOC';
import {
  Section14Cover,
  Stage14Roadmap,
  TheBuilderPattern,
  CacheBuilderImpl,
  IntegrationTestingIntro,
  CacheIntegrationTest,
  WorkshopConclusion
} from './sections/section14/Index';

const Book: React.FC = () => {
  const bookRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const onInit = useCallback(() => {
    // Small delay to ensure layout has settled
    setTimeout(() => setIsReady(true), 150);
  }, []);

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
    <div className={`book-container ${isReady ? 'ready' : 'loading'}`}>
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
        onInit={onInit}
        className="flip-book"
        ref={bookRef}
      >
        {/* Overall Cover */}
        <WorkshopCover />
        <TOCLeft number={1} />
        <TOCRight number={2} />

        {/* Section 1 */}
        <Stage1Cover number={3} />
        <Intro number={4} />
        <Stage1Roadmap number={5} />
        <BasicCache number={6} />
        <Operations number={7} />
        <References number={8} />
        <StructTypes number={9} />
        <MethodReceivers number={10} />
        <StringLayout number={11} />
        <OwnershipDetails number={12} />
        <AllocationProblem number={13} />
        <StringTypes number={14} />
        <OptimizedCache number={15} />

        {/* Section 2 */}
        <Section2Cover number={16} />
        <Section2Intro number={17} />
        <Section2Roadmap number={18} />
        <PrimitiveObsession number={19} />
        <NewTypePattern number={20} />
        <DerivingTraits number={21} />
        <TypeSafeCache number={22} />
        <SafetyVerification number={23} />
        <VerbosityProblem number={24} />
        <ErgonomicConversions number={25} />
        <ErgonomicAssertions number={26} />

        {/* Section 3 */}
        <Section3Cover number={27} />
        <Section3Intro number={28} />
        <IntroducingGenerics number={29} />
        <TraitBounds number={30} />
        <GenericSyntax number={31} />
        <TheBorrowTrait number={32} />
        <GenericCacheImpl number={33} />
        <GenericTests number={34} />

        {/* Stage 4 */}
        <Section4Cover number={35} />
        <Stage4Roadmap number={36} />
        <IntroduceGetMut number={37} />
        <MutableScopeProblem number={38} />
        <AliasMutationError number={39} />
        <TheUpdateMethod number={40} />
        <UpdateImplCode number={41} />
        <UpdateTests number={42} />
        <MultipleUpdatesScope number={43} />
        <ClosureTraits number={44} />
        <InteriorMutabilityPath number={45} />

        {/* Stage 5 */}
        <Section5Cover number={46} />
        <Stage5Roadmap number={47} />
        <TheEntryStruct number={48} />
        <RefCellMethods number={49} />
        <CacheIntegration number={50} />
        <RuntimeBorrowProblem number={51} />
        <RuntimePanicError number={52} />

        {/* Stage 6 */}
        <Section6Cover number={53} />
        <Section6Intro number={54} />
        <ConcurrencyIntro number={55} />
        <CompilationError number={56} />
        <ThreadSafeWrapper number={57} />
        <RAIIGuards number={58} />
        <InnerLockingDrop number={59} />
        <TheDerefTrait number={60} />
        <TheUnwrapMystery number={61} />
        <TheBrokenGet number={62} />
        <OwnershipShift number={63} />
        <SafeCacheImpl number={64} />
        <ThreadSafeTests number={65} />

        {/* Stage 7 */}
        <Section7Cover number={66} />
        <Section7Intro number={67} />
        <TheCloningTax number={68} />
        <IntroducingArc number={69} />
        <ArcMechanics number={70} />
        <ArcInsideCache number={71} />
        <ArcDeref number={72} />
        <FinalArcImplementation number={73} />
        <ArcTests number={74} />

        {/* Stage 8 */}
        <Section8Cover number={75} />
        <Stage8Roadmap number={76} />
        <Section8Intro number={77} />
        <CustomRefPattern number={78} />
        <LifetimeAnchor number={79} />
        <ThePointerTrick number={80} />
        <UnsafeDeref number={81} />
        <LockTradeoff number={82} />
        <ZeroCopyTests number={83} />
        <Section8Summary number={84} />

        {/* Stage 9 */}
        <Section9Cover number={85} />
        <Stage9Roadmap number={86} />
        <BeyondScope number={87} />
        <TheOwnershipWall number={88} />
        <FoundationOfConcurrency number={89} />
        <SharedCacheArc number={90} />
        <SendAndSync number={91} />
        <FinalVerification number={92} />

        {/* Stage 10 */}
        <Section10Cover number={93} />
        <Stage10Roadmap number={94} />
        <LockContentionIntro number={95} />
        <ShardingDesign number={96} />
        <TheShardedStruct number={97} />
        <HashingAndIndexing number={98} />
        <ShardedImplementation number={99} />
        <ShardedAccess number={100} />
        <ShardedVerification number={101} />

        {/* Stage 11 */}
        <Section11Cover number={102} />
        <Stage11Roadmap number={103} />
        <TheStaleDataProblem number={104} />
        <TheShardAbstraction number={105} />
        <ShardPutCode number={106} />
        <ShardGetLazy number={107} />
        <ZeroCopyRefTTL number={108} />
        <CacheRefactorCode number={109} />
        <ContentionManagement number={110} />
        <ShardCleanupCode number={111} />
        <BackgroundCleanerAssignment number={112} />
        <BackgroundCleanerImpl number={113} />
        <NonCooperativeCleaner number={114} />

        {/* Stage 12 */}
        <Section12Cover number={115} />
        <Stage12Roadmap number={116} />
        <TheMetricsProblem number={117} />
        <LockBasedDesign number={118} />
        <AtomicsIntro number={119} />
        <MemoryHierarchy number={120} />
        <InstructionOptimization number={121} />
        <MemoryModelHappensBefore number={122} />
        <MemoryOrderingRelaxed number={123} />
        <MemoryOrderingAcqRel number={124} />
        <MemoryOrderingSeqCst number={125} />
        <ConcurrentStatsDesign number={126} />
        <MESIProtocol number={127} />
        <FalseSharingBad number={128} />
        <OptimizedConcurrentStats number={129} />

        {/* Stage 13 */}
        <Section13Cover number={130} />
        <Stage13Roadmap number={131} />
        <ShutdownIntro number={132} />
        <NaiveApproach number={133} />
        <OwnershipTermination number={134} />
        <TypeStateConcept number={135} />
        <CompilerAsGuard number={136} />
        <TypeStateLimitations number={137} />
        <HandleBodyPattern number={138} />
        <HandleBodyImplementation number={139} />
        <ImplementingShutdown number={140} />
        <CleanerExitLogic number={141} />
        <ShutdownVerification number={142} />

        {/* Stage 14 */}
        <Section14Cover number={143} />
        <Stage14Roadmap number={144} />
        <TheBuilderPattern number={145} />
        <CacheBuilderImpl number={146} />
        <IntegrationTestingIntro number={147} />
        <CacheIntegrationTest number={148} />
        <WorkshopConclusion number={149} />

      </HTMLFlipBook>

      <div className="controls">
        <button onClick={() => nextPrevPage('prev')}>Previous Page</button>
        <button onClick={() => nextPrevPage('next')}>Next Page</button>
      </div>
    </div>
  );
};

export default Book;
