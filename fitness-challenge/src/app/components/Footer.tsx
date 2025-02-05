import React from "react";

const Footer = () => {
  return (
    <footer className="mt-8 text-center text-gray-600 text-sm pb-6">
      <p>
        Avatars use the <strong>Adventurer</strong> style by Lisa Wischofsky,
        licensed under{" "}
        <a
          href="https://creativecommons.org/licenses/by/4.0/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-500 underline"
        >
          CC BY 4.0
        </a>
        , provided by{" "}
        <a
          href="https://dicebear.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-500 underline"
        >
          Dicebear
        </a>
        .
      </p>
    </footer>
  );
};

export default Footer;
