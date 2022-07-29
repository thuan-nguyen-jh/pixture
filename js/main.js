function cloneCard(template) {
    const result = [];
    for (let card of template) {
        result.push(card.cloneNode(true));
    }
    return result;
}

const carousel = document.getElementsByClassName('carousel');
for (let item of carousel) {
    const container = item.querySelector('.carousel-container');
    const button = item.querySelector('.next-btn');
    const card = item.querySelector('.card');
    const cardWidth = card.offsetWidth + parseFloat(window.getComputedStyle(container).columnGap);

    let inContainer = false;
    let pressed = false;
    let startX;
    let x;

    const templateCards = cloneCard(container.children);
    let nextCards = cloneCard(templateCards);
    let currCards = Array.from(item.getElementsByClassName('card'));
    let prevCards = cloneCard(templateCards);
    let currentIndex = 0;
    container.scrollLeft = 0;

    container.prepend(...prevCards);
    container.scrollLeft += prevCards.length * cardWidth;
    container.append(...nextCards);

    function moveToIndex(index) {
        if (index !== currentIndex) {
            currentIndex = index;
        } else {
            return;
        }

        console.log('Current index: ', currentIndex);
        const scrollOption = { block: 'nearest', inline: 'start', behavior: 'smooth' };
        if (currentIndex >= currCards.length) {
            nextCards[currentIndex % currCards.length].scrollIntoView(scrollOption);
        } else if (currentIndex < 0) {
            prevCards[currCards.length + currentIndex % currCards.length].scrollIntoView(scrollOption);
        } else {
            currCards[currentIndex].scrollIntoView(scrollOption);
        }
    }

    function onEndDrag(e) {
        if (!pressed) {
            return;
        }

        pressed = false;
        container.style.cursor = 'auto';

        const distance = container.scrollLeft - x;
        const step = Math.ceil(Math.abs(distance) / cardWidth);

        let newIndex = currentIndex;
        if (distance > 0) {
            newIndex += step;
        } else if (distance < 0) {
            newIndex -= step;
        }
        moveToIndex(newIndex);
    }

    container.addEventListener('scroll', (e) => {
        if (pressed || !inContainer) {
            return;
        }

        const firstNextCard = nextCards[0];
        const lastPrevCard = prevCards[prevCards.length - 1];

        const firstNextCardPosRelativeLeftSide = firstNextCard.offsetLeft - container.scrollLeft;
        const lastPrevCardPosRelativeRightSide = (lastPrevCard.offsetLeft) - (container.scrollLeft + container.offsetWidth);

        let newIndex = currentIndex;
        if (firstNextCardPosRelativeLeftSide <= 0) {
            console.log('Move to next fragment');

            prevCards.forEach(card => {
                card.remove();
                container.scrollLeft -= cardWidth;
            });

            prevCards = currCards;
            currCards = nextCards;
            nextCards = cloneCard(templateCards);
            container.append(...nextCards);

            newIndex = currentIndex % currCards.length;
        } else if (lastPrevCardPosRelativeRightSide >= 0) {
            console.log('Move to prev fragment');

            nextCards.forEach(card => {
                card.remove();
                container.scrollLeft += cardWidth;
            });

            nextCards = currCards;
            currCards = prevCards;
            prevCards = cloneCard(templateCards);
            container.prepend(...prevCards);

            newIndex = currCards.length + currentIndex % currCards.length;
        }

        moveToIndex(newIndex);
    });

    button.addEventListener('click', () => {
        moveToIndex(currentIndex + 1);
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

    container.addEventListener('mouseup', onEndDrag);
    container.addEventListener('mouseleave', onEndDrag);

    item.addEventListener('mouseenter', () => inContainer = true);
    item.addEventListener('mouseleave', () => inContainer = false);
}

const toggleBtn = document.querySelector('body > header .toggle');
const navigation = document.querySelector('body > header nav');
toggleBtn.addEventListener('click', () => {
    navigation.classList.toggle('show');
    toggleBtn.classList.toggle('active');
});