
import {
  FcGallery,
  FcCollaboration,
  FcParallelTasks,
  FcDislike,
} from 'react-icons/fc';
export const userData = [
  {
    name: 'Phillip Torff',
    profile: '/assets/images/man1.jpg',
    lastMessage: 'Thank you Phillip!',
    online: true,
    active: true,
  },
  {
    name: 'Alfredo Vetrovs',
    profile: '/assets/images/man2.jpg',
    lastMessage: 'OMW bro...',
    online: true,
  },
  {
    name: 'Davis Dorwart',
    profile: '/assets/images/man3.jpg',
    lastMessage: 'Did you see the new movie of...',
    online: false,
  },
  {
    name: 'James Kenter',
    profile: '/assets/images/man4.jpg',
    lastMessage: 'Our new project will be awesome...',
    online: false,
  },
  {
    name: 'Jocelyn Donin',
    profile: '/assets/images/women1.jpg',
    lastMessage: 'Davis please call me when you...',
    online: false,
  },
  {
    name: 'Kierra Press',
    profile: '/assets/images/women2.jpg',
    lastMessage: 'I did it yesterday.',
    online: true,
  },
  {
    name: 'Rayna Bator',
    profile: '/assets/images/women3.jpg',
    lastMessage: 'No way :)',
    online: false,
  },
];

export const messages = [
  {
    from: 'Tracy Wright',
    to: 'Phillip Torff',
    message: 'Hello m8!',
    time: '15:02',
  },
  {
    from: 'Tracy Wright',
    to: 'Phillip Torff',
    message:
      'I have send the files back to ya it only took me about 60 mins this time was with testing too.',
    time: '15:07',
  },
  {
    from: 'Tracy Wright',
    to: 'Phillip Torff',
    message:
      'These are the photos I have found for the moodboard project. Please let me know if you like them or not.',
    time: '15:08',
  },
  {
    from: 'Phillip Torff',
    to: 'Tracy Wright',
    message:
      "Wow! These photos are amazing! I'll add them to moodboard and send you the final presentation. ",
    time: '15:10',
  },
  {
    from: 'Phillip Torff',
    to: 'Tracy Wright',
    message: 'Thank you Phillip!',
    time: '15:10',
  },
];

export const options = [
  {
    icon: '/user.svg',
    label: 'Profile',
  },
  {
    icon: '/settings.svg',
    label: 'Settings',
  },
  {
    icon: '/plus.svg',
    label: 'Add new friend',
  },
];

export const medaiOptions = [
  {
    icon: '/image.svg',
    label: 'Pictures',
  },
  {
    icon: '/video.svg',
    label: 'Videos',
  },
  {
    icon: '/docs.svg',
    label: 'Docs',
  },
];

export const members = [
  {
    name: 'Abdessamad pas',
    date: 'last seen recently',
    leader: true,
    image:
      'https://images.unsplash.com/photo-1557002665-c552e1832483?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
  },
  {
    name: 'Zakaria elhajri',
    date: 'last seen recently',
    leader: false,
    image:
      'https://images.unsplash.com/photo-1607081692245-419edffb5462?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
  },
  {
    name: 'Chaymae Loukili',
    date: 'last seen recently',
    leader: false,
    image:
      'https://images.unsplash.com/photo-1612000529646-f424a2aa1bff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  },
  {
    name: 'Oumaima chi la3ba',
    date: 'last seen recently',
    leader: false,
    image:
      'https://images.unsplash.com/photo-1551847812-f815b31ae67c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80',
  },
];
export const groups = [
  {
    name: 'Group 1',
    icon: <FcGallery size={24} />,
    members: 2,
  },
  {
    name: 'Group 2',
    icon: <FcCollaboration size={24} />,
    members: 2,
  },
  {
    name: 'Group 3',
    icon: <FcParallelTasks size={24} />,
    members: 2,
  },
  {
    name: 'Group 4',
    icon: <FcDislike size={24} />,
    members: 2,
  },
];
