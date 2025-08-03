import React, { forwardRef, useState, useEffect } from 'react';

const SimpleTextEditor = forwardRef((props, ref) => {
    const [value, setValue] = useState('');

    useEffect(() => {
        if (props.value !== value) {
            setValue(props.value || '');
        }
    }, [props.value]);

    const handleChange = (e) => {
        const newValue = e.target.value;
        setValue(newValue);
        if (props.onChange) {
            props.onChange(newValue);
        }
    };

    const handleKeyDown = (e) => {
        // Basic markdown shortcuts
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            const newValue = value + '\n\n---\n\n';
            setValue(newValue);
            if (props.onChange) {
                props.onChange(newValue);
            }
        }
    };

    return (
        <div style={{ 
            minHeight: '300px', 
            border: '1px solid #ccc',
            borderRadius: '8px',
            backgroundColor: props.style?.backgroundColor || '#f9f9f9'
        }}>
            <div style={{
                padding: '12px',
                borderBottom: '1px solid #ccc',
                backgroundColor: '#f0f0f0',
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <strong>Simple Text Editor</strong>
                <div style={{ fontSize: '12px', color: '#666' }}>
                    Use **bold**, *italic*, [links], and Ctrl+Enter for separators
                </div>
            </div>
            <textarea
                ref={ref}
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                style={{ 
                    width: '100%', 
                    height: '250px', 
                    border: 'none', 
                    resize: 'none',
                    padding: '12px',
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    backgroundColor: 'transparent',
                    color: props.style?.color || '#000'
                }}
                placeholder={props.placeholder || 'Start writing your blog post...\n\nUse **bold** for bold text\nUse *italic* for italic text\nUse [link text](url) for links\nPress Ctrl+Enter to add a separator'}
            />
        </div>
    );
});

SimpleTextEditor.displayName = 'SimpleTextEditor';

export default SimpleTextEditor; 