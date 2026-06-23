document.addEventListener("DOMContentLoaded", () => {
    const splashScreen = document.getElementById('splash-screen');

    // Mengatur waktu tunggu di layar splash (3000 milidetik = 3 detik)
    const splashDuration = 3000; 

    setTimeout(() => {
        // 1. Tambahkan efek memudar (fade-out) terlebih dahulu
        splashScreen.classList.add('fade-out');

        // 2. Tunggu sampai efek memudar selesai (sekitar 800ms sesuai CSS), 
        // lalu pindah ke file home.html
        setTimeout(() => {
            window.location.href = "home.html"; // Pastikan nama file tujuan benar
        }, 800); 
        
    }, splashDuration);
});

    const hamburger = document.querySelector(".hamburger");
        const navMenu = document.querySelector(".nav-menu");
        const dropdown = document.querySelector(".dropdown");

        // Toggle Hamburger Menu
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
        });

        // Menutup menu jika salah satu link diklik (khusus mobile)
        document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
            // Jangan tutup jika yang diklik adalah dropdown
            if(!n.parentElement.classList.contains('dropdown')) {
                hamburger.classList.remove("active");
                navMenu.classList.remove("active");
            }
        }));

        // Toggle dropdown khusus untuk tampilan Mobile
        dropdown.addEventListener("click", (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault(); // Perbaikan: Mencegah halaman scroll ke atas otomatis saat diklik
                dropdown.classList.toggle("active");
            }
        });

        // --- Fitur Smooth Scrolling untuk semua link internal (yang berawalan #) ---
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                // Pastikan yang di-klik bukan sekedar dropdown menu yang href="#" (biar tidak bentrok)
                if (this.getAttribute('href') !== "#") {
                    e.preventDefault(); // Mencegah lompatan standar browser

                    const targetId = this.getAttribute('href');
                    const targetElement = document.querySelector(targetId);

                    if (targetElement) {
                        // Menghitung posisi elemen tujuan, dikurangi tinggi navbar agar tidak tertutup navbar fixed
                        const navbarHeight = document.querySelector('.navbar').offsetHeight;
                        const elementPosition = targetElement.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.scrollY - navbarHeight;

                        // Eksekusi scroll mulus
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: "smooth"
                        });
                    }
                }
            });
        });

        // Fungsi untuk memutar musik
        function putarRadio() {
            var audio = document.getElementById("radioStream");
            
            audio.play().then(() => {
                console.log("Streaming berhasil diputar!");
                hapusListener();
            }).catch(error => {
                console.log("Dibalik layar: Browser memblokir streaming, menunggu kamu gerak/klik...");
            });
        }

        function hapusListener() {
            document.removeEventListener('click', putarRadio);
            document.removeEventListener('keydown', putarRadio);
            document.removeEventListener('scroll', putarRadio);
            window.removeEventListener('touchstart', putarRadio);
        }

        // Memicu streaming aktif begitu user berinteraksi dengan halaman
        document.addEventListener('click', putarRadio);
        document.addEventListener('keydown', putarRadio);
        document.addEventListener('scroll', putarRadio);
        window.addEventListener('touchstart', putarRadio);

        // Coba putar langsung saat halaman kelar dimuat
        window.addEventListener('load', putarRadio);