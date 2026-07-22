import { Dimensions, ScrollView, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const CoinChart = () => {
    const coinData = [
        325, 350, 400, 320, 370, 700, 1000, 800, 1200, 1500,
        1800, 1420, 1750, 2100, 1900, 2100, 2500, 2000, 1600, 1900,
        2300, 2700, 3400, 2700, 3000, 2800, 3000, 2500, 2300, 2500
    ];

    return (
        <ScrollView>
            <View style={{ padding: 16, alignItems: 'center' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
                    📊 مقدار سکه در ۵۰ بازی آخر
                </Text>

                <LineChart
                    data={{
                        datasets: [{
                            data: coinData,
                            color: (opacity = 1) => `rgba(255, 215, 0, ${opacity})`,
                            strokeWidth: 4
                        }],
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
                        formatYLabel: (value) => `${value}`
                    }}
                    bezier
                    withDots={false}
                    withVerticalLines={false}
                    style={{
                        marginVertical: 8,
                        borderRadius: 16
                    }}
                    onDataPointClick={({ value, index }) => {
                        console.log(`بازی ${index + 1}: ${value} سکه`);
                    }}
                />

                <View style={{
                    marginTop: 20,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    width: '100%'
                }}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ color: 'gray' }}>میانگین</Text>
                        <Text style={{ fontWeight: 'bold' }}>
                            {Math.round(coinData.reduce((a, b) => a + b, 0) / coinData.length)} 🪙
                        </Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ color: 'gray' }}>بیشترین</Text>
                        <Text style={{ fontWeight: 'bold', color: '#4CAF50' }}>
                            {Math.max(...coinData)} 🪙
                        </Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ color: 'gray' }}>کمترین</Text>
                        <Text style={{ fontWeight: 'bold', color: '#FF6B6B' }}>
                            {Math.min(...coinData)} 🪙
                        </Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default CoinChart;