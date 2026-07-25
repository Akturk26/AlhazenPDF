import React from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Icon({ name, size = 24, color = '#fff', lib = 'mci', style }) {
  if (lib === 'ion') return <Ionicons name={name} size={size} color={color} style={style} />;
  return <MaterialCommunityIcons name={name} size={size} color={color} style={style} />;
}
