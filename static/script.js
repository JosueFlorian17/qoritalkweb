const audios = [
    {
        id: 1,
        url: "audio1.wav",
        frase: "Hoy me gusta la vida mucho menos, pero siempre me gusta vivir.",
        autor: "César Vallejo"
    },
    {
        id: 2,
        url: "audio2.wav",
        frase: "La vida es un eco: lo que envías, regresa.",
        autor: "Proverbio chino"
    },
    {
        id: 3,
        url: "audio3.wav",
        frase: "No esperes. El tiempo nunca será justo.",
        autor: "Napoleon Hill"
    }
];


let currentRound = 0;
let responses = [];

function nextAudio() {
    const audioPlayer = document.getElementById("audio-player");
    const slider = document.getElementById("naturalness-slider");
    const radioOrigin = document.querySelector('input[name="voice"]:checked');
    const region = document.getElementById("departamento").value;
    const stars = document.querySelectorAll(".fa-star.checked-star");
    const qualities = [...document.querySelectorAll('input[name="qualities"]:checked')].map(q => q.value);

    // Guardar respuesta actual
    responses.push({
        audio_id: audios[currentRound].id,
        origin: radioOrigin ? radioOrigin.value : null,
        region: radioOrigin && radioOrigin.value === "Perú" ? region : null,
        qualities,
        human_confidence: parseInt(slider.value),
        stars: stars.length
    });

    currentRound++;

    if (currentRound < audios.length) {
        // Cargar siguiente audio y frase
        const next = audios[currentRound];
        audioPlayer.src = next.url;
        document.getElementById("quote").textContent = `"${next.frase}"`;
        document.getElementById("autor").innerHTML = `<strong>${next.autor}</strong>`;
        resetForm();
    } else {
        // Enviar respuestas
        fetch("/guardar_respuestas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(responses)
        })
        .then(res => res.json())
        .then(data => {
            window.location.href = "final.html";
        })
        .catch(err => {
            console.error("Error:", err);
            alert("Ocurrió un error al guardar tus respuestas.");
        });
    }
}

function toggleDepartamento(radio) {
    var container = document.getElementById('departamento-container');
    if (radio.value === "Perú" && radio.checked) {
        container.style.display = "block";
    } else {
        container.style.display = "none";
        document.getElementById('departamento').value = "";
    }
}

function resetForm() {
    document.getElementById("naturalness-slider").value = 5;
    document.getElementById("slider-value").textContent = 5;
    document.querySelectorAll(".fa-star").forEach(s => s.classList.remove("checked-star"));
    document.querySelectorAll('input[name="qualities"]').forEach(c => c.checked = false);
    document.querySelectorAll('input[name="voice"][value="Otro"]').checked = true;
    document.getElementById("departamento").value = "";
    document.getElementById("departamento-container").style.display = "block";
}


// funcionamiento de estrellas
function rateVoice(rating) {
    const stars = document.querySelectorAll('.stars-rating .fa-star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('checked-star');
        } else {
            star.classList.remove('checked-star');
        }
    });
}

const slider = document.getElementById("naturalness-slider");
const sliderValue = document.getElementById("slider-value");

function updateSliderText(value) {
    const iaPercent = value * 10;
    const humanPercent = 100 - iaPercent;
    sliderValue.innerHTML = `${iaPercent}% IA, ${humanPercent}% humano`;
}

slider.oninput = function () {
    updateSliderText(this.value);
};

// Inicializar el texto al cargar
updateSliderText(slider.value);


function toggleDepartamento(el) {
    const container = document.getElementById("departamento-container");
    container.style.display = el.value === "Perú" ? "block" : "none";
}

function rateVoice(rating) {
    const stars = document.querySelectorAll('.fa-star');
    stars.forEach((star, index) => {
        star.classList.toggle('checked-star', index < rating);
    });
}

document.getElementById("quote").textContent = `"${audios[0].frase}"`;
document.getElementById("autor").innerHTML = `<strong>${audios[0].autor}</strong>`;
