import React from 'react';
import { currencies } from '../data/currencies';

const CurrencySelector = ({ value, onChange, id, name, className, required }) => {
  return (
    <select
      id={id || 'currency'}
      name={name || 'currency'}
      value={value}
      onChange={onChange}
      className={className || 'form-input box-border'}
      required={required}
    >
      {currencies.map(currency => (
        <option key={currency.code} value={currency.code}>
          {currency.code} - {currency.symbol} {currency.name}
        </option>
      ))}
    </select>
  );
};

export default CurrencySelector;