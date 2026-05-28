
import useGameStore from '@/stores/useGameStore';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Timer({ initialTotalTime = 30 }) {
    const currentTurn = useGameStore(state => state.currentTurn);
    const gameWinner = useGameStore(state => state.gameWinner);
    const isModalVisible = useGameStore(state => state.isModalVisible);
    
    // اضافه کردن توابع مورد نیاز از store
    const handleTimeEnd = useGameStore(state => state.handleTimeEnd);
    const gameScore = useGameStore(state => state.gameScore);

    const TURN_TIME = 15;
    
    const [turnTime, setTurnTime] = useState(TURN_TIME);
    const [blackTotalTime, setBlackTotalTime] = useState(initialTotalTime);
    const [whiteTotalTime, setWhiteTotalTime] = useState(initialTotalTime);
    const [isTurnTimeActive, setIsTurnTimeActive] = useState(true);
    
    const intervalRef = useRef(null);
    const timeEndedRef = useRef(false);

    useEffect(() => {
        // اگر بازی تموم شده، تایمر رو متوقف کن
        if (gameWinner || isModalVisible) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            return;
        }

        // پاک کردن تایمر قبلی
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        // ریست فلگ پایان زمان
        timeEndedRef.current = false;

        // شروع تایمر جدید
        intervalRef.current = setInterval(() => {
            if (isTurnTimeActive) {
                setTurnTime(prev => {
                    if (prev <= 1) {
                        setIsTurnTimeActive(false);
                        return 0;
                    }
                    return prev - 1;
                });
            } else {
                if (currentTurn === 'black') {
                    setBlackTotalTime(prev => {
                        if (prev <= 1 && !timeEndedRef.current) {
                            timeEndedRef.current = true;
                            // فراخوانی تابع پایان زمان
                            handleTimeEnd('black');
                            return 0;
                        }
                        return prev - 1;
                    });
                } else {
                    setWhiteTotalTime(prev => {
                        if (prev <= 1 && !timeEndedRef.current) {
                            timeEndedRef.current = true;
                            // فراخوانی تابع پایان زمان
                            handleTimeEnd('white');
                            return 0;
                        }
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
    }, [currentTurn, isTurnTimeActive, gameWinner, isModalVisible]);

    // ریست تایمر نوبت وقتی currentTurn تغییر می‌کنه
    useEffect(() => {
        setTurnTime(TURN_TIME);
        setIsTurnTimeActive(true);
        timeEndedRef.current = false;
    }, [currentTurn]);

    // ریست تایمرها وقتی بازی جدید شروع میشه
    useEffect(() => {
        if (!gameWinner && !isModalVisible) {
            setBlackTotalTime(initialTotalTime);
            setWhiteTotalTime(initialTotalTime);
            setTurnTime(TURN_TIME);
            setIsTurnTimeActive(true);
            timeEndedRef.current = false;
        }
    }, [gameWinner]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <View style={styles.timeContainer}>
            <Text style={styles.totalTime}>
                {formatTime(blackTotalTime)}
            </Text>
            <Text style={styles.time}>
                {turnTime}
            </Text>
            <Text style={styles.totalTime}>
                {formatTime(whiteTotalTime)}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    timeContainer: {
        backgroundColor: 'rgba(42, 68, 254, 1.00)',
        borderRadius: 3,
        width: '80%',
        padding: '2%',
        alignItems: 'center'
    },
    totalTime: {
        color: 'white'
    },
    time: {
        backgroundColor: 'white',
        width: '90%',
        textAlign: 'center',
        color: 'black',
        borderRadius: 3,
        padding: '10%'
    }
});