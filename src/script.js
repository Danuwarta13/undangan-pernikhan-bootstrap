const navbar = document.getElementById("navbar");
const toggleUndangan = document.getElementById("toggle-undangan");

toggleUndangan.addEventListener("click", () => {
  if (navbar.classList.contains("hidden")) {
    navbar.classList.remove("hidden");
    navbar.classList.add("visible");
    toggleUndangan.classList.remove("visible");
    toggleUndangan.classList.add("hidden");
  }
});

// Toggle ATM
function toggleATM() {
  var atmSection = document.getElementById("atmContainer");

  if (atmSection.classList.contains("show")) {
    atmSection.style.maxHeight = "0"; // Tutup dengan transisi
    atmSection.style.opacity = "0";
    setTimeout(() => {
      atmSection.classList.remove("show");
    }, 500); // Hapus class setelah animasi selesai
  } else {
    atmSection.style.maxHeight = atmSection.scrollHeight + "px"; // Sesuaikan tinggi dengan konten
    atmSection.style.opacity = "1";
    atmSection.classList.add("show");
  }
}

// CopyText
function copyText() {
  let textElement = document.getElementById("rekening");

  // Buat elemen input untuk menampung teks
  let tempInput = document.createElement("input");
  tempInput.value = textElement.innerText;
  document.body.appendChild(tempInput);

  // Pilih teks dan salin
  tempInput.select();
  document.execCommand("copy");

  // Hapus elemen input sementara
  document.body.removeChild(tempInput);

  alert("Nomor rekening berhasil disalin nich : " + textElement.innerText);
}

// Submit Ucapan
document.getElementById("commentForm").addEventListener("submit", function (event) {
  event.preventDefault();

  let name = document.getElementById("name").value;
  let message = document.getElementById("message").value;
  let attendance = document.getElementById("attendance").value;
  let commentList = document.getElementById("commentList");

  let formData = new FormData();
  formData.append("name", name);
  formData.append("message", message);
  formData.append("attendance", attendance);

  fetch("submit.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // Buka komentar jika masih tersembunyi
        if (!commentList.classList.contains("show")) {
          commentList.style.display = "block";
          setTimeout(() => {
            commentList.classList.add("show");
          }, 10);
        }

        // Perbarui jumlah hadir dan tidak hadir
        document.getElementById("countHadir").textContent = data.countHadir;
        document.getElementById("countTidakHadir").textContent = data.countTidakHadir;

        // Ambil ulang semua komentar dari database
        fetch("get_comments.php")
          .then((response) => response.text())
          .then((data) => {
            commentList.innerHTML = data; // Ganti dengan data baru dari server
          });

        // Reset form setelah submit
        document.getElementById("commentForm").reset();
      }
    });
});

// Ucapan
document.getElementById("showCommentsBtn").addEventListener("click", function () {
  let commentList = document.getElementById("commentList");

  if (commentList.classList.contains("show")) {
    commentList.classList.remove("show");

    // Delay untuk menyembunyikan elemen setelah animasi selesai
    setTimeout(() => {
      commentList.style.display = "none";
    }, 400);
  } else {
    // Jika belum ada komentar, ambil dari server
    if (commentList.innerHTML.trim() === "") {
      fetch("get_comments.php")
        .then((response) => response.text())
        .then((data) => {
          commentList.innerHTML = `<div class="comment-container">${data}</div>`;
          commentList.style.display = "block";

          // Tambahkan animasi setelah sedikit delay
          setTimeout(() => {
            commentList.classList.add("show");
          }, 10);
        });
    } else {
      commentList.style.display = "block";

      // Tambahkan animasi setelah sedikit delay
      setTimeout(() => {
        commentList.classList.add("show");
      }, 10);
    }
  }
});
