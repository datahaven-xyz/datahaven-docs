function updateToggleSlider(container) {
  const buttons = container.querySelectorAll('.toggle-btn');
  if (!buttons.length) return;

  // Create the slider element if it doesn't exist
  let sliderEl = container.querySelector('.toggle-slider');
  if (!sliderEl) {
    sliderEl = document.createElement('div');
    sliderEl.className = 'toggle-slider';
    container.querySelector('.toggle-buttons').prepend(sliderEl);
  }

  const activeBtn = container.querySelector('.toggle-btn.active');
  if (!activeBtn) return;

  // Calculate position relative to the container
  const btnRect = activeBtn.getBoundingClientRect();
  const containerRect = container
    .querySelector('.toggle-buttons')
    .getBoundingClientRect();

  sliderEl.style.width = btnRect.width + 'px';
  sliderEl.style.transform = `translateX(${
    btnRect.left - containerRect.left
  }px)`;
}

document.addEventListener('DOMContentLoaded', () => {
  const containers = document.querySelectorAll('.toggle-container');
  const containerStates = new Map(); // Store setState functions for each container

  containers.forEach((container) => {
    // Initial slider update
    updateToggleSlider(container);

    const buttons = container.querySelectorAll('.toggle-btn');
    const panels = container.querySelectorAll('.toggle-panel');
    const h1Headers = container.querySelectorAll('.toggle-header > span');

    if (!buttons.length || !panels.length || !h1Headers.length) return;

    // Determine canonical variant
    const canonicalButton = Array.from(buttons).find(
      (b) => b.dataset.canonical === 'true'
    );
    const canonicalVariant = canonicalButton
      ? canonicalButton.dataset.variant
      : buttons[0].dataset.variant;

    // -----------------------------
    // Assign normalized IDs
    // -----------------------------
    const setHeaderId = (header, text, variant) => {
      const baseId = text.trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]/g, '');
      
      const isCanonical = variant === canonicalVariant;
      const fullId = isCanonical ? baseId : `${variant}-${baseId}`
      header.id = fullId;

      const link = header.querySelector('a, .headerlink');
      if (link) {
        link.setAttribute('href', `#${fullId}`);
      }
    };

    // Process headers inside panels
    panels.forEach((panel) => {
      const variant = panel.dataset.variant;

      const headers = panel.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headers.forEach((h) => {
        // Get text content excluding child elements like .headerlink
        const text = Array.from(h.childNodes)
          .filter((n) => n.nodeType === Node.TEXT_NODE)
          .map((n) => n.textContent)
          .join('');

        setHeaderId(h, text, variant);
      });
    });

    // Process h1 headers outside panels (.toggle-header > span)
    h1Headers.forEach((span) => {
      const variant = span.dataset.variant;
      if (!variant) return;
      
      const h1 = span.querySelector('h1');
      if (!h1) return;
      
      setHeaderId(h1, h1.textContent, variant);
    });

    // -----------------------------
    // TOC injection
    // -----------------------------
    const originalCanonicalTOC = document.querySelector(
      'nav.md-nav.md-nav--secondary'
    )?.outerHTML;

    function swapTOC(variant) {
      const allSidebars = document.querySelectorAll(
        'nav.md-nav.md-nav--secondary'
      );

      if (!allSidebars.length) {
        console.error('[toggle] No sidebar found');
        return;
      }

      // If switching to canonical, restore original TOC
      if (variant === canonicalVariant) {
        if (originalCanonicalTOC) {
          allSidebars.forEach((sidebar) => {
            const temp = document.createElement('div');
            temp.innerHTML = originalCanonicalTOC;
            const clone = temp.firstElementChild;
            if (clone) {
              sidebar.parentNode.replaceChild(clone, sidebar);
            }
          });
        }
        return;
      }

      const panel = container.querySelector(
        `.toggle-panel[data-variant="${variant}"]`
      );
      if (!panel || !panel.dataset.tocHtml) return;

      // Replace all matching sidebars
      allSidebars.forEach((sidebar) => {
        const temp = document.createElement('div');
        temp.innerHTML = panel.dataset.tocHtml;
        const newSidebar = temp.firstElementChild;

        if (newSidebar) {
          sidebar.parentNode.replaceChild(newSidebar, sidebar);
        }
      });
    }

    // -----------------------------
    // State management
    // -----------------------------
    function getInitialVariant() {
      const hash = window.location.hash.slice(1);
      
      // Check if hash is a variant name directly
      const isValidVariant = [...buttons].some(
        (b) => b.dataset.variant === hash
      );
      if (isValidVariant) return hash;
      
      // Check if hash is a section ID that starts with a variant prefix
      for (const button of buttons) {
        const variant = button.dataset.variant;
        if (variant !== canonicalVariant && hash.startsWith(`${variant}-`)) {
          return variant;
        }
      }
      
      // Default to canonical
      return canonicalVariant;
    }

    let currentVariant = getInitialVariant();

    function setState(variant, updateUrl = true) {
      currentVariant = variant;

      // Update all UI based on state
      buttons.forEach((b) =>
        b.classList.toggle('active', b.dataset.variant === variant)
      );
      panels.forEach((p) =>
        p.classList.toggle('active', p.dataset.variant === variant)
      );
      h1Headers.forEach((h) =>
        h.classList.toggle('active', h.dataset.variant === variant)
      );

      swapTOC(variant);
      updateToggleSlider(container);

      // Only update URL if requested (to preserve section hashes)
      if (updateUrl) {
        if (variant === canonicalVariant) {
          history.replaceState(null, '', window.location.pathname);
        } else {
          window.location.hash = variant;
        }
      }
    }

    // Initialize state without changing the URL (preserve section links)
    setState(currentVariant, false);

    // Store the setState function and related data for this container
    containerStates.set(container, {
      setState,
      getInitialVariant,
      canonicalVariant
    });

    // -----------------------------
    // Toggle click handler
    // -----------------------------
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        setState(btn.dataset.variant);
      });
    });
  });

  // -----------------------------
  // Handle browser back/forward and URL changes (global listener)
  // -----------------------------
  window.addEventListener('hashchange', () => {
    // Re-check all containers to see if variant should change
    containerStates.forEach(({ setState, getInitialVariant, canonicalVariant }, container) => {
      const newVariant = getInitialVariant();

      // Get the current active button to determine current state
      const activeBtn = container.querySelector('.toggle-btn.active');
      const currentVariant = activeBtn?.dataset.variant || canonicalVariant;

      // Only update if variant actually changed, preserve the section hash
      if (newVariant !== currentVariant) {
        setState(newVariant, false);
        
        // After state updates, manually scroll to the hash target
        const hash = window.location.hash.slice(1);
        if (hash) {
          requestAnimationFrame(() => {
            const target = document.getElementById(hash);
            if (target) {
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          });
        }
      }
    });
  });
});