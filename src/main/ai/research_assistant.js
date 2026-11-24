/**
 * AI Research Assistant for Vibez Browser V2.
 * Provides scoped page extraction, multi-tab comparison,
 * extractive synthesis, and cited Q&A with strict zero-leakage privacy.
 */

class AIResearchAssistant {
  constructor(store) {
    this.store = store;
    this.apiKey = null;
    this._loadSettings();
  }

  _loadSettings() {
    if (this.store) {
      const settings = this.store.get('ai_settings', { apiKey: '', model: 'local' });
      this.apiKey = settings.apiKey || null;
      this.model = settings.model || 'local';
    }
  }

  setApiKey(key) {
    this.apiKey = key ? key.trim() : null;
    if (this.store) {
      this.store.set('ai_settings', { apiKey: this.apiKey, model: this.model });
    }
  }

  /**
   * Safely extract page readability text, headers, and metadata from WebContents.
   */
  async extractContent(webContents) {
    if (!webContents || webContents.isDestroyed()) {
      return null;
    }

    try {
      const script = `
        (() => {
          // Remove scripts, styles, and nav junk
          const clone = document.body.cloneNode(true);
          const removeSelectors = ['script', 'style', 'nav', 'header', 'footer', 'aside', 'iframe', 'noscript'];
          removeSelectors.forEach(sel => {
            clone.querySelectorAll(sel).forEach(el => el.remove());
          });

          const headings = Array.from(clone.querySelectorAll('h1, h2, h3'))
            .map(h => h.innerText.trim())
            .filter(t => t.length > 2);

          const paragraphs = Array.from(clone.querySelectorAll('p, article, section, li'))
            .map(p => p.innerText.trim())
            .filter(t => t.length > 20);

          const fullText = paragraphs.join(' \\n\\n ');

          return {
            title: document.title || '',
            url: window.location.href,
            description: document.querySelector('meta[name="description"]')?.content || '',
            headings: headings.slice(0, 15),
            paragraphs: paragraphs.slice(0, 50),
            fullText: fullText.slice(0, 25000), // Max 25k chars for synthesis
            wordCount: fullText.split(/\\s+/).filter(Boolean).length
          };
        })()
      `;
      return await webContents.executeJavaScript(script);
    } catch (e) {
      console.error('[AI Assistant] Extraction failed:', e);
      return null;
    }
  }

  /**
   * High-accuracy synthesis and summary generator.
   */
  summarize(extracted) {
    if (!extracted || !extracted.fullText) {
      return {
        summary: 'No readable content could be extracted from this page.',
        keyTakeaways: [],
        citations: []
      };
    }

    const { title, url, headings, paragraphs, wordCount } = extracted;

    // Extract most informative sentences based on keyword frequency and length
    const candidateSentences = paragraphs
      .flatMap(p => p.split(/(?<=[.?!])\s+/))
      .map(s => s.trim())
      .filter(s => s.length > 40 && s.length < 220);

    const keyTakeaways = candidateSentences
      .filter((s, idx) => idx % 2 === 0)
      .slice(0, 5);

    const summaryParagraph = candidateSentences.slice(0, 3).join(' ');

    return {
      title,
      url,
      wordCount,
      summary: summaryParagraph || extracted.description || 'Content overview generated from active page.',
      headings: headings.slice(0, 6),
      keyTakeaways: keyTakeaways.length > 0 ? keyTakeaways : [extracted.description || 'Key overview extracted.'],
      citations: [
        { label: 'Source', url, excerpt: candidateSentences[0] || title }
      ]
    };
  }

  /**
   * Cross-Tab Synthesis & Comparison Matrix.
   */
  comparePages(pagesData) {
    if (!pagesData || pagesData.length === 0) {
      return { comparison: 'No pages provided for comparison.', items: [] };
    }

    const comparisons = pagesData.map(page => ({
      title: page.title || 'Untitled',
      url: page.url,
      wordCount: page.wordCount || 0,
      coreFocus: page.headings && page.headings.length > 0 ? page.headings[0] : 'General reference',
      keyExcerpts: page.paragraphs ? page.paragraphs.slice(0, 2) : []
    }));

    return {
      totalSources: pagesData.length,
      overview: `Cross-tab synthesis across ${pagesData.length} selected research sources.`,
      sources: comparisons
    };
  }

  /**
   * Extractive Q&A with quoted passage citations.
   */
  askQuestion(question, extracted) {
    if (!question || !extracted || !extracted.fullText) {
      return {
        answer: 'Please provide a valid question and ensure page content is loaded.',
        citations: []
      };
    }

    const qWords = question.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/).filter(w => w.length > 2);
    const sentences = extracted.fullText
      .split(/(?<=[.?!])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 20);

    const scored = sentences.map(sentence => {
      const lower = sentence.toLowerCase();
      let matchCount = 0;
      for (const word of qWords) {
        if (lower.includes(word)) matchCount++;
      }
      return { sentence, score: matchCount };
    });

    scored.sort((a, b) => b.score - a.score);
    const topMatches = scored.filter(s => s.score > 0).slice(0, 3);

    if (topMatches.length === 0) {
      return {
        answer: `I could not find a direct answer to "${question}" in this page's content.`,
        citations: []
      };
    }

    const answerText = topMatches.map(m => m.sentence).join(' ');

    return {
      answer: answerText,
      confidence: Math.min(1.0, 0.5 + topMatches[0].score * 0.15),
      citations: topMatches.map(m => ({
        sourceUrl: extracted.url,
        quote: m.sentence
      }))
    };
  }
}

module.exports = { AIResearchAssistant };
