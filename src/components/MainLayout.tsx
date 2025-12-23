import { useState } from 'react';
import AppLayout from '@cloudscape-design/components/app-layout';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import Container from '@cloudscape-design/components/container';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Alert from '@cloudscape-design/components/alert';
import Link from '@cloudscape-design/components/link';
import Navigation from './Navigation';
import ToolView from './ToolView';
import { getToolById } from '../config/tools';
import { hasApiKey } from '../services/cleanTextLabApi';

interface MainLayoutProps {
  children?: React.ReactNode;
}

/**
 * Main application layout using Cloudscape AppLayout
 * Handles navigation, API key warnings, and content structure
 */
export default function MainLayout({ children }: MainLayoutProps) {
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [navigationOpen, setNavigationOpen] = useState(true);

  const activeTool = activeToolId ? getToolById(activeToolId) : null;
  const apiKeyConfigured = hasApiKey();

  // Determine what to show in the main content area
  const renderContent = () => {
    if (!activeTool) {
      // Welcome screen when no tool is selected
      return (
        <ContentLayout
          header={
            <Header variant="h1" description="A starter template for using the CleanTextLab API">
              CleanTextLab POC
            </Header>
          }
        >
          <Container>
            <SpaceBetween size="l">
              {!apiKeyConfigured && (
                <Alert
                  statusIconAriaLabel="Warning"
                  type="warning"
                  header="API Key Not Configured"
                >
                  <SpaceBetween size="s">
                    <div>
                      To use the CleanTextLab API, you need to configure your API key:
                    </div>
                    <ol>
                      <li>Copy <code>.env.local.template</code> to <code>.env.local</code></li>
                      <li>
                        Get your API key from{' '}
                        <Link external href="https://cleantextlab.com/settings">
                          CleanTextLab Settings
                        </Link>
                      </li>
                      <li>Add your key to <code>.env.local</code></li>
                      <li>Restart the development server</li>
                    </ol>
                    <div>
                      Need a Pro subscription?{' '}
                      <Link external href="https://cleantextlab.com/pricing">
                        View Pricing
                      </Link>
                    </div>
                  </SpaceBetween>
                </Alert>
              )}

              <div>
                <h2>Welcome to CleanTextLab POC</h2>
                <p>
                  This is a starter template React application for developers to use the
                  CleanTextLab.com API. Select a tool from the navigation to get started.
                </p>
              </div>

              <div>
                <h3>Available Tools</h3>
                <p>This starter includes 30+ production tools:</p>
                <ul>
                  <li><strong>Text Cleaning:</strong> Line Break Remover, Sort & Deduplicate, Accent Remover, Email Extractor</li>
                  <li><strong>Developer Tools:</strong> JSON Formatter, SQL Formatter, Regex Tester, ASCII Tree Generator</li>
                  <li><strong>Numbers:</strong> Phone Formatter, SMS Length, Unix Timestamp</li>
                </ul>
              </div>

              <div>
                <h3>Getting Started</h3>
                <ul>
                  <li>Select a tool from the left navigation</li>
                  <li>Enter or paste your text</li>
                  <li>Click "Process" to transform your text</li>
                  <li>Copy the result to your clipboard</li>
                </ul>
              </div>

              <div>
                <h3>Learn More</h3>
                <SpaceBetween size="s" direction="horizontal">
                  <Link external href="https://cleantextlab.com">
                    CleanTextLab Website
                  </Link>
                  <Link external href="https://cleantextlab.com/docs/api">
                    API Documentation
                  </Link>
                  <Link external href="https://cleantextlab.com/automation">
                    Automation Guide
                  </Link>
                </SpaceBetween>
              </div>
            </SpaceBetween>
          </Container>
        </ContentLayout>
      );
    }

    // Tool-specific content
    return (
      <ContentLayout
        header={
          <Header
            variant="h1"
            description={activeTool.description}
            info={
              <Link external href="https://cleantextlab.com/automation">
                View API docs
              </Link>
            }
          >
            {activeTool.name}
          </Header>
        }
      >
        <SpaceBetween size="l">
          {!apiKeyConfigured && (
            <Alert
              statusIconAriaLabel="Warning"
              type="warning"
              header="API Key Required"
            >
              Please configure your API key in <code>.env.local</code> to use this tool.
              See the welcome screen for setup instructions.
            </Alert>
          )}
          
          {apiKeyConfigured && <ToolView tool={activeTool} />}
          
          {children}
        </SpaceBetween>
      </ContentLayout>
    );
  };

  return (
    <AppLayout
      navigation={<Navigation activeToolId={activeToolId} onToolChange={setActiveToolId} />}
      navigationOpen={navigationOpen}
      onNavigationChange={({ detail }) => setNavigationOpen(detail.open)}
      content={renderContent()}
      toolsHide
      contentType="default"
      headerSelector="#header"
    />
  );
}
