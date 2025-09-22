import React from 'react';

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
}

const Header = React.forwardRef<HTMLElement, HeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <header
        ref={ref}
        className={`bg-white shadow-sm border-b border-gray-200 ${className || ''}`}
        {...props}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-semibold text-gray-900">
                Insight Up Solutions
              </h1>
            </div>
          </div>
        </div>
      </header>
    );
  }
);

Header.displayName = 'Header';

export default Header;