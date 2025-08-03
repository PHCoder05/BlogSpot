import React, { Suspense, forwardRef, useState, useEffect } from 'react';
import Loader from '../loader/Loader';

const PatchedQuill = React.lazy(() => import('./PatchedQuill'));
const QuillEditor = React.lazy(() => import('./QuillEditor'));
const TinyMCEEditor = React.lazy(() => import('./TinyMCEEditor'));
const SimpleTextEditor = React.lazy(() => import('./SimpleTextEditor'));

const DynamicQuillEditor = forwardRef((props, ref) => {
  const isSSR = typeof window === 'undefined';
  const [editorType, setEditorType] = useState('quill'); // 'quill', 'tinymce', or 'simple'
  const [hasQuillError, setHasQuillError] = useState(false);
  const [hasTinyMCEError, setHasTinyMCEError] = useState(false);

  useEffect(() => {
    // Try to load Quill first, fallback to TinyMCE if it fails
    const checkQuillAvailability = async () => {
      try {
        const QuillModule = await import('react-quill');
        if (!QuillModule.default) {
          throw new Error('Quill not available');
        }
      } catch (error) {
        console.warn('Quill not available, switching to TinyMCE');
        setEditorType('tinymce');
      }
    };

    if (!isSSR) {
      checkQuillAvailability();
    }
  }, [isSSR]);

  if (isSSR) {
    return null; // Or a placeholder for SSR
  }

  const handleQuillError = () => {
    setHasQuillError(true);
    setEditorType('tinymce');
  };

  const handleTinyMCEError = () => {
    setHasTinyMCEError(true);
    setEditorType('simple');
  };

  return (
    <Suspense fallback={<div style={{ height: '300px' }}><Loader /></div>}>
      {editorType === 'quill' && !hasQuillError ? (
        <PatchedQuill {...props} ref={ref} onError={handleQuillError} />
      ) : editorType === 'tinymce' && !hasTinyMCEError ? (
        <TinyMCEEditor {...props} ref={ref} onError={handleTinyMCEError} />
      ) : (
        <SimpleTextEditor {...props} ref={ref} />
      )}
    </Suspense>
  );
});

DynamicQuillEditor.displayName = 'DynamicQuillEditor';

export default DynamicQuillEditor;
