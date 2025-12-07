"use client";

import React, { useState } from 'react';
import { ExternalLink, X, Trash2, Plus } from 'lucide-react';

interface AffiliateLink {
    name: string;
    url: string;
}

interface AffiliateLinksSectionProps {
    links: AffiliateLink[];
    onChange: (links: AffiliateLink[]) => void;
    defaultLinksCount?: number;
}

export default function AffiliateLinksSection({
    links,
    onChange,
    defaultLinksCount = 3
}: AffiliateLinksSectionProps) {
    const [customLinkName, setCustomLinkName] = useState('');
    const [customLinkUrl, setCustomLinkUrl] = useState('');

    const updateLink = (index: number, url: string) => {
        const newLinks = [...links];
        newLinks[index].url = url;
        onChange(newLinks);
    };

    const clearLink = (index: number) => {
        const newLinks = [...links];
        newLinks[index].url = '';
        onChange(newLinks);
    };

    const removeLink = (index: number) => {
        onChange(links.filter((_, i) => i !== index));
    };

    const addCustomLink = () => {
        if (customLinkName && customLinkUrl) {
            onChange([...links, { name: customLinkName, url: customLinkUrl }]);
            setCustomLinkName('');
            setCustomLinkUrl('');
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-medium text-gray-800 mb-4 flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                Links de Afiliados
            </h2>
            <p className="text-xs text-gray-500 mb-4">
                Añade enlaces a tiendas donde el libro esté disponible
            </p>

            <div className="space-y-3">
                {links.map((link, index) => (
                    <div key={index} className="flex items-center gap-3">
                        <div className="w-28 flex-shrink-0">
                            <span className="text-sm text-gray-600">{link.name}</span>
                        </div>
                        <input
                            type="url"
                            value={link.url}
                            onChange={(e) => updateLink(index, e.target.value)}
                            placeholder={`https://${link.name.toLowerCase().replace(/\s/g, '')}.com/...`}
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {index < defaultLinksCount ? (
                            link.url && (
                                <button
                                    type="button"
                                    onClick={() => clearLink(index)}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                    title="Limpiar URL"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )
                        ) : (
                            <button
                                type="button"
                                onClick={() => removeLink(index)}
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                title="Eliminar enlace"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                ))}

                {/* Custom Link Input */}
                <div className="pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-2">Añadir otro enlace:</p>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={customLinkName}
                            onChange={(e) => setCustomLinkName(e.target.value)}
                            placeholder="Nombre de la tienda"
                            className="w-32 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="url"
                            value={customLinkUrl}
                            onChange={(e) => setCustomLinkUrl(e.target.value)}
                            placeholder="https://..."
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="button"
                            onClick={addCustomLink}
                            disabled={!customLinkName || !customLinkUrl}
                            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
