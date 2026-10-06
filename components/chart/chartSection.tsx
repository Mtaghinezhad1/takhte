// components/ChartSection.tsx
import useThemeStore from '@/stores/useThemeStore';
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

type ChartSectionProps = {
    data: number[];
};

const ChartSection = ({ data }: ChartSectionProps) => {
    const { colors } = useThemeStore();

    // محاسبه رنگ‌ها بر اساس تغییرات
    const getColor = (opacity = 1) => {
        if (data.length > 1) {
            const first = data[0];
            const last = data[data.length - 1];
            if (last > first) {
                return `rgba(76, 175, 80, ${opacity})`; // سبز
            } else if (last < first) {
                return `rgba(255, 107, 107, ${opacity})`; // قرمز
            }
        }
        return `rgba(255, 215, 0, ${opacity})`; // طلایی
    };

    return (
        <LinearGradient
            colors={[colors.profileBgPrimary, colors.profileBgSecondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{  alignItems: 'center', borderRadius: 16, marginTop: 16, borderWidth: 1, borderColor: colors.border }}
        >
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 , color: colors.text}}>
                📊 تاریخچه توانایی (Elo)
            </Text>
            <Text style={{ fontSize: 14, color: '#aaa', marginBottom: 16 }}>
                {data.length} بازی اخیر
            </Text>
            <LineChart
                data={{
                    datasets: [{
                        data: data,
                        color: (opacity = 1) => getColor(opacity),
                        strokeWidth: 3
                    }],
                    labels: data.map((_, index) => {
                        // نمایش برچسب‌های کمتر برای خوانایی بهتر
                        if (index % 5 === 0 || index === data.length - 1) {
                            return `${index + 1}`;
                        }
                        return '';
                    })
                }}
                width={screenWidth - 32}
                height={300}
                chartConfig={{
                    backgroundColor: '#1E1E2E',
                    backgroundGradientFrom: colors.profileBgPrimary,
                    backgroundGradientTo: colors.profileBgSecondary,
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
        </LinearGradient>
    );
};

export default ChartSection;