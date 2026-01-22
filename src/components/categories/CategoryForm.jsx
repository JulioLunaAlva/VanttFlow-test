<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ColorPicker } from "@/components/ui/ColorPicker";
import { IconPicker } from "@/components/ui/IconPicker";
import { Select } from "@/components/ui/select";

export const CategoryForm = ({ initialData, onSubmit, onCancel }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState('expense');
    const [color, setColor] = useState('#000000');
    const [icon, setIcon] = useState('Circle');

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setType(initialData.type);
            setColor(initialData.color);
            setIcon(initialData.icon);
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            name,
            type,
            color,
            icon
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Nombre</label>
                <Input
                    placeholder="Ej. Suscripciones"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Tipo</label>
                    <Select value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="income">Ingreso</option>
                        <option value="expense">Gasto</option>
                        <option value="both">Ambos</option>
                    </Select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Icono</label>
                    <IconPicker value={icon} onChange={setIcon} />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Color</label>
                <ColorPicker value={color} onChange={setColor} />
            </div>

            <div className="flex justify-end gap-2 pt-4">
                {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancelar
                    </Button>
                )}
                <Button type="submit">
                    {initialData ? 'Actualizar' : 'Crear Categoría'}
                </Button>
            </div>
        </form>
    );
};
=======
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ColorPicker } from "@/components/ui/ColorPicker";
import { IconPicker } from "@/components/ui/IconPicker";
import { Select } from "@/components/ui/select";

export const CategoryForm = ({ initialData, onSubmit, onCancel }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState('expense');
    const [color, setColor] = useState('#000000');
    const [icon, setIcon] = useState('Circle');

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setType(initialData.type);
            setColor(initialData.color);
            setIcon(initialData.icon);
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            name,
            type,
            color,
            icon
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Nombre</label>
                <Input
                    placeholder="Ej. Suscripciones"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Tipo</label>
                    <Select value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="income">Ingreso</option>
                        <option value="expense">Gasto</option>
                        <option value="both">Ambos</option>
                    </Select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Icono</label>
                    <IconPicker value={icon} onChange={setIcon} />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Color</label>
                <ColorPicker value={color} onChange={setColor} />
            </div>

            <div className="flex justify-end gap-2 pt-4">
                {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancelar
                    </Button>
                )}
                <Button type="submit">
                    {initialData ? 'Actualizar' : 'Crear Categoría'}
                </Button>
            </div>
        </form>
    );
};
>>>>>>> 5514d7732ec911852e1fd69f7bbfd09383699edc
