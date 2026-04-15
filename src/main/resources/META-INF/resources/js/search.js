// ── 챔피언 데이터 ────────────────────────────────────────────────
const CHAMPIONS = [
    { name: '룰루', engName: 'Lulu', role: '서포터', lane: '바텀', img: 'images/Lulu.png', difficulty: '하' },
    { name: '아트록스', engName: 'Aatrox', role: '전사', lane: '탑', img: 'images/Aatrox.png', difficulty: '중' },
    { name: '아리', engName: 'Ahri', role: '마법사', lane: '미드', img: 'images/Ahri.png', difficulty: '중' },
    { name: '잭스', engName: 'Jax', role: '전사', lane: '탑', img: 'images/Jax.png', difficulty: '중' },
    { name: '애쉬', engName: 'Ashe', role: '원거리 딜러', lane: '바텀', img: 'images/Ashe.png', difficulty: '중' },
    { name: '유나라', engName: 'Yunara', role: '딜러', lane: '미드', img: 'images/Yunara.png', difficulty: '중' },
    { name: '멜', engName: 'Mel', role: '마법사', lane: '미드', img: 'images/Mel.png', difficulty: '중' },
    { name: '자헨', engName: 'Zaahen', role: '전사', lane: '정글', img: 'images/Zaahen.png', difficulty: '상' } ]

// ── 뉴스 데이터 ──────────────────────────────────────────────────
const NEWS = [
    { title: '새로운 챔피언 출시', desc: '2026 루나 레벨 이벤트! 신규 챔피언과 함께하는 특별한 시즌.', category: '게임업데이트' },
    { title: '패치노트 16.4', desc: '챔피언 밸런스 및 아이템 업데이트 내용을 확인하세요.', category: '패치노트' },
];

// ── 카테고리 전환 함수 (함수 밖으로 분리) ───────────────────────────
function switchCategory(type, el) {
    document.querySelectorAll('.search-category-item').forEach(i => i.classList.remove('active'));
    el.classList.add('active');
    
    const resChamp = document.getElementById('resultChampion');
    const resNews = document.getElementById('resultNews');
    
    if(resChamp) resChamp.style.display = type === 'champion' ? 'block' : 'none';
    if(resNews) resNews.style.display = type === 'news' ? 'block' : 'none';
}

// ── 검색 실행 함수 ───────────────────────────────────────────────
function performSearch(query) {
    const q = query.trim().toLowerCase();
    if (!q) return;

    const display = document.getElementById('searchKeywordDisplay');
    if(display) display.textContent = `"${query}"`;

    const champResults = CHAMPIONS.filter(c =>
        c.name.includes(q) ||
        c.engName.toLowerCase().includes(q) ||
        c.role.includes(q) ||
        c.lane.includes(q)
    );

    const newsResults = NEWS.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.desc.toLowerCase().includes(q) ||
        n.category.toLowerCase().includes(q)
    );

    const cCount = document.getElementById('champCount');
    const nCount = document.getElementById('newsCount');
    if(cCount) cCount.textContent = `(${champResults.length})`;
    if(nCount) nCount.textContent = `(${newsResults.length})`;

    const champList = document.getElementById('championResultList');
    if (champList) {
        if (champResults.length === 0) {
            champList.innerHTML = `<div class="no-result"><h4>검색결과 없음</h4><p>"${query}"에 해당하는 챔피언이 없습니다.</p></div>`;
        } else {
            champList.innerHTML = champResults.map(c => `
                <div class="search-result-card d-flex align-items-center p-0 overflow-hidden" style="border:1px solid #ddd; margin-bottom:10px; background:#fff;">
                    <img src="${c.img}" alt="${c.name}" style="width:100px; height:100px; object-fit:cover;">
                    <div class="p-3">
                        <div style="font-weight:700; font-size:1rem; color:#111;">${c.name} (${c.engName})</div>
                        <div style="color:#555; font-size:0.9rem;">역할: ${c.role} | 라인: ${c.lane} | 난이도: ${c.difficulty}</div>
                    </div>
                </div>
            `).join('');
        }
    }

    // 화면 전환
    const hero = document.querySelector('.hero');
    if(hero) hero.classList.add('d-none');
    
    document.querySelectorAll('section:not(#searchResults)').forEach(s => s.classList.add('d-none'));
    
    const searchResults = document.getElementById('searchResults');
    if(searchResults) {
        searchResults.classList.remove('d-none');
        searchResults.style.display = 'block';
    }

    // 기본 카테고리 설정
    const firstCat = document.querySelector('.search-category-item');
    if(firstCat) switchCategory('champion', firstCat);
}

// ── 폼 이벤트 리스너 (DOMContentLoaded로 감싸기) ───────────────────
document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('searchForm');
    if(searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = document.getElementById('searchInput').value;
            performSearch(query);
        });
    }
});