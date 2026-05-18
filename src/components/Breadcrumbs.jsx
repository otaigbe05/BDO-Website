import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link to="/" className="flex items-center text-slate-500 hover:text-blue-700 transition-colors" aria-label="Navigate to Home">
              <Home className="w-4 h-4" />
            </Link>
          </li>
          {pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;
            
            // Format URL pathnames to proper Titles
            let displayName = name
              .split('-')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
              
            // Handle specific capitalization rules
            displayName = displayName
                .replace('Omis', 'OMIS')
                .replace('Roi', 'ROI')
                .replace('Bdo', 'BDO');

            return (
              <li key={name} className="flex items-center">
                <ChevronRight className="w-4 h-4 mx-1 text-slate-400" aria-hidden="true" />
                {isLast ? (
                  <span className="font-bold text-slate-900" aria-current="page">
                    {displayName}
                  </span>
                ) : (
                  <Link to={routeTo} className="font-semibold text-slate-500 hover:text-blue-700 transition-colors">
                    {displayName}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumbs;