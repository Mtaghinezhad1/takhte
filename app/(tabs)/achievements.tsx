import { Dimensions, StyleSheet, Text, View } from 'react-native';
const { width } = Dimensions.get('window');

export default function AchievementsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>به زودی ...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f6f7fb' },
  title: { fontSize: width * 0.06, fontWeight: 'bold', color: '#333' },
});
