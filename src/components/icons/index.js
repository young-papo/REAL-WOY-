import React from 'react';
import Svg, { Path, G } from 'react-native-svg';

// Icône Mail
export const MailRounded = ({ color = '#000000', size = 22, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...props}>
    <Path fill={color} d="M4 20q-.825 0-1.413-.588T2 18V6q0-.825.588-1.413T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.588 1.413T20 20H4Zm8-7.175q.125 0 .263-.038t.262-.112L19.6 8.25q.2-.125.3-.313t.1-.412q0-.5-.425-.75T18.7 6.8L12 11L5.3 6.8q-.45-.275-.875-.012T4 7.525q0 .25.1.438t.3.287l7.075 4.425q.125.075.263.113t.262.037Z" />
  </Svg>
);

// Icône Lock
export const Lock = ({ color = '#000000', size = 22, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...props}>
    <Path fill={color} d="M17 9V7c0-2.8-2.2-5-5-5S7 4.2 7 7v2c-1.7 0-3 1.3-3 3v7c0 1.7 1.3 3 3 3h10c1.7 0 3-1.3 3-3v-7c0-1.7-1.3-3-3-3zM9 7c0-1.7 1.3-3 3-3s3 1.3 3 3v2H9V7z" />
  </Svg>
);

// Icône Google (multicolore)
export const Google = ({ size = 22, ...props }) => (
  <Svg width={size} height={size} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" {...props}>
    <G fill="none" fillRule="evenodd" clipRule="evenodd">
      <Path fill="#F44336" d="M7.209 1.061c.725-.081 1.154-.081 1.933 0a6.57 6.57 0 0 1 3.65 1.82a100 100 0 0 0-1.986 1.93q-1.876-1.59-4.188-.734q-1.696.78-2.362 2.528a78 78 0 0 1-2.148-1.658a.26.26 0 0 0-.16-.027q1.683-3.245 5.26-3.86" opacity=".987" />
      <Path fill="#FFC107" d="M1.946 4.92q.085-.013.161.027a78 78 0 0 0 2.148 1.658A7.6 7.6 0 0 0 4.04 7.99q.037.678.215 1.331L2 11.116Q.527 8.038 1.946 4.92" opacity=".997" />
      <Path fill="#448AFF" d="M12.685 13.29a26 26 0 0 0-2.202-1.74q1.15-.812 1.396-2.228H8.122V6.713q3.25-.027 6.497.055q.616 3.345-1.423 6.032a7 7 0 0 1-.51.49" opacity=".999" />
      <Path fill="#43A047" d="M4.255 9.322q1.23 3.057 4.51 2.854a3.94 3.94 0 0 0 1.718-.626q1.148.812 2.202 1.74a6.62 6.62 0 0 1-4.027 1.684a6.4 6.4 0 0 1-1.02 0Q3.82 14.524 2 11.116z" opacity=".993" />
    </G>
  </Svg>
);

// Icône SignAt (pour pseudo)
export const SignAtSolid = ({ color = '#000000', size = 22, ...props }) => (
  <Svg width={size} height={size} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" {...props}>
    <Path fill={color} fillRule="evenodd" d="M25.033 1.5C12.255 1.5 1.5 11.425 1.5 24.66c0 11.79 8.7 21.84 20.614 21.84c2.703 0 4.601-.352 5.753-1.13c.98-.63 1.482-1.515 1.618-2.475c.133-.944-.09-1.931-.5-2.805c-.277-.59-.908-.854-1.488-.772c-1.632.228-3.218.42-4.844.42c-8.563 0-14.391-7.497-14.391-15.079c0-8.64 7.63-16.442 16.77-16.442c4.6 0 8.274 1.46 10.793 3.805c2.518 2.343 3.913 5.596 3.913 9.247c0 2.589-.785 4.855-2 6.2c-.604.667-1.303 1.097-2.059 1.25c-.665.136-1.411.065-2.224-.294l1.32-8.578c.338-1.794-.472-3.545-1.906-4.586l-.004-.002c-2.291-1.63-5.002-2.306-7.743-2.306c-6.885 0-11.859 5.227-11.859 12.036c0 2.82.975 5.269 2.687 7.015c1.713 1.747 4.135 2.76 6.972 2.76c1.896 0 3.89-.363 5.604-1.327C30.309 34.516 32.42 35 34.461 35c4.007 0 7.039-1.562 9.058-4.09c2.007-2.514 2.981-5.942 2.981-9.64C46.5 9.262 36.041 1.5 25.033 1.5M22.82 21.39c.635-.804 1.38-1.175 2.257-1.175c.551 0 1.103.06 1.537.252l-.622 6.787c-.496.319-1.08.484-1.768.484c-.847 0-1.415-.308-1.784-.773c-.381-.48-.59-1.183-.59-2.023c0-1.635.348-2.79.965-3.545z" clipRule="evenodd" />
  </Svg>
);

// Icône Profile
export const ProfileFill = ({ color = '#000000', size = 22, ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <Path fill={color} fillRule="evenodd" d="M8 7a4 4 0 1 1 8 0a4 4 0 0 1-8 0Zm0 6a5 5 0 0 0-5 5a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3a5 5 0 0 0-5-5H8Z" clipRule="evenodd" />
  </Svg>
);

// Icône Calendar
export const Calendar = ({ color = '#000000', size = 22, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 512 512" {...props}>
    <Path fill={color} d="M480 128a64 64 0 0 0-64-64h-16V48.45c0-8.61-6.62-16-15.23-16.43A16 16 0 0 0 368 48v16H144V48.45c0-8.61-6.62-16-15.23-16.43A16 16 0 0 0 112 48v16H96a64 64 0 0 0-64 64v12a4 4 0 0 0 4 4h440a4 4 0 0 0 4-4ZM32 416a64 64 0 0 0 64 64h320a64 64 0 0 0 64-64V179a3 3 0 0 0-3-3H35a3 3 0 0 0-3 3Zm344-208a24 24 0 1 1-24 24a24 24 0 0 1 24-24Zm0 80a24 24 0 1 1-24 24a24 24 0 0 1 24-24Zm-80-80a24 24 0 1 1-24 24a24 24 0 0 1 24-24Zm0 80a24 24 0 1 1-24 24a24 24 0 0 1 24-24Zm0 80a24 24 0 1 1-24 24a24 24 0 0 1 24-24Zm-80-80a24 24 0 1 1-24 24a24 24 0 0 1 24-24Zm0 80a24 24 0 1 1-24 24a24 24 0 0 1 24-24Zm-80-80a24 24 0 1 1-24 24a24 24 0 0 1 24-24Zm0 80a24 24 0 1 1-24 24a24 24 0 0 1 24-24Z" />
  </Svg>
);

// Icône ArrowBackIosRounded (pour bouton retour)
export const ArrowBackIosRounded = ({ color = '#000000', size = 22, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...props}>
    <Path fill={color} d="m3.55 12l7.35 7.35q.375.375.363.875t-.388.875q-.375.375-.875.375t-.875-.375l-7.7-7.675q-.3-.3-.45-.675T.825 12q0-.375.15-.75t.45-.675l7.7-7.7q.375-.375.888-.363t.887.388q.375.375.375.875t-.375.875L3.55 12Z" />
  </Svg>
);

// Icône ClockFilled (pour timer)
export const ClockFilled = ({ color = '#000000', size = 22, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...props}>
    <G fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <Path d="M0 0h24v24H0z" />
      <Path fill={color} d="M17 3.34a10 10 0 1 1-14.995 8.984L2 12l.005-.324A10 10 0 0 1 17 3.34zM12 6a1 1 0 0 0-.993.883L11 7v5l.009.131a1 1 0 0 0 .197.477l.087.1l3 3l.094.082a1 1 0 0 0 1.226 0l.094-.083l.083-.094a1 1 0 0 0 0-1.226l-.083-.094L13 11.585V7l-.007-.117A1 1 0 0 0 12 6z" />
    </G>
  </Svg>
);

// Icône VerifiedCheckFill (badge vérifié)
export const VerifiedCheckFill = ({ color = '#000000', size = 14, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...props}>
    <Path fill={color} d="M22.02 11.164a1.84 1.84 0 0 0-.57-.67l-1.33-1a.35.35 0 0 1-.14-.2a.36.36 0 0 1 0-.25l.55-1.63a2 2 0 0 0 .06-.9a1.809 1.809 0 0 0-.36-.84a1.859 1.859 0 0 0-.7-.57a1.75 1.75 0 0 0-.85-.17h-1.5a.41.41 0 0 1-.39-.3l-.43-1.5a1.88 1.88 0 0 0-.46-.81a2 2 0 0 0-.78-.49a2 2 0 0 0-.92-.06a1.88 1.88 0 0 0-.83.39l-1.14.9a.35.35 0 0 1-.23.09a.36.36 0 0 1-.22-.05l-1.13-.9a1.85 1.85 0 0 0-.8-.38a1.87 1.87 0 0 0-.88 0a1.93 1.93 0 0 0-.78.43a2.08 2.08 0 0 0-.51.79l-.43 1.51a.38.38 0 0 1-.15.22a.41.41 0 0 1-.27.07H5.41a1.92 1.92 0 0 0-.89.18a1.78 1.78 0 0 0-.71.57a1.93 1.93 0 0 0-.36.83c-.05.293-.03.595.06.88L4 8.993a.41.41 0 0 1-.14.45l-1.33 1c-.242.18-.44.412-.58.68a1.93 1.93 0 0 0 0 1.71a2 2 0 0 0 .58.68l1.33 1a.41.41 0 0 1 .14.45l-.55 1.63a2 2 0 0 0-.07.91c.05.298.174.58.36.82c.183.25.428.45.71.58c.265.126.557.184.85.17h1.49a.38.38 0 0 1 .25.08a.34.34 0 0 1 .14.21l.43 1.51a2 2 0 0 0 .46.8a1.89 1.89 0 0 0 2.54.17l1.15-.91a.39.39 0 0 1 .49 0l1.13.9c.24.202.53.337.84.39c.113.01.227.01.34 0a1.9 1.9 0 0 0 .58-.09a1.871 1.871 0 0 0 1.24-1.28l.44-1.52a.34.34 0 0 1 .14-.21a.4.4 0 0 1 .27-.08h1.43a2 2 0 0 0 .89-.17a1.911 1.911 0 0 0 1.06-1.4a1.92 1.92 0 0 0-.07-.92l-.54-1.62a.36.36 0 0 1 0-.25a.35.35 0 0 1 .14-.2l1.33-1a1.87 1.87 0 0 0 .57-.68a1.82 1.82 0 0 0 .21-.86a1.881 1.881 0 0 0-.23-.78m-5.44-.76l-4.42 4.42a2.011 2.011 0 0 1-.59.4c-.222.09-.46.138-.7.14a1.711 1.711 0 0 1-.71-.15a1.863 1.863 0 0 1-.6-.4l-2.18-2.19a1 1 0 0 1 1.41-1.41l2.08 2.08l4.3-4.31a1 1 0 0 1 1.41 0a.998.998 0 0 1 0 1.46z" />
  </Svg>
);

// Icône NotificationBell (cloche notifications)
export const NotificationBell = ({ color = '#000000', size = 64, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...props}>
    <Path fill={color} d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
  </Svg>
);

// Icône WSquare (logo WOY carré)
export const WSquare = ({ color = '#000000', size = 20, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 1792 1792" {...props}>
    <Path fill={color} d="M336 0h1120q139 0 237.5 98.5T1792 336v1120q0 139-98.5 237.5T1456 1792H336q-139 0-237.5-98.5T0 1456V336Q0 197 98.5 98.5T336 0zm918 1493q12 0 21-12.5t13-25t11-37.5l269-1044q7-27-9-51t-36-24h-179q-12 0-21 12.5t-13 25t-11 37.5l-134 521l-134-521q-6-24-11-37.5t-14-25.5t-20-12H806q-16 0-25.5 19.5T761 374L627 895L493 374q-7-25-11-37.5t-13-25t-21-12.5H269q-20 0-36 24t-9 51l269 1044q7 25 11 37.5t13 25t21 12.5h178q27 0 45-75l135-523l135 523q18 75 45 75h178z" />
  </Svg>
);

// Icône Trash (poubelle)
export const Trash = ({ color = '#000000', size = 24, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...props}>
    <G fill="none">
      <Path fill={color} fillRule="evenodd" d="M21 6H3v3a2 2 0 0 1 2 2v4c0 2.828 0 4.243.879 5.121C6.757 21 8.172 21 11 21h2c2.829 0 4.243 0 5.121-.879c.88-.878.88-2.293.88-5.121v-4a2 2 0 0 1 2-2zm-10.5 5a1 1 0 0 0-2 0v5a1 1 0 1 0 2 0zm5 0a1 1 0 0 0-2 0v5a1 1 0 1 0 2 0z" clipRule="evenodd" />
      <Path stroke={color} strokeLinecap="round" strokeWidth="2" d="M10.068 3.37c.114-.106.365-.2.715-.267A6.68 6.68 0 0 1 12 3c.44 0 .868.036 1.217.103c.35.067.6.161.715.268" />
    </G>
  </Svg>
);

// Icône ShoppingCart (panier)
export const ShoppingCart = ({ color = '#000000', size = 16, ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 640 512" {...props}>
    <Path fill={color} d="M24-16C10.7-16 0-5.3 0 8s10.7 24 24 24h45.3c3.9 0 7.2 2.8 7.9 6.6l52.1 286.3c6.2 34.2 36 59.1 70.8 59.1H456c13.3 0 24-10.7 24-24s-10.7-24-24-24H200.1c-11.6 0-21.5-8.3-23.6-19.7l-5.1-28.3H475c30.8 0 57.2-21.9 62.9-52.2l31-165.9c3.7-19.7-11.4-37.9-31.5-37.9H124.7l-.4-2c-4.8-26.6-28-46-55.1-46zm184 528a48 48 0 1 0 0-96a48 48 0 1 0 0 96m224 0a48 48 0 1 0 0-96a48 48 0 1 0 0 96" />
  </Svg>
);

// Icône ShoppingBagIcon (sac d'achat)
export const ShoppingBagIcon = ({ color = '#000000', size = 16, ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <Path fill={color} d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2s-.9-2-2-2zM1 2v2h2l3.6 7.59l-1.35 2.45c-.16.28-.25.61-.25.96c0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12l.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0 0 20 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2s2-.9 2-2s-.9-2-2-2z" />
  </Svg>
);

// Icône CloseIcon (fermer)
export const CloseIcon = ({ color = '#000000', size = 24, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...props}>
    <Path fill={color} d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z" />
  </Svg>
);

// Icône MessageDotsFill (message avec points)
export const MessageDotsFill = ({ color = '#000000', size = 26, ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <Path fill={color} d="M20.605 4.17a4.67 4.67 0 0 0-3.33-1.38H6.705a4.71 4.71 0 0 0-4.71 4.72v6.6a4.71 4.71 0 0 0 4.71 4.72h2.33l1.95 1.94c.127.143.284.255.46.33c.175.072.361.11.55.11c.189-.002.375-.04.55-.11a1.58 1.58 0 0 0 .44-.31l2-2h2.33a4.69 4.69 0 0 0 3.33-1.38a4.8 4.8 0 0 0 1-1.53c.234-.575.357-1.19.36-1.81v-6.6a4.67 4.67 0 0 0-1.4-3.3m-13.24 8.17a1.66 1.66 0 1 1 1.66-1.66a1.67 1.67 0 0 1-1.66 1.66m4.63 0a1.66 1.66 0 1 1 0-3.32a1.66 1.66 0 0 1 0 3.32m4.62 0a1.66 1.66 0 1 1 1.66-1.66a1.67 1.67 0 0 1-1.66 1.66" />
  </Svg>
);

// Icône HandHoldingDollarSolid (offre/argent)
export const HandHoldingDollarSolid = ({ color = '#000000', size = 26, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...props}>
    <Path fill={color} d="M12.753 4a.752.752 0 0 0-1.505 0v.464h-.051c-1.05 0-1.66.795-1.781 1.56c-.121.755.2 1.7 1.165 2.048l2.362.851c.082.03.113.07.129.1c.02.04.033.1.02.17a.27.27 0 0 1-.076.152c-.025.023-.069.051-.162.051h-1.657a.324.324 0 0 1-.32-.328a.752.752 0 0 0-1.504 0c0 1.006.81 1.833 1.824 1.833h.076v.599a.752.752 0 0 0 1.505 0v-.599h.076c1.964 0 2.426-2.735.599-3.394l-2.361-.85a.26.26 0 0 1-.157-.133a.44.44 0 0 1-.034-.263a.4.4 0 0 1 .107-.225c.036-.036.089-.067.189-.067h1.607c.17 0 .319.14.319.328a.752.752 0 0 0 1.505 0c0-1.006-.81-1.833-1.824-1.833h-.051zm-3.32 8.998c-.863 0-1.522.206-2.063.544c-.5.312-.865.72-1.157 1.046l-.031.035c-.316.352-.559.614-.873.806c-.292.179-.685.319-1.309.319a.75.75 0 0 0-.752.752V20c0 .416.337.752.752.752h9.502c1.744 0 3.426-.94 4.603-1.784a16 16 0 0 0 1.983-1.695l.004-.004c.364-.3.59-.688.647-1.117c.058-.436-.07-.85-.3-1.17a1.7 1.7 0 0 0-2.335-.42q-.296.21-.579.416c-.571.414-1.122.814-1.713 1.149c-.77.437-1.523.712-2.31.712H10.5c-.2 0-.283-.062-.312-.092a.2.2 0 0 1-.06-.151a.2.2 0 0 1 .06-.152c.03-.03.112-.092.312-.092h2.002c.533 0 1.006-.167 1.354-.489a1.616 1.616 0 0 0 0-2.376c-.348-.322-.821-.49-1.354-.49z" />
  </Svg>
);

// Icône MapMarkerAlt (localisation)
export const MapMarkerAlt = ({ color = '#000000', size = 22, ...props }) => (
  <Svg width={size} height={size} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" {...props}>
    <Path fill={color} d="M0 188.6C0 84.4 86 0 192 0s192 84.4 192 188.6c0 119.3-120.2 262.3-170.4 316.8c-11.8 12.8-31.5 12.8-43.3 0C120.1 450.9-.1 307.9-.1 188.6zM192 256a64 64 0 1 0 0-128a64 64 0 1 0 0 128" />
  </Svg>
);

// Icône StarSolid (étoile pleine)
export const StarSolid = ({ color = '#000000', size = 24, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...props}>
    <Path fill={color} d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3l-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3l3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4l3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3z" />
  </Svg>
);

// Icône Search (recherche)
export const Search = ({ color = '#000000', size = 24, ...props }) => (
  <Svg width={size} height={size} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" {...props}>
    <Path fill={color} d="M416 208c0 45.9-14.9 88.3-40 122.7l126.6 126.7c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.1-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0s208 93.1 208 208M208 352a144 144 0 1 0 0-288a144 144 0 1 0 0 288" />
  </Svg>
);

// Icône CloseFilled (fermer cercle)
export const CloseFilled = ({ color = '#000000', size = 24, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...props}>
    <Path fill={color} d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m5 13.59L15.59 17L12 13.41L8.41 17L7 15.59L10.59 12L7 8.41L8.41 7L12 10.59L15.59 7L17 8.41L13.41 12z" />
  </Svg>
);

// Icône Heart (like/favoris)
export const Heart = ({ color = '#000000', size = 24, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...props}>
    <Path fill={color} d="m12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53z" />
  </Svg>
);

// Icône HeartOutline (like vide)
export const HeartOutline = ({ color = '#000000', size = 24, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...props}>
    <Path fill={color} d="m12.1 18.55l-.1.1l-.11-.1C7.14 14.24 4 11.39 4 8.5C4 6.5 5.5 5 7.5 5c1.54 0 3.04 1 3.57 2.36h1.86C13.46 6 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5c0 2.89-3.14 5.74-7.9 10.05M16.5 3c-1.74 0-3.41.81-4.5 2.08C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.41 2 8.5c0 3.77 3.4 6.86 8.55 11.53L12 21.35l1.45-1.32C18.6 15.36 22 12.27 22 8.5C22 5.41 19.58 3 16.5 3" />
  </Svg>
);

// Icône Repeat (republier/repost)
export const Repeat = ({ color = '#000000', size = 24, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...props}>
    <Path fill={color} d="M7 7h10v3l4-4l-4-4v3H5v6h2zm10 10H7v-3l-4 4l4 4v-3h12v-6h-2z" />
  </Svg>
);

// Icône ShareForwardFill (partager)
export const ShareForwardFill = ({ color = '#000000', size = 24, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...props}>
    <Path fill={color} d="M21 12l-7-7v4C7 10 4 15 3 20c2.5-3.5 6-5.1 11-5.1V19z" />
  </Svg>
);

// Icône EyeFill (vues)
export const EyeFill = ({ color = '#000000', size = 24, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...props}>
    <Path fill={color} d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5M12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5s5 2.24 5 5s-2.24 5-5 5m0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3s3-1.34 3-3s-1.34-3-3-3" />
  </Svg>
);

// Icône EyeFill12 (vues version compacte)
export const EyeFill12 = ({ color = '#000000', size = 16, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 12 12" {...props}>
    <G fill={color}>
      <Path d="M6 4.5a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3" />
      <Path d="M11.79 5.34C11.08 4.33 9.1 2 6 2S.92 4.33.21 5.34c-.28.4-.28.93 0 1.32C.92 7.67 2.9 10 6 10s5.08-2.33 5.79-3.34c.28-.39.28-.93 0-1.32M6 8.5a2.5 2.5 0 0 1 0-5a2.5 2.5 0 0 1 0 5" />
    </G>
  </Svg>
);

// Icône Warning (signaler)
export const Warning = ({ color = '#000000', size = 24, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...props}>
    <Path fill={color} d="M1 21h22L12 2zm12-3h-2v-2h2zm0-4h-2v-4h2z" />
  </Svg>
);

// Icône Truck (livraison)
export const Truck = ({ color = '#000000', size = 24, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...props}>
    <Path fill={color} d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5s1.5.67 1.5 1.5s-.67 1.5-1.5 1.5m13.5-9l1.96 2.5H17V9.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5s1.5.67 1.5 1.5s-.67 1.5-1.5 1.5" />
  </Svg>
);

// Icône Close (fermer simple)
export const Close = ({ color = '#000000', size = 24, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...props}>
    <Path fill={color} d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z" />
  </Svg>
);

// Icône Plus (ajouter)
export const Plus = ({ color = '#000000', size = 24, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...props}>
    <Path fill={color} d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z" />
  </Svg>
);

// Icône ChevronRight (flèche droite)
export const ChevronRight = ({ color = '#000000', size = 24, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...props}>
    <Path fill={color} d="M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6l-6 6z" />
  </Svg>
);

// Icône Home24Filled (accueil)
export const Home24Filled = ({ color = '#000000', size = 26, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...props}>
    <Path fill={color} d="M13.45 2.533a2.25 2.25 0 0 0-2.9 0L3.8 8.228a2.25 2.25 0 0 0-.8 1.72v9.305c0 .966.784 1.75 1.75 1.75h3a1.75 1.75 0 0 0 1.75-1.75V15.25c0-.68.542-1.232 1.217-1.25h2.566a1.25 1.25 0 0 1 1.217 1.25v4.003c0 .966.784 1.75 1.75 1.75h3a1.75 1.75 0 0 0 1.75-1.75V9.947a2.25 2.25 0 0 0-.8-1.72l-6.75-5.694Z" />
  </Svg>
);

// Icône SearchCategorySolid (recherche catégorie)
export const SearchCategorySolid = ({ color = '#000000', size = 25, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 14 14" {...props}>
    <Path fill={color} fillRule="evenodd" d="M3.188.05c-.503 0-.99.046-1.447.097A1.826 1.826 0 0 0 .134 1.759a14 14 0 0 0-.092 1.436c0 .499.043.982.092 1.437c.09.844.765 1.518 1.607 1.612c.457.051.944.097 1.447.097q.353-.001.693-.026a4.8 4.8 0 0 1 .987-1.437a4.8 4.8 0 0 1 1.44-.988q.024-.341.025-.695c0-.498-.043-.981-.092-1.436A1.826 1.826 0 0 0 4.634.147A13 13 0 0 0 3.187.05m0 7.604q.144 0 .287.005q-.104.602-.103 1.223c0 1.487.424 2.933 1.496 4.004q.327.327.698.576a1.8 1.8 0 0 1-.932.387c-.457.05-.944.096-1.447.096s-.99-.045-1.446-.096a1.826 1.826 0 0 1-1.607-1.612A14 14 0 0 1 .042 10.8c0-.498.043-.982.092-1.437A1.826 1.826 0 0 1 1.74 7.751c.457-.05.944-.097 1.447-.097m10.678-3.022a1.8 1.8 0 0 1-.404.958a4.7 4.7 0 0 0-.586-.712c-1.071-1.072-2.517-1.496-4.004-1.496a7 7 0 0 0-1.2.1a9 9 0 0 1-.005-.287c0-.498.043-.981.092-1.436A1.826 1.826 0 0 1 9.366.147C9.823.096 10.31.05 10.813.05s.99.046 1.446.097a1.825 1.825 0 0 1 1.607 1.612c.049.455.092.938.092 1.436c0 .499-.043.982-.092 1.437m-7.054 2.19c-.416.417-.69 1.078-.69 2.06s.274 1.643.69 2.06c.417.416 1.078.69 2.06.69s1.643-.274 2.06-.69c.416-.417.69-1.078.69-2.06s-.274-1.643-.69-2.06c-.417-.416-1.078-.69-2.06-.69s-1.643.274-2.06.69m-1.06-1.06c.773-.774 1.862-1.13 3.12-1.13s2.347.356 3.12 1.13s1.13 1.862 1.13 3.12c0 .967-.21 1.834-.659 2.535l1.253 1.253a.75.75 0 1 1-1.06 1.06l-1.254-1.254c-.7.447-1.565.656-2.53.656c-1.258 0-2.347-.356-3.12-1.13s-1.13-1.862-1.13-3.12s.356-2.347 1.13-3.12" clipRule="evenodd" />
  </Svg>
);

// Icône AddSquareSolid (ajouter carré)
export const AddSquareSolid = ({ color = '#000000', size = 25, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 14 14" {...props}>
    <Path fill={color} fillRule="evenodd" d="M0 3.5A3.5 3.5 0 0 1 3.5 0h7A3.5 3.5 0 0 1 14 3.5v7a3.5 3.5 0 0 1-3.5 3.5h-7A3.5 3.5 0 0 1 0 10.5zm7-.25a.75.75 0 0 1 .75.75v2.25H10a.75.75 0 0 1 0 1.5H7.75V10a.75.75 0 0 1-1.5 0V7.75H4a.75.75 0 0 1 0-1.5h2.25V4A.75.75 0 0 1 7 3.25" clipRule="evenodd" />
  </Svg>
);

// Icône MapFoldSolid (carte)
export const MapFoldSolid = ({ color = '#000000', size = 24, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 576 512" {...props}>
    <Path fill={color} d="m384 476.1l-192-54.9V35.9l192 54.9v385.3zm32-1.2V88.4l127.1-50.9c15.8-6.3 32.9 5.3 32.9 22.3v334.8c0 9.8-6 18.6-15.1 22.3L416 474.8zM15.1 95.1L160 37.2v386.4L32.9 474.5C17.1 480.8 0 469.2 0 452.2V117.4c0-9.8 6-18.6 15.1-22.3z" />
  </Svg>
);

// Icône Filter2Fill (filtre)
export const Filter2Fill = ({ color = '#000000', size = 24, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...props}>
    <G fill="none">
      <Path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z" />
      <Path fill={color} d="M14 16.5a1.5 1.5 0 0 1 .144 2.993L14 19.5h-4a1.5 1.5 0 0 1-.144-2.993L10 16.5h4Zm3-6a1.5 1.5 0 0 1 0 3H7a1.5 1.5 0 0 1 0-3h10Zm3-6a1.5 1.5 0 0 1 0 3H4a1.5 1.5 0 1 1 0-3h16Z" />
    </G>
  </Svg>
);

// Icône BoxBold (produits)
export const BoxBold = ({ color = '#000000', size = 16, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...props}>
    <Path fill={color} d="m17.578 4.432l-2-1.05C13.822 2.461 12.944 2 12 2s-1.822.46-3.578 1.382l-.321.169l8.923 5.099l4.016-2.01c-.646-.732-1.688-1.279-3.462-2.21Zm4.17 3.532l-3.998 2V13a.75.75 0 0 1-1.5 0v-2.287l-3.5 1.75v9.441c.718-.179 1.535-.607 2.828-1.286l2-1.05c2.151-1.129 3.227-1.693 3.825-2.708c.597-1.014.597-2.277.597-4.8v-.117c0-1.893 0-3.076-.252-3.978ZM11.25 21.904v-9.44l-8.998-4.5C2 8.866 2 10.05 2 11.941v.117c0 2.525 0 3.788.597 4.802c.598 1.015 1.674 1.58 3.825 2.709l2 1.049c1.293.679 2.11 1.107 2.828 1.286ZM2.96 6.641l9.04 4.52l3.411-1.705l-8.886-5.078l-.103.054c-1.773.93-2.816 1.477-3.462 2.21Z" />
  </Svg>
);

// Icône Megaphone (requêtes)
export const Megaphone = ({ color = '#000000', size = 16, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...props}>
    <Path fill={color} d="M20.664 3.478L8 8v7l.748.267l-1.127 2.254a1.999 1.999 0 0 0 1.156 2.792l4.084 1.361a2.015 2.015 0 0 0 2.421-1.003l1.303-2.606l4.079 1.457A1 1 0 0 0 22 18.581V4.419a1 1 0 0 0-1.336-.941zm-7.171 16.299L9.41 18.416l1.235-2.471l4.042 1.444l-1.194 2.388zM4 15h2V8H4c-1.103 0-2 .897-2 2v3c0 1.103.897 2 2 2z" />
  </Svg>
);

// Icône HandshakeSimple (partenaire)
export const HandshakeSimple = ({ color = '#000000', size = 16, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 640 512" {...props}>
    <Path fill={color} d="m323.4 85.2l-96.8 78.4c-16.1 13-19.2 36.4-7 53.1c12.9 17.8 38 21.3 55.3 7.8l99.3-77.2c7-5.4 17-4.2 22.5 2.8s4.2 17-2.8 22.5L373 188.8L550.2 352H592c26.5 0 48-21.5 48-48V176c0-26.5-21.5-48-48-48h-80.7l-3.9-2.5L434.8 79c-15.3-9.8-33.2-15-51.4-15c-21.8 0-43 7.5-60 21.2m22.8 124.4l-51.7 40.2c-31.5 24.6-77.2 18.2-100.8-14.2c-22.2-30.5-16.6-73.1 12.7-96.8l83.2-67.3c-11.6-4.9-24.1-7.4-36.8-7.4C234 64 215.7 69.6 200 80l-72 48H48c-26.5 0-48 21.5-48 48v128c0 26.5 21.5 48 48 48h108.2l91.4 83.4c19.6 17.9 49.9 16.5 67.8-3.1c5.5-6.1 9.2-13.2 11.1-20.6l17 15.6c19.5 17.9 49.9 16.6 67.8-2.9c4.5-4.9 7.8-10.6 9.9-16.5c19.4 13 45.8 10.3 62.1-7.5c17.9-19.5 16.6-49.9-2.9-67.8z" />
  </Svg>
);

// Icône MoreVertical (menu contextuel)
export const MoreVertical = ({ color = '#FFFFFF', size = 20, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...props}>
    <Path fill={color} d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2s-2 .9-2 2s.9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2z" />
  </Svg>
);

// Icône ReportProblemFilled (signalement)
export const ReportProblemFilled = ({ color = '#EF4444', size = 18, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...props}>
    <Path fill={color} fillRule="evenodd" d="m21.268 21.053l-18.536.001a1 1 0 0 1-.866-1.5L11.132 3.5a1 1 0 0 1 1.732 0l9.27 16.053a1 1 0 0 1-.866 1.5M11.248 9.545l.116 5.666h1.272l.117-5.666zm.75 8.572c.48 0 .855-.369.855-.832s-.375-.826-.856-.826a.83.83 0 0 0-.85.826c0 .463.375.832.85.832z" />
  </Svg>
);

// Icône CloseCircleFill (fermer cercle rouge)
export const CloseCircleFill = ({ color = '#EF4444', size = 20, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...props}>
    <Path fill={color} d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17L12 13.41L8.41 17L7 15.59L10.59 12L7 8.41L8.41 7L12 10.59L15.59 7L17 8.41L13.41 12L17 15.59z" />
  </Svg>
);

// Icône EyeOutline (aperçu)
export const EyeOutline = ({ color = '#000000', size = 24, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...props}>
    <Path fill={color} d="M12 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5a5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5z" />
  </Svg>
);

// Icône Pencil (modifier)
export const Pencil = ({ color = '#000000', size = 20, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...props}>
    <G fill="none">
      <Path fillRule="evenodd" clipRule="evenodd" d="M15.586 3a2 2 0 0 1 2.828 0L21 5.586a2 2 0 0 1 0 2.828L19.414 10L14 4.586L15.586 3zm-3 3l-9 9A2 2 0 0 0 3 16.414V19a2 2 0 0 0 2 2h2.586A2 2 0 0 0 9 20.414l9-9L12.586 6z" fill={color} />
    </G>
  </Svg>
);

// Icône RoundFileUpload (publier)
export const RoundFileUpload = ({ color = '#000000', size = 20, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...props}>
    <Path fill={color} d="M7.4 10h1.59v5c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-5h1.59c.89 0 1.34-1.08.71-1.71L12.7 3.7a.996.996 0 0 0-1.41 0L6.7 8.29c-.63.63-.19 1.71.7 1.71zM5 19c0 .55.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1H6c-.55 0-1 .45-1 1z" />
  </Svg>
);

// Icône PictureSolid (image)
export const PictureSolid = ({ color = '#000000', size = 32, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 36 36" {...props}>
    <Path fill={color} d="M32 4H4a2 2 0 0 0-2 2v24a2 2 0 0 0 2 2h28a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2ZM8.92 8a3 3 0 1 1-3 3a3 3 0 0 1 3-3ZM6 27v-4.1l6-6.08a1 1 0 0 1 1.41 0L16 19.35L8.32 27Zm24 0H11.15l6.23-6.23l5.4-5.4a1 1 0 0 1 1.41 0L30 21.18Z" />
    <Path fill="none" d="M0 0h36v36H0z" />
  </Svg>
);

// Icône CameraFilled (appareil photo)
export const CameraFilled = ({ color = '#000000', size = 32, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...props}>
    <Path fill={color} d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5s5 2.24 5 5s-2.24 5-5 5z" />
  </Svg>
);

// Icône FolderFilled (dossier)
export const FolderFilled = ({ color = '#000000', size = 32, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...props}>
    <Path fill={color} d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
  </Svg>
);

// Icône TriangleInvertedFilled (flèche dropdown)
export const TriangleInvertedFilled = ({ color = '#000000', size = 16, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...props}>
    <G fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <Path d="M0 0h24v24H0z" />
      <Path fill={color} d="M19.007 3a3 3 0 0 1 2.828 3.94l-.068.185l-.062.126l-7.09 12.233a3 3 0 0 1-5.137.19l-.103-.173l-7.1-12.25l-.061-.125a3 3 0 0 1 2.625-4.125L4.897 3l.06.002L5 3h14.007z" />
    </G>
  </Svg>
);

// Icône PencilSquareSolid (nouveau message)
export const PencilSquareSolid = ({ color = '#000000', size = 24, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 14 14" {...props}>
    <Path fill={color} fillRule="evenodd" d="M13.354.637a1.944 1.944 0 0 0-2.8.053L7.24 4.265a1.5 1.5 0 0 0-.323.545l-.5 1.498a1 1 0 0 0 1.265 1.265l1.498-.5a1.5 1.5 0 0 0 .546-.322L13.3 3.437c.808-.75.833-2.02.053-2.8m-7.03 2.778a2.75 2.75 0 0 0-.592 1l-.5 1.498C4.646 7.672 6.32 9.345 8.079 8.759l1.498-.5a2.75 2.75 0 0 0 1-.591l1.853-1.719a.246.246 0 0 1 .415.163q.048.697.05 1.417q0 .369-.014.733q0 .027.004.053q.015.098.01.2c-.043.843-.13 1.664-.217 2.441a3.1 3.1 0 0 1-1.241 2.14a3.1 3.1 0 0 1-1.497.6c-.83.095-1.715.194-2.623.235q-.088.004-.172-.007l-.045-.002q-.3.01-.601.01c-1.211 0-2.385-.13-3.466-.256a3.094 3.094 0 0 1-2.713-2.72C.2 9.878.076 8.713.076 7.51q0-.369.015-.732q0-.027-.004-.054a1 1 0 0 1-.01-.2c.043-.842.13-1.664.217-2.44a3.1 3.1 0 0 1 1.241-2.141a3.1 3.1 0 0 1 1.497-.599a37 37 0 0 1 2.624-.236q.087-.003.17.007q.024.003.046.002a18 18 0 0 1 1.996.042a.246.246 0 0 1 .162.414z" clipRule="evenodd" />
  </Svg>
);

// Icône StarFourPointsCircle (favoris cercle)
export const StarFourPointsCircle = ({ color = '#000000', size = 14, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...props}>
    <Path fill={color} d="M8.17 2.76A10.1 10.1 0 0 1 12 2c1.31 0 2.61.26 3.83.76c1.21.5 2.31 1.24 3.24 2.17c.93.93 1.67 2.03 2.17 3.24c.5 1.22.76 2.52.76 3.83c0 2.65-1.05 5.2-2.93 7.07A9.974 9.974 0 0 1 12 22a10.1 10.1 0 0 1-3.83-.76a9.975 9.975 0 0 1-3.24-2.17A9.974 9.974 0 0 1 2 12c0-2.65 1.05-5.2 2.93-7.07c.93-.93 2.03-1.67 3.24-2.17M12 17l1.56-3.42L17 12l-3.44-1.56L12 7l-1.57 3.44L7 12l3.43 1.58L12 17Z" />
  </Svg>
);

// Icône PinFill (épinglé)
export const PinFill = ({ color = '#000000', size = 14, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 25" {...props}>
    <Path fill={color} d="M11 21.715v-3.858a1 1 0 1 1 2 0v3.858l-.005.101a1 1 0 0 1-1.99 0z" />
    <Path fill={color} d="m15.713 7.47l.437-1.53a1.746 1.746 0 0 0-1.679-2.226H10.23A2.32 2.32 0 0 0 7.955 6.49Q8 6.715 8 6.945v3.879c0 .899-.315 1.77-.89 2.46l-.874 1.048a1.758 1.758 0 0 0 1.35 2.883h8.972a1.307 1.307 0 0 0 1.087-2.032l-.98-1.471a4.9 4.9 0 0 1-.797-2.187l-.283-2.541a3.9 3.9 0 0 1 .127-1.513Z" />
  </Svg>
);

// Icône Check (simple coche)
export const Check = ({ color = '#999999', size = 16, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...props}>
    <Path fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m6 12l4.243 4.243l8.484-8.486" />
  </Svg>
);

// Icône CheckAll (double coche)
export const CheckAll = ({ color = '#999999', size = 16, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...props}>
    <Path fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m8 12.485l4.243 4.243l8.484-8.485M3 12.485l4.243 4.243m8.485-8.485L12.5 11.5" />
  </Svg>
);

// Icône VerifiedBadge (badge vérifié bleu)
export const VerifiedBadge = ({ color = '#3B82F6', size = 18, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...props}>
    <Path fill={color} d="M23 12l-2.44-2.79l.34-3.69l-3.61-.82l-1.89-3.2L12 2.96L8.6 1.5L6.71 4.7L3.1 5.52l.34 3.69L1 12l2.44 2.79l-.34 3.7l3.61.82L8.6 22.5l3.4-1.47l3.4 1.46l1.89-3.19l3.61-.82l-.34-3.69L23 12zm-12.91 4.72l-3.8-3.81l1.48-1.48l2.32 2.33l5.85-5.87l1.48 1.48l-7.33 7.35z" />
  </Svg>
);

// Icône PaperplaneSolid (envoyer message)
export const PaperplaneSolid = ({ color = '#000000', size = 26, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...props}>
    <Path fill={color} d="M18.844 13.483c1.208-.6 1.208-2.367 0-2.966L6.552 4.416c-1.228-.61-2.458.493-2.285 1.72l.54 3.829a1.64 1.64 0 0 0 1.128 1.342c.16.05.55.133 1.012.227c.636.13 4.39.466 4.39.466s-3.754.337-4.39.466c-.461.094-.851.177-1.012.227a1.64 1.64 0 0 0-1.128 1.342l-.54 3.83c-.173 1.226 1.057 2.329 2.285 1.72z" />
  </Svg>
);

// Icône PresenceBlocked16Regular (bloquer)
export const PresenceBlocked16Regular = ({ color = '#000000', size = 20, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16" {...props}>
    <Path fill={color} d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0Zm-2 0c0-1.296-.41-2.496-1.11-3.477l-8.367 8.368A6 6 0 0 0 14 8Zm-2.524-4.89a6 6 0 0 0-8.367 8.367l8.368-8.368Z" />
  </Svg>
);

// Icône Camera (appareil photo simple)
export const Camera = ({ color = '#000000', size = 24, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...props}>
    <Path fill={color} d="M19 6h-1.586l-1-1c-.579-.579-1.595-1-2.414-1h-4c-.819 0-1.835.421-2.414 1l-1 1H5C3.346 6 2 7.346 2 9v8c0 1.654 1.346 3 3 3h14c1.654 0 3-1.346 3-3V9c0-1.654-1.346-3-3-3zm-7 10a3.5 3.5 0 1 1 .001-7.001A3.5 3.5 0 0 1 12 16zm6-4.701a1.3 1.3 0 1 1 0-2.6a1.3 1.3 0 0 1 0 2.6z" />
  </Svg>
);

// Icône PositionMan (position utilisateur)
export const PositionMan = ({ color = '#000000', size = 24, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 100 100" {...props}>
    <Path fill={color} d="M49.855 0A10.5 10.5 0 0 0 39.5 10.5A10.5 10.5 0 0 0 50 21a10.5 10.5 0 0 0 10.5-10.5A10.5 10.5 0 0 0 50 0a10.5 10.5 0 0 0-.145 0zm-.057 23.592c-7.834.002-15.596 3.368-14.78 10.096l2 14.625c.351 2.573 2.09 6.687 4.687 6.687h.185l2.127 24.531c.092 1.105.892 2 2 2h8c1.108 0 1.908-.895 2-2l2.127-24.53h.186c2.597 0 4.335-4.115 4.687-6.688l2-14.625c.524-6.734-7.384-10.097-15.219-10.096z" />
  </Svg>
);

// Icône KeyboardFill (clavier)
export const KeyboardFill = ({ color = '#000000', size = 26, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16" {...props}>
    <Path fill={color} d="M0 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6zm13 .25v.5c0 .138.112.25.25.25h.5a.25.25 0 0 0 .25-.25v-.5a.25.25 0 0 0-.25-.25h-.5a.25.25 0 0 0-.25.25zM2.25 8a.25.25 0 0 0-.25.25v.5c0 .138.112.25.25.25h.5A.25.25 0 0 0 3 8.75v-.5A.25.25 0 0 0 2.75 8h-.5zM4 8.25v.5c0 .138.112.25.25.25h.5A.25.25 0 0 0 5 8.75v-.5A.25.25 0 0 0 4.75 8h-.5a.25.25 0 0 0-.25.25zM6.25 8a.25.25 0 0 0-.25.25v.5c0 .138.112.25.25.25h.5A.25.25 0 0 0 7 8.75v-.5A.25.25 0 0 0 6.75 8h-.5zM8 8.25v.5c0 .138.112.25.25.25h.5A.25.25 0 0 0 9 8.75v-.5A.25.25 0 0 0 8.75 8h-.5a.25.25 0 0 0-.25.25zM13.25 8a.25.25 0 0 0-.25.25v.5c0 .138.112.25.25.25h.5a.25.25 0 0 0 .25-.25v-.5a.25.25 0 0 0-.25-.25h-.5zm0 2a.25.25 0 0 0-.25.25v.5c0 .138.112.25.25.25h.5a.25.25 0 0 0 .25-.25v-.5a.25.25 0 0 0-.25-.25h-.5zm-3-2a.25.25 0 0 0-.25.25v.5c0 .138.112.25.25.25h1.5a.25.25 0 0 0 .25-.25v-.5a.25.25 0 0 0-.25-.25h-1.5zm.75 2.25v.5c0 .138.112.25.25.25h.5a.25.25 0 0 0 .25-.25v-.5a.25.25 0 0 0-.25-.25h-.5a.25.25 0 0 0-.25.25zM11.25 6a.25.25 0 0 0-.25.25v.5c0 .138.112.25.25.25h.5a.25.25 0 0 0 .25-.25v-.5a.25.25 0 0 0-.25-.25h-.5zM9 6.25v.5c0 .138.112.25.25.25h.5a.25.25 0 0 0 .25-.25v-.5A.25.25 0 0 0 9.75 6h-.5a.25.25 0 0 0-.25.25zM7.25 6a.25.25 0 0 0-.25.25v.5c0 .138.112.25.25.25h.5A.25.25 0 0 0 8 6.75v-.5A.25.25 0 0 0 7.75 6h-.5zM5 6.25v.5c0 .138.112.25.25.25h.5A.25.25 0 0 0 6 6.75v-.5A.25.25 0 0 0 5.75 6h-.5a.25.25 0 0 0-.25.25zM2.25 6a.25.25 0 0 0-.25.25v.5c0 .138.112.25.25.25h1.5A.25.25 0 0 0 4 6.75v-.5A.25.25 0 0 0 3.75 6h-1.5zM2 10.25v.5c0 .138.112.25.25.25h.5a.25.25 0 0 0 .25-.25v-.5a.25.25 0 0 0-.25-.25h-.5a.25.25 0 0 0-.25.25zM4.25 10a.25.25 0 0 0-.25.25v.5c0 .138.112.25.25.25h5.5a.25.25 0 0 0 .25-.25v-.5a.25.25 0 0 0-.25-.25h-5.5z" />
  </Svg>
);

// Icône Copy (copier)
export const Copy = ({ color = '#000000', size = 20, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 512 512" {...props}>
    <Path fill={color} d="M408 480H184a72 72 0 0 1-72-72V184a72 72 0 0 1 72-72h224a72 72 0 0 1 72 72v224a72 72 0 0 1-72 72Z" />
    <Path fill={color} d="M160 80h235.88A72.12 72.12 0 0 0 328 32H104a72 72 0 0 0-72 72v224a72.12 72.12 0 0 0 48 67.88V160a80 80 0 0 1 80-80Z" />
  </Svg>
);

// Icône Reply (répondre)
export const Reply = ({ color = '#000000', size = 20, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...props}>
    <G fill="none">
      <Path fillRule="evenodd" clipRule="evenodd" d="M11 5a1 1 0 0 0-1.707-.707l-7 7a1 1 0 0 0 0 1.414l7 7A1 1 0 0 0 11 19v-3.025c1.691-.011 3.83.133 5.633.583c1.088.27 1.973.633 2.565 1.076c.567.424.802.864.802 1.366a1 1 0 1 0 2 0c0-1.925-.598-4.66-2.42-6.937c-1.719-2.15-4.462-3.805-8.58-4.036V5z" fill={color} />
    </G>
  </Svg>
);

// Icône Download2Rounded (télécharger)
export const Download2Rounded = ({ color = '#000000', size = 20, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...props}>
    <Path fill={color} d="M5 20h14q.425 0 .713.288T20 21q0 .425-.288.713T19 22H5q-.425 0-.713-.288T4 21q0-.425.288-.713T5 20Zm7-2.625q-.225 0-.438-.1t-.362-.3l-4.95-6.35q-.375-.5-.1-1.063T7.05 9H9V3q0-.425.288-.713T10 2h4q.425 0 .713.288T15 3v6h1.95q.625 0 .9.563t-.1 1.062l-4.95 6.35q-.15.2-.363.3t-.437.1Z" />
  </Svg>
);

// Icône Upload2Rounded (téléverser)
export const Upload2Rounded = ({ color = '#000000', size = 24, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...props}>
    <Path fill={color} d="M5 20h14q.425 0 .713.288T20 21q0 .425-.288.713T19 22H5q-.425 0-.713-.288T4 21q0-.425.288-.713T5 20Zm5-2q-.425 0-.713-.288T9 17v-6H7.05q-.625 0-.9-.563t.1-1.062l4.95-6.35q.15-.2.363-.3t.437-.1q.225 0 .438.1t.362.3l4.95 6.35q.375.5.1 1.063t-.9.562H15v6q0 .425-.288.713T14 18h-4Z" />
  </Svg>
);

// Icône CloseCircle (fermer cercle outline)
export const CloseCircle = ({ color = '#000000', size = 20, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...props}>
    <Path fill={color} d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17L12 13.41L8.41 17L7 15.59L10.59 12L7 8.41L8.41 7L12 10.59L15.59 7L17 8.41L13.41 12L17 15.59z" />
  </Svg>
);

// Icône StarOutline (étoile vide pour rating)
export const StarOutline = ({ color = '#000000', size = 32, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...props}>
    <Path fill={color} d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21L12 17.27z" />
  </Svg>
);

// Icône Setting (paramètres)
export const Setting = ({ color = '#000000', size = 20, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 20 20" {...props}>
    <Path fill={color} d="M11.078 0c.294 0 .557.183.656.457l.706 1.957c.253.063.47.126.654.192c.201.072.46.181.78.33l1.644-.87a.702.702 0 0 1 .832.131l1.446 1.495c.192.199.246.49.138.744l-.771 1.807c.128.235.23.436.308.604c.084.183.188.435.312.76l1.797.77c.27.115.437.385.419.674l-.132 2.075a.69.69 0 0 1-.46.605l-1.702.605c-.049.235-.1.436-.154.606a8.79 8.79 0 0 1-.298.774l.855 1.89a.683.683 0 0 1-.168.793l-1.626 1.452a.703.703 0 0 1-.796.096l-1.676-.888a7.23 7.23 0 0 1-.81.367l-.732.274l-.65 1.8a.696.696 0 0 1-.64.457L9.11 20a.697.697 0 0 1-.669-.447l-.766-2.027a14.625 14.625 0 0 1-.776-.29a9.987 9.987 0 0 1-.618-.293l-1.9.812a.702.702 0 0 1-.755-.133L2.22 16.303a.683.683 0 0 1-.155-.783l.817-1.78a9.517 9.517 0 0 1-.302-.644a14.395 14.395 0 0 1-.3-.811L.49 11.74a.69.69 0 0 1-.49-.683l.07-1.921a.688.688 0 0 1 .392-.594L2.34 7.64c.087-.319.163-.567.23-.748a8.99 8.99 0 0 1 .314-.712L2.07 4.46a.683.683 0 0 1 .15-.79l1.404-1.326a.702.702 0 0 1 .75-.138l1.898.784c.21-.14.4-.253.572-.344c.205-.109.479-.223.824-.346l.66-1.841A.696.696 0 0 1 8.984 0h2.094Zm-1.054 7.019c-1.667 0-3.018 1.335-3.018 2.983c0 1.648 1.351 2.984 3.018 2.984c1.666 0 3.017-1.336 3.017-2.984s-1.35-2.983-3.017-2.983Z" />
  </Svg>
);

// Icône HouseUser (adresse utilisateur)
export const HouseUser = ({ color = '#3B82F6', size = 16, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 576 512" {...props}>
    <Path fill={color} d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c.2 35.5-28.5 64.3-64 64.3H128.1c-35.3 0-64-28.7-64-64V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7l255.4 224.5c8 7 12 15 11 24zM352 224a64 64 0 1 0-128 0a64 64 0 1 0 128 0zm-96 96c-44.2 0-80 35.8-80 80c0 8.8 7.2 16 16 16h192c8.8 0 16-7.2 16-16c0-44.2-35.8-80-80-80h-64z" />
  </Svg>
);

// Icône Link3Fill (lien website)
export const Link3Fill = ({ color = '#3B82F6', size = 16, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...props}>
    <G fill="none" fillRule="evenodd">
      <Path d="M24 0v24H0V0h24ZM12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036c-.01-.003-.019 0-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.016-.018Zm.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01l-.184-.092Z" />
      <Path fill={color} d="M6 4.5a5.5 5.5 0 0 0-2.751 10.263a1.5 1.5 0 0 0 1.502-2.597A2.5 2.5 0 0 1 6 7.5h6a2.5 2.5 0 0 1 .626 4.921a1.5 1.5 0 0 0 .748 2.906A5.502 5.502 0 0 0 12 4.5H6Zm5.374 7.079a1.5 1.5 0 0 0-.748-2.906A5.502 5.502 0 0 0 12 19.5h6a5.5 5.5 0 0 0 2.751-10.263a1.5 1.5 0 0 0-1.502 2.597A2.5 2.5 0 0 1 18 16.5h-6a2.5 2.5 0 0 1-.626-4.921Z" />
    </G>
  </Svg>
);

// Icône BlockOutline (bloquer utilisateur)
export const BlockOutline = ({ color = '#000000', size = 20, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...props}>
    <Path fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m7 7l10 10M7 17L17 7M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10" />
  </Svg>
);

// Icône ReportProblemOutline (signaler outline)
export const ReportProblemOutline = ({ color = '#000000', size = 20, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...props}>
    <Path fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v4m-1.637-9.409L2.257 18.125A1.914 1.914 0 0 0 3.915 21h16.17a1.914 1.914 0 0 0 1.658-2.875L13.637 3.591a1.914 1.914 0 0 0-3.274 0M12 17h.01" />
  </Svg>
);

// Icône Filter2Fill (filtres)
export const Filter2Fill = ({ color = '#000000', size = 24, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...props}>
    <G fill="none">
      <Path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z" />
      <Path fill={color} d="M14 16.5a1.5 1.5 0 0 1 .144 2.993L14 19.5h-4a1.5 1.5 0 0 1-.144-2.993L10 16.5h4Zm3-6a1.5 1.5 0 0 1 0 3H7a1.5 1.5 0 0 1 0-3h10Zm3-6a1.5 1.5 0 0 1 0 3H4a1.5 1.5 0 1 1 0-3h16Z" />
    </G>
  </Svg>
);

// Icône SunFill (mode clair)
export const SunFill = ({ color = '#000000', size = 24, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...props}>
    <Path fill={color} d="M17.891 12a5.944 5.944 0 0 1-3.68 5.499a5.968 5.968 0 0 1-6.496-1.295A5.948 5.948 0 0 1 11.943 6.05a5.956 5.956 0 0 1 4.21 1.743A5.94 5.94 0 0 1 17.89 12M3.203 13.048H2.05A1.05 1.05 0 0 1 1 12a1.047 1.047 0 0 1 1.05-1.048h1.153A1.05 1.05 0 0 1 4.253 12a1.047 1.047 0 0 1-1.05 1.048m18.747 0h-1.143A1.05 1.05 0 0 1 19.758 12a1.047 1.047 0 0 1 1.05-1.048h1.143A1.05 1.05 0 0 1 23 12a1.047 1.047 0 0 1-1.05 1.048m-9.965-8.8a1.05 1.05 0 0 1-1.05-1.048V2.048A1.047 1.047 0 0 1 11.986 1a1.05 1.05 0 0 1 1.049 1.048V3.2a1.047 1.047 0 0 1-1.05 1.048m0 18.752a1.05 1.05 0 0 1-1.05-1.047V20.8a1.047 1.047 0 0 1 1.05-1.048a1.05 1.05 0 0 1 1.049 1.048v1.152A1.047 1.047 0 0 1 11.984 23M5.753 6.825a1.05 1.05 0 0 1-.745-.314l-.819-.807a1.051 1.051 0 0 1 .745-1.796c.28 0 .548.111.745.308l.819.817a1.047 1.047 0 0 1 0 1.478a1.05 1.05 0 0 1-.745.314m13.271 13.221a1.05 1.05 0 0 1-.735-.304l-.818-.817a1.047 1.047 0 0 1 1.14-1.739c.13.063.245.152.34.262l.818.817a1.047 1.047 0 0 1 0 1.477a1.05 1.05 0 0 1-.745.304m-.808-13.221a1.05 1.05 0 0 1-1.034-1.254c.04-.204.142-.391.29-.538l.818-.817a1.05 1.05 0 0 1 1.48 1.488l-.82.807a1.05 1.05 0 0 1-.734.314M4.934 20.046a1.051 1.051 0 0 1-.745-.304a1.046 1.046 0 0 1 0-1.477l.819-.817a1.048 1.048 0 0 1 1.49 0a1.047 1.047 0 0 1 0 1.477l-.819.817a1.049 1.049 0 0 1-.745.304" />
  </Svg>
);

// Icône DarkModeRounded (mode sombre)
export const DarkModeRounded = ({ color = '#000000', size = 24, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...props}>
    <Path fill={color} d="M12.058 20q-3.333 0-5.667-2.334Q4.058 15.333 4.058 12q0-2.47 1.413-4.536t4.01-2.972q.306-.107.536-.056q.231.05.381.199t.191.38q.042.233-.062.489q-.194.477-.282.971q-.087.494-.087 1.025q0 2.673 1.863 4.537q1.864 1.863 4.537 1.863q.698 0 1.278-.148q.58-.148.987-.24q.217-.04.4.01q.18.051.29.176q.116.125.157.308q.042.182-.047.417q-.715 2.45-2.803 4.014Q14.733 20 12.058 20Z" />
  </Svg>
);

// Icône SettingAltFill (paramètres auto)
export const SettingAltFill = ({ color = '#000000', size = 24, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...props}>
    <Path fill={color} fillRule="evenodd" d="M12 1.485c-.658 0-1.23.421-2.373 1.264L7.906 4.018c-.18.133-.27.199-.367.255c-.097.056-.2.1-.405.19l-1.959.856c-1.302.57-1.953.854-2.282 1.423c-.328.57-.25 1.276-.091 2.688l.238 2.125c.025.222.037.333.037.445c0 .112-.012.223-.037.445l-.238 2.125c-.158 1.412-.237 2.118.091 2.688c.33.57.98.854 2.282 1.423l1.96.856c.204.09.307.134.404.19c.096.056.187.122.367.255l1.72 1.269c1.145.843 1.717 1.264 2.374 1.264s1.23-.421 2.373-1.264l1.721-1.269c.18-.133.27-.199.367-.255c.097-.056.2-.1.405-.19l1.959-.856c1.302-.57 1.953-.854 2.282-1.423c.328-.57.25-1.276.09-2.688l-.237-2.125c-.025-.222-.038-.333-.038-.445c0-.112.013-.223.038-.445l.238-2.125c.158-1.412.237-2.118-.091-2.688c-.33-.57-.98-.854-2.282-1.423l-1.96-.856a4.128 4.128 0 0 1-.404-.19a4.132 4.132 0 0 1-.367-.255l-1.72-1.269C13.228 1.906 12.656 1.485 12 1.485M12 16a4 4 0 1 0 0-8a4 4 0 0 0 0 8" clipRule="evenodd" />
  </Svg>
);

// Icône DonateHeart (don/soutien)
export const DonateHeart = ({ color = '#000000', size = 24, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...props}>
    <Path fill={color} d="M17.726 13.02L14 16H9v-1h4.065a.5.5 0 0 0 .416-.777l-.888-1.332A1.995 1.995 0 0 0 10.93 12H3a1 1 0 0 0-1 1v6a2 2 0 0 0 2 2h9.639a3 3 0 0 0 2.258-1.024L22 13l-1.452-.484a2.998 2.998 0 0 0-2.822.504zm1.532-5.63c.451-.465.73-1.108.73-1.818s-.279-1.353-.73-1.818A2.447 2.447 0 0 0 17.494 3S16.25 2.997 15 4.286C13.75 2.997 12.506 3 12.506 3a2.45 2.45 0 0 0-1.764.753c-.451.466-.73 1.108-.73 1.818s.279 1.354.73 1.818L15 12l4.258-4.61z" />
  </Svg>
);

// Icône Logout1Solid (déconnexion)
export const Logout1Solid = ({ color = '#000000', size = 24, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 14 14" {...props}>
    <Path fill={color} fillRule="evenodd" d="M2.5.351a40.5 40.5 0 0 1 5.74 0c1.136.081 2.072.874 2.264 1.932a2.25 2.25 0 0 0-2.108 2.28H4.754a2.25 2.25 0 0 0 0 4.5h3.642a2.25 2.25 0 0 0 2.145 2.281l-.004.085c-.06 1.2-1.06 2.132-2.296 2.22a40.5 40.5 0 0 1-5.742 0C1.263 13.561.263 12.63.203 11.43a91 91 0 0 1 0-8.859C.263 1.372 1.263.439 2.5.351m7.356 5.462L9.661 4.7a1 1 0 0 1 1.432-1.067c1.107.553 2.178 1.624 2.731 2.731a1 1 0 0 1 0 .895c-.553 1.107-1.624 2.178-2.731 2.731A1 1 0 0 1 9.66 8.924l.195-1.111H4.754a1 1 0 1 1 0-2z" clipRule="evenodd" />
  </Svg>
);

// Icône SquareInstagram (Instagram)
export const SquareInstagram = ({ color = '#000000', size = 24, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 448 512" {...props}>
    <Path fill={color} d="M194.4 211.7a53.3 53.3 0 1 0 59.2 88.6a53.3 53.3 0 1 0-59.2-88.6m142.3-68.4c-5.2-5.2-11.5-9.3-18.4-12c-18.1-7.1-57.6-6.8-83.1-6.5c-4.1 0-7.9.1-11.2.1s-7.2 0-11.4-.1c-25.5-.3-64.8-.7-82.9 6.5c-6.9 2.7-13.1 6.8-18.4 12s-9.3 11.5-12 18.4c-7.1 18.1-6.7 57.7-6.5 83.2c0 4.1.1 7.9.1 11.1s0 7-.1 11.1c-.2 25.5-.6 65.1 6.5 83.2c2.7 6.9 6.8 13.1 12 18.4s11.5 9.3 18.4 12c18.1 7.1 57.6 6.8 83.1 6.5c4.1 0 7.9-.1 11.2-.1s7.2 0 11.4.1c25.5.3 64.8.7 82.9-6.5c6.9-2.7 13.1-6.8 18.4-12s9.3-11.5 12-18.4c7.2-18 6.8-57.4 6.5-83c0-4.2-.1-8.1-.1-11.4s0-7.1.1-11.4c.3-25.5.7-64.9-6.5-83c-2.7-6.9-6.8-13.1-12-18.4zm-67.1 44.5c18.1 12.1 30.6 30.9 34.9 52.2s-.2 43.5-12.3 61.6c-6 9-13.7 16.6-22.6 22.6s-19 10.1-29.6 12.2c-21.3 4.2-43.5-.2-61.6-12.3s-30.6-30.9-34.9-52.2s.2-43.5 12.2-61.6s30.9-30.6 52.2-34.9s43.5.2 61.6 12.2h.1zm29.2-1.3c-3.1-2.1-5.6-5.1-7.1-8.6s-1.8-7.3-1.1-11.1s2.6-7.1 5.2-9.8s6.1-4.5 9.8-5.2s7.6-.4 11.1 1.1s6.5 3.9 8.6 7s3.2 6.8 3.2 10.6c0 2.5-.5 5-1.4 7.3s-2.4 4.4-4.1 6.2s-3.9 3.2-6.2 4.2s-4.8 1.5-7.3 1.5c-3.8 0-7.5-1.1-10.6-3.2zM448 96c0-35.3-28.7-64-64-64H64C28.7 32 0 60.7 0 96v320c0 35.3 28.7 64 64 64h320c35.3 0 64-28.7 64-64zm-91 293c-18.7 18.7-41.4 24.6-67 25.9c-26.4 1.5-105.6 1.5-132 0c-25.6-1.3-48.3-7.2-67-25.9s-24.6-41.4-25.8-67c-1.5-26.4-1.5-105.6 0-132c1.3-25.6 7.1-48.3 25.8-67s41.5-24.6 67-25.8c26.4-1.5 105.6-1.5 132 0c25.6 1.3 48.3 7.1 67 25.8s24.6 41.4 25.8 67c1.5 26.3 1.5 105.4 0 131.9c-1.3 25.6-7.1 48.3-25.8 67z" />
  </Svg>
);

// Icône TiktokSolid (TikTok)
export const TiktokSolid = ({ color = '#000000', size = 24, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 14 14" {...props}>
    <Path fill={color} fillRule="evenodd" d="M3.657.475C4.731.355 5.852.25 7 .25s2.269.105 3.343.225a3.63 3.63 0 0 1 3.194 3.203c.115 1.069.213 2.182.213 3.322s-.098 2.253-.213 3.322a3.63 3.63 0 0 1-3.194 3.203c-1.074.12-2.195.225-3.343.225s-2.269-.105-3.343-.225a3.63 3.63 0 0 1-3.194-3.203C.348 9.253.25 8.14.25 7s.098-2.253.213-3.322A3.63 3.63 0 0 1 3.657.475m4.675 2.407a.625.625 0 0 0-1.234.141V8.8a1.552 1.552 0 1 1-1.552-1.552a.625.625 0 1 0 0-1.25A2.802 2.802 0 1 0 8.348 8.8V5.31c.6.51 1.374.79 2.282.79a.625.625 0 1 0 0-1.25c-.66 0-1.15-.204-1.511-.525c-.368-.328-.641-.816-.787-1.443" clipRule="evenodd" />
  </Svg>
);

// Icône Youtube (YouTube)
export const Youtube = ({ color = '#000000', size = 24, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 1000 1000" {...props}>
    <Path fill={color} d="M807 111v313h-64v-35q-37 39-74 39q-45 0-45-56V111h64v240q0 21 17 21t38-24V111h64zm-237 73v162q0 42-25 64t-68 22q-41 0-66.5-23.5T385 345V183q0-39 27.5-59.5T480 103q38 0 64 22t26 59zm-65 167V180q0-10-9-16.5t-19-6.5t-18 6.5t-8 16.5v171q0 26 26 26q28 0 28-26zM315 0h73l-55 165q-4 12-10 27.5t-10.5 28T305 248v176h-72V256q-2-12-29-85L147 0h73l46 169h5zm611 739q0 49-6 145q-4 50-38.5 79.5T797 995q-99 5-297 5q-199 0-297-5q-50-2-84.5-31.5T80 884q-6-96-6-145t6-145q4-50 38.5-79.5T203 483q98-5 297-5t297 5q50 2 84.5 31.5T920 594q6 96 6 145zm-71 91v-19h-53q0 2 .5 13t0 15.5T800 851t-7 10t-14 3q-10 0-15.5-6t-6-12t-.5-17v-48h98v-64q0-35-19-55t-54-20q-34 0-56.5 20.5T703 717v113q0 36 19.5 57.5T778 909q77 0 77-79zm-191 19V709q0-63-50-63q-25 0-46 23V559h-52v343h52v-20q22 23 49 23q47 0 47-56zm-250 53h51V649h-51v192q-17 19-31 19q-13 0-13-17V649h-52v213q0 44 36 44q30 0 60-32v28zM258 609h61v-50H140v50h60v293h58V609zm544 105v28h-45v-28q0-27 23-27q22 0 22 27zm-191-3v133q0 21-18 21q-14 0-25-11V696q10-10 22-10q21 0 21 25z" />
  </Svg>
);

// Icône Facebook1Solid (Facebook)
export const Facebook1Solid = ({ color = '#000000', size = 24, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 48 48" {...props}>
    <Path fill={color} d="M29.505 46.445q.01-.1.011-.202V30.04h5.539c.888 0 1.687-.585 1.817-1.464a12.9 12.9 0 0 0-.015-3.714c-.128-.863-.896-1.43-1.768-1.43h-5.573c0-4.994.831-5.72 5.515-5.812c.899-.017 1.705-.61 1.836-1.5c.22-1.495.132-2.801-.006-3.72c-.127-.849-.888-1.402-1.746-1.395c-8.279.072-12.994 1.051-12.994 12.426h-4.289c-.833 0-1.573.523-1.7 1.346c-.135.888-.217 2.175.01 3.74c.13.904.944 1.523 1.857 1.523h4.122v16.454c-6.41-.042-10.998-.295-13.985-.538c-3.288-.267-5.825-2.804-6.092-6.092C1.778 36.593 1.5 31.401 1.5 24s.278-12.593.544-15.864C2.31 4.848 4.848 2.31 8.136 2.044C11.407 1.778 16.599 1.5 24 1.5s12.593.278 15.864.544c3.288.267 5.825 2.804 6.092 6.092c.266 3.271.544 8.463.544 15.864s-.278 12.593-.544 15.864c-.267 3.288-2.804 5.825-6.092 6.092c-2.39.194-5.805.395-10.359.49" />
  </Svg>
);

// Icône Facebook (multicolore pour connexion sociale)
export const Facebook = ({ size = 24, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 256 256" {...props}>
    <Path fill="#1877F2" d="M256 128C256 57.308 198.692 0 128 0C57.308 0 0 57.307 0 128c0 63.888 46.808 116.843 108 126.445V165H75.5v-37H108V99.8c0-32.08 19.11-49.8 48.347-49.8C170.352 50 185 52.5 185 52.5V84h-16.14C152.958 84 148 93.867 148 103.99V128h35.5l-5.675 37H148v89.445c61.192-9.602 108-62.556 108-126.445" />
    <Path fill="#FFF" d="m177.825 165l5.675-37H148v-24.01C148 93.866 152.959 84 168.86 84H185V52.5S170.352 50 156.347 50C127.11 50 108 67.72 108 99.8V128H75.5v37H108v89.445A128.959 128.959 0 0 0 128 256a128.9 128.9 0 0 0 20-1.555V165h29.825" />
  </Svg>
);

// Icône SquareXTwitter (X/Twitter)
export const SquareXTwitter = ({ color = '#000000', size = 24, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 448 512" {...props}>
    <Path fill={color} d="M64 32C28.7 32 0 60.7 0 96v320c0 35.3 28.7 64 64 64h320c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64zm297.1 84L257.3 234.6L379.4 396h-95.6L209 298.1L123.3 396H75.8l111-126.9L69.7 116h98l67.7 89.5l78.2-89.5zm-37.8 251.6L153.4 142.9h-28.3l171.8 224.7z" />
  </Svg>
);

// Icône PinterestSquare (Pinterest)
export const PinterestSquare = ({ color = '#000000', size = 24, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 1536 1536" {...props}>
    <Path fill={color} d="M1248 0q119 0 203.5 84.5T1536 288v960q0 119-84.5 203.5T1248 1536H523q85-122 108-210q9-34 53-209q21 39 73.5 67t112.5 28q181 0 295.5-147.5T1280 691q0-84-35-162.5t-96.5-139t-152.5-97T799 256q-104 0-194.5 28.5t-153 76.5T344 470.5t-66.5 128T256 731q0 102 39.5 180T412 1021q13 5 23.5 0t14.5-19q10-44 15-61q6-23-11-42q-50-62-50-150q0-150 103.5-256.5T778 386q149 0 232.5 81t83.5 210q0 168-67.5 286T853 1081q-60 0-97-43.5T733 934q8-34 26.5-92.5t29.5-102t11-74.5q0-49-26.5-81.5T698 551q-61 0-103.5 56.5T552 747q0 72 24 121l-98 414q-24 100-7 254H288q-119 0-203.5-84.5T0 1248V288Q0 169 84.5 84.5T288 0h960z" />
  </Svg>
);

// Icône PhoneLaptop16Filled (appareils connectés)
export const PhoneLaptop16Filled = ({ color = '#000000', size = 64, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16" {...props}>
    <Path fill={color} d="M1 4.5A1.5 1.5 0 0 1 2.5 3h6A1.5 1.5 0 0 1 10 4.5v6A1.5 1.5 0 0 1 8.5 12h-6A1.5 1.5 0 0 1 1 10.5zM5.5 9a.5.5 0 0 0 0 1h.5a.5.5 0 0 0 0-1zm6-5.5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 .5.5h3.5a.5.5 0 0 0 0-1H12V4.5a1 1 0 0 0-1-1z" />
  </Svg>
);

// Icône PhoneFill (téléphone)
export const PhoneFill = ({ color = '#000000', size = 20, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16" {...props}>
    <Path fill={color} d="M3 2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V2zm6 11a1 1 0 1 0-2 0a1 1 0 0 0 2 0z" />
  </Svg>
);

// Icône Disconnected (déconnexion appareil)
export const Disconnected = ({ color = '#000000', size = 16, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...props}>
    <Path fill={color} d="M19.07 4.93a10 10 0 0 0-14.14 0l1.41 1.41a8 8 0 0 1 11.32 0zM12 10c1.93 0 3.68.78 4.95 2.05l1.41-1.41A9 9 0 0 0 6.64 10.64l1.41 1.41A6.95 6.95 0 0 1 12 10m0 6c-.55 0-1 .45-1 1s.45 1 1 1s1-.45 1-1s-.45-1-1-1m2.12-2.12l1.41-1.41A5 5 0 0 0 8.47 12.47l1.41 1.41A3 3 0 0 1 12 13c.79 0 1.5.31 2.12.88" />
  </Svg>
);
