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
import { Section4Cover } from './sections/section4/Index';
import { Section5Cover } from './sections/section5/Index';
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
import { Section10Cover } from './sections/section10/Index';
import { Section11Cover } from './sections/section11/Index';
import { Section12Cover } from './sections/section12/Index';
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

        {/* Stage 4 Placeholder */}
        <Section4Cover number={29} />

        {/* Stage 5 Placeholder */}
        <Section5Cover number={30} />

        {/* Stage 6 */}
        <Section6Cover number={31} />
        <Section6Intro number={32} />
        <ConcurrencyIntro number={33} />
        <CompilationError number={34} />
        <ThreadSafeWrapper number={35} />
        <RAIIGuards number={36} />
        <InnerLockingDrop number={37} />
        <TheDerefTrait number={38} />
        <TheUnwrapMystery number={39} />
        <TheBrokenGet number={40} />
        <OwnershipShift number={41} />
        <SafeCacheImpl number={42} />
        <ThreadSafeTests number={43} />

        {/* Stage 7 */}
        <Section7Cover number={44} />
        <Section7Intro number={45} />
        <TheCloningTax number={46} />
        <IntroducingArc number={47} />
        <ArcMechanics number={48} />
        <ArcInsideCache number={49} />
        <ArcDeref number={50} />
        <FinalArcImplementation number={51} />
        <ArcTests number={52} />

        {/* Stage 8 */}
        <Section8Cover number={53} />
        <Stage8Roadmap number={54} />
        <Section8Intro number={55} />
        <CustomRefPattern number={56} />
        <LifetimeAnchor number={57} />
        <ThePointerTrick number={58} />
        <UnsafeDeref number={59} />
        <LockTradeoff number={60} />
        <ZeroCopyTests number={61} />
        <Section8Summary number={62} />

        {/* Stage 9 */}
        <Section9Cover number={63} />
        <Stage9Roadmap number={64} />
        <BeyondScope number={65} />
        <TheOwnershipWall number={66} />
        <FoundationOfConcurrency number={67} />
        <SharedCacheArc number={68} />
        <SendAndSync number={69} />
        <FinalVerification number={70} />

        {/* Placeholders for 10, 11, 12 */}
        <Section10Cover number={71} />
        <Section11Cover number={72} />
        <Section12Cover number={73} />

        {/* Stage 13 */}
        <Section13Cover number={74} />
        <Stage13Roadmap number={75} />
        <ShutdownIntro number={76} />
        <NaiveApproach number={77} />
        <OwnershipTermination number={78} />
        <TypeStateConcept number={79} />
        <CompilerAsGuard number={80} />
        <Section13Summary number={81} />
      </HTMLFlipBook>

      <div className="controls">
        <button onClick={() => nextPrevPage('prev')}>Previous Page</button>
        <button onClick={() => nextPrevPage('next')}>Next Page</button>
      </div>
    </div>
  );
};

export default Book;
