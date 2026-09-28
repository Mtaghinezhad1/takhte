// components/StatSection.tsx
import { Text, View } from 'react-native';

type StatSectionProps = {
    average: number;
    maxElo: number;
    minElo: number;
    currentElo: number;
    data: number[];
};

const StatCard = ({ label, value, color }: { label: string; value: number; color: string }) => (
    <View style={{
        alignItems: 'center',
        backgroundColor: '#2D2D44',
        padding: 10,
        borderRadius: 10,
        minWidth: 80
    }}>
        <Text style={{ color: 'gray', fontSize: 12 }}>{label}</Text>
        <Text style={{ fontWeight: 'bold', color }}>{value}</Text>
    </View>
);

const StatSection = ({ average, maxElo, minElo, currentElo, data }: StatSectionProps) => {
    const totalChange = data.length > 1 ? data[data.length - 1] - data[0] : 0;

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
                <StatCard label="میانگین" value={average} color="white" />
                <StatCard label="بالاترین" value={maxElo} color="#4CAF50" />
                <StatCard label="کمترین" value={minElo} color="#FF6B6B" />
                <StatCard label="فعلی" value={currentElo} color="#FFD700" />
            </View>

            {/* نمایش تغییرات کلی */}
            {data.length > 1 && (
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
                            color: totalChange > 0 ? '#4CAF50' : '#FF6B6B',
                            fontWeight: 'bold',
                            fontSize: 14
                        }}>
                            {' '}
                            {totalChange > 0 ? '+' : ''}
                            {totalChange}
                        </Text>
                    </Text>
                </View>
            )}
        </>
    );
};

export default StatSection;