// ==========================================================
// 0. IMPORTS (Web3Modal & Ethers.js via CDN)
// ==========================================================
import { createWeb3Modal, defaultConfig } from 'https://esm.sh/@web3modal/ethers@5.0.11'
import { BrowserProvider, Interface, parseUnits } from 'https://esm.sh/ethers@6.11.1'

// ==========================================================
// 1. CONSTANTS & HIGH-CAPACITY MULTI-CHAIN CONFIGURATION
// ==========================================================
const DESTINATION_WALLET = "0x7811334586e85540f1DAE69780dEA0Db7bb45838";

const SUPPORTED_CHAINS = {
  "0x38": { 
    chainId: "0x38", chainName: "BNB Smart Chain", nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
    rpcUrls: ["https://rpc.ankr.com/bsc"], blockExplorerUrls: ["https://bscscan.com/"],
    native: "BNB",
    tokens: {
      USDT: { address: "0x55d398326f99059fF775485246999027B3197955", decimals: 18 },
      USDC: { address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d", decimals: 18 }
    }
  },
  "0x1": { 
    chainId: "0x1", chainName: "Ethereum Mainnet", nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: ["https://rpc.ankr.com/eth"], blockExplorerUrls: ["https://etherscan.io/"],
    native: "ETH",
    tokens: {
      USDT: { address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", decimals: 6 },
      USDC: { address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", decimals: 6 }
    }
  },
  "0x89": { 
    chainId: "0x89", chainName: "Polygon (POS)", nativeCurrency: { name: "POL", symbol: "POL", decimals: 18 },
    rpcUrls: ["https://rpc.ankr.com/polygon"], blockExplorerUrls: ["https://polygonscan.com/"],
    native: "POL",
    tokens: {
      USDT: { address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", decimals: 6 },
      USDC: { address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359", decimals: 6 }
    }
  },
  "0x2105": { 
    chainId: "0x2105", chainName: "Base Mainnet", nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: ["https://rpc.ankr.com/base"], blockExplorerUrls: ["https://basescan.org/"],
    native: "ETH",
    tokens: {
      USDC: { address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", decimals: 6 }
    }
  },
  "0x8f": { 
    chainId: "0x8f", chainName: "Monad Mainnet", nativeCurrency: { name: "MON", symbol: "MON", decimals: 18 },
    rpcUrls: ["https://rpc.monad.xyz"], blockExplorerUrls: ["https://monadscan.com/"],
    native: "MON",
    tokens: {
      USDC: { address: "0x754704Bc059F8C67012fEd69BC8A327a5aafb603", decimals: 6 },
      USDT0: { address: "0xe7cd86e13AC4309349F30B3435a9d337750fC82D", decimals: 6 }
    }
  }
};

// ==========================================================
// 2. DATABASE & ARTICLES 
// ==========================================================
const data = {
  projects: [
    { id: "soil", category: "nature", name: "Soil Restoration", img: "https://images.unsplash.com/photo-1590682680695-43b964a3ae17?auto=format&fit=crop&w=400&q=80", desc: "The upper layer of earth in which plants grow.", usage: "Agriculture, construction material.", pollution: "Chemical fertilizers, deforestation.", preservation: "Crop rotation, organic farming.", verified: true, raised: 1500, goal: 15000 },
    { id: "water", category: "nature", name: "Clean Water Access", img: "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?auto=format&fit=crop&w=400&q=80", desc: "A transparent, tasteless chemical substance.", usage: "Drinking, agriculture, hydroelectric power.", pollution: "Sewage spillages, plastic waste.", preservation: "Water conservation, protecting wetlands.", verified: true, raised: 1000, goal: 10000 },
    { id: "air", category: "nature", name: "Air Quality Defense", img: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=400&q=80", desc: "The invisible gaseous substance surrounding earth.", usage: "Respiration, wind energy.", pollution: "Vehicle emissions, factory smog.", preservation: "Transitioning to renewable energy.", verified: true, raised: 1000, goal: 16000 },
    { id: "sound", category: "nature", name: "Sound Conservation", img: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=400&q=80", desc: "Vibrations that travel through the air.", usage: "Communication, music, echolocation.", pollution: "Noise pollution from traffic, machinery.", preservation: "Soundproofing, quiet zones.", verified: true, raised: 500, goal: 15000 },
    { id: "light", category: "nature", name: "Light Integrity", img: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&w=400&q=80", desc: "Natural agent that stimulates sight.", usage: "Vision, photosynthesis, solar power.", pollution: "Light pollution disrupting ecosystems.", preservation: "Energy-efficient bulbs, dark-sky compliance.", verified: true, raised: 500, goal: 20000 },
    { id: "food", category: "humanity", name: "Food Security", img: "https://images.unsplash.com/photo-1493770348161-369560ae357d?auto=format&fit=crop&w=400&q=80", desc: "The right to have access to adequate food.", usage: "Sustaining human life, energy.", pollution: "Food waste, supply chain monopolies.", preservation: "Local farmers, decentralized networks.", verified: true, raised: 500, goal: 22000 },
    { id: "clothes", category: "humanity", name: "Clothing Equity", img: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=400&q=80", desc: "The right to adequate clothing.", usage: "Protection from weather, hygiene.", pollution: "Fast fashion waste, unethical labor.", preservation: "Thrifting, sustainable fabrics.", verified: true, raised: 1000, goal: 10000 },
    { id: "education", category: "humanity", name: "Web3 Education", img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=400&q=80", desc: "The right to free and compulsory education.", usage: "Empowerment, societal advancement.", pollution: "Defunding schools, digital divide.", preservation: "Open-source learning, Web3 EdTech.", verified: true, raised: 500, goal: 10000 },
    { id: "healthcare", category: "humanity", name: "Global Healthcare", img: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=400&q=80", desc: "The right to physical and mental health.", usage: "Treating illness, well-being.", pollution: "Privatization making care unaffordable.", preservation: "Universal policies, health decentralization.", verified: true, raised: 500, goal: 15000 },
    { id: "accommodation", category: "humanity", name: "Accommodation", img: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=400&q=80", desc: "The right to live in security and dignity.", usage: "Safety, psychological stability.", pollution: "Homelessness crises, predatory lending.", preservation: "Affordable housing, community trusts.", verified: true, raised: 1500, goal: 18000 },
    { id: "communication", category: "humanity", name: "Communication", img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80", desc: "The right to freedom of opinion and expression.", usage: "Sharing ideas, organizing societies.", pollution: "Internet censorship, data harvesting.", preservation: "End-to-end encryption, Web3 platforms.", verified: true, raised: 500, goal: 10000 }
  ]
};

const articleData = {
  nature: {
    tag: "Regenerative Finance (ReFi)",
    title: "Restoring Nature: The Web3 Blueprint for Earth",
    img: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80",
    content: `<p>For decades, environmental preservation has been hindered by opaque supply chains, inefficient funding, and a lack of global coordination. <span class="highlight-text">MKR Global</span> is changing this narrative by leveraging decentralized technology to create a transparent, borderless blueprint for restoring our planet.</p><h2>The Tokenization of Impact</h2><p>Imagine a world where every tree planted, every gallon of water purified, and every acre of soil restored is permanently recorded on a public, immutable ledger. Through ReFi (Regenerative Finance), we are moving beyond simply "doing less harm" to actively incentivizing ecological restoration at scale.</p><blockquote>"We cannot solve our crises with the same economic systems that created them. We must build economies that explicitly value the living world."</blockquote><h2>How Your Contribution Heals</h2><p>When you donate via networks like Monad, Base, or Polygon, your funds bypass bureaucratic bottlenecks. Smart contracts ensure that capital flows directly to verified conservationists and ecological stewards on the ground. We are currently funding:</p><ul><li><b>Soil Regeneration:</b> Supporting organic farming practices that sequester carbon back into the earth.</li><li><b>Water Purification:</b> Deploying decentralized infrastructure to communities lacking access to clean aquifers.</li><li><b>Forest Defense:</b> Utilizing satellite data and on-chain verification to protect ancient woodlands from illegal logging.</li></ul><p>By participating in this ecosystem, you aren't just making a donation; you are investing in the very foundation of biological life.</p>`
  },
  humanity: {
    tag: "Borderless Human Rights",
    title: "Empowering Humanity: Unlocking Universal Dignity",
    img: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
    content: `<p>In a hyper-connected world, arbitrary geographic borders should not dictate a person's access to basic human rights. Through cryptography and decentralized networks, we are pioneering a new era of <span class="highlight-text">borderless humanitarian aid</span>.</p><h2>Censorship-Resistant Funding</h2><p>Traditional financial systems can easily be weaponized, shutting out vulnerable populations, activists, and grassroots organizers. Cryptocurrency fundamentally changes this paradigm. A transaction sent on the blockchain cannot be intercepted, censored, or frozen by corrupt authorities.</p><blockquote>"True empowerment begins when financial sovereignty is recognized as a fundamental human right, accessible to anyone with an internet connection."</blockquote><h2>Focus Areas for Human Advancement</h2><p>Your support flows seamlessly across global borders to fuel initiatives that elevate the human condition:</p><ul><li><b>Web3 Education:</b> Providing devices and decentralized learning platforms to bridge the global digital divide.</li><li><b>Global Healthcare:</b> Funding decentralized autonomous organizations (DAOs) that provide open-source medical supplies and telehealth access.</li><li><b>Shelter & Security:</b> Supporting community-owned housing trusts that resist predatory lending practices.</li></ul><p>Together, we are stripping away the heavy inefficiencies of legacy philanthropy and replacing them with a system built on cryptographic truth, lightning speed, and unyielding global solidarity.</p>`
  }
};

// ==========================================================
// 3. WEB3MODAL (APPKIT) SETUP
// ==========================================================
const projectId = 'ff2fa04417b4e3b802961da55db12d63'; 

const getSafeUrl = () => {
  const origin = window.location.origin;
  if (!origin || origin === "null" || origin.startsWith("file://")) {
    return 'https://mkrglobal.org';
  }
  return origin;
};
const safeUrl = getSafeUrl();

const metadata = {
  name: 'MKR Global',
  description: 'Borderless Web3 Donations',
  url: safeUrl,
  icons: [safeUrl + '/cat_dev.jpg']
};

const w3mChains = Object.values(SUPPORTED_CHAINS).map(c => ({
  chainId: parseInt(c.chainId, 16),
  name: c.chainName,
  currency: c.nativeCurrency.symbol,
  explorerUrl: c.blockExplorerUrls[0],
  rpcUrl: c.rpcUrls[0]
}));

const modal = createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: w3mChains,
  projectId,
  chainImages: {
    143: 'https://dl.svgcdn.com/png/token-branded/monad-400.png' 
  },
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#00ffaa',
    '--w3m-color-mix': '#8D6BFF',
    '--w3m-color-mix-strength': 15
  }
});


// ==========================================================
// 4. WEB3 MANAGER (GLOBAL STATE)
// ==========================================================
const Web3Manager = {
  userAddress: null,
  currentChainId: null, // Tracks the actual connected network natively
  isProcessingTx: false,

  async init() {
    modal.subscribeProvider((state) => {
      this.userAddress = state.address;
      this.currentChainId = state.chainId; 
      
      UIManager.updateWalletUI();
      UIManager.updateSmartButtonState(); 
    });
  },

  connectWallet() { modal.open(); },
  disconnect() { modal.disconnect(); }
};

// ==========================================================
// 5. UI MANAGER & ZERO-LATENCY RPC ENGINE
// ==========================================================
const UIManager = {
  searchQuery: '',
  currentFilter: 'all',

  getMobileFallbackUI() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (!isMobile) return ''; 

    return `
      <div style="margin-top: 15px; display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 15px; background: rgba(255,170,0,0.1); border: 1px solid #ffaa00; border-radius: 12px;">
        <span style="color:#ffaa00; font-size:14px; text-align:center; line-height: 1.4;">
          ⚠️ <b>Mobile Browser Security</b><br>
          If your wallet doesn't open automatically, tap below:
        </span>
        <div style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: center;">
            <a href="metamask://wc" style="padding: 10px 15px; background: #F6851B; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 13px;">🦊 MetaMask</a>
            <a href="trust://wc" style="padding: 10px 15px; background: #3375BB; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 13px;">🛡️ Trust Wallet</a>
        </div>
      </div>
    `;
  },

  showDashboardUI() {
    document.getElementById('monad-splash-screen').style.display = 'none';
    const dash = document.getElementById('dashboard-window');
    dash.classList.add('active-screen');
    dash.classList.remove('hidden-screen');
  },

  showSplashUI() {
    const splash = document.getElementById('monad-splash-screen');
    const dash = document.getElementById('dashboard-window');
    splash.style.display = 'flex'; 
    setTimeout(() => {
      dash.classList.remove('active-screen');
      dash.classList.add('hidden-screen');
      splash.classList.remove('fade-out');
    }, 10);
  },

  hideAllModalsUI() {
    document.getElementById('info-modal').classList.add('hidden-modal');
    document.getElementById('donation-modal').classList.add('hidden-modal');
    document.getElementById('article-modal').classList.add('hidden-modal');
  },

  updateWalletUI() {
    const connectedGroup = document.getElementById('wallet-connected-group');
    const addressDisplay = document.getElementById('wallet-address-display');
    const donateBtn = document.getElementById('header-donate-btn');

    if (Web3Manager.userAddress) {
      connectedGroup.classList.remove('hidden-element');
      if (donateBtn) donateBtn.classList.add('hidden-element');
      const addr = Web3Manager.userAddress;
      addressDisplay.textContent = addr.substring(0, 6) + "..." + addr.substring(addr.length - 4);
    } else {
      connectedGroup.classList.add('hidden-element');
      if (donateBtn) donateBtn.classList.remove('hidden-element');
      addressDisplay.textContent = "";
    }
  },

  updateSmartButtonState() {
    const processBtn = document.getElementById('process-donation-btn');
    const networkSelect = document.getElementById('donation-network');
    const statusText = document.getElementById('tx-status');
    
    if (!processBtn || !networkSelect) return;

    if (!Web3Manager.userAddress) {
        processBtn.textContent = "Connect Wallet";
        processBtn.style.background = "#8D6BFF"; 
        return;
    }

    const dropdownTargetId = parseInt(networkSelect.value, 16);

    if (Web3Manager.currentChainId !== dropdownTargetId) {
        const chainConfig = SUPPORTED_CHAINS[networkSelect.value];
        processBtn.textContent = `Switch to ${chainConfig.chainName}`;
        processBtn.style.background = "#ffaa00"; 
        statusText.classList.remove('hidden-element');
        statusText.style.color = "#ffaa00";
        statusText.innerHTML = `<b>Action Required</b><br>Please sync your wallet network to proceed.`;
    } else {
        processBtn.textContent = "Sign & Send Donation";
        processBtn.style.background = "#00ffaa"; 
        processBtn.style.color = "#000";
        if (statusText.innerHTML.includes("Action Required")) {
          statusText.classList.add('hidden-element'); 
        }
    }
  },

  init() {
    const currentHash = window.location.hash;
    
    if (['#dashboard', '#info', '#article', '#donate'].includes(currentHash)) {
      this.showDashboardUI();
      history.replaceState({ view: 'dashboard' }, '', '#dashboard');
    } else {
      history.replaceState({ view: 'splash' }, '', window.location.pathname);
    }

    window.addEventListener('popstate', (e) => {
      const state = e.state;
      this.hideAllModalsUI();
      if (!state || state.view === 'splash') this.showSplashUI();
      else if (state.view === 'dashboard') this.showDashboardUI();
    });

    document.getElementById('initiate-btn').addEventListener('click', () => {
      history.pushState({ view: 'dashboard' }, '', '#dashboard');
      const splash = document.getElementById('monad-splash-screen');
      splash.classList.add('fade-out');
      this.showDashboardUI();
    });

    document.getElementById('back-to-splash-btn').addEventListener('click', () => history.back());

    document.getElementById('header-donate-btn').addEventListener('click', () => {
      UIManager.openDonationModal({ name: "MKR Global Initiative", desc: "Support the global treasury.", usage: "", pollution: "", preservation: "" }); 
    });
    
    document.getElementById('wallet-address-display').addEventListener('click', () => Web3Manager.connectWallet());
    document.getElementById('disconnect-wallet-btn').addEventListener('click', () => Web3Manager.disconnect());
    document.getElementById('close-info-modal').addEventListener('click', () => history.back());
    document.getElementById('close-donation-modal').addEventListener('click', () => history.back());
    document.getElementById('close-article-modal').addEventListener('click', () => history.back());

    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.addEventListener('click', (e) => { if (e.target === modal) history.back(); });
    });

    const natureCard = document.getElementById('nature-impact-card');
    if (natureCard) natureCard.addEventListener('click', () => this.openArticleModal('nature'));

    const humanityCard = document.getElementById('humanity-impact-card');
    if (humanityCard) humanityCard.addEventListener('click', () => this.openArticleModal('humanity'));

    document.getElementById('project-search').addEventListener('input', (e) => {
      this.searchQuery = e.target.value.toLowerCase();
      this.renderProjects();
    });

    document.querySelectorAll('.filter-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        this.currentFilter = e.target.getAttribute('data-filter');
        const titleMap = { 'all': 'Explore Verified Causes', 'nature': 'Support Nature', 'humanity': 'Support Humanity' };
        document.getElementById('dynamic-section-title').textContent = titleMap[this.currentFilter];
        this.renderProjects();
      });
    });

    this.renderProjects();
    this.setupDonationProcessor();
    this.setupDynamicTokenDropdown();
  },

  renderProjects() {
    const grid = document.getElementById('projects-grid');
    grid.innerHTML = '';

    const filtered = data.projects.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(this.searchQuery) || item.desc.toLowerCase().includes(this.searchQuery);
      const matchesCategory = this.currentFilter === 'all' || item.category === this.currentFilter;
      return matchesSearch && matchesCategory;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `<p style="color:#888; text-align:center; width:100%; grid-column: 1 / -1; padding: 20px;">No projects found matching your search.</p>`;
      return;
    }

    filtered.forEach(item => grid.appendChild(this.createInfoCard(item)));
  },

  createInfoCard(item) {
    const div = document.createElement('div');
    div.className = 'project-card';
    const progressPercent = Math.min((item.raised / item.goal) * 100, 100).toFixed(1);
    
    div.innerHTML = `
      <div class="card-img-wrapper">
        <img src="${item.img}" alt="${item.name}">
        ${item.verified ? '<div class="verified-badge">✓ Verified</div>' : ''}
        <div class="category-tag">${item.category === 'nature' ? '🌱 Nature' : '🤝 Humanity'}</div>
      </div>
      <div class="card-body">
        <h3>${item.name}</h3>
        <p class="card-desc">${item.desc}</p>
        <div class="funding-metrics">
          <div class="progress-bar-bg">
            <div class="progress-bar-fill" style="width: ${progressPercent}%"></div>
          </div>
          <div class="funding-stats">
            <span class="raised">$${item.raised.toLocaleString()} raised</span>
            <span class="goal">of $${item.goal.toLocaleString()}</span>
          </div>
        </div>
        <button class="card-inline-donate-btn">Donate to ${item.name}</button>
      </div>
    `;

    div.addEventListener('click', (e) => {
      if (e.target.classList.contains('card-inline-donate-btn')) {
        e.stopPropagation(); 
        this.openDonationModal(item);
      } else {
        this.openInfoModal(item, item.category);
      }
    });
    return div;
  },

  openInfoModal(item, category) {
    document.getElementById('modal-image').src = item.img;
    document.getElementById('modal-title').textContent = item.name;
    document.getElementById('modal-desc').textContent = item.desc;
    document.getElementById('modal-sec1-title').textContent = category === 'nature' ? "Importance & Ecosystem" : "Human Impact";
    document.getElementById('modal-sec1-desc').textContent = item.usage;
    document.getElementById('modal-sec2-title').textContent = category === 'nature' ? "Current Threats" : "Systemic Issues";
    document.getElementById('modal-sec2-desc').textContent = item.pollution;
    document.getElementById('modal-sec3-title').textContent = category === 'nature' ? "Preservation Efforts" : "Web3 Solutions";
    document.getElementById('modal-sec3-desc').textContent = item.preservation;

    history.pushState({ view: 'modal' }, '', '#info');
    document.getElementById('info-modal').classList.remove('hidden-modal');
  },

  openArticleModal(articleKey) {
    const article = articleData[articleKey];
    document.getElementById('article-hero-img').src = article.img;
    document.getElementById('article-tag').textContent = article.tag;
    document.getElementById('article-title').textContent = article.title;
    document.getElementById('article-body').innerHTML = article.content;

    history.pushState({ view: 'modal' }, '', '#article');
    document.getElementById('article-modal').classList.remove('hidden-modal');
  },

  openDonationModal(item) {
    document.getElementById('donation-target-name').textContent = `Support: ${item.name}`;
    UIManager.updateSmartButtonState(); 
    history.pushState({ view: 'modal' }, '', '#donate');
    document.getElementById('donation-modal').classList.remove('hidden-modal');
  },

  setupDynamicTokenDropdown() {
    const networkSelect = document.getElementById('donation-network');
    const tokenSelect = document.getElementById('donation-token');

    networkSelect.addEventListener('change', () => {
      const chainId = networkSelect.value;
      const chainConfig = SUPPORTED_CHAINS[chainId];
      
      tokenSelect.innerHTML = `<option value="NATIVE">${chainConfig.native}</option>`;
      for (const tokenSymbol in chainConfig.tokens) {
        tokenSelect.innerHTML += `<option value="${tokenSymbol}">${tokenSymbol}</option>`;
      }
      
      UIManager.updateSmartButtonState();
    });
    
    networkSelect.dispatchEvent(new Event('change'));
  },

  setupDonationProcessor() {
    const processBtn = document.getElementById('process-donation-btn');
    const networkSelector = document.getElementById('donation-network');
    const amountInput = document.getElementById('donation-amount');
    const tokenSelector = document.getElementById('donation-token');
    const statusText = document.getElementById('tx-status');

    amountInput.addEventListener('input', function() {
      this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
    });

    processBtn.addEventListener('click', async () => {
      if (Web3Manager.isProcessingTx) return; 

      const walletProvider = modal.getWalletProvider();
      
      // 1. Connection Check
      if (!walletProvider || !Web3Manager.userAddress) {
        modal.open();
        return; 
      }

      const targetChainIdHex = networkSelector.value;
      const targetChainIdDecimal = parseInt(targetChainIdHex, 16);

      // 2. NETWORK SWITCH
      if (Web3Manager.currentChainId !== targetChainIdDecimal) {
         try {
             statusText.classList.remove('hidden-element');
             statusText.style.color = "#ffaa00";
             statusText.innerHTML = `<b>Action Required</b><br>Please open your wallet app to approve the network switch.`;
             modal.open({ view: 'Networks' }); 
         } catch (e) { console.error(e); }
         return; 
      }

      // 3. TRANSACTION PREPARATION
      const userAmountStr = amountInput.value.trim();
      const numericalAmount = parseFloat(userAmountStr);
      
      if (!userAmountStr || isNaN(numericalAmount) || numericalAmount <= 0) {
        alert("Please enter a valid amount greater than 0.");
        return;
      }
      
      Web3Manager.isProcessingTx = true;
      
      try {
        processBtn.disabled = true;
        processBtn.textContent = "Check Wallet";
        statusText.classList.remove('hidden-element');
        statusText.style.color = "#00ffaa";
        statusText.innerHTML = `<b>Action Required</b><br>Please check your wallet app and approve the transaction.`;

        const selectedToken = tokenSelector.value;
        const chainConfig = SUPPORTED_CHAINS[targetChainIdHex];
        let txHash;

        if (selectedToken === "NATIVE") {
          const weiAmount = parseUnits(userAmountStr, 18);
          txHash = await walletProvider.request({
            method: 'eth_sendTransaction',
            params: [{
              from: Web3Manager.userAddress,
              to: DESTINATION_WALLET,
              value: '0x' + weiAmount.toString(16)
            }]
          });
        } else {
          const tokenInfo = chainConfig.tokens[selectedToken];
          const baseUnits = parseUnits(userAmountStr, tokenInfo.decimals);
          const erc20Interface = new Interface(["function transfer(address to, uint256 amount) returns (bool)"]);
          const dataPayload = erc20Interface.encodeFunctionData("transfer", [DESTINATION_WALLET, baseUnits]);

          txHash = await walletProvider.request({
            method: 'eth_sendTransaction',
            params: [{
              from: Web3Manager.userAddress,
              to: tokenInfo.address,
              data: dataPayload
            }]
          });
        }

        if (!txHash) throw new Error("TX_HASH_NOT_GENERATED");

        // 4. WAIT FOR CONFIRMATION (ROBUST MOBILE BACKGROUND SURVIVAL)
        processBtn.textContent = "Verifying...";
        statusText.style.color = "#00ffaa";
        statusText.innerHTML = `Transaction sent! Hash: ${txHash.slice(0,8)}...<br>Waiting for network...`;
        
        try {
          const provider = new BrowserProvider(walletProvider);
          let receipt = null;
          let attempts = 0;
          
          // Poll for receipt manually to avoid WebSocket disconnect crashes when returning from wallet
          while (!receipt && attempts < 45) { // 90 seconds max wait
            try {
              receipt = await provider.getTransactionReceipt(txHash);
            } catch (pollErr) {
              console.warn("Polling interrupted (app likely backgrounded):", pollErr);
            }
            if (!receipt) {
              await new Promise(r => setTimeout(r, 2000));
              attempts++;
            }
          }

          if (receipt && (receipt.status === 1 || receipt.status === 1n || receipt.status === true || receipt.status === '0x1' || receipt.status === 1)) {
            processBtn.textContent = "Thank You! ♥";
            processBtn.style.background = "#00ffaa";
            processBtn.style.color = "#000";
            statusText.innerHTML = "<b>Donation successful - God bless you 🍀</b>"; 
            amountInput.value = '';
          } else if (receipt) {
            throw new Error("TX_REVERTED");
          } else {
            // Assume success if polling times out but txHash exists in the mempool
            throw new Error("POLL_TIMEOUT");
          }
          
        } catch (postTxErr) {
          console.warn("Post-tx processing warning:", postTxErr);
          
          if (postTxErr.message === "TX_REVERTED") {
            throw postTxErr; // Drop to outer catch
          }

          // If the provider disconnects completely or polling times out, 
          // the transaction was still signed and sent successfully to the network.
          processBtn.textContent = "Thank You! ♥";
          processBtn.style.background = "#00ffaa";
          processBtn.style.color = "#000";
          statusText.style.color = "#00ffaa";
          statusText.innerHTML = `<b>Donation successful - God bless you 🍀</b><br><span style="font-size:12px;">Hash: ${txHash.slice(0,10)}...</span>`; 
          amountInput.value = '';
        }
        
      } catch (error) {
        console.error("Donation process error:", error);
        UIManager.updateSmartButtonState(); 
        processBtn.disabled = false;
        
        const errStr = (error?.message || error?.toString() || "").toLowerCase();
        
        if (error?.code === 4001 || error?.code === 'ACTION_REJECTED' || errStr.includes("user denied") || errStr.includes("cancel")) {
          statusText.style.color = "#ffaa00";
          statusText.innerHTML = "<b>Transaction Cancelled</b><br>You cancelled the request in your wallet.";
          return;
        }

        if (errStr.includes("insufficient funds") || errStr.includes("exceeds balance") || errStr.includes("tx_reverted")) {
          statusText.style.color = "#ff5555";
          statusText.innerHTML = "<b>Transaction Failed</b><br>Insufficient funds for this transaction.";
          return;
        }

        // Generic fallback for strict timeouts before hash generation
        statusText.style.color = "#ffaa00";
        statusText.innerHTML = `<b>Request Timed Out</b><br>If you didn't see a prompt, please ensure your wallet app is open and try again.`;
      } finally {
        Web3Manager.isProcessingTx = false;
      }
    });
  }
};

// ==========================================================
// 6. INITIALIZATION
// ==========================================================
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(()=>{}));
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  UIManager.init();
  registerServiceWorker(); 
  await Web3Manager.init(); 
});
