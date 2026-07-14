const state = {
  data: null,
  selectedId: null,
  search: "",
  status: "",
  category: ""
};

const els = {
  totalPlugins: document.getElementById("totalPlugins"),
  summaryGrid: document.getElementById("summaryGrid"),
  pluginGrid: document.getElementById("pluginGrid"),
  detailPanel: document.getElementById("detailPanel"),
  searchInput: document.getElementById("searchInput"),
  statusFilter: document.getElementById("statusFilter"),
  categoryFilter: document.getElementById("categoryFilter"),
  resetBtn: document.getElementById("resetBtn"),
  lastUpdated: document.getElementById("lastUpdated")
};

function badge(status){
  const safe = status || "testing";
  return `<span class="badge ${safe}">${safe}</span>`;
}

function chip(text){
  return `<span class="chip">${text}</span>`;
}

function getVersion(plugin, key){
  return plugin[key] ? `v${plugin[key]}` : "belum diset";
}

function matches(plugin){
  const text = [
    plugin.name, plugin.id, plugin.category, plugin.status,
    plugin.latestVersion, plugin.stableVersion, plugin.favoriteVersion,
    plugin.shortDescription, ...(plugin.tags || []), ...(plugin.unrealVersions || [])
  ].join(" ").toLowerCase();

  const okSearch = !state.search || text.includes(state.search.toLowerCase());
  const okStatus = !state.status || plugin.status === state.status || plugin.versions?.some(v => v.status === state.status);
  const okCategory = !state.category || plugin.category === state.category;
  return okSearch && okStatus && okCategory;
}

function renderSummary(plugins){
  const count = (status) => plugins.filter(p => p.status === status || p.versions?.some(v => v.status === status)).length;
  const withStable = plugins.filter(p => p.stableVersion).length;
  const cards = [
    ["Total", plugins.length],
    ["Stable diset", withStable],
    ["Candidate/testing", count("candidate") + count("testing")],
    ["Archived/deprecated", count("archived") + count("deprecated")]
  ];
  els.summaryGrid.innerHTML = cards.map(([label, value]) => `
    <div class="summary-card"><b>${value}</b><span>${label}</span></div>
  `).join("");
}

function renderCategories(plugins){
  const categories = [...new Set(plugins.map(p => p.category).filter(Boolean))].sort();
  els.categoryFilter.innerHTML = `<option value="">Semua kategori</option>` + categories.map(c => `<option value="${c}">${c}</option>`).join("");
}

function renderGrid(){
  const plugins = state.data.plugins.filter(matches);
  els.pluginGrid.innerHTML = plugins.map(plugin => `
    <article class="plugin-card ${plugin.id === state.selectedId ? "active" : ""}" data-id="${plugin.id}">
      <div class="card-top">
        <div>
          <h3>${plugin.name}</h3>
          <div class="meta-row">${chip(plugin.category || "uncategorized")} ${chip((plugin.unrealVersions || []).join(", ") || "UE belum diset")}</div>
        </div>
        ${badge(plugin.status)}
      </div>
      <p class="desc">${plugin.shortDescription || ""}</p>
      <div class="meta-row">
        ${chip("Latest: " + getVersion(plugin, "latestVersion"))}
        ${chip("Stable: " + getVersion(plugin, "stableVersion"))}
        ${chip("Favorite: " + getVersion(plugin, "favoriteVersion"))}
      </div>
      <div class="tags">${(plugin.tags || []).slice(0,5).map(chip).join("")}</div>
    </article>
  `).join("") || `<div class="empty-state"><h2>Tidak ada hasil</h2><p>Coba reset filter.</p></div>`;

  document.querySelectorAll(".plugin-card").forEach(card => {
    card.addEventListener("click", () => {
      state.selectedId = card.dataset.id;
      renderGrid();
      renderDetail();
    });
  });
}

function renderDetail(){
  const plugin = state.data.plugins.find(p => p.id === state.selectedId);
  if(!plugin){
    els.detailPanel.innerHTML = `<div class="empty-state"><h2>Pilih plugin</h2><p>Detail versi akan muncul di sini.</p></div>`;
    return;
  }

  const versions = plugin.versions || [];
  els.detailPanel.innerHTML = `
    <div class="detail-inner">
      <div class="detail-title">
        <div>
          <h2>${plugin.name}</h2>
          <div class="meta-row">${chip(plugin.id)} ${chip(plugin.category || "uncategorized")}</div>
        </div>
        ${badge(plugin.status)}
      </div>
      <p class="desc">${plugin.shortDescription || ""}</p>
      <div class="meta-row">
        ${chip("Latest: " + getVersion(plugin, "latestVersion"))}
        ${chip("Stable: " + getVersion(plugin, "stableVersion"))}
        ${chip("Favorite: " + getVersion(plugin, "favoriteVersion"))}
      </div>
      <p class="desc"><b>Catatan:</b> ${plugin.notes || "Belum ada catatan."}</p>
      <h3>Riwayat versi</h3>
      <div class="version-list">
        ${versions.length ? versions.map(v => `
          <div class="version-item">
            <div class="version-head"><b>v${v.version}</b>${badge(v.status)}</div>
            <div class="meta-row">${chip(v.label || "release")} ${chip(v.date || "tanggal belum diset")} ${chip(v.unreal || "UE belum diset")}</div>
            <p>${v.summary || ""}</p>
            ${v.file ? `<a class="download" href="${v.file}">Download ZIP</a>` : ""}
            ${v.changelog?.length ? `<p><b>Changelog</b></p><ul class="small-list">${v.changelog.map(item => `<li>${item}</li>`).join("")}</ul>` : ""}
            ${v.knownIssues?.length ? `<p><b>Known issues</b></p><ul class="small-list">${v.knownIssues.map(item => `<li>${item}</li>`).join("")}</ul>` : ""}
          </div>
        `).join("") : `<div class="empty-state"><p>Belum ada versi. Tambahkan di manifest JSON.</p></div>`}
      </div>
    </div>
  `;
}

async function init(){
  const res = await fetch("data/plugins.json");
  state.data = await res.json();
  els.totalPlugins.textContent = state.data.plugins.length;
  els.lastUpdated.textContent = "Last updated: " + (state.data.lastUpdated || "-");
  renderCategories(state.data.plugins);
  renderSummary(state.data.plugins);
  renderGrid();
}

els.searchInput.addEventListener("input", e => { state.search = e.target.value; renderGrid(); });
els.statusFilter.addEventListener("change", e => { state.status = e.target.value; renderGrid(); });
els.categoryFilter.addEventListener("change", e => { state.category = e.target.value; renderGrid(); });
els.resetBtn.addEventListener("click", () => {
  state.search = "";
  state.status = "";
  state.category = "";
  els.searchInput.value = "";
  els.statusFilter.value = "";
  els.categoryFilter.value = "";
  renderGrid();
});

init().catch(err => {
  els.pluginGrid.innerHTML = `<div class="empty-state"><h2>Gagal load manifest</h2><p>${err.message}</p></div>`;
});
