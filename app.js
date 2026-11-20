(() => {
  const cfg = window.RTCOD_CONFIG;
  const codex = window.RTCOD_CODEX;

  let currency = "RUB";
  let activeItem = null;
  let selectedQty = 1;

  let codexMode = "races";
  let codexIndex = 0;

  const formatPrice = (rub) => {
    if (currency === "USD") {
      const usd = Math.max(0.5, rub / cfg.currency.usdRate);
      return `$${usd.toFixed(usd < 5 ? 2 : 0)}`;
    }
    return `${rub} ₽`;
  };

  // Bind basic server info & links
  document.getElementById("server-ip").textContent = cfg.server.ip;
  document.getElementById("hero-tagline").textContent = cfg.server.tagline;
  document.getElementById("nav-discord").href = cfg.links.discord;
  document.getElementById("footer-discord").href = cfg.links.discord;
  document.getElementById("footer-telegram").href = cfg.links.telegram;
  document.getElementById("dl-win").href = cfg.links.launcherWin;
  document.getElementById("dl-linux").href = cfg.links.launcherLinux;

  // Copy IP (or open Telegram while IP is in development)
  const copyBtn = document.getElementById("copy-ip-btn");
  const isDevIp = !cfg.server.enableLiveStatus && /разработк|скоро|example/i.test(cfg.server.ip);
  if (isDevIp) {
    copyBtn.textContent = "Telegram";
    copyBtn.addEventListener("click", () => window.open(cfg.links.telegram, "_blank", "noopener"));
  } else {
    copyBtn.textContent = "Копировать";
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(cfg.server.ip);
        copyBtn.textContent = "Скопировано ✔";
        setTimeout(() => (copyBtn.textContent = "Копировать"), 1800);
      } catch {
        copyBtn.textContent = cfg.server.ip;
      }
    });
  }

  // Optional live status
  async function loadServerStatus() {
    if (!cfg.server.enableLiveStatus || !cfg.server.ip || /разработк|example/i.test(cfg.server.ip)) return;
    try {
      const resp = await fetch(`https://api.mcsrvstat.us/3/${encodeURIComponent(cfg.server.ip)}`);
      const data = await resp.json();
      const statusText = document.getElementById("server-status-text");
      const dot = document.getElementById("status-dot");
      if (data.online) {
        statusText.textContent = `Онлайн: ${data.players?.online ?? 0}/${data.players?.max ?? 100} • ${cfg.server.version}`;
      } else {
        statusText.textContent = `Сервер на техработах • ${cfg.server.version}`;
        dot.style.background = "#f59e0b";
        dot.style.boxShadow = "0 0 10px #f59e0b";
      }
    } catch {
      // keep default status
    }
  }
  loadServerStatus();

  // ================= CODEX (Races & Classes) =================
  const codexListEl = document.getElementById("codex-list");
  const codexTitleEl = document.getElementById("codex-title");

  function getCodexItems() {
    if (codexMode === "classes") return codex.classes;
    if (codexMode === "blessings") return codex.blessings;
    return codex.races;
  }

  function renderCodexList() {
    const items = getCodexItems();
    const titles = {
      races: "КОДЕКС РАС",
      classes: "КОДЕКС КЛАССОВ",
      blessings: "КОДЕКС БЛАГОСЛОВЕНИЙ",
    };
    codexTitleEl.textContent = titles[codexMode] || "КОДЕКС";
    codexListEl.innerHTML = items
      .map(
        (it, idx) => `
        <button class="codex-item ${idx === codexIndex ? "active" : ""}" data-idx="${idx}" role="option" aria-selected="${idx === codexIndex}">
          <span class="codex-item-sigil" style="color:${it.accent};">${it.sigil}</span>
          <span>${it.name}</span>
        </button>`
      )
      .join("");

    codexListEl.querySelectorAll(".codex-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        codexIndex = Number(btn.dataset.idx);
        renderCodex();
      });
    });
  }

  function renderCodexDetails() {
    const items = getCodexItems();
    const item = items[codexIndex] || items[0];
    if (!item) return;

    document.getElementById("codex-sigil").textContent = item.sigil;
    document.getElementById("codex-sigil").style.color = item.accent;
    document.getElementById("codex-glow").style.background = item.accent;
    document.getElementById("codex-name").textContent = item.name;
    document.getElementById("codex-detail-title").textContent = item.name.toUpperCase();
    document.getElementById("codex-desc").textContent = item.description;
    document.getElementById("codex-buffs").textContent = item.buffs;
    document.getElementById("codex-debuffs").textContent = item.debuffs;
    document.getElementById("codex-ability").textContent = item.ability;
    document.getElementById("codex-counter").textContent = `${codexIndex + 1} / ${items.length}`;

    const recEl = document.getElementById("codex-rec");
    if (codexMode === "races" && item.recommendedClasses) {
      recEl.textContent = `Подходящие классы: ${item.recommendedClasses.join(", ")}`;
    } else if (codexMode === "classes" && item.recommendedRaces) {
      recEl.textContent = `Лучшие расы: ${item.recommendedRaces.join(", ")}`;
    } else if (codexMode === "blessings" && item.recommendedRaces) {
      recEl.textContent = `Синергия с расами: ${item.recommendedRaces.join(", ")}`;
    } else {
      recEl.textContent = "";
    }

    const stats =
      codexMode === "blessings"
        ? [
            ["Направление", item.category],
            ["Главный бонус", item.bonus],
            ["Активация", item.activation],
            ["Снятие", item.reset],
          ]
        : [
            ["Здоровье", `${item.hp} ХП (${(item.hp / 2).toFixed(0)} ❤)`],
            ["Скорость", item.speed],
            ["Бонус урона", item.attack],
            ["Броня", item.armor],
            [codexMode === "races" ? "Рост" : "Стиль", item.scale],
            ["КД умения", item.cd],
          ];
    document.getElementById("codex-stats").innerHTML = stats
      .map(([k, v]) => `<div class="stat-pill"><span>${k}</span><strong>${v}</strong></div>`)
      .join("");
  }

  function renderCodex() {
    renderCodexList();
    renderCodexDetails();
  }

  document.querySelectorAll(".codex-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".codex-tab").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      codexMode = btn.dataset.codex;
      codexIndex = 0;
      renderCodex();
    });
  });

  document.getElementById("codex-prev").addEventListener("click", () => {
    const len = getCodexItems().length;
    codexIndex = (codexIndex - 1 + len) % len;
    renderCodex();
  });

  document.getElementById("codex-next").addEventListener("click", () => {
    const len = getCodexItems().length;
    codexIndex = (codexIndex + 1) % len;
    renderCodex();
  });

  // ================= SHOP =================
  const ranksGrid = document.getElementById("shop-ranks");
  const casesGrid = document.getElementById("shop-cases");

  function renderShop() {
    ranksGrid.innerHTML = cfg.ranks
      .map(
        (rank) => `
        <article class="shop-card ${rank.featured ? "featured" : ""}">
          <div>
            <span class="shop-badge" style="color:${rank.accent}; border: 1px solid ${rank.accent}66;">${rank.badge}</span>
            <h3 style="color:${rank.accent};">${rank.name}</h3>
            <div class="shop-price">${formatPrice(rank.priceRub)}</div>
            <ul class="shop-perks">
              ${rank.perks.map((p) => `<li>${p}</li>`).join("")}
            </ul>
          </div>
          <button class="plate-btn ${rank.featured ? "plate-bronze" : "plate-steel"} btn-block" data-buy-rank="${rank.id}">
            <span>Купить ${rank.name}</span>
          </button>
        </article>`
      )
      .join("");

    casesGrid.innerHTML = cfg.cases
      .map(
        (c) => `
        <article class="shop-card ${c.featured ? "featured" : ""}">
          <div>
            <span class="shop-badge" style="color:${c.accent}; border: 1px solid ${c.accent}66;">${c.rarity}</span>
            <h3 style="color:${c.accent};">${c.name}</h3>
            <div class="shop-price">${formatPrice(c.priceRub)}</div>
            <p class="modal-desc">${c.description}</p>
          </div>
          <button class="plate-btn ${c.featured ? "plate-bronze" : "plate-steel"} btn-block" data-buy-case="${c.id}">
            <span>Купить ключ</span>
          </button>
        </article>`
      )
      .join("");

    ranksGrid.querySelectorAll("[data-buy-rank]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = cfg.ranks.find((r) => r.id === btn.dataset.buyRank);
        if (item) openModal(item, "rank");
      });
    });

    casesGrid.querySelectorAll("[data-buy-case]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = cfg.cases.find((c) => c.id === btn.dataset.buyCase);
        if (item) openModal(item, "case");
      });
    });
  }

  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const showRanks = btn.dataset.tab === "ranks";
      ranksGrid.classList.toggle("hidden", !showRanks);
      casesGrid.classList.toggle("hidden", showRanks);
    });
  });

  const currBtn = document.getElementById("currency-toggle");
  currBtn.addEventListener("click", () => {
    currency = currency === "RUB" ? "USD" : "RUB";
    currBtn.textContent = currency === "RUB" ? "₽ RUB" : "$ USD";
    renderShop();
    if (activeItem) updateModalTotal();
  });

  // ================= MODAL =================
  const modal = document.getElementById("buy-modal");
  const qtyRow = document.getElementById("qty-row");
  const nickInput = document.getElementById("player-nick");
  const noticeBox = document.getElementById("modal-notice");

  function updateModalTotal() {
    if (!activeItem) return;
    document.getElementById("modal-total").textContent = formatPrice(activeItem.priceRub * selectedQty);
  }

  function openModal(item, type) {
    activeItem = item;
    selectedQty = 1;
    noticeBox.classList.add("hidden");
    document.getElementById("modal-category").textContent = type === "rank" ? "Привилегия" : "Ключ от кейса";
    document.getElementById("modal-title").textContent = item.name;
    document.getElementById("modal-desc").textContent = type === "rank" ? item.perks[0] : item.description;
    qtyRow.classList.toggle("hidden", type !== "case");
    document.querySelectorAll(".qty-btn").forEach((b) => b.classList.toggle("active", b.dataset.qty === "1"));
    updateModalTotal();
    modal.classList.remove("hidden");
    nickInput.focus();
  }

  function closeModal() {
    modal.classList.add("hidden");
    activeItem = null;
  }

  document.getElementById("modal-close").addEventListener("click", closeModal);
  document.getElementById("modal-backdrop").addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  document.querySelectorAll(".qty-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedQty = Number(btn.dataset.qty) || 1;
      document.querySelectorAll(".qty-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      updateModalTotal();
    });
  });

  document.getElementById("confirm-buy-btn").addEventListener("click", () => {
    const nick = nickInput.value.trim();
    if (!/^[a-zA-Z0-9_]{3,16}$/.test(nick)) {
      noticeBox.textContent = "Введи корректный ник Minecraft (3–16 символов: латиница, цифры, _).";
      noticeBox.classList.remove("hidden");
      return;
    }

    if (activeItem.checkoutUrl) {
      window.open(activeItem.checkoutUrl, "_blank", "noopener");
      return;
    }
    if (cfg.payment.shopBaseUrl) {
      const url = `${cfg.payment.shopBaseUrl}?product=${encodeURIComponent(activeItem.id)}&customer=${encodeURIComponent(nick)}&count=${selectedQty}`;
      window.open(url, "_blank", "noopener");
      return;
    }

    const rconCmd = activeItem.command.replace("{nick}", nick).replace("{qty}", String(selectedQty));
    noticeBox.innerHTML =
      `Касса (${cfg.payment.providerName}) ещё не привязана в <code>config.js</code>.<br>` +
      `Команда выдачи на сервере: <code>${rconCmd}</code>`;
    noticeBox.classList.remove("hidden");
  });

  // ================= EMBERS =================
  const canvas = document.getElementById("ember-canvas");
  const ctx = canvas.getContext("2d");
  const embers = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  for (let i = 0; i < 36; i++) {
    embers.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.9 + 0.7,
      vy: -(Math.random() * 0.45 + 0.15),
      vx: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.45 + 0.15,
    });
  }

  function animateEmbers() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of embers) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -10) {
        p.y = canvas.height + 10;
        p.x = Math.random() * canvas.width;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(226, 168, 78, ${p.alpha})`;
      ctx.fill();
    }
    requestAnimationFrame(animateEmbers);
  }
  animateEmbers();

  renderCodex();
  renderShop();
})();
