import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Wallet, KeyRound, CheckCircle } from 'lucide-react';
import { fetchClient, supabase } from '../lib/supabase';
import type { Client, FundingFormData } from '../lib/types';
import { TapiLogo } from '../components/TapiLogo';

function FundingPage() {
  const { clientId } = useParams();
  const [client, setClient] = useState<Client | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [pin, setPin] = useState('');
  const [isPinValid, setIsPinValid] = useState(false);
  const [pinError, setPinError] = useState('');
  const [submittedAmount, setSubmittedAmount] = useState<string>('');
  const [formData, setFormData] = useState<FundingFormData>({
    amount: '',
  });
  const pinInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadClient() {
      if (!clientId) return;
      
      const { data, error } = await fetchClient(clientId, 'clients');
      
      if (error) {
        console.error('Error fetching client:', error);
        return;
      }

      setClient(data);
    }

    loadClient();

    if (pinInputRef.current) {
      pinInputRef.current.focus();
    }
  }, [clientId]);

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!client) return;

    if (pin.length !== 8) {
      setPinError('El PIN debe tener 8 dígitos');
      return;
    }

    if (parseInt(pin) === client.pin) {
      setIsPinValid(true);
      setPinError('');
    } else {
      setPinError('PIN incorrecto');
      setPin('');
      if (pinInputRef.current) {
        pinInputRef.current.focus();
      }
    }
  };

  const formatAmount = (value: string) => {
    // Remove any non-numeric characters except decimal point
    let cleanValue = value.replace(/[^\d.]/g, '');
    
    // Ensure only one decimal point
    const parts = cleanValue.split('.');
    if (parts.length > 2) {
      cleanValue = parts[0] + '.' + parts.slice(1).join('');
    }

    // Limit to 2 decimal places
    if (parts.length === 2) {
      cleanValue = parts[0] + '.' + parts[1].slice(0, 2);
    }

    return cleanValue;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatAmount(e.target.value);
    setFormData(prev => ({
      ...prev,
      amount: formattedValue
    }));
  };
  
  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 8);
    setPin(value);
    setPinError('');
  };

  const handlePinKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && pin.length === 8) {
      handlePinSubmit(e as any);
    }
  };

  const formatDisplayAmount = (amount: string) => {
    const [integerPart, decimalPart = '00'] = amount.split('.');
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${formattedInteger},${decimalPart.padEnd(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amountNumber = parseFloat(formData.amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      return;
    }

    setSubmittedAmount(formData.amount);

    const { error } = await supabase
      .from('prefunding')
      .insert({
        id: crypto.randomUUID(),
        client_id: clientId,
        amount: amountNumber,
        wallet_address: '0x1234567890',
        status: 'pending',
        processed_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error submitting prefunding request:', error);
      return;
    }

    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-tapi-gradient flex items-center justify-center p-4">
        <div className="glass-card rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="flex justify-center mb-8">
            <CheckCircle className="h-20 w-20 text-tapi-green" />
          </div>
          <h1 className="text-3xl font-bold text-tapi-dark mb-4">
            ¡Solicitud Completada!
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Tu solicitud de prefondeo ha sido procesada correctamente.
          </p>
          <p className="text-2xl font-bold text-tapi-dark mb-6">
            ${formatDisplayAmount(submittedAmount)}
          </p>
          <p className="text-sm text-gray-500">
            Muchas gracias
          </p>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-tapi-gradient flex items-center justify-center">
        <div className="animate-pulse text-white text-xl">Cargando...</div>
      </div>
    );
  }

  const FormContainer = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen bg-tapi-gradient flex flex-col items-center justify-center p-4">
      <div className="mb-12">
        <TapiLogo className="h-16" />
      </div>
      <div className="glass-card rounded-2xl shadow-2xl p-8 max-w-md w-full">
        {children}
      </div>
      <div className="mt-8 text-white text-sm opacity-70">
        © 2024 Tapi. Integrando Latinoamérica
      </div>
    </div>
  );

  if (!isPinValid) {
    return (
      <FormContainer>
        <div className="flex items-center justify-center mb-8">
          <div className="bg-tapi-green bg-opacity-10 p-4 rounded-full flex items-center justify-center">
            <Wallet className="h-16 w-16 text-black" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-tapi-dark mb-3">
          Verificación de Acceso
        </h1>

        <p className="text-gray-600 text-center text-lg mb-8">
          Por favor, ingresa tu PIN de 8 dígitos para continuar
        </p>

        <form onSubmit={handlePinSubmit} className="space-y-6">
          <div>
            <input
              ref={pinInputRef}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={8}
              required
              className="pin-input"
              placeholder="••••••••"
              value={pin}
              onChange={handlePinChange}
              onKeyDown={handlePinKeyDown}
              autoComplete="off"
              autoFocus
            />
            {pinError && (
              <p className="mt-2 text-sm text-red-600 text-center">{pinError}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-tapi-green text-white rounded-xl py-4 px-6 font-medium hover:bg-tapi-dark transition-all duration-300 glow-button text-lg"
          >
            Verificar →
          </button>
        </form>
      </FormContainer>
    );
  }

  return (
    <FormContainer>
      <div className="flex items-center justify-center mb-8">
          <div className="bg-tapi-green bg-opacity-10 p-4 rounded-full flex items-center justify-center">
            <Wallet className="h-16 w-16 text-black" />
          </div>
        </div>

      <h1 className="text-3xl font-bold text-center text-tapi-dark mb-3">
        Confirmar Prefondeo
      </h1>

      <p className="text-gray-600 text-center text-lg mb-8">
        Hola {client.client_company_name}, por favor, ingresa el monto a transferir
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monto Transferido
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <input
              type="text"
              inputMode="decimal"
              required
              className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-tapi-green focus:border-transparent transition-all duration-300"
              placeholder="0.00"
              value={formData.amount}
              onChange={handleAmountChange}
              autoFocus
            />
          </div>
          {formData.amount && (
            <p className="mt-2 text-sm text-gray-600">
              ${formatDisplayAmount(formData.amount)}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-tapi-green text-white rounded-xl py-4 px-6 font-medium hover:bg-tapi-dark transition-all duration-300 glow-button text-lg"
        >
          Confirmar Transferencia →
        </button>
      </form>
    </FormContainer>
  );
}

export default FundingPage;