const Footer = () => {
  return (
    <div className="mt-auto w-full p-3 flex items-center justify-center text-center">
      <code className="text-balance">
        <span className="font-medium text-xl">© </span>
        {new Date().getFullYear()} WingsInProgress. All rights reserved.
      </code>
    </div>
  );
};

export default Footer;
