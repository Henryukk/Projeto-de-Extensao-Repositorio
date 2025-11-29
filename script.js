// Mock inicial: alguns posts de exemplo
const initialPosts = [
    {
        title: 'Modelo de Trabalho de Conclusão de Curso',
        url: 'https://examplo.edu.br/tcc-modelo.pdf',
        type: 'documento',
        desc: 'Guia e template para TCC em formato PDF.',
        tags: ['tcc', 'modelo']
    },
    {
        title: 'Lei de Proteção de Dados Pessoais (LGPD)',
        url: 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/L13709.htm',
        type: 'lei',
        desc: 'Texto consolidado da LGPD.',
        tags: ['lgpd', 'privacidade']
    },
    {
        title: 'Artigo: Tributação e Competitividade',
        url: 'https://revista.example.com/artigo-tributacao',
        type: 'link',
        desc: 'Artigo acadêmico sobre impactos tributários.',
        tags: ['tributario', 'artigo']
    }
];

const posts = [...initialPosts];

function renderPostCard(post) {
    const col = document.createElement('div');
    col.className = 'col-12';

    const card = document.createElement('div');
    card.className = 'card p-3 repo-card';

    // Header: badges + meta
    const meta = document.createElement('div');
    meta.className = 'd-flex justify-content-between align-items-start mb-2';

    const left = document.createElement('div');
    if (post.type === 'lei') {
        const b = document.createElement('span'); b.className = 'badge bg-success me-2'; b.textContent = 'LEI'; left.appendChild(b);
    } else if (post.type === 'documento') {
        const b = document.createElement('span'); b.className = 'badge bg-success me-2'; b.textContent = 'DOC'; left.appendChild(b);
    } else {
        const b = document.createElement('span'); b.className = 'badge bg-success border me-2'; b.textContent = 'LINK'; left.appendChild(b);
    }

    const small = document.createElement('small');
    small.className = 'text-muted';
    small.textContent = post.tags && post.tags.length ? post.tags.join(', ') : '';
    left.appendChild(small);

    meta.appendChild(left);

    const right = document.createElement('div');
    right.innerHTML = '<small class="text-muted">agora</small>';
    meta.appendChild(right);

    card.appendChild(meta);

    // Título acima do link (requisito)
    const titleEl = document.createElement('div');
    titleEl.className = 'post-title';
    titleEl.textContent = post.title || '(Sem título)';
    card.appendChild(titleEl);

    // Link e descrição
    const linkEl = document.createElement('a');
    linkEl.href = post.url;
    linkEl.target = '_blank';
    linkEl.rel = 'noopener noreferrer';
    linkEl.textContent = post.url;
    linkEl.className = 'd-block mb-2';
    card.appendChild(linkEl);

    if (post.desc) {
        const p = document.createElement('p');
        p.className = 'mb-0 text-muted small';
        p.textContent = post.desc;
        card.appendChild(p);
    }

    col.appendChild(card);
    return col;
}

function refreshList(filtered) {
    const list = document.getElementById('postsList');
    list.innerHTML = '';
    const data = filtered || posts;
    data.forEach(p => list.appendChild(renderPostCard(p)));
    document.getElementById('countBadge').textContent = data.length + ' itens';
}

// Inicial
document.addEventListener('DOMContentLoaded', function () {
    refreshList();

    // Form submit (cliente-only)
    const form = document.getElementById('postForm');
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        form.classList.add('was-validated');
        if (!form.checkValidity()) return;

        const newPost = {
            title: document.getElementById('postTitle').value.trim(),
            url: document.getElementById('postUrl').value.trim(),
            type: document.getElementById('postType').value,
            desc: document.getElementById('postDesc').value.trim(),
            tags: document.getElementById('postTags').value.split(',').map(t => t.trim()).filter(Boolean)
        };

        // Prepend
        posts.unshift(newPost);
        refreshList();

        // Reset
        form.reset(); form.classList.remove('was-validated');
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalAdd'));
        modal.hide();
    });

    // Pesquisa em tempo real
    document.getElementById('searchInput').addEventListener('input', function (e) {
        const q = e.target.value.toLowerCase();
        if (!q) { refreshList(); return; }
        const filtered = posts.filter(p => (p.title && p.title.toLowerCase().includes(q)) || (p.desc && p.desc.toLowerCase().includes(q)) || (p.tags && p.tags.join(' ').toLowerCase().includes(q)));
        refreshList(filtered);
    });

    // Filtros
    document.getElementById('applyFilters').addEventListener('click', function () {
        const type = document.getElementById('filterType').value;
        const tag = document.getElementById('filterTag').value.trim().toLowerCase();
        let filtered = posts.slice();
        if (type !== 'all') filtered = filtered.filter(p => p.type === type);
        if (tag) filtered = filtered.filter(p => p.tags && p.tags.join(' ').toLowerCase().includes(tag));
        refreshList(filtered);
    });
    document.getElementById('clearFilters').addEventListener('click', function () {
        document.getElementById('filterType').value = 'all'; document.getElementById('filterTag').value = ''; refreshList();
    });
});