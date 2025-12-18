const space = document.getElementById('space');

function createStar(name, text, color, size, isPublic) {
    const space = document.getElementById('space');
    if (!space) return;

    const star = document.createElement('div');
    star.className = 'star';
    star.innerHTML = '✦'; 
    star.style.color = color;

    // แก้ไข: ให้เช็คคำว่า 'random' เพื่อสุ่มขนาดให้ดาวระบบ
    if (size === 'random' || size === '') {
        const randomSize = Math.floor(Math.random() * (48 - 16 + 1)) + 16;
        star.style.fontSize = randomSize + 'px';
    } else {
        star.style.fontSize = size;
    }

    star.style.left = (Math.random() * 90 + 5) + 'vw';
    const duration = Math.random() * 10 + 15;
    star.style.animationDuration = duration + 's';
    star.style.animationDirection = Math.random() > 0.5 ? 'normal' : 'reverse';

    if (isPublic === 'public') {
        star.style.cursor = 'pointer';
        star.onclick = () => openModal(name, text);
        
    }
    
    space.appendChild(star);
    
    // --- การลบดาวแบบค่อยๆ หายไป ---
    setTimeout(() => {
        star.classList.add('fade-out');
    }, (duration - 1.5) * 1000); 

    setTimeout(() => {
        if (star.parentNode) star.remove();
    }, duration * 1000);
}
function sendWish() {
    const nameInput = document.getElementById('userName');
    const textInput = document.getElementById('wishText');
    const colorInput = document.getElementById('starColor');
    const sizeInput = document.getElementById('starSize');
    const privacyInput = document.querySelector('input[name="privacy"]:checked');

    const text = textInput.value.trim();
    if (!text) {
        alert("กรุณาใส่คำอธิษฐานก่อนนะ ✨");
        return;
    }

    const name = nameInput.value.trim() || "ผู้ไม่ประสงค์ออกนาม";
    const color = colorInput.value;
    const selectedSize = sizeInput.value;
    const privacy = privacyInput ? privacyInput.value : "public";

    // --- ส่วนที่ส่งไป Firebase ---
    database.ref('wishes').push({
        name: name,
        text: text,
        color: color,
        size: selectedSize,
        privacy: privacy,
        timestamp: Date.now()
    }).then(() => {
        // ✅ 1. ล้างช่องกรอกข้อความเมื่อส่งสำเร็จ
        textInput.value = ""; 
    }).catch((err) => {
        console.error('Failed to send wish:', err);
    });
}
function openModal(name, text) {
    document.getElementById('wishModal').style.display = "block";
    document.getElementById('modalName').innerText = "คำอธิษฐานจาก: " + name;
    document.getElementById('modalText').innerText = text;
    document.getElementById('heartCount').innerText = "0";
    document.getElementById('supportList').innerHTML = "";
}

function closeModal() { document.getElementById('wishModal').style.display = "none"; }
function closeModalOutside(e) { if (e.target.id === "wishModal") closeModal(); }

function sendSupport() {
    const input = document.getElementById('supportInput');
    if (!input.value.trim()) return;
    const div = document.createElement('div');
    div.style = "background:rgba(255,255,255,0.05); padding:8px; margin-top:5px; border-radius:8px; font-size:13px;";
    div.innerHTML = `✨ ${input.value}`;
    document.getElementById('supportList').appendChild(div);
    input.value = "";
}

function giveHeart() {
    const count = document.getElementById('heartCount');
    count.innerText = parseInt(count.innerText) + 1;
}
// ฟังก์ชันสุ่มปล่อยดาวจากระบบทันทีที่โหลดหน้าเว็บ
window.onload = function() {
    const systemWishes = [
        ["ระบบ", "ขอให้เป็นวันที่สดใส", "#ffffff", "random", "public"],
        ["ระบบ", "ขอให้ทุกอย่างเป็นไปตามที่ต้องการ", "#ffffff", "random", "public"],
        ["ระบบ", "แค่นี้ก็เก่งมากแล้วนะ", "#ffffff", "random", "public"],
        ["ระบบ", "เราเชื่อในตัวแกนะ", "#ffffff", "random", "public"],
        ["ระบบ", "หวังว่าจะกลับมายิ้มได้ไวๆนะ", "#ffffff", "random", "public"],
        ["ระบบ", "รอยยิ้มแกสวยมากๆเลยนะ", "#ffffff", "random", "public"],
        ["ระบบ", "ทุกอย่างจะดีขึ้นได้ เชื่อในตัวเองไว้", "#ffffff", "random", "public"]
    ];

    // 1. ปล่อยดาวชุดแรกตอนโหลดหน้าเว็บ (ทยอยออก)
    systemWishes.forEach((wish, i) => {
        setTimeout(() => {
            // ส่งค่า "random" เข้าไปเพื่อให้ฟังก์ชัน createStar คำนวณขนาดสุ่มให้
            createStar(wish[0], wish[1], wish[2], wish[3], wish[4]);
        }, i * 2500); 
    });

    // 2. ตั้งเวลาสุ่มปล่อยดาวดวงใหม่เรื่อยๆ ตลอดเวลา
    setInterval(() => {
        const randomIndex = Math.floor(Math.random() * systemWishes.length);
        const wish = systemWishes[randomIndex];
        createStar(wish[0], wish[1], wish[2], "random", "public"); // บังคับสุ่มขนาดตรงนี้ด้วย
    }, 6000); 
};
function toggleMusic() {
    const music = document.getElementById('bg-music');
    const btn = document.getElementById('music-toggle');
    
    if (music.paused) {
        music.play();
        music.volume = 0.1; // ปรับความดัง 40% (กำลังดี ไม่ดังเกินไป)
        btn.innerText = "🔊 ปิดเพลง";
    } else {
        music.pause();
        btn.innerText = "🔈 เปิดเพลง";
    }
}
// ฟังก์ชันสำหรับสั่งเล่นเพลงอัตโนมัติเมื่อมีการขยับหน้าจอครั้งแรก
function enableAutoplay() {
    const music = document.getElementById('bg-music');
    
    // ตั้งค่าความดังเริ่มต้น (0.0 ถึง 1.0)
    music.volume = 0.1; 

    // สั่งเล่นเพลง
    music.play().then(() => {
        console.log("Autoplay started!");
        // เมื่อเพลงเล่นแล้ว ให้เปลี่ยนข้อความปุ่มเป็น "ปิดเพลง"
        const btn = document.getElementById('music-toggle');
        if (btn) btn.innerHTML = "🔊 ปิดเพลง";
    }).catch(error => {
        // ถ้าเบราว์เซอร์ยังบล็อกอยู่ (เช่น ยังไม่ได้คลิก) จะข้ามไปก่อน
        console.log("Waiting for user interaction to play music...");
    });
}

// ดักจับการคลิกครั้งแรกในหน้าเว็บ
document.addEventListener('click', () => {
    enableAutoplay();
}, { once: true }); // { once: true } คือให้ทำงานแค่ครั้งแรกครั้งเดียวพอ

// แถม: ดักจับการกดปุ่มส่งคำอธิษฐานด้วย เผื่อเขาไม่ได้คลิกที่ว่างแต่กดปุ่มเลย
document.addEventListener('keydown', () => {
    enableAutoplay();
}, { once: true });
// เมื่อมีใครก็ตามส่งคำอธิษฐานใหม่
database.ref('wishes').on('child_added', (snapshot) => {
    const data = snapshot.val();
    
    // ถ้าตั้งเป็นสาธารณะ ให้สร้างดาวลอยขึ้นมาบนหน้าจอของทุกคนที่เปิดเว็บอยู่
    if (data.privacy === 'public') {
        createStar(data.name, data.text, data.color, data.size, 'public');
    }
});
