/* ===== Sidebar toggle ===== */
(function () {
  var app = document.querySelector(".app");
  var btn = app.querySelector("#sidebar-toggle");
  var KEY = "sidebar-collapsed";
  function sync() {
    var collapsed = app.classList.contains("is-collapsed");
    var label = collapsed ? "Buka bar sisi" : "Tutup bar sisi";
    btn.setAttribute("aria-expanded", String(!collapsed));
    btn.setAttribute("aria-label", label);
    btn.title = label;
  }
  btn.addEventListener("click", function () {
    app.classList.toggle("is-collapsed");
    sync();
    try {
      localStorage.setItem(
        KEY,
        app.classList.contains("is-collapsed") ? "1" : "0",
      );
    } catch (e) {}
  });
  sync();
})();

/* ===== Accordion ===== */
(function () {
  document.querySelectorAll(".onboard-card").forEach(function (card) {
    var items = card.querySelectorAll(".onboard-item[data-accordion]");

    items.forEach(function (item) {
      var toggle = item.querySelector(".onboard-row.as-button");
      var body = item.querySelector(".onboard-body");
      if (!toggle) return;

      toggle.addEventListener("click", function () {
        var isOpen = item.classList.contains("is-open");
        items.forEach(function (other) {
          if (other === item) return;
          other.classList.remove("is-open");
          var t = other.querySelector(".onboard-row.as-button");
          var b = other.querySelector(".onboard-body");
          if (t) t.setAttribute("aria-expanded", "false");
          if (b) b.hidden = true;
        });
        if (isOpen) {
          item.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
          if (body) body.hidden = true;
        } else {
          item.classList.add("is-open");
          toggle.setAttribute("aria-expanded", "true");
          if (body) body.hidden = false;
        }
      });
    });
  });
})();

/* =========================================================
   Add-entity workflow
   ========================================================= */
(function () {
  /* -------- Type radios -------- */
  var typeRadios = document.querySelectorAll('input[name="entity_type"]');

  /* =========================================================
     Current user profile data
     — replace with backend / session values when available
     ========================================================= */
  var USER_PROFILE = {
    name: "Aisyah Hassan",
    ic: "900101-12-3456",
    phone: "+60 12-345 6789",
    email: "aisyah.hassan@email.com",
    corrAddr:
      "No. 12, Lorong Bunga Raya, Taman Jaya, 88000 Kota Kinabalu, Sabah",
    homeAddr:
      "No. 12, Lorong Bunga Raya, Taman Jaya, 88000 Kota Kinabalu, Sabah",
  };

  function getType() {
    var checked = document.querySelector('input[name="entity_type"]:checked');
    return checked ? checked.value : "syarikat";
  }

  /* -------- Syarikat fields -------- */
  var syarikatFields = {
    name: document.getElementById("co_name"),
    ssm: document.getElementById("co_ssm"),
    ssmExpiry: document.getElementById("co_ssm_expiry"),
    licenseNo: document.getElementById("co_license_no"),
    phone: document.getElementById("co_phone"),
    mida: document.getElementById("co_mida"),
    ica10: document.getElementById("co_ica10"),
    address: document.getElementById("co_address"),
    email: document.getElementById("co_email"),
    repName: document.getElementById("rep_name"),
    repIc: document.getElementById("rep_ic"),
    repRole: document.getElementById("rep_role"),
    repPhone: document.getElementById("rep_phone"),
  };

  /* -------- Individu fields -------- */
  var individuFields = {
    name: document.getElementById("ind_name"),
    ic: document.getElementById("ind_ic"),
    phone: document.getElementById("ind_phone"),
    email: document.getElementById("ind_email"),
    corrAddr: document.getElementById("ind_corr_addr"),
    homeAddr: document.getElementById("ind_home_addr"),
  };

  /* -------- Syarikat docs -------- */
  var syarikatDocs = {
    ssm: document.getElementById("doc_ssm"),
    business: document.getElementById("doc_business"),
    mida: document.getElementById("doc_mida"),
    ica10: document.getElementById("doc_ica10"),
    repIc: document.getElementById("doc_rep_ic"),
    repAuth: document.getElementById("doc_rep_auth"),
  };

  /* -------- Individu docs -------- */
  var individuDocs = {
    ic: document.getElementById("doc_ic"),
    business: document.getElementById("doc_business_ind"),
  };

  /* -------- Refs -------- */
  var formTitle = document.getElementById("form-title");
  var formSub = document.getElementById("form-sub");
  var stripType = document.getElementById("strip-type");
  var stripName = document.getElementById("strip-name");
  var stripAttachments = document.getElementById("strip-attachments");
  var typeBadge = document.getElementById("type-badge");
  var detailsTitle = document.getElementById("details-title");
  var detailsDesc = document.getElementById("details-desc");
  var detailsBadge = document.getElementById("details-badge");
  var attachBadge = document.getElementById("attach-badge");
  var confirmBadge = document.getElementById("confirm-badge");
  var saveStatus = document.getElementById("save-status");
  var saveDraftBtnTop = document.getElementById("save-draft-btn");
  var saveDraftBtnBottom = document.getElementById("save-draft-bottom");
  var submitBtnTop = document.getElementById("submit-btn");
  var submitBtnBottom = document.getElementById("submit-bottom");
  var resetBtn = document.getElementById("reset-btn");

  var formSyarikat = document.getElementById("form-syarikat");
  var formIndividu = document.getElementById("form-individu");
  var docsSyarikat = document.getElementById("docs-syarikat");
  var docsIndividu = document.getElementById("docs-individu");

  /* -------- Cawangan refs -------- */
  var cawanganCard = document.getElementById("cawangan-card");
  var cawanganBadge = document.getElementById("cawangan-badge");
  var cawanganListEl = document.getElementById("cawangan-list");
  var cawanganEmptyEl = document.getElementById("cawangan-empty");
  var cawanganForm = document.getElementById("cawangan-form");
  var cawanganModalEl = document.getElementById("cawanganModal");

  var sumType = document.getElementById("sum_type");
  var sumName = document.getElementById("sum_name");
  var sumSsm = document.getElementById("sum_ssm");
  var sumSsmRow = document.getElementById("sum_ssm_row");
  var sumIc = document.getElementById("sum_ic");
  var sumIcRow = document.getElementById("sum_ic_row");
  var sumAddress = document.getElementById("sum_address");
  var sumRep = document.getElementById("sum_rep");
  var sumRepRow = document.getElementById("sum_rep_row");
  var sumCawangan = document.getElementById("sum_cawangan");
  var sumCawanganRow = document.getElementById("sum_cawangan_row");
  var sumAttachments = document.getElementById("sum_attachments");

  var confirmTrue = document.getElementById("confirm_true");
  var confirmReview = document.getElementById("confirm_review");

  /* =========================================================
     Cawangan state
     ========================================================= */
  var cawanganList = [];

  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[c];
    });
  }

  function renderCawangan() {
    if (!cawanganListEl) return;
    cawanganListEl.innerHTML = "";

    if (cawanganList.length === 0) {
      if (cawanganEmptyEl) cawanganEmptyEl.hidden = false;
    } else {
      if (cawanganEmptyEl) cawanganEmptyEl.hidden = true;
    }

    cawanganList.forEach(function (cw, i) {
      var docCount = cw.files ? cw.files.length : 0;
      var row = document.createElement("div");
      row.className = "record-row";
      row.innerHTML =
        '<span class="record-icon"><i class="bi bi-shop-window"></i></span>' +
        '<div class="record-body">' +
        '<p class="record-title">' +
        escapeHtml(cw.name) +
        "</p>" +
        '<p class="record-sub">' +
        escapeHtml(cw.address) +
        "</p>" +
        '<div class="record-meta">' +
        (cw.phone
          ? '<span><i class="bi bi-telephone"></i>' +
            escapeHtml(cw.phone) +
            "</span>"
          : "") +
        (cw.manager
          ? '<span><i class="bi bi-person"></i>' +
            escapeHtml(cw.manager) +
            "</span>"
          : "") +
        (docCount
          ? '<span><i class="bi bi-paperclip"></i>' +
            docCount +
            " lampiran</span>"
          : "") +
        "</div>" +
        "</div>" +
        '<div class="record-actions">' +
        '<button type="button" class="btn btn-outline-danger btn-sm" data-remove-cawangan="' +
        i +
        '" title="Buang"><i class="bi bi-trash"></i></button>' +
        "</div>";
      cawanganListEl.appendChild(row);
    });

    if (cawanganBadge) {
      cawanganBadge.textContent = cawanganList.length;
      cawanganBadge.classList.toggle("is-warn", cawanganList.length === 0);
      cawanganBadge.classList.toggle("is-active", cawanganList.length > 0);
    }
  }

  function syncCawanganVisibility() {
    if (!cawanganCard) return;
    var isSyarikat = getType() === "syarikat";
    cawanganCard.hidden = !isSyarikat;
  }

  /* Cawangan form submit */
  if (cawanganForm) {
    cawanganForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = document.getElementById("cw_name").value.trim();
      var address = document.getElementById("cw_address").value.trim();
      if (!name || !address) return;

      var files = [];
      var fileInput = document.getElementById("cw_doc");
      if (fileInput.files && fileInput.files.length) {
        Array.prototype.forEach.call(fileInput.files, function (f) {
          files.push({ name: f.name, size: f.size });
        });
      }

      cawanganList.push({
        name: name,
        address: address,
        phone: document.getElementById("cw_phone").value.trim(),
        manager: document.getElementById("cw_manager").value.trim(),
        email: document.getElementById("cw_email").value.trim(),
        files: files,
      });

      bootstrap.Modal.getInstance(cawanganModalEl).hide();
      renderCawangan();
      updateSummary();
      updateSaveBar();
    });

    if (cawanganModalEl) {
      cawanganModalEl.addEventListener("hidden.bs.modal", function () {
        cawanganForm.reset();
      });
    }
  }

  /* Cawangan remove (event delegation) */
  document.addEventListener("click", function (e) {
    var rm = e.target.closest("[data-remove-cawangan]");
    if (!rm) return;
    var idx = parseInt(rm.getAttribute("data-remove-cawangan"), 10);
    if (isNaN(idx)) return;
    cawanganList.splice(idx, 1);
    renderCawangan();
    updateSummary();
    updateSaveBar();
  });

  /* =========================================================
     Auto-fill individu fields from profile
     ========================================================= */
  function fillIndividuFromProfile() {
    if (!individuFields) return;
    if (individuFields.name)
      individuFields.name.value = USER_PROFILE.name || "";
    if (individuFields.ic) individuFields.ic.value = USER_PROFILE.ic || "";
    if (individuFields.phone)
      individuFields.phone.value = USER_PROFILE.phone || "";
    if (individuFields.email)
      individuFields.email.value = USER_PROFILE.email || "";
    if (individuFields.corrAddr)
      individuFields.corrAddr.value = USER_PROFILE.corrAddr || "";
    if (individuFields.homeAddr)
      individuFields.homeAddr.value = USER_PROFILE.homeAddr || "";
  }

  /* =========================================================
     Type switch — show/hide syarikat vs individu blocks
     ========================================================= */
  function syncType() {
    var type = getType();
    var isSyarikat = type === "syarikat";

    formSyarikat.hidden = !isSyarikat;
    formIndividu.hidden = isSyarikat;
    docsSyarikat.hidden = !isSyarikat;
    docsIndividu.hidden = isSyarikat;

    // Show cawangan card only for Syarikat
    syncCawanganVisibility();

    // Auto-fill individu fields from the user's profile
    if (!isSyarikat) {
      fillIndividuFromProfile();
    }

    detailsTitle.textContent = isSyarikat
      ? "Butiran Syarikat"
      : "Butiran Individu";
    detailsDesc.textContent = isSyarikat
      ? "Maklumat syarikat seperti yang didaftarkan dengan SSM."
      : "Maklumat peribadi anda — dipra-isi daripada profil pengguna.";

    typeBadge.textContent = isSyarikat ? "Syarikat" : "Individu";
    typeBadge.classList.remove("is-warn", "is-active");
    typeBadge.classList.add("is-active");

    formTitle.textContent = isSyarikat
      ? "Entiti Syarikat baru"
      : "Entiti Individu baru";
  }

  typeRadios.forEach(function (r) {
    r.addEventListener("change", function () {
      syncType();
      updateAll();
    });
  });

  /* =========================================================
     Completeness checks
     ========================================================= */
  function isCoreComplete() {
    var type = getType();
    if (type === "syarikat") {
      return !!(
        syarikatFields.name.value.trim() &&
        syarikatFields.ssm.value.trim() &&
        syarikatFields.ssmExpiry.value &&
        syarikatFields.licenseNo.value.trim() &&
        syarikatFields.address.value.trim() &&
        syarikatFields.phone.value.trim() &&
        syarikatFields.email.value.trim() &&
        syarikatFields.repName.value.trim() &&
        syarikatFields.repIc.value.trim() &&
        syarikatFields.repRole.value.trim()
      );
    }
    return !!(
      individuFields.name.value.trim() &&
      individuFields.ic.value.trim() &&
      individuFields.phone.value.trim() &&
      individuFields.email.value.trim() &&
      individuFields.corrAddr.value.trim() &&
      individuFields.homeAddr.value.trim()
    );
  }

  function requiredDocsComplete() {
    var type = getType();
    if (type === "syarikat") {
      return !!(
        syarikatDocs.ssm.files.length &&
        syarikatDocs.business.files.length &&
        syarikatDocs.repIc.files.length &&
        syarikatDocs.repAuth.files.length
      );
    }
    return !!(
      individuDocs.ic.files.length && individuDocs.business.files.length
    );
  }

  function canSubmit() {
    return (
      isCoreComplete() &&
      requiredDocsComplete() &&
      confirmTrue.checked &&
      confirmReview.checked
    );
  }

  /* =========================================================
     Attachment counting
     ========================================================= */
  function countDocs(map) {
    var total = 0;
    Object.keys(map).forEach(function (k) {
      var input = map[k];
      if (input && input.files && input.files.length)
        total += input.files.length;
    });
    return total;
  }

  function attachmentList(map) {
    var names = [];
    Object.keys(map).forEach(function (k) {
      var input = map[k];
      if (!input || !input.files || !input.files.length) return;
      Array.prototype.forEach.call(input.files, function (f) {
        names.push(f.name);
      });
    });
    return names;
  }

  function currentDocs() {
    return getType() === "syarikat" ? syarikatDocs : individuDocs;
  }

  /* =========================================================
     Badges
     ========================================================= */
  function updateBadges() {
    var type = getType();

    var empty = 0;
    if (type === "syarikat") {
      if (!syarikatFields.name.value.trim()) empty++;
      if (!syarikatFields.ssm.value.trim()) empty++;
      if (!syarikatFields.ssmExpiry.value) empty++;
      if (!syarikatFields.licenseNo.value.trim()) empty++;
      if (!syarikatFields.address.value.trim()) empty++;
      if (!syarikatFields.phone.value.trim()) empty++;
      if (!syarikatFields.email.value.trim()) empty++;
      if (!syarikatFields.repName.value.trim()) empty++;
      if (!syarikatFields.repIc.value.trim()) empty++;
      if (!syarikatFields.repRole.value.trim()) empty++;
    } else {
      if (!individuFields.name.value.trim()) empty++;
      if (!individuFields.ic.value.trim()) empty++;
      if (!individuFields.phone.value.trim()) empty++;
      if (!individuFields.email.value.trim()) empty++;
      if (!individuFields.corrAddr.value.trim()) empty++;
      if (!individuFields.homeAddr.value.trim()) empty++;
    }
    detailsBadge.textContent = empty;
    detailsBadge.classList.toggle("is-warn", empty > 0);
    detailsBadge.classList.toggle("is-active", empty === 0);

    var n = countDocs(currentDocs());
    attachBadge.textContent = n;
    attachBadge.classList.toggle("is-warn", n === 0);
    attachBadge.classList.toggle("is-active", n > 0);

    var confEmpty = 0;
    if (!confirmTrue.checked) confEmpty++;
    if (!confirmReview.checked) confEmpty++;
    confirmBadge.textContent = confEmpty;
    confirmBadge.classList.toggle("is-warn", confEmpty > 0);
    confirmBadge.classList.toggle("is-active", confEmpty === 0);

    // Cawangan badge
    if (cawanganBadge) {
      cawanganBadge.textContent = cawanganList.length;
      cawanganBadge.classList.toggle("is-warn", cawanganList.length === 0);
      cawanganBadge.classList.toggle("is-active", cawanganList.length > 0);
    }
  }

  /* =========================================================
     Info strip + summary
     ========================================================= */
  function updateInfoStrip() {
    var type = getType();
    var isSyarikat = type === "syarikat";
    stripType.textContent = isSyarikat ? "Syarikat" : "Individu";
    stripName.textContent = isSyarikat
      ? syarikatFields.name.value.trim() || "—"
      : individuFields.name.value.trim() || "—";
    stripAttachments.textContent = String(countDocs(currentDocs()));
  }

  function updateSummary() {
    var type = getType();
    var isSyarikat = type === "syarikat";

    sumType.textContent = isSyarikat ? "Syarikat" : "Individu";
    sumName.textContent = isSyarikat
      ? syarikatFields.name.value.trim() || "—"
      : individuFields.name.value.trim() || "—";

    if (isSyarikat) {
      sumSsmRow.hidden = false;
      sumIcRow.hidden = true;
      sumRepRow.hidden = false;
      sumSsm.textContent =
        (syarikatFields.ssm.value.trim() || "—") +
        (syarikatFields.ssmExpiry.value
          ? " (tamat " + syarikatFields.ssmExpiry.value + ")"
          : "");
      sumAddress.textContent = syarikatFields.address.value.trim() || "—";
      sumRep.textContent =
        (syarikatFields.repName.value.trim() || "—") +
        (syarikatFields.repRole.value.trim()
          ? " — " + syarikatFields.repRole.value.trim()
          : "") +
        (syarikatFields.repIc.value.trim()
          ? " (" + syarikatFields.repIc.value.trim() + ")"
          : "");

      // Cawangan
      if (sumCawanganRow) sumCawanganRow.hidden = false;
      if (sumCawangan) {
        if (cawanganList.length === 0) {
          sumCawangan.textContent = "Tiada cawangan didaftarkan";
        } else {
          var names = cawanganList
            .map(function (cw) {
              return cw.name;
            })
            .join(", ");
          sumCawangan.textContent =
            cawanganList.length + " cawangan (" + names + ")";
        }
      }
    } else {
      sumSsmRow.hidden = true;
      sumIcRow.hidden = false;
      sumRepRow.hidden = true;
      if (sumCawanganRow) sumCawanganRow.hidden = true;
      sumIc.textContent = individuFields.ic.value.trim() || "—";
      sumAddress.textContent =
        individuFields.homeAddr.value.trim() ||
        individuFields.corrAddr.value.trim() ||
        "—";
    }

    var names = attachmentList(currentDocs());
    sumAttachments.textContent = names.length
      ? names.length + " fail dilampirkan (" + names.join(", ") + ")"
      : "Tiada lampiran dimuat naik";
  }

  /* =========================================================
     Save bar
     ========================================================= */
  function updateSaveBar() {
    var core = isCoreComplete();
    var docs = requiredDocsComplete();
    var submittable = canSubmit();

    submitBtnTop.disabled = !submittable;
    submitBtnBottom.disabled = !submittable;

    var canDraft = !!(getType() === "syarikat"
      ? syarikatFields.name.value.trim()
      : individuFields.name.value.trim());
    saveDraftBtnTop.disabled = !canDraft;
    saveDraftBtnBottom.disabled = !canDraft;

    if (submittable) {
      saveStatus.className = "save-status is-ready";
      saveStatus.innerHTML =
        "<strong>Sedia untuk dihantar</strong>Semua maklumat wajib dan lampiran telah lengkap. Hantar untuk semakan DOA.";
    } else if (!core) {
      saveStatus.className = "save-status";
      saveStatus.innerHTML =
        "<strong>Draf belum lengkap</strong>Isi semua medan wajib untuk mengaktifkan butang hantar.";
    } else if (!docs) {
      saveStatus.className = "save-status is-warning";
      saveStatus.innerHTML =
        "<strong>Lampiran belum lengkap</strong>Muat naik semua dokumen wajib sebelum menghantar.";
    } else {
      saveStatus.className = "save-status is-warning";
      saveStatus.innerHTML =
        "<strong>Sedia untuk draf</strong>Tandakan kedua-dua pengakuan pada kad Pengesahan untuk menghantar.";
    }
  }

  /* =========================================================
     Live updates
     ========================================================= */
  function updateAll() {
    syncType();
    updateInfoStrip();
    updateSummary();
    updateBadges();
    updateSaveBar();
  }

  /* -------- Listeners -------- */
  document
    .querySelectorAll("[data-syarikat], [data-individu]")
    .forEach(function (el) {
      el.addEventListener("input", updateAll);
      el.addEventListener("change", updateAll);
    });

  document
    .querySelectorAll("[data-syarikat-doc], [data-individu-doc]")
    .forEach(function (el) {
      el.addEventListener("change", updateAll);
    });

  confirmTrue.addEventListener("change", updateAll);
  confirmReview.addEventListener("change", updateAll);

  /* =========================================================
     Save draft
     ========================================================= */
  function saveDraft() {
    var type = getType();
    var name =
      type === "syarikat"
        ? syarikatFields.name.value.trim()
        : individuFields.name.value.trim();

    if (!name) {
      saveStatus.className = "save-status is-warning";
      saveStatus.innerHTML =
        "<strong>Nama diperlukan</strong>Isi nama " +
        (type === "syarikat" ? "syarikat" : "penuh") +
        " terlebih dahulu untuk menyimpan draf.";
      if (type === "syarikat") {
        syarikatFields.name.focus();
      } else {
        individuFields.name.focus();
      }
      return;
    }

    formSub.textContent =
      "Draf disimpan pada " +
      new Date().toLocaleString("ms-MY", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });

    saveStatus.className = "save-status is-ready";
    saveStatus.innerHTML =
      "<strong>Draf disimpan</strong>Anda boleh kembali ke halaman ini pada bila-bila masa.";
  }

  saveDraftBtnTop.addEventListener("click", saveDraft);
  saveDraftBtnBottom.addEventListener("click", saveDraft);

  /* =========================================================
     Submit
     ========================================================= */
  function submitEntity() {
    if (!canSubmit()) {
      if (!isCoreComplete()) {
        openCard("details");
      } else if (!requiredDocsComplete()) {
        openCard("attachments");
      } else {
        openCard("confirm");
      }
      return;
    }

    var ref =
      "EN/" +
      new Date().getFullYear() +
      "/" +
      Math.floor(10000 + Math.random() * 89999);

    document.getElementById("ref-value").textContent = ref;

    submitBtnTop.disabled = true;
    submitBtnBottom.disabled = true;
    submitBtnTop.innerHTML = '<i class="bi bi-check-lg"></i>Dihantar';
    submitBtnBottom.innerHTML = '<i class="bi bi-check-lg me-1"></i>Dihantar';

    saveStatus.className = "save-status is-ready";
    saveStatus.innerHTML =
      "<strong>Entiti dihantar</strong>Rujukan: " +
      ref +
      ". Sila tunggu semakan DOA.";
  }

  submitBtnTop.addEventListener("click", submitEntity);
  submitBtnBottom.addEventListener("click", submitEntity);

  /* =========================================================
     Open a card by name
     ========================================================= */
  function openCard(name) {
    var item = document.querySelector(
      '.onboard-item[data-accordion="' + name + '"]',
    );
    if (!item) return;
    if (item.classList.contains("is-open")) return;
    var toggle = item.querySelector(".onboard-row.as-button");
    if (toggle) toggle.click();
  }

  /* =========================================================
     Reset
     ========================================================= */
  resetBtn.addEventListener("click", function () {
    if (
      !confirm(
        "Set semula borang? Semua maklumat yang telah diisi akan dipadam.",
      )
    )
      return;

    // Syarikat fields
    Object.keys(syarikatFields).forEach(function (k) {
      var el = syarikatFields[k];
      if (!el) return;
      if (el.readOnly) return;
      el.value = "";
    });

    // Individu fields (will be re-filled below)
    Object.keys(individuFields).forEach(function (k) {
      var el = individuFields[k];
      if (el) el.value = "";
    });

    // Re-apply auto-filled profile data for individu
    fillIndividuFromProfile();

    // Docs
    Object.keys(syarikatDocs).forEach(function (k) {
      if (syarikatDocs[k]) syarikatDocs[k].value = "";
    });
    Object.keys(individuDocs).forEach(function (k) {
      if (individuDocs[k]) individuDocs[k].value = "";
    });

    // Cawangan
    cawanganList = [];
    renderCawangan();

    // Radios back to Syarikat
    document.getElementById("type-syarikat").checked = true;

    confirmTrue.checked = false;
    confirmReview.checked = false;

    document.getElementById("ref-value").textContent = "—";
    formSub.textContent = "Rekod baharu · Belum disimpan";

    submitBtnTop.innerHTML =
      '<i class="bi bi-send-check"></i>Hantar untuk semakan';
    submitBtnBottom.innerHTML =
      '<i class="bi bi-send-check me-1"></i>Hantar untuk semakan';

    updateAll();
  });

  /* =========================================================
     Initial state
     ========================================================= */
  syncType();
  renderCawangan();
  updateAll();
})();