
/* ---------- prototype bar ---------- */
$('#hideProto').addEventListener('click', e => { const p = $('#proto'); p.classList.toggle('min'); e.currentTarget.textContent = p.classList.contains('min') ? '+' : '–'; });
