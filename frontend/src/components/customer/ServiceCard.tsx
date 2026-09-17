import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ServiceCategoryMock } from '@/services/customerMockData';
import { 
  Zap, 
  Droplet, 
  Hammer, 
  Paintbrush, 
  Car, 
  Stethoscope, 
  HeartHandshake, 
  Baby, 
  Sparkles, 
  Home, 
  Flower2, 
  Wrench,
  ChevronRight,
  Users
} from 'lucide-react';

interface ServiceCardProps {
  category: ServiceCategoryMock;
  compact?: boolean;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ category, compact = false }) => {
  const navigate = useNavigate();

  const getCategoryIcon = (iconName: string) => {
    const props = { className: 'w-6 h-6 text-white' };
    switch (iconName) {
      case 'Zap': return <Zap {...props} />;
      case 'Droplet': return <Droplet {...props} />;
      case 'Hammer': return <Hammer {...props} />;
      case 'Paintbrush': return <Paintbrush {...props} />;
      case 'Car': return <Car {...props} />;
      case 'Stethoscope': return <Stethoscope {...props} />;
      case 'HeartHandshake': return <HeartHandshake {...props} />;
      case 'Baby': return <Baby {...props} />;
      case 'Sparkles': return <Sparkles {...props} />;
      case 'Home': return <Home {...props} />;
      case 'Flower2': return <Flower2 {...props} />;
      case 'Wrench': default: return <Wrench {...props} />;
    }
  };

  const handleCardClick = () => {
    navigate(`/customer/services?category=${category.slug}`);
  };

  if (compact) {
    return (
      <div
        onClick={handleCardClick}
        className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-200 hover:border-gov-green hover:shadow-md transition-all cursor-pointer group text-center"
      >
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-xs group-hover:scale-108 transition-transform mb-2`}>
          {getCategoryIcon(category.iconName)}
        </div>
        <h4 className="font-extrabold text-xs text-gov-navy group-hover:text-gov-green transition-colors leading-tight line-clamp-1">
          {category.title}
        </h4>
        <span className="text-[10px] text-gov-muted mt-0.5 font-medium">
          ₹{category.startingPrice} onwards
        </span>
      </div>
    );
  }

  return (
    <div
      onClick={handleCardClick}
      className="relative p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-gov-green hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between overflow-hidden"
    >
      {/* Top Accent Stripe */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${category.color}`} />

      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-md group-hover:scale-108 transition-transform`}>
            {getCategoryIcon(category.iconName)}
          </div>
          {category.popular && (
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
              Popular
            </span>
          )}
        </div>

        <div>
          <div className="flex items-center space-x-1.5">
            <h3 className="font-extrabold text-sm text-gov-navy group-hover:text-gov-green transition-colors">
              {category.title}
            </h3>
            <span className="text-[10px] text-gov-muted font-normal">
              ({category.hindiTitle})
            </span>
          </div>
          <p className="text-xs text-gov-muted line-clamp-2 mt-1 leading-relaxed">
            {category.shortDesc}
          </p>
        </div>
      </div>

      <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <div>
          <span className="text-[10px] text-gov-muted block">Starting at</span>
          <span className="font-black text-gov-navy text-sm">₹{category.startingPrice}</span>
        </div>

        <div className="flex items-center space-x-1 text-emerald-700 font-bold text-[11px] group-hover:translate-x-0.5 transition-transform">
          <Users className="w-3 h-3" />
          <span>{category.availableWorkers} Near You</span>
          <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
        </div>
      </div>
    </div>
  );
};
