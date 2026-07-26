import useUserStore from '@/stores/useUserStore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const CustomChart = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [eloData, setEloData] = useState([]);
    const { getEloHistory } = useUserStore();

    useEffect(() => {
        const loadEloData = async () => {
            try {
                const history = await getEloHistory();
                // فقط مقادیر Elo را استخراج می‌کنیم
                const eloValues = history.map(record => record.elo);
                setEloData(eloValues);
            } catch (error) {
                console.error('خطا در دریافت تاریخچه Elo:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadEloData();
    }, []);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                <ActivityIndicator size="large" color="#FFD700" />
                <Text style={{ marginTop: 10, color: 'white' }}>در حال بارگذاری تاریخچه Elo...</Text>
            </View>
        );
    }

    // اگر داده‌ای وجود نداشت، پیام نمایش داده شود
    if (eloData.length === 0) {
        return (
            <View style={{ padding: 20, alignItems: 'center' }}>
                <Text style={{ color: 'white', fontSize: 16 }}>
                    هنوز هیچ بازی انجام نداده‌اید
                </Text>
            </View>
        );
    }

    // محاسبه آمار
    const average = Math.round(eloData.reduce((a, b) => a + b, 0) / eloData.length);
    const maxElo = Math.max(...eloData);
    const minElo = Math.min(...eloData);
    const currentElo = eloData[eloData.length - 1];

    // آماده‌سازی داده برای نمودار (نمایش ۵۰ بازی آخر)
    const displayData = eloData.slice(-50);

    // محاسبه رنگ‌ها بر اساس تغییرات
    const getColor = (opacity = 1) => {
        // اگر آخرین Elo بیشتر از اولین Elo باشد، سبز نشان می‌دهیم در غیر این صورت قرمز
        if (displayData.length > 1) {
            const first = displayData[0];
            const last = displayData[displayData.length - 1];
            if (last > first) {
                return `rgba(76, 175, 80, ${opacity})`; // سبز
            } else if (last < first) {
                return `rgba(255, 107, 107, ${opacity})`; // قرمز
            }
        }
        return `rgba(255, 215, 0, ${opacity})`; // طلایی
    };

    return (
        <ScrollView>
            <View style={{ paddingVertical: 50, paddingHorizontal: 16, alignItems: 'center' }}>


                <View style={{ backgroundColor: '#1E1E2E', alignItems: 'center', borderRadius: 16 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8, color: 'white' }}>
                        📊 تاریخچه توانایی (Elo)
                    </Text>
                    <Text style={{ fontSize: 14, color: '#aaa', marginBottom: 16 }}>
                        {displayData.length} بازی اخیر
                    </Text>
                    <LineChart
                        data={{
                            datasets: [{
                                data: displayData,
                                color: (opacity = 1) => getColor(opacity),
                                strokeWidth: 3
                            }],
                            labels: displayData.map((_, index) => {
                                // نمایش برچسب‌های کمتر برای خوانایی بهتر
                                if (index % 5 === 0 || index === displayData.length - 1) {
                                    return `${index + 1}`;
                                }
                                return '';
                            })
                        }}
                        width={screenWidth - 32}
                        height={300}
                        chartConfig={{
                            backgroundColor: '#1E1E2E',
                            backgroundGradientFrom: '#2D2D44',
                            backgroundGradientTo: '#1A1A2E',
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            style: { borderRadius: 16 },
                            formatYLabel: (value) => `${value}`,
                            propsForLabels: {
                                fontSize: 10
                            }
                        }}
                        bezier
                        withDots={true}
                        withVerticalLines={false}
                        style={{
                            marginVertical: 8,
                            borderRadius: 16
                        }}
                        onDataPointClick={({ value, index }) => {
                            console.log(`بازی ${index + 1}: ${value} امتیاز Elo`);
                        }}
                    />
                </View>


                <View style={{
                    marginTop: 20,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    width: '100%',
                    flexWrap: 'wrap',
                    gap: 10
                }}>
                    <View style={{ alignItems: 'center', backgroundColor: '#2D2D44', padding: 10, borderRadius: 10, minWidth: 80 }}>
                        <Text style={{ color: 'gray', fontSize: 12 }}>میانگین</Text>
                        <Text style={{ fontWeight: 'bold', color: 'white' }}>
                            {average}
                        </Text>
                    </View>
                    <View style={{ alignItems: 'center', backgroundColor: '#2D2D44', padding: 10, borderRadius: 10, minWidth: 80 }}>
                        <Text style={{ color: 'gray', fontSize: 12 }}>بالاترین</Text>
                        <Text style={{ fontWeight: 'bold', color: '#4CAF50' }}>
                            {maxElo}
                        </Text>
                    </View>
                    <View style={{ alignItems: 'center', backgroundColor: '#2D2D44', padding: 10, borderRadius: 10, minWidth: 80 }}>
                        <Text style={{ color: 'gray', fontSize: 12 }}>کمترین</Text>
                        <Text style={{ fontWeight: 'bold', color: '#FF6B6B' }}>
                            {minElo}
                        </Text>
                    </View>
                    <View style={{ alignItems: 'center', backgroundColor: '#2D2D44', padding: 10, borderRadius: 10, minWidth: 80 }}>
                        <Text style={{ color: 'gray', fontSize: 12 }}>فعلی</Text>
                        <Text style={{ fontWeight: 'bold', color: '#FFD700' }}>
                            {currentElo}
                        </Text>
                    </View>
                </View>

                {/* نمایش تغییرات کلی */}
                {displayData.length > 1 && (
                    <View style={{
                        marginTop: 15,
                        padding: 10,
                        backgroundColor: '#2D2D44',
                        borderRadius: 10,
                        width: '100%',
                        alignItems: 'center'
                    }}>
                        <Text style={{ color: '#aaa', fontSize: 12 }}>
                            تغییر کل:
                            <Text style={{
                                color: displayData[displayData.length - 1] > displayData[0] ? '#4CAF50' : '#FF6B6B',
                                fontWeight: 'bold',
                                fontSize: 14
                            }}>
                                {' '}
                                {displayData[displayData.length - 1] - displayData[0] > 0 ? '+' : ''}
                                {displayData[displayData.length - 1] - displayData[0]}
                            </Text>
                        </Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

export default CustomChart;