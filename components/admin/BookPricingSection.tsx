"use client";

import React from 'react';

interface BookPricingSectionProps {
    price: string;
    setPrice: (value: string) => void;
    isDigitalOnly: boolean;
    setIsDigitalOnly: (value: boolean) => void;
}

export default function BookPricingSection({
    price,
    setPrice,
    isDigitalOnly,
    setIsDigitalOnly
}: BookPricingSectionProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-medium text-gray-800 mb-4">
                Precio y disponibilidad
            </h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm text-gray-600 mb-1.5">
                        Precio (USD)
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={isDigitalOnly}
                        onChange={(e) => setIsDigitalOnly(e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">
                        Solo disponible en formato digital
                    </span>
                </label>
            </div>
        </div>
    );
}
