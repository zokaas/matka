import React from "react";

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-purple-800">Tiimin matka</h1>
          <p className="mt-2 text-gray-600">
            Seurataan yhdessä etenemistä kohti tavoitetta 🌟
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
