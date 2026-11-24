/**
 * Browser Automations Engine for Vibez Browser V2.
 * Local trigger-action rule evaluation for domain routing,
 * tab organization, and automated workspace workflows.
 */

const crypto = require('crypto');

class RuleEngine {
  constructor(store, workspaceManager) {
    this.store = store;
    this.workspaceManager = workspaceManager;
    this.rules = [];
    this.executionLog = [];

    this._load();
  }

  _generateId() {
    return `rule_${crypto.randomBytes(4).toString('hex')}`;
  }

  _load() {
    const saved = this.store ? this.store.get('automation_rules') : null;
    if (saved && Array.isArray(saved.rules)) {
      this.rules = saved.rules;
    } else {
      // Default built-in productivity rules
      this.rules = [
        {
          id: 'rule_dev_routing',
          name: 'Auto-route Dev & Code sites to Dev Workspace',
          enabled: true,
          trigger: 'navigation',
          pattern: 'github.com|gitlab.com|localhost|127.0.0.1|stackoverflow.com',
          action: 'route_workspace',
          targetWorkspaceId: 'ws_dev'
        },
        {
          id: 'rule_research_routing',
          name: 'Auto-route Academic & Wiki to Research Workspace',
          enabled: true,
          trigger: 'navigation',
          pattern: 'wikipedia.org|arxiv.org|scholar.google.com',
          action: 'route_workspace',
          targetWorkspaceId: 'ws_research'
        }
      ];
      this.save();
    }
  }

  save() {
    if (this.store) {
      this.store.set('automation_rules', { rules: this.rules });
    }
  }

  getRules() {
    return this.rules;
  }

  addRule(name, pattern, targetWorkspaceId) {
    const newRule = {
      id: this._generateId(),
      name: name.trim() || 'New Automation Rule',
      enabled: true,
      trigger: 'navigation',
      pattern: pattern.trim(),
      action: 'route_workspace',
      targetWorkspaceId
    };
    this.rules.push(newRule);
    this.save();
    return newRule;
  }

  toggleRule(ruleId) {
    const rule = this.rules.find(r => r.id === ruleId);
    if (rule) {
      rule.enabled = !rule.enabled;
      this.save();
      return rule.enabled;
    }
    return false;
  }

  deleteRule(ruleId) {
    const idx = this.rules.findIndex(r => r.id === ruleId);
    if (idx !== -1) {
      this.rules.splice(idx, 1);
      this.save();
      return true;
    }
    return false;
  }

  /**
   * Evaluate navigation event against active rules.
   * Returns action result if a rule fired, or null.
   */
  evaluateNavigation(url, tabId, currentWorkspaceId) {
    if (!url) return null;

    for (const rule of this.rules) {
      if (!rule.enabled) continue;

      try {
        const regex = new RegExp(rule.pattern, 'i');
        if (regex.test(url)) {
          if (rule.action === 'route_workspace' && rule.targetWorkspaceId) {
            // Only route if tab is not already in the target workspace
            if (currentWorkspaceId !== rule.targetWorkspaceId) {
              this._logExecution(rule, `Routed tab to workspace: ${rule.targetWorkspaceId}`);
              return {
                type: 'route_workspace',
                ruleId: rule.id,
                targetWorkspaceId: rule.targetWorkspaceId,
                tabId
              };
            }
          }
        }
      } catch (e) {
        console.error(`[RuleEngine] Regex failed for pattern "${rule.pattern}":`, e);
      }
    }

    return null;
  }

  _logExecution(rule, detail) {
    this.executionLog.unshift({
      timestamp: Date.now(),
      ruleName: rule.name,
      detail
    });
    if (this.executionLog.length > 50) {
      this.executionLog.pop();
    }
  }
}

module.exports = { RuleEngine };
