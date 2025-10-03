import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet } from 'lucide-react';
import { TapiLogo } from '../components/TapiLogo';

function HomePage() {
  return (
    <div className="min-h-screen bg-tapi-gradient flex flex-col items-center justify-center p-4">
      <div className="mb-12">
        <TapiLogo className="h-16" />
      </div>
      
      <div className="glass-card rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-tapi-green bg-opacity-10 p-4 rounded-full flex items-center justify-center">
            <Wallet className="h-16 w-16 text-black" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-tapi-dark mb-4">
          Sistema de Prefondeo
        </h1>
        
        <p className="text-gray-600 mb-8 text-lg">
          Bienvenido al sistema de gestión de solicitudes de prefondeo.
        </p>

        <Link
          to="/admin/dashboard"
          className="block w-full bg-tapi-green text-white rounded-xl py-4 px-6 font-medium hover:bg-tapi-dark transition-all duration-300 glow-button text-lg"
        >
          Ver Enlaces de Clientes →
        </Link>
        
        <Link
          to="/admin-v2/dashboard"
          className="block w-full mt-4 bg-blue-500 text-white rounded-xl py-4 px-6 font-medium hover:bg-blue-600 transition-all duration-300 text-lg"
        >
          Ver Enlaces Regalii →
        </Link>
      </div>

      <div className="mt-8 text-white text-sm opacity-70">
        © 2024 Tapi. Integrando Latinoamérica
      </div>
    </div>
  );
}

export default HomePage;