// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

// Mapping of SF Symbol names to Material Icons names.
const MAPPING = {
  'house.fill': 'home',
  'stars.fill': 'stars',
  'school.fill': 'school',
  'menu.fill': 'menu',
  'account_circle.fill': 'person',
  'info.fill': 'info',
  'attach-money': 'attach-money',
  'speed': 'speed',
  'person': 'person',
  'info-outline': 'info-outline',
  'edit': 'edit'
};

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight, // not used in MaterialIcons, kept for compatibility
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}