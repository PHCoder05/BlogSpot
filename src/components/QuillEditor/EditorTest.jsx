import React, { useState } from 'react';
import DynamicQuillEditor from './DynamicQuill';

const EditorTest = () => {
  const [content, setContent] = useState('<h1>Test Content</h1><p>This is a test of the editor.</p>');
  const [mode, setMode] = useState('light');

  return (
    <div style={{ padding: '20px', backgroundColor: mode === 'dark' ? '#1f2937' : '#f9fafb' }}>
      <h2>Editor Test Component</h2>
      <button onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}>
        Toggle {mode === 'light' ? 'Dark' : 'Light'} Mode
      </button>
      
      <div style={{ marginTop: '20px' }}>
        <h3>Editor:</h3>
        <DynamicQuillEditor
          value={content}
          onChange={setContent}
          style={{
            backgroundColor: mode === 'dark' ? '#374151' : 'white',
            color: mode === 'dark' ? 'white' : 'black'
          }}
          placeholder="Start writing..."
        />
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <h3>Content Preview:</h3>
        <div 
          style={{ 
            border: '1px solid #ccc', 
            padding: '10px', 
            backgroundColor: mode === 'dark' ? '#374151' : 'white',
            color: mode === 'dark' ? 'white' : 'black'
          }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <h3>Raw Content:</h3>
        <pre style={{ 
          backgroundColor: '#f0f0f0', 
          padding: '10px', 
          overflow: 'auto',
          maxHeight: '200px'
        }}>
          {content}
        </pre>
      </div>
    </div>
  );
};

export default EditorTest; 