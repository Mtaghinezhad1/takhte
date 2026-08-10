import useTourStore from '@/stores/useTourStore';
import { useCallback, useEffect, useRef, useState } from 'react';
import { I18nManager, useWindowDimensions } from 'react-native';

export const useTour = (tourId, steps = [], options = {}) => {
    const {
        autoStart = true,
        onComplete = () => { },
        onStepChange = () => { },
        delay = 500,
        enableSkip = true,
        rtlAdjust = true,
    } = options;

    const store = useTourStore();
    const { width: screenWidth, height: screenHeight } = useWindowDimensions();
    const [positions, setPositions] = useState({});
    const [isReady, setIsReady] = useState(false);
    const mountedRef = useRef(true);
    const hasStartedRef = useRef(false);
    const abortControllerRef = useRef(null);
    const measureTimeoutRef = useRef(null);

    // گرفتن وضعیت از store
    const isCompleted = store.isTourCompleted(tourId);
    const currentStep = store.getCurrentStep(tourId);
    const isVisible = store.activeTour === tourId && store.isTourVisible;
    const isLoading = store.isLoading;

    // تنظیم موقعیت با در نظر گرفتن RTL
    const adjustPositionForRTL = useCallback((position) => {
        if (!position) return null;

        let adjusted = { ...position };

        if (rtlAdjust && I18nManager.isRTL) {
            adjusted = {
                x: screenWidth - position.x,
                y: position.y,
            };
        }

        // اطمینان از اینکه موقعیت خارج از صفحه نباشد
        const margin = 40;
        adjusted.x = Math.max(margin, Math.min(screenWidth - margin, adjusted.x));
        adjusted.y = Math.max(margin, Math.min(screenHeight - margin, adjusted.y));

        return adjusted;
    }, [screenWidth, screenHeight, rtlAdjust]);

    // تنظیم موقعیت
    const setTargetPosition = useCallback((target, position) => {
        if (!mountedRef.current) return;
        if (!position) return;

        const adjustedPosition = adjustPositionForRTL(position);
        setPositions(prev => ({
            ...prev,
            [target]: adjustedPosition || position,
        }));
    }, [adjustPositionForRTL]);

    // گرفتن موقعیت استپ فعلی
    const getStepPositions = useCallback(() => {
        const step = steps[currentStep];
        if (!step) return null;

        const targetKey = typeof step.target === 'function'
            ? step.target()
            : step.target;

        const position = positions[targetKey];
        return position ? adjustPositionForRTL(position) : null;
    }, [currentStep, steps, positions, adjustPositionForRTL]);

    // شروع تور
    const startTour = useCallback(() => {
        try {
            if (!isCompleted && !isVisible && !hasStartedRef.current && mountedRef.current) {
                hasStartedRef.current = true;
                store.initializeTour(tourId);
            }
        } catch (error) {
            console.error('Failed to start tour:', error);
        }
    }, [isCompleted, isVisible, tourId, store]);

    // مرحله بعد
    const nextStep = useCallback(() => {
        try {
            if (currentStep < steps.length - 1) {
                store.nextStep(tourId);
                onStepChange(currentStep + 1);
                // ری‌اندازه‌گیری موقعیت‌ها
                setIsReady(false);
                setTimeout(() => {
                    if (mountedRef.current) {
                        setIsReady(true);
                    }
                }, 100);
            } else {
                completeTour();
            }
        } catch (error) {
            console.error('Error in nextStep:', error);
        }
    }, [currentStep, steps.length, tourId, store, onStepChange]);

    // مرحله قبل
    const previousStep = useCallback(() => {
        try {
            if (currentStep > 0) {
                store.previousStep(tourId);
                onStepChange(currentStep - 1);
                setIsReady(false);
                setTimeout(() => {
                    if (mountedRef.current) {
                        setIsReady(true);
                    }
                }, 100);
            }
        } catch (error) {
            console.error('Error in previousStep:', error);
        }
    }, [currentStep, tourId, store, onStepChange]);

    // کامل کردن تور
    const completeTour = useCallback(() => {
        try {
            store.completeTour(tourId);
            onComplete();
        } catch (error) {
            console.error('Failed to complete tour:', error);
        }
    }, [tourId, store, onComplete]);

    // بستن تور
    const closeTour = useCallback(() => {
        store.closeTour();
    }, [store]);

    // ریست تور
    const resetTour = useCallback(() => {
        hasStartedRef.current = false;
        store.resetTour(tourId);
    }, [tourId, store]);

    // Skip تور
    const skipTour = useCallback(() => {
        if (enableSkip) {
            completeTour();
        }
    }, [enableSkip, completeTour]);

    // شروع خودکار
    useEffect(() => {
        if (!isLoading && autoStart && !isCompleted && mountedRef.current && !hasStartedRef.current) {
            abortControllerRef.current = new AbortController();

            const timer = setTimeout(() => {
                if (mountedRef.current && !abortControllerRef.current?.signal.aborted) {
                    startTour();
                }
            }, delay);

            return () => {
                clearTimeout(timer);
                if (abortControllerRef.current) {
                    abortControllerRef.current.abort();
                }
            };
        }
    }, [isLoading, autoStart, isCompleted, startTour, delay]);

    // آماده‌سازی
    useEffect(() => {
        if (!isLoading && isVisible && steps.length > 0) {
            const timer = setTimeout(() => {
                if (mountedRef.current) {
                    setIsReady(true);
                }
            }, 200);
            return () => clearTimeout(timer);
        }
    }, [isLoading, isVisible, steps.length]);

    // پاکسازی
    useEffect(() => {
        return () => {
            mountedRef.current = false;
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            if (measureTimeoutRef.current) {
                clearTimeout(measureTimeoutRef.current);
            }
        };
    }, []);

    const currentStepData = steps[currentStep] || null;
    const targetPosition = getStepPositions();

    return {
        // وضعیت
        isVisible,
        isCompleted,
        currentStep,
        totalSteps: steps.length,
        isReady,
        isLoading,
        positions,
        hasStarted: hasStartedRef.current,
        error: store.error,

        // داده‌های استپ فعلی
        currentStepData,
        targetPosition,

        // اکشن‌ها
        startTour,
        nextStep,
        previousStep,
        completeTour,
        closeTour,
        resetTour,
        skipTour,
        setTargetPosition,

        // وضعیت‌های کمکی
        isFirstStep: currentStep === 0,
        isLastStep: currentStep === steps.length - 1,
        canSkip: enableSkip,
    };
};