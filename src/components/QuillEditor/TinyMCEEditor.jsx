import React, { forwardRef, useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const TinyMCEEditor = forwardRef((props, ref) => {
    const [internalValue, setInternalValue] = useState('');
    const [hasError, setHasError] = useState(false);

    // Ensure value is always a string
    const safeValue = typeof props.value === 'string' ? props.value : '';

    useEffect(() => {
        if (safeValue !== internalValue) {
            setInternalValue(safeValue);
        }
    }, [safeValue]);

    const handleEditorChange = (content, editor) => {
        try {
            setInternalValue(content);
            if (props.onChange) {
                props.onChange(content);
            }
        } catch (error) {
            console.warn('TinyMCE change handler error:', error);
        }
    };

    const handleInit = (evt, editor) => {
        if (ref && typeof ref === 'function') {
            ref(editor);
        } else if (ref && ref.current !== undefined) {
            ref.current = editor;
        }
    };

    // Fallback textarea if TinyMCE fails to load
    if (hasError) {
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
                    borderTopRightRadius: '8px'
                }}>
                    <strong>Rich Text Editor (Fallback Mode)</strong>
                    <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#666' }}>
                        Use basic formatting: **bold**, *italic*, [links], and line breaks
                    </p>
                </div>
                <textarea
                    value={internalValue}
                    onChange={(e) => handleEditorChange(e.target.value)}
                    style={{ 
                        width: '100%', 
                        height: '250px', 
                        border: 'none', 
                        resize: 'none',
                        padding: '12px',
                        fontFamily: 'inherit',
                        fontSize: '14px',
                        lineHeight: '1.5',
                        backgroundColor: 'transparent',
                        color: props.style?.color || '#000'
                    }}
                    placeholder={props.placeholder || 'Start writing your blog post...'}
                />
            </div>
        );
    }

    return (
        <Editor
            apiKey="your-tinymce-api-key" // You can get a free API key from TinyMCE
            value={internalValue}
            onEditorChange={handleEditorChange}
            onInit={handleInit}
            onError={() => {
                setHasError(true);
                if (props.onError) {
                    props.onError();
                }
            }}
            init={{
                height: 400,
                menubar: false,
                plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | blocks | ' +
                    'bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help',
                content_style: `
                    body { 
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        font-size: 14px;
                        line-height: 1.6;
                        color: ${props.style?.color || '#000'};
                        background-color: ${props.style?.backgroundColor || '#fff'};
                    }
                `,
                skin: props.style?.backgroundColor === '#374151' ? 'oxide-dark' : 'oxide',
                content_css: props.style?.backgroundColor === '#374151' ? 'dark' : 'default',
                branding: false,
                promotion: false,
                placeholder: props.placeholder || 'Start writing your blog post...'
            }}
        />
    );
});

TinyMCEEditor.displayName = 'TinyMCEEditor';

export default TinyMCEEditor; 