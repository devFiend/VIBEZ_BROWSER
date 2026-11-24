/**
 * Privacy Shield engine for Vibez Browser.
 * Intercepts network requests to block tracking scripts, advertising beacons,
 * crypto-miners, and telemetry domains.
 */

class PrivacyShield {
  constructor(store) {
    this.store = store;
    this.stats = new Map(); // domain -> blocked count
    this.whitelistedDomains = new Set();
    this.blockedDomains = new Set([
      // Major Tracker / Ad Networks / Telemetries
      'doubleclick.net',
      'google-analytics.com',
      'googletagmanager.com',
      'adnxs.com',
      'criteo.com',
      'rubiconproject.com',
      'pubmatic.com',
      'scorecardresearch.com',
      'quantserve.com',
      'outbrain.com',
      'taboola.com',
      'facebook.net',
      'connect.facebook.net',
      'hotjar.com',
      'mouseflow.com',
      'crazyegg.com',
      'branch.io',
      'appsflyer.com',
      'mixpanel.com',
      'segment.io',
      'newrelic.com',
      'sentry.io',
      'telemetry.mozilla.org',
      'clarity.ms',
      'advertising.com',
      'moatads.com',
      'openx.net',
      'smartadserver.com',
      'casalemedia.com',
      'yieldmo.com',
      'zemanta.com',
      'adroll.com',
      'bidswitch.net',
      'chartbeat.com',
      'statcounter.com',
      'yandex.ru/metrika',
      'coin-hive.com',
      'coinhive.com',
      'cryptoloot.pro',
      'jsecoin.com'
    ]);

    this._loadSettings();
  }

  _loadSettings() {
    if (this.store) {
      const saved = this.store.get('shield_settings', { whitelisted: [] });
      if (Array.isArray(saved.whitelisted)) {
        this.whitelistedDomains = new Set(saved.whitelisted);
      }
    }
  }

  _saveSettings() {
    if (this.store) {
      this.store.set('shield_settings', {
        whitelisted: Array.from(this.whitelistedDomains)
      });
    }
  }

  attachToSession(ses) {
    const filter = { urls: ['http://*/*', 'https://*/*'] };

    ses.webRequest.onBeforeRequest(filter, (details, callback) => {
      try {
        const urlObj = new URL(details.url);
        const host = urlObj.hostname.toLowerCase();
        const mainFrameHost = details.frame ? this._getHostFromFrame(details) : host;

        // Check if main site is whitelisted by user
        if (this.isWhitelisted(mainFrameHost)) {
          return callback({ cancel: false });
        }

        // Check if request matches blocked tracker domain
        if (this._isBlocked(host)) {
          this._incrementBlock(mainFrameHost);
          return callback({ cancel: true });
        }

        return callback({ cancel: false });
      } catch (e) {
        return callback({ cancel: false });
      }
    });
  }

  _getHostFromFrame(details) {
    try {
      if (details.initiator) {
        return new URL(details.initiator).hostname.toLowerCase();
      }
    } catch (_) {}
    return '';
  }

  _isBlocked(host) {
    for (const blocked of this.blockedDomains) {
      if (host === blocked || host.endsWith('.' + blocked)) {
        return true;
      }
    }
    return false;
  }

  _incrementBlock(siteHost) {
    if (!siteHost) return;
    const current = this.stats.get(siteHost) || 0;
    this.stats.set(siteHost, current + 1);
  }

  getBlockedCount(siteHost) {
    if (!siteHost) return 0;
    return this.stats.get(siteHost.toLowerCase()) || 0;
  }

  isWhitelisted(siteHost) {
    if (!siteHost) return false;
    return this.whitelistedDomains.has(siteHost.toLowerCase());
  }

  toggleWhitelist(siteHost) {
    if (!siteHost) return false;
    const cleanHost = siteHost.toLowerCase();
    if (this.whitelistedDomains.has(cleanHost)) {
      this.whitelistedDomains.delete(cleanHost);
      this._saveSettings();
      return true; // Shield is now ON
    } else {
      this.whitelistedDomains.add(cleanHost);
      this._saveSettings();
      return false; // Shield is now OFF
    }
  }
}

module.exports = { PrivacyShield };
