import './style.css';

/* ==========================================================================
   PAALA PALACE - CORE INTERACTIVE ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  initNavigation();
  initMigrationTimelineMap();
  initArchiveSystem();
  initLineageRegister();
  initConsultationForm();
  initCurtainSystem();
  initDepositSystem();
});

/* ==========================================================================
   1. NAVIGATION & MOBILE DRAWER
   ========================================================================== */
function initNavigation() {
  const header = document.querySelector('.archival-header');
  const mobileTrigger = document.getElementById('mobileMenuTrigger');
  const mobileNav = document.getElementById('mobileNav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  // Sticky Header Transition on Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.style.padding = '12px 30px';
      header.style.backgroundColor = 'rgba(10, 9, 8, 0.98)';
      header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.6)';
    } else {
      header.style.padding = '18px 30px';
      header.style.backgroundColor = 'rgba(10, 9, 8, 0.92)';
      header.style.boxShadow = 'none';
    }
  });

  // Mobile Menu Toggle
  if (mobileTrigger && mobileNav) {
    mobileTrigger.addEventListener('click', () => {
      const isActive = mobileNav.classList.toggle('active');
      mobileTrigger.classList.toggle('active');

      // Transform hamburger into cross
      const lines = mobileTrigger.querySelectorAll('.hamburger-line');
      if (isActive) {
        lines[0].style.transform = 'translateY(7px) rotate(45deg)';
        lines[1].style.opacity = '0';
        lines[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        lines[0].style.transform = 'none';
        lines[1].style.opacity = '1';
        lines[2].style.transform = 'none';
      }
    });

    // Close Mobile Menu on Link Click
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        mobileTrigger.classList.remove('active');
        const lines = mobileTrigger.querySelectorAll('.hamburger-line');
        lines[0].style.transform = 'none';
        lines[1].style.opacity = '1';
        lines[2].style.transform = 'none';
      });
    });
  }
}

/* ==========================================================================
   1B. INTERACTIVE MIGRATION TIMELINE MAP
   ========================================================================== */
function initMigrationTimelineMap() {
  const mapSvg = document.getElementById('migrationMap');
  const activeRoute = document.getElementById('migrationRoute');
  const timelineColumn = document.querySelector('.timeline-column');
  const timelineItems = document.querySelectorAll('.timeline-item');
  const mapNodes = document.querySelectorAll('.map-node');

  // Coordinate panel elements
  const mapCoordVal = document.getElementById('mapCoordVal');
  const mapLeaderVal = document.getElementById('mapLeaderVal');
  const mapCargoVal = document.getElementById('mapCargoVal');
  const mapLogText = document.getElementById('mapLogText');
  const cartographyPanel = document.getElementById('cartographyPanel');

  if (!mapSvg || !activeRoute) return;

  // Initialize SVG Path length
  let pathLength = 0;
  try {
    pathLength = activeRoute.getTotalLength();
  } catch (e) {
    pathLength = 400; // Fallback
  }

  activeRoute.style.strokeDasharray = pathLength;
  activeRoute.style.strokeDashoffset = pathLength;

  const MIGRATION_LOGS = {
    'yendi': {
      coord: '9°26\'30" N, 0°00\'50" W',
      leader: 'Naa Zokuli (Sovereign of Dagbon)',
      cargo: 'Dagbon Royal Skins & Palace Order',
      log: '"Led a westward royal expedition from Yendi in search of wealth and territory. Settled first at Doli, laying the foundations of the Dolimon identity before fleeing the Gonja warrior Jakpa across the Black Volta."',
      progress: 0.0
    },
    'wa-confed': {
      coord: '9°16\'11" N, 3°00\'15" W',
      leader: 'Naa Zokuli & King Haïngère',
      cargo: 'The Joint Skins of Bouna Kingdom',
      log: '"Crossed the Volta into Gbono/Bouna. Formed a union with Mantou of the Lorhon people. From this came Bounkani, who founded the centralized Bouna Kingdom, balancing royal authority with land-priest power. Naa Zokuli disappeared in the lake, leaving his memory as a sacred gold-adorned crocodile."',
      progress: 0.45
    },
    'dorimon': {
      coord: '9°41\'58" N, 2°43\'11" W',
      leader: 'Dakpa & Gango (Lineage Founders)',
      cargo: 'The Dakpayiri & Gangoyiri Stool Gates',
      log: '"Returned eastward from the Bouna country, settling at Bieli among deep-rooted land custodians (Tendamba). The founding brothers established the rotating gates of chieftaincy, with every chief-elect fortified and enskinned by the Tendamba of Bieli."',
      progress: 0.75
    },
    'colonial': {
      coord: '9°43\'15" N, 2°45\'28" W',
      leader: 'Naa Abudu Mumuni & Naa Seidu II',
      cargo: 'Paramount Skins of Dorimon Seat',
      log: '"Dorimon achieved formal paramountcy on 15 January 1983 under Paramount Chief Naa Abudu Mumuni. On 15 May 2025, the Upper West Regional House of Chiefs declared Naa Seidu Tungbani Salinbile II validly enskinned as the Paramount Chief, ensuring the sovereign succession of the skin."',
      progress: 1.0
    }
  };

  function updateActiveNode(nodeId, triggerScroll = false) {
    // 1. Highlight map nodes
    mapNodes.forEach(node => {
      if (node.getAttribute('data-node-id') === nodeId) {
        node.classList.add('active');
      } else {
        node.classList.remove('active');
      }
    });

    // 2. Highlight timeline items
    timelineItems.forEach(item => {
      if (item.getAttribute('data-timeline-id') === nodeId) {
        item.classList.add('active');
        if (triggerScroll && timelineColumn) {
          // Scroll the item into view inside the scroll container
          const containerTop = timelineColumn.scrollTop;
          const containerHeight = timelineColumn.clientHeight;
          const elemTop = item.offsetTop - timelineColumn.offsetTop;
          const elemHeight = item.clientHeight;

          // Perform smooth scroll block adjust
          timelineColumn.scrollTo({
            top: elemTop - (containerHeight / 2) + (elemHeight / 2),
            behavior: 'smooth'
          });
        }
      } else {
        item.classList.remove('active');
      }
    });

    // 3. Update Map Route Path
    const nodeData = MIGRATION_LOGS[nodeId];
    if (nodeData) {
      const offset = pathLength - (nodeData.progress * pathLength);
      activeRoute.style.strokeDashoffset = offset;

      // 4. Update coordinates panel (with cinematic text fade)
      if (cartographyPanel) {
        cartographyPanel.style.opacity = '0.3';
        cartographyPanel.style.transform = 'scale(0.99)';
        cartographyPanel.style.transition = 'all 0.3s ease';

        setTimeout(() => {
          mapCoordVal.textContent = nodeData.coord;
          mapLeaderVal.textContent = nodeData.leader;
          mapCargoVal.textContent = nodeData.cargo;
          mapLogText.textContent = nodeData.log;

          cartographyPanel.style.opacity = '1';
          cartographyPanel.style.transform = 'scale(1)';
        }, 150);
      }
    }
  }

  // Map node clicks
  mapNodes.forEach(node => {
    node.addEventListener('click', () => {
      const nodeId = node.getAttribute('data-node-id');
      updateActiveNode(nodeId, true);
    });
  });

  // Timeline item clicks
  timelineItems.forEach(item => {
    item.addEventListener('click', () => {
      const nodeId = item.getAttribute('data-timeline-id');
      updateActiveNode(nodeId);
    });
  });

  // Performant Intersection Observer for Scroll Tracking
  const observerOptions = {
    root: timelineColumn,
    rootMargin: '-30% 0px -40% 0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const nodeId = entry.target.getAttribute('data-timeline-id');
        updateActiveNode(nodeId);
      }
    });
  }, observerOptions);

  timelineItems.forEach(item => observer.observe(item));

  // Initialize
  updateActiveNode('yendi');
}

/* ==========================================================================
   2. ROYAL ARCHIVE & LIBRARY SYSTEM
   ========================================================================== */
// High-fidelity historical text documents
const ARCHIVE_DOCUMENTS = {
  'migration-chronicle': {
    title: 'The Westward Journey of Naa Zokuli (1894 Oral Record)',
    code: 'MS-1685-NZ',
    category: 'Historical Treaty',
    content: `
      <h4>THE WESTWARD EXPEDITION AND THE BIRTH OF BOUNKANI</h4>
      <p><em>From the oral transcriptions of the court of Naa Toriwonye, preserved in the royal scroll.</em></p>
      <p>Let it be known to all scholars and descendants of the skin that our royal ancestry was forged in the royal court of the great Dagbon Kingdom at Yendi. Our pathfinder Naa Zokuli, a ruler of Dagbon, led a westward expedition in search of wealth and new sovereign domains, giving rise to the Hanga, Wala/Dorimon, and Koulango/Bouna branches.</p>
      <blockquote>
        "We settled first at Doli near Bole, which gave rise to our name Dolimon. When the Gonja warrior Jakpa attacked Doli in error, we crossed the Black Volta river westward into Gbono/Bouna."
      </blockquote>
      <p>In Bouna, Naa Zokuli met the Lorhon people and their chief King Haïngère. From a union between Zokuli and the chief's sister, Mantou, a son was born. When messengers crossed a roaring river to inform Zokuli, he replied in Dagomba: <em>"Bo n-kani?"</em> meaning <em>"What is missing?"</em> The child was named Bounkani, founding the centralized Bouna Kingdom and carrying both Dagbon royal authority and Lorhon land custody.</p>
      <p>Naa Zokuli disappeared in the waters of Bouna Lake during a storm. Stool elders carried three stones back to Dagbon for his funeral, establishing the tradition of <strong>Kuli vabu</strong>—the custom for a sovereign whose body is not recovered.</p>
      <div class="archival-signature-block">
        <div class="sig-line">
          <span class="sig-title">ROYAL SCRIBE CUSTODIAN</span>
          <span class="sig-name has-mark">Elder Alhaji Issa Mahama</span>
        </div>
      </div>
    `
  },
  'border-adjudication': {
    title: 'The Adomakuma Shrine & Nahari Accord (1923)',
    code: 'PL-1923-NA',
    category: 'Judicial Petition',
    content: `
      <h4>IN THE CUSTOMARY COURT OF THE SOVEREIGN SKIN</h4>
      <p><em>Case ref: GL-1923-NH-012. Customary Arbitrator: Elders of the Gangoyiri Stool.</em></p>
      <p>Regarding the petition filed by the descendants of Daari Zinmara, verifying traditional boundary limits and land purification protocols at Nahari.</p>
      <blockquote>
        "Customary domain boundaries are preserved through the sacred shrines of our land priests and the ritual sequences of the ancestral Tugbani."
      </blockquote>
      <p>The Court has reviewed the founding of Nahari during the reign of Gangoyiri chief Naa Serber Zinmara. His son, Daari Zinmara, travelled eastward and discovered this fertile territory. Naa Serber Zinmara sent his three sons—Daari, Naahu, and Toudari—to settle the land, transferring the ancestral shrine <strong>Adomakuma</strong> to guard the region.</p>
      <p>Nahari represents a sacred union of three waves: the original Vagla settlers (Eliela), the Dolimon settlers (Ewala), and farmers from Sing. The female Tugbani shrine Adomakuma must be approached first in every annual purification ceremony, keeping the migration path alive in living practice.</p>
      <div class="archival-signature-block">
        <div class="sig-line">
          <span class="sig-title">GANGOYIRI ELDER GUARDIAN</span>
          <span class="sig-name">Elder Kwame Gangoyiri</span>
        </div>
        <div class="sig-line">
          <span class="sig-title">NAHARI CUSTOMARY KEEPER</span>
          <span class="sig-name has-mark">Elder Daari Zinmara III</span>
        </div>
      </div>
    `
  },
  'yeri-depositions': {
    title: 'Customary Succession Covenants of Bieli Tendamba (1956 Recording)',
    code: 'RG-1956-BC',
    category: 'Royal Lineage',
    content: `
      <h4>DEPOSITIONS OF THE BIELI ENSKINMENT CUSTOM</h4>
      <p><em>Recorded at the Stool House of Bieli, Elder Tendaana Salifu testifying.</em></p>
      <p>I speak this truth before the sacred ancestors who returned from Bouna. The selection of the Paramount Chief of Dorimon is governed by absolute rotation and deep spiritual covenants. The skin belongs to the whole tradition: the gates, the Tendamba, the palace, and the people together.</p>
      <ul>
        <li><strong>The Dakpayiri Gate:</strong> Descendants of the founding brother Dakpa. Land domain (gaara) covering Dontanga and Kogle.</li>
        <li><strong>The Gangoyiri Gate:</strong> Descendants of the founding brother Gango. Land domain (gaara) covering Donkoru and Bienye.</li>
      </ul>
      <p>When a Paramount Chief is selected, the chief-elect must first be received at Bieli. Here, the Tendamba (land priests) perform the customary purification, ritually fortify the candidate, and send him to the palace. Without the enskinment blessings from the Tendamba of Bieli, the skin cannot sit warm and the ancestors will withhold their protection.</p>
      <div class="archival-signature-block">
        <div class="sig-line">
          <span class="sig-title">BIELI EARTH PRIEST KEEPER</span>
          <span class="sig-name">Tendaana Salifu of Bieli</span>
        </div>
      </div>
    `
  },
  'anglo-french': {
    title: 'Formal Decree of Dorimon Paramountcy Status (1983)',
    code: 'TS-1983-PD',
    category: 'Historical Treaty',
    content: `
      <h4>THE DECREE OF PARAMOUNTCY ELEVATION</h4>
      <p><em>Upper West House of Chiefs, January 15, 1983.</em></p>
      <p>To all traditional councils, chiefs, and citizens of Ghana, greeting. This historic instrument confirms the official elevation of the Dorimon Traditional Area to paramount status.</p>
      <p>Under the reign of Gangoyiri chief Naa Abudu Mumuni, the long-standing sovereignty, military resilience, and territorial boundary of the Dolimon people are formally recognized by the State.</p>
      <blockquote>
        "Dorimon shall henceforth stand as a Paramount Seat within the Wa West District, alongside Wechiau, holding full customary jurisdiction over its gates, sub-gates, and Tendamba land domains."
      </blockquote>
      <p>This charter is signed and verified by the President of the National House of Chiefs, with the royal seal of Naa Abudu Mumuni in witness of the sovereign paramountcy.</p>
      <div class="archival-signature-block">
        <div class="sig-line">
          <span class="sig-title">UPPER WEST HOUSE REGISTRAR</span>
          <span class="sig-name">Nene Kwasi Boakye III</span>
        </div>
        <div class="sig-line">
          <span class="sig-title">PARAMOUNT CHIEF OF DORIMON</span>
          <span class="sig-name has-mark">Naa Abudu Mumuni</span>
        </div>
      </div>
    `
  },
  'customary-land': {
    title: 'Rotating Succession Covenants: Dakpayiri & Gangoyiri (1990 Customary Assembly)',
    code: 'PL-1990-RG',
    category: 'Judicial Petition',
    content: `
      <h4>COVENANTS OF THE DUAL ROYAL GATES</h4>
      <p><em>Presented to the Customary Arbitration Committee, by the Combined Elders of the Stool.</em></p>
      <p>We, the royal elders and Stool custodians of Dorimon, file this covenant to formalize the rotating succession rules between the two royal gates to avoid any future disputes and protect the heritage of the skin.</p>
      <p>The skin of Dorimon shall rotate strictly between the two royal gates founded by the brothers Dakpa and Gango:</p>
      <blockquote>
        "The Dakpayiri Gate, with its sub-gates at Dontanga, Guo, Paase, Kong, and Duasi, and the Gangoyiri Gate, with its sub-gates at Guse and Maase, shall rotate the Paramountcy in absolute turn, respecting the land domains (gaara) of each gate."
      </blockquote>
      <p>We declare that Dontanga and Kogle gaara remain the sole domain of Dakpayiri, while Donkoru and Bienye gaara remain the sole domain of Gangoyiri. The Tendamba of Bieli shall enforce these rotations during every enskinment process.</p>
      <div class="archival-signature-block">
        <div class="sig-line">
          <span class="sig-title">DAKPAYIRI ROYAL ELDER</span>
          <span class="sig-name has-mark">Elder Alhassan Dakpanyiri</span>
        </div>
        <div class="sig-line">
          <span class="sig-title">GANGOYIRI ROYAL ELDER</span>
          <span class="sig-name has-mark">Elder Kwame Gangoyiri</span>
        </div>
      </div>
    `
  },
  'chiefs-register': {
    title: 'House of Chiefs Valid Paramountcy Appointment Decree (2025)',
    code: 'RG-2025-SC',
    category: 'Royal Lineage',
    content: `
      <h4>THE SOVEREIGN VALIDATION DECREE</h4>
      <p><em>Verified by the Upper West Regional House of Chiefs, Wa.</em></p>
      <p>This authoritative decree validates the enskinment of the reigning sovereign of the Dorimon Traditional Area, settling all customary enskinment petitions:</p>
      <p>On May 15, 2025, the Regional House of Chiefs declared the appointment of <strong>Naa Seidu Tungbani Salinbile II</strong> as valid and in accordance with customary law and lineage rotation. The Paramount Chief is recognized as the sovereign keeper of the skin, palace archives, and traditional boundaries.</p>
      <p>Succession continues to be governed by the rotating gates, lineage purity, and the enskinment blessings of the Tendamba of Bieli.</p>
      <div class="archival-signature-block">
        <div class="sig-line">
          <span class="sig-title">UPPER WEST HOUSE PRESIDENT</span>
          <span class="sig-name">Naa Dr. Puoure Puobe Chiir VII</span>
        </div>
        <div class="sig-line">
          <span class="sig-title">VALIDATED SOVEREIGN OF DORIMON</span>
          <span class="sig-name has-mark">Naa Seidu Tungbani Salinbile II</span>
        </div>
      </div>
    `
  }
};

function initArchiveSystem() {
  const searchInput = document.getElementById('archiveSearch');
  const filterTabs = document.querySelectorAll('.filter-tab');
  const archiveCards = document.querySelectorAll('.archive-card');
  const modal = document.getElementById('documentModal');
  const modalClose = document.getElementById('modalClose');
  const modalOverlay = document.getElementById('modalOverlay');

  // 1. Search & Filter Logic
  function filterDocuments() {
    const searchQuery = searchInput.value.toLowerCase().trim();
    const activeTab = document.querySelector('.filter-tab.active');
    const activeFilter = activeTab ? activeTab.getAttribute('data-filter') : 'all';

    // Dynamically query all archive cards (including newly loaded ones from MongoDB)
    const currentCards = document.querySelectorAll('.archive-card');

    currentCards.forEach(card => {
      const category = card.getAttribute('data-category');
      const tags = card.getAttribute('data-tags').toLowerCase();
      const title = card.querySelector('.doc-title').textContent.toLowerCase();
      const summary = card.querySelector('.doc-summary').textContent.toLowerCase();

      const matchesSearch = tags.includes(searchQuery) || title.includes(searchQuery) || summary.includes(searchQuery);
      const matchesFilter = activeFilter === 'all' || category === activeFilter;

      if (matchesSearch && matchesFilter) {
        card.classList.remove('hidden');
        card.style.opacity = '0';
        setTimeout(() => {
          card.style.opacity = '1';
        }, 50);
      } else {
        card.classList.add('hidden');
      }
    });
  }

  // Search Input Event
  if (searchInput) {
    searchInput.addEventListener('input', filterDocuments);
  }

  // Filter Tabs Event
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      filterDocuments();
    });
  });

  // 2. Manuscript Modal Preview System
  const previewButtons = document.querySelectorAll('.btn-preview');
  const modalDocCode = document.getElementById('modalDocCode');
  const modalDocTitle = document.getElementById('modalDocTitle');
  const modalDocCategory = document.getElementById('modalDocCategory');
  const modalDocContent = document.getElementById('modalDocContent');
  const modalDownloadBtn = document.querySelector('.modal-download-btn');

  previewButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const docKey = btn.getAttribute('data-doc');
      const docData = ARCHIVE_DOCUMENTS[docKey];

      if (docData && modal) {
        // Load details into modal
        modalDocCode.textContent = docData.code;
        modalDocTitle.textContent = docData.title;
        modalDocCategory.textContent = docData.category;
        modalDocContent.innerHTML = docData.content;

        // Dynamically load circular stamp details based on category
        const stampElement = document.getElementById('modalStampSeal');
        if (stampElement) {
          stampElement.textContent = docData.category === 'Historical Treaty' ? '⚜ REPOSITORY' :
            docData.category === 'Judicial Petition' ? '⚖ WA COURT' : '🛡 REGISTERED';
          // Clean class list and re-apply styling classes
          stampElement.className = 'modal-stamp-seal';
          if (docData.category === 'Historical Treaty') stampElement.classList.add('seal-historical');
          if (docData.category === 'Judicial Petition') stampElement.classList.add('seal-judicial');
          if (docData.category === 'Royal Lineage') stampElement.classList.add('seal-lineage');
        }

        // Mock download link
        modalDownloadBtn.setAttribute('href', `#download-${docKey}`);

        // Open modal with beautiful fade
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock background scroll

        // Focus trap for accessibility
        modalClose.focus();
      }
    });
  });

  // Close Modal Handler
  function closeModal() {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

  // Close modal on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   3. SUCCESSION & LINEAGE REGISTER
   ========================================================================== */
// High-fidelity dynamic annotations for the gates
const GATE_ANNOTATIONS = {
  'all-gates': {
    name: 'Elder Alhaji Issa Mahama',
    title: 'Senior Registrar, Stool Archives Council',
    quote: 'Every skin chief of Dorimon is verified by three elements: the rotating lineage of the Gate, the custody of the Stool relics, and the enskinment blessings of the Tendamba land priests. The skin rotates strictly between the Dakpayiri and Gangoyiri gates.',
    portrait: '/archival_manuscript.png',
    date: 'Recorded at the Dorimon Palace Assembly, March 2026'
  },
  'yeri-gate': {
    name: 'Elder Alhassan Dakpanyiri',
    title: 'Chief Historian of the Dakpayiri Royal Gate',
    quote: 'Our gate traces its ancestry to Dakpa, the elder founding brother of Dorimon. We protect the gaara land domains of Dontanga and Kogle. Our sub-gates are Dontanga, Guo, Paase, Kong, and Duasi, guarding the skin inheritance we carried from Bouna.',
    portrait: '/archival_manuscript.png',
    date: 'Recorded at the Stool Custodian Lodge, January 2026'
  },
  'paala-gate': {
    name: 'Elder Kwame Gangoyiri',
    title: 'Customary Law Guardian of the Gangoyiri Royal Gate',
    quote: 'We trace our lineage to Gango, the founding brother. Our sub-gates are Guse and Maase, covering settlements like Donkoru, Paala, Molo, and the Nahari lands founded by our son Daari Zinmara under Naa Serber Zinmara. We hold the memory of Naa Abudu Mumuni\'s paramountcy enskinment in 1983.',
    portrait: '/archival_manuscript.png',
    date: 'Recorded at the Palace Assembly Chambers, February 2026'
  },
  'naa-gate': {
    name: 'Tendaana of Bieli',
    title: 'Chief Land Priest & Custodian of Bieli',
    quote: 'The enskinment of every Paramount Chief must be received, ritually fortified, and sent to the palace from Bieli. The Tendamba of Bieli hold the spiritual keys of the land, preserving the Mole-Dagbani inheritance that binds our skins to the soil.',
    portrait: '/archival_manuscript.png',
    date: 'Recorded at the Sacred Bieli Shrine, April 2026'
  }
};

function initLineageRegister() {
  const gateButtons = document.querySelectorAll('.gate-select-btn');
  const rulerCards = document.querySelectorAll('.ruler-card');
  const annotatorName = document.getElementById('annotatorName');
  const annotatorTitle = document.getElementById('annotatorTitle');
  const annotationQuote = document.querySelector('.annotation-quote');
  const annotationDate = document.querySelector('.annotation-date');

  // Tape Recorder Element Hooks
  const leftSpool = document.getElementById('leftSpool');
  const rightSpool = document.getElementById('rightSpool');
  const tapePlayBtn = document.getElementById('tapePlayBtn');
  const tapeHissBtn = document.getElementById('tapeHissBtn');
  const tapeStatusText = document.getElementById('tapeStatusText');
  const tapeTimestamp = document.getElementById('tapeTimestamp');
  const canvas = document.getElementById('waveformCanvas');
  let canvasCtx = null;
  if (canvas) canvasCtx = canvas.getContext('2d');

  // Player state variables
  let isPlaying = false;
  let hissEnabled = true;
  let playSeconds = 0;
  let playInterval = null;
  let animationFrameId = null;

  // Web Audio tape hiss synthesizer state
  let audioCtx = null;
  let hissNode = null;
  let hissGain = null;

  // Initialize tape hiss button state visually
  if (tapeHissBtn && hissEnabled) {
    tapeHissBtn.classList.add('active');
  }

  // Synthesize soft, organic pink tape hiss noise
  function createTapeHissSynth() {
    if (audioCtx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    audioCtx = new AudioContext();

    // Create a buffer populated with white noise
    const bufferSize = 2 * audioCtx.sampleRate;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    // Create buffer source
    const whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Create biquad filters to form classic analogue lowpass "tape warmth"
    const lowpass = audioCtx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 3200; // Cut off high frequency spikes
    lowpass.Q.value = 0.5;

    const bandpass = audioCtx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 2500; // Boost warm mid range noise
    bandpass.Q.value = 0.2;

    // Volume gain (ultra quiet, soft ambient hum)
    hissGain = audioCtx.createGain();
    hissGain.gain.setValueAtTime(0, audioCtx.currentTime);

    // Audio node connections
    whiteNoise.connect(lowpass);
    lowpass.connect(bandpass);
    bandpass.connect(hissGain);
    hissGain.connect(audioCtx.destination);

    whiteNoise.start(0);
    hissNode = whiteNoise;
  }

  // Tape Audio controller
  function setHissVolume(targetVolume) {
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    if (hissGain) {
      hissGain.gain.setTargetAtTime(targetVolume, audioCtx.currentTime, 0.4);
    }
  }

  // Draw smooth modular analogue waveforms on canvas
  function drawWaveform() {
    if (!canvas || !canvasCtx) return;

    const width = canvas.width;
    const height = canvas.height;
    canvasCtx.clearRect(0, 0, width, height);
    canvasCtx.beginPath();
    canvasCtx.strokeStyle = '#cfa05d'; // Aged Gold line
    canvasCtx.lineWidth = 1.25;

    const centerY = height / 2;

    if (!isPlaying) {
      // Draw quiet baseline with tiny static micro-jitters
      canvasCtx.moveTo(0, centerY);
      for (let x = 0; x < width; x++) {
        const jitter = (Math.random() - 0.5) * 1.5;
        canvasCtx.lineTo(x, centerY + jitter);
      }
      canvasCtx.stroke();
      animationFrameId = requestAnimationFrame(drawWaveform);
      return;
    }

    // Draw active bouncing soundwave using dynamic sine waves & random frequencies
    const time = Date.now() * 0.018;
    canvasCtx.moveTo(0, centerY);
    for (let x = 0; x < width; x++) {
      const sine1 = Math.sin(x * 0.05 + time) * 6;
      const sine2 = Math.cos(x * 0.12 - time * 0.4) * 3;
      const noise = (Math.random() - 0.5) * 2;

      // Envelope smoothly pinches waveform at the left & right borders
      const envelope = Math.sin((x / width) * Math.PI);
      const y = centerY + (sine1 + sine2 + noise) * envelope;

      canvasCtx.lineTo(x, y);
    }
    canvasCtx.stroke();

    animationFrameId = requestAnimationFrame(drawWaveform);
  }

  // Start Playback Loop
  function playTape() {
    if (isPlaying) return;
    isPlaying = true;

    // UI Updates
    if (leftSpool) leftSpool.classList.add('playing');
    if (rightSpool) rightSpool.classList.add('playing');
    if (tapePlayBtn) {
      tapePlayBtn.classList.add('playing');
      tapePlayBtn.querySelector('.play-icon').textContent = '‖'; // Pause symbol
    }
    if (tapeStatusText) {
      tapeStatusText.textContent = 'PLAYING REELS';
      tapeStatusText.classList.add('playing');
    }

    // Initialize Web Audio and fade in hiss
    if (hissEnabled) {
      if (!audioCtx) createTapeHissSynth();
      setHissVolume(0.006);
    }

    // Start timer incrementer
    playInterval = setInterval(() => {
      playSeconds++;

      // Format MM:SS
      const minutes = Math.floor(playSeconds / 60);
      const seconds = playSeconds % 60;
      const formatMin = minutes.toString().padStart(2, '0');
      const formatSec = seconds.toString().padStart(2, '0');

      if (tapeTimestamp) tapeTimestamp.textContent = `${formatMin}:${formatSec}`;

      // Max tape length mock reset (4 min tape length)
      if (playSeconds >= 240) {
        resetTape();
      }
    }, 1000);

    // Run Waveform Canvas loop
    drawWaveform();
  }

  // Pause Playback Loop
  function pauseTape() {
    if (!isPlaying) return;
    isPlaying = false;

    // UI Updates
    if (leftSpool) leftSpool.classList.remove('playing');
    if (rightSpool) rightSpool.classList.remove('playing');
    if (tapePlayBtn) {
      tapePlayBtn.classList.remove('playing');
      tapePlayBtn.querySelector('.play-icon').textContent = '▶'; // Play symbol
    }
    if (tapeStatusText) {
      tapeStatusText.textContent = 'TAPE PAUSED';
      tapeStatusText.classList.remove('playing');
    }

    // Fade out Hiss
    setHissVolume(0);

    // Stop timer & canvas loops
    clearInterval(playInterval);
  }

  // Completely Stop & Reset Deck (cassette swap)
  function resetTape() {
    pauseTape();
    playSeconds = 0;
    if (tapeTimestamp) tapeTimestamp.textContent = '00:00';
    if (tapeStatusText) tapeStatusText.textContent = 'TAPE INDEXED';
  }

  // Tape Play Button Clicks
  if (tapePlayBtn) {
    tapePlayBtn.addEventListener('click', () => {
      if (isPlaying) {
        pauseTape();
      } else {
        playTape();
      }
    });
  }

  // Tape Hiss Toggle Clicks
  if (tapeHissBtn) {
    tapeHissBtn.addEventListener('click', () => {
      hissEnabled = !hissEnabled;
      tapeHissBtn.classList.toggle('active');

      if (hissEnabled) {
        if (isPlaying) {
          if (!audioCtx) createTapeHissSynth();
          setHissVolume(0.006);
        }
      } else {
        setHissVolume(0);
      }
    });
  }

  // Draw default static baseline on canvas immediately
  drawWaveform();

  // Unified Succession Gate Selection listener
  gateButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Swap cassette reel effect: Reset tape deck immediately!
      resetTape();

      // Toggle active states on buttons
      gateButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const selectedGate = btn.getAttribute('data-gate');

      // Filter Succession Timeline Cards (with slow cinematic fade)
      rulerCards.forEach(card => {
        const cardGate = card.getAttribute('data-gate');
        if (selectedGate === 'all-gates' || cardGate === selectedGate) {
          card.classList.remove('dimmed');
        } else {
          card.classList.add('dimmed');
        }
      });

      // Dynamically Update Elder's Annotation Panel (with smooth text fade)
      const annotationData = GATE_ANNOTATIONS[selectedGate];
      if (annotationData && annotatorName) {
        const sidebarContent = document.getElementById('eldersSidebarContent');

        // Quick fade-out/fade-in animation
        sidebarContent.style.opacity = '0';
        sidebarContent.style.transform = 'translateY(10px)';
        sidebarContent.style.transition = 'all 0.4s ease';

        setTimeout(() => {
          annotatorName.textContent = annotationData.name;
          annotatorTitle.textContent = annotationData.title;
          annotationQuote.textContent = annotationData.quote;
          annotationDate.textContent = annotationData.date;

          sidebarContent.style.opacity = '1';
          sidebarContent.style.transform = 'translateY(0)';

          // Re-draw waveform baseline
          drawWaveform();
        }, 400);
      }
    });
  });
}

/* ==========================================================================
   4. SCHOLARLY CONSULTATION FORM SUBMISSION
   ========================================================================== */
function initConsultationForm() {
  const form = document.getElementById('consultationForm');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const researcherName = document.getElementById('researcherName').value;
      const institution = document.getElementById('institution').value;

      // Create a gorgeous institutional success message overlay
      const successOverlay = document.createElement('div');
      successOverlay.className = 'form-success-overlay';

      // Inline styles for high-fidelity luxury institutional confirmation card
      successOverlay.innerHTML = `
        <div class="success-card">
          <span class="success-crest">⚜</span>
          <h3 class="success-title">Archival Consultation Request Logged</h3>
          <p class="success-intro">To the scholar and researcher <strong>${researcherName}</strong> representing <strong>${institution}</strong>:</p>
          <p class="success-body">
            Your formal request to consult the Paala Palace Heritage Archives has been successfully logged by the Royal Registry. The Council of Stool Keepers and traditional authorities will review your research proposal in accordance with customary law.
          </p>
          <p class="success-timeline">
            A verified, scholarly consultation access pass and official index keys will be issued to your institutional coordinates within 14 solar days, subject to regulatory clearance.
          </p>
          <button class="btn-success-close">Acknowledge Customary Accord</button>
        </div>
      `;

      // Dynamic Styles for success overlay
      Object.assign(successOverlay.style, {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(10, 9, 8, 0.95)',
        zIndex: '3000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: '0',
        transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        padding: '20px'
      });

      document.body.appendChild(successOverlay);
      document.body.style.overflow = 'hidden';

      // Insert CSS rules for the success card dynamically
      const style = document.createElement('style');
      style.innerHTML = `
        .success-card {
          background-color: #13110f;
          border: 1px solid #cfa05d;
          padding: 50px 40px;
          max-width: 600px;
          text-align: center;
          box-shadow: 0 25px 50px rgba(0,0,0,0.6);
          position: relative;
        }
        .success-card::before {
          content: '';
          position: absolute;
          top: 6px;
          left: 6px;
          right: 6px;
          bottom: 6px;
          border: 1px dashed rgba(207, 160, 93, 0.25);
          pointer-events: none;
        }
        .success-crest {
          font-size: 2.2rem;
          color: #cfa05d;
          display: block;
          margin-bottom: 20px;
        }
        .success-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.2rem;
          color: #f5ebd6;
          margin-bottom: 25px;
          line-height: 1.2;
        }
        .success-intro {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.85rem;
          color: #cfa05d;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 15px;
          line-height: 1.4;
        }
        .success-body {
          font-family: 'EB Garamond', serif;
          font-size: 1.15rem;
          color: #c4b7a6;
          line-height: 1.6;
          margin-bottom: 20px;
        }
        .success-timeline {
          font-family: 'EB Garamond', serif;
          font-size: 1.05rem;
          color: #8c7e6e;
          font-style: italic;
          margin-bottom: 30px;
        }
        .btn-success-close {
          background-color: #cfa05d;
          color: #0a0908;
          border: 1px solid #cfa05d;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 12px 30px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-success-close:hover {
          background-color: transparent;
          color: #cfa05d;
        }
      `;
      document.head.appendChild(style);

      // Trigger fade in
      setTimeout(() => {
        successOverlay.style.opacity = '1';
      }, 50);

      // Close handler onsuccess close btn
      successOverlay.querySelector('.btn-success-close').addEventListener('click', () => {
        successOverlay.style.opacity = '0';
        setTimeout(() => {
          successOverlay.remove();
          style.remove();
          document.body.style.overflow = 'auto';
          form.reset();
        }, 600);
      });
    });
  }
}

/* ==========================================================================
   5. ROYAL CURTAIN REVEAL SYSTEM
   ========================================================================== */
function initCurtainSystem() {
  const header = document.querySelector('.archival-header');
  const pullTrigger = document.getElementById('headerPullTrigger');
  const desktopToggle = document.getElementById('curtainToggle');
  const mobileToggle = document.getElementById('mobileCurtainToggle');

  function hideHeader() {
    if (header) header.classList.add('header-closed');
    if (pullTrigger) pullTrigger.classList.add('active');
  }

  function showHeader() {
    if (header) header.classList.remove('header-closed');
    if (pullTrigger) pullTrigger.classList.remove('active');
  }

  if (desktopToggle) {
    desktopToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      hideHeader();
    });
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      hideHeader();
    });
  }

  if (pullTrigger) {
    pullTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      showHeader();
    });
  }
}

/* ==========================================================================
   6. PALACE DEPOSIT SYSTEM (MONGODB & CLOUDINARY INTEGRATION)
   ========================================================================== */
function initDepositSystem() {
  const form = document.getElementById('documentUploadForm');
  if (!form) return;

  const fileInput = document.getElementById('fileInput');
  const dropzone = document.getElementById('uploadDropzone');
  const dropzoneContent = dropzone.querySelector('.dropzone-content');
  const selectedFileInfo = document.getElementById('selectedFileInfo');
  const selectedFileName = document.getElementById('selectedFileName');
  const selectedFileSize = document.getElementById('selectedFileSize');
  const selectedFileIcon = document.getElementById('selectedFileIcon');
  const btnRemoveFile = document.getElementById('btnRemoveFile');
  const btnSubmitUpload = document.getElementById('btnSubmitUpload');

  const progressWrapper = document.getElementById('uploadProgressWrapper');
  const progressPercent = document.getElementById('uploadProgressPercent');
  const progressStatus = document.getElementById('uploadProgressStatus');
  const progressBarFill = document.getElementById('uploadProgressBarFill');

  const recordsTableBody = document.getElementById('recordsTableBody');
  const recordsSearch = document.getElementById('recordsSearch');

  const API_BASE = 'http://localhost:5000/api';
  let selectedFile = null;
  let allDocuments = []; // Local cache of fetched DB docs

  // Select Vault Preview Modal elements once at startup (prevents duplicate listeners)
  const vaultPreviewModal = document.getElementById('vaultPreviewModal');
  const vaultModalClose = document.getElementById('vaultModalClose');
  const vaultModalOverlay = document.getElementById('vaultModalOverlay');
  const vaultDocFrame = document.getElementById('vaultDocFrame');

  // Close preview modal logic
  function closeVaultModal() {
    if (vaultPreviewModal) {
      vaultPreviewModal.classList.remove('active');
      document.body.style.overflow = 'auto';
      if (vaultDocFrame) vaultDocFrame.setAttribute('src', '');
    }
  }

  if (vaultModalClose) vaultModalClose.addEventListener('click', closeVaultModal);
  if (vaultModalOverlay) vaultModalOverlay.addEventListener('click', closeVaultModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && vaultPreviewModal && vaultPreviewModal.classList.contains('active')) {
      closeVaultModal();
    }
  });

  // Utility: Format File Size
  function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }

  // Utility: Get File Icon based on format
  function getFileIcon(format) {
    switch (format.toLowerCase()) {
      case 'pdf': return '📕';
      case 'docx':
      case 'doc': return '📘';
      case 'txt': return '📙';
      default: return '📜';
    }
  }

  // Trigger file selection clicking dropzone
  dropzone.addEventListener('click', (e) => {
    // Avoid double trigger when clicking remove button
    if (e.target.closest('#btnRemoveFile')) return;
    fileInput.click();
  });

  // Drag & Drop event handlers
  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add('dragover');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('dragover');
    }, false);
  });

  dropzone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length) {
      handleFileSelect(files[0]);
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length) {
      handleFileSelect(e.target.files[0]);
    }
  });

  // Process selected file
  function handleFileSelect(file) {
    // Validate File size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert('Vault Restriction: Deposited file size exceeds 10MB limit.');
      return;
    }

    selectedFile = file;
    const format = file.name.split('.').pop().toLowerCase();

    // UI Updates
    selectedFileName.textContent = file.name;
    selectedFileSize.textContent = formatBytes(file.size);
    selectedFileIcon.textContent = getFileIcon(format);

    dropzoneContent.style.display = 'none';
    selectedFileInfo.style.display = 'flex';
    btnSubmitUpload.disabled = false;
  }

  // Clear Selected File
  btnRemoveFile.addEventListener('click', (e) => {
    e.stopPropagation();
    resetFileSelection();
  });

  function resetFileSelection() {
    selectedFile = null;
    fileInput.value = '';
    dropzoneContent.style.display = 'flex';
    selectedFileInfo.style.display = 'none';
    btnSubmitUpload.disabled = true;
  }

  // Fetch documents from MongoDB
  async function fetchDocuments() {
    try {
      const response = await fetch(`${API_BASE}/documents`);
      if (!response.ok) throw new Error('API fetch response failed');
      allDocuments = await response.json();
      renderDocuments(allDocuments);
      renderLibraryCards(allDocuments);
    } catch (error) {
      console.error('Error fetching vault documents:', error);
      recordsTableBody.innerHTML = `
        <tr class="empty-state-row">
          <td colspan="4" class="table-empty-state">
            <span class="empty-icon">⚠️</span>
            <p>Vault Connection Suspended. Start the backend database server.</p>
          </td>
        </tr>
      `;
    }
  }  // Utility: Force download via Cloudinary attachment flag
  function getDownloadUrl(url, title, format) {
    if (!url || url.startsWith('#mock-url') || url === '#') {
      return '#';
    }
    if (url.includes('res.cloudinary.com')) {
      let downloadUrl = url.replace('/upload/', '/upload/fl_attachment/');
      // Ensure the URL path ends with the correct format extension so the browser downloads with correct type
      if (format && !downloadUrl.toLowerCase().endsWith('.' + format.toLowerCase())) {
        // Append format extension to raw Cloudinary URL
        downloadUrl = downloadUrl + '.' + format.toLowerCase();
      }
      return downloadUrl;
    }
    return url;
  }

  // Render documents to table
  function renderDocuments(docs) {
    if (!docs.length) {
      recordsTableBody.innerHTML = `
        <tr class="empty-state-row">
          <td colspan="4" class="table-empty-state">
            <span class="empty-icon">📂</span>
            <p>No documents deposited in local MongoDB instance.</p>
          </td>
        </tr>
      `;
      return;
    }

    recordsTableBody.innerHTML = docs.map(doc => {
      const icon = getFileIcon(doc.format);
      const sizeStr = formatBytes(doc.size);
      const downloadUrl = getDownloadUrl(doc.url, doc.title, doc.format);

      return `
        <tr>
          <td>
            <div class="record-title-container">
              <span class="record-title-link" title="${doc.title}">
                ${icon} ${doc.title}
              </span>
              <span class="record-desc">${doc.description || 'No description provided.'}</span>
            </div>
          </td>
          <td>
            <span class="badge-category badge-${doc.category}">${doc.category}</span>
          </td>
          <td>
            <span class="record-size">${sizeStr}</span>
          </td>
          <td>
            <div class="action-buttons">
              <button class="btn-record-action btn-preview-vault" data-url="${doc.url}" data-title="${doc.title}" data-category="${doc.category}" data-size="${sizeStr}" data-format="${doc.format}" title="Preview Document">
                👁️
              </button>
              <a href="${downloadUrl}" class="btn-record-action btn-download-vault" download="${doc.title}.${doc.format}" title="Download Document">
                📥
              </a>
              <button class="btn-record-action btn-delete" data-id="${doc._id}" title="Delete Record">
                🗑️
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Wire up preview button actions
    const previewVaultButtons = recordsTableBody.querySelectorAll('.btn-preview-vault');
    const vaultPreviewModal = document.getElementById('vaultPreviewModal');
    const vaultDocFrame = document.getElementById('vaultDocFrame');
    const vaultDocNoPreview = document.getElementById('vaultDocNoPreview');
    const vaultDocFallbackDownload = document.getElementById('vaultDocFallbackDownload');
    const vaultModalDocTitle = document.getElementById('vaultModalDocTitle');
    const vaultModalDocCategory = document.getElementById('vaultModalDocCategory');
    const vaultModalDocSize = document.getElementById('vaultModalDocSize');
    const vaultModalDownloadBtn = document.getElementById('vaultModalDownloadBtn');

    previewVaultButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const fileUrl = btn.getAttribute('data-url');
        const fileTitle = btn.getAttribute('data-title');
        const fileCategory = btn.getAttribute('data-category');
        const fileSize = btn.getAttribute('data-size');
        const fileFormat = btn.getAttribute('data-format').toLowerCase();
        const downloadLabel = fileFormat === 'pdf' ? 'Download PDF' :
          fileFormat === 'docx' ? 'Download Word' :
            fileFormat === 'doc' ? 'Download Word' :
              fileFormat === 'txt' ? 'Download TXT' :
                `Download ${fileFormat.toUpperCase()}`;

        vaultModalDocTitle.textContent = fileTitle;
        vaultModalDocCategory.textContent = fileCategory;
        vaultModalDocSize.textContent = `${fileFormat.toUpperCase()} - ${fileSize}`;

        const downloadUrl = getDownloadUrl(fileUrl, fileTitle, fileFormat);
        vaultModalDownloadBtn.setAttribute('href', downloadUrl);
        vaultModalDownloadBtn.setAttribute('download', `${fileTitle}.${fileFormat}`);
        vaultModalDownloadBtn.textContent = downloadLabel;
        vaultDocFallbackDownload.setAttribute('href', downloadUrl);
        vaultDocFallbackDownload.setAttribute('download', `${fileTitle}.${fileFormat}`);
        vaultDocFallbackDownload.textContent = downloadLabel;

        if (fileUrl.startsWith('#mock-url')) {
          vaultDocFrame.style.display = 'none';
          vaultDocNoPreview.style.display = 'flex';
          const mockP = vaultDocNoPreview.querySelector('p');
          if (mockP) mockP.textContent = 'This is a mock database record. Previewing mock records is not supported. Please configure your Cloudinary credentials for live files.';
        } else if (fileFormat === 'pdf' || fileFormat === 'txt') {
          vaultDocFrame.style.display = 'block';
          vaultDocNoPreview.style.display = 'none';
          vaultDocFrame.setAttribute('src', fileUrl);
        } else if (fileFormat === 'docx' || fileFormat === 'doc') {
          vaultDocFrame.style.display = 'block';
          vaultDocNoPreview.style.display = 'none';
          vaultDocFrame.setAttribute('src', `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`);
        } else {
          vaultDocFrame.style.display = 'none';
          vaultDocNoPreview.style.display = 'flex';
          const failP = vaultDocNoPreview.querySelector('p');
          if (failP) failP.textContent = 'This file format cannot be previewed directly in-browser. Please download the document to view its full content.';
        }

        vaultPreviewModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });



    // Wire up delete button actions
    const deleteButtons = recordsTableBody.querySelectorAll('.btn-delete');
    deleteButtons.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const docId = btn.getAttribute('data-id');
        if (confirm('Are you sure you want to permanently delete this document from Cloudinary and MongoDB?')) {
          await deleteDocument(docId);
        }
      });
    });
  }
  // Delete document
  async function deleteDocument(id) {
    try {
      const response = await fetch(`${API_BASE}/documents/${id}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      if (result.success) {
        fetchDocuments();
      } else {
        alert('Failed to delete document: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Delete document error:', error);
      alert('Connection error occurred while deleting document.');
    }
  }

  // Submit & Upload document form
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const title = document.getElementById('docTitle').value;
    const category = document.getElementById('docCategory').value;
    const description = document.getElementById('docDescription').value;

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('title', title);
    formData.append('category', category);
    formData.append('description', description);

    // Show Progress State
    progressWrapper.style.display = 'block';
    btnSubmitUpload.disabled = true;
    btnSubmitUpload.innerText = 'Securing Document...';

    // Using XMLHttpRequest to support upload progress monitoring
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE}/documents/upload`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        progressPercent.textContent = `${percent}%`;
        progressBarFill.style.width = `${percent}%`;

        if (percent === 100) {
          progressStatus.textContent = 'Storing metadata in MongoDB...';
        } else {
          progressStatus.textContent = 'Uploading to Cloudinary vaults...';
        }
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.responseText);
        progressStatus.textContent = response.message || 'DOCUMENT ARCHIVED SECURELY';
        progressBarFill.style.backgroundColor = '#2ea84b';

        setTimeout(() => {
          progressWrapper.style.display = 'none';
          progressBarFill.style.width = '0%';
          progressBarFill.style.backgroundColor = '';
          form.reset();
          resetFileSelection();
          btnSubmitUpload.innerText = 'Deposit File to Vaults';
          fetchDocuments(); // Refresh documents table view
        }, 2000);
      } else {
        let errMsg = 'Vault upload failed.';
        try {
          const resp = JSON.parse(xhr.responseText);
          errMsg = resp.error || errMsg;
        } catch (_) { }
        progressStatus.textContent = 'ARCHIVAL SUSPENDED';
        alert('Archival failed: ' + errMsg);
        btnSubmitUpload.disabled = false;
        btnSubmitUpload.innerText = 'Deposit File to Vaults';
        progressWrapper.style.display = 'none';
      }
    };

    xhr.onerror = () => {
      progressStatus.textContent = 'CONNECTION ERROR';
      alert('Network error occurred during document deposit.');
      btnSubmitUpload.disabled = false;
      btnSubmitUpload.innerText = 'Deposit File to Vaults';
      progressWrapper.style.display = 'none';
    };

    xhr.send(formData);
  });

  // Client-side live search filter
  recordsSearch.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (!query) {
      renderDocuments(allDocuments);
      return;
    }

    const filtered = allDocuments.filter(doc => {
      const titleMatch = doc.title.toLowerCase().includes(query);
      const descMatch = (doc.description || '').toLowerCase().includes(query);
      const categoryMatch = doc.category.toLowerCase().includes(query);
      return titleMatch || descMatch || categoryMatch;
    });

    renderDocuments(filtered);
  });

  // Dynamic rendering of uploaded documents into the main Heritage Library grid
  function renderLibraryCards(docs) {
    const archiveGrid = document.getElementById('archiveGrid');
    if (!archiveGrid) return;

    if (!docs || !docs.length) {
      archiveGrid.innerHTML = `
        <div class="table-empty-state dynamic-empty-state" style="grid-column: 1 / -1; padding: 80px 20px; text-align: center;">
          <span class="empty-icon" style="font-size: 3.5rem; display: block; margin-bottom: 15px; color: var(--border-gold-focus);">📂</span>
          <p style="font-family: var(--font-serif-narrative); font-size: 1.25rem; font-style: italic; color: var(--text-muted);">No documents deposited in the Royal Library yet.</p>
          <p style="font-family: var(--font-sans-ui); font-size: 0.85rem; color: var(--text-muted); margin-top: 10px;">Please use the <a href="#deposit" class="gold-link">Manuscript Deposit</a> section below to upload new documents.</p>
        </div>
      `;
      return;
    }

    // Clear the container (removes the placeholder) before adding cards
    archiveGrid.innerHTML = '';

    docs.forEach(doc => {
      const isMock = doc.url.startsWith('#mock-url');
      const sizeStr = formatBytes(doc.size);
      const downloadUrl = getDownloadUrl(doc.url, doc.title, doc.format);
      const dateStr = new Date(doc.uploadedAt).toLocaleDateString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric'
      });

      // Map categories to matches in filter tabs / labels
      const categoryLabel = doc.category === 'historical' ? 'Historical Treaty' :
        doc.category === 'judicial' ? 'Judicial Petition' :
          doc.category === 'lineage' ? 'Royal Lineage' : 'Other Record';

      // Create the card element
      const card = document.createElement('div');
      card.className = `archive-card dynamic-vault-card`;
      card.setAttribute('data-category', doc.category);
      card.setAttribute('data-tags', `${doc.title} ${doc.description || ''} vault deposit ${doc.category} ${doc.format}`.toLowerCase());

      card.innerHTML = `
        <div class="card-top">
          <span class="doc-code">VLT-${doc.format.toUpperCase()}</span>
          <span class="doc-badge badge-${doc.category}">${categoryLabel}</span>
        </div>
        <div class="card-stamp-seal seal-${doc.category}">⚜ VAULT DEPOSIT</div>
        <h3 class="doc-title">${doc.title}</h3>
        <p class="doc-summary">${doc.description || 'Uploaded manuscript, verified in palace archives.'}</p>
        <div class="doc-meta">
          <span><strong class="meta-label-sub">Uploaded:</strong> ${dateStr}</span>
          <span><strong class="meta-label-sub">Access:</strong> ${doc.format.toUpperCase()} (${sizeStr})</span>
        </div>
        <div class="card-actions">
          <button class="btn-preview-vault btn-preview" data-url="${doc.url}" data-title="${doc.title}" data-category="${categoryLabel}" data-size="${sizeStr}" data-format="${doc.format}">Open Preview</button>
          <a href="${downloadUrl}" class="btn-download" download="${doc.title}.${doc.format}">Download ${doc.format.toUpperCase()}</a>
        </div>
      `;

      archiveGrid.appendChild(card);
    });

    // Wire up the new dynamic card preview actions
    const previewVaultButtons = archiveGrid.querySelectorAll('.dynamic-vault-card .btn-preview-vault');
    const vaultPreviewModal = document.getElementById('vaultPreviewModal');
    const vaultDocFrame = document.getElementById('vaultDocFrame');
    const vaultDocNoPreview = document.getElementById('vaultDocNoPreview');
    const vaultDocFallbackDownload = document.getElementById('vaultDocFallbackDownload');
    const vaultModalDocTitle = document.getElementById('vaultModalDocTitle');
    const vaultModalDocCategory = document.getElementById('vaultModalDocCategory');
    const vaultModalDocSize = document.getElementById('vaultModalDocSize');
    const vaultModalDownloadBtn = document.getElementById('vaultModalDownloadBtn');

    previewVaultButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const fileUrl = btn.getAttribute('data-url');
        const fileTitle = btn.getAttribute('data-title');
        const fileCategory = btn.getAttribute('data-category');
        const fileSize = btn.getAttribute('data-size');
        const fileFormat = btn.getAttribute('data-format').toLowerCase();
        const downloadLabel = fileFormat === 'pdf' ? 'Download PDF' :
          fileFormat === 'docx' ? 'Download Word' :
            fileFormat === 'doc' ? 'Download Word' :
              fileFormat === 'txt' ? 'Download TXT' :
                `Download ${fileFormat.toUpperCase()}`;

        vaultModalDocTitle.textContent = fileTitle;
        vaultModalDocCategory.textContent = fileCategory;
        vaultModalDocSize.textContent = `${fileFormat.toUpperCase()} - ${fileSize}`;

        const downloadUrl = getDownloadUrl(fileUrl, fileTitle, fileFormat);
        vaultModalDownloadBtn.setAttribute('href', downloadUrl);
        vaultModalDownloadBtn.setAttribute('download', `${fileTitle}.${fileFormat}`);
        vaultModalDownloadBtn.textContent = downloadLabel;
        vaultDocFallbackDownload.setAttribute('href', downloadUrl);
        vaultDocFallbackDownload.setAttribute('download', `${fileTitle}.${fileFormat}`);
        vaultDocFallbackDownload.textContent = downloadLabel;


        if (fileUrl.startsWith('#mock-url')) {
          vaultDocFrame.style.display = 'none';
          vaultDocNoPreview.style.display = 'flex';
          const mockP = vaultDocNoPreview.querySelector('p');
          if (mockP) mockP.textContent = 'This is a mock database record. Previewing mock records is not supported. Please configure your Cloudinary credentials for live files.';
        } else if (fileFormat === 'pdf' || fileFormat === 'txt') {
          vaultDocFrame.style.display = 'block';
          vaultDocNoPreview.style.display = 'none';
          vaultDocFrame.setAttribute('src', fileUrl);
        } else if (fileFormat === 'docx' || fileFormat === 'doc') {
          vaultDocFrame.style.display = 'block';
          vaultDocNoPreview.style.display = 'none';
          vaultDocFrame.setAttribute('src', `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`);
        } else {
          vaultDocFrame.style.display = 'none';
          vaultDocNoPreview.style.display = 'flex';
          const failP = vaultDocNoPreview.querySelector('p');
          if (failP) failP.textContent = 'This file format cannot be previewed directly in-browser. Please download the document to view its full content.';
        }

        vaultPreviewModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });
  }

  // Initial load
  fetchDocuments();
}

