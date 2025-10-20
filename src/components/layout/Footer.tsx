import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Github } from 'lucide-react';

const Footer: React.FC = () => {
  const socialLinks = [
    { icon: <Twitter size={20} />, href: '#' },
    { icon: <Linkedin size={20} />, href: '#' },
    { icon: <Github size={20} />, href: '#' },
  ];

  const footerLinks = {
    'Product': [
      { name: 'Packages', to: '#packages' },
      { name: 'How it Works', to: '#how-it-works' },
    ],
    'Company': [
      { name: 'About Us', to: '#' },
      { name: 'Contact', to: '#' },
    ],
    'Legal': [
      { name: 'Privacy Policy', to: '#' },
      { name: 'Terms of Service', to: '#' },
    ],
  };

  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="flex items-center justify-center h-8 w-8 bg-gradient-to-r from-primary to-accent rounded-md shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
              </div>
              <span className="text-xl font-bold">PrimeAdView</span>
            </Link>
            <p className="text-muted-foreground max-w-xs">
              Earn money by watching ads. Simple, fast, and reliable payment solutions.
            </p>
            <div className="flex space-x-4 mt-4">
              {socialLinks.map((link, i) => (
                <a 
                  key={i} 
                  href={link.href} 
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={`Social link ${i+1}`}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-medium text-sm uppercase tracking-wider text-primary mb-4">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <a href={link.to} className="text-muted-foreground hover:text-foreground transition-colors">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-border/50 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} PrimeAdView. All rights reserved.
          </p>
          <div className="mt-4 sm:mt-0 text-sm text-muted-foreground">
            Designed with care for our users
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
