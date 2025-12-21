import { useState, useEffect } from 'react';
import Container from '@cloudscape-design/components/container';
import SpaceBetween from '@cloudscape-design/components/space-between';
import FormField from '@cloudscape-design/components/form-field';
import Textarea from '@cloudscape-design/components/textarea';
import Button from '@cloudscape-design/components/button';
import Alert from '@cloudscape-design/components/alert';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import type { Tool } from '../types';
import { processText } from '../services/cleanTextLabApi';
import './ToolView.css';

interface ToolViewProps {
  tool: Tool;
}

/**
 * Reusable component that renders input/output areas and processing logic for any tool
 * Handles API calls, loading states, errors, and clipboard operations
 */
export default function ToolView({ tool }: ToolViewProps) {
  const [inputValue, setInputValue] = useState('');
  const [outputValue, setOutputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  /**
   * Reset state when switching to a different tool
   */
  useEffect(() => {
    setInputValue('');
    setOutputValue('');
    setError(null);
    setCopySuccess(false);
    setLoading(false);
  }, [tool.id]);

  /**
   * Process the input text using the CleanTextLab API
   */
  const handleProcess = async () => {
    if (!inputValue.trim()) {
      setError('Please enter some text to process');
      return;
    }

    setLoading(true);
    setError(null);
    setOutputValue('');
    setCopySuccess(false);

    try {
      const result = await processText(inputValue, [tool.apiStep]);
      setOutputValue(result);
    } catch (err) {
      const errorMessage =
        err && typeof err === 'object' && 'message' in err
          ? (err.message as string)
          : 'An unexpected error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Copy output to clipboard
   */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(outputValue);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      setError('Failed to copy to clipboard');
    }
  };

  /**
   * Clear input and output
   */
  const handleClear = () => {
    setInputValue('');
    setOutputValue('');
    setError(null);
    setCopySuccess(false);
  };

  /**
   * Load sample/placeholder text
   */
  const handleLoadExample = () => {
    setInputValue(tool.placeholder);
    setError(null);
    setCopySuccess(false);
  };

  /**
   * Handle keyboard shortcuts
   * Cloudscape uses CustomEvent, so we listen for specific keys in the detail
   */
  const handleKeyDown = (event: CustomEvent<{ key: string; ctrlKey?: boolean; metaKey?: boolean }>) => {
    const { key, ctrlKey, metaKey } = event.detail;
    // Ctrl/Cmd + Enter to process
    if ((ctrlKey || metaKey) && key === 'Enter') {
      if (inputValue.trim() && !loading) {
        handleProcess();
      }
    }
  };

  return (
    <SpaceBetween size="l">
      {error && (
        <Alert
          onDismiss={() => setError(null)}
          dismissible
          type="error"
          header="Error"
        >
          {error}
        </Alert>
      )}

      {copySuccess && (
        <Alert type="success" dismissible onDismiss={() => setCopySuccess(false)}>
          Copied to clipboard!
        </Alert>
      )}

      <Container>
        <SpaceBetween size="l">
          <ColumnLayout columns={2} variant="text-grid">
            {/* Input Section */}
            <FormField
              label="Input"
              description="Enter or paste your text here (Ctrl/Cmd + Enter to process)"
              stretch
            >
              <Textarea
                value={inputValue}
                onChange={({ detail }) => setInputValue(detail.value)}
                onKeyDown={handleKeyDown}
                placeholder={tool.placeholder}
                rows={12}
                disabled={loading}
                ariaLabel="Input text"
              />
            </FormField>

            {/* Output Section */}
            <FormField
              label="Output"
              description="Processed result will appear here"
              stretch
            >
              <Textarea
                value={outputValue}
                onChange={({ detail }) => setOutputValue(detail.value)}
                placeholder="Result will appear here after processing..."
                rows={12}
                readOnly
                ariaLabel="Output text"
              />
            </FormField>
          </ColumnLayout>

          {/* Action Buttons */}
          <SpaceBetween size="xs" direction="horizontal">
            <Button
              variant="primary"
              onClick={handleProcess}
              loading={loading}
              disabled={!inputValue.trim() || loading}
            >
              Process
            </Button>
            <Button
              onClick={handleCopy}
              disabled={!outputValue || loading}
              iconName="copy"
            >
              Copy Output
            </Button>
            <Button onClick={handleLoadExample} disabled={loading}>
              Load Example
            </Button>
            <Button onClick={handleClear} disabled={loading}>
              Clear
            </Button>
          </SpaceBetween>

          {/* Character Counts */}
          <ColumnLayout columns={2} variant="text-grid">
            <div className="character-count">
              Input: {inputValue.length} characters
            </div>
            <div className="character-count">
              Output: {outputValue.length} characters
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
