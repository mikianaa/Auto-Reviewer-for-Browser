import { useEffect, useState, forwardRef, useImperativeHandle, useRef } from "react";
import { useReview } from "../hooks/useReview";
import { Loader } from "./Loader";
import { TextWithAnnotations } from "./TextWithAnnotations";
import { CommentPanel } from "./CommentPanel";
import type { Review } from "../types/review";
import type { Persona } from "../types/persona";
import type { Annotation } from "../types/anotation";

interface PersonaReviewTabProps {
    persona: Persona;
    initialReview: Review | null;
    originalSelectedText: string;
    isVisible: boolean;
    activeAnnotationIndex: number | undefined;
    setActiveAnnotationIndex: (index: number | undefined) => void;
    onReviewStart?: () => void;
    onReviewComplete?: () => void;
}

export interface PersonaReviewTabRef {
    handleReReview: () => void;
    isLoading: boolean;
    reviewData: Review | null;
}

export const PersonaReviewTab = forwardRef<PersonaReviewTabRef, PersonaReviewTabProps>(({
    persona,
    initialReview,
    originalSelectedText,
    isVisible,
    activeAnnotationIndex,
    setActiveAnnotationIndex,
    onReviewStart,
    onReviewComplete
}, ref) => {
    const { addReview } = useReview();
    const [reviewState, setReviewState] = useState<'initial' | 'loading' | 'completed' | 're-reviewing'>('initial');
    const [reviewData, setReviewData] = useState<Review | null>(initialReview);
    const operationIdRef = useRef(0);

    useEffect(() => {
        if (isVisible && reviewState === 'initial') {
            startReview('initial');
        }
    }, [isVisible, reviewState]);

    const startReview = (type: 'initial' | 're-review') => {
        const currentOperationId = ++operationIdRef.current;

        setReviewState(type === 'initial' ? 'loading' : 're-reviewing');
        onReviewStart?.();

        (async () => {
            try {
                const newReview = await addReview(originalSelectedText, persona);

                if (operationIdRef.current === currentOperationId) {
                    setReviewData(newReview);
                    setReviewState('completed');
                    onReviewComplete?.();
                }
            } catch (error) {
                console.error('Review failed:', error);
                if (operationIdRef.current === currentOperationId) {
                    setReviewState('initial');
                }
            }
        })();
    };

    const handleReReview = () => {
        startReview('re-review');
    };

    useImperativeHandle(ref, () => ({
        handleReReview,
        isLoading: reviewState === 'loading' || reviewState === 're-reviewing',
        reviewData
    }));

    const currentReview = reviewData || initialReview;
    const annotations: Annotation[] = currentReview?.annotations || [];
    const isLoadingState = reviewState === 'loading' || reviewState === 're-reviewing';

    if (!isVisible) return null;

    if (isLoadingState) {
        return (
            <div className="detail-loader">
                <Loader />
                <p>{reviewState === 're-reviewing' ? '再レビュー中...' : 'レビュー中...'}</p>
            </div>
        );
    }

    if (!currentReview) {
        return (
            <div className="detail-error-center">
                レビューデータがありません
            </div>
        );
    }

    return (
        <div className="detail-review-columns">
            <section className="detail-block detail-left-panel">
                <p className="detail-label">選択テキスト</p>
                <div className="detail-annotated-text">
                    <TextWithAnnotations
                        text={currentReview.selectedText}
                        annotations={annotations}
                        activeIndex={activeAnnotationIndex}
                        onAnnotationClick={setActiveAnnotationIndex}
                    />
                </div>
            </section>
            <section className="detail-block detail-right-panel">
                <CommentPanel
                    comment={activeAnnotationIndex !== undefined ? annotations[activeAnnotationIndex]?.comment : undefined}
                />
            </section>
        </div>
    );
}); 