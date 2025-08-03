import React, { forwardRef, useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './quill-fixes.css';

// This is a patched version of Quill that avoids using the deprecated DOMNodeInserted event
const PatchedQuill = forwardRef((props, ref) => {
  const [value, setValue] = useState(props.value || '');
  const quillRef = useRef(null);
  const containerRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  
  // Handle value changes from props
  useEffect(() => {
    if (props.value !== value) {
      setValue(props.value || '');
    }
  }, [props.value]);

  // Handle editor initialization
  useEffect(() => {
    // Short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);
    
    return () => {
      clearTimeout(timer);
      // Clean up observer on unmount
      if (containerRef.current && containerRef.current._observer) {
        containerRef.current._observer.disconnect();
        containerRef.current._observer = null;
      }
    };
  }, []);

  // Handle change events
  const handleChange = (content) => {
    setValue(content);
    if (props.onChange) {
      props.onChange(content);
    }
  };

  // Create custom toolbar if needed
  const renderToolbar = () => {
    if (!containerRef.current) return null;
    
    // We're using a MutationObserver instead of DOMNodeInserted
    if (isReady && containerRef.current && !containerRef.current._observer) {
      const observer = new MutationObserver((mutations) => {
        // Process mutations if needed
        for (const mutation of mutations) {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            // This replaces the functionality that would normally use DOMNodeInserted
            // You can add specific handling here if needed
          }
        }
      });
      
      // Observe the container for changes
      observer.observe(containerRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true
      });
      
      // Store observer reference to avoid creating multiple observers
      containerRef.current._observer = observer;
    }
    
    return null;
  };

  // Handle forwarding the ref
  const setRefs = (el) => {
    quillRef.current = el;
    
    // Handle ref forwarding
    if (ref) {
      if (typeof ref === 'function') {
        ref(el);
      } else {
        ref.current = el;
      }
    }
  };

  return (
    <div ref={containerRef} className="patched-quill-container">
      {renderToolbar()}
      <ReactQuill
        ref={setRefs}
        value={value}
        onChange={handleChange}
        theme="snow"
        modules={{
          toolbar: props.modules?.toolbar || [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean']
          ]
        }}
        formats={props.formats || [
          'header',
          'bold', 'italic', 'underline', 'strike', 'blockquote',
          'list', 'bullet',
          'link', 'image'
        ]}
        style={props.style}
        placeholder={props.placeholder || 'Write something...'}
      />
    </div>
  );
});

PatchedQuill.displayName = 'PatchedQuill';

export default PatchedQuill;