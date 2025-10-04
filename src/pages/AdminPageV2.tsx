import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ClipboardCopy } from 'lucide-react';
import { fetchClients } from '../lib/supabase';
import type { Client } from '../lib/types';
import { TapiLogo } from '../components/TapiLogo';

function AdminPageV2() {
  const { adminId } = useParams();
  const [clients, setClients] = useState<Client[]>([]);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  useEffect(() => {
    async function loadClients() {
      const { data, error } = await fetchClients('clients_duplicate');
      
      if (error) {
        console.error('Error fetching clients:', error);
        return;
      }

      setClients(data || []);
    }

    loadClients();
  }, []);

  const copyToClipboard = (link: string) => {
    navigator.clipboard.writeText(window.location.origin + link);
    setCopiedLink(link);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <div className="min-h-screen bg-tapi-gradient p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-center mb-12">
          <TapiLogo className="h-12 w-auto mx-auto" />
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-4">
          Enlaces de Clientes - Regalii
        </h1>
        
        <div className="bg-blue-100 border-l-4 border-blue-500 p-4 mb-8 rounded">
          <p className="text-blue-800 font-medium">
            🎁 Sistema Regalii
          </p>
          <p className="text-blue-700 text-sm mt-1">
            Sistema independiente para gestión de prefondeos Regalii. Los datos se guardan en tablas separadas.
          </p>
        </div>

        <div className="glass-card rounded-2xl shadow-2xl p-8">
          <p className="text-gray-600 text-lg mb-8">
            Cada cliente tiene un enlace único para enviar solicitudes de prefondeo Regalii. 
            Estos enlaces no expiran y pueden ser compartidos con los clientes.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-100">
                  <th className="text-left py-4 px-6 font-medium text-gray-700 text-lg">CLIENTE</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700 text-lg">PAÍS</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700 text-lg">ENLACE REGALII</th>
                  <th className="text-right py-4 px-6 font-medium text-gray-700 text-lg">ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => {
                  const fundingLink = `/funding-v2/${client.id}`;
                  return (
                    <tr key={client.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-800 text-lg">{client.client_company_name}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-gray-600">{client.country_code}</div>
                      </td>
                      <td className="py-4 px-6">
                        <code className="text-tapi-green text-lg">{fundingLink}</code>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => copyToClipboard(fundingLink)}
                          className="inline-flex items-center text-gray-600 hover:text-tapi-green transition-colors"
                        >
                          <ClipboardCopy className="h-6 w-6" />
                          {copiedLink === fundingLink && (
                            <span className="ml-2 text-tapi-green">¡Copiado!</span>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 text-center text-white text-sm opacity-70">
          © 2024 Tapi. Integrando Latinoamérica - Sistema V2
        </div>
        <div className="text-center text-white text-sm opacity-70">
          © 2024 Regalii. Sistema de Prefondeo
        </div>
      </div>
    </div>
  );
}

export default AdminPageV2;