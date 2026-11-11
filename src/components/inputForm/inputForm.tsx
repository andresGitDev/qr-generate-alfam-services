import React from 'react';

type Props = {
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const InputForm: React.FC<Props> = ({ name, value, onChange }) => {
    return (
        <>
            <input
                type="text"
                className="w-full rounded border border-[#d9d9d9] bg-white px-3 py-2 font-mono text-sm text-gray-700"
                placeholder="https://example.com  o  cualquier texto"
                name={name}
                id={name}
                value={value}
                onChange={onChange}
                aria-label="URL o texto"
            />
            <p className="mt-1 text-xs text-[#6b7280]">Informá una URL o un texto libre.</p>
        </>
    );
}

export default InputForm;
