import { useState } from 'react';
import CronGenerator from '../components/CronGenerator';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <CronGenerator />
      </div>
    </div>
  );
}