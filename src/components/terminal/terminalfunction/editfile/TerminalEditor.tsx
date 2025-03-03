import React, { useState, useEffect, useRef } from 'react';

interface TerminalEditorProps {
  initialText?: string;
  width?: number;
  height?: number;
  onSave?: (text: string) => void;
}

const TerminalEditor: React.FC<TerminalEditorProps> = ({
  initialText = '',
  width = 80,
  height = 24,
  onSave
}) => {
  const [text, setText] = useState<string>(initialText);
  const [cursorPos, setCursorPos] = useState<{ line: number; col: number }>({ line: 0, col: 0 });
  const [lines, setLines] = useState<string[]>(initialText ? initialText.split('\n') : ['']);
  const [mode, setMode] = useState<'normal' | 'insert'>('normal');
  const editorRef = useRef<HTMLDivElement>(null);

  // Update lines when text changes
  useEffect(() => {
    setLines(text.split('\n'));
  }, [text]);

  // Focus the editor on mount
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.preventDefault();

    // Handle different modes
    if (mode === 'normal') {
      handleNormalModeKeys(e);
    } else if (mode === 'insert') {
      handleInsertModeKeys(e);
    }
  };

  const handleNormalModeKeys = (e: React.KeyboardEvent) => {
    const key = e.key;

    switch (key) {
      case 'i':
        setMode('insert');
        break;
      case 'h':
        // Move cursor left
        setCursorPos(prev => ({
          ...prev,
          col: Math.max(0, prev.col - 1)
        }));
        break;
      case 'j':
        // Move cursor down
        setCursorPos(prev => ({
          ...prev,
          line: Math.min(lines.length - 1, prev.line + 1)
        }));
        break;
      case 'k':
        // Move cursor up
        setCursorPos(prev => ({
          ...prev,
          line: Math.max(0, prev.line - 1)
        }));
        break;
      case 'l':
        // Move cursor right
        setCursorPos(prev => ({
          ...prev,
          col: Math.min(lines[prev.line].length, prev.col + 1)
        }));
        break;
      case ':':
        if (e.shiftKey) {
          // Command mode, handle save (:w)
          const command = prompt('Enter command:');
          if (command === 'w' && onSave) {
            onSave(text);
          } else if (command === 'q') {
            console.log('Quit requested');
          } else if (command === 'wq' && onSave) {
            onSave(text);
            console.log('Quit requested');
          }
        }
        break;
      default:
        break;
    }
  };

  const handleInsertModeKeys = (e: React.KeyboardEvent) => {
    const key = e.key;

    if (key === 'Escape') {
      setMode('normal');
      return;
    }

    const currentLines = [...lines];
    const { line, col } = cursorPos;

    switch (key) {
      case 'Enter':
        // Split the current line into two at the cursor position
        const currentLine = currentLines[line];
        const newLine = currentLine.slice(col);
        currentLines[line] = currentLine.slice(0, col);
        currentLines.splice(line + 1, 0, newLine);
        
        setText(currentLines.join('\n'));
        setCursorPos({ line: line + 1, col: 0 });
        break;
      case 'Backspace':
        if (col > 0) {
          // Delete character before cursor
          const updatedLine = currentLines[line].slice(0, col - 1) + currentLines[line].slice(col);
          currentLines[line] = updatedLine;
          setText(currentLines.join('\n'));
          setCursorPos({ ...cursorPos, col: col - 1 });
        } else if (line > 0) {
          // Join with previous line
          const prevLineLength = currentLines[line - 1].length;
          currentLines[line - 1] = currentLines[line - 1] + currentLines[line];
          currentLines.splice(line, 1);
          setText(currentLines.join('\n'));
          setCursorPos({ line: line - 1, col: prevLineLength });
        }
        break;
      case 'ArrowUp':
        setCursorPos(prev => ({
          ...prev,
          line: Math.max(0, prev.line - 1)
        }));
        break;
      case 'ArrowDown':
        setCursorPos(prev => ({
          ...prev,
          line: Math.min(lines.length - 1, prev.line + 1)
        }));
        break;
      case 'ArrowLeft':
        setCursorPos(prev => ({
          ...prev,
          col: Math.max(0, prev.col - 1)
        }));
        break;
      case 'ArrowRight':
        setCursorPos(prev => ({
          ...prev,
          col: Math.min(lines[prev.line].length, prev.col + 1)
        }));
        break;
      default:
        if (key.length === 1) {
          // Insert character at cursor position
          const updatedLine = 
            currentLines[line].slice(0, col) + 
            key + 
            currentLines[line].slice(col);
          
          currentLines[line] = updatedLine;
          setText(currentLines.join('\n'));
          setCursorPos({ ...cursorPos, col: col + 1 });
        }
        break;
    }
  };

  // Render the editor with line numbers
  return (
    <div 
      className="terminal-editor"
      style={{ 
        display: 'flex',
        fontFamily: 'monospace',
        backgroundColor: '#282c34',
        color: '#abb2bf',
        width: `${width}ch`,
        height: `${height + 2}em`,
        overflow: 'auto',
        border: '1px solid #3e4451',
        outline: 'none',
      }}
      tabIndex={0}
      ref={editorRef}
      onKeyDown={handleKeyDown}
    >
      {/* Line numbers */}
      <div 
        className="line-numbers"
        style={{
          backgroundColor: '#21252b',
          color: '#636d83',
          padding: '0.5em 0.5em',
          textAlign: 'right',
          userSelect: 'none',
          borderRight: '1px solid #181a1f',
          minWidth: '3em',
        }}
      >
        {lines.map((_, i) => (
          <div key={i} style={{ height: '1.2em' }}>
            {i + 1}
          </div>
        ))}
      </div>

      {/* Text content */}
      <div 
        className="editor-content"
        style={{
          padding: '0.5em',
          position: 'relative',
          flexGrow: 1,
        }}
      >
        {lines.map((line, lineIndex) => (
          <div key={lineIndex} style={{ height: '1.2em', whiteSpace: 'pre' }}>
            {line}
            {cursorPos.line === lineIndex && cursorPos.col === line.length && (
              <span 
                className="cursor" 
                style={{ 
                  backgroundColor: mode === 'normal' ? '#528bff' : '#61afef',
                  width: '0.5em',
                  height: '1em',
                  display: 'inline-block',
                  animation: 'blink 1s step-end infinite',
                }}
              >&nbsp;</span>
            )}
          </div>
        ))}
        
        {/* Status line */}
        <div 
          style={{ 
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#2c313a',
            padding: '0.2em 0.5em',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div>
            {mode === 'normal' ? 'NORMAL' : 'INSERT'} | Line: {cursorPos.line + 1}, Col: {cursorPos.col + 1}
          </div>
          <div>
            {lines.length} lines
          </div>
        </div>
      </div>
      
      <style>
        {`
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
        `}
      </style>
    </div>
  );
};

export default TerminalEditor;