import React from 'react';

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
}

const Footer = React.forwardRef<HTMLElement, FooterProps>(
  ({ className, ...props }, ref) => {
    const currentYear = new Date().getFullYear();

    return (
      <footer
        ref={ref}
        className={`bg-gray-50 border-t border-gray-200 ${className || ''}`}
        {...props}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 text-center">
            <p className="text-sm text-gray-600">
              © {currentYear} Insight Up Solutions. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    );
  }
);

Footer.displayName = 'Footer';

export default Footer;