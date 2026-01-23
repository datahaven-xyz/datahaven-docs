/* Copy to LLM functionality
  Modified from: https://github.com/leonardocustodio/mkdocs-copy-to-llm/blob/main/mkdocs_copy_to_llm/assets/js/copy-to-llm.js

  This script adds per-page LLM functionality UI controller that:
    - Renders a split button next to the main heading that copies, downloads, or opens Markdown in ChatGPT or Claude.
    - Emits analytics via GA (TODO: needs wired up to work).
*/

(function () {
  'use strict';
  /* Protects script from crashing when evaluated in env w/o a browser
    (build, etc.). No window = no DOM = script quietly exits. */
  if (typeof window === 'undefined') {
    return;
  }
  function buildSlugFromPath(pathname) {
    const route = (pathname || '').replace(/^\/+|\/+$/g, '');
    return route.split('/').filter(Boolean).join('-');
  }

  function getScopeUrl() {
    try {
      const scope = window.__md_scope;
      if (scope instanceof URL) {
        return scope;
      }
      return new URL('.', window.location);
    } catch (error) {
      return null;
    }
  }

  function stripBasePath(pathname) {
    const scopeUrl = getScopeUrl();
    if (!scopeUrl) {
      return pathname;
    }
    const basePath = scopeUrl.pathname.replace(/\/+$/, '');
    if (!basePath || basePath === '/') {
      return pathname;
    }
    if (pathname.startsWith(basePath)) {
      const stripped = pathname.slice(basePath.length);
      return stripped || '/';
    }
    return pathname;
  }

  function getPageSlug() {
    return buildSlugFromPath(stripBasePath(window.location.pathname));
  }

  function getMarkdownUrl(slug) {
    const baseUrl = getScopeUrl() || new URL(window.location.href);
    return new URL(`ai/pages/${slug}.md`, baseUrl).href;
  }

  const NO_MARKDOWN_MESSAGE = 'No Markdown file available.';

  async function fetchMarkdown(slug) {
    const url = getMarkdownUrl(slug);
    try {
      const response = await fetch(url, { credentials: 'omit' });
      if (!response.ok) {
        if (response.status === 404) {
          return { text: null, url, status: 404 };
        }
        throw new Error(`HTTP ${response.status}`);
      }
      const text = await response.text();
      return { text, url, status: 200 };
    } catch (error) {
      console.warn('Copy to LLM: unable to fetch markdown file', url, error);
      return { text: null, url, status: 'error' };
    }
  }

  async function downloadMarkdown(slug, filename) {
    const url = getMarkdownUrl(slug);
    try {
      const response = await fetch(url, { credentials: 'omit' });
      if (!response.ok) {
        return response.status === 404
          ? { success: false, status: 404 }
          : { success: false, status: response.status };
      }
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(objectUrl);
      link.remove();
      return { success: true };
    } catch (error) {
      console.warn('Copy to LLM: download failed', url, error);
      return { success: false, status: 'error' };
    }
  }

  // ---------- Analytics helpers ----------
  // gtag is available on all pages
  function sendAnalytics(eventName, gaData) {
    if (typeof window.gtag === 'function') {
      try {
        window.gtag(
          'event',
          eventName,
          Object.assign(
            {
              event_category: 'engagement',
            },
            gaData
          )
        );
      } catch (error) {
        console.error('Error tracking analytics event:', error);
      }
    }
  }

  function trackCopyEvent(eventType, contentLength) {
    sendAnalytics('copy_to_llm', {
      event_label: eventType,
      value: contentLength,
    });
  }

  // Lightweight GA event wrapper for button clicks (download/open/chat etc.).
  function trackButtonClick(eventType) {
    sendAnalytics('copy_to_llm_click', {
      event_label: eventType,
    });
  }

  // ---------- Page helpers ----------

  // ---------- Clipboard helpers ----------
  async function copyToClipboard(text, button, eventType) {
    let copied = false;
    try {
      await navigator.clipboard.writeText(text);
      copied = true;
    } catch (error) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        copied = true;
      } catch (fallbackError) {
        console.error('Copy to LLM: clipboard fallback failed', fallbackError);
      }
      document.body.removeChild(textarea);
    }

    if (copied) {
      showCopySuccess(button);
      trackCopyEvent(eventType, text.length);
    }

    return copied;
  }

  // Toast helper so copy/download feedback is consistent across buttons.
  function showToast(message) {
    const existingToast = document.querySelector('.copy-to-llm-toast');
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'copy-to-llm-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 2500);
  }

  function showCopySuccess(button) {
    const originalTitle = button.title;
    const textElement = button.querySelector('.button-text');
    const originalText = textElement ? textElement.textContent : '';
    const action = button.dataset ? button.dataset.action || '' : '';
    const successLabel =
      action === 'download-markdown' ? 'Downloading...' : 'Copied!';

    if (button.classList.contains('copy-to-llm-dropdown-item')) {
      button.classList.add('copy-success');
      button.title = successLabel;
      if (textElement) {
        textElement.textContent = successLabel;
      }
      setTimeout(() => {
        button.classList.remove('copy-success');
        button.title = originalTitle;
        if (textElement) {
          textElement.textContent = originalText;
        }
      }, 2000);
    }

    const message =
      action === 'download-markdown'
        ? 'Download starting...'
        : 'Content copied to clipboard!';
    showToast(message);
  }

  // Visual + tooltip reset when clipboard/download sequence fails.
  function showCopyError(button) {
    const originalTitle =
      button.getAttribute('data-original-title') ||
      button.getAttribute('title') ||
      '';
    button.setAttribute('data-original-title', originalTitle);
    button.classList.add('copy-error');
    button.title = 'Copy failed';

    setTimeout(() => {
      button.classList.remove('copy-error');
      if (originalTitle) {
        button.title = originalTitle;
      } else {
        button.removeAttribute('title');
      }
      button.removeAttribute('data-original-title');
    }, 2000);
  }

  // ---------- UI creation ----------
  function createSectionCopyButton() {
    const container = document.createElement('div');
    container.className = 'copy-to-llm-split-container';

    const copyButton = document.createElement('button');
    copyButton.className = 'copy-to-llm copy-to-llm-section copy-to-llm-left';
    copyButton.title = 'Copy entire page to LLM';
    copyButton.setAttribute(
      'aria-label',
      'Copy entire page content to clipboard for LLM usage'
    );
    copyButton.setAttribute('role', 'button');
    copyButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="copy-icon" aria-hidden="true">
        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
      </svg>
      <span class="button-text">Copy page</span>
    `;

    const dropdownButton = document.createElement('button');
    dropdownButton.className =
      'copy-to-llm copy-to-llm-section copy-to-llm-right';
    dropdownButton.title = 'Copy options';
    dropdownButton.type = 'button';
    dropdownButton.setAttribute('aria-label', 'Copy options menu');
    dropdownButton.setAttribute('aria-haspopup', 'true');
    dropdownButton.setAttribute('aria-expanded', 'false');
    dropdownButton.setAttribute('role', 'button');
    dropdownButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="chevron-icon" aria-hidden="true">
        <path d="M7 10l5 5 5-5z"/>
      </svg>
    `;

    const dropdownMenu = document.createElement('div');
    dropdownMenu.className = 'copy-to-llm-dropdown';
    dropdownMenu.setAttribute('role', 'menu');
    dropdownMenu.setAttribute('aria-labelledby', 'dropdown-button');
    dropdownMenu.innerHTML = `
      <button class="copy-to-llm-dropdown-item" data-action="view-markdown" role="menuitem" tabindex="-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
          <path d="M8 2c1.981 0 3.671.992 4.933 2.078 1.27 1.091 2.187 2.345 2.637 3.023a1.62 1.62 0 0 1 0 1.798c-.45.678-1.367 1.932-2.637 3.023C11.67 13.008 9.981 14 8 14c-1.981 0-3.671-.992-4.933-2.078C1.797 10.83.88 9.576.43 8.898a1.62 1.62 0 0 1 0-1.798c.45-.677 1.367-1.931 2.637-3.022C4.33 2.992 6.019 2 8 2ZM1.679 7.932a.12.12 0 0 0 0 .136c.411.622 1.241 1.75 2.366 2.717C5.176 11.758 6.527 12.5 8 12.5c1.473 0 2.825-.742 3.955-1.715 1.124-.967 1.954-2.096 2.366-2.717a.12.12 0 0 0 0-.136c-.412-.621-1.242-1.75-2.366-2.717C10.824 4.242 9.473 3.5 8 3.5c-1.473 0-2.825.742-3.955 1.715-1.124.967-1.954 2.096-2.366 2.717ZM8 10a2 2 0 1 1-.001-3.999A2 2 0 0 1 8 10Z"/>
        </svg>
        <span>View Page in Markdown</span>
      </button>
      <button class="copy-to-llm-dropdown-item" data-action="download-markdown" role="menuitem" tabindex="-1">
        <svg class="octicon" aria-hidden="true" width="16" height="16" viewBox="0 0 16 16">
          <path d="M2.75 14A1.75 1.75 0 0 1 1 12.25v-2.5a.75.75 0 0 1 1.5 0v2.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25v-2.5a.75.75 0 0 1 1.5 0v2.5A1.75 1.75 0 0 1 13.25 14Z"/>
          <path d="M7.25 7.689V2a.75.75 0 0 1 1.5 0v5.689l1.97-1.969a.749.749 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 6.78a.749.749 0 1 1 1.06-1.06z"/>
        </svg>
        <span>Download Page in Markdown</span>
      </button>
      <button class="copy-to-llm-dropdown-item" data-action="open-chatgpt" role="menuitem" tabindex="-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M22.282 9.821a6 6 0 0 0-.516-4.91a6.05 6.05 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a6 6 0 0 0-3.998 2.9a6.05 6.05 0 0 0 .743 7.097a5.98 5.98 0 0 0 .51 4.911a6.05 6.05 0 0 0 6.515 2.9A6 6 0 0 0 13.26 24a6.06 6.06 0 0 0 5.772-4.206a6 6 0 0 0 3.997-2.9a6.06 6.06 0 0 0-.747-7.073M13.26 22.43a4.48 4.48 0 0 1-2.876-1.04l.141-.081l4.779-2.758a.8.8 0 0 0 .392-.681v-6.737l2.02 1.168a.07.07 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494M3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085l4.783 2.759a.77.77 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646M2.34 7.896a4.5 4.5 0 0 1 2.366-1.973V11.6a.77.77 0 0 0 .388.677l5.815 3.354l-2.02 1.168a.08.08 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.08.08 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667m2.01-3.023l-.141-.085l-4.774-2.782a.78.78 0 0 0-.785 0L9.409 9.23V6.897a.07.07 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.8.8 0 0 0-.393.681zm1.097-2.365l2.602-1.5l2.607 1.5v2.999l-2.597 1.5l-2.607-1.5Z"/>
        </svg>
        <span>Open in ChatGPT</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
          <path d="M3.75 2h3.5a.75.75 0 0 1 0 1.5h-3.5a.25.25 0 0 0-.25.25v8.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-3.5a.75.75 0 0 1 1.5 0v3.5A1.75 1.75 0 0 1 12.25 14h-8.5A1.75 1.75 0 0 1 2 12.25v-8.5C2 2.784 2.784 2 3.75 2Zm6.854-1h4.146a.25.25 0 0 1 .25.25v4.146a.25.25 0 0 1-.427.177L13.03 4.03 9.28 7.78a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042l3.75-3.75-1.543-1.543A.25.25 0 0 1 10.604 1Z"/>
        </svg>
      </button>
      <button class="copy-to-llm-dropdown-item" data-action="open-claude" role="menuitem" tabindex="-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M17.304 3.541h-3.672l6.696 16.918H24Zm-10.608 0L0 20.459h3.744l1.37-3.553h7.005l1.369 3.553h3.744L10.536 3.541Zm-.371 10.223L8.616 7.82l2.291 5.945Z"/>
        </svg>
        <span>Open in Claude</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
          <path d="M3.75 2h3.5a.75.75 0 0 1 0 1.5h-3.5a.25.25 0 0 0-.25.25v8.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-3.5a.75.75 0 0 1 1.5 0v3.5A1.75 1.75 0 0 1 12.25 14h-8.5A1.75 1.75 0 0 1 2 12.25v-8.5C2 2.784 2.784 2 3.75 2Zm6.854-1h4.146a.25.25 0 0 1 .25.25v4.146a.25.25 0 0 1-.427.177L13.03 4.03 9.28 7.78a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042l3.75-3.75-1.543-1.543A.25.25 0 0 1 10.604 1Z"/>
        </svg>
      </button>
    `;

    container.appendChild(copyButton);
    container.appendChild(dropdownButton);
    container.appendChild(dropdownMenu);

    return { container, copyButton, dropdownButton, dropdownMenu };
  }

  // Mount UI next to the first H1 (skip if already rendered or on the home page).
  function addSectionCopyButtons() {
    const slug = getPageSlug();
    const isHomePage = !slug || slug === 'index';
    if (isHomePage) {
      return;
    }

    if (document.querySelector('.copy-to-llm-split-container')) {
      return;
    }

    const mainTitle = document.querySelector('.md-content h1');
    if (mainTitle) {
      const wrapper = document.createElement('div');
      wrapper.className = 'h1-copy-wrapper';
      mainTitle.parentNode.insertBefore(wrapper, mainTitle);
      wrapper.appendChild(mainTitle);

      const { container, copyButton, dropdownButton, dropdownMenu } =
        createSectionCopyButton();

      [copyButton, dropdownButton].forEach((button) => {
        button.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            button.click();
          }
        });
      });

      dropdownMenu.addEventListener('keydown', (e) => {
        const items = Array.from(
          dropdownMenu.querySelectorAll('.copy-to-llm-dropdown-item')
        );
        const currentIndex = items.findIndex(
          (item) => item === document.activeElement
        );
        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            if (!items.length) break;
            items[(currentIndex + 1) % items.length].focus();
            break;
          case 'ArrowUp':
            e.preventDefault();
            if (!items.length) break;
            items[(currentIndex - 1 + items.length) % items.length].focus();
            break;
          case 'Escape':
            e.preventDefault();
            dropdownMenu.classList.remove('show');
            dropdownButton.classList.remove('active');
            dropdownButton.setAttribute('aria-expanded', 'false');
            dropdownButton.focus();
            resetChevron(dropdownButton);
            break;
        }
      });

      copyButton.addEventListener('click', async (event) => {
        event.preventDefault();
        trackButtonClick('copy_page_markdown');

        const icon = copyButton.querySelector('.copy-icon');
        const originalIconHTML = icon ? icon.outerHTML : '';
        if (icon) {
          icon.outerHTML = `
            <svg class="copy-icon loading-spinner" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" stroke-dasharray="31.4" stroke-dashoffset="0">
                <animate attributeName="stroke-dashoffset" dur="1s" repeatCount="indefinite" from="0" to="62.8"/>
              </circle>
            </svg>
          `;
        }

        let copySucceeded = false;
        const slug = getPageSlug();

        const { text } = await fetchMarkdown(slug);

        if (text) {
          copySucceeded = await copyToClipboard(
            text,
            copyButton,
            'markdown_content'
          );
        }

        if (!text || !copySucceeded) {
          showCopyError(copyButton);
        }

        const currentIcon = copyButton.querySelector('.copy-icon');
        if (currentIcon) {
          if (copySucceeded) {
            currentIcon.outerHTML = `
              <svg class="copy-icon copy-success-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            `;
            setTimeout(() => {
              const iconAfter = copyButton.querySelector('.copy-icon');
              if (iconAfter) {
                iconAfter.outerHTML = originalIconHTML;
              }
            }, 3000);
          } else {
            currentIcon.outerHTML = originalIconHTML;
          }
        }
      });

      dropdownButton.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        dropdownMenu.classList.toggle('show');
        const isOpen = dropdownMenu.classList.contains('show');
        dropdownButton.classList.toggle('active', isOpen);
        dropdownButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        resetChevron(dropdownButton);
        if (isOpen) {
          const firstItem = dropdownMenu.querySelector(
            '.copy-to-llm-dropdown-item'
          );
          if (firstItem) {
            firstItem.focus();
          }
        }
      });

      dropdownMenu.addEventListener('click', async (event) => {
        event.stopPropagation();
        const item = event.target.closest('.copy-to-llm-dropdown-item');
        if (!item) {
          return;
        }

        const action = item.dataset.action;
        const slug = getPageSlug();

        // Each dropdown option maps to one of the shared helpers or a new-tab prompt.
        switch (action) {
          case 'view-markdown': {
            trackButtonClick('view_page_markdown');
            const mdUrl = getMarkdownUrl(slug);
            window.open(mdUrl, '_blank', 'noopener');
            break;
          }
          case 'download-markdown': {
            trackButtonClick('download_page_markdown');
            const result = await downloadMarkdown(slug, `${slug}.md`);
            if (result.success) {
              showCopySuccess(item);
            } else if (result.status === 404) {
              showToast(NO_MARKDOWN_MESSAGE);
            } else {
              showCopyError(item);
            }
            break;
          }
          case 'open-chatgpt': {
            trackButtonClick('open_chatgpt');
            const currentUrl = window.location.href;
            const jinaUrl = `https://r.jina.ai/${currentUrl}`;
            const prompt = `Analyze the documentation at ${jinaUrl}. Focus on the technical implementation details and code examples. I want to ask you questions about implementing these protocols.`;
            const chatGPTUrl = `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`;
            window.open(chatGPTUrl, '_blank');
            break;
          }
          case 'open-claude': {
            trackButtonClick('open_claude');
            const mdUrl = getMarkdownUrl(slug);
            const prompt = `Read ${mdUrl} so I can ask questions about it.`;
            const claudeUrl = `https://claude.ai/new?q=${encodeURIComponent(
              prompt
            )}`;
            window.open(claudeUrl, '_blank');
            break;
          }
        }

        dropdownMenu.classList.remove('show');
        dropdownButton.classList.remove('active');
        dropdownButton.setAttribute('aria-expanded', 'false');
        resetChevron(dropdownButton);
      });

      document.addEventListener('click', (event) => {
        if (!container.contains(event.target)) {
          dropdownMenu.classList.remove('show');
          dropdownButton.classList.remove('active');
          dropdownButton.setAttribute('aria-expanded', 'false');
          resetChevron(dropdownButton);
        }
      });

      wrapper.appendChild(container);
    }
  }

  // Keeps the dropdown chevron pointed the right way for accessibility + polish.
  function resetChevron(button) {
    const chevron = button.querySelector('.chevron-icon');
    if (chevron) {
      chevron.style.transform = button.classList.contains('active')
        ? 'rotate(180deg)'
        : '';
    }
  }

  function initialize() {
    addSectionCopyButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
})();