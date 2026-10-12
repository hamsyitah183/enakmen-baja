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

/* ===== Unified review workflow ===== */
(function () {
  var allRows = document.querySelectorAll(".review-row");
  var docRows = document.querySelectorAll('.review-row[data-row="doc"]');
  var wakilRows = document.querySelectorAll('.review-row[data-row="wakil"]');
  var checklistBoxes = document.querySelectorAll(
    '#body-checklist input[type="checkbox"]',
  );

  function attachToggle(row) {
    row.dataset.state = "pending";
    var approveBtn = row.querySelector('[data-action="approve"]');
    var rejectBtn = row.querySelector('[data-action="reject"]');
    if (!approveBtn || !rejectBtn) return;

    function setState(state) {
      row.dataset.state = state;
      row.classList.toggle("is-approved", state === "approved");
      row.classList.toggle("is-rejected", state === "rejected");
      approveBtn.classList.toggle("active", state === "approved");
      rejectBtn.classList.toggle("active", state === "rejected");
      updateAll();
    }

    // expose for bulk actions
    row.__setState = setState;

    approveBtn.addEventListener("click", function () {
      setState(row.dataset.state === "approved" ? "pending" : "approved");
    });
    rejectBtn.addEventListener("click", function () {
      setState(row.dataset.state === "rejected" ? "pending" : "rejected");
    });
  }
  allRows.forEach(attachToggle);

  function updateBadge(rows, badgeId) {
    var remaining = 0;
    rows.forEach(function (r) {
      if (r.dataset.state === "pending") remaining++;
    });
    var el = document.getElementById(badgeId);
    if (!el) return;
    el.textContent = remaining;
    el.style.display = remaining > 0 ? "" : "none";
  }

  function countPendingChecklist() {
    var total = document.querySelectorAll(
      "#body-checklist .checklist-item",
    ).length;
    var checked = document.querySelectorAll(
      '#body-checklist input[type="checkbox"]:checked',
    ).length;
    return total - checked;
  }

  function updateChecklistBadge() {
    var total = document.querySelectorAll(
      "#body-checklist .checklist-item",
    ).length;
    var checked = document.querySelectorAll(
      '#body-checklist input[type="checkbox"]:checked',
    ).length;
    var remaining = total - checked;
    var el = document.getElementById("checklist-badge");
    if (!el) return;
    el.textContent = remaining;
    el.style.display = remaining > 0 ? "" : "none";

    var s = document.getElementById("summary-checklist");
    if (s) s.textContent = checked + " / " + total + " selesai";
  }
  checklistBoxes.forEach(function (cb) {
    cb.addEventListener("change", function () {
      updateChecklistBadge();
      updateDecisionButtons();
    });
  });
  updateChecklistBadge();

  function countPending(rows) {
    var n = 0;
    rows.forEach(function (r) {
      if (r.dataset.state === "pending") n++;
    });
    return n;
  }

  function updateSummary() {
    var docP = countPending(docRows);
    var wakilP = countPending(wakilRows);

    var sd = document.getElementById("summary-docs");
    if (sd)
      sd.textContent =
        docRows.length - docP + " / " + docRows.length + " disemak";

    var sw = document.getElementById("summary-wakil");
    if (sw)
      sw.textContent =
        wakilRows.length - wakilP + " / " + wakilRows.length + " disemak";
  }

  function updateDecisionButtons() {
    var docP = countPending(docRows);
    var wakilP = countPending(wakilRows);
    var clP = countPendingChecklist();
    var allDone = docP === 0 && wakilP === 0 && clP === 0;

    var title = document.getElementById("decision-title");
    var sub = document.getElementById("decision-sub");
    var advanceBtn = document.querySelector('[data-decision="advance"]');

    if (!allDone) {
      var parts = [];
      if (docP > 0) parts.push(docP + " dokumen");
      if (wakilP > 0) parts.push(wakilP + " wakil");
      if (clP > 0) parts.push(clP + " senarai semakan");
      title.textContent = "Keputusan Semakan";
      sub.textContent =
        parts.join(", ") +
        " masih belum disemak. Tandakan setiap item, atau gunakan butang di kanan.";
    } else {
      title.textContent = "Sedia untuk keputusan";
      sub.textContent =
        "Semua item telah disemak. Sahkan untuk teruskan, atau Reject untuk menolak / meminta maklumat.";
    }

    // Swap the primary advance button label based on state
    if (advanceBtn) {
      if (allDone) {
        advanceBtn.innerHTML =
          '<i class="bi bi-check-circle-fill"></i>Sahkan dan Lulus Sokongan';
      } else {
        advanceBtn.innerHTML =
          '<i class="bi bi-check2-all"></i>Terima Semua';
      }
    }
  }

  function updateAll() {
    updateBadge(docRows, "docs-badge");
    updateBadge(wakilRows, "wakil-badge");
    updateSummary();
    updateDecisionButtons();
  }

  updateAll();

  /* ===== Bulk helpers ===== */
  function approveAll() {
    allRows.forEach(function (row) {
      if (row.__setState) row.__setState("approved");
    });
    checklistBoxes.forEach(function (cb) {
      cb.checked = true;
    });
    updateChecklistBadge();
    // Re-evaluate after ticking checkboxes so the button label flips
    updateDecisionButtons();
  }

  /* ===== Decision modal ===== */
  var modalEl = document.getElementById("decisionModal");
  var modal = new bootstrap.Modal(modalEl);
  var actionBar = document.getElementById("decision-bar");
  var barActions = actionBar.querySelector(".db-actions");
  var baseActionsHTML = barActions.innerHTML;
  var resultEl = document.getElementById("decision-result");
  var commentEl = document.getElementById("dm-comment");
  var errEl = document.getElementById("dm-error");
  var rejectPicker = document.getElementById("dm-reject-picker");
  var current = null;
  var decided = false;

  var CFG = {
    advance: {
      title: "Teruskan ke Lesen Aktiviti",
      btn: "Sahkan kelulusan",
      cls: "btn btn-success",
      pill: ["is-approved", "Peringkat 1 selesai", "bi-check-circle-fill"],
      head: "Dokumen sokongan disahkan",
      label: "Komen peralihan (pilihan)",
    },
    rejected: {
      title: "Tolak permohonan",
      btn: "Sahkan penolakan",
      cls: "btn btn-danger",
      pill: ["is-rejected", "Ditolak", "bi-x-circle-fill"],
      head: "Permohonan ditolak",
      label: "Alasan penolakan (dinyatakan kepada pemohon)",
    },
    info: {
      title: "Minta maklumat tambahan",
      btn: "Hantar permintaan",
      cls: "btn btn-warning",
      pill: ["is-info", "Maklumat Diminta", "bi-exclamation-circle-fill"],
      head: "Menunggu maklum balas pemohon",
      label: "Maklumat yang diperlukan daripada pemohon",
    },
  };

  function fmt(d) {
    return d.toLocaleDateString("ms-MY", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  /* Update visible fields inside the modal for a given type */
  function syncModalForType(type) {
    current = type;
    var c = CFG[type];

    document.getElementById("decisionTitle").textContent = c.title;
    document.getElementById("dm-comment-label").textContent = c.label;

    modalEl.querySelectorAll("[data-for]").forEach(function (el) {
      el.hidden = el.dataset.for !== type;
    });

    var btn = document.getElementById("dm-confirm");
    btn.className = c.cls;
    btn.textContent = c.btn;

    errEl.hidden = true;
  }

  /* Populate the summary pills + reset fields */
  function primeModal() {
    var docP = countPending(docRows);
    var wakilP = countPending(wakilRows);
    var docOk = docRows.length - docP;
    var wakilOk = wakilRows.length - wakilP;

    document.getElementById("dm-summary").innerHTML =
      '<span class="pill pill-success">' +
      docOk +
      "/" +
      docRows.length +
      " dokumen</span>" +
      '<span class="pill pill-success">' +
      wakilOk +
      "/" +
      wakilRows.length +
      " wakil</span>";

    commentEl.value = "";
    var grounds = document.getElementById("dm-grounds");
    if (grounds) grounds.value = "";

    var due = new Date();
    due.setDate(due.getDate() + 14);
    var dl = document.getElementById("dm-deadline");
    dl.value = due.toISOString().slice(0, 10);
    var min = new Date();
    min.setDate(min.getDate() + 1);
    dl.min = min.toISOString().slice(0, 10);
  }

  /* Open flow */
  function openDecision(type) {
    if (type === "advance") {
      rejectPicker.hidden = true;
      syncModalForType("advance");
    } else if (type === "reject") {
      rejectPicker.hidden = false;
      document.getElementById("dm-rt-info").checked = true;
      syncModalForType("info");
    }
    primeModal();
    modal.show();
  }

  /* Picker radio change: switch visible fields */
  document
    .querySelectorAll('input[name="dm-reject-type"]')
    .forEach(function (radio) {
      radio.addEventListener("change", function () {
        syncModalForType(radio.value);
      });
    });

  function renderResult(type, d) {
    var styleType = type === "advance" ? "approved" : type;
    resultEl.className = "decision-result is-" + styleType;
    resultEl.hidden = false;
    resultEl.innerHTML =
      '<h3></h3><dl class="def-grid"></dl><blockquote class="dr-comment" hidden></blockquote><p class="dr-next"></p>';
    resultEl.querySelector("h3").textContent = CFG[type].head;
    var grid = resultEl.querySelector("dl");
    function row(label, value) {
      if (!value) return;
      var wrap = document.createElement("div");
      var dt = document.createElement("dt");
      var dd = document.createElement("dd");
      dt.textContent = label;
      dd.textContent = value;
      wrap.appendChild(dt);
      wrap.appendChild(dd);
      grid.appendChild(wrap);
    }
    row("Tarikh keputusan", fmt(new Date()));
    row("Pegawai", "Nur binti Ahmad");

    if (type === "advance") {
      row("Peringkat selesai", "1 — Semakan dokumen sokongan");
      row("Peringkat seterusnya", "2 — Lesen Aktiviti");
    } else if (type === "rejected") {
      row("Asas penolakan", d.grounds);
      row("Tempoh rayuan", "30 hari kepada Menteri (s.48)");
    } else {
      row("Tarikh akhir maklum balas", d.deadline);
      row("Dokumen bermasalah", d.flagged);
    }

    var q = resultEl.querySelector(".dr-comment");
    if (d.comment) {
      q.hidden = false;
      q.textContent = d.comment;
    }

    resultEl.querySelector(".dr-next").textContent =
      type === "advance"
        ? "Permohonan akan dihantar ke peringkat Lesen Aktiviti untuk semakan lanjut."
        : type === "rejected"
          ? "Pemohon dimaklumkan dan boleh membuat rayuan dalam tempoh yang ditetapkan."
          : "Hanya item yang ditandakan perlu dikemas kini oleh pemohon.";
  }

  function finalize(type, d) {
    decided = true;
    renderResult(type, d);
    var c = CFG[type];
    var title = document.getElementById("decision-title");
    var sub = document.getElementById("decision-sub");

    if (type === "info") {
      actionBar.className = "decision-bar is-info";
      title.textContent = "Maklumat tambahan diminta";
      sub.textContent = "Menunggu maklum balas pemohon.";
      barActions.innerHTML =
        '<button type="button" class="btn btn-secondary btn-sm" id="resume-review">' +
        '<i class="bi bi-arrow-clockwise"></i>Sambung semakan</button>';
      document
        .getElementById("resume-review")
        .addEventListener("click", function () {
          decided = false;
          resultEl.hidden = true;
          actionBar.className = "decision-bar";
          barActions.innerHTML = baseActionsHTML;
          updateDecisionButtons();
        });
    } else if (type === "advance") {
      actionBar.className = "decision-bar is-approved";
      title.textContent = "Beralih ke peringkat Lesen Aktiviti";
      sub.textContent =
        "Semakan dokumen sokongan selesai. Permohonan dihantar ke peringkat seterusnya.";
      barActions.innerHTML =
        '<span class="pill pill-success" style="display:inline-flex;align-items:center;gap:0.3rem;font-size:0.75rem;font-weight:600;padding:0.35rem 0.75rem;border-radius:999px;">' +
        '<i class="bi ' +
        c.pill[2] +
        '"></i>' +
        c.pill[1] +
        "</span>";
      document.querySelectorAll(".rr-toggle button").forEach(function (b) {
        b.disabled = true;
      });
    } else {
      actionBar.className = "decision-bar is-" + type;
      title.textContent = c.head;
      sub.textContent = "Keputusan telah direkod.";
      barActions.innerHTML =
        '<span class="pill pill-danger" style="display:inline-flex;align-items:center;gap:0.3rem;font-size:0.75rem;font-weight:600;padding:0.35rem 0.75rem;border-radius:999px;">' +
        '<i class="bi ' +
        c.pill[2] +
        '"></i>Keputusan direkod</span>';
      document.querySelectorAll(".rr-toggle button").forEach(function (b) {
        b.disabled = true;
      });
    }
  }

  document.getElementById("dm-confirm").addEventListener("click", function () {
    errEl.hidden = true;
    var comment = commentEl.value.trim();

    if (current === "advance") {
      var docP = countPending(docRows);
      var wakilP = countPending(wakilRows);
      var clP = countPendingChecklist();
      if (docP > 0 || wakilP > 0 || clP > 0) {
        errEl.textContent =
          "Sila selesaikan semua item (dokumen, senarai semakan dan wakil) terlebih dahulu.";
        errEl.hidden = false;
        return;
      }
      var anyRejected =
        document.querySelectorAll('.review-row[data-state="rejected"]').length >
        0;
      if (anyRejected) {
        errEl.textContent =
          "Terdapat item yang ditolak. Sila gunakan butang Reject untuk menolak atau meminta maklumat.";
        errEl.hidden = false;
        return;
      }
      modal.hide();
      finalize("advance", { comment: comment });
    } else if (current === "rejected") {
      var grounds = document.getElementById("dm-grounds").value;
      if (!grounds) {
        errEl.textContent = "Sila pilih asas penolakan.";
        errEl.hidden = false;
        return;
      }
      if (comment.length < 10) {
        errEl.textContent =
          "Sila nyatakan alasan penolakan dengan lebih terperinci (sekurang-kurangnya 10 aksara).";
        errEl.hidden = false;
        return;
      }
      modal.hide();
      finalize("rejected", { comment: comment, grounds: grounds });
    } else if (current === "info") {
      var deadline = document.getElementById("dm-deadline").value;
      if (!deadline) {
        errEl.textContent = "Sila tetapkan tarikh akhir maklum balas.";
        errEl.hidden = false;
        return;
      }
      if (!comment) {
        errEl.textContent =
          "Sila nyatakan maklumat atau dokumen yang diperlukan.";
        errEl.hidden = false;
        return;
      }
      var flagged = document.querySelectorAll(
        '.review-row[data-state="rejected"] .rr-name',
      );
      var flaggedNames = Array.prototype.map
        .call(flagged, function (el) {
          return el.textContent;
        })
        .join(", ");
      modal.hide();
      finalize("info", {
        comment: comment,
        deadline: fmt(new Date(deadline)),
        flagged: flaggedNames || "Tiada item ditandakan ditolak",
      });
    }
  });

  actionBar.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-decision]");
    if (!btn || decided) return;
    var type = btn.getAttribute("data-decision");

    if (type === "advance") {
      // Phase 1: if anything is still pending, "Terima Semua" only bulk-approves.
      // Phase 2: once everything is done, the button reads
      // "Sahkan dan Lulus Sokongan" and opens the confirm modal.
      var docP = countPending(docRows);
      var wakilP = countPending(wakilRows);
      var clP = countPendingChecklist();
      if (docP > 0 || wakilP > 0 || clP > 0) {
        approveAll();
        return;
      }
    }

    openDecision(type);
  });
})();