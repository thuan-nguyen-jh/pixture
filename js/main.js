const carousel = document.getElementsByClassName('carousel');
for (let item of carousel) {
    const container = item.querySelector('.carousel-container');
    const button = item.querySelector('.next-btn');
    const card = item.querySelector('.card');

    let pressed = false;
    let startX;
    let x;

    button.addEventListener('click', () => {
        if (container.scrollLeft >= container.offsetWidth) {
            container.scrollLeft = 0;
            return;
        }
        container.scrollLeft += card.offsetWidth;
        if (container.scrollLeft + card.offsetWidth >= container.offsetWidth) {
            container.scrollLeft = container.offsetWidth;
        }
    });

    container.addEventListener('mousedown', (e) => {
        e.preventDefault();
        pressed = true;
        startX = e.clientX;
        x = container.scrollLeft;
        container.style.cursor = 'grab';
    });

    container.addEventListener('mousemove', (e) => {
        if (pressed) {
            e.preventDefault();
            container.scrollLeft = x + startX - e.clientX;
        }
    });

    ['mouseup', 'mouseleave'].forEach(event => {
        container.addEventListener(event, () => {
            pressed = false;
            const distance = container.scrollLeft - x;
            const step = Math.ceil(Math.abs(distance) / card.offsetWidth);
            if (distance > 0) {
                container.scrollLeft = x + step * card.offsetWidth;
            } else if (distance < 0) {
                container.scrollLeft = x - step * card.offsetWidth;
            }
            container.style.cursor = 'default';
        });
    });
}

const toggleBtn = document.querySelector('body > header .toggle');
const navigation = document.querySelector('body > header nav');
toggleBtn.addEventListener('click', () => {
    navigation.classList.toggle('show');
    toggleBtn.classList.toggle('active');
});