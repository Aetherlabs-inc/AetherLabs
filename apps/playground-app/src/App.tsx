import { useState, useCallback, useEffect } from 'react'
import { Button, cn } from '@aetherlabs/ui'
import { CodeEditor } from '@/components/CodeEditor'
import { Preview } from '@/components/Preview'
import { ComponentList } from '@/components/ComponentList'
import { ResizablePanel } from '@/components/ResizablePanel'
import { ViewportToggle } from '@/components/ViewportToggle'
import { ConsolePanel } from '@/components/ConsolePanel'
import { FileTabs } from '@/components/FileTabs'
import { ThemeToggle } from '@/components/ThemeToggle'
import { ExportMenu } from '@/components/ExportMenu'
import { componentExamples, ComponentExample } from '@/data/component-examples'
import { usePlaygroundSession } from '@/hooks/usePlaygroundSession'
import { useConsole } from '@/hooks/useConsole'
import {
  PanelLeftClose,
  PanelLeft,
  Code,
  Eye,
  RotateCcw,
  Copy,
  Check,
  Terminal,
  ChevronUp,
  ChevronDown,
  Zap,
} from 'lucide-react'

type ViewMode = 'split' | 'code' | 'preview'

function App() {
  const {
    session,
    sessions,
    activeFile,
    updateFile,
    addFile,
    removeFile,
    setActiveFile,
    setViewport,
    setTheme,
    saveSession,
    loadSession,
    newSession,
  } = usePlaygroundSession()

  const { messages, clear: clearConsole, createConsoleProxy } = useConsole()
  const consoleProxy = createConsoleProxy()

  const [selectedExample, setSelectedExample] = useState<ComponentExample>(
    componentExamples[0]
  )
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('split')
  const [copied, setCopied] = useState(false)
  const [consoleOpen, setConsoleOpen] = useState(false)

  // Load example into active file
  const handleExampleSelect = useCallback((example: ComponentExample) => {
    setSelectedExample(example)
    updateFile(activeFile.id, example.code)
  }, [activeFile.id, updateFile])

  const handleReset = useCallback(() => {
    updateFile(activeFile.id, selectedExample.code)
  }, [activeFile.id, selectedExample, updateFile])

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(activeFile.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [activeFile.content])

  const handleAddFile = useCallback(() => {
    const name = prompt('File name (e.g., Component.tsx):')
    if (name) {
      addFile(name, name.endsWith('.css') ? 'css' : name.endsWith('.json') ? 'json' : 'tsx')
    }
  }, [addFile])

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', session.theme === 'dark')
  }, [session.theme])

  return (
    <div className={cn('flex h-screen', session.theme === 'dark' ? 'bg-neutral-950' : 'bg-neutral-100')}>
      {/* Sidebar */}
      <aside
        className={cn(
          'flex-shrink-0 transition-all duration-300',
          session.theme === 'dark'
            ? 'bg-neutral-900 border-r border-neutral-800'
            : 'bg-white border-r border-neutral-200',
          sidebarOpen ? 'w-72' : 'w-0 overflow-hidden'
        )}
      >
        <ComponentList
          examples={componentExamples}
          selectedExample={selectedExample}
          onSelect={handleExampleSelect}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </aside>

      {/* Main Content */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Toolbar */}
        <header
          className={cn(
            'flex items-center justify-between px-4 py-2',
            session.theme === 'dark'
              ? 'border-b border-neutral-800 bg-neutral-900'
              : 'border-b border-neutral-200 bg-white'
          )}
        >
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
              className={session.theme === 'dark' ? 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800' : ''}
            >
              {sidebarOpen ? (
                <PanelLeftClose className="h-4 w-4" />
              ) : (
                <PanelLeft className="h-4 w-4" />
              )}
            </Button>

            <div className={cn('h-4 w-px', session.theme === 'dark' ? 'bg-neutral-700' : 'bg-neutral-200')} />

            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Zap className="h-3 w-3 text-white" />
              </div>
              <div>
                <h2 className={cn('text-sm font-medium', session.theme === 'dark' ? 'text-neutral-100' : 'text-neutral-900')}>
                  {selectedExample.name}
                </h2>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Viewport Toggle */}
            <ViewportToggle
              value={session.viewport}
              onChange={setViewport}
            />

            <div className={cn('h-4 w-px', session.theme === 'dark' ? 'bg-neutral-700' : 'bg-neutral-200')} />

            {/* View Mode Toggle */}
            <div className={cn(
              'flex rounded-lg p-0.5',
              session.theme === 'dark'
                ? 'border border-neutral-700 bg-neutral-800'
                : 'border border-neutral-200 bg-neutral-50'
            )}>
              <button
                onClick={() => setViewMode('code')}
                className={cn(
                  'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors',
                  viewMode === 'code'
                    ? 'bg-primary-600 text-white'
                    : session.theme === 'dark'
                      ? 'text-neutral-400 hover:text-neutral-200'
                      : 'text-neutral-600 hover:text-neutral-900'
                )}
              >
                <Code className="h-3.5 w-3.5" />
                Code
              </button>
              <button
                onClick={() => setViewMode('split')}
                className={cn(
                  'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors',
                  viewMode === 'split'
                    ? 'bg-primary-600 text-white'
                    : session.theme === 'dark'
                      ? 'text-neutral-400 hover:text-neutral-200'
                      : 'text-neutral-600 hover:text-neutral-900'
                )}
              >
                Split
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={cn(
                  'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors',
                  viewMode === 'preview'
                    ? 'bg-primary-600 text-white'
                    : session.theme === 'dark'
                      ? 'text-neutral-400 hover:text-neutral-200'
                      : 'text-neutral-600 hover:text-neutral-900'
                )}
              >
                <Eye className="h-3.5 w-3.5" />
                Preview
              </button>
            </div>

            <div className={cn('h-4 w-px', session.theme === 'dark' ? 'bg-neutral-700' : 'bg-neutral-200')} />

            {/* Console Toggle */}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setConsoleOpen(!consoleOpen)}
              title="Toggle console"
              className={cn(
                session.theme === 'dark' ? 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800' : '',
                consoleOpen && 'bg-primary-600/20 text-primary-400'
              )}
            >
              <Terminal className="h-4 w-4" />
              {messages.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary-600 text-[10px] text-white flex items-center justify-center">
                  {messages.length > 9 ? '9+' : messages.length}
                </span>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleCopy}
              title="Copy code"
              className={session.theme === 'dark' ? 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800' : ''}
            >
              {copied ? (
                <Check className="h-4 w-4 text-success-400" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleReset}
              title="Reset to original"
              className={session.theme === 'dark' ? 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800' : ''}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>

            <ThemeToggle
              theme={session.theme}
              onChange={setTheme}
            />

            <ExportMenu
              activeFile={activeFile}
              session={session}
              sessions={sessions}
              onSave={saveSession}
              onLoad={loadSession}
              onNew={newSession}
            />
          </div>
        </header>

        {/* File Tabs */}
        <FileTabs
          files={session.files}
          activeFileId={session.activeFileId}
          onSelect={setActiveFile}
          onClose={removeFile}
          onAdd={handleAddFile}
        />

        {/* Editor & Preview */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden">
            {viewMode === 'split' ? (
              <ResizablePanel
                left={
                  <div className="h-full flex flex-col">
                    <div className={cn(
                      'flex items-center justify-between px-4 py-2',
                      session.theme === 'dark'
                        ? 'border-b border-neutral-800 bg-neutral-900'
                        : 'border-b border-neutral-200 bg-neutral-50'
                    )}>
                      <span className={cn('text-xs font-medium', session.theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600')}>
                        Code Editor
                      </span>
                      <span className={cn('text-xs', session.theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400')}>
                        {activeFile.language.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <CodeEditor
                        code={activeFile.content}
                        onChange={(code) => updateFile(activeFile.id, code)}
                        language={activeFile.language}
                        theme={session.theme}
                      />
                    </div>
                  </div>
                }
                right={
                  <div className="h-full flex flex-col">
                    <div className={cn(
                      'flex items-center justify-between px-4 py-2',
                      session.theme === 'dark'
                        ? 'border-b border-neutral-800 bg-neutral-900'
                        : 'border-b border-neutral-200 bg-neutral-50'
                    )}>
                      <span className={cn('text-xs font-medium', session.theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600')}>
                        Preview
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-success-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-success-500 animate-pulse" />
                        Live
                      </span>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <Preview
                        code={activeFile.content}
                        viewport={session.viewport}
                        theme={session.theme}
                        consoleProxy={consoleProxy}
                      />
                    </div>
                  </div>
                }
              />
            ) : viewMode === 'code' ? (
              <div className="h-full flex flex-col">
                <div className={cn(
                  'flex items-center justify-between px-4 py-2',
                  session.theme === 'dark'
                    ? 'border-b border-neutral-800 bg-neutral-900'
                    : 'border-b border-neutral-200 bg-neutral-50'
                )}>
                  <span className={cn('text-xs font-medium', session.theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600')}>
                    Code Editor
                  </span>
                  <span className={cn('text-xs', session.theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400')}>
                    {activeFile.language.toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 overflow-hidden">
                  <CodeEditor
                    code={activeFile.content}
                    onChange={(code) => updateFile(activeFile.id, code)}
                    language={activeFile.language}
                    theme={session.theme}
                  />
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col">
                <div className={cn(
                  'flex items-center justify-between px-4 py-2',
                  session.theme === 'dark'
                    ? 'border-b border-neutral-800 bg-neutral-900'
                    : 'border-b border-neutral-200 bg-neutral-50'
                )}>
                  <span className={cn('text-xs font-medium', session.theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600')}>
                    Preview
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-success-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-success-500 animate-pulse" />
                    Live
                  </span>
                </div>
                <div className="flex-1 overflow-hidden">
                  <Preview
                    code={activeFile.content}
                    viewport={session.viewport}
                    theme={session.theme}
                    consoleProxy={consoleProxy}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Console Panel */}
          {consoleOpen && (
            <div className={cn(
              'h-48 border-t',
              session.theme === 'dark' ? 'border-neutral-800' : 'border-neutral-200'
            )}>
              <ConsolePanel messages={messages} onClear={clearConsole} />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
