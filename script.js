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
slider.oninput = function () {
    sliderValue.innerHTML = this.value;
}




// drag and drop rank de voces
const list = document.getElementById('rankList');
let dragItem = null;
list.addEventListener('dragstart', e => { dragItem = e.target; });
list.addEventListener('dragover', e => e.preventDefault());
list.addEventListener('drop', e => {
    e.preventDefault();
    if (e.target.tagName === 'LI' && dragItem !== e.target) {
        const items = [...list.children];
        const dragIndex = items.indexOf(dragItem);
        const dropIndex = items.indexOf(e.target);
        if (dragIndex < dropIndex) {
            list.insertBefore(dragItem, e.target.nextSibling);
        } else {
            list.insertBefore(dragItem, e.target);
        }
    }
});




// cambio de quotes
const quotes = [
    { text: "La vida es un sueño, y los sueños, sueños son.", author: "Calderón de la Barca" },
    { text: "El único modo de hacer un gran trabajo es amar lo que haces.", author: "Steve Jobs" },
    { text: "En el medio de la dificultad yace la oportunidad.", author: "Albert Einstein" },
    { text: "La imaginación es más importante que el conocimiento.", author: "Albert Einstein" },
    { text: "Haz de tu vida un sueño, y de tu sueño una realidad.", author: "Antoine de Saint-Exupéry" }
];

const quoteElement = document.getElementById('quote');
const authorElement = document.getElementById('autor');

let currentIndex = 0;

function updateQuote() {
    const { text, author } = quotes[currentIndex];
    quoteElement.textContent = `"${text}"`;
    authorElement.innerHTML = `<strong>${author}</strong>`;
    currentIndex = (currentIndex + 1) % quotes.length;
}

setInterval(updateQuote, 5000);