const Footer = () => {
  return (
    <footer className="px-4 divide-y text-gray-800 relative bottom-0 left-0">
      <div className="py-6 text-sm text-center text-gray-950">
        © {new Date().getFullYear()} AirCNC Inc. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
