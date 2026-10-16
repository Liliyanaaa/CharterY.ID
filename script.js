const $ = s => document.querySelector(s);
const toast = t => {
  const e = $('#toast');
  e.textContent = t;
  e.classList.add('on');
  setTimeout(() => e.classList.remove('on'), 1800);
};
function go(p) {
  document.querySelectorAll('.page').forEach(s => s.classList.toggle('on', s.id === 'page-' + p));
  document.querySelectorAll('.bottom button').forEach(b => b.classList.toggle('on', b.dataset.p === p));
  window.scrollTo(0, 0);
}
let me = { name: "Charter User", user: "charter.y", bio: "Bandung. Suka ngulik preset & video." };
function doLogin() {
  const u = $('#loginUser').value.trim();
  if (!u) { toast('Isi username dulu'); return }
  me.user = u.replace(/^@/, '');
  me.name = u;
  $('#avatar').src = `https://i.pravatar.cc/150?u=${me.user}`;
  saveEdit(true);
  go('profile');
  toast('Masuk sebagai @' + me.user);
}
function loginTikTok() {
  const u = prompt('Masukkan username TikTok kamu:', 'budi.tiktok');
  if (!u) return;
  me.user = u.replace(/^@/, '');
  me.name = u;
  $('#avatar').src = `https://i.pravatar.cc/150?u=${me.user}`;
  saveEdit(true);
  go('profile');
  toast('Connect TikTok @' + me.user + ' berhasil');
}
function handleCoverChange(e) {
  const f = e.target.files[0];
  if (!f) return;
  $('#coverImg').src = URL.createObjectURL(f);
  toast('Banner diganti');
}
function handleAvatarChange(e) {
  const f = e.target.files[0];
  if (!f) return;
  $('#avatar').src = URL.createObjectURL(f);
  toast('Foto profil diganti');
}
function openEdit() {
  $('#fName').value = me.name;
  $('#fUser').value = me.user;
  $('#fBio').value = me.bio;
  $('#editModal').classList.add('open');
}
function closeEdit() { $('#editModal').classList.remove('open'); }
function saveEdit(silent) {
  me.name = $('#fName').value.trim() || me.name;
  me.user = $('#fUser').value.trim().replace(/^@/, '') || me.user;
  me.bio = $('#fBio').value.trim();
  $('#pName').textContent = me.name;
  $('#pUser').textContent = '@' + me.user;
  $('#pBio').textContent = me.bio;
  closeEdit();
  if (!silent) toast('Profil disimpan');
}
const fixU = u => u && u.startsWith('/')? 'https://www.tikwm.com' + u : u;
async function fetchV() {
  const u = $('#link').value.trim(), err = $('#err');
  err.textContent = '';
  $('#res').classList.remove('on');
  if (!/tiktok\.com/i.test(u)) { err.textContent = 'Link salah. Pakai format tiktok.com/@user/video/...'; return }
  try {
    const r = await fetch('https://www.tikwm.com/api/?url=' + encodeURIComponent(u));
    const j = await r.json();
    if (j.code!== 0 ||!j.data) throw 0;
    const d = j.data;
    $('#rv').src = fixU(d.play);
    $('#rt').textContent = d.title || 'Tanpa judul';
    $('#rm').textContent = '@' + (d.author?.unique_id || '-');
    $('#dmp4').href = fixU(d.play);
    $('#dmp3').href = fixU(d.music);
    $('#res').classList.add('on');
  } catch (e) { err.textContent = 'Gagal ambil video' }
}
let searchType = 'all';
function setSearchType(t, btn) {
  searchType = t;
  document.querySelectorAll('.stabs button').forEach(b => b.classList.toggle('on', b === btn));
  doSearch();
}
async function doSearch() {
  const q = $('#searchInput').value.trim();
  const box = $('#searchResult');
  if (!q) { box.innerHTML = '<p class="empty">Ketik kata kunci dulu</p>'; return }
  box.innerHTML = '<p class="empty">Mencari...</p>';
  try {
    const r = await fetch('https://www.tikwm.com/api/feed/search?keywords=' + encodeURIComponent(q));
    const j = await r.json();
    if (j.code === 0 && j.data && j.data.videos && j.data.videos.length) {
      let vids = j.data.videos.slice(0, 12);
      box.innerHTML = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">' + vids.map(v => `<div onclick="window.open('${fixU(v.play || v.cover)}','_blank')" style="border-radius:14px;overflow:hidden;background:#000;cursor:pointer"><img src="${v.cover}" style="width:100%;height:190px;object-fit:cover;display:block"><div style="font-size:11px;background:#141414;color:#fff;padding:6px 8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${(v.title || 'Video').slice(0,40)}</div></div>`).join('') + '</div>';
      return;
    }
  } catch (e) {}
  box.innerHTML = '<p class="empty">Tidak ada hasil</p>';
}
document.addEventListener('DOMContentLoaded', () => {
  const si = $('#searchInput');
  if (si) si.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });
  $('#pName').textContent = me.name;
  $('#pUser').textContent = '@' + me.user;
  $('#pBio').textContent = me.bio;
});