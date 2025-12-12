import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  useColorScheme,
  Alert,
  Linking,
} from 'react-native';
import Svg, { Path, Rect, Circle, Defs, ClipPath } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import { ArrowBackIosRounded, Copy, Link3Fill } from '../components/icons';

// ========================================
// QR CODE MONCASH (SVG PERSONNALISÉ)
// ========================================

const MonCashQRCode = ({ size = 180, isDarkMode }) => {
  const fillColor = isDarkMode ? '#FFFFFF' : '#000000';
  const bgColor = isDarkMode ? '#000000' : '#FFFFFF';

  return (
    <Svg width={size} height={size} viewBox="0 0 1024 1024">
      <Defs>
        <ClipPath id="a">
          <Path
            d="M 62 310v 31h 31a 31 31, 0, 0, 0, -31 -31M 62 341v 31h 31a 31 31, 0, 0, 0, -31 -31M 62 496v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31M 62 620v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(180,77.5,511.5)"
          />
          <Rect x="93" y="310" width="31" height="31" />
          <Rect x="93" y="341" width="31" height="31" />
          <Path d="M 93 465v 31h 31a 31 31, 0, 0, 0, -31 -31" />
          <Rect x="93" y="496" width="31" height="31" />
          <Rect x="93" y="527" width="31" height="31" />
          <Path
            d="M 93 558v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(90,108.5,573.5)"
          />
          <Rect x="93" y="620" width="31" height="31" />
          <Rect x="124" y="310" width="31" height="31" />
          <Path d="M 124 341v 31h 31a 31 31, 0, 0, 0, -31 -31" transform="rotate(90,139.5,356.5)" />
          <Path
            d="M 124 403v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(180,139.5,418.5)"
          />
          <Rect x="124" y="465" width="31" height="31" />
          <Path d="M 124 527v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31" />
          <Rect x="124" y="620" width="31" height="31" />
          <Path
            d="M 124 651v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(90,139.5,666.5)"
          />
          <Rect x="155" y="310" width="31" height="31" />
          <Path
            d="M 155 372v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(-90,170.5,387.5)"
          />
          <Rect x="155" y="403" width="31" height="31" />
          <Rect x="155" y="434" width="31" height="31" />
          <Rect x="155" y="465" width="31" height="31" />
          <Path
            d="M 155 496v 31h 31a 31 31, 0, 0, 0, -31 -31"
            transform="rotate(180,170.5,511.5)"
          />
          <Path d="M 155 620v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31" />
          <Path d="M 186 310v 31h 31a 31 31, 0, 0, 0, -31 -31" />
          <Path
            d="M 186 341v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(90,201.5,356.5)"
          />
          <Path d="M 186 403v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31" />
          <Path d="M 186 496v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31" />
          <Circle cx="201.5" cy="573.5" r="15.5" />
          <Path
            d="M 186 651v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(180,201.5,666.5)"
          />
          <Circle cx="232.5" cy="542.5" r="15.5" />
          <Circle cx="232.5" cy="604.5" r="15.5" />
          <Path d="M 217 651v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31" />
          <Path
            d="M 248 310v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(180,263.5,325.5)"
          />
          <Circle cx="263.5" cy="387.5" r="15.5" />
          <Circle cx="263.5" cy="449.5" r="15.5" />
          <Path
            d="M 248 496v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(180,263.5,511.5)"
          />
          <Path
            d="M 248 558v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(180,263.5,573.5)"
          />
          <Path
            d="M 248 620v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(180,263.5,635.5)"
          />
          <Circle cx="263.5" cy="697.5" r="15.5" />
          <Path d="M 279 310v 31h 31a 31 31, 0, 0, 0, -31 -31" />
          <Path
            d="M 279 341v 31h 31a 31 31, 0, 0, 0, -31 -31"
            transform="rotate(180,294.5,356.5)"
          />
          <Path
            d="M 279 403v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(180,294.5,418.5)"
          />
          <Path
            d="M 279 465v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(-90,294.5,480.5)"
          />
          <Path d="M 279 496v 31h 31a 31 31, 0, 0, 0, -31 -31" transform="rotate(90,294.5,511.5)" />
          <Path d="M 279 558v 31h 31a 31 31, 0, 0, 0, -31 -31" />
          <Rect x="279" y="589" width="31" height="31" />
          <Rect x="279" y="620" width="31" height="31" />
          <Path
            d="M 310 93v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(-90,325.5,108.5)"
          />
          <Path
            d="M 310 124v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(90,325.5,139.5)"
          />
          <Path
            d="M 310 186v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(180,325.5,201.5)"
          />
          <Path
            d="M 310 248v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(-90,325.5,263.5)"
          />
          <Path
            d="M 310 279v 31h 31a 31 31, 0, 0, 0, -31 -31"
            transform="rotate(180,325.5,294.5)"
          />
          <Path d="M 310 341v 31h 31a 31 31, 0, 0, 0, -31 -31" />
          <Rect x="310" y="372" width="31" height="31" />
          <Rect x="310" y="403" width="31" height="31" />
          <Path
            d="M 310 527v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(180,325.5,542.5)"
          />
          <Rect x="310" y="620" width="31" height="31" />
          <Circle cx="325.5" cy="697.5" r="15.5" />
          <Path
            d="M 310 744v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(180,325.5,759.5)"
          />
          <Path
            d="M 310 806v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(-90,325.5,821.5)"
          />
          <Rect x="310" y="837" width="31" height="31" />
          <Rect x="310" y="868" width="31" height="31" />
          <Rect x="310" y="899" width="31" height="31" />
          <Path
            d="M 310 930v 31h 31a 31 31, 0, 0, 0, -31 -31"
            transform="rotate(180,325.5,945.5)"
          />
          <Circle cx="356.5" cy="77.5" r="15.5" />
          <Path d="M 341 186v 31h 31a 31 31, 0, 0, 0, -31 -31" />
          <Path
            d="M 341 217v 31h 31a 31 31, 0, 0, 0, -31 -31"
            transform="rotate(180,356.5,232.5)"
          />
          <Rect x="341" y="279" width="31" height="31" />
          <Rect x="341" y="403" width="31" height="31" />
          <Path
            d="M 341 434v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(90,356.5,449.5)"
          />
          <Path d="M 341 527v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31" />
          <Rect x="341" y="620" width="31" height="31" />
          <Path
            d="M 341 651v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(90,356.5,666.5)"
          />
          <Path
            d="M 341 713v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(-90,356.5,728.5)"
          />
          <Path d="M 341 744v 31h 31a 31 31, 0, 0, 0, -31 -31" transform="rotate(90,356.5,759.5)" />
          <Rect x="341" y="930" width="31" height="31" />
          <Path d="M 372 217v 31h 31a 31 31, 0, 0, 0, -31 -31" />
          <Rect x="372" y="248" width="31" height="31" />
          <Path d="M 372 279v 31h 31a 31 31, 0, 0, 0, -31 -31" transform="rotate(90,387.5,294.5)" />
          <Path
            d="M 372 341v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(180,387.5,356.5)"
          />
          <Path d="M 372 403v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31" />
          <Circle cx="387.5" cy="480.5" r="15.5" />
          <Path
            d="M 372 558v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(180,387.5,573.5)"
          />
          <Rect x="372" y="620" width="31" height="31" />
          <Path
            d="M 372 899v 31h 31a 31 31, 0, 0, 0, -31 -31"
            transform="rotate(-90,387.5,914.5)"
          />
          <Path d="M 372 930v 31h 31a 31 31, 0, 0, 0, -31 -31" transform="rotate(90,387.5,945.5)" />
          <Circle cx="418.5" cy="77.5" r="15.5" />
          <Circle cx="418.5" cy="139.5" r="15.5" />
          <Circle cx="418.5" cy="201.5" r="15.5" />
          <Path
            d="M 403 310v 31h 31a 31 31, 0, 0, 0, -31 -31"
            transform="rotate(-90,418.5,325.5)"
          />
          <Path d="M 403 341v 31h 31a 31 31, 0, 0, 0, -31 -31" transform="rotate(90,418.5,356.5)" />
          <Circle cx="418.5" cy="449.5" r="15.5" />
          <Path
            d="M 403 527v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(-90,418.5,542.5)"
          />
          <Rect x="403" y="558" width="31" height="31" />
          <Rect x="403" y="589" width="31" height="31" />
          <Rect x="403" y="620" width="31" height="31" />
          <Path
            d="M 403 651v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(90,418.5,666.5)"
          />
          <Path
            d="M 403 713v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(-90,418.5,728.5)"
          />
          <Path
            d="M 403 744v 31h 31a 31 31, 0, 0, 0, -31 -31"
            transform="rotate(180,418.5,759.5)"
          />
          <Circle cx="418.5" cy="821.5" r="15.5" />
          <Path d="M 403 899v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31" />
          <Path
            d="M 434 248v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(-90,449.5,263.5)"
          />
          <Rect x="434" y="279" width="31" height="31" />
          <Path d="M 434 310v 31h 31a 31 31, 0, 0, 0, -31 -31" transform="rotate(90,449.5,325.5)" />
          <Path
            d="M 434 372v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(-90,449.5,387.5)"
          />
          <Path
            d="M 434 403v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(90,449.5,418.5)"
          />
          <Path d="M 434 589v 31h 31a 31 31, 0, 0, 0, -31 -31" />
          <Path d="M 434 620v 31h 31a 31 31, 0, 0, 0, -31 -31" transform="rotate(90,449.5,635.5)" />
          <Rect x="434" y="744" width="31" height="31" />
          <Path
            d="M 434 775v 31h 31a 31 31, 0, 0, 0, -31 -31"
            transform="rotate(180,449.5,790.5)"
          />
          <Circle cx="449.5" cy="883.5" r="15.5" />
          <Circle cx="480.5" cy="170.5" r="15.5" />
          <Rect x="465" y="279" width="31" height="31" />
          <Circle cx="480.5" cy="356.5" r="15.5" />
          <Path
            d="M 465 434v 31h 31a 31 31, 0, 0, 0, -31 -31"
            transform="rotate(-90,480.5,449.5)"
          />
          <Rect x="465" y="465" width="31" height="31" />
          <Path
            d="M 465 496v 31h 31a 31 31, 0, 0, 0, -31 -31"
            transform="rotate(180,480.5,511.5)"
          />
          <Path
            d="M 465 682v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(-90,480.5,697.5)"
          />
          <Rect x="465" y="713" width="31" height="31" />
          <Rect x="465" y="744" width="31" height="31" />
          <Rect x="465" y="775" width="31" height="31" />
          <Path
            d="M 465 899v 31h 31a 31 31, 0, 0, 0, -31 -31"
            transform="rotate(-90,480.5,914.5)"
          />
          <Path
            d="M 465 930v 31h 31a 31 31, 0, 0, 0, -31 -31"
            transform="rotate(180,480.5,945.5)"
          />
          <Path d="M 496 62v 31h 31a 31 31, 0, 0, 0, -31 -31" transform="rotate(-90,511.5,77.5)" />
          <Rect x="496" y="93" width="31" height="31" />
          <Path
            d="M 496 124v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(90,511.5,139.5)"
          />
          <Path
            d="M 496 217v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(-90,511.5,232.5)"
          />
          <Rect x="496" y="248" width="31" height="31" />
          <Rect x="496" y="279" width="31" height="31" />
          <Path
            d="M 496 310v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(90,511.5,325.5)"
          />
          <Circle cx="511.5" cy="387.5" r="15.5" />
          <Rect x="496" y="434" width="31" height="31" />
          <Path d="M 496 496v 31h 31a 31 31, 0, 0, 0, -31 -31" />
          <Rect x="496" y="527" width="31" height="31" />
          <Rect x="496" y="558" width="31" height="31" />
          <Path
            d="M 496 589v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(90,511.5,604.5)"
          />
          <Path d="M 496 713v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31" />
          <Rect x="496" y="775" width="31" height="31" />
          <Path
            d="M 496 868v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(-90,511.5,883.5)"
          />
          <Rect x="496" y="899" width="31" height="31" />
          <Path d="M 496 930v 31h 31a 31 31, 0, 0, 0, -31 -31" transform="rotate(90,511.5,945.5)" />
          <Rect x="527" y="62" width="31" height="31" />
          <Path
            d="M 527 186v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(180,542.5,201.5)"
          />
          <Path
            d="M 527 341v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(180,542.5,356.5)"
          />
          <Path
            d="M 527 403v 31h 31a 31 31, 0, 0, 0, -31 -31"
            transform="rotate(-90,542.5,418.5)"
          />
          <Rect x="527" y="434" width="31" height="31" />
          <Path d="M 527 558v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31" />
          <Circle cx="542.5" cy="666.5" r="15.5" />
          <Path d="M 527 775v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31" />
          <Path d="M 558 62v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31" />
          <Circle cx="573.5" cy="139.5" r="15.5" />
          <Path d="M 558 186v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31" />
          <Circle cx="573.5" cy="263.5" r="15.5" />
          <Path
            d="M 558 310v 31h 31a 31 31, 0, 0, 0, -31 -31"
            transform="rotate(-90,573.5,325.5)"
          />
          <Rect x="558" y="341" width="31" height="31" />
          <Rect x="558" y="372" width="31" height="31" />
          <Rect x="558" y="403" width="31" height="31" />
          <Path d="M 558 434v 31h 31a 31 31, 0, 0, 0, -31 -31" transform="rotate(90,573.5,449.5)" />
          <Circle cx="573.5" cy="511.5" r="15.5" />
          <Path
            d="M 558 713v 31h 31a 31 31, 0, 0, 0, -31 -31"
            transform="rotate(-90,573.5,728.5)"
          />
          <Path
            d="M 558 744v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(90,573.5,759.5)"
          />
          <Path
            d="M 558 806v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(-90,573.5,821.5)"
          />
          <Path
            d="M 558 837v 31h 31a 31 31, 0, 0, 0, -31 -31"
            transform="rotate(180,573.5,852.5)"
          />
          <Path
            d="M 589 279v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(-90,604.5,294.5)"
          />
          <Rect x="589" y="310" width="31" height="31" />
          <Rect x="589" y="341" width="31" height="31" />
          <Path d="M 589 372v 31h 31a 31 31, 0, 0, 0, -31 -31" transform="rotate(90,604.5,387.5)" />
          <Circle cx="604.5" cy="542.5" r="15.5" />
          <Path
            d="M 589 651v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(-90,604.5,666.5)"
          />
          <Rect x="589" y="682" width="31" height="31" />
          <Rect x="589" y="713" width="31" height="31" />
          <Rect x="589" y="837" width="31" height="31" />
          <Rect x="589" y="868" width="31" height="31" />
          <Rect x="589" y="899" width="31" height="31" />
          <Path
            d="M 589 930v 31h 31a 31 31, 0, 0, 0, -31 -31"
            transform="rotate(180,604.5,945.5)"
          />
          <Circle cx="635.5" cy="77.5" r="15.5" />
          <Path
            d="M 620 124v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(180,635.5,139.5)"
          />
          <Circle cx="635.5" cy="201.5" r="15.5" />
          <Circle cx="635.5" cy="263.5" r="15.5" />
          <Rect x="620" y="310" width="31" height="31" />
          <Circle cx="635.5" cy="480.5" r="15.5" />
          <Path
            d="M 620 589v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(180,635.5,604.5)"
          />
          <Path d="M 620 713v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31" />
          <Path
            d="M 620 806v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(-90,635.5,821.5)"
          />
          <Path d="M 620 837v 31h 31a 31 31, 0, 0, 0, -31 -31" transform="rotate(90,635.5,852.5)" />
          <Rect x="620" y="899" width="31" height="31" />
          <Rect x="620" y="930" width="31" height="31" />
          <Path
            d="M 651 93v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(-90,666.5,108.5)"
          />
          <Rect x="651" y="124" width="31" height="31" />
          <Path
            d="M 651 155v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(90,666.5,170.5)"
          />
          <Path
            d="M 651 279v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(-90,666.5,294.5)"
          />
          <Rect x="651" y="310" width="31" height="31" />
          <Path
            d="M 651 434v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(180,666.5,449.5)"
          />
          <Path
            d="M 651 496v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(-90,666.5,511.5)"
          />
          <Path
            d="M 651 527v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(90,666.5,542.5)"
          />
          <Rect x="651" y="589" width="31" height="31" />
          <Path
            d="M 651 651v 31h 31a 31 31, 0, 0, 0, -31 -31"
            transform="rotate(-90,666.5,666.5)"
          />
          <Path
            d="M 651 682v 31h 31a 31 31, 0, 0, 0, -31 -31"
            transform="rotate(180,666.5,697.5)"
          />
          <Path
            d="M 651 744v 31h 31a 31 31, 0, 0, 0, -31 -31"
            transform="rotate(-90,666.5,759.5)"
          />
          <Path
            d="M 651 775v 31h 31a 31 31, 0, 0, 0, -31 -31"
            transform="rotate(180,666.5,790.5)"
          />
          <Path d="M 651 899v 31h 31a 31 31, 0, 0, 0, -31 -31" />
          <Path d="M 651 930v 31h 31a 31 31, 0, 0, 0, -31 -31" transform="rotate(90,666.5,945.5)" />
          <Circle cx="697.5" cy="77.5" r="15.5" />
          <Path d="M 682 124v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31" />
          <Circle cx="697.5" cy="263.5" r="15.5" />
          <Rect x="682" y="310" width="31" height="31" />
          <Path
            d="M 682 372v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(-90,697.5,387.5)"
          />
          <Rect x="682" y="403" width="31" height="31" />
          <Rect x="682" y="434" width="31" height="31" />
          <Path
            d="M 682 558v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(-90,697.5,573.5)"
          />
          <Rect x="682" y="589" width="31" height="31" />
          <Path d="M 682 651v 31h 31a 31 31, 0, 0, 0, -31 -31" />
          <Rect x="682" y="682" width="31" height="31" />
          <Rect x="682" y="713" width="31" height="31" />
          <Rect x="682" y="744" width="31" height="31" />
          <Rect x="682" y="775" width="31" height="31" />
          <Rect x="682" y="806" width="31" height="31" />
          <Path
            d="M 682 837v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(90,697.5,852.5)"
          />
          <Rect x="713" y="310" width="31" height="31" />
          <Path
            d="M 713 341v 31h 31a 31 31, 0, 0, 0, -31 -31"
            transform="rotate(180,728.5,356.5)"
          />
          <Path d="M 713 434v 31h 31a 31 31, 0, 0, 0, -31 -31" />
          <Rect x="713" y="465" width="31" height="31" />
          <Path
            d="M 713 496v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(90,728.5,511.5)"
          />
          <Path d="M 713 589v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31" />
          <Rect x="713" y="682" width="31" height="31" />
          <Rect x="713" y="806" width="31" height="31" />
          <Path
            d="M 713 930v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(180,728.5,945.5)"
          />
          <Path d="M 744 310v 31h 31a 31 31, 0, 0, 0, -31 -31" />
          <Rect x="744" y="341" width="31" height="31" />
          <Path
            d="M 744 372v 31h 31a 31 31, 0, 0, 0, -31 -31"
            transform="rotate(180,759.5,387.5)"
          />
          <Path
            d="M 744 620v 31h 31a 31 31, 0, 0, 0, -31 -31"
            transform="rotate(-90,759.5,635.5)"
          />
          <Rect x="744" y="651" width="31" height="31" />
          <Rect x="744" y="682" width="31" height="31" />
          <Circle cx="759.5" cy="759.5" r="15.5" />
          <Rect x="744" y="806" width="31" height="31" />
          <Circle cx="759.5" cy="883.5" r="15.5" />
          <Rect x="744" y="930" width="31" height="31" />
          <Path d="M 775 372v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31" />
          <Path
            d="M 775 465v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(180,790.5,480.5)"
          />
          <Path
            d="M 775 558v 31h 31a 31 31, 0, 0, 0, -31 -31"
            transform="rotate(-90,790.5,573.5)"
          />
          <Rect x="775" y="589" width="31" height="31" />
          <Rect x="775" y="620" width="31" height="31" />
          <Rect x="775" y="682" width="31" height="31" />
          <Rect x="775" y="806" width="31" height="31" />
          <Path d="M 775 930v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31" />
          <Circle cx="821.5" cy="325.5" r="15.5" />
          <Circle cx="821.5" cy="418.5" r="15.5" />
          <Path d="M 806 465v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31" />
          <Path
            d="M 806 527v 31h 31a 31 31, 0, 0, 0, -31 -31"
            transform="rotate(-90,821.5,542.5)"
          />
          <Rect x="806" y="558" width="31" height="31" />
          <Rect x="806" y="620" width="31" height="31" />
          <Rect x="806" y="682" width="31" height="31" />
          <Rect x="806" y="713" width="31" height="31" />
          <Rect x="806" y="744" width="31" height="31" />
          <Rect x="806" y="775" width="31" height="31" />
          <Rect x="806" y="806" width="31" height="31" />
          <Path
            d="M 806 837v 31h 31a 31 31, 0, 0, 0, -31 -31"
            transform="rotate(180,821.5,852.5)"
          />
          <Circle cx="821.5" cy="914.5" r="15.5" />
          <Path
            d="M 837 341v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(180,852.5,356.5)"
          />
          <Path
            d="M 837 496v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(-90,852.5,511.5)"
          />
          <Rect x="837" y="527" width="31" height="31" />
          <Rect x="837" y="558" width="31" height="31" />
          <Rect x="837" y="620" width="31" height="31" />
          <Path d="M 837 682v 31h 31a 31 31, 0, 0, 0, -31 -31" />
          <Path d="M 837 713v 31h 31a 31 31, 0, 0, 0, -31 -31" transform="rotate(90,852.5,728.5)" />
          <Rect x="837" y="806" width="31" height="31" />
          <Path d="M 837 837v 31h 31a 31 31, 0, 0, 0, -31 -31" transform="rotate(90,852.5,852.5)" />
          <Path
            d="M 868 310v 31h 31a 31 31, 0, 0, 0, -31 -31"
            transform="rotate(-90,883.5,325.5)"
          />
          <Rect x="868" y="341" width="31" height="31" />
          <Circle cx="883.5" cy="418.5" r="15.5" />
          <Path
            d="M 868 465v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(180,883.5,480.5)"
          />
          <Path d="M 868 527v 31h 31a 31 31, 0, 0, 0, -31 -31" />
          <Rect x="868" y="558" width="31" height="31" />
          <Rect x="868" y="620" width="31" height="31" />
          <Path
            d="M 868 651v 31h 31a 31 31, 0, 0, 0, -31 -31"
            transform="rotate(180,883.5,666.5)"
          />
          <Path
            d="M 868 775v 31h 31a 31 31, 0, 0, 0, -31 -31"
            transform="rotate(-90,883.5,790.5)"
          />
          <Path d="M 868 806v 31h 31a 31 31, 0, 0, 0, -31 -31" transform="rotate(90,883.5,821.5)" />
          <Circle cx="883.5" cy="945.5" r="15.5" />
          <Path d="M 899 310v 31h 31a 31 31, 0, 0, 0, -31 -31" />
          <Rect x="899" y="341" width="31" height="31" />
          <Path
            d="M 899 372v 31h 31a 31 31, 0, 0, 0, -31 -31"
            transform="rotate(180,914.5,387.5)"
          />
          <Rect x="899" y="465" width="31" height="31" />
          <Path
            d="M 899 496v 31h 31a 31 31, 0, 0, 0, -31 -31"
            transform="rotate(180,914.5,511.5)"
          />
          <Rect x="899" y="558" width="31" height="31" />
          <Rect x="899" y="589" width="31" height="31" />
          <Rect x="899" y="620" width="31" height="31" />
          <Rect x="899" y="651" width="31" height="31" />
          <Path
            d="M 899 682v 31h 31a 31 31, 0, 0, 0, -31 -31"
            transform="rotate(180,914.5,697.5)"
          />
          <Path d="M 899 775v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31" />
          <Path
            d="M 899 899v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(180,914.5,914.5)"
          />
          <Path d="M 930 341v 31h 31a 31 31, 0, 0, 0, -31 -31" />
          <Rect x="930" y="372" width="31" height="31" />
          <Path
            d="M 930 403v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(90,945.5,418.5)"
          />
          <Path d="M 930 465v 31h 31a 31 31, 0, 0, 0, -31 -31" />
          <Rect x="930" y="496" width="31" height="31" />
          <Rect x="930" y="527" width="31" height="31" />
          <Rect x="930" y="558" width="31" height="31" />
          <Path d="M 930 589v 31h 31a 31 31, 0, 0, 0, -31 -31" transform="rotate(90,945.5,604.5)" />
          <Path d="M 930 682v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31" />
          <Circle cx="945.5" cy="759.5" r="15.5" />
          <Path
            d="M 930 806v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(-90,945.5,821.5)"
          />
          <Rect x="930" y="837" width="31" height="31" />
          <Rect x="930" y="868" width="31" height="31" />
          <Rect x="930" y="899" width="31" height="31" />
          <Path
            d="M 930 930v 31h 15.5a 15.5 15.5, 0, 0, 0, 0 -31"
            transform="rotate(90,945.5,945.5)"
          />
        </ClipPath>
        <ClipPath id="b">
          <Path d="M 62 62v 31h 31a 31 31, 0, 0, 0, -31 -31" transform="rotate(-90,77.5,77.5)" />
          <Rect x="62" y="93" width="31" height="31" />
          <Rect x="62" y="124" width="31" height="31" />
          <Rect x="62" y="155" width="31" height="31" />
          <Rect x="62" y="186" width="31" height="31" />
          <Rect x="62" y="217" width="31" height="31" />
          <Path d="M 62 248v 31h 31a 31 31, 0, 0, 0, -31 -31" transform="rotate(180,77.5,263.5)" />
          <Rect x="93" y="62" width="31" height="31" />
          <Rect x="93" y="248" width="31" height="31" />
          <Rect x="124" y="62" width="31" height="31" />
          <Rect x="124" y="248" width="31" height="31" />
          <Rect x="155" y="62" width="31" height="31" />
          <Rect x="155" y="248" width="31" height="31" />
          <Rect x="186" y="62" width="31" height="31" />
          <Rect x="186" y="248" width="31" height="31" />
          <Rect x="217" y="62" width="31" height="31" />
          <Rect x="217" y="248" width="31" height="31" />
          <Path d="M 248 62v 31h 31a 31 31, 0, 0, 0, -31 -31" />
          <Rect x="248" y="93" width="31" height="31" />
          <Rect x="248" y="124" width="31" height="31" />
          <Rect x="248" y="155" width="31" height="31" />
          <Rect x="248" y="186" width="31" height="31" />
          <Rect x="248" y="217" width="31" height="31" />
          <Path d="M 248 248v 31h 31a 31 31, 0, 0, 0, -31 -31" transform="rotate(90,263.5,263.5)" />
        </ClipPath>
        <ClipPath id="c">
          <Path
            d="M 124 124v 31h 31a 31 31, 0, 0, 0, -31 -31"
            transform="rotate(-90,139.5,139.5)"
          />
          <Rect x="124" y="155" width="31" height="31" />
          <Path
            d="M 124 186v 31h 31a 31 31, 0, 0, 0, -31 -31"
            transform="rotate(180,139.5,201.5)"
          />
          <Rect x="155" y="124" width="31" height="31" />
          <Rect x="155" y="155" width="31" height="31" />
          <Rect x="155" y="186" width="31" height="31" />
          <Path d="M 186 124v 31h 31a 31 31, 0, 0, 0, -31 -31" />
          <Rect x="186" y="155" width="31" height="31" />
          <Path d="M 186 186v 31h 31a 31 31, 0, 0, 0, -31 -31" transform="rotate(90,201.5,201.5)" />
        </ClipPath>
        <ClipPath id="d">
          <Path d="M 744 62v 31h 31a 31 31, 0, 0, 0, -31 -31" transform="rotate(-90,759.5,77.5)" />
          <Rect x="744" y="93" width="31" height="31" />
          <Rect x="744" y="124" width="31" height="31" />
          <Rect x="744" y="155" width="31" height="31" />
          <Rect x="744" y="186" width="31" height="31" />
          <Rect x="744" y="217" width="31" height="31" />
          <Path
            d="M 744 248v 31h 31a 31 31, 0, 0, 0, -31 -31"
            transform="rotate(180,759.5,263.5)"
          />
          <Rect x="775" y="62" width="31" height="31" />
          <Rect x="775" y="248" width="31" height="31" />
          <Rect x="806" y="62" width="31" height="31" />
          <Rect x="806" y="248" width="31" height="31" />
          <Rect x="837" y="62" width="31" height="31" />
          <Rect x="837" y="248" width="31" height="31" />
          <Rect x="868" y="62" width="31" height="31" />
          <Rect x="868" y="248" width="31" height="31" />
          <Rect x="899" y="62" width="31" height="31" />
          <Rect x="899" y="248" width="31" height="31" />
          <Path d="M 930 62v 31h 31a 31 31, 0, 0, 0, -31 -31" />
          <Rect x="930" y="93" width="31" height="31" />
          <Rect x="930" y="124" width="31" height="31" />
          <Rect x="930" y="155" width="31" height="31" />
          <Rect x="930" y="186" width="31" height="31" />
          <Rect x="930" y="217" width="31" height="31" />
          <Path d="M 930 248v 31h 31a 31 31, 0, 0, 0, -31 -31" transform="rotate(90,945.5,263.5)" />
        </ClipPath>
        <ClipPath id="e">
          <Path
            d="M 806 124v 31h 31a 31 31, 0, 0, 0, -31 -31"
            transform="rotate(-90,821.5,139.5)"
          />
          <Rect x="806" y="155" width="31" height="31" />
          <Path
            d="M 806 186v 31h 31a 31 31, 0, 0, 0, -31 -31"
            transform="rotate(180,821.5,201.5)"
          />
          <Rect x="837" y="124" width="31" height="31" />
          <Rect x="837" y="155" width="31" height="31" />
          <Rect x="837" y="186" width="31" height="31" />
          <Path d="M 868 124v 31h 31a 31 31, 0, 0, 0, -31 -31" />
          <Rect x="868" y="155" width="31" height="31" />
          <Path d="M 868 186v 31h 31a 31 31, 0, 0, 0, -31 -31" transform="rotate(90,883.5,201.5)" />
        </ClipPath>
        <ClipPath id="f">
          <Path d="M 62 744v 31h 31a 31 31, 0, 0, 0, -31 -31" transform="rotate(-90,77.5,759.5)" />
          <Rect x="62" y="775" width="31" height="31" />
          <Rect x="62" y="806" width="31" height="31" />
          <Rect x="62" y="837" width="31" height="31" />
          <Rect x="62" y="868" width="31" height="31" />
          <Rect x="62" y="899" width="31" height="31" />
          <Path d="M 62 930v 31h 31a 31 31, 0, 0, 0, -31 -31" transform="rotate(180,77.5,945.5)" />
          <Rect x="93" y="744" width="31" height="31" />
          <Rect x="93" y="930" width="31" height="31" />
          <Rect x="124" y="744" width="31" height="31" />
          <Rect x="124" y="930" width="31" height="31" />
          <Rect x="155" y="744" width="31" height="31" />
          <Rect x="155" y="930" width="31" height="31" />
          <Rect x="186" y="744" width="31" height="31" />
          <Rect x="186" y="930" width="31" height="31" />
          <Rect x="217" y="744" width="31" height="31" />
          <Rect x="217" y="930" width="31" height="31" />
          <Path d="M 248 744v 31h 31a 31 31, 0, 0, 0, -31 -31" />
          <Rect x="248" y="775" width="31" height="31" />
          <Rect x="248" y="806" width="31" height="31" />
          <Rect x="248" y="837" width="31" height="31" />
          <Rect x="248" y="868" width="31" height="31" />
          <Rect x="248" y="899" width="31" height="31" />
          <Path d="M 248 930v 31h 31a 31 31, 0, 0, 0, -31 -31" transform="rotate(90,263.5,945.5)" />
        </ClipPath>
        <ClipPath id="g">
          <Path
            d="M 124 806v 31h 31a 31 31, 0, 0, 0, -31 -31"
            transform="rotate(-90,139.5,821.5)"
          />
          <Rect x="124" y="837" width="31" height="31" />
          <Path
            d="M 124 868v 31h 31a 31 31, 0, 0, 0, -31 -31"
            transform="rotate(180,139.5,883.5)"
          />
          <Rect x="155" y="806" width="31" height="31" />
          <Rect x="155" y="837" width="31" height="31" />
          <Rect x="155" y="868" width="31" height="31" />
          <Path d="M 186 806v 31h 31a 31 31, 0, 0, 0, -31 -31" />
          <Rect x="186" y="837" width="31" height="31" />
          <Path d="M 186 868v 31h 31a 31 31, 0, 0, 0, -31 -31" transform="rotate(90,201.5,883.5)" />
        </ClipPath>
      </Defs>
      <Rect x="0" y="0" height="1024" width="1024" fill={bgColor} />
      <Rect x="62" y="62" height="899" width="899" clipPath="url(#a)" fill={fillColor} />
      <Rect x="62" y="62" height="217" width="217" clipPath="url(#b)" fill={fillColor} />
      <Rect x="124" y="124" height="93" width="93" clipPath="url(#c)" fill={fillColor} />
      <Rect x="744" y="62" height="217" width="217" clipPath="url(#d)" fill={fillColor} />
      <Rect x="806" y="124" height="93" width="93" clipPath="url(#e)" fill={fillColor} />
      <Rect x="62" y="744" height="217" width="217" clipPath="url(#f)" fill={fillColor} />
      <Rect x="124" y="806" height="93" width="93" clipPath="url(#g)" fill={fillColor} />
    </Svg>
  );
};

// ========================================
// COMPOSANT PRINCIPAL
// ========================================

export default function DonationScreen({ navigation }) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const insets = useSafeAreaInsets();

  const colors = {
    background: isDarkMode ? '#000000' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    textSecondary: isDarkMode ? '#BDBDBD' : '#666666',
    border: isDarkMode ? '#333333' : '#E0E0E0',
    headerBg: isDarkMode ? '#1A1A1A' : '#FFFFFF',
    buttonBg: isDarkMode ? '#FFFFFF' : '#000000',
    buttonText: isDarkMode ? '#000000' : '#FFFFFF',
  };

  const MONCASH_NUMBER = '+509 4712 9887';
  const MONCASH_LINK = 'https://app.mc.moncashdfs.com/qr/v1/qrTinyUrls?nanoId=bN6dqYt9';

  const handleBack = () => {
    navigation.goBack();
  };

  const handleCopyNumber = async () => {
    await Clipboard.setStringAsync(MONCASH_NUMBER);
    Alert.alert('Copié', 'Le numéro MonCash a été copié');
  };

  const handleOpenLink = async () => {
    const canOpen = await Linking.canOpenURL(MONCASH_LINK);
    if (canOpen) {
      await Linking.openURL(MONCASH_LINK);
    } else {
      Alert.alert('Erreur', "Impossible d'ouvrir le lien");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.headerBg}
        translucent={false}
      />

      {/* HEADER */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.headerBg,
            borderBottomColor: colors.border,
            paddingTop: insets.top,
          },
        ]}
      >
        <TouchableOpacity onPress={handleBack} style={styles.headerLeft}>
          <ArrowBackIosRounded color={colors.text} size={24} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Soutenir l'application</Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      {/* CONTENU */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.introSection}>
          <Text style={[styles.introTitle, { color: colors.text }]}>Soutenez le développement</Text>
          <Text style={[styles.introText, { color: colors.textSecondary }]}>
            Merci infiniment pour votre soutien. Chaque contribution, même la plus petite, nous aide
            à améliorer les fonctionnalités, renforcer la sécurité et offrir une expérience toujours
            plus fluide à l'ensemble de la communauté.
            {'\n\n'}
            Si vous souhaitez nous aider, vous pouvez effectuer un don directement via MonCash. Vous
            trouverez ci-dessous :{'\n'}• Notre numéro MonCash, copiable.{'\n'}• Notre QR code, prêt
            à être scanné.{'\n'}• Un lien direct vers MonCash
            {'\n\n'}
            Votre générosité nous permet de continuer à avancer, d'ajouter de nouvelles options et
            de rendre l'application plus performante. Merci pour votre confiance et votre soutien !
          </Text>
        </View>

        <View style={styles.moncashSection}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.buttonBg }]}
            onPress={handleCopyNumber}
            activeOpacity={0.8}
          >
            <Copy color={colors.buttonText} size={18} />
            <Text style={[styles.actionButtonText, { color: colors.buttonText }]}>
              {MONCASH_NUMBER}
            </Text>
          </TouchableOpacity>

          <View style={styles.qrSection}>
            <MonCashQRCode size={180} isDarkMode={isDarkMode} />
            <Text style={[styles.qrLabel, { color: colors.textSecondary }]}>
              Scannez pour donner
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.buttonBg }]}
            onPress={handleOpenLink}
            activeOpacity={0.8}
          >
            <Link3Fill color={colors.buttonText} size={18} />
            <Text style={[styles.actionButtonText, { color: colors.buttonText }]}>
              Faire un don via MonCash
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.thankYouText, { color: colors.textSecondary }]}>
          Merci pour votre confiance et votre soutien. Grâce à vous, nous pouvons continuer à
          avancer.
        </Text>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

// ========================================
// STYLES
// ========================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerLeft: {
    width: 40,
    alignItems: 'flex-start',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
  },
  introSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  introTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  introText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'left',
  },
  moncashSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 20,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
  qrSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  qrLabel: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
  },
  thankYouText: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: 24,
  },
});
