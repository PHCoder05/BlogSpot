import React, { forwardRef, useState, useEffect, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const QuillEditor = forwardRef((props, ref) => {
    const [internalValue, setInternalValue] = useState('');
    const [hasError, setHasError] = useState(false);
    const [isQuillLoaded, setIsQuillLoaded] = useState(false);
    const [rangeErrorCount, setRangeErrorCount] = useState(0);
    const [isEditorReady, setIsEditorReady] = useState(false);

    // Ensure value is always a string to prevent delta errors
    const safeValue = typeof props.value === 'string' ? props.value : '';

    useEffect(() => {
        if (safeValue !== internalValue) {
            setInternalValue(safeValue);
        }
    }, [safeValue]);

    useEffect(() => {
        // Check if ReactQuill is available
        try {
            if (ReactQuill) {
                setIsQuillLoaded(true);
            }
        } catch (error) {
            console.warn('ReactQuill not available, using fallback editor');
            setHasError(true);
        }
    }, []);

    // Handle range errors more gracefully
    useEffect(() => {
        if (rangeErrorCount > 3) {
            console.warn('Too many range errors, switching to fallback editor');
            setHasError(true);
            if (props.onError) {
                props.onError();
            }
        }
    }, [rangeErrorCount, props]);

    // Debounced range error handler
    const debouncedRangeErrorHandler = useCallback(() => {
        setRangeErrorCount(prev => prev + 1);
    }, []);

    const handleChange = (content, delta, source, editor) => {
        try {
            const newContent = content || '';
            setInternalValue(newContent);
            if (props.onChange) {
                props.onChange(newContent, delta, source, editor);
            }
        } catch (error) {
            console.warn('QuillEditor change handler error:', error);
            // Fallback to simple text editor if there are persistent errors
            if (props.onError) {
                props.onError();
            }
        }
    };

    const handleTextareaChange = (e) => {
        const newContent = e.target.value;
        setInternalValue(newContent);
        if (props.onChange) {
            props.onChange(newContent);
        }
    };

    const handleQuillError = (error) => {
        console.warn('Quill error:', error);
        if (error && error.message && error.message.includes('range')) {
            debouncedRangeErrorHandler();
        } else {
            setHasError(true);
            if (props.onError) {
                props.onError();
            }
        }
    };

    // Handle range errors specifically
    const handleRangeError = () => {
        debouncedRangeErrorHandler();
        // Try to reset the editor selection
        try {
            if (ref && ref.current && ref.current.getEditor) {
                const editor = ref.current.getEditor();
                if (editor) {
                    // Clear any existing selection
                    editor.setSelection(null);
                }
            }
        } catch (error) {
            console.warn('Failed to reset Quill selection:', error);
        }
    };

    // Safe editor operations
    const safeEditorOperation = (operation) => {
        try {
            if (ref && ref.current && ref.current.getEditor) {
                const editor = ref.current.getEditor();
                if (editor && isEditorReady) {
                    return operation(editor);
                }
            }
        } catch (error) {
            console.warn('Editor operation failed:', error);
            handleRangeError();
        }
    };

    // Show fallback if there's an error or Quill is not loaded
    if (hasError || !isQuillLoaded) {
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
                    onChange={handleTextareaChange}
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
        <ReactQuill 
            {...props} 
            value={internalValue}
            onChange={handleChange}
            ref={ref}
            onError={handleQuillError}
            onFocus={() => {
                // Reset any range errors when editor gains focus
                try {
                    if (ref && ref.current && ref.current.getEditor) {
                        const editor = ref.current.getEditor();
                        if (editor && editor.getSelection) {
                            editor.getSelection();
                        }
                    }
                } catch (error) {
                    console.warn('Quill focus error:', error);
                    handleRangeError();
                }
            }}
            onBlur={() => {
                // Clear selection when editor loses focus to prevent range errors
                safeEditorOperation((editor) => {
                    editor.setSelection(null);
                });
            }}
            onEditorReady={() => {
                setIsEditorReady(true);
            }}
            modules={{
                ...props.modules,
                toolbar: props.modules?.toolbar || [
                    [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
                    [{size: []}],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    [{'list': 'ordered'}, {'list': 'bullet'}, 
                     {'indent': '-1'}, {'indent': '+1'}],
                    ['link', 'image', 'video', 'code-block'],
                    ['clean'],
                    ['color', 'background']
                ]
            }}
            formats={props.formats || [
                'header', 'font', 'size',
                'bold', 'italic', 'underline', 'strike', 'blockquote',
                'list', 'bullet', 'indent',
                'link', 'image', 'video', 'code-block',
                'color', 'background'
            ]}
            theme="snow"
        />
    );
});

QuillEditor.displayName = 'QuillEditor';

export default QuillEditor; 