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
