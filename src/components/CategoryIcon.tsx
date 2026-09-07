import React from 'react';
import {
  Database,
  Bot,
  Sparkles,
  Palette,
  Folder,
  Terminal,
  Cloud,
  Wrench,
  Shield,
  Globe,
  Layers,
  Code2,
  Cpu,
  Boxes,
  Zap,
  BookMarked,
  Sliders,
  LucideProps
} from 'lucide-react';

interface CategoryIconProps extends LucideProps {
  name: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, ...props }) => {
  switch (name.toLowerCase()) {
    case 'database':
      return <Database {...props} />;
    case 'bot':
      return <Bot {...props} />;
    case 'sparkles':
      return <Sparkles {...props} />;
    case 'palette':
      return <Palette {...props} />;
    case 'terminal':
      return <Terminal {...props} />;
    case 'cloud':
      return <Cloud {...props} />;
    case 'wrench':
      return <Wrench {...props} />;
    case 'shield':
      return <Shield {...props} />;
    case 'globe':
      return <Globe {...props} />;
    case 'layers':
      return <Layers {...props} />;
    case 'code2':
      return <Code2 {...props} />;
    case 'cpu':
      return <Cpu {...props} />;
    case 'boxes':
      return <Boxes {...props} />;
    case 'zap':
      return <Zap {...props} />;
    case 'bookmarked':
      return <BookMarked {...props} />;
    case 'sliders':
      return <Sliders {...props} />;
    default:
      return <Folder {...props} />;
  }
};
