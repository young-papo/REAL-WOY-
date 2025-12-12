import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  SafeAreaView,
  Animated,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  useColorScheme,
  Linking,
  Alert,
  Clipboard,
  ScrollView,
  Dimensions,
  StatusBar,
} from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import MapView, { Marker, Circle } from 'react-native-maps';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const PaperplaneSolid = ({ color = '#000000', size = 26 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M18.844 13.483c1.208-.6 1.208-2.367 0-2.966L6.552 4.416c-1.228-.61-2.458.493-2.285 1.72l.54 3.829a1.64 1.64 0 0 0 1.128 1.342c.16.05.55.133 1.012.227c.636.13 4.39.466 4.39.466s-3.754.337-4.39.466c-.461.094-.851.177-1.012.227a1.64 1.64 0 0 0-1.128 1.342l-.54 3.83c-.173 1.226 1.057 2.329 2.285 1.72z"
    />
  </Svg>
);

const VerifiedCheckFill = ({ color = '#3B82F6', size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M22.02 11.164a1.84 1.84 0 0 0-.57-.67l-1.33-1a.35.35 0 0 1-.14-.2a.36.36 0 0 1 0-.25l.55-1.63a2 2 0 0 0 .06-.9a1.809 1.809 0 0 0-.36-.84a1.859 1.859 0 0 0-.7-.57a1.75 1.75 0 0 0-.85-.17h-1.5a.41.41 0 0 1-.39-.3l-.43-1.5a1.88 1.88 0 0 0-.46-.81a2 2 0 0 0-.78-.49a2 2 0 0 0-.92-.06a1.88 1.88 0 0 0-.83.39l-1.14.9a.35.35 0 0 1-.23.09a.36.36 0 0 1-.22-.05l-1.13-.9a1.85 1.85 0 0 0-.8-.38a1.87 1.87 0 0 0-.88 0a1.93 1.93 0 0 0-.78.43a2.08 2.08 0 0 0-.51.79l-.43 1.51a.38.38 0 0 1-.15.22a.41.41 0 0 1-.27.07H5.41a1.92 1.92 0 0 0-.89.18a1.78 1.78 0 0 0-.71.57a1.93 1.93 0 0 0-.36.83c-.05.293-.03.595.06.88L4 8.993a.41.41 0 0 1-.14.45l-1.33 1c-.242.18-.44.412-.58.68a1.93 1.93 0 0 0 0 1.71a2 2 0 0 0 .58.68l1.33 1a.41.41 0 0 1 .14.45l-.55 1.63a2 2 0 0 0-.07.91c.05.298.174.58.36.82c.183.25.428.45.71.58c.265.126.557.184.85.17h1.49a.38.38 0 0 1 .25.08a.34.34 0 0 1 .14.21l.43 1.51a2 2 0 0 0 .46.8a1.89 1.89 0 0 0 2.54.17l1.15-.91a.39.39 0 0 1 .49 0l1.13.9c.24.202.53.337.84.39c.113.01.227.01.34 0a1.9 1.9 0 0 0 .58-.09a1.871 1.871 0 0 0 1.24-1.28l.44-1.52a.34.34 0 0 1 .14-.21a.4.4 0 0 1 .27-.08h1.43a2 2 0 0 0 .89-.17a1.911 1.911 0 0 0 1.06-1.4a1.92 1.92 0 0 0-.07-.92l-.54-1.62a.36.36 0 0 1 0-.25a.35.35 0 0 1 .14-.2l1.33-1a1.87 1.87 0 0 0 .57-.68a1.82 1.82 0 0 0 .21-.86a1.881 1.881 0 0 0-.23-.78m-5.44-.76l-4.42 4.42a2.011 2.011 0 0 1-.59.4c-.222.09-.46.138-.7.14a1.711 1.711 0 0 1-.71-.15a1.863 1.863 0 0 1-.6-.4l-2.18-2.19a1 1 0 0 1 1.41-1.41l2.08 2.08l4.3-4.31a1 1 0 0 1 1.41 0a.998.998 0 0 1 0 1.46z"
    />
  </Svg>
);

const Check = ({ color = '#999999', size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="m6 12l4.243 4.243l8.484-8.486"
    />
  </Svg>
);

const CheckAll = ({ color = '#999999', size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="m8 12.485l4.243 4.243l8.484-8.485M3 12.485l4.243 4.243m8.485-8.485L12.5 11.5"
    />
  </Svg>
);

const ArrowBackIosRounded = ({ color = '#000000', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="m3.55 12l7.35 7.35q.375.375.363.875t-.388.875q-.375.375-.875.375t-.875-.375l-7.7-7.675q-.3-.3-.45-.675T.825 12q0-.375.15-.75t.45-.675l7.7-7.7q.375-.375.888-.363t.887.388q.375.375.375.875t-.375.875L3.55 12Z"
    />
  </Svg>
);

const ProfileFill = ({ color = '#000000', size = 28 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      fill={color}
      fillRule="evenodd"
      d="M8 7a4 4 0 1 1 8 0a4 4 0 0 1-8 0Zm0 6a5 5 0 0 0-5 5a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3a5 5 0 0 0-5-5H8Z"
      clipRule="evenodd"
    />
  </Svg>
);

const PresenceBlocked16Regular = ({ color = '#000000', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 16 16">
    <Path
      fill={color}
      d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0Zm-2 0c0-1.296-.41-2.496-1.11-3.477l-8.367 8.368A6 6 0 0 0 14 8Zm-2.524-4.89a6 6 0 0 0-8.367 8.367l8.368-8.368Z"
    />
  </Svg>
);

const Warning = ({ color = '#000000', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="m21.171 15.398l-5.912-9.854C14.483 4.251 13.296 3.511 12 3.511s-2.483.74-3.259 2.031l-5.912 9.856c-.786 1.309-.872 2.705-.235 3.83C3.23 20.354 4.472 21 6 21h12c1.528 0 2.77-.646 3.406-1.771c.637-1.125.551-2.521-.235-3.831zM12 17.549c-.854 0-1.55-.695-1.55-1.549c0-.855.695-1.551 1.55-1.551s1.55.696 1.55 1.551c0 .854-.696 1.549-1.55 1.549zm1.633-7.424c-.011.031-1.401 3.468-1.401 3.468c-.038.094-.13.156-.231.156s-.193-.062-.231-.156l-1.391-3.438a1.776 1.776 0 0 1-.129-.655c0-.965.785-1.75 1.75-1.75a1.752 1.752 0 0 1 1.633 2.375z"
    />
  </Svg>
);

const Trash = ({ color = '#EF4444', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <G fill="none">
      <Path
        fill={color}
        fillRule="evenodd"
        d="M21 6H3v3a2 2 0 0 1 2 2v4c0 2.828 0 4.243.879 5.121C6.757 21 8.172 21 11 21h2c2.829 0 4.243 0 5.121-.879c.88-.878.88-2.293.88-5.121v-4a2 2 0 0 1 2-2zm-10.5 5a1 1 0 0 0-2 0v5a1 1 0 1 0 2 0zm5 0a1 1 0 0 0-2 0v5a1 1 0 1 0 2 0z"
        clipRule="evenodd"
      />
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeWidth="2"
        d="M10.068 3.37c.114-.106.365-.2.715-.267A6.68 6.68 0 0 1 12 3c.44 0 .868.036 1.217.103c.35.067.6.161.715.268"
      />
    </G>
  </Svg>
);

const PictureSolid = ({ color = '#000000', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 36 36">
    <Path
      fill={color}
      d="M32 4H4a2 2 0 0 0-2 2v24a2 2 0 0 0 2 2h28a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2ZM8.92 8a3 3 0 1 1-3 3a3 3 0 0 1 3-3ZM6 27v-4.1l6-6.08a1 1 0 0 1 1.41 0L16 19.35L8.32 27Zm24 0H11.15l6.23-6.23l5.4-5.4a1 1 0 0 1 1.41 0L30 21.18Z"
    />
  </Svg>
);

const Camera = ({ color = '#000000', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M19 6h-1.586l-1-1c-.579-.579-1.595-1-2.414-1h-4c-.819 0-1.835.421-2.414 1l-1 1H5C3.346 6 2 7.346 2 9v8c0 1.654 1.346 3 3 3h14c1.654 0 3-1.346 3-3V9c0-1.654-1.346-3-3-3zm-7 10a3.5 3.5 0 1 1 .001-7.001A3.5 3.5 0 0 1 12 16zm6-4.701a1.3 1.3 0 1 1 0-2.6a1.3 1.3 0 0 1 0 2.6z"
    />
  </Svg>
);

const PositionMan = ({ color = '#000000', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Path
      fill={color}
      d="M49.855 0A10.5 10.5 0 0 0 39.5 10.5A10.5 10.5 0 0 0 50 21a10.5 10.5 0 0 0 10.5-10.5A10.5 10.5 0 0 0 50 0a10.5 10.5 0 0 0-.145 0zm-.057 23.592c-7.834.002-15.596 3.368-14.78 10.096l2 14.625c.351 2.573 2.09 6.687 4.687 6.687h.185l2.127 24.531c.092 1.105.892 2 2 2h8c1.108 0 1.908-.895 2-2l2.127-24.53h.186c2.597 0 4.335-4.115 4.687-6.688l2-14.625c.524-6.734-7.384-10.097-15.219-10.096z"
    />
  </Svg>
);

const HandHoldingDollarSolid = ({ color = '#000000', size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M12.753 4a.752.752 0 0 0-1.505 0v.464h-.051c-1.05 0-1.66.795-1.781 1.56c-.121.755.2 1.7 1.165 2.048l2.362.851c.082.03.113.07.129.1c.02.04.033.1.02.17a.27.27 0 0 1-.076.152c-.025.023-.069.051-.162.051h-1.657a.324.324 0 0 1-.32-.328a.752.752 0 0 0-1.504 0c0 1.006.81 1.833 1.824 1.833h.076v.599a.752.752 0 0 0 1.505 0v-.599h.076c1.964 0 2.426-2.735.599-3.394l-2.361-.85a.26.26 0 0 1-.157-.133a.44.44 0 0 1-.034-.263a.4.4 0 0 1 .107-.225c.036-.036.089-.067.189-.067h1.607c.17 0 .319.14.319.328a.752.752 0 0 0 1.505 0c0-1.006-.81-1.833-1.824-1.833h-.051zm-3.32 8.998c-.863 0-1.522.206-2.063.544c-.5.312-.865.72-1.157 1.046l-.031.035c-.316.352-.559.614-.873.806c-.292.179-.685.319-1.309.319a.75.75 0 0 0-.752.752V20c0 .416.337.752.752.752h9.502c1.744 0 3.426-.94 4.603-1.784a16 16 0 0 0 1.983-1.695l.004-.004c.364-.3.59-.688.647-1.117c.058-.436-.07-.85-.3-1.17a1.7 1.7 0 0 0-2.335-.42q-.296.21-.579.416c-.571.414-1.122.814-1.713 1.149c-.77.437-1.523.712-2.31.712H10.5c-.2 0-.283-.062-.312-.092a.2.2 0 0 1-.06-.151a.2.2 0 0 1 .06-.152c.03-.03.112-.092.312-.092h2.002c.533 0 1.006-.167 1.354-.489a1.616 1.616 0 0 0 0-2.376c-.348-.322-.821-.49-1.354-.49z"
    />
  </Svg>
);

const Plus = ({ color = '#000000', size = 26 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M18 10h-4V6a2 2 0 0 0-4 0l.071 4H6a2 2 0 0 0 0 4l4.071-.071L10 18a2 2 0 0 0 4 0v-4.071L18 14a2 2 0 0 0 0-4z"
    />
  </Svg>
);

const KeyboardFill = ({ color = '#000000', size = 26 }) => (
  <Svg width={size} height={size} viewBox="0 0 16 16">
    <Path
      fill={color}
      d="M0 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6zm13 .25v.5c0 .138.112.25.25.25h.5a.25.25 0 0 0 .25-.25v-.5a.25.25 0 0 0-.25-.25h-.5a.25.25 0 0 0-.25.25zM2.25 8a.25.25 0 0 0-.25.25v.5c0 .138.112.25.25.25h.5A.25.25 0 0 0 3 8.75v-.5A.25.25 0 0 0 2.75 8h-.5zM4 8.25v.5c0 .138.112.25.25.25h.5A.25.25 0 0 0 5 8.75v-.5A.25.25 0 0 0 4.75 8h-.5a.25.25 0 0 0-.25.25zM6.25 8a.25.25 0 0 0-.25.25v.5c0 .138.112.25.25.25h.5A.25.25 0 0 0 7 8.75v-.5A.25.25 0 0 0 6.75 8h-.5zM8 8.25v.5c0 .138.112.25.25.25h.5A.25.25 0 0 0 9 8.75v-.5A.25.25 0 0 0 8.75 8h-.5a.25.25 0 0 0-.25.25zM13.25 8a.25.25 0 0 0-.25.25v.5c0 .138.112.25.25.25h.5a.25.25 0 0 0 .25-.25v-.5a.25.25 0 0 0-.25-.25h-.5zm0 2a.25.25 0 0 0-.25.25v.5c0 .138.112.25.25.25h.5a.25.25 0 0 0 .25-.25v-.5a.25.25 0 0 0-.25-.25h-.5zm-3-2a.25.25 0 0 0-.25.25v.5c0 .138.112.25.25.25h1.5a.25.25 0 0 0 .25-.25v-.5a.25.25 0 0 0-.25-.25h-1.5zm.75 2.25v.5c0 .138.112.25.25.25h.5a.25.25 0 0 0 .25-.25v-.5a.25.25 0 0 0-.25-.25h-.5a.25.25 0 0 0-.25.25zM11.25 6a.25.25 0 0 0-.25.25v.5c0 .138.112.25.25.25h.5a.25.25 0 0 0 .25-.25v-.5a.25.25 0 0 0-.25-.25h-.5zM9 6.25v.5c0 .138.112.25.25.25h.5a.25.25 0 0 0 .25-.25v-.5A.25.25 0 0 0 9.75 6h-.5a.25.25 0 0 0-.25.25zM7.25 6a.25.25 0 0 0-.25.25v.5c0 .138.112.25.25.25h.5A.25.25 0 0 0 8 6.75v-.5A.25.25 0 0 0 7.75 6h-.5zM5 6.25v.5c0 .138.112.25.25.25h.5A.25.25 0 0 0 6 6.75v-.5A.25.25 0 0 0 5.75 6h-.5a.25.25 0 0 0-.25.25zM2.25 6a.25.25 0 0 0-.25.25v.5c0 .138.112.25.25.25h1.5A.25.25 0 0 0 4 6.75v-.5A.25.25 0 0 0 3.75 6h-1.5zM2 10.25v.5c0 .138.112.25.25.25h.5a.25.25 0 0 0 .25-.25v-.5a.25.25 0 0 0-.25-.25h-.5a.25.25 0 0 0-.25.25zM4.25 10a.25.25 0 0 0-.25.25v.5c0 .138.112.25.25.25h5.5a.25.25 0 0 0 .25-.25v-.5a.25.25 0 0 0-.25-.25h-5.5z"
    />
  </Svg>
);

const Search = ({ color = '#000000', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 512 512">
    <Path
      fill={color}
      d="M416 208c0 45.9-14.9 88.3-40 122.7l126.6 126.7c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.1-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0s208 93.1 208 208M208 352a144 144 0 1 0 0-288a144 144 0 1 0 0 288"
    />
  </Svg>
);

const MoreVertical = ({ color = '#000000', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2s-2 .9-2 2s.9 2 2 2m0 2c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2m0 6c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2"
    />
  </Svg>
);

const Copy = ({ color = '#000000', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 512 512">
    <Path
      fill={color}
      d="M408 480H184a72 72 0 0 1-72-72V184a72 72 0 0 1 72-72h224a72 72 0 0 1 72 72v224a72 72 0 0 1-72 72Z"
    />
    <Path
      fill={color}
      d="M160 80h235.88A72.12 72.12 0 0 0 328 32H104a72 72 0 0 0-72 72v224a72.12 72.12 0 0 0 48 67.88V160a80 80 0 0 1 80-80Z"
    />
  </Svg>
);

const Reply = ({ color = '#000000', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <G fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11 5a1 1 0 0 0-1.707-.707l-7 7a1 1 0 0 0 0 1.414l7 7A1 1 0 0 0 11 19v-3.025c1.691-.011 3.83.133 5.633.583c1.088.27 1.973.633 2.565 1.076c.567.424.802.864.802 1.366a1 1 0 1 0 2 0c0-1.925-.598-4.66-2.42-6.937c-1.719-2.15-4.462-3.805-8.58-4.036V5z"
        fill={color}
      />
    </G>
  </Svg>
);

const Download2Rounded = ({ color = '#000000', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M5 20h14q.425 0 .713.288T20 21q0 .425-.288.713T19 22H5q-.425 0-.713-.288T4 21q0-.425.288-.713T5 20Zm7-2.625q-.225 0-.438-.1t-.362-.3l-4.95-6.35q-.375-.5-.1-1.063T7.05 9H9V3q0-.425.288-.713T10 2h4q.425 0 .713.288T15 3v6h1.95q.625 0 .9.563t-.1 1.062l-4.95 6.35q-.15.2-.363.3t-.437.1Z"
    />
  </Svg>
);

const Pencil = ({ color = '#FFFFFF', size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <G fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.586 3a2 2 0 0 1 2.828 0L21 5.586a2 2 0 0 1 0 2.828L19.414 10L14 4.586L15.586 3zm-3 3l-9 9A2 2 0 0 0 3 16.414V19a2 2 0 0 0 2 2h2.586A2 2 0 0 0 9 20.414l9-9L12.586 6z"
        fill={color}
      />
    </G>
  </Svg>
);

const CloseCircle = ({ color = '#000000', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17L12 13.41L8.41 17L7 15.59L10.59 12L7 8.41L8.41 7L12 10.59L15.59 7L17 8.41L13.41 12L17 15.59z"
    />
  </Svg>
);

const Close = ({ color = '#000000', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"
    />
  </Svg>
);

// ========================================
// COMPOSANT PRINCIPAL
// ========================================

export default function ChatScreen({ navigation }) {
  const [messageText, setMessageText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showNewOfferModal, setShowNewOfferModal] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [newOfferAmount, setNewOfferAmount] = useState('');
  const [currentOfferAmount, setCurrentOfferAmount] = useState('');
  const [currentProductId, setCurrentProductId] = useState('');
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [isUserSeller, setIsUserSeller] = useState(false);
  const [lastRejectedOffer, setLastRejectedOffer] = useState(null);
  const [use24Hour, setUse24Hour] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [longPressedMessage, setLongPressedMessage] = useState(null);
  const [reportReason, setReportReason] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingOfferId, setEditingOfferId] = useState(null);
  const [highlightedMessageId, setHighlightedMessageId] = useState(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [isUserBlocked, setIsUserBlocked] = useState(false);

  const flatListRef = useRef(null);
  const textInputRef = useRef(null);
  const tooltipFadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(500)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const attachmentSlideAnim = useRef(new Animated.Value(300)).current;
  const attachmentFadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const colors = {
    background: isDarkMode ? '#0A0A0A' : '#ECECEC',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    textSecondary: isDarkMode ? '#BDBDBD' : '#666666',
    border: isDarkMode ? '#333333' : '#E0E0E0',
    bubbleReceived: isDarkMode ? '#FFFFFF' : '#FFFFFF',
    bubbleReceivedText: isDarkMode ? '#000000' : '#000000',
    bubbleSent: isDarkMode ? '#2C2C2E' : '#3A3A3C',
    bubbleSentText: isDarkMode ? '#FFFFFF' : '#FFFFFF',
    inputBg: isDarkMode ? '#2C2C2E' : '#F0F0F0',
    systemBg: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
    onlineDot: '#4CAF50',
    linkColor: '#3B82F6',
    headerBg: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    deletedBg: isDarkMode ? '#2C2C2E' : '#F5F5F5',
    deletedText: isDarkMode ? '#757575' : '#9E9E9E',
    cardBg: isDarkMode ? '#1F1F1F' : '#FFFFFF',
    modalBg: isDarkMode ? '#1E1E1E' : '#FFFFFF',
  };

  const [conversation] = useState({
    user: {
      username: 'john',
      profileImage: 'https://i.pravatar.cc/150?img=8',
      verified: true,
      isOnline: false,
      lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    product: {
      id: 'p1',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&q=80',
      title: 'Nike Air Force 1 blanches',
      price: '5000',
    },
  });

  const [messages, setMessages] = useState([
    {
      id: '1',
      type: 'system',
      text: 'Conversation démarrée',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: '2',
      type: 'received',
      text: 'Salut ! Le produit est toujours disponible ?',
      timestamp: new Date(Date.now() - 90 * 60 * 1000),
      status: 'read',
    },
    {
      id: '3',
      type: 'sent-with-product',
      text: 'Oui, toujours disponible 👍',
      product: {
        id: 'p1',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&q=80',
        title: 'Nike Air Force 1 blanches',
      },
      timestamp: new Date(Date.now() - 85 * 60 * 1000),
      status: 'read',
      isOnline: false,
    },
    {
      id: '4',
      type: 'received',
      timestamp: new Date(Date.now() - 80 * 60 * 1000),
      status: 'read',
      deleted: true,
      deletedBy: 'other',
      text: 'Ce message a été supprimé.',
    },
    {
      id: '5',
      type: 'offer-sent',
      amount: '4800',
      product: {
        id: 'p1',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&q=80',
        title: 'Nike Air Force 1 blanches',
      },
      timestamp: new Date(Date.now() - 75 * 60 * 1000),
      status: 'read',
      isOnline: false,
    },
    {
      id: '6',
      type: 'offer-received',
      amount: '4700',
      product: {
        id: 'p1',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&q=80',
        title: 'Nike Air Force 1 blanches',
      },
      timestamp: new Date(Date.now() - 70 * 60 * 1000),
      status: 'accepted',
    },
    {
      id: '7',
      type: 'sent',
      text: 'Regarde ce site exemple.com et aussi test.io',
      timestamp: new Date(Date.now() - 65 * 60 * 1000),
      status: 'read',
      isOnline: true,
    },
    {
      id: '8',
      type: 'image-sent',
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
      text: 'Voici les chaussures 👟',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      status: 'read',
      isOnline: true,
    },
    {
      id: '9',
      type: 'system',
      text: isUserSeller ? "Vous avez accepté l'offre" : 'Votre offre a été acceptée',
      timestamp: new Date(Date.now() - 55 * 60 * 1000),
      isOfferAccepted: true,
      linkedOfferId: '6',
    },
  ]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
        setShowAttachmentMenu(false);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (showMenu || showImageModal || showNewOfferModal || showReportModal || showContextMenu) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 500,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showMenu, showImageModal, showNewOfferModal, showReportModal, showContextMenu]);

  useEffect(() => {
    if (showAttachmentMenu && !keyboardVisible) {
      Animated.parallel([
        Animated.timing(attachmentFadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(attachmentSlideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(attachmentFadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(attachmentSlideAnim, {
          toValue: 300,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showAttachmentMenu, keyboardVisible]);

  useEffect(() => {
    if (activeTooltip) {
      Animated.sequence([
        Animated.timing(tooltipFadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(tooltipFadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => setActiveTooltip(null));
    }
  }, [activeTooltip]);

  useEffect(() => {
    if (highlightedMessageId) {
      Animated.sequence([
        Animated.spring(pulseAnim, {
          toValue: 1.05,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(pulseAnim, {
          toValue: 1,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setHighlightedMessageId(null);
      });
    }
  }, [highlightedMessageId]);

  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const getTimeString = (date) => {
    if (use24Hour) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }
  };

  const getLastSeenText = (lastSeen) => {
    if (!lastSeen) return '';

    const now = new Date();
    const diffMs = now - lastSeen;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "vu à l'instant";
    if (diffMins < 60) return `vu il y a ${diffMins} min`;
    if (diffHours < 24) return `vu il y a ${diffHours}h`;
    if (diffDays === 1) return 'vu hier';
    return `vu il y a ${diffDays}j`;
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const showTooltip = (message) => {
    setActiveTooltip(message);
    tooltipFadeAnim.setValue(0);
  };

  const isOfferValid = () => {
    if (!newOfferAmount.trim() || !currentOfferAmount) return false;
    const newAmount = parseFloat(newOfferAmount.replace(/\s/g, ''));
    const currentAmount = parseFloat(currentOfferAmount.replace(/\s/g, ''));

    if (editingOfferId) return newAmount > 0;
    if (isUserSeller) return newAmount > 0;
    if (lastRejectedOffer) return newAmount > parseFloat(lastRejectedOffer.replace(/\s/g, ''));
    return newAmount > currentAmount;
  };

  const hasAcceptedOffer = () => {
    return messages.some(
      (msg) =>
        (msg.type === 'offer-received' || msg.type === 'offer-sent') && msg.status === 'accepted'
    );
  };

  const handleBack = () => {
    if (navigation) {
      navigation.goBack();
    } else {
      alert('Retour');
    }
  };

  const handleProductPress = () => {
    alert('Ouvrir Product Detail');
  };

  const handleMenuAction = (action) => {
    setShowMenu(false);
    if (action === 'profile') {
      alert('Voir le profil');
    } else if (action === 'block') {
      if (isUserBlocked) {
        Alert.alert(
          "Débloquer l'utilisateur",
          'Êtes-vous sûr de vouloir débloquer cet utilisateur ?',
          [
            { text: 'Annuler', style: 'cancel' },
            { text: 'Débloquer', onPress: () => setIsUserBlocked(false) },
          ]
        );
      } else {
        Alert.alert("Bloquer l'utilisateur", 'Êtes-vous sûr de vouloir bloquer cet utilisateur ?', [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Bloquer', style: 'destructive', onPress: () => setIsUserBlocked(true) },
        ]);
      }
    } else if (action === 'report') {
      setShowReportModal(true);
    } else if (action === 'delete') {
      Alert.alert(
        'Supprimer la conversation',
        'Êtes-vous sûr de vouloir supprimer cette conversation ?',
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Supprimer',
            style: 'destructive',
            onPress: () => alert('Conversation supprimée'),
          },
        ]
      );
    }
  };

  const handleReplyToMessage = (message) => {
    if (message.deleted) {
      showTooltip('Impossible de répondre à un message supprimé');
      return;
    }
    if (isUserBlocked) {
      showTooltip("Débloquez l'utilisateur pour répondre");
      return;
    }
    setReplyingTo(message);
    setShowAttachmentMenu(false);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  const scrollToMessage = (messageId) => {
    const message = messages.find((m) => m.id === messageId);
    const index = messages.findIndex((m) => m.id === messageId);

    if (index !== -1 && flatListRef.current && message && !message.deleted) {
      setHighlightedMessageId(messageId);
      pulseAnim.setValue(1);

      flatListRef.current.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
    } else if (message && message.deleted) {
      showTooltip('Message supprimé');
    }
  };

  const handleSystemMessagePress = (messageId) => {
    const systemMsg = messages.find((m) => m.id === messageId);
    if (systemMsg && systemMsg.isOfferAccepted) {
      const offerIndex = messages.findIndex(
        (m) => (m.type === 'offer-received' || m.type === 'offer-sent') && m.status === 'accepted'
      );
      if (offerIndex !== -1) {
        scrollToMessage(messages[offerIndex].id);
      }
    }
  };

  const handleSendMessage = () => {
    if (isUserBlocked) {
      showTooltip("Débloquez l'utilisateur pour envoyer un message");
      return;
    }

    if (messageText.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        type: 'sent',
        text: messageText.trim(),
        timestamp: new Date(),
        status: 'sent',
        isOnline: false,
        replyTo:
          replyingTo && !replyingTo.deleted
            ? {
                id: replyingTo.id,
                text:
                  replyingTo.text ||
                  (replyingTo.amount ? `Offre de ${formatPrice(replyingTo.amount)} HTG` : ''),
                type: replyingTo.type,
                imageUrl: replyingTo.imageUrl,
                product: replyingTo.product,
                amount: replyingTo.amount,
                latitude: replyingTo.latitude,
                longitude: replyingTo.longitude,
                deleted: false,
              }
            : null,
      };
      setMessages([...messages, newMessage]);
      setMessageText('');
      setReplyingTo(null);
    }
  };

  const handleAttachmentPress = () => {
    if (isUserBlocked) {
      showTooltip("Débloquez l'utilisateur pour envoyer une pièce jointe");
      return;
    }

    if (showAttachmentMenu && !keyboardVisible) {
      textInputRef.current?.focus();
      setShowAttachmentMenu(false);
    } else if (keyboardVisible) {
      Keyboard.dismiss();
      setTimeout(() => {
        setShowAttachmentMenu(true);
      }, 150);
    } else {
      Keyboard.dismiss();
      setTimeout(() => {
        setShowAttachmentMenu(true);
      }, 150);
    }
  };

  const handleAttachmentOption = (option) => {
    setShowAttachmentMenu(false);

    if (option === 'camera') {
      alert('Ouvrir la caméra');
      const newMessage = {
        id: Date.now().toString(),
        type: 'image-sent',
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
        text: '',
        timestamp: new Date(),
        status: 'sent',
        isOnline: false,
      };
      setMessages([...messages, newMessage]);
    } else if (option === 'gallery') {
      alert('Ouvrir la galerie');
      const newMessage = {
        id: Date.now().toString(),
        type: 'image-sent',
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
        text: '',
        timestamp: new Date(),
        status: 'sent',
        isOnline: false,
      };
      setMessages([...messages, newMessage]);
    } else if (option === 'location') {
      const newMessage = {
        id: Date.now().toString(),
        type: 'location-sent',
        latitude: 18.5944,
        longitude: -72.3074,
        timestamp: new Date(),
        status: 'sent',
        isOnline: false,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        senderProfileImage: 'https://i.pravatar.cc/150?img=1',
        senderUsername: 'Moi',
      };
      setMessages([...messages, newMessage]);
    }
  };

  const getLastSentOfferIndex = () => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (
        messages[i].type === 'offer-sent' &&
        messages[i].status !== 'superseded' &&
        !messages[i].deleted
      ) {
        return i;
      }
    }
    return -1;
  };

  const hasReceivedOfferAfterLastSent = () => {
    const lastSentIndex = getLastSentOfferIndex();
    if (lastSentIndex === -1) return false;

    for (let i = lastSentIndex + 1; i < messages.length; i++) {
      if (messages[i].type === 'offer-received') {
        return true;
      }
    }
    return false;
  };

  const handleOfferAction = (messageId, action, isSeller = false, productId = '') => {
    if (action === 'accept') {
      const acceptMessage = {
        id: Date.now().toString(),
        type: 'system',
        text: isSeller ? "Vous avez accepté l'offre" : 'Votre offre a été acceptée',
        timestamp: new Date(),
        isOfferAccepted: true,
        linkedOfferId: messageId,
      };
      setMessages([
        ...messages.map((msg) => (msg.id === messageId ? { ...msg, status: 'accepted' } : msg)),
        acceptMessage,
      ]);
    } else if (action === 'new-offer') {
      const originalOffer = messages.find((msg) => msg.id === messageId);
      if (originalOffer) {
        setCurrentOfferAmount(originalOffer.amount);
        setCurrentProductId(originalOffer.product?.id || productId);
      }
      setShowNewOfferModal(true);
    } else if (action === 'edit-offer') {
      if (hasAcceptedOffer()) {
        showTooltip('Impossible de modifier : une offre a été acceptée');
        return;
      }

      const lastOfferIndex = getLastSentOfferIndex();
      const originalOffer = messages[lastOfferIndex];

      if (hasReceivedOfferAfterLastSent()) {
        showTooltip('Impossible de modifier : une offre a été reçue');
        return;
      }

      if (originalOffer && originalOffer.id === messageId) {
        setEditingOfferId(messageId);
        setNewOfferAmount(originalOffer.amount);
        setCurrentOfferAmount(originalOffer.amount);
        setCurrentProductId(originalOffer.product?.id || productId);
        setShowNewOfferModal(true);
      } else {
        showTooltip('Vous pouvez modifier uniquement la dernière offre');
      }
    }
  };

  const handleSendNewOffer = () => {
    if (!isOfferValid()) {
      return;
    }

    if (editingOfferId) {
      const updatedMessages = messages.filter((msg) => msg.id !== editingOfferId);

      const newOfferMessage = {
        id: Date.now().toString(),
        type: 'offer-sent',
        amount: newOfferAmount.trim(),
        product: conversation.product,
        timestamp: new Date(),
        status: 'sent',
        isOnline: false,
      };

      setMessages([...updatedMessages, newOfferMessage]);
    } else {
      const updatedMessages = messages.map((msg) => {
        if (
          (msg.type === 'offer-sent' || msg.type === 'offer-received') &&
          msg.product?.id === currentProductId &&
          msg.status === 'pending'
        ) {
          return { ...msg, status: 'superseded' };
        }
        return msg;
      });

      const newOfferMessage = {
        id: Date.now().toString(),
        type: 'offer-sent',
        amount: newOfferAmount.trim(),
        product: conversation.product,
        timestamp: new Date(),
        status: 'sent',
        isOnline: false,
      };

      setMessages([...updatedMessages, newOfferMessage]);
    }

    setNewOfferAmount('');
    setCurrentOfferAmount('');
    setCurrentProductId('');
    setEditingOfferId(null);
    setShowNewOfferModal(false);
  };

  const handleImagePress = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const handleLocationPress = (location) => {
    const now = new Date();
    if (now > location.expiresAt) {
      Alert.alert('Position expirée', "Cette position n'est plus disponible.");
      return;
    }

    if (navigation) {
      navigation.navigate('MapScreen', {
        latitude: location.latitude,
        longitude: location.longitude,
        senderProfileImage: location.senderProfileImage,
        senderUsername: location.senderUsername,
        expiresAt: location.expiresAt,
      });
    } else {
      alert('Navigation vers MapScreen');
    }
  };

  const handleLinkPress = (url) => {
    let finalUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      finalUrl = 'https://' + url;
    }
    Linking.openURL(finalUrl).catch(() => {
      showTooltip("Impossible d'ouvrir le lien");
    });
  };

  const handleLongPress = (message) => {
    setLongPressedMessage(message);
    setShowContextMenu(true);
  };

  const handleContextMenuAction = (action) => {
    setShowContextMenu(false);

    if (action === 'delete-me') {
      Alert.alert('Supprimer le message', 'Supprimer ce message pour vous ?', [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            setMessages(messages.filter((m) => m.id !== longPressedMessage.id));
            setLongPressedMessage(null);
          },
        },
      ]);
    } else if (action === 'delete-all') {
      Alert.alert('Supprimer le message', 'Supprimer ce message pour tout le monde ?', [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            const messageType = longPressedMessage.type;
            const isSentByMe = messageType.includes('sent');

            setMessages(
              messages.map((m) =>
                m.id === longPressedMessage.id
                  ? {
                      ...m,
                      deleted: true,
                      deletedBy: isSentByMe ? 'me' : 'other',
                      text: isSentByMe
                        ? 'Vous avez supprimé ce message.'
                        : 'Ce message a été supprimé.',
                      imageUrl: null,
                      amount: null,
                      latitude: null,
                      longitude: null,
                      product: null,
                      replyTo: null,
                      expiresAt: null,
                      senderProfileImage: null,
                      senderUsername: null,
                    }
                  : m
              )
            );
            setLongPressedMessage(null);
          },
        },
      ]);
    } else if (action === 'delete-permanent') {
      Alert.alert('Supprimer définitivement', 'Voulez-vous supprimer définitivement ce message ?', [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            setMessages(messages.filter((m) => m.id !== longPressedMessage.id));
            setLongPressedMessage(null);
          },
        },
      ]);
    } else if (action === 'copy') {
      if (longPressedMessage.text && !longPressedMessage.deleted) {
        Clipboard.setString(longPressedMessage.text);
        showTooltip('Texte copié');
      }
      setLongPressedMessage(null);
    } else if (action === 'reply') {
      handleReplyToMessage(longPressedMessage);
      setLongPressedMessage(null);
    } else if (action === 'download') {
      if (longPressedMessage.imageUrl) {
        alert("Téléchargement de l'image...");
        showTooltip('Image téléchargée');
      }
      setLongPressedMessage(null);
    }
  };

  const handleReport = () => {
    if (!reportReason.trim()) {
      Alert.alert('Erreur', 'Veuillez sélectionner une raison');
      return;
    }

    setShowReportModal(false);
    setReportReason('');
    Alert.alert(
      'Signalement envoyé',
      'Merci pour votre signalement. Notre équipe va examiner votre demande.'
    );
  };

  const isLink = (text) => {
    return /^((https?:\/\/)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+)$/.test(text);
  };

  const renderTextWithLinks = (text, style, isDeleted = false) => {
    if (isDeleted) {
      return <Text style={[style, { fontStyle: 'italic' }]}>{text}</Text>;
    }

    const words = text.split(/(\s+)/);

    return (
      <Text style={style}>
        {words.map((word, index) => {
          const trimmedWord = word.trim();
          if (trimmedWord && isLink(trimmedWord)) {
            return (
              <Text key={index}>
                <Text
                  style={{ color: colors.linkColor, textDecorationLine: 'underline' }}
                  onPress={() => handleLinkPress(trimmedWord)}
                >
                  {trimmedWord}
                </Text>
                {word !== trimmedWord ? word.replace(trimmedWord, '') : ''}
              </Text>
            );
          }
          return <Text key={index}>{word}</Text>;
        })}
      </Text>
    );
  };

  const SwipeableMessage = ({ children, message, onSwipeRight }) => {
    const translateX = useRef(new Animated.Value(0)).current;

    const handlePanResponderMove = (evt, gestureState) => {
      if (gestureState.dx > 0 && gestureState.dx <= 80) {
        translateX.setValue(gestureState.dx);
      }
    };

    const handlePanResponderRelease = (evt, gestureState) => {
      if (gestureState.dx > 50) {
        onSwipeRight(message);
      }

      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 10,
      }).start();
    };

    return (
      <Animated.View
        style={{ transform: [{ translateX }] }}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderMove={handlePanResponderMove}
        onResponderRelease={handlePanResponderRelease}
      >
        {children}
      </Animated.View>
    );
  };

  const closeAllModals = () => {
    setShowMenu(false);
    setShowImageModal(false);
    setShowNewOfferModal(false);
    setShowReportModal(false);
    setShowContextMenu(false);
    setShowSearchBar(false);
    Keyboard.dismiss();
  };

  const getTimeRemaining = (expiresAt) => {
    const now = new Date();
    const diffMs = expiresAt - now;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins <= 0) return 'Expiré';
    if (diffMins === 1) return 'Expire dans 1 min';
    return `Expire dans ${diffMins} min`;
  };

  const renderMessage = ({ item }) => {
    const isHighlighted = highlightedMessageId === item.id;

    if (item.type === 'system') {
      return (
        <TouchableOpacity
          style={styles.systemMessageContainer}
          onPress={() => item.isOfferAccepted && handleSystemMessagePress(item.id)}
          disabled={!item.isOfferAccepted}
        >
          <View style={styles.systemMessage}>
            <Text
              style={[
                styles.systemMessageText,
                { backgroundColor: colors.systemBg, color: colors.textSecondary },
                item.isOfferAccepted && styles.offerAcceptedSystem,
              ]}
            >
              {item.text}
            </Text>
            <Text style={[styles.systemMessageTime, { color: colors.textSecondary }]}>
              {getTimeString(item.timestamp)}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }

    if (item.deleted) {
      const isSentByMe = item.type?.includes('sent');

      return (
        <View style={[styles.messageRow, isSentByMe && styles.sentMessageRow]}>
          <View
            style={[
              styles.messageBubble,
              isSentByMe ? styles.sentBubble : styles.receivedBubble,
              { backgroundColor: colors.deletedBg },
              styles.bubbleShadow,
            ]}
          >
            <TouchableOpacity
              onLongPress={() => handleLongPress(item)}
              delayLongPress={500}
              activeOpacity={0.9}
            >
              <Text style={[styles.deletedText, { color: colors.deletedText }]}>{item.text}</Text>
              <Text
                style={[
                  isSentByMe ? styles.sentTime : styles.receivedTime,
                  { color: colors.deletedText },
                ]}
              >
                {getTimeString(item.timestamp)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    if (item.type === 'received') {
      return (
        <SwipeableMessage message={item} onSwipeRight={handleReplyToMessage}>
          <TouchableOpacity
            style={styles.messageRow}
            onLongPress={() => handleLongPress(item)}
            delayLongPress={500}
            activeOpacity={0.9}
          >
            <Animated.View style={{ transform: [{ scale: isHighlighted ? pulseAnim : 1 }] }}>
              <View
                style={[
                  styles.messageBubble,
                  styles.receivedBubble,
                  { backgroundColor: colors.bubbleReceived },
                  styles.bubbleShadow,
                ]}
              >
                {item.replyTo && (
                  <TouchableOpacity
                    style={[styles.replyPreview, { backgroundColor: 'rgba(0, 0, 0, 0.05)' }]}
                    onPress={() => scrollToMessage(item.replyTo.id)}
                    disabled={item.replyTo.deleted}
                  >
                    <View
                      style={[styles.replyLine, { backgroundColor: colors.bubbleReceivedText }]}
                    />
                    <View style={styles.replyContent}>
                      {!item.replyTo.deleted && item.replyTo.imageUrl && (
                        <Image
                          source={{ uri: item.replyTo.imageUrl }}
                          style={styles.replyThumbnail}
                        />
                      )}
                      {!item.replyTo.deleted && item.replyTo.product && (
                        <Image
                          source={{ uri: item.replyTo.product.image }}
                          style={styles.replyThumbnail}
                        />
                      )}
                      <Text
                        style={[
                          styles.replyText,
                          {
                            color: colors.textSecondary,
                            fontStyle: item.replyTo.deleted ? 'italic' : 'normal',
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {item.replyTo.deleted
                          ? 'Message supprimé'
                          : item.replyTo.text ||
                            (item.replyTo.amount
                              ? `Offre ${formatPrice(item.replyTo.amount)} HTG`
                              : item.replyTo.imageUrl
                                ? 'Photo'
                                : item.replyTo.latitude
                                  ? 'Position'
                                  : 'Message')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                {renderTextWithLinks(item.text, [
                  styles.receivedText,
                  { color: colors.bubbleReceivedText },
                ])}
                <Text style={[styles.receivedTime, { color: colors.textSecondary }]}>
                  {getTimeString(item.timestamp)}
                </Text>
              </View>
            </Animated.View>
          </TouchableOpacity>
        </SwipeableMessage>
      );
    }

    if (item.type === 'sent') {
      const showReadStatus = item.status === 'read';
      const showDoubleCheck = item.isOnline;

      return (
        <SwipeableMessage message={item} onSwipeRight={handleReplyToMessage}>
          <TouchableOpacity
            style={[styles.messageRow, styles.sentMessageRow]}
            onLongPress={() => handleLongPress(item)}
            delayLongPress={500}
            activeOpacity={0.9}
          >
            <Animated.View style={{ transform: [{ scale: isHighlighted ? pulseAnim : 1 }] }}>
              <View
                style={[
                  styles.messageBubble,
                  styles.sentBubble,
                  { backgroundColor: colors.bubbleSent },
                  styles.bubbleShadow,
                ]}
              >
                {item.replyTo && (
                  <TouchableOpacity
                    style={[styles.replyPreviewSent, { backgroundColor: 'rgba(0, 0, 0, 0.2)' }]}
                    onPress={() => scrollToMessage(item.replyTo.id)}
                    disabled={item.replyTo.deleted}
                  >
                    <View
                      style={[styles.replyLineSent, { backgroundColor: colors.bubbleSentText }]}
                    />
                    <View style={styles.replyContent}>
                      {!item.replyTo.deleted && item.replyTo.imageUrl && (
                        <Image
                          source={{ uri: item.replyTo.imageUrl }}
                          style={styles.replyThumbnail}
                        />
                      )}
                      {!item.replyTo.deleted && item.replyTo.product && (
                        <Image
                          source={{ uri: item.replyTo.product.image }}
                          style={styles.replyThumbnail}
                        />
                      )}
                      <Text
                        style={[
                          styles.replyTextSent,
                          {
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontStyle: item.replyTo.deleted ? 'italic' : 'normal',
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {item.replyTo.deleted
                          ? 'Message supprimé'
                          : item.replyTo.text ||
                            (item.replyTo.amount
                              ? `Offre ${formatPrice(item.replyTo.amount)} HTG`
                              : item.replyTo.imageUrl
                                ? 'Photo'
                                : item.replyTo.latitude
                                  ? 'Position'
                                  : 'Message')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                {renderTextWithLinks(item.text, [
                  styles.sentText,
                  { color: colors.bubbleSentText },
                ])}
                <View style={styles.sentTimeRow}>
                  <Text style={[styles.sentTime, { color: 'rgba(255, 255, 255, 0.7)' }]}>
                    {getTimeString(item.timestamp)}
                  </Text>
                  {showReadStatus ? (
                    <CheckAll color="#3B82F6" size={16} />
                  ) : showDoubleCheck ? (
                    <CheckAll color="rgba(255, 255, 255, 0.7)" size={16} />
                  ) : (
                    <Check color="rgba(255, 255, 255, 0.7)" size={16} />
                  )}
                </View>
              </View>
            </Animated.View>
          </TouchableOpacity>
        </SwipeableMessage>
      );
    }

    if (item.type === 'sent-with-product') {
      const showReadStatus = item.status === 'read';
      const showDoubleCheck = item.isOnline;

      return (
        <SwipeableMessage message={item} onSwipeRight={handleReplyToMessage}>
          <TouchableOpacity
            style={[styles.messageRow, styles.sentMessageRow]}
            onLongPress={() => handleLongPress(item)}
            delayLongPress={500}
            activeOpacity={0.9}
          >
            <View style={styles.productMessageContainer}>
              <TouchableOpacity
                style={[
                  styles.productMessageCard,
                  { backgroundColor: colors.inputBg, borderColor: colors.border },
                ]}
                onPress={handleProductPress}
              >
                <Image source={{ uri: item.product.image }} style={styles.productMessageImage} />
                <Text
                  style={[styles.productMessageTitle, { color: colors.text }]}
                  numberOfLines={1}
                >
                  {item.product.title}
                </Text>
              </TouchableOpacity>
              <Animated.View style={{ transform: [{ scale: isHighlighted ? pulseAnim : 1 }] }}>
                <View
                  style={[
                    styles.messageBubble,
                    styles.sentBubble,
                    styles.messageBubbleWithProduct,
                    { backgroundColor: colors.bubbleSent },
                    styles.bubbleShadow,
                  ]}
                >
                  <Text style={[styles.sentText, { color: colors.bubbleSentText }]}>
                    {item.text}
                  </Text>
                  <View style={styles.sentTimeRow}>
                    <Text style={[styles.sentTime, { color: 'rgba(255, 255, 255, 0.7)' }]}>
                      {getTimeString(item.timestamp)}
                    </Text>
                    {showReadStatus ? (
                      <CheckAll color="#3B82F6" size={16} />
                    ) : showDoubleCheck ? (
                      <CheckAll color="rgba(255, 255, 255, 0.7)" size={16} />
                    ) : (
                      <Check color="rgba(255, 255, 255, 0.7)" size={16} />
                    )}
                  </View>
                </View>
              </Animated.View>
            </View>
          </TouchableOpacity>
        </SwipeableMessage>
      );
    }

    if (item.type === 'offer-sent') {
      const lastOfferIndex = getLastSentOfferIndex();
      const isLastOffer = messages[lastOfferIndex]?.id === item.id;
      const canEdit =
        isLastOffer &&
        !hasReceivedOfferAfterLastSent() &&
        item.status !== 'accepted' &&
        !hasAcceptedOffer();
      const showReadStatus = item.status === 'read';
      const showDoubleCheck = item.isOnline;

      return (
        <SwipeableMessage message={item} onSwipeRight={handleReplyToMessage}>
          <TouchableOpacity
            style={[styles.messageRow, styles.sentMessageRow]}
            onPress={handleProductPress}
            onLongPress={() => handleLongPress(item)}
            delayLongPress={500}
            activeOpacity={0.8}
          >
            <Animated.View style={{ transform: [{ scale: isHighlighted ? pulseAnim : 1 }] }}>
              <View
                style={[
                  styles.offerCard,
                  styles.offerSent,
                  { backgroundColor: colors.bubbleSent, borderColor: colors.bubbleSent },
                  styles.bubbleShadow,
                ]}
              >
                <View style={[styles.offerProductCard, { backgroundColor: 'rgba(0, 0, 0, 0.2)' }]}>
                  <Image source={{ uri: item.product.image }} style={styles.offerProductImage} />
                  <Text
                    style={[styles.offerProductTitle, { color: colors.bubbleSentText }]}
                    numberOfLines={1}
                  >
                    {item.product.title}
                  </Text>
                </View>
                <View style={styles.offerLabelRow}>
                  <HandHoldingDollarSolid color="rgba(255, 255, 255, 0.7)" size={16} />
                  <Text style={[styles.offerLabel, { color: 'rgba(255, 255, 255, 0.7)' }]}>
                    Offre envoyée
                  </Text>
                </View>
                <Text style={[styles.offerAmount, { color: colors.bubbleSentText }]}>
                  {formatPrice(item.amount)} HTG
                </Text>
                {canEdit && (
                  <TouchableOpacity
                    style={[styles.editOfferButton, { backgroundColor: colors.bubbleSentText }]}
                    onPress={() => handleOfferAction(item.id, 'edit-offer', true, item.product?.id)}
                  >
                    <Pencil color={colors.bubbleSent} size={16} />
                    <Text style={[styles.editOfferText, { color: colors.bubbleSent }]}>
                      Modifier
                    </Text>
                  </TouchableOpacity>
                )}
                <View style={styles.offerTimeRow}>
                  <Text style={[styles.sentTime, { color: 'rgba(255, 255, 255, 0.7)' }]}>
                    {getTimeString(item.timestamp)}
                  </Text>
                  {showReadStatus ? (
                    <CheckAll color="#3B82F6" size={16} />
                  ) : showDoubleCheck ? (
                    <CheckAll color="rgba(255, 255, 255, 0.7)" size={16} />
                  ) : (
                    <Check color="rgba(255, 255, 255, 0.7)" size={16} />
                  )}
                </View>
              </View>
            </Animated.View>
          </TouchableOpacity>
        </SwipeableMessage>
      );
    }

    if (item.type === 'offer-received') {
      return (
        <SwipeableMessage message={item} onSwipeRight={handleReplyToMessage}>
          <TouchableOpacity
            style={styles.messageRow}
            onPress={handleProductPress}
            onLongPress={() =>
              item.status === 'pending'
                ? handleOfferAction(item.id, 'new-offer', false, item.product?.id)
                : handleLongPress(item)
            }
            delayLongPress={500}
            activeOpacity={0.8}
          >
            <Animated.View style={{ transform: [{ scale: isHighlighted ? pulseAnim : 1 }] }}>
              <View
                style={[
                  styles.offerCard,
                  styles.offerReceived,
                  {
                    backgroundColor: colors.bubbleReceived,
                    borderColor: colors.bubbleReceivedText,
                  },
                  styles.bubbleShadow,
                ]}
              >
                <View
                  style={[
                    styles.offerProductCardReceived,
                    { backgroundColor: colors.inputBg, borderColor: colors.border },
                  ]}
                >
                  <Image
                    source={{ uri: item.product.image }}
                    style={styles.offerProductImageReceived}
                  />
                  <Text
                    style={[styles.offerProductTitleReceived, { color: colors.text }]}
                    numberOfLines={1}
                  >
                    {item.product.title}
                  </Text>
                </View>

                <View style={styles.offerLabelRow}>
                  <HandHoldingDollarSolid color={colors.textSecondary} size={16} />
                  <Text style={[styles.offerLabelReceived, { color: colors.textSecondary }]}>
                    Offre reçue
                  </Text>
                </View>
                <Text style={[styles.offerAmountReceived, { color: colors.bubbleReceivedText }]}>
                  {formatPrice(item.amount)} HTG
                </Text>
                <Text style={[styles.receivedTime, { color: colors.textSecondary }]}>
                  {getTimeString(item.timestamp)}
                </Text>

                {item.status === 'pending' && (
                  <View style={styles.offerActions}>
                    <TouchableOpacity
                      style={[
                        styles.offerButton,
                        styles.newOfferButton,
                        { backgroundColor: colors.inputBg, borderColor: colors.border },
                      ]}
                      onPress={() =>
                        handleOfferAction(item.id, 'new-offer', false, item.product?.id)
                      }
                    >
                      <Text style={[styles.newOfferButtonText, { color: colors.text }]}>
                        Nouvelle offre
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.offerButton,
                        styles.acceptButton,
                        { backgroundColor: colors.bubbleReceivedText },
                      ]}
                      onPress={() => handleOfferAction(item.id, 'accept', true, item.product?.id)}
                    >
                      <Text style={[styles.acceptButtonText, { color: colors.bubbleReceived }]}>
                        Accepter
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {item.status === 'accepted' && (
                  <Text style={styles.offerStatusAccepted}>Offre acceptée</Text>
                )}
              </View>
            </Animated.View>
          </TouchableOpacity>
        </SwipeableMessage>
      );
    }

    if (item.type === 'image-sent') {
      const showReadStatus = item.status === 'read';
      const showDoubleCheck = item.isOnline;

      return (
        <SwipeableMessage message={item} onSwipeRight={handleReplyToMessage}>
          <TouchableOpacity
            style={[styles.messageRow, styles.sentMessageRow]}
            onLongPress={() => handleLongPress(item)}
            delayLongPress={500}
            activeOpacity={0.9}
          >
            <Animated.View style={{ transform: [{ scale: isHighlighted ? pulseAnim : 1 }] }}>
              <View
                style={[
                  styles.imageMessageContainer,
                  { backgroundColor: colors.bubbleSent },
                  styles.bubbleShadow,
                ]}
              >
                <TouchableOpacity onPress={() => handleImagePress(item.imageUrl)}>
                  <Image source={{ uri: item.imageUrl }} style={styles.messageImage} />
                </TouchableOpacity>
                {item.text && item.text.trim().length > 0 && (
                  <Text style={[styles.imageMessageText, { color: colors.bubbleSentText }]}>
                    {item.text}
                  </Text>
                )}
                <View style={styles.sentTimeRow}>
                  <Text style={[styles.sentTime, { color: 'rgba(255, 255, 255, 0.7)' }]}>
                    {getTimeString(item.timestamp)}
                  </Text>
                  {showReadStatus ? (
                    <CheckAll color="#3B82F6" size={16} />
                  ) : showDoubleCheck ? (
                    <CheckAll color="rgba(255, 255, 255, 0.7)" size={16} />
                  ) : (
                    <Check color="rgba(255, 255, 255, 0.7)" size={16} />
                  )}
                </View>
              </View>
            </Animated.View>
          </TouchableOpacity>
        </SwipeableMessage>
      );
    }

    if (item.type === 'location-sent') {
      const now = new Date();
      const isExpired = now > item.expiresAt;
      const showReadStatus = item.status === 'read';
      const showDoubleCheck = item.isOnline;

      return (
        <SwipeableMessage message={item} onSwipeRight={handleReplyToMessage}>
          <TouchableOpacity
            style={[styles.messageRow, styles.sentMessageRow]}
            onPress={() => !isExpired && handleLocationPress(item)}
            onLongPress={() => handleLongPress(item)}
            delayLongPress={500}
            activeOpacity={0.8}
          >
            <Animated.View style={{ transform: [{ scale: isHighlighted ? pulseAnim : 1 }] }}>
              <View
                style={[
                  styles.locationMessageContainer,
                  { backgroundColor: colors.bubbleSent, opacity: isExpired ? 0.5 : 1 },
                  styles.bubbleShadow,
                ]}
              >
                <View style={styles.locationMapPreview}>
                  <MapView
                    style={styles.locationMap}
                    initialRegion={{
                      latitude: item.latitude,
                      longitude: item.longitude,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }}
                    scrollEnabled={false}
                    zoomEnabled={false}
                    pitchEnabled={false}
                    rotateEnabled={false}
                    pointerEvents="none"
                  >
                    <Circle
                      center={{ latitude: item.latitude, longitude: item.longitude }}
                      radius={100}
                      fillColor="rgba(59, 130, 246, 0.2)"
                      strokeColor="rgba(59, 130, 246, 0.5)"
                      strokeWidth={2}
                    />
                    <Marker coordinate={{ latitude: item.latitude, longitude: item.longitude }}>
                      <View style={styles.mapMarkerProfile}>
                        <Image
                          source={{ uri: item.senderProfileImage }}
                          style={styles.mapMarkerImage}
                        />
                      </View>
                    </Marker>
                  </MapView>
                </View>
                <Text style={[styles.locationText, { color: colors.bubbleSentText }]}>
                  {isExpired ? 'Position expirée' : 'Position actuelle'}
                </Text>
                {!isExpired && (
                  <Text style={[styles.locationExpiry, { color: 'rgba(255, 255, 255, 0.7)' }]}>
                    {getTimeRemaining(item.expiresAt)}
                  </Text>
                )}
                <View style={styles.sentTimeRow}>
                  <Text style={[styles.sentTime, { color: 'rgba(255, 255, 255, 0.7)' }]}>
                    {getTimeString(item.timestamp)}
                  </Text>
                  {!isExpired &&
                    (showReadStatus ? (
                      <CheckAll color="#3B82F6" size={16} />
                    ) : showDoubleCheck ? (
                      <CheckAll color="rgba(255, 255, 255, 0.7)" size={16} />
                    ) : (
                      <Check color="rgba(255, 255, 255, 0.7)" size={16} />
                    ))}
                </View>
              </View>
            </Animated.View>
          </TouchableOpacity>
        </SwipeableMessage>
      );
    }

    return null;
  };

  const getFilteredMessages = () => {
    if (!searchQuery.trim()) {
      return messages;
    }

    return messages.filter((msg) => {
      if (msg.text && !msg.deleted) {
        return msg.text.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return false;
    });
  };

  const filteredMessages = getFilteredMessages();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.headerBg}
        translucent={false}
      />

      {activeTooltip && (
        <Animated.View style={[styles.tooltip, { opacity: tooltipFadeAnim }]}>
          <Text style={styles.tooltipText}>{activeTooltip}</Text>
        </Animated.View>
      )}

      {/* Modal Actions Menu */}
      <Modal
        visible={showMenu}
        transparent={true}
        animationType="none"
        onRequestClose={closeAllModals}
      >
        <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPress={closeAllModals}>
          <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]} />

          <Animated.View
            style={[
              styles.modalContent,
              { backgroundColor: colors.modalBg, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Actions</Text>
              <TouchableOpacity onPress={closeAllModals}>
                <Close color={colors.text} size={28} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.menuOption} onPress={() => handleMenuAction('profile')}>
              <ProfileFill color={colors.text} size={20} />
              <Text style={[styles.menuOptionText, { color: colors.text }]}>Voir le profil</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuOption} onPress={() => handleMenuAction('block')}>
              <PresenceBlocked16Regular color={colors.text} size={20} />
              <Text style={[styles.menuOptionText, { color: colors.text }]}>
                {isUserBlocked ? 'Débloquer' : 'Bloquer'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuOption} onPress={() => handleMenuAction('report')}>
              <Warning color={colors.text} size={20} />
              <Text style={[styles.menuOptionText, { color: colors.text }]}>Signaler</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuOption, styles.menuOptionLast]}
              onPress={() => handleMenuAction('delete')}
            >
              <Trash color="#EF4444" size={20} />
              <Text style={[styles.menuOptionText, styles.menuOptionTextDanger]}>
                Supprimer la conversation
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      {/* Modal Context Menu */}
      <Modal
        visible={showContextMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={closeAllModals}
      >
        <TouchableOpacity
          style={styles.contextMenuOverlay}
          activeOpacity={1}
          onPress={closeAllModals}
        >
          <View
            style={[
              styles.contextMenu,
              { backgroundColor: colors.modalBg, borderColor: colors.border },
            ]}
          >
            {longPressedMessage?.text && !longPressedMessage?.deleted && (
              <TouchableOpacity
                style={styles.contextMenuItem}
                onPress={() => handleContextMenuAction('copy')}
              >
                <Copy color={colors.text} size={20} />
                <Text style={[styles.contextMenuText, { color: colors.text }]}>Copier</Text>
              </TouchableOpacity>
            )}

            {!longPressedMessage?.deleted && (
              <TouchableOpacity
                style={styles.contextMenuItem}
                onPress={() => handleContextMenuAction('reply')}
              >
                <Reply color={colors.text} size={20} />
                <Text style={[styles.contextMenuText, { color: colors.text }]}>Répondre</Text>
              </TouchableOpacity>
            )}

            {longPressedMessage?.imageUrl && !longPressedMessage?.deleted && (
              <TouchableOpacity
                style={styles.contextMenuItem}
                onPress={() => handleContextMenuAction('download')}
              >
                <Download2Rounded color={colors.text} size={20} />
                <Text style={[styles.contextMenuText, { color: colors.text }]}>Télécharger</Text>
              </TouchableOpacity>
            )}

            {longPressedMessage?.type?.includes('sent') && !longPressedMessage?.deleted && (
              <TouchableOpacity
                style={styles.contextMenuItem}
                onPress={() => handleContextMenuAction('delete-all')}
              >
                <Trash color="#EF4444" size={20} />
                <Text style={[styles.contextMenuText, { color: '#EF4444' }]}>
                  Supprimer pour tout le monde
                </Text>
              </TouchableOpacity>
            )}

            {!longPressedMessage?.deleted && (
              <TouchableOpacity
                style={styles.contextMenuItem}
                onPress={() => handleContextMenuAction('delete-me')}
              >
                <Trash color="#EF4444" size={20} />
                <Text style={[styles.contextMenuText, { color: '#EF4444' }]}>
                  Supprimer pour moi
                </Text>
              </TouchableOpacity>
            )}

            {longPressedMessage?.deleted && (
              <TouchableOpacity
                style={[styles.contextMenuItem, styles.contextMenuItemLast]}
                onPress={() => handleContextMenuAction('delete-permanent')}
              >
                <Trash color="#EF4444" size={20} />
                <Text style={[styles.contextMenuText, { color: '#EF4444' }]}>
                  Supprimer définitivement
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal Report */}
      <Modal
        visible={showReportModal}
        transparent={true}
        animationType="none"
        onRequestClose={closeAllModals}
      >
        <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPress={closeAllModals}>
          <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]} />

          <Animated.View
            style={[
              styles.modalContent,
              { backgroundColor: colors.modalBg, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Signaler</Text>
              <TouchableOpacity onPress={closeAllModals}>
                <Close color={colors.text} size={28} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.reportOptions}>
              {['Spam', 'Contenu inapproprié', 'Harcèlement', 'Arnaque', 'Faux profil'].map(
                (reason, index, array) => (
                  <TouchableOpacity
                    key={reason}
                    style={[
                      styles.reportOption,
                      index === array.length - 1 && styles.reportOptionLast,
                    ]}
                    onPress={() => setReportReason(reason)}
                  >
                    <Text style={[styles.reportOptionText, { color: colors.text }]}>{reason}</Text>
                    {reportReason === reason && (
                      <View style={[styles.reportCheck, { backgroundColor: colors.text }]}>
                        <Text style={[styles.reportCheckIcon, { color: colors.background }]}>
                          ✓
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                )
              )}
            </ScrollView>

            <TouchableOpacity
              style={[styles.reportSubmit, { backgroundColor: colors.text }]}
              onPress={handleReport}
            >
              <Text style={[styles.reportSubmitText, { color: colors.background }]}>
                Envoyer le signalement
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      {/* Modal Nouvelle Offre */}
      <Modal
        visible={showNewOfferModal}
        transparent={true}
        animationType="none"
        onRequestClose={() => {
          Keyboard.dismiss();
          setShowNewOfferModal(false);
          setNewOfferAmount('');
          setEditingOfferId(null);
        }}
        statusBarTranslucent={false}
      >
        <TouchableOpacity
          style={styles.modalFullOverlay}
          activeOpacity={1}
          onPress={() => {
            Keyboard.dismiss();
            setShowNewOfferModal(false);
            setNewOfferAmount('');
            setEditingOfferId(null);
          }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidContainer}
          >
            <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
              <Animated.View
                style={[
                  styles.modalContentOffer,
                  { backgroundColor: colors.modalBg, transform: [{ translateY: slideAnim }] },
                ]}
              >
                <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                  <Text style={[styles.modalTitle, { color: colors.text }]}>
                    {editingOfferId ? "Modifier l'offre" : 'Faire une nouvelle offre'}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      Keyboard.dismiss();
                      setShowNewOfferModal(false);
                      setNewOfferAmount('');
                      setEditingOfferId(null);
                    }}
                  >
                    <Close color={colors.text} size={28} />
                  </TouchableOpacity>
                </View>

                <View style={styles.offerModalContent}>
                  <Text style={[styles.offerModalLabel, { color: colors.text }]}>
                    Montant de votre offre
                  </Text>
                  {!isUserSeller && lastRejectedOffer && !editingOfferId ? (
                    <Text style={styles.offerModalHint}>
                      Doit être supérieure à {formatPrice(lastRejectedOffer)} HTG (dernière offre
                      refusée)
                    </Text>
                  ) : currentOfferAmount && !isUserSeller && !editingOfferId ? (
                    <Text style={styles.offerModalHint}>
                      Doit être supérieure à {formatPrice(currentOfferAmount)} HTG
                    </Text>
                  ) : null}

                  <View style={[styles.offerInputContainer, { backgroundColor: colors.inputBg }]}>
                    <TextInput
                      style={[styles.offerInputField, { color: colors.text }]}
                      placeholder="Ex: 4 800"
                      placeholderTextColor={colors.textSecondary}
                      keyboardType="numeric"
                      value={newOfferAmount}
                      onChangeText={setNewOfferAmount}
                      autoFocus
                    />
                    <Text style={[styles.currencyLabel, { color: colors.textSecondary }]}>HTG</Text>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.sendOfferButton,
                      { backgroundColor: colors.text },
                      !isOfferValid() && styles.sendOfferButtonDisabled,
                    ]}
                    onPress={handleSendNewOffer}
                    disabled={!isOfferValid()}
                  >
                    <Text style={[styles.sendOfferButtonText, { color: colors.background }]}>
                      {editingOfferId ? "Modifier l'offre" : 'Envoyer la nouvelle offre'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </TouchableOpacity>
      </Modal>

      {/* Modal Image */}
      <Modal
        visible={showImageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeAllModals}
      >
        <View style={styles.imageModalContainer}>
          <TouchableOpacity style={styles.imageModalClose} onPress={closeAllModals}>
            <Close color="#FFFFFF" size={32} />
          </TouchableOpacity>
          {selectedImage && (
            <Image source={{ uri: selectedImage }} style={styles.fullImage} resizeMode="contain" />
          )}
        </View>
      </Modal>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.contentContainer}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <SafeAreaView style={{ backgroundColor: colors.headerBg }} edges={['top']}>
          <View
            style={[
              styles.header,
              { backgroundColor: colors.headerBg, borderBottomColor: colors.border },
            ]}
          >
            <TouchableOpacity onPress={handleBack}>
              <ArrowBackIosRounded color={colors.text} size={24} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.headerUser} onPress={() => handleMenuAction('profile')}>
              <View style={styles.headerProfileContainer}>
                <Image
                  source={{ uri: conversation.user.profileImage }}
                  style={styles.headerProfileImage}
                />
                {conversation.user.isOnline && (
                  <View style={[styles.headerOnlineDot, { backgroundColor: colors.onlineDot }]} />
                )}
              </View>
              <View style={styles.headerUserInfo}>
                <View style={styles.headerUserNameRow}>
                  <Text style={[styles.headerUserName, { color: colors.text }]}>
                    {conversation.user.username}
                  </Text>
                  {conversation.user.verified && <VerifiedCheckFill color="#3B82F6" size={14} />}
                </View>
                <Text style={[styles.headerUserStatus, { color: colors.textSecondary }]}>
                  {isTyping
                    ? "en train d'écrire..."
                    : conversation.user.isOnline
                      ? 'En ligne'
                      : getLastSeenText(conversation.user.lastSeen)}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setShowSearchBar(!showSearchBar);
                if (!showSearchBar) {
                  setSearchQuery('');
                }
              }}
              style={styles.searchButton}
            >
              <Search color={colors.text} size={20} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowMenu(true)} style={styles.menuButton}>
              <MoreVertical color={colors.text} size={24} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* Search Bar */}
        {showSearchBar && (
          <View
            style={[
              styles.searchBarContainer,
              { backgroundColor: colors.inputBg, borderBottomColor: colors.border },
            ]}
          >
            <Search color={colors.textSecondary} size={18} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Rechercher dans la conversation..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            <TouchableOpacity
              onPress={() => {
                setSearchQuery('');
                setShowSearchBar(false);
              }}
            >
              <CloseCircle color={colors.textSecondary} size={20} />
            </TouchableOpacity>
          </View>
        )}

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={filteredMessages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={true}
          onScrollToIndexFailed={(info) => {
            const wait = new Promise((resolve) => setTimeout(resolve, 500));
            wait.then(() => {
              flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
            });
          }}
        />

        {/* Reply Preview */}
        {replyingTo && !isUserBlocked && (
          <View
            style={[
              styles.replyPreviewContainer,
              { backgroundColor: colors.inputBg, borderTopColor: colors.border },
            ]}
          >
            <View style={styles.replyPreviewContent}>
              <View style={[styles.replyPreviewLine, { backgroundColor: colors.text }]} />
              <View style={styles.replyPreviewTextContainer}>
                <Text style={[styles.replyPreviewLabel, { color: colors.textSecondary }]}>
                  Répondre à
                </Text>
                {!replyingTo.deleted && replyingTo.imageUrl && (
                  <Image source={{ uri: replyingTo.imageUrl }} style={styles.replyPreviewImage} />
                )}
                {!replyingTo.deleted && replyingTo.product && (
                  <Image
                    source={{ uri: replyingTo.product.image }}
                    style={styles.replyPreviewImage}
                  />
                )}
                <Text
                  style={[
                    styles.replyPreviewMessage,
                    { color: colors.text, fontStyle: replyingTo.deleted ? 'italic' : 'normal' },
                  ]}
                  numberOfLines={1}
                >
                  {replyingTo.deleted
                    ? 'Message supprimé'
                    : replyingTo.text ||
                      (replyingTo.amount
                        ? `Offre de ${formatPrice(replyingTo.amount)} HTG`
                        : replyingTo.imageUrl
                          ? 'Photo'
                          : replyingTo.latitude
                            ? 'Position'
                            : 'Message')}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleCancelReply} style={styles.replyCancelButton}>
              <Close color={colors.textSecondary} size={24} />
            </TouchableOpacity>
          </View>
        )}

        {/* Attachment Menu */}
        {showAttachmentMenu && !keyboardVisible && !isUserBlocked && (
          <Animated.View
            style={[
              styles.attachmentMenu,
              {
                backgroundColor: colors.background,
                borderTopColor: colors.border,
                opacity: attachmentFadeAnim,
                transform: [{ translateY: attachmentSlideAnim }],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.attachmentOption}
              onPress={() => handleAttachmentOption('camera')}
            >
              <Camera color={colors.text} size={24} />
              <Text style={[styles.attachmentOptionText, { color: colors.text }]}>
                Appareil photo
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.attachmentOption}
              onPress={() => handleAttachmentOption('gallery')}
            >
              <PictureSolid color={colors.text} size={24} />
              <Text style={[styles.attachmentOptionText, { color: colors.text }]}>Galerie</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.attachmentOption}
              onPress={() => handleAttachmentOption('location')}
            >
              <PositionMan color={colors.text} size={24} />
              <Text style={[styles.attachmentOptionText, { color: colors.text }]}>
                Partager position actuelle
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Input / Blocked Bar */}
        <SafeAreaView style={{ backgroundColor: colors.headerBg }} edges={['bottom']}>
          {isUserBlocked ? (
            <View
              style={[
                styles.blockedBar,
                { backgroundColor: colors.headerBg, borderTopColor: colors.border },
              ]}
            >
              <Text style={[styles.blockedText, { color: colors.textSecondary }]}>
                Débloquez @{conversation.user.username} pour pouvoir envoyer un message.
              </Text>
            </View>
          ) : (
            <View
              style={[
                styles.inputContainer,
                { backgroundColor: colors.headerBg, borderTopColor: colors.border },
              ]}
            >
              <TouchableOpacity style={styles.inputButton} onPress={handleAttachmentPress}>
                {showAttachmentMenu && !keyboardVisible ? (
                  <KeyboardFill color={colors.text} size={26} />
                ) : (
                  <Plus color={colors.text} size={26} />
                )}
              </TouchableOpacity>

              <View style={[styles.messageInputWrapper, { backgroundColor: colors.inputBg }]}>
                <TextInput
                  ref={textInputRef}
                  style={[styles.messageInput, { color: colors.text }]}
                  placeholder="Écrire un message..."
                  placeholderTextColor={colors.textSecondary}
                  value={messageText}
                  onChangeText={setMessageText}
                  multiline
                  onFocus={() => setShowAttachmentMenu(false)}
                />
              </View>

              {messageText.trim().length > 0 && (
                <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                  <PaperplaneSolid color={colors.text} size={26} />
                </TouchableOpacity>
              )}
            </View>
          )}
        </SafeAreaView>
      </KeyboardAvoidingView>
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
  contentContainer: {
    flex: 1,
  },
  tooltip: {
    position: 'absolute',
    top: 100,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    zIndex: 1000,
  },
  tooltipText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerUser: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  headerProfileContainer: {
    position: 'relative',
    marginRight: 12,
  },
  headerProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },
  headerOnlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  headerUserInfo: {
    flex: 1,
  },
  headerUserNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerUserName: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerUserStatus: {
    fontSize: 12,
    marginTop: 2,
  },
  searchButton: {
    marginRight: 12,
    padding: 4,
  },
  menuButton: {
    padding: 4,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 4,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  messageRow: {
    marginBottom: 12,
    maxWidth: '80%',
  },
  sentMessageRow: {
    alignSelf: 'flex-end',
  },
  messageBubble: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  receivedBubble: {
    borderTopLeftRadius: 4,
  },
  sentBubble: {
    borderTopRightRadius: 4,
  },
  messageBubbleWithProduct: {
    marginTop: 4,
  },
  bubbleShadow: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  deletedText: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  replyPreview: {
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 6,
    paddingBottom: 6,
    borderRadius: 8,
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  replyPreviewSent: {
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 6,
    paddingBottom: 6,
    borderRadius: 8,
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  replyLine: {
    width: 3,
    height: '100%',
    marginRight: 8,
    borderRadius: 2,
  },
  replyLineSent: {
    width: 3,
    height: '100%',
    marginRight: 8,
    borderRadius: 2,
  },
  replyContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  replyThumbnail: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: '#e0e0e0',
  },
  replyText: {
    fontSize: 12,
    flex: 1,
  },
  replyTextSent: {
    fontSize: 12,
    flex: 1,
  },
  receivedText: {
    fontSize: 14,
    marginBottom: 4,
    lineHeight: 20,
  },
  receivedTime: {
    fontSize: 11,
  },
  sentText: {
    fontSize: 14,
    marginBottom: 4,
    lineHeight: 20,
  },
  sentTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  sentTime: {
    fontSize: 11,
  },
  systemMessageContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  systemMessage: {
    alignItems: 'center',
  },
  systemMessageText: {
    fontSize: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  offerAcceptedSystem: {
    backgroundColor: '#E8F5E9',
    color: '#22C55E',
    fontWeight: '600',
  },
  systemMessageTime: {
    fontSize: 10,
    marginTop: 4,
  },
  productMessageContainer: {
    maxWidth: '100%',
  },
  productMessageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 4,
  },
  productMessageImage: {
    width: 35,
    height: 35,
    borderRadius: 6,
    backgroundColor: '#e0e0e0',
    marginRight: 8,
  },
  productMessageTitle: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  offerCard: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    maxWidth: '100%',
  },
  offerSent: {
    borderTopRightRadius: 4,
  },
  offerReceived: {
    borderTopLeftRadius: 4,
  },
  offerProductCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    borderRadius: 8,
    marginBottom: 8,
  },
  offerProductCardReceived: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  offerProductImage: {
    width: 35,
    height: 35,
    borderRadius: 6,
    backgroundColor: '#e0e0e0',
    marginRight: 8,
  },
  offerProductImageReceived: {
    width: 35,
    height: 35,
    borderRadius: 6,
    backgroundColor: '#e0e0e0',
    marginRight: 8,
  },
  offerProductTitle: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  offerProductTitleReceived: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  offerLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  offerLabel: {
    fontSize: 11,
  },
  offerLabelReceived: {
    fontSize: 11,
  },
  offerAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  offerAmountReceived: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  editOfferButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 8,
    justifyContent: 'center',
  },
  editOfferText: {
    fontSize: 13,
    fontWeight: '600',
  },
  offerTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 4,
  },
  offerActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  offerButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  newOfferButton: {
    borderWidth: 1,
  },
  acceptButton: {},
  newOfferButtonText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  acceptButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  offerStatusAccepted: {
    fontSize: 12,
    fontWeight: '600',
    color: '#22C55E',
    marginTop: 8,
  },
  imageMessageContainer: {
    borderRadius: 12,
    padding: 4,
    borderTopRightRadius: 4,
    overflow: 'hidden',
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  imageMessageText: {
    fontSize: 14,
    marginTop: 8,
    paddingHorizontal: 4,
  },
  locationMessageContainer: {
    padding: 8,
    borderRadius: 12,
    borderTopRightRadius: 4,
    minWidth: 200,
    overflow: 'hidden',
  },
  locationMapPreview: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  locationMap: {
    width: '100%',
    height: '100%',
  },
  mapMarkerProfile: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#3B82F6',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  mapMarkerImage: {
    width: '100%',
    height: '100%',
  },
  locationText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  locationExpiry: {
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 4,
  },
  replyPreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
  },
  replyPreviewContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyPreviewLine: {
    width: 3,
    height: 40,
    marginRight: 12,
    borderRadius: 2,
  },
  replyPreviewTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  replyPreviewLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginRight: 8,
  },
  replyPreviewImage: {
    width: 40,
    height: 40,
    borderRadius: 6,
    marginRight: 8,
  },
  replyPreviewMessage: {
    fontSize: 14,
    flex: 1,
  },
  replyCancelButton: {
    padding: 8,
  },
  attachmentMenu: {
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  attachmentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  attachmentOptionText: {
    fontSize: 15,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    gap: 8,
  },
  inputButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageInputWrapper: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 4,
  },
  messageInput: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blockedBar: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blockedText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%',
  },
  modalFullOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  keyboardAvoidContainer: {
    justifyContent: 'flex-end',
  },
  modalContentOffer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  menuOptionLast: {},
  menuOptionText: {
    fontSize: 16,
  },
  menuOptionTextDanger: {
    color: '#EF4444',
  },
  contextMenuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contextMenu: {
    borderRadius: 12,
    minWidth: 250,
    borderWidth: 1,
    overflow: 'hidden',
  },
  contextMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  contextMenuItemLast: {},
  contextMenuText: {
    fontSize: 15,
    fontWeight: '500',
  },
  reportOptions: {
    maxHeight: 300,
  },
  reportOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  reportOptionLast: {},
  reportOptionText: {
    fontSize: 15,
  },
  reportCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportCheckIcon: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  reportSubmit: {
    margin: 20,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  reportSubmitText: {
    fontSize: 16,
    fontWeight: '600',
  },
  offerModalContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  offerInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingRight: 12,
    marginBottom: 20,
  },
  offerInputField: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    fontWeight: '600',
  },
  currencyLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  offerModalLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  offerModalHint: {
    fontSize: 12,
    color: '#EF4444',
    marginBottom: 12,
    fontWeight: '600',
  },
  sendOfferButton: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  sendOfferButtonDisabled: {
    opacity: 0.5,
  },
  sendOfferButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  imageModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageModalClose: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
});
