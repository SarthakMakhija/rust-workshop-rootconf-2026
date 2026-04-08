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
  OwnershipHierarchy,
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
        <OwnershipHierarchy number={13} />
        <AllocationProblem number={14} />
        <StringTypes number={15} />
        <OptimizedCache number={16} />

        {/* Section 2 */}
        <Section2Cover number={17} />
        <Section2Intro number={18} />
        <Section2Roadmap number={19} />
        <PrimitiveObsession number={20} />
        <NewTypePattern number={21} />
        <DerivingTraits number={22} />
        <TypeSafeCache number={23} />
        <SafetyVerification number={24} />
        <VerbosityProblem number={25} />
        <ErgonomicConversions number={26} />
        <ErgonomicAssertions number={27} />

        {/* Section 3 */}
        <Section3Cover number={28} />
        <Section3Intro number={29} />
        <IntroducingGenerics number={30} />
        <TraitBounds number={31} />
        <GenericSyntax number={32} />
        <TheBorrowTrait number={33} />
        <GenericCacheImpl number={34} />
        <GenericTests number={35} />

        {/* Stage 4 */}
        <Section4Cover number={36} />
        <Stage4Roadmap number={37} />
        <IntroduceGetMut number={38} />
        <MutableScopeProblem number={39} />
        <AliasMutationError number={40} />
        <TheUpdateMethod number={41} />
        <UpdateImplCode number={42} />
        <UpdateTests number={43} />
        <MultipleUpdatesScope number={44} />
        <ClosureTraits number={45} />
        <InteriorMutabilityPath number={46} />

        {/* Stage 5 */}
        <Section5Cover number={47} />
        <Stage5Roadmap number={48} />
        <TheEntryStruct number={49} />
        <RefCellMethods number={50} />
        <CacheIntegration number={51} />
        <RuntimeBorrowProblem number={52} />
        <RuntimePanicError number={53} />

        {/* Stage 6 */}
        <Section6Cover number={54} />
        <Section6Intro number={55} />
        <ConcurrencyIntro number={56} />
        <CompilationError number={57} />
        <ThreadSafeWrapper number={58} />
        <RAIIGuards number={59} />
        <InnerLockingDrop number={60} />
        <TheDerefTrait number={61} />
        <TheUnwrapMystery number={62} />
        <TheBrokenGet number={63} />
        <OwnershipShift number={64} />
        <SafeCacheImpl number={65} />
        <ThreadSafeTests number={66} />

        {/* Stage 7 */}
        <Section7Cover number={67} />
        <Section7Intro number={68} />
        <TheCloningTax number={69} />
        <IntroducingArc number={70} />
        <ArcMechanics number={71} />
        <ArcInsideCache number={72} />
        <ArcDeref number={73} />
        <FinalArcImplementation number={74} />
        <ArcTests number={75} />

        {/* Stage 8 */}
        <Section8Cover number={76} />
        <Stage8Roadmap number={77} />
        <Section8Intro number={78} />
        <CustomRefPattern number={79} />
        <LifetimeAnchor number={80} />
        <ThePointerTrick number={81} />
        <UnsafeDeref number={82} />
        <LockTradeoff number={83} />
        <ZeroCopyTests number={84} />
        <Section8Summary number={85} />

        {/* Stage 9 */}
        <Section9Cover number={86} />
        <Stage9Roadmap number={87} />
        <BeyondScope number={88} />
        <TheOwnershipWall number={89} />
        <FoundationOfConcurrency number={90} />
        <SharedCacheArc number={91} />
        <SendAndSync number={92} />
        <FinalVerification number={93} />

        {/* Stage 10 */}
        <Section10Cover number={94} />
        <Stage10Roadmap number={95} />
        <LockContentionIntro number={96} />
        <ShardingDesign number={97} />
        <TheShardedStruct number={98} />
        <HashingAndIndexing number={99} />
        <ShardedImplementation number={100} />
        <ShardedAccess number={101} />
        <ShardedVerification number={102} />

        {/* Stage 11 */}
        <Section11Cover number={103} />
        <Stage11Roadmap number={104} />
        <TheStaleDataProblem number={105} />
        <TheShardAbstraction number={106} />
        <ShardPutCode number={107} />
        <ShardGetLazy number={108} />
        <ZeroCopyRefTTL number={109} />
        <CacheRefactorCode number={110} />
        <ContentionManagement number={111} />
        <ShardCleanupCode number={112} />
        <BackgroundCleanerAssignment number={113} />
        <BackgroundCleanerImpl number={114} />
        <NonCooperativeCleaner number={115} />

        {/* Stage 12 */}
        <Section12Cover number={116} />
        <Stage12Roadmap number={117} />
        <TheMetricsProblem number={118} />
        <LockBasedDesign number={119} />
        <AtomicsIntro number={120} />
        <MemoryHierarchy number={121} />
        <InstructionOptimization number={122} />
        <MemoryModelHappensBefore number={123} />
        <MemoryOrderingRelaxed number={124} />
        <MemoryOrderingAcqRel number={125} />
        <MemoryOrderingSeqCst number={126} />
        <ConcurrentStatsDesign number={127} />
        <MESIProtocol number={128} />
        <FalseSharingBad number={129} />
        <OptimizedConcurrentStats number={130} />

        {/* Stage 13 */}
        <Section13Cover number={131} />
        <Stage13Roadmap number={132} />
        <ShutdownIntro number={133} />
        <NaiveApproach number={134} />
        <OwnershipTermination number={135} />
        <TypeStateConcept number={136} />
        <CompilerAsGuard number={137} />
        <TypeStateLimitations number={138} />
        <HandleBodyPattern number={139} />
        <HandleBodyImplementation number={140} />
        <ImplementingShutdown number={141} />
        <CleanerExitLogic number={142} />
        <ShutdownVerification number={143} />

        {/* Stage 14 */}
        <Section14Cover number={144} />
        <Stage14Roadmap number={145} />
        <TheBuilderPattern number={146} />
        <CacheBuilderImpl number={147} />
        <IntegrationTestingIntro number={148} />
        <CacheIntegrationTest number={149} />
        <WorkshopConclusion number={150} />

      </HTMLFlipBook>

      <div className="controls">
        <button onClick={() => nextPrevPage('prev')}>Previous Page</button>
        <button onClick={() => nextPrevPage('next')}>Next Page</button>
      </div>
    </div>
  );
};

export default Book;
