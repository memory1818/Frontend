import type { ReactNode } from 'react';
import { BsImageFill } from 'react-icons/bs';
import { FaCloudDownloadAlt, FaCog } from 'react-icons/fa';

export type MenuTabId = 'canvas' | 'layers' | 'download' | 'settings';

export const menuTabsDefinition: {
  id: MenuTabId;
  label: string;
  icon: ReactNode;
}[] = [
  {
    id: 'canvas',
    label: 'Canvas',
    icon: <BsImageFill />,
  },
  {
    id: 'download',
    label: 'Download',
    icon: <FaCloudDownloadAlt />,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <FaCog />,
  },
];
