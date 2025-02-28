import { useContext, useEffect, useState } from "react";
import { FileSystemContext, FileSystemContextType } from "../FileSystemContext";

// Define the props type for the terminal function
interface TerminalFunctionProps {
  userInput: string;
  setUserInput?: React.Dispatch<React.SetStateAction<string>>;
  setAutocompleteSuggestions?: React.Dispatch<React.SetStateAction<string[]>>;
}

// Define the enhanced terminal function type with metadata
type EnhancedTerminalFunction = React.FC<TerminalFunctionProps> & {
  description: string;
  category: string;
  autoCompleteValues: (fileSystem: FileSystemContextType | null) => string[][];
};

const ViewFile: EnhancedTerminalFunction = ({ userInput }) => {
  const [fileContent, setFileContent] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const fileSystem = useContext(FileSystemContext);

  useEffect(() => {
    if (!fileSystem) {
      setError("File system not available");
      return;
    }

    const args = userInput.split(" ");
    if (args.length < 2 || !args[1]) {
      setError("Usage: view [filename]");
      return;
    }

    const filename = args[1];
    
    try {
      // Get file data as Uint8Array
      const fileData = fileSystem.readFile(filename);
      
      if (!fileData) {
        setError(`File '${filename}' not found`);
        return;
      }

      // Convert Uint8Array to string for display
      // This works for text files, for binary files you might want different handling
      const decoder = new TextDecoder("utf-8");
      const textContent = decoder.decode(fileData);
      
      setFileContent(textContent);
      setError(null);
    } catch (err) {
      setError(`Error reading file: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [userInput, fileSystem]);

  // Render file content with line numbers
  if (error) {
    return error;
  }

  if (!fileContent) {
    return "File is empty";
  }

  // Return formatted file content
  return (
    <div className="file-viewer">
      <div className="file-content">
        {fileContent.split('\n').map((line, index) => (
          <div key={index} className="file-line">
            <span className="line-number">{index + 1}</span>
            <span className="line-content">{line}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Add metadata to the component
ViewFile.description = "View file contents (view [filename])";
ViewFile.category = 'filesystem';
ViewFile.autoCompleteValues = (fileSystem: FileSystemContextType | null) => {
  if (!fileSystem) return [[]];
  
  try {
    // Filter to only show files (not folders) for the view command
    const files = fileSystem.getCurrentNode()
      .filter(node => node.type === 'file')
      .map(node => node.name);
      
    return [files];
  } catch (error) {
    console.error("Error generating autocomplete values:", error);
    return [[]];
  }
};

export default ViewFile;