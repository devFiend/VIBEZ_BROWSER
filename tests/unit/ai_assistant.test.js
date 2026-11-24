const test = require('node:test');
const assert = require('node:assert/strict');
const { AIResearchAssistant } = require('../../src/main/ai/research_assistant');

test('AIResearchAssistant produces structured summaries and key takeaways', () => {
  const ai = new AIResearchAssistant();
  const mockContent = {
    title: 'Understanding Modern Web Architecture',
    url: 'https://example.com/arch',
    headings: ['Microfrontends', 'Process Isolation', 'Edge Computing'],
    paragraphs: [
      'Microfrontends decompose monolithic web applications into independently deployable units.',
      'Process isolation prevents failures in one UI module from crashing the entire host window.',
      'Edge computing moves compute workloads closer to end users to reduce round-trip latency.'
    ],
    fullText: 'Microfrontends decompose monolithic web applications into independently deployable units. Process isolation prevents failures in one UI module from crashing the entire host window. Edge computing moves compute workloads closer to end users to reduce round-trip latency.',
    wordCount: 38
  };

  const summary = ai.summarize(mockContent);
  assert.equal(summary.title, 'Understanding Modern Web Architecture');
  assert.equal(summary.headings.length, 3);
  assert.equal(summary.keyTakeaways.length >= 1, true);
  assert.equal(summary.citations.length, 1);
});

test('AIResearchAssistant cross-tab multi-page comparison', () => {
  const ai = new AIResearchAssistant();
  const pages = [
    { title: 'React 19 Docs', url: 'https://react.dev', wordCount: 1200, headings: ['Server Components'] },
    { title: 'Vue 3 Guide', url: 'https://vuejs.org', wordCount: 1100, headings: ['Reactivity API'] }
  ];

  const comparison = ai.comparePages(pages);
  assert.equal(comparison.totalSources, 2);
  assert.equal(comparison.sources[0].title, 'React 19 Docs');
  assert.equal(comparison.sources[1].title, 'Vue 3 Guide');
});

test('AIResearchAssistant extractive Q&A with quoted citations', () => {
  const ai = new AIResearchAssistant();
  const mockContent = {
    url: 'https://example.com/security',
    fullText: 'Content security policy blocks unapproved script execution. Zero telemetry guarantees user privacy across all sessions.'
  };

  const res = ai.askQuestion('What does content security policy do?', mockContent);
  assert.equal(res.confidence > 0.5, true);
  assert.equal(res.answer.includes('Content security policy blocks'), true);
  assert.equal(res.citations.length >= 1, true);
});
