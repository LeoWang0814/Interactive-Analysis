// The user will manually fill each quote value with an exact sentence from the original story or other sources.
const QUOTES = {
  L1: "The world had been sad since Tuesday. Sea and sky were a single ash-gray thing and the sands of the beach, which on March nights glimmered like powdered light, had become a stew of mud and rotten shellfish.",
  A1A: "Pelayo watched over him all afternoon from the kitchen, armed with his bailiff’s club ……",
  B1A: "",
  A1B: "They looked at him so long and so closely that Pelayo and Elisenda very soon overcame their surprise and in the end found him familiar.",
  B1B: "",
  A1C: "Then they felt magnanimous and decided to put the angel on a raft with fresh water and provisions for three days and leave him to his fate on the high seas.",
  B1C: "",
  A1D: "He was lying in the corner drying his open wings in the sunlight among the fruit peels and breakfast leftovers that the early risers had thrown him.",
  B1D: "",
  A2A: "Elisenda, her spine all twisted from sweeping up so much marketplace trash, then got the idea of fencing in the yard and charging five cents admission to see the angel. For in less than a week they had crammed their rooms with money and the line of pilgrims waiting their turn to enter still reached beyond the horizon.",
  B2A: "",
  A2B: "The most unfortunate invalids on earth came in search of health: a poor woman who since childhood has been counting her heartbeats and had run out of numbers; a Portuguese man who couldn’t sleep because the noise of the stars disturbed him; a sleepwalker who got up at night to undo the things he had done while awake; and many others with less serious ailments. In the midst of that shipwreck disorder that made the earth tremble, Pelayo and Elisenda were happy with fatigue, for in less than a week they had crammed their rooms with money and the line of pilgrims waiting their turn to enter still reached beyond the horizon.",
  B2B: "",
  A2C: "",
  B2C: "",
  A3A: "Besides, the few miracles attributed to the angel showed a certain mental disorder, like the blind man who didn’t recover his sight but grew three new teeth, or the paralytic who didn’t get to walk but almost won the lottery, and the leper whose sores sprouted sunflowers.",
  B3A: "",
  A3B: "The admission to see her was not only less than the admission to see the angel, but people were permitted to ask her all manner of questions about her absurd state and to examine her up and down so that no one would ever doubt the truth of her horror. She was a frightful tarantula the size of a ram and with the head of a sad maiden. What was most heartrending, however, was not her outlandish shape but the sincere affliction with which she recounted the details of her misfortune.",
  B3B: "",
  A3C: "",
  B3C: "",
  F1: "The world had been sad since Tuesday. Sea and sky were a single ash-gray thing and the sands of the beach, which on March nights glimmered like powdered light, had become a stew of mud and rotten shellfish.",
  F2: "He was dressed like a ragpicker. His huge buzzard wings, dirty and half-plucked, were forever entangled in the mud.",
  F3: "",
  F4: "His huge buzzard wings, dirty and half-plucked, were forever entangled in the mud.",
  F5: "",
  F6: "",
  F7: "",
  F8: "",
  F9: "She kept watching him even when she was through cutting the onions and she kept on watching until it was no longer possible for her to see him, because then he was no longer an annoyance in her life but an imaginary dot on the horizon of the sea.",
  C1: "",
  C2: "",
  C3: "",
  C4: "",
  T1: "",
  T2: "",
  W1: "",
  R1: "",
  R2: ""
};

const state = {
  hub1: null,
  hub2: null,
  hub3: null,
  lastChoiceLabel: ''
};

function initNavigation() {
  const navLinks = Array.from(document.querySelectorAll('header a'));
  const header = document.querySelector('header');

  const getHeaderHeight = () => {
    const rect = header ? header.getBoundingClientRect() : null;
    return rect ? rect.height : 0;
  };

  function setActiveLink(id) {
    navLinks.forEach(link => {
      const isActive = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('active', isActive);
    });
  }

  function scrollToTarget(target) {
    const rect = target.getBoundingClientRect();
    const offset = rect.top + window.scrollY - getHeaderHeight();
    window.scrollTo({ top: offset, behavior: 'smooth' });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        setActiveLink(target.id);
        scrollToTarget(target);
      }
    });
  });

  const sections = Array.from(document.querySelectorAll('section[id]'));

  function updateActiveLink() {
    const viewportOffset = getHeaderHeight() + 12;
    let activeId = null;

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const isInView = rect.top <= viewportOffset && rect.bottom > viewportOffset;
      if (isInView) {
        activeId = section.id;
      }
    });

    if (!activeId && sections.length) {
      const closest = sections.reduce((acc, section) => {
        const distance = Math.abs(section.getBoundingClientRect().top - viewportOffset);
        return distance < acc.distance ? { id: section.id, distance } : acc;
      }, { id: sections[0].id, distance: Infinity });
      activeId = closest.id;
    }

    if (activeId) {
      const normalizedId = ['hub1', 'hub2', 'hub3'].includes(activeId)
        ? 'hub1'
        : activeId;
      setActiveLink(normalizedId);
    }
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  window.addEventListener('resize', updateActiveLink);
  updateActiveLink();
}

function initHubControls() {
  const groups = document.querySelectorAll('.btn-group');
  groups.forEach(group => {
    group.addEventListener('click', e => {
      const button = e.target.closest('button');
      if (!button) return;
      const hub = group.dataset.hub;
      const choice = button.dataset.choice;
      if (!hub || !choice) return;

      state[hub] = choice;
      state.lastChoiceLabel = button.textContent.trim();
      group.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const resultId = `#${hub}-choice-${choice}`;
      const container = group.parentElement.querySelector('.choice-results');
      container.querySelectorAll('.choice-result').forEach(block => block.classList.remove('active'));
      const target = container.querySelector(resultId);
      if (target) {
        target.classList.add('active');
      }

      updateProfileNote();
    });
  });
}

function initFigurativeFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.figurative-card');

  function applyFilter(type) {
    cards.forEach(card => {
      if (card.dataset.type === type) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilter(btn.dataset.filter);
    });
  });

  const initial = document.querySelector('.filter-btn.active');
  if (initial) {
    applyFilter(initial.dataset.filter);
  }
}

function computeProfile() {
  const townChoices = [];
  const resistChoices = [];

  if (state.hub1 === 'help') resistChoices.push('hub1');
  else if (state.hub1) townChoices.push('hub1');

  if (state.hub3 === 'stay') resistChoices.push('hub3');
  else if (state.hub3) townChoices.push('hub3');

  if (state.hub2) townChoices.push('hub2');

  return resistChoices.length > townChoices.length ? 'B' : 'A';
}

function updateProfileNote() {
  const note = document.getElementById('profile-note');
  if (!note) return;
  if (state.lastChoiceLabel) {
    note.textContent = `Latest choice: “${state.lastChoiceLabel}”. Click “See my profile” to view the stance it suggests.`;
  } else {
    note.textContent = 'Make a choice in each section to unlock a personalized profile.';
  }
}

function initProfileButton() {
  const btn = document.getElementById('btn-profile');
  const profileA = document.getElementById('profile-A');
  const profileB = document.getElementById('profile-B');
  const note = document.getElementById('profile-note');

  btn.addEventListener('click', () => {
    if (!state.hub1 || !state.hub2 || !state.hub3) {
      alert('Please make a choice in all three hubs first.');
      return;
    }

    const result = computeProfile();
    profileA.classList.remove('active');
    profileB.classList.remove('active');
    if (result === 'A') {
      profileA.classList.add('active');
    } else {
      profileB.classList.add('active');
    }

    if (note) {
      const label = state.lastChoiceLabel;
      note.textContent = label
        ? `You last chose “${label}”, so this profile highlights how that decision aligns with the story.`
        : 'Your latest selection will shape which profile you see.';
    }
  });
}

function initQuotePanels() {
  document.querySelectorAll('.quote-icon').forEach(icon => {
    const card = icon.closest('[data-quote-key]');
    const key = card ? card.getAttribute('data-quote-key') : null;
    const quote = key ? QUOTES[key] : null;
    if (!key || !quote || !card) {
      icon.remove();
      return;
    }

    let panel = null;

    icon.addEventListener('click', () => {
      if (panel) {
        icon.classList.remove('active');
        panel.classList.add('fade-out');
        setTimeout(() => {
          panel.remove();
          card.classList.remove('quote-expanded');
          panel = null;
        }, 260);
        return;
      }

      panel = document.createElement('div');
      panel.className = 'quote-panel entering';
      panel.innerHTML = `
        <div class="quote-panel-header">
          <span class="quote-tag">quote</span>
          <button class="quote-toggle" aria-expanded="true">▲</button>
        </div>
        <div class="quote-panel-body"><p>${quote}</p></div>
      `;

      const toggle = panel.querySelector('.quote-toggle');
      toggle.addEventListener('click', () => {
        const collapsed = panel.classList.toggle('collapsed');
        toggle.textContent = collapsed ? '▼' : '▲';
        toggle.setAttribute('aria-expanded', (!collapsed).toString());
      });

      card.appendChild(panel);
      card.classList.add('quote-expanded');
      icon.classList.add('active');
      requestAnimationFrame(() => panel.classList.remove('entering'));
    });
  });
}

function setYear() {
  const year = document.querySelector('.year');
  if (year) year.textContent = new Date().getFullYear();
}

window.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initHubControls();
  initFigurativeFilter();
  initProfileButton();
  initQuotePanels();
  updateProfileNote();
  setYear();
});
