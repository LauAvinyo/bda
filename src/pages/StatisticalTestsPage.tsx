import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { statisticalTests } from '../data/statisticalTests';

const StatisticalTestsPage: React.FC = () => {
  const [selectedTest, setSelectedTest] = useState('t-test');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl md:text-4xl font-display font-bold mb-4 gradient-text tracking-wider">STATISTICAL TESTS</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Test Selection Sidebar */}
        <div className="lg:col-span-1">
          <div className="retro-card p-4">
            <h3 className="font-display font-semibold mb-3 text-amber-900 tracking-wider">SELECT TEST</h3>
            <div className="space-y-2">
              {Object.entries(statisticalTests).map(([key, test]) => (
                <button
                  key={key}
                  onClick={() => setSelectedTest(key)}
                  className={`w-full text-left p-3 transition-all duration-200 border-2 font-pixel text-xs ${
                    selectedTest === key
                      ? 'bg-amber-400 border-amber-600 text-amber-900'
                      : 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
                  }`}
                >
                  {selectedTest === key && <span className="mr-2">→</span>}
                  {test.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Test Content */}
        <div className="lg:col-span-3">
          <div className="retro-card p-8">
            <div className="terminal-window p-4 mb-6">
              <span className="font-pixel text-amber-400">
                VIEWING: {statisticalTests[selectedTest as keyof typeof statisticalTests].title.toUpperCase()}
              </span>
            </div>
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
              components={{
                h1: ({ children }) => (
                  <h1 className="text-3xl font-display font-bold mb-6 text-amber-900 tracking-wider">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-display font-semibold mb-4 text-amber-800 mt-8 tracking-wide">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-display font-semibold mb-3 text-amber-800 mt-6">{children}</h3>
                ),
                p: ({ children }) => (
                  <p className="mb-4 text-amber-700 leading-relaxed font-mono text-sm">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="mb-4 pl-6 list-none text-amber-700">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="mb-4 pl-6 list-none text-amber-700">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="mb-1">
                    <span className="text-orange-500 mr-2">•</span>
                    <span className="font-mono text-sm">{children}</span>
                  </li>
                ),
                code: ({ children, className }) => {
                  const isInline = !className;
                  return isInline ? (
                    <code className="bg-amber-100 px-1 py-0.5 border border-amber-300 text-sm font-mono text-amber-900">
                      {children}
                    </code>
                  ) : (
                    <pre className="terminal-window p-4 overflow-x-auto mb-4">
                      <code className="text-sm font-pixel text-amber-300">{children}</code>
                    </pre>
                  );
                },
                table: ({ children }) => (
                  <div className="overflow-x-auto mb-4">
                    <table className="min-w-full border-2 border-amber-600">{children}</table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="border border-amber-600 px-4 py-2 bg-amber-200 font-pixel font-semibold text-left text-amber-900">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border border-amber-600 px-4 py-2 font-mono text-sm text-amber-800">{children}</td>
                ),
              }}
              >
                {statisticalTests[selectedTest as keyof typeof statisticalTests].content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticalTestsPage;
