// index.tsx
import ChartSection from '@/components/chart/chartSection';
import StatSection from '@/components/chart/statSection';
import ProfileCard from '@/components/home/profileCard';
import useThemeStore from '@/stores/useThemeStore';
import useUserStore from '@/stores/useUserStore';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CustomChart = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [eloData, setEloData] = useState<number[]>([]);
    const { getEloHistory } = useUserStore();
    const { colors } = useThemeStore();

    useEffect(() => {
        const loadEloData = async () => {
            try {
                const history = await getEloHistory();
                // فقط مقادیر Elo را استخراج می‌کنیم
                const eloValues = history.map((record: { elo: number }) => record.elo);
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
            <SafeAreaView>
                <View style={{ padding: 20, alignItems: 'center' }}>
                    <Text style={{ color: colors.text, fontSize: 16 }}>
                        هنوز هیچ بازی انجام نداده‌اید
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    // محاسبه آمار
    const average = Math.round(eloData.reduce((a, b) => a + b, 0) / eloData.length);
    const maxElo = Math.max(...eloData);
    const minElo = Math.min(...eloData);
    const currentElo = eloData[eloData.length - 1];

    // آماده‌سازی داده برای نمودار (نمایش ۵۰ بازی آخر)
    const displayData = eloData.slice(-50);

    return (
        <LinearGradient
            colors={[colors.backgroundPrimary, colors.backgroundSecondary, colors.backgroundTertiary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={{ flex: 1, paddingHorizontal: 16 }}>
                <ProfileCard />
                <ChartSection data={displayData} />

                <StatSection
                    average={average}
                    maxElo={maxElo}
                    minElo={minElo}
                    currentElo={currentElo}
                    data={displayData}
                />
            </SafeAreaView>
        </LinearGradient>
    );
};

export default CustomChart;