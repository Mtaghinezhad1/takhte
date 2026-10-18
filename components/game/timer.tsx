import useGameStore from '@/stores/useGameStore';
import { CoachmarkAnchor } from '@edwardloopez/react-native-coachmark';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text } from 'react-native';

export default function Timer() {
    const currentTurn = useGameStore(state => state.currentTurn);
    const gameWinner = useGameStore(state => state.gameWinner);
    const isModalVisible = useGameStore(state => state.isModalVisible);
    const isMatchEndModalVisible = useGameStore(state => state.isMatchEndModalVisible);
    const targetScore = useGameStore(state => state.targetScore);
    const handleTimeEnd = useGameStore(state => state.handleTimeEnd);

    const TURN_TIME = 15;
    const initialTotalTime = targetScore * 60;

    const [turnTime, setTurnTime] = useState(TURN_TIME);
    const [blackTotalTime, setBlackTotalTime] = useState(initialTotalTime);
    const [whiteTotalTime, setWhiteTotalTime] = useState(initialTotalTime);
    const [isTurnTimeActive, setIsTurnTimeActive] = useState(true);

    const intervalRef = useRef(null);
    const timeEndedRef = useRef(false);

    // ۱. مدیریت اینتروال (فقط کاهش زمان - بدون هیچ Side Effect)
    useEffect(() => {
        if (gameWinner || isModalVisible || isMatchEndModalVisible) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            return;
        }

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        timeEndedRef.current = false;

        intervalRef.current = setInterval(() => {
            if (isTurnTimeActive) {
                setTurnTime(prev => {
                    if (prev <= 1) return 0; // فقط مقدار را صفر می‌کنیم
                    return prev - 1;
                });
            } else {
                if (currentTurn === 'black') {
                    setBlackTotalTime(prev => {
                        if (prev <= 1) return 0;
                        return prev - 1;
                    });
                } else {
                    setWhiteTotalTime(prev => {
                        if (prev <= 1) return 0;
                        return prev - 1;
                    });
                }
            }
        }, 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [currentTurn, isTurnTimeActive, gameWinner, isModalVisible, isMatchEndModalVisible]);

    // ۲. مدیریت پایان زمان (Side Effect - جدا شده از آپدیت State)
    useEffect(() => {
        if (isTurnTimeActive) {
            // اگر زمان نوبت تمام شد، به فاز زمان کل می‌رویم
            if (turnTime === 0) {
                setIsTurnTimeActive(false);
            }
        } else {
            // اگر زمان کل تمام شد، تابع پایان بازی را صدا می‌زنیم
            if (currentTurn === 'black' && blackTotalTime === 0 && !timeEndedRef.current) {
                timeEndedRef.current = true;
                handleTimeEnd('black');
            } else if (currentTurn === 'white' && whiteTotalTime === 0 && !timeEndedRef.current) {
                timeEndedRef.current = true;
                handleTimeEnd('white');
            }
        }
    }, [turnTime, blackTotalTime, whiteTotalTime, isTurnTimeActive, currentTurn, handleTimeEnd]);

    // ۳. ریست کردن زمان نوبت هنگام تغییر نوبت
    useEffect(() => {
        setTurnTime(TURN_TIME);
        setIsTurnTimeActive(true);
        timeEndedRef.current = false;
    }, [currentTurn]);

    // ۴. ریست کردن کل تایمر هنگام پایان بازی یا بسته شدن مودال‌ها
    useEffect(() => {
        if (!gameWinner && !isModalVisible && !isMatchEndModalVisible) {
            setBlackTotalTime(initialTotalTime);
            setWhiteTotalTime(initialTotalTime);
            setTurnTime(TURN_TIME);
            setIsTurnTimeActive(true);
            timeEndedRef.current = false;
        }
    }, [gameWinner, isModalVisible, isMatchEndModalVisible, initialTotalTime]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <CoachmarkAnchor style={styles.timeContainer} id="timer" shape="circle" padding={16}>
            <Text style={styles.totalTime}>
                {formatTime(blackTotalTime)}
            </Text>
            <Text style={styles.time}>
                {turnTime}
            </Text>
            <Text style={styles.totalTime}>
                {formatTime(whiteTotalTime)}
            </Text>
        </CoachmarkAnchor>
    );
}

const styles = StyleSheet.create({
    timeContainer: {
        backgroundColor: '#3e7ced',
        borderRadius: 3,
        width: '80%',
        padding: '2%',
        alignItems: 'center',
    },
    totalTime: {
        color: 'white',
        fontFamily: 'Kaghaz',
    },
    time: {
        backgroundColor: 'white',
        fontFamily: 'Kaghaz',
        width: '90%',
        textAlign: 'center',
        color: 'black',
        borderRadius: 3,
        padding: '10%'
    }
});