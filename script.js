// البيانات الافتراضية
let tasks = JSON.parse(localStorage.getItem('ma7_tasks')) || [
  { text: 'صلاة الفجر في المسجد', done: false },
  { text: 'تمرين جيم 45 دقيقة', done: false },
  { text: 'قراءة 20 صفحة', done: false },
  { text: 'مذاكرة برمجة ساعة', done: false },
  { text: 'تعلم إنجليزي', done: false },
  { text: 'شرب 3 لتر مياه', done: false },
];

// مشاريع - ثابتة على المدى السنوي، مش بتتصفر ومش بتتمسح
let projects = JSON.parse(localStorage.getItem('ma7_projects')) || [
  { name: 'مشروع متجر إلكتروني', img: '', link: 'https://example.com' },
  { name: 'مشروع تطبيق مهام', img: '', link: '' }
];
projects = projects.map(p => typeof p === 'string' ? { name: p, img: '', link: '' } : { ...p, link: p.link || '' });
let tempProjectImg = '';

// شهادات - ثابتة على المدى السنوي، مش بتتصفر ومش بتتمسح
let certs = JSON.parse(localStorage.getItem('ma7_certs')) || [
  { name: 'شهادة برمجة', img: '' },
  { name: 'شهادة إنجليزي', img: '' }
];
certs = certs.map(c => typeof c === 'string' ? { name: c, img: '' } : c);
let tempCertImg = '';

let prayers = JSON.parse(localStorage.getItem('ma7_prayers')) || [
  { name: 'الفجر', done: false },
  { name: 'الظهر', done: false },
  { name: 'العصر', done: false },
  { name: 'المغرب', done: false },
  { name: 'العشاء', done: false },
];

function save() {
  localStorage.setItem('ma7_tasks', JSON.stringify(tasks));
  localStorage.setItem('ma7_projects', JSON.stringify(projects));
  localStorage.setItem('ma7_certs', JSON.stringify(certs));
  localStorage.setItem('ma7_prayers', JSON.stringify(prayers));
  localStorage.setItem('ma7_last_day', new Date().toDateString());
}

// ===== التصفير كل 24 ساعة - للمهام والصلاة بس =====
// المهام نفسها مش بتتمسح، الصح بس هو اللي بيتصفر
// المشاريع والشهادات مش بيتلمسوا خالص
function checkNewDay() {
  const today = new Date().toDateString();
  const lastDay = localStorage.getItem('ma7_last_day');
  if (lastDay && lastDay !== today) {
    tasks = tasks.map(t => ({ ...t, done: false }));
    prayers = prayers.map(p => ({ ...p, done: false }));
    save();
  }
  if (!lastDay) localStorage.setItem('ma7_last_day', today);
}
checkNewDay();

function renderTasks() {
  const list = document.getElementById('taskList');
  list.innerHTML = '';
  tasks.forEach((t, i) => {
    const li = document.createElement('li');
    if (t.done) li.classList.add('done');
    li.innerHTML = `<input type="checkbox" ${t.done ? 'checked' : ''}>
      <span>${t.text}</span>
      <button class="del">حذف</button>`;
    li.querySelector('input').onclick = () => { tasks[i].done = !tasks[i].done; save(); renderTasks(); };
    li.querySelector('.del').onclick = () => { tasks.splice(i, 1); save(); renderTasks(); };
    list.appendChild(li);
  });
}

function renderProjects() {
  const list = document.getElementById('projectList');
  list.innerHTML = '';
  projects.forEach((p, i) => {
    const div = document.createElement('div');
    div.className = 'project-card';
    div.innerHTML = `
      ${p.img ? `<img src="${p.img}">` : `<div class="no-img">💼</div>`}
      <p>${p.name}</p>
      ${p.link ? `<a class="project-link" href="${p.link}" target="_blank">🔗 افتح المشروع</a>` : `<span class="no-link">مفيش لينك</span>`}
      <button class="small-del">×</button>
    `;
    div.querySelector('.small-del').onclick = () => { projects.splice(i, 1); save(); renderAll(); };
    list.appendChild(div);
  });
}

function renderCerts() {
  const list = document.getElementById('certList');
  list.innerHTML = '';
  certs.forEach((c, i) => {
    const div = document.createElement('div');
    div.className = 'project-card';
    div.innerHTML = `
      ${c.img ? `<img src="${c.img}">` : `<div class="no-img">🎓</div>`}
      <p>${c.name}</p>
      <button class="small-del">×</button>
    `;
    div.querySelector('.small-del').onclick = () => { certs.splice(i, 1); save(); renderAll(); };
    list.appendChild(div);
  });
}

function renderPrayers() {
  const list = document.getElementById('prayerList');
  list.innerHTML = '';
  prayers.forEach((p, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${p.name}</span><div class="dot ${p.done ? 'on' : ''}"></div>`;
    li.querySelector('.dot').onclick = () => { prayers[i].done = !prayers[i].done; save(); renderPrayers(); };
    list.appendChild(li);
  });
}

function renderAll() {
  renderTasks();
  renderProjects();
  renderCerts();
  renderPrayers();
}

document.getElementById('addTaskBtn').onclick = addTask;
document.getElementById('taskInput').addEventListener('keydown', e => { if (e.key === 'Enter') addTask(); });

function addTask() {
  const inp = document.getElementById('taskInput');
  const v = inp.value.trim();
  if (!v) return;
  tasks.push({ text: v, done: false });
  inp.value = ''; save(); renderTasks();
}

document.getElementById('projectImageInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    tempProjectImg = reader.result;
    const prev = document.getElementById('projectPreview');
    prev.src = tempProjectImg;
    prev.style.display = 'block';
  };
  reader.readAsDataURL(file);
});

document.getElementById('addProjectBtn').onclick = () => {
  const nameInp = document.getElementById('projectNameInput');
  const linkInp = document.getElementById('projectLinkInput');
  const name = nameInp.value.trim();
  let link = linkInp.value.trim();
  if (!name) return alert('اكتب اسم المشروع الأول');
  if (link && !link.startsWith('http')) link = 'https://' + link;
  projects.push({ name: name, img: tempProjectImg, link: link });
  nameInp.value = '';
  linkInp.value = '';
  tempProjectImg = '';
  document.getElementById('projectPreview').style.display = 'none';
  document.getElementById('projectImageInput').value = '';
  save(); renderAll();
};

document.getElementById('certImageInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    tempCertImg = reader.result;
    const prev = document.getElementById('certPreview');
    prev.src = tempCertImg;
    prev.style.display = 'block';
  };
  reader.readAsDataURL(file);
});

document.getElementById('addCertBtn').onclick = () => {
  const nameInp = document.getElementById('certNameInput');
  const name = nameInp.value.trim();
  if (!name) return alert('اكتب اسم الشهادة الأول');
  certs.push({ name: name, img: tempCertImg });
  nameInp.value = '';
  tempCertImg = '';
  document.getElementById('certPreview').style.display = 'none';
  document.getElementById('certImageInput').value = '';
  save(); renderAll();
};

renderAll();