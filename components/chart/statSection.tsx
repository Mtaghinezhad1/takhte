// components/StatSection.tsx
import useThemeStore from '@/stores/useThemeStore';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';

type StatSectionProps = {
    average: number;
    maxElo: number;
    minElo: number;
    currentElo: number;
    data: number[];
};

const StatCard = ({ label, value, color }: { label: string; value: number; color: string }) => {
    const { colors } = useThemeStore();

    return (
        <LinearGradient
            colors={[colors.profileBgPrimary, colors.profileBgSecondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
                alignItems: 'center',
                backgroundColor: '#2D2D44',
                padding: 10,
                borderRadius: 10,
                minWidth: 80,
                borderWidth: 1,
                borderColor: colors.border
            }}
        >
            <Text style={{ color: 'gray', fontSize: 12 }}>{label}</Text>
            <Text style={{ fontWeight: 'bold', color }}>{value}</Text>
        </LinearGradient>

    );
}


const StatSection = ({ average, maxElo, minElo, currentElo, data }: StatSectionProps) => {
    const totalChange = data.length > 1 ? data[data.length - 1] - data[0] : 0;
    const { colors } = useThemeStore();

    return (
        <>
            <View style={{
                marginTop: 20,
                flexDirection: 'row',
                justifyContent: 'space-around',
                width: '100%',
                flexWrap: 'wrap',
                gap: 10
            }}>
                <StatCard label="میانگین" value={average} color={colors.text} />
                <StatCard label="بالاترین" value={maxElo} color="#4CAF50" />
                <StatCard label="کمترین" value={minElo} color="#FF6B6B" />
                <StatCard label="فعلی" value={currentElo} color="#FFD700" />
            </View>

            {/* نمایش تغییرات کلی */}
            {data.length > 1 && (
                    <LinearGradient
                        colors={[colors.profileBgPrimary, colors.profileBgSecondary]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                            marginTop: 15,
                            padding: 10,
                            backgroundColor: '#2D2D44',
                            borderRadius: 10,
                            width: '100%',
                            alignItems: 'center',
                            borderWidth: 1,
                            borderColor: 'rgba(91,139,213,0.25)'
                        }}
                    >
                    <Text style={{ color: '#aaa', fontSize: 12 }}>
                        تغییر کل:
                        <Text style={{
                            color: totalChange > 0 ? '#4CAF50' : '#FF6B6B',
                            fontWeight: 'bold',
                            fontSize: 14
                        }}>
                            {' '}
                            {totalChange > 0 ? '+' : ''}
                            {totalChange}
                        </Text>
                    </Text>
                    </LinearGradient>
            )}
        </>
    );
};

export default StatSection;