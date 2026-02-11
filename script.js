// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const words = ["Hello", "नमस्ते", "হ্যাললো", "Welcome"];
let index = 0;
const textElement = document.getElementById("intro-text");

// 1. Intro Animation (Multi-language welcome)
function animateWords() {
    if (index < words.length) {
        textElement.textContent = words[index];
        let tl = gsap.timeline();

        tl.to("#intro-text", { y: 0, duration: 0.4, ease: "power3.out" })
            .to("#intro-text", {
                y: "-110%",
                duration: 0.4,
                delay: 0.6,
                ease: "power3.in",
                onComplete: () => {
                    index++;
                    gsap.set("#intro-text", { y: "110%" });
                    animateWords();
                }
            });
    } else {
        // Exit Overlay
        gsap.to("#intro-overlay", {
            y: "-100%",
            duration: 1.2,
            ease: "expo.inOut",
            onComplete: () => {
                document.getElementById("intro-overlay").style.display = "none";
                startMainAnimations();
            }
        });
    }
}

// 2. Main Page Content Animations
function startMainAnimations() {
    // Reveal Form Groups on Scroll
    gsap.from(".input-group", {
        scrollTrigger: {
            trigger: "#contact",
            start: "top 80%",
        },
        opacity: 0,
        y: 30,
        stagger: 0.2,
        duration: 0.8,
        ease: "power2.out"
    });

    // Continuous Button Pulse Glow
    gsap.to(".send-btn", {
        boxShadow: "0 0 20px rgba(255, 0, 85, 0.4)",
        repeat: -1,
        yoyo: true,
        duration: 1.5
    });
}

// 3. Form Submit Interaction (Rocket Launch & Custom Redirect)
document.getElementById('pro-contact-form').addEventListener('submit', function (e) {
    e.preventDefault(); // পেজকে ডিফল্টভাবে রিলোড হওয়া থেকে আটকাবে

    const form = e.target;
    const btn = document.getElementById('submit-btn');
    const text = document.getElementById('btn-text');
    const formData = new FormData(form);

    // Start Launch Animation
    btn.classList.add('launching');
    text.innerText = "Sending...";
    btn.style.pointerEvents = "none";

    // Web3Forms এ ডেটা পাঠানো শুরু
    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (response.ok) {
                // সফলভাবে মেসেজ গেলে আপনার নতুন পেজে পাঠিয়ে দেবে
                window.location.href = "thank-you.html";
            } else {
                // ভুল হলে মেসেজ দেখাবে
                alert("Something went wrong. Please try again!");
                btn.classList.remove('launching');
                text.innerText = "Send Message";
                btn.style.pointerEvents = "all";
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Check your internet connection!");
            btn.classList.remove('launching');
            text.innerText = "Send Message";
            btn.style.pointerEvents = "all";
        });
});

// Initialize on Load
window.addEventListener("load", animateWords);