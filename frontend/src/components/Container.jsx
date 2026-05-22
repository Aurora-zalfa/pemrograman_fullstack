import React from 'react';

export default function Container({ children }) {
  return <div className="container mx-auto p-6">{children}</div>;
}