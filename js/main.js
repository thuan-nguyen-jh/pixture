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

    container.addEventListener('mouseup', () => {
        pressed = false;
        container.style.cursor = 'default';
    });
}