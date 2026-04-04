import React, { useRef, useState, useCallback } from 'react';
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

const Book: React.FC = () => {
  const bookRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const onPage = useCallback((e: any) => {
    setCurrentPage(e.data);
  }, []);

  const nextPrevPage = (direction: 'next' | 'prev') => {
    if (bookRef.current) {
      if (direction === 'next') {
        bookRef.current.pageFlip().flipNext();
      } else {
        bookRef.current.pageFlip().flipPrev();
      }
    }
  };

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
      </HTMLFlipBook>

      <div className="controls">
        <button onClick={() => nextPrevPage('prev')}>Previous Page</button>
        <button onClick={() => nextPrevPage('next')}>Next Page</button>
      </div>
    </div>
  );
};

export default Book;
